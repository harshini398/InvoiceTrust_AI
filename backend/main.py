from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from backend.services.extraction import process_document
from backend.services.verification import (
    compute_file_hash, 
    check_duplicate_hash, 
    check_duplicate_identity, 
    verify_transaction_advanced, 
    log_audit_event
)
from backend.database import get_db_connection

app = FastAPI(title="InvoiceTrust AI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/invoices/verify")
async def verify_invoice_endpoint(
    invoice: UploadFile = File(...),
    po: UploadFile = File(...),
    delivery_receipt: UploadFile = File(...)
):
    """
    Main verification endpoint implementing three-way reconciliation, 
    duplicate checks, tamper-evident hashes, and explainable risk intelligence.
    """
    try:
        inv_path = os.path.join(TEMP_DIR, invoice.filename)
        po_path = os.path.join(TEMP_DIR, po.filename)
        rec_path = os.path.join(TEMP_DIR, delivery_receipt.filename)

        with open(inv_path, "wb") as buffer:
            shutil.copyfileobj(invoice.file, buffer)
        with open(po_path, "wb") as buffer:
            shutil.copyfileobj(po.file, buffer)
        with open(rec_path, "wb") as buffer:
            shutil.copyfileobj(delivery_receipt.file, buffer)

        # 1. Compute Cryptographic Hashes (Tamper-Evident History & Level 1 Duplicate)
        with open(inv_path, "rb") as f:
            inv_bytes = f.read()
        with open(po_path, "rb") as f:
            po_bytes = f.read()
        with open(rec_path, "rb") as f:
            rec_bytes = f.read()

        inv_hash = compute_file_hash(inv_bytes)
        po_hash = compute_file_hash(po_bytes)
        rec_hash = compute_file_hash(rec_bytes)

        is_hash_duplicate = check_duplicate_hash(inv_hash)

        # 2. Extract Document Fields
        extracted_inv = process_document(inv_path)
        extracted_po = process_document(po_path)
        extracted_rec = process_document(rec_path)

        # Level 2 Duplicate Identity Check
        is_identity_duplicate = check_duplicate_identity(
            extracted_inv.get("supplier"), 
            extracted_inv.get("invoice_number")
        )
        is_duplicate = is_hash_duplicate or is_identity_duplicate

        # 3. Three-Way Reconciliation & Explainable Risk Intelligence
        verification_results = verify_transaction_advanced(extracted_inv, extracted_po, extracted_rec)
        
        if is_duplicate:
            verification_results["verifications"]["duplicate_check"] = "FAIL"
            verification_results["explainable_risk"]["discrepancies"].append({
                "field": "duplicate_detection",
                "evidence": "Duplicate submission detected via SHA-256 hash match or invoice identity match.",
                "risk_contribution": "+40 points"
            })
            verification_results["explainable_risk"]["risk_score"] += 40
            verification_results["explainable_risk"]["risk_level"] = "HIGH"
            verification_results["explainable_risk"]["recommended_action"] = "Reject duplicate financing request to prevent double-funding."

        # 4. Persist Record to SQLite & Log Audit Event
        invoice_id = extracted_inv.get("invoice_number", "INV-1042")
        risk_score = verification_results["explainable_risk"]["risk_score"]
        risk_level = verification_results["explainable_risk"]["risk_level"]

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT OR IGNORE INTO invoices (invoice_id, supplier, total_amount, risk_score, risk_level, status) 
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (invoice_id, extracted_inv.get("supplier"), extracted_inv.get("total_amount"), risk_score, risk_level, "PENDING_REVIEW")
        )
        cursor.execute(
            "INSERT OR IGNORE INTO document_hashes (invoice_id, file_type, sha256_hash) VALUES (?, ?, ?)",
            (invoice_id, "invoice", inv_hash)
        )
        conn.commit()
        conn.close()

        log_audit_event(invoice_id, "VERIFICATION_RUN", f"Verified invoice with risk score {risk_score} and risk level {risk_level}")

        # Clean up temporary uploads
        os.remove(inv_path)
        os.remove(po_path)
        os.remove(rec_path)

        # Return structured response aligned with the UI contract
        return {
            "invoice_id": invoice_id,
            "document_hashes": {
                "invoice": inv_hash,
                "po": po_hash,
                "delivery_receipt": rec_hash
            },
            "extraction": extracted_inv,
            "verifications": verification_results["verifications"],
            "explainable_risk": verification_results["explainable_risk"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/invoices")
def get_all_invoices():
    """Retrieve previous verification records for the overview dashboard."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM invoices ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]