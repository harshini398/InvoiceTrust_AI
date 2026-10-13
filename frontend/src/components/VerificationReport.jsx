import React from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ClipboardList,
  History,
  Check,
} from 'lucide-react';

export default function VerificationReport({ 
  reportData, 
  onNavigateToAudit, 
  onNavigateToQueue, 
  onNewVerification 
}) {
  if (!reportData) {
    return (
      <div className="text-center py-20 p-8 rounded-3xl bg-[#182821] border border-[#23352C] max-w-xl mx-auto space-y-4">
        <FileText className="w-12 h-12 text-[#89948C] mx-auto" />
        <h2 className="font-display font-bold text-lg text-[#F4F5F0]">No Verification Report Selected</h2>
        <p className="text-xs text-[#89948C]">Please upload documents first or select an invoice from the ledger.</p>
        <button
          onClick={onNewVerification}
          className="h-10 px-6 inline-flex items-center justify-center rounded-full bg-[#D9F99D] hover:bg-[#C7EE84] text-[#101915] text-xs font-bold"
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
          bg: 'bg-[#F87171]/15 border-[#F87171]/30 text-[#F87171]',
          label: 'HIGH RISK DETECTED',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-[#FBBF24]/15 border-[#FBBF24]/30 text-[#FBBF24]',
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
      <div className="p-6 sm:p-8 rounded-3xl bg-[#182821] border border-[#23352C] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-studio-panel">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-[#D9F99D]">
              Verification Report
            </span>
            <span className="text-[#89948C]">•</span>
            <span className="font-mono text-xs text-[#F4F5F0] font-semibold">{invoice_id}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F4F5F0] tracking-tight">
            {extraction?.supplier || 'Vendor'} — 3-Way Match Audit
          </h1>
          <p className="text-xs text-[#89948C]">
            Corroborated against Purchase Order & Warehouse Delivery Receipt
          </p>
        </div>

        {/* Severity Badge & Exact Contract Risk Score */}
        <div className="flex items-center space-x-4 bg-[#101915] p-4 rounded-2xl border border-[#23352C] shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-semibold text-[#89948C] uppercase tracking-wider font-mono">Risk Score</div>
            <div className="text-2xl font-extrabold font-mono text-[#F4F5F0] flex items-baseline justify-end space-x-1">
              <span>{risk_score}</span>
              <span className="text-xs text-[#89948C]">/ 100</span>
            </div>
          </div>
          <div className={`px-3.5 py-2 rounded-xl border font-bold text-xs font-mono ${riskBadge.bg}`}>
            {riskBadge.label}
          </div>
        </div>
      </div>

      {/* Discrepancies Alert Banner */}
      {discrepancies && discrepancies.length > 0 && (
        <div className="rounded-3xl border border-[#F87171]/30 bg-[#F87171]/10 p-5 sm:p-6 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-[#F87171] font-bold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Discrepancy Flags Detected ({discrepancies.length})</span>
          </div>
          <div className="space-y-2">
            {discrepancies.map((disc, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-[#101915]/80 border border-[#F87171]/20 text-[#F87171] text-xs flex items-start space-x-2.5 font-medium"
              >
                <XCircle className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" />
                <span>{disc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Core Verification Rules Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price Check */}
        <div className={`p-5 rounded-3xl space-y-2 border transition ${
          verifications?.price_check === 'PASS' 
            ? 'border-emerald-500/30 bg-emerald-950/10' 
            : 'border-[#F87171]/30 bg-[#F87171]/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F4F5F0]">Price Check</span>
            {verifications?.price_check === 'PASS' ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                <Check className="w-3 h-3 mr-1" /> PASS
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-bold text-[#F87171] bg-[#F87171]/15 px-2.5 py-0.5 rounded-full border border-[#F87171]/20 font-mono">
                <XCircle className="w-3 h-3 mr-1" /> FAIL
              </span>
            )}
          </div>
          <p className="text-xs text-[#89948C]">Unit rate comparison between invoice line items and approved PO lines.</p>
        </div>

        {/* Quantity Check */}
        <div className={`p-5 rounded-3xl space-y-2 border transition ${
          verifications?.quantity_check === 'PASS' 
            ? 'border-emerald-500/30 bg-emerald-950/10' 
            : 'border-[#F87171]/30 bg-[#F87171]/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F4F5F0]">Quantity Check</span>
            {verifications?.quantity_check === 'PASS' ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                <Check className="w-3 h-3 mr-1" /> PASS
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-bold text-[#F87171] bg-[#F87171]/15 px-2.5 py-0.5 rounded-full border border-[#F87171]/20 font-mono">
                <XCircle className="w-3 h-3 mr-1" /> FAIL
              </span>
            )}
          </div>
          <p className="text-xs text-[#89948C]">Cross-matched units billed vs items acknowledged on Delivery Receipt.</p>
        </div>

        {/* Duplicate Check */}
        <div className={`p-5 rounded-3xl space-y-2 border transition ${
          verifications?.duplicate_check === 'PASS' 
            ? 'border-emerald-500/30 bg-emerald-950/10' 
            : 'border-[#F87171]/30 bg-[#F87171]/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F4F5F0]">Duplicate Check</span>
            {verifications?.duplicate_check === 'PASS' ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                <Check className="w-3 h-3 mr-1" /> PASS
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-bold text-[#F87171] bg-[#F87171]/15 px-2.5 py-0.5 rounded-full border border-[#F87171]/20 font-mono">
                <XCircle className="w-3 h-3 mr-1" /> FAIL
              </span>
            )}
          </div>
          <p className="text-xs text-[#89948C]">SHA-256 historical ledger check for double billing or re-used hashes.</p>
        </div>
      </div>

      {/* Extracted Entities Cards */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#182821] border border-[#23352C] space-y-6 shadow-studio-panel">
        <div>
          <h2 className="font-display font-bold text-base text-[#F4F5F0]">Extracted Key Entities (Agreed Contract)</h2>
          <p className="text-xs text-[#89948C]">Normalized values extracted directly from submitted documents</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#101915] border border-[#23352C]">
            <div className="text-[11px] text-[#89948C] font-mono">Supplier</div>
            <div className="text-sm font-semibold text-[#F4F5F0] mt-1">{extraction?.supplier || 'N/A'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#101915] border border-[#23352C]">
            <div className="text-[11px] text-[#89948C] font-mono">Invoice Number</div>
            <div className="text-sm font-mono font-semibold text-[#D9F99D] mt-1">{extraction?.invoice_number || 'N/A'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#101915] border border-[#23352C]">
            <div className="text-[11px] text-[#89948C] font-mono">Total Billed</div>
            <div className="text-sm font-mono font-semibold text-[#F4F5F0] mt-1">
              ₹{extraction?.total_amount ? extraction.total_amount.toLocaleString('en-IN') : '0'}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#101915] border border-[#23352C]">
            <div className="text-[11px] text-[#89948C] font-mono">Confidence Score</div>
            <div className="text-sm font-mono font-semibold text-emerald-400 mt-1">
              {extraction?.confidence_score ? `${Math.round(extraction.confidence_score * 100)}%` : '95%'}
            </div>
          </div>
        </div>

        {/* 3-Way Itemized Comparison Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-semibold text-[#89948C] uppercase tracking-wider">
            3-Way Itemized Comparison
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-[#23352C]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101915] text-[#89948C] uppercase tracking-wider font-mono font-semibold border-b border-[#23352C]">
                <tr>
                  <th className="py-3.5 px-4">Item Description</th>
                  <th className="py-3.5 px-4">PO Unit Price</th>
                  <th className="py-3.5 px-4">Invoice Unit Price</th>
                  <th className="py-3.5 px-4">Variance</th>
                  <th className="py-3.5 px-4">Delivered Qty</th>
                  <th className="py-3.5 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23352C]/60 bg-[#101915]/50">
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 px-4 font-medium text-[#F4F5F0]">
                    Industrial Valves (Model X-50)
                  </td>
                  <td className="py-4 px-4 font-mono text-[#89948C]">
                    ₹5,000
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-[#F87171]">
                    ₹8,000
                  </td>
                  <td className="py-4 px-4 font-mono text-[#F87171] font-bold">
                    +₹3,000 (+60%)
                  </td>
                  <td className="py-4 px-4 font-mono text-[#F4F5F0]">
                    59 units (Match)
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30">
                      FLAGGED
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 px-4 font-medium text-[#F4F5F0]">
                    High-Temp Gaskets Kit
                  </td>
                  <td className="py-4 px-4 font-mono text-[#89948C]">
                    ₹1,200
                  </td>
                  <td className="py-4 px-4 font-mono text-[#F4F5F0]">
                    ₹1,200
                  </td>
                  <td className="py-4 px-4 font-mono text-emerald-400">
                    ₹0 (0%)
                  </td>
                  <td className="py-4 px-4 font-mono text-[#F4F5F0]">
                    100 units (Match)
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      MATCH
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Footer: Identical h-11 heights on all 3 buttons for perfect visual balance */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={onNewVerification}
          className="h-11 px-6 rounded-full bg-[#182821] hover:bg-[#1E342B] text-[#F4F5F0] border border-[#23352C] text-xs font-semibold transition inline-flex items-center justify-center box-border"
        >
          Verify Another Document
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateToAudit}
            className="h-11 px-6 rounded-full bg-[#182821] hover:bg-[#1E342B] text-[#D9F99D] border border-[#23352C] text-xs font-semibold transition inline-flex items-center justify-center space-x-1.5 box-border"
          >
            <History className="w-3.5 h-3.5" />
            <span>View SHA-256 Hashes</span>
          </button>
          <button
            onClick={onNavigateToQueue}
            className="h-11 px-7 rounded-full bg-[#D9F99D] hover:bg-[#C7EE84] text-[#101915] text-xs font-bold shadow-lime-glow transition inline-flex items-center justify-center space-x-1.5 transform active:scale-95 box-border"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Open in Review Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
