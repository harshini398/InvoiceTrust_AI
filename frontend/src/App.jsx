import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewDashboard from './components/OverviewDashboard';
import UploadVerify from './components/UploadVerify';
import VerificationReport from './components/VerificationReport';
import AuditTrail from './components/AuditTrail';
import ReviewQueue from './components/ReviewQueue';
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

  // Handler for Document Verification
  const handleVerify = async (formData) => {
    const { data, source } = await verifyDocuments(formData);
    setVerificationResult(data);

    // Register timestamped Audit Log
    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);
    
    const newLogs = [
      {
        id: `LOG-${Date.now()}-1`,
        timestamp: timestampStr,
        invoice_id: data.invoice_id,
        event: "Document Package Ingested",
        actor: source === 'backend' ? 'FastAPI Service (:8000)' : 'Client Verification Engine',
        details: `Ingested invoice package. SHA-256 generated for 3 files.`,
        status: "INFO"
      },
      {
        id: `LOG-${Date.now()}-2`,
        timestamp: timestampStr,
        invoice_id: data.invoice_id,
        event: "Rules Cross-Check Executed",
        actor: "3-Way Match Engine",
        details: `Price: ${data.verifications?.price_check}, Qty: ${data.verifications?.quantity_check}, Duplicates: ${data.verifications?.duplicate_check}`,
        status: data.risk_level === 'HIGH' ? "CRITICAL" : "INFO"
      }
    ];

    setAuditLogs((prev) => [...newLogs, ...prev]);

    // If High or Medium risk, add to Review Queue
    if (data.risk_level === 'HIGH' || data.risk_level === 'MEDIUM') {
      const newQueueItem = {
        id: data.invoice_id,
        supplier: data.extraction?.supplier || "Unknown Supplier",
        amount: data.extraction?.total_amount ? `₹${data.extraction.total_amount.toLocaleString('en-IN')}` : "₹0",
        risk_score: data.risk_score || 75,
        risk_level: data.risk_level,
        date: "Just now",
        discrepancy: (data.discrepancies && data.discrepancies[0]) || "Variance detected during 3-way check.",
        status: "PENDING_REVIEW",
        reviewDecision: null,
        reviewReason: "",
        document_hashes: data.document_hashes,
        verifications: data.verifications
      };

      setQueueItems((prev) => [newQueueItem, ...prev.filter(item => item.id !== data.invoice_id)]);
    }

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
        item.id === invoiceId
          ? {
              ...item,
              status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED',
              reviewDecision: decision,
              reviewReason: reason,
            }
          : item
      )
    );

    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const decisionLog = {
      id: `LOG-DEC-${Date.now()}`,
      timestamp: timestampStr,
      invoice_id: invoiceId,
      event: `Human Review: ${decision}`,
      actor: "Lead Fraud Examiner",
      details: `Decision recorded: "${reason}"`,
      status: decision === 'APPROVE' ? "INFO" : "WARNING"
    };

    setAuditLogs((prev) => [decisionLog, ...prev]);
    showToast(`Decision recorded for ${invoiceId}: ${decision}`);
  };

  const pendingCount = queueItems.filter(item => item.status === 'PENDING_REVIEW').length;

  return (
    <div className="min-h-screen bg-canvas-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce glass-panel text-slate-200 px-4 py-3 rounded-full shadow-2xl text-xs font-medium flex items-center space-x-2 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingCount={pendingCount}
        backendOnline={backendOnline}
        onOpenUpload={() => setActiveTab('upload')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            queueItems={queueItems}
            onNavigateToUpload={() => setActiveTab('upload')}
            onNavigateToQueue={() => setActiveTab('queue')}
            onSelectInvoice={(id) => {
              const matched = queueItems.find(q => q.id === id);
              if (matched) {
                setVerificationResult({
                  ...initialContractData,
                  invoice_id: matched.id,
                  extraction: {
                    ...initialContractData.extraction,
                    supplier: matched.supplier,
                    invoice_number: matched.id,
                  },
                  risk_score: matched.risk_score,
                  risk_level: matched.risk_level,
                  discrepancies: [matched.discrepancy],
                  verifications: matched.verifications || initialContractData.verifications
                });
              }
              setActiveTab('report');
            }}
          />
        )}

        {activeTab === 'upload' && (
          <UploadVerify onVerifySuccess={handleVerify} />
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

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-canvas-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">InvoiceTrust AI Canvas</span>
            <span>•</span>
            <span>Branch: <code className="text-orange-400 font-mono">feature/frontend-ui</code></span>
          </div>
          <div>
            Built with React 19 + Vite + Tailwind CSS • Cryptographic 3-Way Match
          </div>
        </div>
      </footer>
    </div>
  );
}
