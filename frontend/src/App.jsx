import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewDashboard from './components/OverviewDashboard';
import UploadVerify from './components/UploadVerify';
import InvoiceTable from './components/InvoiceTable';
import VerificationReport from './components/VerificationReport';
import AuditTrail from './components/AuditTrail';
import ReviewQueue from './components/ReviewQueue';
import FooterSection from './components/FooterSection';
import { initialContractData, initialQueueItems, initialAuditLogs } from './data/mockData';
import { verifyDocuments, checkBackendHealth } from './api/invoiceService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [verificationResult, setVerificationResult] = useState(initialContractData);
  const [queueItems, setQueueItems] = useState(initialQueueItems);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [backendOnline, setBackendOnline] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Probe FastAPI backend availability
  useEffect(() => {
    let isMounted = true;
    const probeBackend = async () => {
      const isOnline = await checkBackendHealth();
      if (isMounted) setBackendOnline(isOnline);
    };

    probeBackend();
    const interval = setInterval(probeBackend, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handler for Document Verification (Preserves existing API contract)
  const handleVerify = async (formData) => {
    const { data, source } = await verifyDocuments(formData);
    setVerificationResult(data);

    // Register timestamped Audit Log
    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);
    
    const newLogs = [
      {
        id: Date.now() + 1,
        invoice_id: data.invoice_id,
        event_type: "PACKAGE_INGESTED",
        event: "Document Package Ingested",
        actor: source === 'backend' ? 'FastAPI Service (:8000)' : 'Client Verification Engine',
        details: `Ingested invoice package. SHA-256 generated for 3 files.`,
        timestamp: timestampStr,
        status: "INFO"
      },
      {
        id: Date.now() + 2,
        invoice_id: data.invoice_id,
        event_type: "RULES_VERIFICATION",
        event: "Rules Cross-Check Executed",
        actor: "3-Way Match Engine",
        details: `Price: ${data.verifications?.price_check}, Qty: ${data.verifications?.quantity_check}, Duplicates: ${data.verifications?.duplicate_check}`,
        timestamp: timestampStr,
        status: data.risk_level === 'HIGH' ? "CRITICAL" : "INFO"
      }
    ];

    setAuditLogs((prev) => [...newLogs, ...prev]);

    // Update queue/invoices table records if High or Medium risk
    const newQueueItem = {
      id: Date.now(),
      invoice_id: data.invoice_id,
      supplier: data.extraction?.supplier || "Unknown Supplier",
      total_amount: data.extraction?.total_amount || 0,
      amount: data.extraction?.total_amount ? `₹${data.extraction.total_amount.toLocaleString('en-IN')}` : "₹0",
      risk_score: data.risk_score || 75,
      risk_level: data.risk_level,
      payment_status: "UNPAID",
      status: "PENDING_REVIEW",
      created_at: timestampStr,
      date: "Just now",
      discrepancy: (data.discrepancies && data.discrepancies[0]) || "Variance detected during 3-way check.",
      reviewDecision: null,
      reviewReason: "",
      document_hashes: data.document_hashes,
      verifications: data.verifications
    };

    setQueueItems((prev) => [newQueueItem, ...prev.filter(item => (item.invoice_id !== data.invoice_id && item.id !== data.invoice_id))]);

    showToast(
      source === 'backend'
        ? `Verified via FastAPI :8000! Case: ${data.invoice_id}`
        : `Verified via Contract Engine: ${data.invoice_id}`
    );

    setActiveTab('report');
  };

  // Handler for Recording Review Decisions
  const handleRecordDecision = (invoiceId, decision, reason) => {
    setQueueItems((prev) =>
      prev.map((item) =>
        (item.invoice_id === invoiceId || item.id === invoiceId)
          ? {
              ...item,
              status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED',
              payment_status: decision === 'APPROVE' ? 'PAID' : 'HELD',
              reviewDecision: decision,
              reviewReason: reason,
            }
          : item
      )
    );

    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const decisionLog = {
      id: Date.now(),
      invoice_id: invoiceId,
      event_type: `REVIEW_${decision}`,
      event: `Human Review: ${decision}`,
      actor: "Senior Fraud Examiner",
      details: `Decision recorded: "${reason}"`,
      timestamp: timestampStr,
      status: decision === 'APPROVE' ? "INFO" : "WARNING"
    };

    setAuditLogs((prev) => [decisionLog, ...prev]);
    showToast(`Decision recorded for ${invoiceId}: ${decision}`);
  };

  const handleSelectInvoiceFromTable = (id) => {
    const matched = queueItems.find(q => q.invoice_id === id || q.id === id);
    if (matched) {
      setVerificationResult({
        ...initialContractData,
        invoice_id: matched.invoice_id || matched.id,
        extraction: {
          ...initialContractData.extraction,
          supplier: matched.supplier,
          invoice_number: matched.invoice_id || matched.id,
          total_amount: matched.total_amount || 472000,
        },
        risk_score: matched.risk_score,
        risk_level: matched.risk_level,
        discrepancies: [matched.discrepancy],
        verifications: matched.verifications || initialContractData.verifications
      });
    }
    setActiveTab('report');
  };

  const pendingCount = queueItems.filter(item => item.status === 'PENDING_REVIEW').length;

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#38BDF8] selection:text-[#0A0E17] relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce p-4 rounded-2xl bg-[#111827] border border-[#38BDF8]/50 text-[#38BDF8] shadow-2xl text-xs font-mono font-semibold flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingCount={pendingCount}
        backendOnline={backendOnline}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            queueItems={queueItems}
            onNavigateToUpload={() => setActiveTab('upload')}
            onNavigateToQueue={() => setActiveTab('queue')}
            onNavigateToTable={() => setActiveTab('table')}
            onNavigateToAudit={() => setActiveTab('audit')}
            onSelectInvoice={handleSelectInvoiceFromTable}
          />
        )}

        {activeTab === 'upload' && (
          <UploadVerify onVerifySuccess={handleVerify} />
        )}

        {activeTab === 'table' && (
          <div className="space-y-6 animate-fadeIn pb-12">
            <div className="pb-4 border-b border-[#1E2D47]">
              <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
                Data Layer
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F8FAFC] tracking-tight mt-1">
                Invoices Ledger Records
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                Structured SQLite invoices table with live search, payment statuses, and risk scoring.
              </p>
            </div>
            <InvoiceTable 
              invoices={queueItems} 
              onSelectInvoice={handleSelectInvoiceFromTable} 
            />
          </div>
        )}

        {activeTab === 'report' && (
          <VerificationReport
            reportData={verificationResult}
            onNavigateToAudit={() => setActiveTab('audit')}
            onNavigateToQueue={() => setActiveTab('queue')}
            onNewVerification={() => setActiveTab('upload')}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTrail
            hashes={verificationResult?.document_hashes}
            auditLogs={auditLogs}
            currentInvoiceId={verificationResult?.invoice_id}
          />
        )}

        {activeTab === 'queue' && (
          <ReviewQueue
            queueItems={queueItems}
            onRecordDecision={handleRecordDecision}
          />
        )}

      </main>

      {/* Phenomenon Studio Closing CTA & Footer */}
      <FooterSection 
        onNavigateToUpload={() => {
          setActiveTab('upload');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
