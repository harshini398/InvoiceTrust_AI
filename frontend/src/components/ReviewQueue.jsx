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
  const [selectedDecision, setSelectedDecision] = useState(null); // 'APPROVE' or 'REJECT'
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
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Human-in-the-Loop Review Queue
          </h1>
          <p className="text-sm text-slate-400">
            Investigate flagged discrepancies, evaluate evidence, and log auditable approval or rejection decisions.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Cases List on Left, Inspection Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Queue Items List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search vendor or invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
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
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-indigo-300">{item.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.risk_level === 'HIGH' 
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                        : item.risk_level === 'MEDIUM'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      Risk: {item.risk_score}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-slate-200 mb-1">{item.supplier}</div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                    <span>{item.amount}</span>
                    <span className="text-[11px] text-slate-500">{item.date}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 line-clamp-2">
                    {item.discrepancy}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-slate-500">Status:</span>
                    <span className={`font-semibold ${
                      item.status === 'APPROVED' ? 'text-emerald-400' :
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

        {/* Right Column: Case Inspection & Decision Panel (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase font-mono text-slate-400">Reviewing Case</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono text-xs font-bold text-indigo-400">{selectedCase.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-0.5">{selectedCase.supplier}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Claim Amount: {selectedCase.amount}</p>
                </div>

                <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold text-center self-start sm:self-auto ${
                  selectedCase.risk_level === 'HIGH'
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                }`}>
                  Risk Score: {selectedCase.risk_score} / 100
                </div>
              </div>

              {/* Mismatched Evidence */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Flagged Evidence for Review</span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed font-medium">
                  {selectedCase.discrepancy}
                </p>
              </div>

              {/* Verification Sub-check statuses */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Price Match</span>
                  <div className={`text-xs font-bold mt-1 ${
                    selectedCase.verifications?.price_check === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {selectedCase.verifications?.price_check || 'FAIL'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Qty Match</span>
                  <div className={`text-xs font-bold mt-1 ${
                    selectedCase.verifications?.quantity_check === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {selectedCase.verifications?.quantity_check || 'PASS'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Duplicate Check</span>
                  <div className={`text-xs font-bold mt-1 ${
                    selectedCase.verifications?.duplicate_check === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {selectedCase.verifications?.duplicate_check || 'PASS'}
                  </div>
                </div>
              </div>

              {/* Decision History (If already reviewed) */}
              {selectedCase.status !== 'PENDING_REVIEW' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">Previous Human Decision</span>
                    <span className={`px-2 py-0.5 rounded ${
                      selectedCase.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {selectedCase.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 italic">"{selectedCase.reviewReason}"</p>
                </div>
              )}

              {/* Decision Input Form */}
              <form onSubmit={handleSubmitDecision} className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">
                    Record Audit Decision:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDecision('APPROVE')}
                      className={`p-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold transition ${
                        selectedDecision === 'APPROVE'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Invoice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDecision('REJECT')}
                      className={`p-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold transition ${
                        selectedDecision === 'REJECT'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject & Flag Fraud</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>Decision Justification & Typed Reason:</span>
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="E.g., Approved via VP emergency procurement waiver #402, or Rejected due to unauthorized ₹3,000 unit markup..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Immutable Review Decision</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              Select a case from the left list to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
