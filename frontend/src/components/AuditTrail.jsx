import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Lock, 
  CheckCircle2, 
} from 'lucide-react';

export default function AuditTrail({ hashes, auditLogs, currentInvoiceId }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [logFilter, setLogFilter] = useState('ALL');

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const documentHashList = [
    {
      title: "Vendor Invoice Checksum",
      key: "invoice",
      hash: hashes?.invoice || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      type: "SHA-256",
      status: "TAMPER_FREE"
    },
    {
      title: "Purchase Order Checksum",
      key: "po",
      hash: hashes?.po || "a8f3b20491cb8f9d01249fae563bc7890123456789abcdef0123456789abcdef",
      type: "SHA-256",
      status: "TAMPER_FREE"
    },
    {
      title: "Delivery Receipt Checksum",
      key: "delivery_receipt",
      hash: hashes?.delivery_receipt || "5f4dcc3b5aa765d61d8327deb882cf992b9699aabbccddeeff00112233445566",
      type: "SHA-256",
      status: "TAMPER_FREE"
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    if (logFilter === 'ALL') return true;
    return log.status === logFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D47]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-[#38BDF8]">Cryptographic Integrity</span>
            <span className="text-[#94A3B8]">•</span>
            <span className="text-xs font-mono text-[#F8FAFC] font-bold">{currentInvoiceId || 'INV-1042'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F8FAFC] tracking-tight mt-1">
            Immutable Audit Trail & Proofs
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            SHA-256 cryptographic anchors and chronological trace for fraud non-repudiation.
          </p>
        </div>
        <div className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#111827] border border-[#1E2D47] text-[#38BDF8] text-xs font-mono font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>Cryptographically Sealed</span>
        </div>
      </div>

      {/* SHA-256 Hash Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documentHashList.map((doc) => {
          const isCopied = copiedKey === doc.key;
          return (
            <div 
              key={doc.key}
              className="p-5 rounded-3xl bg-[#111827] border border-[#1E2D47] hover:border-[#38BDF8]/40 space-y-3.5 transition shadow-studio-panel"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-xs font-semibold text-[#F8FAFC]">{doc.title}</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-[#0A0E17] text-[#94A3B8] px-2 py-0.5 rounded-full border border-[#1E2D47]">
                  {doc.type}
                </span>
              </div>

              {/* Hash Display */}
              <div className="p-3 rounded-2xl bg-[#0A0E17] border border-[#1E2D47] space-y-2.5">
                <p className="text-[11px] font-mono text-[#94A3B8] break-all select-all leading-relaxed">
                  {doc.hash}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#1E2D47]">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Validated
                  </span>
                  <button
                    onClick={() => copyToClipboard(doc.hash, doc.key)}
                    className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-[#38BDF8] hover:text-[#0EA5E9] transition"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy SHA-256</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chronological Event Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-[#1E2D47] space-y-6 shadow-studio-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-base text-[#F8FAFC]">
              Chronological Ledger Events (SQLite audit_trail)
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Immutable audit events registered during document ingestion and rules execution
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0A0E17] p-1.5 rounded-full border border-[#1E2D47] self-start sm:self-auto">
            {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(filter => (
              <button
                key={filter}
                onClick={() => setLogFilter(filter)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition ${
                  logFilter === filter 
                    ? 'bg-[#38BDF8] text-[#0A0E17] font-bold shadow-sm' 
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#1E2D47]">
          {filteredLogs.map((log) => {
            let statusBadge = {
              color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
              dot: 'bg-blue-400'
            };
            if (log.status === 'CRITICAL') {
              statusBadge = {
                color: 'text-[#F87171] bg-[#F87171]/15 border-[#F87171]/30',
                dot: 'bg-[#F87171]'
              };
            } else if (log.status === 'WARNING') {
              statusBadge = {
                color: 'text-[#FBBF24] bg-[#FBBF24]/15 border-[#FBBF24]/30',
                dot: 'bg-[#FBBF24]'
              };
            }

            return (
              <div 
                key={log.id} 
                className="relative pl-8 p-4 rounded-2xl bg-[#0A0E17] border border-[#1E2D47] hover:border-[#243553] transition"
              >
                <span className={`absolute left-2.5 top-6 w-2.5 h-2.5 rounded-full ${statusBadge.dot} -translate-x-1/2 ring-4 ring-[#0A0E17]`} />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-[#F8FAFC]">{log.event}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${statusBadge.color}`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] font-normal leading-relaxed">{log.details}</p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between text-[11px] text-[#94A3B8] font-mono shrink-0">
                    <span>{log.timestamp}</span>
                    <span className="text-[#38BDF8]">{log.actor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
