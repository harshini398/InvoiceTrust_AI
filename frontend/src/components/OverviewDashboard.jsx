import React from 'react';
import { 
  FileCheck, 
  AlertTriangle, 
  CopyCheck, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  Sparkles,
  Check,
  ShieldCheck,
  Layers,
  FileText,
  Zap,
  Activity
} from 'lucide-react';

export default function OverviewDashboard({ 
  queueItems, 
  onNavigateToUpload, 
  onNavigateToQueue, 
  onSelectInvoice 
}) {
  const totalInvoices = queueItems.length + 18;
  const pendingReview = queueItems.filter(item => item.status === 'PENDING_REVIEW').length;
  const duplicateAlerts = queueItems.filter(item => item.verifications?.duplicate_check === 'FAIL').length + 2;
  const passCount = 15;
  const failCount = 7;
  const passRatio = Math.round((passCount / (passCount + failCount)) * 100);

  // Badges matching the left side of the user's Vectra screenshot
  const featureBadges = [
    "3-Way Auto Match",
    "SHA-256 Ledger Sealed",
    "Strict Price Tolerance",
    "Discrepancy Highlighting",
    "Human-in-the-Loop Review"
  ];

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      
      {/* Hero Section matching the Vectra screenshot */}
      <section className="relative text-center pt-6 pb-4 sm:pt-12 sm:pb-8">
        
        {/* Ambient Top Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-64 bg-orange-600/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Small Pill Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.09] text-slate-300 text-xs font-medium mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Next-Generation AP Fraud Detection</span>
        </div>

        {/* Main Headline (Vectra Typography Style) */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-5">
          Verify, Reconcile, and Execute Smarter with AI Canvas
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          InvoiceTrust AI is an intelligent canvas that helps finance and audit teams plan, verify, and automate multi-document workflows—faster, clearer, and more collaboratively.
        </p>

        {/* Action Buttons (Separated, Zero Collision) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={onNavigateToUpload}
            className="px-6 py-3 rounded-full bg-[#202026] hover:bg-[#2a2a34] text-white border border-white/20 hover:border-white/30 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 shadow-lg hover:shadow-glow-subtle flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </button>

          <button
            onClick={onNavigateToQueue}
            className="px-6 py-3 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <span>Review Flagged Cases</span>
            {pendingReview > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-semibold">
                {pendingReview}
              </span>
            )}
          </button>
        </div>

        {/* Feature Badges Row (Exact design from the screenshot's left side) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
          {featureBadges.map((badge, idx) => (
            <div 
              key={idx}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 text-xs backdrop-blur-md hover:border-white/20 transition cursor-default"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center text-slate-200">
                <Check className="w-2.5 h-2.5 text-orange-400 stroke-[3]" />
              </div>
              <span className="font-normal text-slate-300">{badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Core Metric Cards (Sleek Frosted Glass Widgets) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Invoices Checked</span>
            <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-orange-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white tracking-tight font-mono">{totalInvoices}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14% this wk
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Cross-verified against PO & DR</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cases Needing Review</span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-rose-400 tracking-tight font-mono">{pendingReview}</span>
            <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
              Action Required
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Flagged with unit price / qty variance</p>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Duplicate Alerts</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <CopyCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-amber-300 tracking-tight font-mono">{duplicateAlerts}</span>
            <span className="text-[11px] font-mono text-slate-400">SHA-256 match</span>
          </div>
          <p className="text-[11px] text-slate-500">Tamper & double disbursement guard</p>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pass / Fail Ratio</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white tracking-tight font-mono">{passRatio}%</span>
            <span className="text-[11px] text-slate-400">({passCount} pass / {failCount} fail)</span>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden flex">
            <div className="bg-emerald-400 h-full" style={{ width: `${passRatio}%` }} />
            <div className="bg-rose-500 h-full" style={{ width: `${100 - passRatio}%` }} />
          </div>
        </div>
      </section>

      {/* Two-Column Section: Live Verifications Table & Rules Health */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Verifications Table (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">Recent Verifications & Status</h2>
              <p className="text-xs text-slate-400">Real-time ledger of processed documents and 3-way match outcomes</p>
            </div>
            <button
              onClick={onNavigateToQueue}
              className="text-xs text-slate-300 hover:text-white flex items-center font-medium self-start sm:self-auto transition"
            >
              <span>View queue</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-orange-400" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-white/[0.08]">
                <tr>
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Billed Amount</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {queueItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-orange-300">
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
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        item.status === 'APPROVED'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : item.status === 'REJECTED'
                          ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectInvoice(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs transition"
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

        {/* Automated Rules Card (1 col) */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">Automated Rules Canvas</h2>
              <p className="text-xs text-slate-400">Strict tolerance verification thresholds</p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-canvas-950/60 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-200">Price Check Rule</span>
                  <span className="text-[11px] font-mono text-rose-400">Strict 0% Variance</span>
                </div>
                <p className="text-[11px] text-slate-400">Unit rate comparison between invoice line items and PO.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-canvas-950/60 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-200">Quantity Alignment</span>
                  <span className="text-[11px] font-mono text-emerald-400">Tolerance: Exact</span>
                </div>
                <p className="text-[11px] text-slate-400">Reconciles delivery slip receipts with claimed invoiced volume.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-canvas-950/60 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-200">SHA-256 Ledger Match</span>
                  <span className="text-[11px] font-mono text-emerald-400">Zero Duplicates</span>
                </div>
                <p className="text-[11px] text-slate-400">Cryptographic hash uniqueness against past billing cycles.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center font-mono">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Active
            </span>
            <span className="text-emerald-400 font-medium">3-Way Match Armed</span>
          </div>
        </div>

      </section>
    </div>
  );
}
