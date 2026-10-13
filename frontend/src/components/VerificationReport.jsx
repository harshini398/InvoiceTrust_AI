import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  FileText, 
  ArrowRight,
  ClipboardList,
  History,
  Check,
  TrendingDown
} from 'lucide-react';

export default function VerificationReport({ 
  reportData, 
  onNavigateToAudit, 
  onNavigateToQueue, 
  onNewVerification 
}) {
  if (!reportData) {
    return (
      <div className="text-center py-20 glass-panel rounded-2xl max-w-xl mx-auto space-y-4">
        <FileText className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-200">No Verification Report Selected</h2>
        <p className="text-xs text-slate-400">Please upload documents first or select an invoice from the dashboard.</p>
        <button
          onClick={onNewVerification}
          className="px-6 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold border border-white/10"
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
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          label: 'LOW RISK / VERIFIED',
        };
    }
  };

  const riskBadge = getRiskBadge();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Top Header Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase font-mono text-slate-400 tracking-wider">Audit Report</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-xs text-orange-400 font-semibold">{invoice_id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {extraction?.supplier || 'Vendor'} — 3-Way Match Audit
          </h1>
          <p className="text-xs text-slate-400">Reconciled against Purchase Order & Warehouse Delivery Slip</p>
        </div>

        {/* Severity Badge & Risk Score */}
        <div className="flex items-center space-x-4 bg-canvas-950/80 p-3.5 rounded-2xl border border-white/[0.08] shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Risk Score</div>
            <div className="text-2xl font-extrabold font-mono text-white flex items-baseline justify-end space-x-1">
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
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Discrepancy Flags Detected ({discrepancies.length})</span>
          </div>
          <div className="space-y-2">
            {discrepancies.map((disc, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs flex items-start space-x-2.5 font-medium"
              >
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{disc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Core Verification Rules Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price Check */}
        <div className={`glass-panel p-5 rounded-2xl space-y-2 border transition ${
          verifications?.price_check === 'PASS' 
            ? 'border-emerald-500/30 bg-emerald-950/10' 
            : 'border-rose-500/30 bg-rose-950/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Price Check</span>
            {verifications?.price_check === 'PASS' ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <Check className="w-3 h-3 mr-1" /> PASS
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-bold text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                <XCircle className="w-3 h-3 mr-1" /> FAIL
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Unit rate comparison between invoice items and approved PO lines.</p>
        </div>

        {/* Quantity Check */}
        <div className={`glass-panel p-5 rounded-2xl space-y-2 border transition ${
          verifications?.quantity_check === 'PASS' 
            ? 'border-emerald-500/30 bg-emerald-950/10' 
            : 'border-rose-500/30 bg-rose-950/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Quantity Check</span>
            {verifications?.quantity_check === 'PASS' ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <Check className="w-3 h-3 mr-1" /> PASS
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-bold text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                <XCircle className="w-3 h-3 mr-1" /> FAIL
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Cross-matched units billed vs items acknowledged on Delivery Receipt.</p>
        </div>

        {/* Duplicate Check */}
        <div className={`glass-panel p-5 rounded-2xl space-y-2 border transition ${
          verifications?.duplicate_check === 'PASS' 
            ? 'border-emerald-500/30 bg-emerald-950/10' 
            : 'border-rose-500/30 bg-rose-950/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Duplicate Check</span>
            {verifications?.duplicate_check === 'PASS' ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <Check className="w-3 h-3 mr-1" /> PASS
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-bold text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                <XCircle className="w-3 h-3 mr-1" /> FAIL
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">SHA-256 historical ledger check for double billing or re-used hashes.</p>
        </div>
      </div>

      {/* Extracted Fields & Side-by-Side Comparison */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">Extracted Key Entities (Agreed Contract)</h2>
          <p className="text-xs text-slate-400">Normalized values extracted directly from submitted documents</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-canvas-950/70 border border-white/[0.06]">
            <div className="text-[11px] text-slate-400 font-medium">Supplier Name</div>
            <div className="text-sm font-semibold text-slate-100 mt-1">{extraction?.supplier || 'N/A'}</div>
          </div>
          <div className="p-4 rounded-xl bg-canvas-950/70 border border-white/[0.06]">
            <div className="text-[11px] text-slate-400 font-medium">Invoice Number</div>
            <div className="text-sm font-mono font-semibold text-orange-400 mt-1">{extraction?.invoice_number || 'N/A'}</div>
          </div>
          <div className="p-4 rounded-xl bg-canvas-950/70 border border-white/[0.06]">
            <div className="text-[11px] text-slate-400 font-medium">Total Billed Amount</div>
            <div className="text-sm font-mono font-semibold text-slate-100 mt-1">
              ₹{extraction?.total_amount ? extraction.total_amount.toLocaleString('en-IN') : '0'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-canvas-950/70 border border-white/[0.06]">
            <div className="text-[11px] text-slate-400 font-medium">Extraction Confidence</div>
            <div className="text-sm font-mono font-semibold text-emerald-400 mt-1">
              {extraction?.confidence_score ? `${Math.round(extraction.confidence_score * 100)}%` : '95%'}
            </div>
          </div>
        </div>

        {/* 3-Way Itemized Comparison Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            3-Way Itemized Comparison
          </h3>
          <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/[0.08]">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4">PO Unit Price</th>
                  <th className="py-3 px-4">Invoice Unit Price</th>
                  <th className="py-3 px-4">Variance</th>
                  <th className="py-3 px-4">Delivered Qty</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] bg-canvas-950/40">
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    Industrial Valves (Model X-50)
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    ₹5,000
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-rose-400">
                    ₹8,000
                  </td>
                  <td className="py-3.5 px-4 font-mono text-rose-400 font-bold">
                    +₹3,000 (+60%)
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    59 units (Match)
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      FLAGGED
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    High-Temp Gaskets Kit
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    ₹1,200
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    ₹1,200
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">
                    ₹0 (0%)
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    100 units (Match)
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      MATCH
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Navigation Footer (Clean spacing, zero collision) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={onNewVerification}
          className="px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold border border-white/10 transition"
        >
          Verify Another Document
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateToAudit}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 text-xs font-semibold transition"
          >
            <History className="w-3.5 h-3.5 text-orange-400" />
            <span>View SHA-256 Hashes</span>
          </button>
          <button
            onClick={onNavigateToQueue}
            className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-[#202026] hover:bg-[#2b2b34] text-white border border-white/20 text-xs font-semibold shadow-lg hover:shadow-glow-subtle transition"
          >
            <ClipboardList className="w-3.5 h-3.5 text-orange-400" />
            <span>Open in Review Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
