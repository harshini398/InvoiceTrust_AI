import React from 'react';
import BusinessLogo from './BusinessLogo';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export default function FooterSection({ onNavigateToUpload, setActiveTab }) {
  return (
    <footer className="border-t border-[#1E2D47] bg-[#0A0E17] pt-14 pb-12 text-xs text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Closing CTA Section */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-[#111827] border border-[#1E2D47] overflow-hidden shadow-studio-panel">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8]/[0.08] blur-[90px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
                Financial Intelligence at Scale
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-[#F8FAFC] leading-tight">
                Make Every Financing Decision More Transparent.
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                Protect supply chain financing, verify vendor documents with SHA-256 certainty, and eliminate invoice leakage.
              </p>
            </div>

            <button
              onClick={onNavigateToUpload}
              className="h-12 inline-flex items-center justify-center space-x-2 px-8 rounded-full bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#0A0E17] font-display font-bold text-sm tracking-tight transition-all duration-150 shadow-cyan-glow hover:shadow-lg shrink-0 self-start md:self-auto transform active:scale-95 box-border"
            >
              <span>Start Verification Workflow</span>
              <ArrowRight className="w-4 h-4 text-[#0A0E17] stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Footer Links & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-[#1E2D47]/60">
          
          {/* Brand Col with Business Logo */}
          <div className="space-y-3 md:col-span-2">
            <BusinessLogo />
            <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed mt-2">
              Autonomous 3-Way Match & Fraud Prevention platform. Designed with Phenomenon Studio editorial aesthetics for enterprise fintech operations.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <div className="font-mono text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
              Application
            </div>
            <ul className="space-y-1.5 text-xs text-[#94A3B8]">
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#38BDF8] transition">
                  Overview & Metrics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('upload')} className="hover:text-[#38BDF8] transition">
                  Ingestion Workspace
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('table')} className="hover:text-[#38BDF8] transition">
                  Invoices Ledger (SQLite)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('report')} className="hover:text-[#38BDF8] transition">
                  Audit Report
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Architecture */}
          <div className="space-y-2">
            <div className="font-mono text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
              Governance
            </div>
            <ul className="space-y-1.5 text-xs text-[#94A3B8]">
              <li>
                <button onClick={() => setActiveTab('audit')} className="hover:text-[#38BDF8] transition">
                  SHA-256 Audit Trail
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('queue')} className="hover:text-[#38BDF8] transition">
                  Human Review Queue
                </button>
              </li>
              <li className="text-[11px] font-mono text-[#38BDF8]">
                Branch: feature/frontend-ui
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1E2D47]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#94A3B8]">
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
