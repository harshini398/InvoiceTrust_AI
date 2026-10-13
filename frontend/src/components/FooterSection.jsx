import React from 'react';
import { ShieldCheck, ArrowRight, ArrowUpRight } from 'lucide-react';

export default function FooterSection({ onNavigateToUpload, setActiveTab }) {
  return (
    <footer className="border-t border-[#23352C] bg-[#101915] pt-16 pb-12 text-xs text-[#89948C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Phenomenon Studio Final Closing CTA Section */}
        <div className="relative p-8 sm:p-14 rounded-3xl bg-[#182821] border border-[#23352C] overflow-hidden shadow-studio-panel">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9F99D]/[0.08] blur-[90px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D9F99D]">
                Financial Intelligence at Scale
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-[#F4F5F0] leading-tight">
                Make Every Financing Decision More Transparent.
              </h2>
              <p className="text-xs sm:text-sm text-[#89948C]">
                Protect supply chain financing, verify vendor documents with SHA-256 certainty, and eliminate invoice leakage.
              </p>
            </div>

            <button
              onClick={onNavigateToUpload}
              className="px-8 py-4 rounded-full bg-[#D9F99D] hover:bg-[#C7EE84] text-[#101915] font-display font-bold text-sm tracking-tight transition-all duration-200 shadow-lime-glow hover:shadow-lg flex items-center space-x-2 shrink-0 self-start md:self-auto transform active:scale-95"
            >
              <span>Start Verification Workflow</span>
              <ArrowRight className="w-4 h-4 text-[#101915] stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Footer Links & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-[#23352C]/60">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#D9F99D] text-[#101915] flex items-center justify-center font-black">
                <ShieldCheck className="w-4 h-4 text-[#101915] stroke-[2.5]" />
              </div>
              <span className="font-display font-bold text-base text-[#F4F5F0]">
                InvoiceTrust<span className="text-[#D9F99D]">.AI</span>
              </span>
            </div>
            <p className="text-xs text-[#89948C] max-w-sm leading-relaxed">
              Autonomous 3-Way Match & Fraud Prevention platform. Designed with Phenomenon Studio editorial aesthetics for enterprise fintech operations.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <div className="font-mono text-xs font-semibold text-[#F4F5F0] uppercase tracking-wider">
              Application
            </div>
            <ul className="space-y-1.5 text-xs text-[#89948C]">
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#D9F99D] transition">
                  Overview & Metrics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('upload')} className="hover:text-[#D9F99D] transition">
                  Ingestion Workspace
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('table')} className="hover:text-[#D9F99D] transition">
                  Invoices Ledger (SQLite)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('report')} className="hover:text-[#D9F99D] transition">
                  Audit Report
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Architecture */}
          <div className="space-y-2">
            <div className="font-mono text-xs font-semibold text-[#F4F5F0] uppercase tracking-wider">
              Governance
            </div>
            <ul className="space-y-1.5 text-xs text-[#89948C]">
              <li>
                <button onClick={() => setActiveTab('audit')} className="hover:text-[#D9F99D] transition">
                  SHA-256 Audit Trail
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('queue')} className="hover:text-[#D9F99D] transition">
                  Human Review Queue
                </button>
              </li>
              <li className="text-[11px] font-mono text-[#D9F99D]">
                Branch: feature/frontend-ui
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#23352C]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#89948C]">
          <div>
            © 2026 InvoiceTrust AI. All rights reserved.
          </div>
          <div>
            FastAPI :8000 Ready • React 19 + Tailwind CSS • SQLite DB Compatible
          </div>
        </div>

      </div>
    </footer>
  );
}
