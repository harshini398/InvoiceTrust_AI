// Agreed JSON Contract and Initial Mock Dataset
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

export const initialQueueItems = [
  {
    id: "INV-1042",
    supplier: "ABC Traders",
    amount: "₹4,72,000",
    risk_score: 75,
    risk_level: "HIGH",
    date: "2026-10-13 10:14 AM",
    discrepancy: "Invoice unit price (₹8,000) exceeds PO unit price (₹5,000) by ₹3,000.",
    status: "PENDING_REVIEW",
    reviewDecision: null,
    reviewReason: "",
    document_hashes: initialContractData.document_hashes,
    verifications: initialContractData.verifications
  },
  {
    id: "INV-1039",
    supplier: "Apex Logistics Ltd",
    amount: "₹1,24,500",
    risk_score: 82,
    risk_level: "HIGH",
    date: "2026-10-12 04:30 PM",
    discrepancy: "Duplicate invoice hash detected across previous billing cycle.",
    status: "PENDING_REVIEW",
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
    id: "INV-1035",
    supplier: "Zeta Tech Solutions",
    amount: "₹89,000",
    risk_score: 42,
    risk_level: "MEDIUM",
    date: "2026-10-12 02:15 PM",
    discrepancy: "Delivery receipt quantity (10 units) is lower than billed quantity (12 units).",
    status: "PENDING_REVIEW",
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
    id: "INV-1028",
    supplier: "Delta Industrial Supplies",
    amount: "₹3,15,400",
    risk_score: 12,
    risk_level: "LOW",
    date: "2026-10-11 11:45 AM",
    discrepancy: "All three-way checks passed successfully.",
    status: "APPROVED",
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

export const initialAuditLogs = [
  {
    id: "LOG-901",
    timestamp: "2026-10-13 10:14:02",
    invoice_id: "INV-1042",
    event: "Document Package Ingested",
    actor: "Automated Pipeline",
    details: "Received Invoice, PO, and Delivery Receipt (3 files)",
    status: "INFO"
  },
  {
    id: "LOG-902",
    timestamp: "2026-10-13 10:14:03",
    invoice_id: "INV-1042",
    event: "SHA-256 Hashes Computed",
    actor: "Cryptographic Subsystem",
    details: "Generated SHA-256 digests for all 3 ingested PDFs",
    status: "INFO"
  },
  {
    id: "LOG-903",
    timestamp: "2026-10-13 10:14:05",
    invoice_id: "INV-1042",
    event: "OCR & Key-Value Extraction Complete",
    actor: "Vision Extraction Model",
    details: "Extracted supplier: ABC Traders, Amount: ₹4,72,000, Confidence: 95%",
    status: "INFO"
  },
  {
    id: "LOG-904",
    timestamp: "2026-10-13 10:14:06",
    invoice_id: "INV-1042",
    event: "3-Way Verification Performed",
    actor: "Rules Engine",
    details: "Price check FAILED: Unit price ₹8,000 > ₹5,000",
    status: "WARNING"
  },
  {
    id: "LOG-905",
    timestamp: "2026-10-13 10:14:06",
    invoice_id: "INV-1042",
    event: "Risk Score Computed & Flagged",
    actor: "Risk Scorer",
    details: "Calculated Risk Score: 75/100 (HIGH RISK). Routed to Human Review Queue.",
    status: "CRITICAL"
  }
];
