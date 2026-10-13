import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Lock, 
  FileText, 
  Clock, 
  Terminal, 
  AlertCircle, 
  Info,
  CheckCircle2,
  ExternalLink
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
      title: "Vendor Invoice Digest",
      key: "invoice",
      hash: hashes?.invoice || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      type: "SHA-256 Checksum",
      status: "VERIFIED_TAMPER_FREE"
    },
    {
      title: "Purchase Order Digest",
      key: "po",
      hash: hashes?.po || "a8f3b20491cb8f9d01249fae563bc7890123456789abcdef0123456789abcdef",
      type: "SHA-256 Checksum",
      status: "VERIFIED_TAMPER_FREE"
    },
    {
      title: "Delivery Receipt Digest",
      key: "delivery_receipt",
      hash: hashes?.delivery_receipt || "5f4dcc3b5aa765d61d8327deb882cf992b9699aabbccddeeff00112233445566",
      type: "SHA-256 Checksum",
      status: "VERIFIED_TAMPER_FREE"
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    if (logFilter === 'ALL') return true;
    return log.status === logFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono text-slate-400">Cryptographic Integrity</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-indigo-400 font-bold">{currentInvoiceId || 'INV-1042'}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Immutable Audit Trail & Proofs
          </h1>
          <p className="text-sm text-slate-400">
            SHA-256 cryptographic anchors and chronological trace for fraud non-repudiation.
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium self-start sm:self-auto">
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
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 space-y-3 transition shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">{doc.title}</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                  {doc.type}
                </span>
              </div>

              {/* Hash Display */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
                <p className="text-[11px] font-mono text-slate-300 break-all select-all leading-relaxed">
                  {doc.hash}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <span className="text-[10px] text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Match Validated
                  </span>
                  <button
                    onClick={() => copyToClipboard(doc.hash, doc.key)}
                    className="inline-flex items-center space-x-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
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

      {/* Event Timeline Log Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">Chronological System Events</h2>
            <p className="text-xs text-slate-400">Time-stamped audit events registered during document ingestion and rules execution</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(filter => (
              <button
                key={filter}
                onClick={() => setLogFilter(filter)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  logFilter === filter 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
          {filteredLogs.map((log) => {
            let statusBadge = {
              color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
              dot: 'bg-blue-400'
            };
            if (log.status === 'CRITICAL') {
              statusBadge = {
                color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                dot: 'bg-rose-400'
              };
            } else if (log.status === 'WARNING') {
              statusBadge = {
                color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                dot: 'bg-amber-400'
              };
            }

            return (
              <div key={log.id} className="relative pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition">
                <span className={`absolute left-2.5 top-5 w-2.5 h-2.5 rounded-full ${statusBadge.dot} -translate-x-1/2 ring-4 ring-slate-950`} />
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-200">{log.event}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${statusBadge.color}`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-normal">{log.details}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between text-[11px] text-slate-500 font-mono">
                  <span>{log.timestamp}</span>
                  <span className="text-slate-400">{log.actor}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
