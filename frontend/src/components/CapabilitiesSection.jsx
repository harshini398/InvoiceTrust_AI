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
    <section id="capabilities" className="py-16 border-b border-[#1E2D47]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#1E2D47]">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
              Platform Architecture & Capabilities
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[#F8FAFC]">
              Built for Absolute Financial Integrity.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md font-normal leading-relaxed">
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
                    ? 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] shadow-xl hover:-translate-y-1'
                    : 'bg-[#111827] text-[#F8FAFC] border border-[#1E2D47] hover:border-[#38BDF8]/40 shadow-studio-panel hover:-translate-y-1'
                }`}
              >
                {/* Top Content Area */}
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className={`font-mono font-bold text-xs ${isLight ? 'text-[#0F172A]/60' : 'text-[#38BDF8]'}`}>
                      {item.number}
                    </span>
                    <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border ${
                      isLight 
                        ? 'bg-[#0F172A]/5 border-[#0F172A]/15 text-[#0F172A]' 
                        : 'bg-[#0A0E17] border-[#1E2D47] text-[#94A3B8]'
                    }`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isLight 
                      ? 'bg-[#0F172A] text-[#38BDF8]' 
                      : 'bg-[#0A0E17] border border-[#1E2D47] text-[#38BDF8]'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <h3 className={`font-display font-bold text-xl tracking-tight ${
                    isLight ? 'text-[#0F172A]' : 'text-[#F8FAFC]'
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-[#0F172A]/80' : 'text-[#94A3B8]'
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
                        ? 'text-[#0F172A] hover:bg-[#0F172A]/5'
                        : 'text-[#38BDF8] hover:bg-[#38BDF8]/10'
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
