import os
import re
import io
from typing import Union
try:
    import pymupdf as fitz
except ImportError:
    import fitz  # PyMuPDF fallback
import pdfplumber
try:
    import pytesseract
    from PIL import Image

    def _configure_tesseract():
        common_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
        ]
        for path in common_paths:
            if os.path.exists(path):
                pytesseract.pytesseract.tesseract_cmd = path
                break
    _configure_tesseract()
except ImportError:
    pytesseract = None
    Image = None


def extract_text_from_pdf(source: Union[str, bytes]) -> str:
    """
    Extracts text from a PDF given a file path or raw bytes.
    1. Tries PyMuPDF (fitz) text extraction first for high speed and accuracy.
    2. Tries pdfplumber as secondary extractor if text length is minimal.
    3. If text is still minimal/empty (< 20 chars, e.g. scanned document),
       falls back to Tesseract OCR if available.
    """
    text = ""

    # 1. Try PyMuPDF native vector text extraction
    try:
        if isinstance(source, bytes):
            doc = fitz.open(stream=source, filetype="pdf")
        else:
            if not os.path.exists(source):
                raise FileNotFoundError(f"PDF file not found at: {source}")
            doc = fitz.open(source)
            
        with doc:
            for page in doc:
                page_text = page.get_text() or ""
                text += page_text + "\n"
    except Exception as e:
        print(f"[extraction] PyMuPDF extraction warning: {e}")

    # 2. Try pdfplumber if text is empty or minimal
    if len(text.strip()) < 20:
        try:
            pdf_stream = io.BytesIO(source) if isinstance(source, bytes) else source
            with pdfplumber.open(pdf_stream) as pdf:
                plumber_text = ""
                for page in pdf.pages:
                    p_text = page.extract_text() or ""
                    plumber_text += p_text + "\n"
                if len(plumber_text.strip()) > len(text.strip()):
                    text = plumber_text
        except Exception as e:
            print(f"[extraction] pdfplumber extraction warning: {e}")

    # 3. Fallback to Tesseract OCR for scanned/raster PDFs
    if len(text.strip()) < 20 and pytesseract is not None and Image is not None:
        print("[extraction] Low text yield detected (< 20 chars). Attempting OCR fallback...")
        ocr_text = ""
        try:
            if isinstance(source, bytes):
                doc = fitz.open(stream=source, filetype="pdf")
            else:
                doc = fitz.open(source)
            with doc:
                for page in doc:
                    pix = page.get_pixmap(dpi=300)
                    img = Image.open(io.BytesIO(pix.tobytes("png")))
                    ocr_text += pytesseract.image_to_string(img) + "\n"
            if ocr_text.strip():
                text = ocr_text
        except Exception as e:
            print(f"[extraction] OCR fallback warning: {e}")

    return text.strip()


