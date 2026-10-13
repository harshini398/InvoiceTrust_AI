import os
import sys
import json
import sqlite3
import uuid
import urllib.request
import urllib.error

# Ensure workspace root is in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# Set UTF-8 output encoding on Windows if supported
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
    verify_transaction
)
from backend.database import get_db_connection

API_URL = "http://localhost:8000"

def http_get(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))

def http_post_files(url, files):
    boundary = f"----FormBoundary{uuid.uuid4().hex}"
    body = bytearray()
    for field_name, (filename, file_bytes, content_type) in files.items():
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"\r\n'.encode("utf-8"))
        body.extend(f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"))
        body.extend(file_bytes)
        body.extend(b"\r\n")
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(url, data=bytes(body), method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def run_tests():
    print("=" * 80)
    print("           INVOICETRUST AI - FULL COMPREHENSIVE TEST SUITE           ")
    print("=" * 80)

    total_tests = 0
    passed_tests = 0

    def assert_test(condition: bool, name: str, details: str = ""):
        nonlocal total_tests, passed_tests
        total_tests += 1
        if condition:
            passed_tests += 1
            print(f"  [PASS] {name}")
            if details:
                print(f"         └─ {details}")
        else:
            print(f"  [FAIL] {name}")
            if details:
                print(f"         └─ ERROR: {details}")

    # =========================================================================
    # STEP 1: TEST DOCUMENT EXTRACTION ON ALL SAMPLE PDFS
    # =========================================================================
    print("\n[STEP 1] Testing Document Extraction Engine on Sample PDFs...")
    docs_dir = os.path.join(BASE_DIR, "sample_docs")

    # 1.1 Clean Invoice
    clean_inv_path = os.path.join(docs_dir, "clean_invoice.pdf")
    ext_clean_inv = process_document(clean_inv_path)
    assert_test(
        ext_clean_inv["invoice_number"] == "INV-1042" and "ABC Traders" in ext_clean_inv["supplier"],
        "Extraction: Clean Invoice metadata",
        f"Invoice: {ext_clean_inv['invoice_number']}, Supplier: {ext_clean_inv['supplier']}, Amount: {ext_clean_inv['total_amount']}"
    )
    assert_test(
        ext_clean_inv["total_amount"] == 472000.0,
        "Extraction: Clean Invoice total amount",
        f"Extracted Amount: {ext_clean_inv['total_amount']} (expected 472000.0)"
    )

    # 1.2 Clean PO
    clean_po_path = os.path.join(docs_dir, "clean_po.pdf")
    ext_clean_po = process_document(clean_po_path)
    assert_test(
        ext_clean_po["po_number"] == "PO-8801" and "ABC Traders" in ext_clean_po["supplier"],
        "Extraction: Clean Purchase Order metadata",
        f"PO: {ext_clean_po['po_number']}, Supplier: {ext_clean_po['supplier']}, Amount: {ext_clean_po['total_amount']}"
    )

    # 1.3 Altered Invoice
    alt_inv_path = os.path.join(docs_dir, "altered_invoice.pdf")
    ext_alt_inv = process_document(alt_inv_path)
    assert_test(
        ext_alt_inv["invoice_number"] == "INV-1043" and ext_alt_inv["total_amount"] == 649000.0,
        "Extraction: Altered Invoice metadata & inflated amount",
        f"Invoice: {ext_alt_inv['invoice_number']}, Inflated Amount: {ext_alt_inv['total_amount']}"
    )

    # =========================================================================
    # STEP 2: TEST VERIFICATION & FRAUD ENGINE IN-MEMORY
    # =========================================================================
    print("\n[STEP 2] Testing Verification, Matching & Fraud Calculation Logic...")

    # 2.1 Match Clean Invoice against Clean PO
    match_result = verify_transaction(
        extracted_invoice=ext_clean_inv,
        extracted_po=ext_clean_po,
        extracted_receipt={"quantity": 100}
    )
    assert_test(
        match_result["verifications"]["supplier_check"] == "PASS" and
        match_result["verifications"]["price_check"] == "PASS" and
        match_result["risk_score"] == 0,
        "Verification: Perfect 2-Way Match",
        f"Risk Score: {match_result['risk_score']}, Discrepancies: {len(match_result['discrepancies'])}"
    )

    # 2.2 Altered Invoice against Clean PO (Price Discrepancy)
    mismatch_result = verify_transaction(
        extracted_invoice=ext_alt_inv,
        extracted_po=ext_clean_po
    )
    assert_test(
        mismatch_result["verifications"]["price_check"] == "FAIL" and
        mismatch_result["risk_score"] >= 50 and
        mismatch_result["risk_level"] == "HIGH",
        "Verification: Detect Price Inflation Discrepancy",
        f"Risk Score: {mismatch_result['risk_score']}, Discrepancy: {mismatch_result['discrepancies'][0]}"
    )

    # =========================================================================
    # STEP 3: RESET DB FOR ISOLATED API INTEGRATION TESTS
    # =========================================================================
    print("\n[STEP 3] Preparing Fresh Database State...")
    conn = get_db_connection()
    conn.execute("DELETE FROM invoices")
    conn.execute("DELETE FROM document_hashes")
    conn.execute("DELETE FROM audit_trail")
    conn.commit()
    conn.close()
    assert_test(True, "Database tables reset for clean live API tests")

    # =========================================================================
    # STEP 4: TEST LIVE FASTAPI ENDPOINTS VIA HTTP
    # =========================================================================
    print(f"\n[STEP 4] Testing Live FastAPI Endpoints at {API_URL}...")

    # 4.1 Health Check GET /
    try:
        status, root_data = http_get(f"{API_URL}/")
        assert_test(
            status == 200 and root_data.get("message") == "Invoice Trust AI API is running",
            "HTTP GET / health check endpoint",
            f"Status: {status}, Body: {root_data}"
        )
    except Exception as e:
        assert_test(False, "HTTP GET / health check endpoint", str(e))

    # 4.2 Scenario A: Upload Clean Invoice + Clean PO (Valid 2-Way Match)
    print("\n  --> Scenario A: Clean Invoice + Approved PO")
    with open(clean_inv_path, "rb") as f_inv, open(clean_po_path, "rb") as f_po:
        files = {
            "invoice": ("clean_invoice.pdf", f_inv.read(), "application/pdf"),
            "po": ("clean_po.pdf", f_po.read(), "application/pdf")
        }
        status_a, data_a = http_post_files(f"{API_URL}/invoices/verify", files)
        assert_test(
            status_a == 200,
            "HTTP POST /invoices/verify (Scenario A: Clean match HTTP status 200)",
            f"Status: {status_a}"
        )
        assert_test(
            data_a["invoice_id"] == "INV-1042" and
            data_a["verifications"]["supplier_check"] == "PASS" and
            data_a["verifications"]["price_check"] == "PASS" and
            data_a["risk_score"] == 0 and
            data_a["risk_level"] == "LOW",
            "Scenario A Verification Results: Zero Risk, All Checks PASS",
            f"Risk: {data_a['risk_level']} ({data_a['risk_score']}), Verifications: {data_a['verifications']}"
        )

    # 4.3 Scenario B: Duplicate Submission Detection (Fraud Level 1/2)
    print("\n  --> Scenario B: Resubmitting the Same Invoice (Duplicate Fraud Test)")
    with open(clean_inv_path, "rb") as f_inv:
        files = {"invoice": ("clean_invoice.pdf", f_inv.read(), "application/pdf")}
        status_b, data_b = http_post_files(f"{API_URL}/invoices/verify", files)
        assert_test(
            data_b["verifications"]["duplicate_check"] == "FAIL" and
            data_b["risk_score"] == 100 and
            data_b["risk_level"] == "HIGH",
            "Scenario B: Duplicate Document Detected & Flagged HIGH RISK",
            f"Duplicate Check: {data_b['verifications']['duplicate_check']}, Discrepancies: {data_b['discrepancies']}"
        )

    # 4.4 Scenario C: Upload Altered Invoice + Clean PO (Price Inflation Fraud)
    print("\n  --> Scenario C: Submitting Altered Invoice (Unit Price Inflated)")
    with open(alt_inv_path, "rb") as f_inv, open(clean_po_path, "rb") as f_po:
        files = {
            "invoice": ("altered_invoice.pdf", f_inv.read(), "application/pdf"),
            "po": ("clean_po.pdf", f_po.read(), "application/pdf")
        }
        status_c, data_c = http_post_files(f"{API_URL}/invoices/verify", files)
        assert_test(
            data_c["verifications"]["price_check"] == "FAIL" and
            data_c["risk_score"] >= 50 and
            data_c["risk_level"] == "HIGH",
            "Scenario C: Price Discrepancy Caught & Flagged HIGH RISK",
            f"Price Check: {data_c['verifications']['price_check']}, Discrepancy: {data_c['discrepancies']}"
        )

    # =========================================================================
    # STEP 5: VERIFY DATABASE PERSISTENCE & AUDIT TRAIL
    # =========================================================================
    print("\n[STEP 5] Verifying SQLite Persistence and Audit Logs...")
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM invoices")
    inv_count = cursor.fetchone()[0]
    assert_test(inv_count >= 2, f"Database: Invoices persisted (found {inv_count} rows)")

    cursor.execute("SELECT COUNT(*) FROM document_hashes")
    hash_count = cursor.fetchone()[0]
    assert_test(hash_count >= 3, f"Database: SHA-256 hashes recorded (found {hash_count} hashes)")

    cursor.execute("SELECT COUNT(*) FROM audit_trail")
    audit_count = cursor.fetchone()[0]
    assert_test(audit_count >= 3, f"Database: Audit trail records generated (found {audit_count} events)")

    cursor.execute("SELECT invoice_id, supplier, total_amount, risk_score, risk_level, status FROM invoices")
    rows = cursor.fetchall()
    print("\n  Current Database Invoices Table:")
    for r in rows:
        print(f"    - ID: {r['invoice_id']}, Supplier: {r['supplier']}, Total: ₹{r['total_amount']:,.2f}, Risk: {r['risk_level']} ({r['risk_score']}), Status: {r['status']}")

    conn.close()

    # =========================================================================
    # SUMMARY
    # =========================================================================
    print("\n" + "=" * 80)
    print(f"TEST RUN COMPLETED: {passed_tests}/{total_tests} Tests Passed ({(passed_tests/total_tests)*100:.1f}%)")
    print("=" * 80)

    return passed_tests == total_tests

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)

