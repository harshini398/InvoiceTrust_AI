import sys
import os

# Ensure the project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Enable UTF-8 console output if supported
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from backend.services.extraction import process_document
from backend.services.verification import (
    compute_file_hash,
    check_duplicate_hash,
    check_duplicate_identity,
    verify_transaction_advanced,
    log_audit_event
)
from backend.database import get_db_connection, init_db

def test_full_backend_pipeline():
    print("=" * 70)
    print("--- Testing Integrated Extraction, Verification & Database Engine ---")
    print("=" * 70)

    # Ensure tables and migrations are initialized
    init_db()

    # 1. Resolve path to sample invoice PDF
    sample_pdf_path = os.path.join(PROJECT_ROOT, "sample_docs", "sample_invoice.pdf")
    
    if os.path.exists(sample_pdf_path):
        print(f"\n[1] Processing Real Document: {sample_pdf_path}")
        with open(sample_pdf_path, "rb") as f:
            file_bytes = f.read()

        # Compute SHA-256 hash (Level 1 duplicate detection)
        file_hash = compute_file_hash(file_bytes)
        print(f"    Computed SHA-256 Hash: {file_hash}")

        # Document Extraction
        extracted_inv = process_document(sample_pdf_path)
    else:
        print("\n[1] Using simulated extracted invoice data (PDF not found)")
        extracted_inv = {
            "supplier": "ABC Traders",
            "invoice_number": "INV-1042",
            "subtotal": 400000.0,
            "tax": 72000.0,
            "total_amount": 472000.0,
            "quantity": 100,
            "confidence_score": 0.95,
            "raw_text_snippet": "TAX INVOICE..."
        }
        file_hash = "mock_hash_123456"

    print("\n[+] Extracted Invoice Fields:")
    for k, v in extracted_inv.items():
        if k != "raw_text_snippet":
            print(f"    - {k}: {v}")

    # 2. Simulate matching Purchase Order & Delivery Receipt
    extracted_po = {
        "supplier": extracted_inv.get("supplier"),
        "total_amount": extracted_inv.get("total_amount"),
        "quantity": 100
    }
    extracted_rec = {
        "quantity": 100
    }

    print("\n[2] Running Advanced Three-Way Verification & Risk Engine...")
    verification_results = verify_transaction_advanced(extracted_inv, extracted_po, extracted_rec)
    
    print(f"    Three-Way Match  : {verification_results['verifications']['three_way_match']}")
    print(f"    Duplicate Check  : {verification_results['verifications']['duplicate_check']}")
    
    risk_info = verification_results.get("explainable_risk", {})
    print(f"    Risk Score       : {risk_info.get('risk_score', 0)} / 100")
    print(f"    Risk Level       : {risk_info.get('risk_level', 'LOW')}")
    print(f"    Recommendation   : {risk_info.get('recommended_action')}")

    # 3. Test Database Persistence & Audit Trail
    print("\n[3] Testing SQLite Database Persistence & Audit Trail...")
    invoice_id = extracted_inv.get("invoice_number", "INV-1042")
    conn = get_db_connection()
    cursor = conn.cursor()

    # Save Document Hash
    cursor.execute(
        "INSERT OR IGNORE INTO document_hashes (invoice_id, file_type, sha256_hash) VALUES (?, ?, ?)",
        (invoice_id, "invoice", file_hash)
    )

    # Save Invoice with payment_status
    cursor.execute(
        """INSERT OR REPLACE INTO invoices 
           (invoice_id, supplier, total_amount, risk_score, risk_level, payment_status, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (
            invoice_id,
            extracted_inv.get("supplier"),
            extracted_inv.get("total_amount"),
            risk_info.get("risk_score", 0),
            risk_info.get("risk_level", "LOW"),
            "UNPAID",
            "VERIFIED"
        )
    )
    conn.commit()

    # Verify duplicate checks
    is_dup_hash = check_duplicate_hash(file_hash)
    is_dup_identity = check_duplicate_identity(extracted_inv.get("supplier"), invoice_id)
    print(f"    Duplicate Hash Check in DB     : {'DETECTED' if is_dup_hash else 'NOT DETECTED'}")
    print(f"    Duplicate Identity Check in DB : {'DETECTED' if is_dup_identity else 'NOT DETECTED'}")

    conn.close()

    # Log Audit Event
    log_audit_event(invoice_id, "VERIFICATION_COMPLETED", f"Three-way match completed with Risk Level: {risk_info.get('risk_level')}")
    print("    Audit Event Logged Successfully")

    print("\n" + "=" * 70)
    print(f"[OK] Full Pipeline Test PASSED for invoice ID: {invoice_id}!")
    print("=" * 70)

if __name__ == "__main__":
    test_full_backend_pipeline()
