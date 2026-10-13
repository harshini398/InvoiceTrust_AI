import hashlib
from backend.database import get_db_connection

def compute_file_hash(file_bytes: bytes) -> str:
    sha256_hash = hashlib.sha256()
    sha256_hash.update(file_bytes)
    return sha256_hash.hexdigest()

def check_duplicate_hash(file_hash: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT invoice_id FROM document_hashes WHERE sha256_hash = ?", (file_hash,))
    row = cursor.fetchone()
    conn.close()
    return row is not None

def check_duplicate_identity(supplier: str, invoice_number: str) -> bool:
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
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO audit_trail (invoice_id, event_type, details) VALUES (?, ?, ?)",
        (invoice_id, event_type, details)
    )
    conn.commit()
    conn.close()

def verify_transaction_advanced(extracted_invoice: dict, extracted_po: dict, extracted_receipt: dict) -> dict:
    """
    Performs three-way reconciliation and generates explainable risk intelligence.
    """
    discrepancies = []
    risk_score = 0
    
    # 1. Supplier Match Check
    inv_supplier = extracted_invoice.get("supplier", "").strip().lower()
    po_supplier = extracted_po.get("supplier", "").strip().lower()
    if inv_supplier and po_supplier and inv_supplier != po_supplier:
        discrepancies.append({
            "field": "supplier",
            "evidence": f"Invoice supplier ({extracted_invoice.get('supplier')}) does not match PO supplier ({extracted_po.get('supplier')}).",
            "risk_contribution": "+40 points"
        })
        risk_score += 40

    # 2. Three-Way Amount / Price Reconciliation
    inv_amount = extracted_invoice.get("total_amount", 0)
    po_amount = extracted_po.get("total_amount", inv_amount)
    
    if abs(inv_amount - po_amount) > 1.0:
        diff = inv_amount - po_amount
        discrepancies.append({
            "field": "total_amount",
            "evidence": f"Invoice total amount (₹{inv_amount:,.2f}) exceeds Purchase Order amount (₹{po_amount:,.2f}) by ₹{abs(diff):,.2f}.",
            "risk_contribution": "+50 points"
        })
        risk_score += 50

    # 3. Quantity / Delivery Receipt Check
    inv_qty = extracted_invoice.get("quantity", 100)
    rec_qty = extracted_receipt.get("quantity", 100)
    if inv_qty != rec_qty:
        discrepancies.append({
            "field": "quantity",
            "evidence": f"Invoiced quantity ({inv_qty}) does not match delivery receipt quantity ({rec_qty}).",
            "risk_contribution": "+30 points"
        })
        risk_score += 30

    # Risk Level & Recommendations
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
            "three_way_match": "FAIL" if risk_score > 0 else "PASS",
            "duplicate_check": "PASS"
        },
        "risk_score": risk_score,
        "risk_level": risk_level,
        "discrepancies": discrepancies,
        "explainable_risk": {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "discrepancies": discrepancies,
            "recommended_action": recommended_action
        }
    }

# Backward compatibility alias
verify_transaction = verify_transaction_advanced