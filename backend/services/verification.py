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

def verify_transaction(
    extracted_invoice: dict,
    extracted_po: dict = None,
    extracted_receipt: dict = None,
    is_duplicate: bool = False,
    duplicate_reason: str = None
) -> dict:
    """
    Performs cross-document matching and risk calculation.
    Supports optional PO and delivery receipts.
    """
    discrepancies = []
    risk_score = 0
    extracted_po = extracted_po or {}
    extracted_receipt = extracted_receipt or {}

    # 1. Duplicate Check
    duplicate_check = "FAIL" if is_duplicate else "PASS"
    if is_duplicate and duplicate_reason:
        discrepancies.append(duplicate_reason)
        risk_score += 100

    # 2. Supplier Name Check (if PO provided)
    inv_supplier = extracted_invoice.get("supplier", "").strip().lower()
    po_supplier = extracted_po.get("supplier", "").strip().lower()
    if po_supplier:
        if inv_supplier and inv_supplier != po_supplier:
            discrepancies.append(
                f"Supplier mismatch: Invoice supplier ({extracted_invoice.get('supplier')}) does not match PO supplier ({extracted_po.get('supplier')})."
            )
            risk_score += 40
            supplier_check = "FAIL"
        else:
            supplier_check = "PASS"
    else:
        supplier_check = "NOT_PROVIDED"

    # 3. Price / Amount Check (if PO provided)
    inv_amount = extracted_invoice.get("total_amount", 0.0)
    if "total_amount" in extracted_po and extracted_po.get("total_amount", 0.0) > 0:
        po_amount = extracted_po.get("total_amount", 0.0)
        if abs(inv_amount - po_amount) > 1.0:
            diff = inv_amount - po_amount
            discrepancies.append(
                f"Invoice total amount (₹{inv_amount:,.2f}) does not match Purchase Order amount (₹{po_amount:,.2f}) by ₹{abs(diff):,.2f}."
            )
            risk_score += 50
            price_check = "FAIL"
        else:
            price_check = "PASS"
    else:
        price_check = "NOT_PROVIDED"

    # 4. Quantity Check (if delivery receipt and PO provided)
    if "quantity" in extracted_receipt and "quantity" in extracted_po:
        rec_qty = extracted_receipt.get("quantity")
        po_qty = extracted_po.get("quantity")
        if rec_qty != po_qty:
            quantity_check = "FAIL"
            discrepancies.append(f"Delivery quantity ({rec_qty}) does not match Purchase Order quantity ({po_qty}).")
            risk_score += 30
        else:
            quantity_check = "PASS"
    else:
        quantity_check = "NOT_PROVIDED"

    # Clamp risk score
    risk_score = min(risk_score, 100)

    # Determine risk level
    if risk_score >= 50:
        risk_level = "HIGH"
        recommended_action = "Request approved price amendment or vendor clarification before financing."
    elif risk_score > 0:
        risk_level = "MEDIUM"
        recommended_action = "Inspect minor discrepancy details before proceeding with disbursement."
    else:
        risk_level = "LOW"
        recommended_action = "Proceed with financing. All 3-way checks passed successfully."

    return {
        "verifications": {
            "supplier_check": supplier_check,
            "price_check": price_check,
            "quantity_check": quantity_check,
            "duplicate_check": duplicate_check,
            "three_way_match": "FAIL" if risk_score > 0 else "PASS"
        },
        "discrepancies": discrepancies,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "explainable_risk": {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "discrepancies": discrepancies,
            "recommended_action": recommended_action
        }
    }

# Advanced alias for full backward compatibility
verify_transaction_advanced = verify_transaction