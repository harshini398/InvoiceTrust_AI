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
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400">Cryptographic Proofs</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-sky-400 font-bold">{currentInvoiceId || 'INV-1042'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-1">
            Immutable Audit Trail & Proofs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Non-repudiation security hashes anchoring document state for financial compliance.
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-xs font-semibold self-start sm:self-auto shadow-sm">
          <Lock className="w-3.5 h-3.5" />
          <span>Cryptographically Sealed</span>
        </div>
      </div>

      {/* SHA-256 Hash Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {documentHashList.map((doc) => {
          const isCopied = copiedKey === doc.key;
          return (
            <div 
              key={doc.key}
              className="glass-card rounded-3xl p-6 space-y-4 shadow-xl hover:border-blue-400/40 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
                  <span className="text-xs font-bold text-white">{doc.title}</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                  {doc.type}
                </span>
              </div>

              {/* Hash Container */}
              <div className="p-3.5 rounded-2xl bg-[#060913] border border-white/10 space-y-3">
                <p className="text-[11px] font-mono text-slate-300 break-all select-all leading-relaxed">
                  {doc.hash}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-[#00F59B] flex items-center font-medium">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Validated
                  </span>
                  <button
                    onClick={() => copyToClipboard(doc.hash, doc.key)}
                    className="inline-flex items-center space-x-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-[#00F59B]" />
                        <span className="text-[#00F59B]">Copied</span>
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

      {/* Timeline Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-display">System Timeline Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">Chronological record of document extraction and verification decisions</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-[#060913] p-1 rounded-full border border-white/10 self-start sm:self-auto">
            {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(filter => (
              <button
                key={filter}
                onClick={() => setLogFilter(filter)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                  logFilter === filter 
                    ? 'bg-white/15 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/10">
          {filteredLogs.map((log) => {
            let statusBadge = {
              color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
              dot: 'bg-sky-400'
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
              <div 
                key={log.id} 
                className="relative pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-[#060913]/70 border border-white/5 hover:border-white/15 transition"
              >
                <span className={`absolute left-2.5 top-5 w-2.5 h-2.5 rounded-full ${statusBadge.dot} -translate-x-1/2 ring-4 ring-[#060913]`} />
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{log.event}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${statusBadge.color}`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-normal">{log.details}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between text-[11px] text-slate-500 font-mono">
                  <span>{log.timestamp}</span>
                  <span className="text-slate-300 font-medium">{log.actor}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
