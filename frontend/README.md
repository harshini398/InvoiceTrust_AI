# InvoiceTrust AI — Frontend (Member 1)

Modern 3-Way Match & Fraud Prevention platform interface built with **React 19**, **Vite**, and **Tailwind CSS**.

## Branch
`feature/frontend-ui`

## Core Screens
1. **Overview Dashboard** (`OverviewDashboard.jsx`): Real-time metrics for total invoices checked, cases needing review, duplicate alerts, and pass/fail ratios.
2. **Upload & Verify** (`UploadVerify.jsx`): Multi-document ingestion for Invoice PDF, Purchase Order (PO), and Delivery Receipt (DR) with simulated and live FastAPI verification.
3. **Verification Report** (`VerificationReport.jsx`): Extracted key fields, side-by-side line item comparison, flagged discrepancy highlights, and risk score visual severity badges.
4. **Audit Trail** (`AuditTrail.jsx`): Immutable SHA-256 cryptographic document checksums, one-click copy, and chronological timestamped ledger logs.
5. **Review Queue** (`ReviewQueue.jsx`): Human-in-the-loop review panel to inspect mismatched evidence and record auditable Approve / Reject decisions with typed justifications.

## Agreed Contract Integration
Connects to FastAPI (`http://localhost:8000/invoices/verify`) with automatic fallback to mock contract data during standalone testing.

## Getting Started
```bash
cd frontend
npm install
npm run dev
```
