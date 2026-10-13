// Strict adherence to agreed JSON Contract & SQLite Database Schema
export const initialContractData = {
  invoice_id: "INV-1042",
  document_hashes: {
    invoice: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    po: "a8f3b20491cb8f9d01249fae563bc7890123456789abcdef0123456789abcdef",
    delivery_receipt: "5f4dcc3b5aa765d61d8327deb882cf992b9699aabbccddeeff00112233445566"
  },
  extraction: {
    supplier: "ABC Traders",
    invoice_number: "INV-1042",
    total_amount: 472000,
    confidence_score: 0.95
  },
  verifications: {
    price_check: "FAIL",
    quantity_check: "PASS",
    duplicate_check: "PASS"
  },
  discrepancies: [
    "Invoice unit price (₹8,000) exceeds PO unit price (₹5,000) by ₹3,000."
  ],
  risk_score: 75,
  risk_level: "HIGH"
};

// Existing database records mapped to invoices table schema
export const initialQueueItems = [
  {
    id: 1,
    invoice_id: "INV-1042",
    supplier: "ABC Traders",
    total_amount: 472000,
    amount: "₹4,72,000",
    risk_score: 75,
    risk_level: "HIGH",
    payment_status: "UNPAID",
    status: "PENDING_REVIEW",
    created_at: "2026-10-13 10:14:02",
    date: "2026-10-13 10:14 AM",
    discrepancy: "Invoice unit price (₹8,000) exceeds PO unit price (₹5,000) by ₹3,000.",
    reviewDecision: null,
    reviewReason: "",
    document_hashes: initialContractData.document_hashes,
    verifications: initialContractData.verifications
  },
  {
    id: 2,
    invoice_id: "INV-1039",
    supplier: "Apex Logistics Ltd",
    total_amount: 124500,
    amount: "₹1,24,500",
    risk_score: 82,
    risk_level: "HIGH",
    payment_status: "HELD",
    status: "PENDING_REVIEW",
    created_at: "2026-10-12 16:30:15",
    date: "2026-10-12 04:30 PM",
    discrepancy: "Duplicate invoice hash detected across previous billing cycle.",
    reviewDecision: null,
    reviewReason: "",
    document_hashes: {
      invoice: "4c5f9024bc6810a95e26b14981a8b9e67c824c153702a014a51e60cbdfd5e532",
      po: "6b3a24e93081b95f26b14981a8b9e67c824c153702a014a51e60cbdfd5e510",
      delivery_receipt: "9f82d1c93a40b15e26b14981a8b9e67c824c153702a014a51e60cbdfd5e577"
    },
    verifications: {
      price_check: "PASS",
      quantity_check: "PASS",
      duplicate_check: "FAIL"
    }
  },
  {
    id: 3,
    invoice_id: "INV-1035",
    supplier: "Zeta Tech Solutions",
    total_amount: 89000,
    amount: "₹89,000",
    risk_score: 42,
    risk_level: "MEDIUM",
    payment_status: "UNPAID",
    status: "PENDING_REVIEW",
    created_at: "2026-10-12 14:15:30",
    date: "2026-10-12 02:15 PM",
    discrepancy: "Delivery receipt quantity (10 units) is lower than billed quantity (12 units).",
    reviewDecision: null,
    reviewReason: "",
    document_hashes: {
      invoice: "7a2b91834e5f67a890bc12def34567890abcdef1234567890abcdef123456789",
      po: "8b3c02945f6a78b901cd23ef45678901bcdef2345678901bcdef2345678901bc",
      delivery_receipt: "9c4d13056a7b89c012de34fa56789012cdef3456789012cdef3456789012cd"
    },
    verifications: {
      price_check: "PASS",
      quantity_check: "FAIL",
      duplicate_check: "PASS"
    }
  },
  {
    id: 4,
    invoice_id: "INV-1028",
    supplier: "Delta Industrial Supplies",
    total_amount: 315400,
    amount: "₹3,15,400",
    risk_score: 12,
    risk_level: "LOW",
    payment_status: "PAID",
    status: "APPROVED",
    created_at: "2026-10-11 11:45:00",
    date: "2026-10-11 11:45 AM",
    discrepancy: "All three-way checks passed successfully.",
    reviewDecision: "APPROVE",
    reviewReason: "Verified with procurement department, exact match on all line items.",
    document_hashes: {
      invoice: "1f8e9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
      po: "2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b",
      delivery_receipt: "3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c"
    },
    verifications: {
      price_check: "PASS",
      quantity_check: "PASS",
      duplicate_check: "PASS"
    }
  }
];

// Existing audit_trail table schema: (id, invoice_id, event_type, details, timestamp)
export const initialAuditLogs = [
  {
    id: 1,
    invoice_id: "INV-1042",
    event_type: "PACKAGE_INGESTED",
    event: "Document Package Ingested",
    details: "Received Invoice, PO, and Delivery Receipt (3 files)",
    timestamp: "2026-10-13 10:14:02",
    actor: "Automated Pipeline",
    status: "INFO"
  },
  {
    id: 2,
    invoice_id: "INV-1042",
    event_type: "HASH_COMPUTED",
    event: "SHA-256 Hashes Computed",
    details: "Generated SHA-256 digests for all 3 ingested PDFs",
    timestamp: "2026-10-13 10:14:03",
    actor: "Cryptographic Subsystem",
    status: "INFO"
  },
  {
    id: 3,
    invoice_id: "INV-1042",
    event_type: "OCR_EXTRACTION",
    event: "OCR & Key-Value Extraction Complete",
    details: "Extracted supplier: ABC Traders, Amount: ₹4,72,000, Confidence: 95%",
    timestamp: "2026-10-13 10:14:05",
    actor: "Vision Extraction Model",
    status: "INFO"
  },
  {
    id: 4,
    invoice_id: "INV-1042",
    event_type: "VERIFICATION_FAILED",
    event: "3-Way Verification Performed",
    details: "Price check FAILED: Unit price ₹8,000 > ₹5,000",
    timestamp: "2026-10-13 10:14:06",
    actor: "Rules Engine",
    status: "WARNING"
  },
  {
    id: 5,
    invoice_id: "INV-1042",
    event_type: "RISK_FLAGGED",
    event: "Risk Score Computed & Flagged",
    details: "Calculated Risk Score: 75/100 (HIGH RISK). Routed to Human Review Queue.",
    timestamp: "2026-10-13 10:14:06",
    actor: "Risk Scorer",
    status: "CRITICAL"
  }
];
