import hashlib
from backend.database import get_db_connection

def compute_file_hash(file_bytes: bytes) -> str:
    """Computes SHA-256 hash for Level 1 duplicate detection."""
    sha256_hash = hashlib.sha256()
    sha256_hash.update(file_bytes)
    return sha256_hash.hexdigest()

def check_duplicate_hash(file_hash: str) -> bool:
    """Checks if exact file hash already exists in SQLite."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT invoice_id FROM document_hashes WHERE sha256_hash = ?", (file_hash,))
    row = cursor.fetchone()
    conn.close()
    return row is not None

def check_duplicate_identity(supplier: str, invoice_number: str) -> bool:
    """
    Level 2 Duplicate Detection: Checks if the exact same supplier 
    and invoice number combination already exists in the database.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id FROM invoices WHERE LOWER(supplier) = LOWER(?) AND LOWER(invoice_id) = LOWER(?)",
        (supplier.strip(), invoice_number.strip())
    )
    row = cursor.fetchone()
    conn.close()
    return row is not None

def log_audit_event(invoice_id: str, event_type: str, details: str):
    """Logs verification and review milestones to the SQLite audit trail."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO audit_trail (invoice_id, event_type, details) VALUES (?, ?, ?)",
        (invoice_id, event_type, details)
    )
    conn.commit()
    conn.close()

def verify_transaction(extracted_invoice: dict, extracted_po: dict, extracted_receipt: dict) -> dict:
    """
    Performs cross-document matching and risk calculation.
    """
    discrepancies = []
    risk_score = 0
    
    # 1. Supplier Name Check
    inv_supplier = extracted_invoice.get("supplier", "").strip().lower()
    po_supplier = extracted_po.get("supplier", "").strip().lower()
    if inv_supplier and po_supplier and inv_supplier != po_supplier:
        discrepancies.append(f"Supplier mismatch: Invoice supplier ({extracted_invoice.get('supplier')}) does not match PO supplier ({extracted_po.get('supplier')}).")
        risk_score += 40

    # 2. Price / Amount Check
    inv_amount = extracted_invoice.get("total_amount", 0)
    po_amount = extracted_po.get("total_amount", inv_amount)
    
    if abs(inv_amount - po_amount) > 1.0:
        discrepancies.append(f"Invoice total amount (₹{inv_amount}) does not match Purchase Order amount (₹{po_amount}).")
        risk_score += 50

    # 3. Quantity Check
    quantity_check = "PASS"
    if extracted_receipt.get("quantity", 100) != extracted_po.get("quantity", 100):
        quantity_check = "FAIL"
        discrepancies.append("Delivery quantity does not match Purchase Order quantity.")
        risk_score += 30

    # Determine risk level
    if risk_score >= 50:
        risk_level = "HIGH"
    elif risk_score > 0:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "verifications": {
            "supplier_check": "FAIL" if inv_supplier != po_supplier and po_supplier else "PASS",
            "price_check": "FAIL" if abs(inv_amount - po_amount) > 1.0 else "PASS",
            "quantity_check": quantity_check,
            "duplicate_check": "PASS"
        },
        "discrepancies": discrepancies,
        "risk_score": risk_score,
        "risk_level": risk_level
    }