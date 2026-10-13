import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Building2, 
  FileText, 
  ShieldAlert, 
  Send,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';

export default function ReviewQueue({ queueItems, onRecordDecision }) {
  const [selectedId, setSelectedId] = useState(queueItems[0]?.id || null);
  const [reason, setReason] = useState('');
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const selectedCase = queueItems.find((item) => item.id === selectedId) || queueItems[0];

  const filteredList = queueItems.filter((item) => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    onRecordDecision(selectedCase.id, selectedDecision, reason.trim());
    setReason('');
    setSelectedDecision(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Human-in-the-Loop Review Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Investigate flagged discrepancies, evaluate evidence, and record immutable audit decisions.
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Cases List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter */}
          <div className="glass-card rounded-2xl p-3 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search vendor or invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#060913] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#060913] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
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
              const isSelected = item.id === selectedCase?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setSelectedDecision(null);
                    setReason('');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-navy-850 border-blue-500/70 shadow-blue-glow'
                      : 'glass-card hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-sky-400">{item.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.risk_level === 'HIGH' 
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                        : item.risk_level === 'MEDIUM'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30'
                    }`}>
                      Risk: {item.risk_score}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white mb-1 font-display">{item.supplier}</div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                    <span className="text-white font-medium">{item.amount}</span>
                    <span className="text-[11px] text-slate-500">{item.date}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#060913] border border-white/5 text-[11px] text-slate-300 line-clamp-2">
                    {item.discrepancy}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                    <span className="text-slate-500">Status:</span>
                    <span className={`font-semibold ${
                      item.status === 'APPROVED' ? 'text-[#00F59B]' :
                      item.status === 'REJECTED' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Inspection */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400">Reviewing Case</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono text-xs font-bold text-sky-400">{selectedCase.id}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">{selectedCase.supplier}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Billed Claim: {selectedCase.amount}</p>
                </div>

                <div className={`px-4 py-2 rounded-2xl border text-xs font-bold text-center self-start sm:self-auto ${
                  selectedCase.risk_level === 'HIGH'
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                }`}>
                  Risk Score: {selectedCase.risk_score} / 100
                </div>
              </div>

              {/* Mismatched Evidence */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Flagged Evidence for Review</span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed font-medium">
                  {selectedCase.discrepancy}
                </p>
              </div>

              {/* Sub-check Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-[#060913] border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Price Match</span>
                  <div className={`text-xs font-bold mt-1 ${
                    selectedCase.verifications?.price_check === 'PASS' ? 'text-[#00F59B]' : 'text-rose-400'
                  }`}>
                    {selectedCase.verifications?.price_check || 'FAIL'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#060913] border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Qty Match</span>
                  <div className={`text-xs font-bold mt-1 ${
                    selectedCase.verifications?.quantity_check === 'PASS' ? 'text-[#00F59B]' : 'text-rose-400'
                  }`}>
                    {selectedCase.verifications?.quantity_check || 'PASS'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#060913] border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Duplicate Check</span>
                  <div className={`text-xs font-bold mt-1 ${
                    selectedCase.verifications?.duplicate_check === 'PASS' ? 'text-[#00F59B]' : 'text-rose-400'
                  }`}>
                    {selectedCase.verifications?.duplicate_check || 'PASS'}
                  </div>
                </div>
              </div>

              {/* Decision History (If reviewed) */}
              {selectedCase.status !== 'PENDING_REVIEW' && (
                <div className="p-4 rounded-2xl bg-[#060913] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">Logged Decision</span>
                    <span className={`px-2.5 py-0.5 rounded-full ${
                      selectedCase.status === 'APPROVED' ? 'bg-[#00F59B]/10 text-[#00F59B]' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {selectedCase.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 italic">"{selectedCase.reviewReason}"</p>
                </div>
              )}

              {/* Decision Input Form */}
              <form onSubmit={handleSubmitDecision} className="space-y-4 pt-3 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white">
                    Action Selection:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDecision('APPROVE')}
                      className={`p-3.5 rounded-full border flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider transition ${
                        selectedDecision === 'APPROVE'
                          ? 'bg-[#00F59B] text-slate-950 border-[#00F59B] shadow-neon'
                          : 'bg-[#060913] border-white/10 text-slate-300 hover:text-[#00F59B] hover:border-[#00F59B]/40'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Claim</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDecision('REJECT')}
                      className={`p-3.5 rounded-full border flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider transition ${
                        selectedDecision === 'REJECT'
                          ? 'bg-rose-500 text-white border-rose-500 shadow-lg'
                          : 'bg-[#060913] border-white/10 text-slate-300 hover:text-rose-400 hover:border-rose-500/40'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject & Flag</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>Audit Justification (Typed Reason):</span>
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter auditable business explanation (e.g., Authorized via variance waiver or Flagged due to unapproved ₹3,000 unit markup)..."
                    className="w-full bg-[#060913] border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-xl transition transform hover:scale-[1.01] active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Immutable Decision</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-3xl text-slate-500 text-xs">
              Select a case from the list on the left to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
