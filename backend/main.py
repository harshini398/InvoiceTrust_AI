from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from backend.services.extraction import process_document
from backend.services.verification import (
    compute_file_hash,
    check_duplicate_hash,
    check_duplicate_identity,
    verify_transaction,
    log_audit_event
)
from backend.database import save_invoice, save_document_hash

app = FastAPI(title="Invoice Trust AI API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VerifyResponse(BaseModel):
    invoice_id: str
    document_hashes: Dict[str, str]
    extraction: Dict[str, Any]
    verifications: Dict[str, str]
    discrepancies: List[str]
    risk_score: int
    risk_level: str

@app.get("/")
def read_root():
    return {"message": "Invoice Trust AI API is running"}

@app.post("/invoices/verify", response_model=VerifyResponse)
async def verify_invoice(
    invoice: UploadFile = File(...),
    po: Optional[UploadFile] = File(None),
    delivery: Optional[UploadFile] = File(None)
):
    # 1. Read invoice file and compute hash
    invoice_bytes = await invoice.read()
    inv_hash = compute_file_hash(invoice_bytes)

    # 2. Extract structured data
    invoice_data = process_document(invoice_bytes)
    inv_id = invoice_data.get("invoice_number")
    if not inv_id or inv_id == "UNKNOWN":
        inv_id = f"DOC-{inv_hash[:8].upper()}"
    supplier = invoice_data.get("supplier", "UNKNOWN")

    # 3. Check for duplicates (Level 1: exact hash, Level 2: supplier + invoice_id)
    is_duplicate_hash = check_duplicate_hash(inv_hash)
    is_duplicate_identity = check_duplicate_identity(supplier, inv_id)

    is_duplicate = False
    duplicate_reason = None
    if is_duplicate_hash:
        is_duplicate = True
        duplicate_reason = f"Duplicate document detected: Exact file hash already exists in database."
    elif is_duplicate_identity and inv_id != "UNKNOWN":
        is_duplicate = True
        duplicate_reason = f"Duplicate invoice detected: Invoice '{inv_id}' from supplier '{supplier}' has already been processed."

    # 4. Optional Purchase Order extraction
    po_data = None
    po_hash = "not_provided"
    if po is not None and hasattr(po, "read") and getattr(po, "filename", None):
        po_bytes = await po.read()
        if po_bytes:
            po_hash = compute_file_hash(po_bytes)
            po_data = process_document(po_bytes)
            save_document_hash(inv_id, "purchase_order", po_hash)

    # 5. Optional Delivery Receipt extraction
    delivery_data = None
    delivery_hash = "not_provided"
    if delivery is not None and hasattr(delivery, "read") and getattr(delivery, "filename", None):
        delivery_bytes = await delivery.read()
        if delivery_bytes:
            delivery_hash = compute_file_hash(delivery_bytes)
            delivery_data = process_document(delivery_bytes)
            save_document_hash(inv_id, "delivery_receipt", delivery_hash)

    # 6. Run verification logic
    verification_result = verify_transaction(
        extracted_invoice=invoice_data,
        extracted_po=po_data,
        extracted_receipt=delivery_data,
        is_duplicate=is_duplicate,
        duplicate_reason=duplicate_reason
    )

    # 7. Persist to SQLite
    save_document_hash(inv_id, "invoice", inv_hash)
    status = "REJECTED" if verification_result["risk_level"] == "HIGH" else "VERIFIED"
    save_invoice(
        invoice_id=inv_id,
        supplier=supplier,
        total_amount=invoice_data.get("total_amount", 0.0),
        risk_score=verification_result["risk_score"],
        risk_level=verification_result["risk_level"],
        status=status
    )
    log_audit_event(
        invoice_id=inv_id,
        event_type="VERIFICATION_COMPLETED",
        details=f"Risk: {verification_result['risk_level']} ({verification_result['risk_score']}), Status: {status}"
    )

    return {
        "invoice_id": inv_id,
        "document_hashes": {
            "invoice": inv_hash,
            "po": po_hash,
            "delivery_receipt": delivery_hash
        },
        "extraction": invoice_data,
        "verifications": verification_result["verifications"],
        "discrepancies": verification_result["discrepancies"],
        "risk_score": verification_result["risk_score"],
        "risk_level": verification_result["risk_level"]
    }

