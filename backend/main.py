from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List

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
    po: UploadFile = File(None),
    delivery: UploadFile = File(None)
):
    # Temporary stub response for frontend binding
    return {
        "invoice_id": "INV-1042",
        "document_hashes": {
            "invoice": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "po": "pending",
            "delivery_receipt": "pending"
        },
        "extraction": {
            "supplier": "ABC Traders",
            "invoice_number": "INV-1042",
            "total_amount": 472000,
            "confidence_score": 0.95
        },
        "verifications": {
            "price_check": "FAIL",
            "quantity_check": "PASS",
            "duplicate_check": "PASS"
        },
        "discrepancies": [
            "Invoice unit price (₹8,000) exceeds PO unit price (₹5,000) by ₹3,000."
        ],
        "risk_score": 75,
        "risk_level": "HIGH"
    }

