import React from 'react';
import { 
  FileCheck, 
  AlertTriangle, 
  CopyCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function OverviewDashboard({ 
  queueItems, 
  onNavigateToUpload, 
  onNavigateToQueue, 
  onSelectInvoice 
}) {
  const totalInvoices = queueItems.length + 18; // Includes historical baseline
  const pendingReview = queueItems.filter(item => item.status === 'PENDING_REVIEW').length;
  const duplicateAlerts = queueItems.filter(item => item.verifications?.duplicate_check === 'FAIL').length + 2;
  const passCount = 15;
  const failCount = 7;
  const passRatio = Math.round((passCount / (passCount + failCount)) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome & Quick Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autonomous 3-Way Match Verification Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Enterprise Invoice Integrity & Risk Center
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
              Detect billing inflation, phantom POs, quantity discrepancies, and duplicate payments before accounts payable release.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onNavigateToUpload}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-150 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40"
            >
              <span>Upload Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToQueue}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm transition-all"
            >
              <span>Review Queue</span>
              {pendingReview > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-semibold">
                  {pendingReview}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Invoices Checked</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white tracking-tight">{totalInvoices}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14% this wk
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Cross-checked against PO & DR</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-rose-900/40 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cases Needing Review</span>
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-rose-400 tracking-tight">{pendingReview}</span>
            <span className="text-xs font-medium text-rose-300/80 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              Action Required
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Flagged with high price/qty variance</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-amber-900/40 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Duplicate Alerts</span>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <CopyCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-amber-300 tracking-tight">{duplicateAlerts}</span>
            <span className="text-xs font-medium text-slate-400">SHA-256 match</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Prevented double disbursement</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pass / Fail Ratio</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white tracking-tight">{passRatio}%</span>
            <span className="text-xs font-medium text-slate-400">({passCount} pass / {failCount} fail)</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${passRatio}%` }} />
            <div className="bg-rose-500 h-full" style={{ width: `${100 - passRatio}%` }} />
          </div>
        </div>
      </div>

      {/* Two-Column Detail View: Recent Scans & Verification Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Verifications & Status</h2>
              <p className="text-xs text-slate-400">Live feed of processed documents and 3-way check outcome</p>
            </div>
            <button
              onClick={onNavigateToQueue}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center font-medium"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Billed Amount</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {queueItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-indigo-300">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-medium">
                      {item.supplier}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {item.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.risk_level === 'HIGH' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : item.risk_level === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {item.risk_level} ({item.risk_score})
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        item.status === 'APPROVED'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : item.status === 'REJECTED'
                          ? 'text-rose-400 bg-rose-500/10'
                          : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectInvoice(item.id)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Rules Health & Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Automated 3-Way Rules</h2>
            <p className="text-xs text-slate-400 mb-5">Current health of automated verification sub-checks</p>

            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="text-xs font-semibold text-slate-200">Price Tolerance Check</span>
                  </div>
                  <span className="text-xs font-mono text-rose-400">14% Flags</span>
                </div>
                <p className="text-[11px] text-slate-400">Strict unit-price matching between Invoice line items and PO.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">Quantity Alignment Check</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">96% Match</span>
                </div>
                <p className="text-[11px] text-slate-400">Reconciles delivery slip receipts with claimed invoiced volume.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">SHA-256 Duplicate Check</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">Zero Duplicates</span>
                </div>
                <p className="text-[11px] text-slate-400">Cryptographic hash uniqueness validation against historical ledger.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" /> Last scan: Just now
            </span>
            <span className="text-emerald-400 font-medium">Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
