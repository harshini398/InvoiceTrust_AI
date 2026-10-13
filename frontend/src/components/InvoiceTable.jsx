import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Clock,
  DollarSign
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
      
      {/* Table Header & Controls Bar */}
      <div className="p-5 rounded-2xl bg-[#182821] border border-[#23352C] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg text-[#F4F5F0]">
            Financial Operations Ledger
          </h3>
          <p className="text-xs text-[#89948C]">
            Direct mirror of SQLite <code className="text-[#D9F99D] font-mono">invoices</code> table records
          </p>
        </div>

        {/* Search & Filters (Zero collision) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#89948C] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search supplier or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#101915] border border-[#23352C] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F4F5F0] placeholder-[#89948C] focus:outline-none focus:border-[#D9F99D]/50 transition"
            />
          </div>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-[#101915] border border-[#23352C] rounded-xl px-3 py-2 text-xs text-[#F4F5F0] focus:outline-none focus:border-[#D9F99D]/50"
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
            className="bg-[#101915] border border-[#23352C] rounded-xl px-3 py-2 text-xs text-[#F4F5F0] focus:outline-none focus:border-[#D9F99D]/50"
          >
            <option value="ALL">All Payments</option>
            <option value="UNPAID">UNPAID</option>
            <option value="PAID">PAID</option>
            <option value="HELD">HELD</option>
          </select>
        </div>
      </div>

      {/* Operations Data Table */}
      <div className="rounded-2xl border border-[#23352C] bg-[#182821]/70 overflow-hidden shadow-studio-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101915] text-[#89948C] uppercase tracking-wider font-mono font-semibold border-b border-[#23352C]">
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
            <tbody className="divide-y divide-[#23352C]/60">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr 
                    key={inv.invoice_id} 
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-[#D9F99D]">
                      {inv.invoice_id}
                    </td>
                    <td className="py-4 px-4 font-medium text-[#F4F5F0]">
                      {inv.supplier}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-[#F4F5F0] text-right">
                      {inv.amount || `₹${Number(inv.total_amount).toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-4 px-4 font-mono text-center">
                      <span className="font-bold text-[#F4F5F0]">{inv.risk_score}</span>
                      <span className="text-[#89948C] text-[10px]"> / 100</span>
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
                      <span className="text-[11px] text-[#89948C]">
                        {inv.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-[#89948C] whitespace-nowrap">
                      {inv.created_at || inv.date}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onSelectInvoice(inv.invoice_id)}
                        className="px-3 py-1 rounded-lg bg-[#101915] hover:bg-[#1E342B] text-[#D9F99D] border border-[#23352C] text-xs font-semibold transition flex items-center space-x-1 ml-auto"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#89948C]">
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