def normalize_fields(raw_text: str) -> dict:
    """
    Parses raw text using deterministic regex and heuristics to extract structured fields:
    - invoice_number
    - supplier
    - total_amount
    - invoice_date
    - po_number
    - confidence_score
    - raw_text_snippet
    """
    if not raw_text:
        return {
            "supplier": "UNKNOWN",
            "invoice_number": "UNKNOWN",
            "total_amount": 0.0,
            "invoice_date": "UNKNOWN",
            "po_number": "UNKNOWN",
            "confidence_score": 0.40,
            "raw_text_snippet": ""
        }

    # 1. Invoice Number Patterns
    invoice_patterns = [
        r"\b(?:Invoice\s*(?:Number|Num|No|ID|#)|Bill\s*(?:Number|Num|No|#)|Tax\s*Invoice\s*(?:Number|Num|No|#)|\bINV\b)\s*[:#\-\.]*\s*(?:\r?\n\s*)?([A-Za-z0-9\-_/]+)",
        r"(?:INV[-_\s]*#?)\s*([0-9]{3,}[A-Za-z0-9\-_/]*)"
    ]
    invoice_number = "UNKNOWN"
    for pattern in invoice_patterns:
        match = re.search(pattern, raw_text, re.IGNORECASE)
        if match:
            candidate = match.group(1).strip()
            if candidate.lower() not in ["date", "due", "total", "amount", "tax", "of", "to"]:
                invoice_number = candidate
                break

    # 2. Supplier / Vendor Patterns
    supplier_patterns = [
        r"(?:Supplier\s*Name|Supplier|Vendor\s*Name|Vendor|Billed\s*By|Sold\s*By|From)\s*[:\-]?\s*(?:\r?\n\s*)?([A-Za-z0-9\s.,&'-]+?)(?=\r?\n|,|GST|Tax|Phone|Email|Date|$)",
        r"(?:Company\s*Name)\s*[:\-]?\s*(?:\r?\n\s*)?([A-Za-z0-9\s.,&'-]+?)(?=\r?\n|$)"
    ]
    supplier = "UNKNOWN"
    for pattern in supplier_patterns:
        match = re.search(pattern, raw_text, re.IGNORECASE)
        if match:
            candidate = match.group(1).strip()
            if candidate and len(candidate) > 2 and candidate.lower() not in ["invoice", "po", "tax"]:
                supplier = candidate
                break

    # Fallback for supplier: check top non-empty header lines
    if supplier == "UNKNOWN":
        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        for line in lines[:5]:
            if not re.search(r"(invoice|tax|receipt|bill|date|total|page|purchase\s*order|delivery)", line, re.IGNORECASE) and len(line) > 3:
                supplier = line
                break

    # 3. Total Amount Patterns
    total_patterns = [
        r"(?:Grand\s*Total|Total\s*Amount|Approved\s*Total|Amount\s*Due|Net\s*Payable|Invoice\s*Total|Total)\s*[:\-]?\s*(?:USD|INR|EUR|GBP|Rs\.?|[₹$€£])?\s*([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{2})?|[0-9]+(?:\.[0-9]{2})?)",
        r"(?:Balance\s*Due)\s*[:\-]?\s*(?:USD|INR|EUR|GBP|Rs\.?|[₹$€£])?\s*([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{2})?|[0-9]+(?:\.[0-9]{2})?)"
    ]
    total_amount = 0.0
    for pattern in total_patterns:
        matches = list(re.finditer(pattern, raw_text, re.IGNORECASE))
        if matches:
            match = matches[-1]
            raw_val = match.group(1).replace(",", "").strip()
            try:
                val = float(raw_val)
                if val > 0:
                    total_amount = val
                    break
            except ValueError:
                continue

    # 4. Invoice Date Patterns
    date_patterns = [
        r"(?:Invoice\s*Date|Bill\s*Date|Date\s*of\s*Issue|Received\s*Date|PO\s*Date|Date)\s*[:\-]?\s*(?:\r?\n\s*)?([0-9]{1,4}[-/.][0-9]{1,2}[-/.][0-9]{1,4})",
        r"(?:Invoice\s*Date|Date)\s*[:\-]?\s*(?:\r?\n\s*)?([A-Za-z]{3,9}\s+[0-9]{1,2},?\s+[0-9]{4})"
    ]
    invoice_date = "UNKNOWN"
    for pattern in date_patterns:
        match = re.search(pattern, raw_text, re.IGNORECASE)
        if match:
            invoice_date = match.group(1).strip()
            break

    # 5. Purchase Order (PO) Number Pattern
    po_match = re.search(
        r"(?:Purchase\s*Order\s*(?:Ref|Number|Num|No|#)|P\.?O\.?\s*(?:Number|Num|No|#|Ref)?|Purchase\s*Order\s*[:\-])\s*[:#\-\.]*\s*(?:\r?\n\s*)?([A-Za-z0-9\-_/]+)",
        raw_text,
        re.IGNORECASE
    )
    po_number = po_match.group(1).strip() if po_match else "UNKNOWN"

    # 6. Confidence Score
    score = 0.0
    if invoice_number != "UNKNOWN":
        score += 0.35
    if total_amount > 0.0:
        score += 0.35
    if supplier != "UNKNOWN":
        score += 0.20
    if invoice_date != "UNKNOWN":
        score += 0.10

    confidence_score = round(min(score, 1.0), 2) if score > 0 else 0.40

    return {
        "supplier": supplier,
        "invoice_number": invoice_number,
        "total_amount": total_amount,
        "invoice_date": invoice_date,
        "po_number": po_number,
        "confidence_score": confidence_score,
        "raw_text_snippet": raw_text[:300]
    }


def process_document(source: Union[str, bytes]) -> dict:
    """
    Main function called by backend/main.py.
    Extracts text from the PDF file or bytes and normalizes it into a structured dictionary.
    """
    raw_text = extract_text_from_pdf(source)
    structured_data = normalize_fields(raw_text)
    return structured_data


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        test_pdf = sys.argv[1]
        if not os.path.exists(test_pdf):
            print(f"[ERROR] PDF file not found: '{test_pdf}'")
            print("Please verify the file path and try again.")
            sys.exit(1)
        print(f"Processing document: {test_pdf}")
        result = process_document(test_pdf)
        print("\nExtracted Structured Data:")
        for k, v in result.items():
            print(f"  {k}: {v}")
    else:
        sample_raw = """
Acme Supplies Corp
123 Business Way, Industrial Estate
GSTIN: 27AABCA1234F1Z5

TAX INVOICE
Invoice Number: INV-2026-9842
Invoice Date: 12/10/2026
PO Number: PO-88712

Bill To: Horizon Retailers Ltd

Description            Qty    Unit Price    Amount
Industrial Valves       10       $150.00   $1,500.00
Shipping                                      $50.00
---------------------------------------------------
Grand Total:                               $1,550.00
"""
        print("Running self-test with sample invoice text...")
        norm = normalize_fields(sample_raw)
        print("\nNormalized Output:")
        for k, v in norm.items():
            print(f"  {k}: {v}")
