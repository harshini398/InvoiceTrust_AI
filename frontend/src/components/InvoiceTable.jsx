import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpRight, 
} from 'lucide-react';

export default function InvoiceTable({ invoices, onSelectInvoice }) {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  const filteredInvoices = invoices.filter((item) => {
    const matchesSearch = 
      item.invoice_id.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    
    const matchesRisk = riskFilter === 'ALL' || item.risk_level === riskFilter;
    const matchesPayment = paymentFilter === 'ALL' || item.payment_status === paymentFilter;

    return matchesSearch && matchesRisk && matchesPayment;
  });

  return (
    <div className="space-y-6">
      
      {/* Table Header & Controls Bar (Strict h-10 alignment on all controls) */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-[#1E2D47] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
            Financial Operations Ledger
          </h3>
          <p className="text-xs text-[#94A3B8]">
            Direct mirror of SQLite <code className="text-[#38BDF8] font-mono">invoices</code> table records
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search supplier or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-[#0A0E17] border border-[#1E2D47] rounded-xl pl-9 pr-3 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8]/50 transition box-border"
            />
          </div>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="h-10 bg-[#0A0E17] border border-[#1E2D47] rounded-xl px-3 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]/50 box-border cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-10 bg-[#0A0E17] border border-[#1E2D47] rounded-xl px-3 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]/50 box-border cursor-pointer"
          >
            <option value="ALL">All Payments</option>
            <option value="UNPAID">UNPAID</option>
            <option value="PAID">PAID</option>
            <option value="HELD">HELD</option>
          </select>
        </div>
      </div>

      {/* Operations Data Table */}
      <div className="rounded-2xl border border-[#1E2D47] bg-[#111827]/70 overflow-hidden shadow-studio-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0E17] text-[#94A3B8] uppercase tracking-wider font-mono font-semibold border-b border-[#1E2D47]">
              <tr>
                <th className="py-3.5 px-4">Invoice ID</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4 text-right">Billed Amount</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Review Status</th>
                <th className="py-3.5 px-4">Ingested At</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D47]/60">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr 
                    key={inv.invoice_id} 
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-[#38BDF8]">
                      {inv.invoice_id}
                    </td>
                    <td className="py-4 px-4 font-medium text-[#F8FAFC]">
                      {inv.supplier}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-[#F8FAFC] text-right">
                      {inv.amount || `₹${Number(inv.total_amount).toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-4 px-4 font-mono text-center">
                      <span className="font-bold text-[#F8FAFC]">{inv.risk_score}</span>
                      <span className="text-[#94A3B8] text-[10px]"> / 100</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono border ${
                        inv.risk_level === 'HIGH'
                          ? 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30'
                          : inv.risk_level === 'MEDIUM'
                          ? 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {inv.risk_level}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        inv.payment_status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : inv.payment_status === 'HELD'
                          ? 'bg-[#F87171]/10 text-[#F87171]'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {inv.payment_status || 'UNPAID'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[11px] text-[#94A3B8]">
                        {inv.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-[#94A3B8] whitespace-nowrap">
                      {inv.created_at || inv.date}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onSelectInvoice(inv.invoice_id)}
                        className="h-8 px-3.5 rounded-lg bg-[#0A0E17] hover:bg-[#172236] text-[#38BDF8] border border-[#1E2D47] text-xs font-semibold transition inline-flex items-center space-x-1 ml-auto box-border"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#94A3B8]">
                    No invoices matching the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
