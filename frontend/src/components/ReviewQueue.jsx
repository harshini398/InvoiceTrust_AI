import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Send, 
  MessageSquare,
} from 'lucide-react';

export default function ReviewQueue({ queueItems, onRecordDecision }) {
  const [selectedId, setSelectedId] = useState(queueItems[0]?.invoice_id || queueItems[0]?.id || null);
  const [reason, setReason] = useState('');
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const selectedCase = queueItems.find((item) => (item.invoice_id === selectedId || item.id === selectedId)) || queueItems[0];

  const filteredList = queueItems.filter((item) => {
    const matchesSearch = 
      (item.invoice_id || item.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && item.status === filterStatus;
  });

  const handleSubmitDecision = (e) => {
    e.preventDefault();
    if (!selectedDecision) {
      alert("Please select either 'Approve' or 'Reject' before submitting.");
      return;
    }
    if (!reason.trim()) {
      alert("Please enter an explanation / audit justification for your decision.");
      return;
    }

    onRecordDecision(selectedCase.invoice_id || selectedCase.id, selectedDecision, reason.trim());
    setReason('');
    setSelectedDecision(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D47]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
            Human-in-the-Loop Governance
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F8FAFC] tracking-tight mt-1">
            Flagged Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Investigate automated discrepancy flags, inspect evidence, and log immutable approvals or rejections.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Cases List on Left, Inspection Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Queue Items List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search & Filter Bar (Both strict h-10 for pixel alignment) */}
          <div className="p-3.5 rounded-2xl bg-[#111827] border border-[#1E2D47] flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search vendor or invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 bg-[#0A0E17] border border-[#1E2D47] rounded-xl pl-9 pr-3 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8]/50 box-border"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 bg-[#0A0E17] border border-[#1E2D47] rounded-xl px-3 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]/50 box-border cursor-pointer shrink-0"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING_REVIEW">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Cards List */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredList.map((item) => {
              const currentId = item.invoice_id || item.id;
              const isSelected = currentId === (selectedCase?.invoice_id || selectedCase?.id);
              return (
                <div
                  key={currentId}
                  onClick={() => {
                    setSelectedId(currentId);
                    setSelectedDecision(null);
                    setReason('');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#172236] border-[#38BDF8] shadow-cyan-glow ring-1 ring-[#38BDF8]/30'
                      : 'bg-[#111827]/70 border-[#1E2D47] hover:border-[#2A3E5E] hover:bg-[#111827]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#38BDF8]">{currentId}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      item.risk_level === 'HIGH' 
                        ? 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30' 
                        : item.risk_level === 'MEDIUM'
                        ? 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      Risk: {item.risk_score}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-[#F8FAFC] mb-1">{item.supplier}</div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2 font-mono">
                    <span>{item.amount || `₹${item.total_amount?.toLocaleString('en-IN')}`}</span>
                    <span className="text-[11px] text-[#94A3B8]">{item.date || item.created_at}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0A0E17] border border-[#1E2D47] text-[11px] text-[#94A3B8] line-clamp-2">
                    {item.discrepancy}
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-[#1E2D47] text-[11px]">
                    <span className="text-[#94A3B8]">Status:</span>
                    <span className={`font-semibold font-mono ${
                      item.status === 'APPROVED' ? 'text-emerald-400' :
                      item.status === 'REJECTED' ? 'text-[#F87171]' : 'text-amber-400'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Inspection & Decision Form (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-[#1E2D47] space-y-6 shadow-studio-panel">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D47]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] uppercase font-mono text-[#38BDF8]">Audit Inspection</span>
                    <span className="text-[#94A3B8]">•</span>
                    <span className="font-mono text-xs font-bold text-[#F8FAFC]">{selectedCase.invoice_id || selectedCase.id}</span>
                  </div>
                  <h2 className="font-display font-extrabold text-xl text-[#F8FAFC] mt-1">{selectedCase.supplier}</h2>
                  <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                    Claim Amount: {selectedCase.amount || `₹${selectedCase.total_amount?.toLocaleString('en-IN')}`}
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold text-center self-start sm:self-auto ${
                  selectedCase.risk_level === 'HIGH'
                    ? 'bg-[#F87171]/15 border-[#F87171]/30 text-[#F87171]'
                    : 'bg-[#FBBF24]/15 border-[#FBBF24]/30 text-[#FBBF24]'
                }`}>
                  Risk Score: {selectedCase.risk_score} / 100
                </div>
              </div>

              {/* Mismatched Evidence */}
              <div className="p-4 rounded-2xl bg-[#F87171]/10 border border-[#F87171]/20 space-y-2">
                <div className="flex items-center space-x-2 text-[#F87171] text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Flagged Evidence for Review</span>
                </div>
                <p className="text-xs text-[#F87171]/90 leading-relaxed font-medium">
                  {selectedCase.discrepancy}
                </p>
              </div>

              {/* Sub-check status cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-[#0A0E17] border border-[#1E2D47]">
                  <span className="text-[10px] text-[#94A3B8] uppercase font-mono font-semibold">Price Check</span>
                  <div className={`text-xs font-bold font-mono mt-1 ${
                    selectedCase.verifications?.price_check === 'PASS' ? 'text-emerald-400' : 'text-[#F87171]'
                  }`}>
                    {selectedCase.verifications?.price_check || 'FAIL'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0A0E17] border border-[#1E2D47]">
                  <span className="text-[10px] text-[#94A3B8] uppercase font-mono font-semibold">Qty Match</span>
                  <div className={`text-xs font-bold font-mono mt-1 ${
                    selectedCase.verifications?.quantity_check === 'PASS' ? 'text-emerald-400' : 'text-[#F87171]'
                  }`}>
                    {selectedCase.verifications?.quantity_check || 'PASS'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0A0E17] border border-[#1E2D47]">
                  <span className="text-[10px] text-[#94A3B8] uppercase font-mono font-semibold">Duplicate Check</span>
                  <div className={`text-xs font-bold font-mono mt-1 ${
                    selectedCase.verifications?.duplicate_check === 'PASS' ? 'text-emerald-400' : 'text-[#F87171]'
                  }`}>
                    {selectedCase.verifications?.duplicate_check || 'PASS'}
                  </div>
                </div>
              </div>

              {/* Existing Decision status if already recorded */}
              {selectedCase.status !== 'PENDING_REVIEW' && (
                <div className="p-4 rounded-2xl bg-[#0A0E17] border border-[#1E2D47] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#94A3B8]">Logged Human Decision</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] ${
                      selectedCase.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#F87171]/10 text-[#F87171]'
                    }`}>
                      {selectedCase.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] italic">"{selectedCase.reviewReason}"</p>
                </div>
              )}

              {/* Decision Input Form (Zero Collision Button Layout: exact matching h-12 heights) */}
              <form onSubmit={handleSubmitDecision} className="space-y-4 pt-2 border-t border-[#1E2D47]">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#F8FAFC]">
                    Record Audit Decision:
                  </label>
                  
                  {/* Two Buttons: matching h-12 height, centered, identical radius */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDecision('APPROVE')}
                      className={`flex-1 h-12 rounded-2xl border inline-flex items-center justify-center space-x-2 text-xs font-bold transition-all box-border ${
                        selectedDecision === 'APPROVE'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'bg-[#0A0E17] border-[#1E2D47] text-[#94A3B8] hover:text-emerald-400 hover:border-emerald-500/30'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Invoice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDecision('REJECT')}
                      className={`flex-1 h-12 rounded-2xl border inline-flex items-center justify-center space-x-2 text-xs font-bold transition-all box-border ${
                        selectedDecision === 'REJECT'
                          ? 'bg-[#F87171]/20 border-[#F87171] text-[#F87171] ring-2 ring-[#F87171]/30'
                          : 'bg-[#0A0E17] border-[#1E2D47] text-[#94A3B8] hover:text-[#F87171] hover:border-[#F87171]/30'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject & Flag Fraud</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F8FAFC] flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>Decision Justification & Typed Reason:</span>
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="E.g., Approved via VP emergency procurement waiver #402, or Rejected due to unauthorized ₹3,000 unit markup..."
                    className="w-full bg-[#0A0E17] border border-[#1E2D47] rounded-2xl p-3.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8]/50 transition box-border"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 inline-flex items-center justify-center space-x-2 rounded-full bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#0A0E17] font-display font-bold text-xs tracking-tight transition-all duration-150 shadow-cyan-glow hover:shadow-lg transform active:scale-95 box-border"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Immutable Review Decision</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-20 p-8 rounded-3xl bg-[#111827] border border-[#1E2D47] text-[#94A3B8] text-xs">
              Select a case from the left list to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
