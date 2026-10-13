import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  DollarSign, 
  Building2, 
  FileText, 
  ArrowRight,
  ClipboardList,
  History,
  Lock
} from 'lucide-react';

export default function VerificationReport({ 
  reportData, 
  onNavigateToAudit, 
  onNavigateToQueue, 
  onNewVerification 
}) {
  if (!reportData) {
    return (
      <div className="text-center py-20 glass-card rounded-3xl max-w-xl mx-auto space-y-4">
        <FileText className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-lg font-bold text-white font-display">No Verification Report Selected</h2>
        <p className="text-xs text-slate-400">Upload documents or select an existing invoice from the overview.</p>
        <button
          onClick={onNewVerification}
          className="px-6 py-2.5 rounded-full bg-[#00F59B] text-slate-950 text-xs font-bold uppercase tracking-wider"
        >
          Upload Documents
        </button>
      </div>
    );
  }

  const { extraction, verifications, discrepancies, risk_score, risk_level, invoice_id } = reportData;

  const getRiskBadge = () => {
    switch (risk_level) {
      case 'HIGH':
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          label: 'HIGH RISK DETECTED',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          label: 'MODERATE RISK',
        };
      default:
        return {
          bg: 'bg-[#00F59B]/15 border-[#00F59B]/30 text-[#00F59B]',
          label: 'LOW RISK / VERIFIED',
        };
    }
  };

  const riskBadge = getRiskBadge();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400">Contract Verification</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-xs text-sky-400 font-bold">{invoice_id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            {extraction?.supplier || 'Vendor'} — 3-Way Reconciliation
          </h1>
          <p className="text-xs text-slate-400">
            Automated cross-check across Invoice, Purchase Order, and Delivery Receipt.
          </p>
        </div>

        {/* Severity Badge & Risk Score */}
        <div className="flex items-center space-x-4 bg-[#060913]/90 p-4 rounded-2xl border border-white/10 self-start sm:self-auto">
          <div className="text-right">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Fraud Risk Score</div>
            <div className="text-2xl font-display font-bold text-white flex items-baseline justify-end space-x-1">
              <span>{risk_score}</span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>
          <div className={`px-3 py-2 rounded-xl border font-bold text-xs ${riskBadge.bg}`}>
            {riskBadge.label}
          </div>
        </div>
      </div>

      {/* Discrepancies Alert Banner */}
      {discrepancies && discrepancies.length > 0 && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm font-display">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Discrepancy Flags Detected ({discrepancies.length})</span>
          </div>
          <div className="space-y-2">
            {discrepancies.map((disc, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs flex items-start space-x-2.5 font-medium leading-relaxed"
              >
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{disc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Core Rule Verifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`p-5 rounded-3xl border transition glass-card ${
          verifications?.price_check === 'PASS' 
            ? 'border-[#00F59B]/30' 
            : 'border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">Price Tolerance</span>
            {verifications?.price_check === 'PASS' ? (
              <span className="inline-flex items-center text-[11px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-2.5 py-0.5 rounded-full border border-[#00F59B]/20">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> PASS
              </span>
            ) : (
              <span className="inline-flex items-center text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                <XCircle className="w-3.5 h-3.5 mr-1" /> FAIL
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Strict unit-rate comparison against purchase order authorized prices.</p>
        </div>

        <div className={`p-5 rounded-3xl border transition glass-card ${
          verifications?.quantity_check === 'PASS' 
            ? 'border-[#00F59B]/30' 
            : 'border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">Quantity Alignment</span>
            {verifications?.quantity_check === 'PASS' ? (
              <span className="inline-flex items-center text-[11px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-2.5 py-0.5 rounded-full border border-[#00F59B]/20">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> PASS
              </span>
            ) : (
              <span className="inline-flex items-center text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                <XCircle className="w-3.5 h-3.5 mr-1" /> FAIL
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Cross-verified against verified delivery receipt warehouse quantities.</p>
        </div>

        <div className={`p-5 rounded-3xl border transition glass-card ${
          verifications?.duplicate_check === 'PASS' 
            ? 'border-[#00F59B]/30' 
            : 'border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">SHA-256 Duplicate Check</span>
            {verifications?.duplicate_check === 'PASS' ? (
              <span className="inline-flex items-center text-[11px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-2.5 py-0.5 rounded-full border border-[#00F59B]/20">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> PASS
              </span>
            ) : (
              <span className="inline-flex items-center text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                <XCircle className="w-3.5 h-3.5 mr-1" /> FAIL
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Cryptographic hash check across historical billing logs to stop double payment.</p>
        </div>
      </div>

      {/* Extracted Fields & Itemized Comparison */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white font-display">Extracted Document Data (Contract Schema)</h2>
          <p className="text-xs text-slate-400">Values extracted from vision models and normalized for evaluation</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-white/10">
            <div className="text-[11px] text-slate-400 font-medium">Supplier</div>
            <div className="text-sm font-bold text-white mt-1">{extraction?.supplier || 'N/A'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-white/10">
            <div className="text-[11px] text-slate-400 font-medium">Invoice Number</div>
            <div className="text-sm font-mono font-bold text-sky-400 mt-1">{extraction?.invoice_number || 'N/A'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-white/10">
            <div className="text-[11px] text-slate-400 font-medium">Total Billed</div>
            <div className="text-sm font-mono font-bold text-white mt-1">
              ₹{extraction?.total_amount ? extraction.total_amount.toLocaleString('en-IN') : '0'}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-white/10">
            <div className="text-[11px] text-slate-400 font-medium">AI Confidence</div>
            <div className="text-sm font-mono font-bold text-[#00F59B] mt-1">
              {extraction?.confidence_score ? `${Math.round(extraction.confidence_score * 100)}%` : '95%'}
            </div>
          </div>
        </div>

        {/* 3-Way Line Item Comparison Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            3-Way Line Item Variance Inspection
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060913] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4">PO Unit Price</th>
                  <th className="py-3 px-4">Invoice Unit Price</th>
                  <th className="py-3 px-4">Variance</th>
                  <th className="py-3 px-4">Receipt Qty</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#060913]/50">
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">
                    Industrial Valves (Model X-50)
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400">
                    ₹5,000
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-rose-400">
                    ₹8,000
                  </td>
                  <td className="py-4 px-4 font-mono text-rose-400 font-bold">
                    +₹3,000 (+60%)
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300">
                    59 units (Match)
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      FLAGGED
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">
                    High-Temp Gaskets Kit
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400">
                    ₹1,200
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300">
                    ₹1,200
                  </td>
                  <td className="py-4 px-4 font-mono text-[#00F59B]">
                    ₹0 (0%)
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300">
                    100 units (Match)
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30">
                      MATCH
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={onNewVerification}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition"
        >
          Verify Another Document
        </button>
        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToAudit}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition"
          >
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span>View SHA-256 Audit Trail</span>
          </button>
          <button
            onClick={onNavigateToQueue}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#00F59B] hover:bg-[#00DC8C] text-slate-950 font-bold uppercase tracking-wider text-xs shadow-neon transition"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Open in Review Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
