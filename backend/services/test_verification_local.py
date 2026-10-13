import sys
from pathlib import Path

# Ensure UTF-8 output encoding for Windows terminal (for ₹ and emojis)
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add project root directory to sys.path so imports work from any working directory
project_root = Path(__file__).resolve().parents[2]
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from backend.services.verification import verify_transaction, compute_file_hash, log_audit_event

def run_tests():
    print("--- Running Local Verification Tests ---")

    # 1. Test File Hashing
    sample_bytes = b"Invoice PDF binary content simulation"
    file_hash = compute_file_hash(sample_bytes)
    print(f"SHA-256 Hash Generated: {file_hash}")
    assert len(file_hash) == 64, "Hash should be 64 characters long!"

    # 2. Test Transaction Verification (Matching Case)
    extracted_inv_clean = {
        "supplier": "ABC Traders",
        "invoice_number": "INV-1042",
        "total_amount": 472000.0
    }
    extracted_po_clean = {
        "supplier": "ABC Traders",
        "total_amount": 472000.0,
        "quantity": 100
    }
    extracted_rec_clean = {
        "quantity": 100
    }

    result_clean = verify_transaction(extracted_inv_clean, extracted_po_clean, extracted_rec_clean)
    print("\nClean Invoice Test Result:", result_clean)
    assert result_clean["risk_level"] == "LOW", "Clean invoice should result in LOW risk!"

    # 3. Test Transaction Verification (Mismatch / High Risk Case)
    extracted_inv_bad = {
        "supplier": "XYZ Corp", # Mismatch supplier
        "invoice_number": "INV-1042",
        "total_amount": 800000.0 # Mismatch amount
    }
    
    result_bad = verify_transaction(extracted_inv_bad, extracted_po_clean, extracted_rec_clean)
    print("\nMismatched Invoice Test Result:", result_bad)
    assert result_bad["risk_level"] == "HIGH", "Mismatched invoice should result in HIGH risk!"
    assert len(result_bad["discrepancies"]) > 0, "Should detect discrepancies!"

    # 4. Test Audit Logging
    log_audit_event("INV-1042", "TEST_EVENT", "Local test run executed successfully.")
    print("\nAudit event logged successfully to SQLite database.")

    print("\n✅ All local verification tests passed successfully!")

if __name__ == "__main__":
    run_tests()