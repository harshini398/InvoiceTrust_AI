import React from 'react';
import { 
  ShieldCheck, 
  FileSearch, 
  ArrowUpRight,
  Lock,
  Activity,
  History
} from 'lucide-react';

export default function CapabilitiesSection({ onNavigateToUpload, onNavigateToQueue, onNavigateToAudit }) {
  const capabilities = [
    {
      number: "01",
      title: "Automated 3-Way Reconciliation",
      description: "Direct cross-verification comparing Vendor Invoices against approved Purchase Orders and physical Delivery Receipts to eliminate unapproved variance.",
      surface: "dark",
      badge: "Core Engine",
      actionLabel: "Verify Documents",
      action: onNavigateToUpload,
      icon: ShieldCheck
    },
    {
      number: "02",
      title: "Multimodal Entity & OCR Extraction",
      description: "High-accuracy vision pipeline extracting line items, supplier identities, tax totals, and itemized unit rates with calibrated 95%+ confidence scores.",
      surface: "light",
      badge: "Extraction Pipeline",
      actionLabel: "Test Extraction",
      action: onNavigateToUpload,
      icon: FileSearch
    },
    {
      number: "03",
      title: "Cryptographic SHA-256 Duplicate Shield",
      description: "Immediate hashing of ingested documents against historical database records, instantly preventing double-payment fraud and duplicate disbursements.",
      surface: "dark",
      badge: "Security & Hashes",
      actionLabel: "Inspect Hash Ledger",
      action: onNavigateToAudit,
      icon: Lock
    },
    {
      number: "04",
      title: "Dynamic Risk Scoring & Discrepancy Flagging",
      description: "Granular evaluation of unit price markup, quantity shortfall, and tax variances, generating a deterministic 0-100 risk score with visual severity indicators.",
      surface: "dark",
      badge: "Risk Engine",
      actionLabel: "View Flagged Rules",
      action: onNavigateToQueue,
      icon: Activity
    },
    {
      number: "05",
      title: "Immutable Audit Trail & Human Governance",
      description: "Time-stamped audit logs with human-in-the-loop review queue to approve or reject discrepancies with auditable justification comments.",
      surface: "light",
      badge: "Governance",
      actionLabel: "Open Review Queue",
      action: onNavigateToQueue,
      icon: History
    }
  ];

  return (
    <section id="capabilities" className="py-16 border-b border-[#23352C]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#23352C]">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D9F99D]">
              Platform Architecture & Capabilities
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[#F4F5F0]">
              Built for Absolute Financial Integrity.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#89948C] max-w-md font-normal leading-relaxed">
            Eliminating billing leakage, unauthorized markups, and duplicate disbursement across enterprise supply chains.
          </p>
        </div>

        {/* Asymmetric Capabilities Grid with baseline-aligned buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            const isLight = item.surface === "light";

            return (
              <div
                key={idx}
                className={`rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-full ${
                  isLight
                    ? 'bg-[#F4F5F0] text-[#172019] border border-[#E2E4DC] shadow-xl hover:-translate-y-1'
                    : 'bg-[#182821] text-[#F4F5F0] border border-[#23352C] hover:border-[#D9F99D]/40 shadow-studio-panel hover:-translate-y-1'
                }`}
              >
                {/* Top Content Area */}
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className={`font-mono font-bold text-xs ${isLight ? 'text-[#172019]/60' : 'text-[#D9F99D]'}`}>
                      {item.number}
                    </span>
                    <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border ${
                      isLight 
                        ? 'bg-[#172019]/5 border-[#172019]/15 text-[#172019]' 
                        : 'bg-[#101915] border-[#23352C] text-[#89948C]'
                    }`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isLight 
                      ? 'bg-[#172019] text-[#D9F99D]' 
                      : 'bg-[#101915] border border-[#23352C] text-[#D9F99D]'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <h3 className={`font-display font-bold text-xl tracking-tight ${
                    isLight ? 'text-[#172019]' : 'text-[#F4F5F0]'
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-[#172019]/80' : 'text-[#89948C]'
                  }`}>
                    {item.description}
                  </p>
                </div>

                {/* Card Action Link: mt-auto guarantees exact baseline alignment across all cards */}
                <div className="mt-6 pt-5 border-t border-current/10 flex items-center">
                  <button
                    onClick={item.action}
                    className={`h-8 inline-flex items-center space-x-1.5 text-xs font-bold transition rounded-full px-3 -ml-3 ${
                      isLight
                        ? 'text-[#172019] hover:bg-[#172019]/5'
                        : 'text-[#D9F99D] hover:bg-[#D9F99D]/10'
                    }`}
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
