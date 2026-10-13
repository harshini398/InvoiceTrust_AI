import React from 'react';
import { 
  ArrowUpRight, 
  ChevronDown, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function HeroSection({ onNavigateToUpload, onExplorePlatform }) {
  return (
    <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-[#23352C]/60">
      
      {/* Ambient Radial Spotlight Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[#D9F99D]/[0.06] blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center space-x-2.5 px-3.5 py-1 rounded-full bg-[#182821] border border-[#23352C] text-[#D9F99D] text-xs font-mono tracking-wider uppercase mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#D9F99D] animate-ping" />
          <span>Autonomous 3-Way Match & Fraud Prevention</span>
        </div>

        {/* Asymmetric Editorial Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Expressive Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl xl:text-7xl tracking-[-0.03em] text-[#F4F5F0] leading-[1.08]">
              Trust Every Invoice.<br />
              <span className="text-[#D9F99D]">Finance With Clarity.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#89948C] max-w-xl font-normal leading-relaxed">
              AI-powered invoice intelligence for verification, duplicate detection, risk assessment, and transparent financing decisions.
            </p>

            {/* CTAs with zero collision */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateToUpload}
                className="px-7 py-3.5 rounded-full bg-[#D9F99D] hover:bg-[#C7EE84] text-[#101915] font-display font-bold text-sm tracking-tight transition-all duration-200 shadow-lime-glow hover:shadow-lg flex items-center space-x-2 transform active:scale-95"
              >
                <span>Verify an Invoice</span>
                <ArrowRight className="w-4 h-4 text-[#101915] stroke-[2.5]" />
              </button>

              <button
                onClick={onExplorePlatform}
                className="px-7 py-3.5 rounded-full bg-[#182821] hover:bg-[#1E342B] text-[#F4F5F0] border border-[#23352C] hover:border-[#D9F99D]/40 text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <span>Explore Platform</span>
                <ChevronDown className="w-4 h-4 text-[#89948C]" />
              </button>
            </div>

            {/* Subtle Metrics Line */}
            <div className="pt-6 border-t border-[#23352C]/70 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <div className="font-display font-extrabold text-2xl text-[#F4F5F0]">100%</div>
                <div className="text-[11px] text-[#89948C] uppercase tracking-wider font-mono">3-Way Match</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl text-[#D9F99D]">SHA-256</div>
                <div className="text-[11px] text-[#89948C] uppercase tracking-wider font-mono">Hash Sealed</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl text-[#F4F5F0]">0.95</div>
                <div className="text-[11px] text-[#89948C] uppercase tracking-wider font-mono">Confidence</div>
              </div>
            </div>
          </div>

          {/* Right Column: Distinctive Animated Financial Data Visualization (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative p-6 sm:p-7 rounded-3xl bg-[#182821] border border-[#23352C] shadow-studio-panel space-y-5 overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#23352C]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D9F99D]" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F4F5F0]">
                    Reconciliation Canvas
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#89948C] bg-[#101915] px-2.5 py-1 rounded-full border border-[#23352C]">
                  INV-1042 • Live State
                </span>
              </div>

              {/* 3 Document Ingestion Streams */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-[#101915] border border-[#23352C] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-[#D9F99D]" />
                    <span className="text-xs font-medium text-[#F4F5F0]">Vendor Invoice (PDF)</span>
                  </div>
                  <span className="font-mono text-xs text-[#D9F99D]">₹4,72,000</span>
                </div>

                <div className="p-3 rounded-xl bg-[#101915] border border-[#23352C] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-[#89948C]" />
                    <span className="text-xs font-medium text-[#F4F5F0]">Purchase Order (PO)</span>
                  </div>
                  <span className="font-mono text-xs text-[#89948C]">Rate: ₹5,000/u</span>
                </div>

                <div className="p-3 rounded-xl bg-[#101915] border border-[#23352C] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-[#89948C]" />
                    <span className="text-xs font-medium text-[#F4F5F0]">Delivery Receipt (DR)</span>
                  </div>
                  <span className="font-mono text-xs text-emerald-400">59 Units Matched</span>
                </div>
              </div>

              {/* Cross-Verification Node Result */}
              <div className="p-4 rounded-xl bg-[#1F342B] border border-[#2E473C] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#89948C] font-mono">Discrepancy Check</span>
                  <span className="font-bold text-[#F87171] bg-[#F87171]/15 px-2 py-0.5 rounded-full border border-[#F87171]/30">
                    Price Discrepancy Flagged
                  </span>
                </div>
                <p className="text-xs text-[#F4F5F0] font-medium leading-relaxed">
                  Invoice rate (₹8,000) exceeds PO rate (₹5,000) by ₹3,000.
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#89948C] border-t border-[#263D33]">
                  <span>Risk Score: 75 / 100</span>
                  <span className="text-[#D9F99D]">Routed to Review Queue</span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Status */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#89948C] pt-1">
                <span className="flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1 text-[#D9F99D]" /> SHA-256 Non-Repudiation
                </span>
                <span className="text-emerald-400">Verified</span>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="mt-14 text-center">
          <button 
            onClick={onExplorePlatform}
            className="inline-flex flex-col items-center space-y-2 text-[#89948C] hover:text-[#D9F99D] transition group"
          >
            <span className="text-[11px] uppercase tracking-widest font-mono">Scroll to explore capabilities</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>

      </div>
    </section>
  );
}
