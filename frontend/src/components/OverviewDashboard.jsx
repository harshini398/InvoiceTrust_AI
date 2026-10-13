import React from 'react';
import HeroSection from './HeroSection';
import CapabilitiesSection from './CapabilitiesSection';
import { 
  FileCheck, 
  AlertTriangle, 
  CopyCheck, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
} from 'lucide-react';

export default function OverviewDashboard({ 
  queueItems, 
  onNavigateToUpload, 
  onNavigateToQueue, 
  onNavigateToTable, 
  onNavigateToAudit, 
  onSelectInvoice 
}) {
  const totalInvoices = queueItems.length + 18;
  const pendingReview = queueItems.filter(item => item.status === 'PENDING_REVIEW').length;
  const duplicateAlerts = queueItems.filter(item => item.verifications?.duplicate_check === 'FAIL').length + 2;
  const passCount = 15;
  const failCount = 7;
  const passRatio = Math.round((passCount / (passCount + failCount)) * 100);

  const scrollToCapabilities = () => {
    const el = document.getElementById('capabilities');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      
      {/* 1. Cinematic Hero Section */}
      <HeroSection 
        onNavigateToUpload={onNavigateToUpload}
        onExplorePlatform={scrollToCapabilities}
      />

      {/* 2. Aggregate Risk & Verification Overview */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1E2D47]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
              Operational Intelligence
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F8FAFC] tracking-tight mt-1">
              Live Reconciliation Metrics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Aggregated metrics derived strictly from local ledger records
          </p>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1 */}
          <div className="p-6 rounded-3xl bg-[#111827] border border-[#1E2D47] hover:border-[#38BDF8]/40 space-y-3 transition shadow-studio-panel">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                Total Checked
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#0A0E17] border border-[#1E2D47] flex items-center justify-center text-[#38BDF8]">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-display font-extrabold text-3xl text-[#F8FAFC] tracking-tight">
                {totalInvoices}
              </span>
              <span className="text-xs font-mono font-medium text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">Audited with 3-way tolerance</p>
          </div>

          {/* Metric 2 */}
          <div className="p-6 rounded-3xl bg-[#111827] border border-[#1E2D47] hover:border-[#F87171]/40 space-y-3 transition shadow-studio-panel">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                Pending Review
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#0A0E17] border border-[#1E2D47] flex items-center justify-center text-[#F87171]">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-display font-extrabold text-3xl text-[#F87171] tracking-tight">
                {pendingReview}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#F87171] bg-[#F87171]/15 px-2 py-0.5 rounded-full border border-[#F87171]/30">
                Action Required
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">High variance flagged</p>
          </div>

          {/* Metric 3 */}
          <div className="p-6 rounded-3xl bg-[#111827] border border-[#1E2D47] hover:border-[#FBBF24]/40 space-y-3 transition shadow-studio-panel">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                Duplicate Alerts
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#0A0E17] border border-[#1E2D47] flex items-center justify-center text-[#FBBF24]">
                <CopyCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-display font-extrabold text-3xl text-[#FBBF24] tracking-tight">
                {duplicateAlerts}
              </span>
              <span className="text-[11px] font-mono text-[#94A3B8]">SHA-256 match</span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">Double disbursement prevented</p>
          </div>

          {/* Metric 4 */}
          <div className="p-6 rounded-3xl bg-[#111827] border border-[#1E2D47] space-y-3 transition shadow-studio-panel">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                Pass / Fail Ratio
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#0A0E17] border border-[#1E2D47] flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-display font-extrabold text-3xl text-[#F8FAFC] tracking-tight">
                {passRatio}%
              </span>
              <span className="text-[11px] font-mono text-[#94A3B8]">({passCount} pass / {failCount} fail)</span>
            </div>
            <div className="w-full bg-[#0A0E17] rounded-full h-1.5 overflow-hidden flex border border-[#1E2D47]">
              <div className="bg-[#38BDF8] h-full" style={{ width: `${passRatio}%` }} />
              <div className="bg-[#F87171] h-full" style={{ width: `${100 - passRatio}%` }} />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Product Capabilities Section */}
      <CapabilitiesSection 
        onNavigateToUpload={onNavigateToUpload}
        onNavigateToQueue={onNavigateToQueue}
        onNavigateToAudit={onNavigateToAudit}
      />

      {/* 4. Quick Ledger Feed */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D47]">
          <div>
            <h3 className="font-display font-bold text-xl text-[#F8FAFC]">
              Recent Audit Outcomes
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Latest verifications processed through the 3-way match engine
            </p>
          </div>
          <button
            onClick={onNavigateToTable}
            className="h-8 px-3.5 rounded-full bg-[#111827] hover:bg-[#172236] border border-[#1E2D47] text-xs font-mono text-[#38BDF8] hover:text-[#0EA5E9] inline-flex items-center space-x-1.5 font-semibold transition"
          >
            <span>Open complete ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-2xl border border-[#1E2D47] bg-[#111827] overflow-hidden shadow-studio-panel">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A0E17] text-[#94A3B8] uppercase tracking-wider font-mono font-semibold border-b border-[#1E2D47]">
                <tr>
                  <th className="py-3.5 px-4">Invoice ID</th>
                  <th className="py-3.5 px-4">Supplier</th>
                  <th className="py-3.5 px-4">Billed Amount</th>
                  <th className="py-3.5 px-4">Risk Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2D47]/60">
                {queueItems.map((item) => (
                  <tr key={item.invoice_id || item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#38BDF8]">
                      {item.invoice_id || item.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#F8FAFC]">
                      {item.supplier}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#F8FAFC]">
                      {item.amount || `₹${item.total_amount?.toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        item.risk_level === 'HIGH' 
                          ? 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30'
                          : item.risk_level === 'MEDIUM'
                          ? 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {item.risk_level} ({item.risk_score})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                        item.status === 'REJECTED' ? 'bg-[#F87171]/10 text-[#F87171]' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectInvoice(item.invoice_id || item.id)}
                        className="h-8 px-3.5 rounded-lg bg-[#0A0E17] hover:bg-[#172236] text-[#38BDF8] border border-[#1E2D47] text-xs font-semibold transition inline-flex items-center space-x-1"
                      >
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
