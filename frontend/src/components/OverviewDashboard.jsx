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
  Play,
  FileText,
  Lock,
  ChevronRight,
  Building2
} from 'lucide-react';

export default function OverviewDashboard({ 
  queueItems, 
  onNavigateToUpload, 
  onNavigateToQueue, 
  onNavigateToAudit,
  onNavigateToReport,
  onSelectInvoice 
}) {
  const totalInvoices = queueItems.length + 18;
  const pendingReview = queueItems.filter(item => item.status === 'PENDING_REVIEW').length;
  const duplicateAlerts = queueItems.filter(item => item.verifications?.duplicate_check === 'FAIL').length + 2;
  const passCount = 15;
  const failCount = 7;
  const passRatio = Math.round((passCount / (passCount + failCount)) * 100);

  return (
    <div className="space-y-12 animate-fadeIn relative">
      
      {/* Hero Section matching the reference screenshot */}
      <section className="relative pt-6 pb-8 md:pt-10 md:pb-14 text-center max-w-5xl mx-auto px-4">
        
        {/* Ambient Neon Arc/Curve in Background matching screenshot */}
        <div className="absolute right-4 md:right-16 top-6 w-64 h-64 md:w-80 md:h-80 pointer-events-none opacity-40 md:opacity-60">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path 
              d="M 170 30 C 190 80 150 160 80 180 C 40 190 20 160 30 120" 
              stroke="url(#arc-gradient)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              filter="url(#glow)"
            />
            <defs>
              <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#00F59B" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Hero Title with exact typography style from screenshot */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-[1.15] max-w-4xl mx-auto">
          Autonomous 3-Way Match Software to{' '}
          <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-[#00F59B] bg-clip-text text-transparent drop-shadow-sm">
            Eliminate Invoice Fraud
          </span>{' '}
          and Protect Accounts Payable
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300/80 max-w-2xl mx-auto font-normal leading-relaxed">
          AI-driven cross verification between vendor Invoices, Purchase Orders, and Delivery Receipts with cryptographic SHA-256 tamper prevention.
        </p>

        {/* Center Pill Button matching "HOW IT WORKS ▶" in screenshot */}
        <div className="mt-8 flex items-center justify-center space-x-4">
          <button
            onClick={onNavigateToUpload}
            className="group inline-flex items-center space-x-3 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-full shadow-2xl transition duration-150 transform hover:scale-[1.02] active:scale-95"
          >
            <span>HOW IT WORKS</span>
            <span className="w-6 h-6 rounded-full bg-[#00F59B] text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Play className="w-3 h-3 fill-slate-950 ml-0.5" />
            </span>
          </button>
        </div>
      </section>

      {/* Floating Dashboard Cards Preview Dock (matching bottom half of screenshot) */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Card 1: Fund Type / Overview Metrics (Left - 3 Cols) */}
          <div className="lg:col-span-3 glass-card rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metrics Snapshot</span>
                <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
              </div>
              
              <div>
                <div className="text-3xl font-display font-bold text-white tracking-tight">{totalInvoices}</div>
                <p className="text-xs text-slate-400 mt-0.5">Total Invoices Checked</p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Verification Rate</span>
                  <span className="font-semibold text-[#00F59B]">{passRatio}%</span>
                </div>
                <div className="w-full bg-[#0c142b] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#00F59B] h-full rounded-full" style={{ width: `${passRatio}%` }} />
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToUpload}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition flex items-center justify-center space-x-1"
            >
              <span>Ingest Batch</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Card 2: Main Featured Case (Taller Center Card - 4 Cols) */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative border-blue-500/30 group hover:border-blue-400/50 transition-all">
            <div className="space-y-4">
              {/* Badges matching screenshot "Invested ✓" and "View investment" */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Reconciled
                </span>
                <span className="text-xs font-mono text-slate-400">INV-1042</span>
              </div>

              {/* Case Visual Card Container */}
              <div className="rounded-2xl bg-gradient-to-b from-[#0e1733] to-[#070c1d] border border-blue-500/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">ABC Traders</h3>
                    <p className="text-[11px] text-slate-400">Hardware & Industrial Valves</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">₹4,72,000</span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-start space-x-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">Unit price ₹8,000 exceeds approved PO ₹5,000 (+60% variance)</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <span>Risk Score:</span>
                  <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">75 / 100 (HIGH)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectInvoice('INV-1042')}
              className="mt-4 w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition flex items-center justify-center space-x-1.5"
            >
              <span>View Full Investigation</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00F59B]" />
            </button>
          </div>

          {/* Card 3: Capital Calls & Reports (Mid-Right - 2.5 Cols) */}
          <div className="lg:col-span-2.5 space-y-4 flex flex-col justify-between">
            {/* Upper: Duplicate Prevention */}
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Duplicate Ledger</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-display font-bold text-amber-300">{duplicateAlerts}</span>
                <span className="text-[10px] text-slate-400">Blocked</span>
              </div>
              <p className="text-[11px] text-slate-400">SHA-256 prevents duplicate disbursement claims.</p>
            </div>

            {/* Lower: Reports / Audit Trail (matching PDF report card in screenshot) */}
            <div 
              onClick={onNavigateToAudit}
              className="glass-card rounded-2xl p-4 space-y-3 cursor-pointer hover:border-blue-400/40 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Audit Proofs</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PDF / HASH
                </span>
              </div>
              <p className="text-xs text-white font-medium group-hover:text-[#00F59B] transition flex items-center justify-between">
                <span>SHA-256 Ledger Logs</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00F59B]" />
              </p>
            </div>
          </div>

          {/* Card 4: Open Offerings / Review Queue (Far Right - 2.5 Cols) */}
          <div className="lg:col-span-2.5 glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Review Queue</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400">
                  {pendingReview} Pending
                </span>
              </div>

              <div className="space-y-2.5">
                {queueItems.slice(0, 2).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => onSelectInvoice(item.id)}
                    className="p-2.5 rounded-xl bg-[#080e1f] border border-white/5 hover:border-white/20 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white truncate max-w-[110px]">{item.supplier}</span>
                      <span className="text-[10px] font-mono text-rose-400">{item.risk_score}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onNavigateToQueue}
              className="w-full py-2.5 rounded-xl bg-[#00F59B]/10 hover:bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B]/30 text-xs font-bold transition text-center"
            >
              Open Queue Console
            </button>
          </div>

        </div>
      </section>

      {/* Comprehensive Recent Transactions Data Table */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Live 3-Way Reconciliation Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">Automated document verification against PO pricing rules and warehouse slips</p>
          </div>
          <button
            onClick={onNavigateToQueue}
            className="text-xs text-[#00F59B] hover:underline flex items-center font-semibold self-start sm:self-auto"
          >
            <span>Inspect All Cases</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10 pb-3">
              <tr>
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">Billed Amount</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {queueItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-sky-400">
                    {item.id}
                  </td>
                  <td className="py-4 px-4 text-slate-200 font-medium">
                    {item.supplier}
                  </td>
                  <td className="py-4 px-4 text-white font-mono font-semibold">
                    {item.amount}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      item.risk_level === 'HIGH' 
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : item.risk_level === 'MEDIUM'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30'
                    }`}>
                      {item.risk_level} ({item.risk_score})
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      item.status === 'APPROVED'
                        ? 'text-[#00F59B] bg-[#00F59B]/10 border border-[#00F59B]/20'
                        : item.status === 'REJECTED'
                        ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                        : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onSelectInvoice(item.id)}
                      className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
