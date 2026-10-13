import React from 'react';
import { 
  ArrowUpRight, 
  ChevronDown, 
  FileText, 
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function HeroSection({ onNavigateToUpload, onExplorePlatform }) {
  return (
    <section className="relative pt-6 pb-14 lg:pt-14 lg:pb-20 overflow-hidden border-b border-[#1E2D47]/60">
      
      {/* Ambient Radial Spotlight Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[#38BDF8]/[0.08] blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center space-x-2.5 px-3.5 py-1 rounded-full bg-[#111827] border border-[#1E2D47] text-[#38BDF8] text-xs font-mono tracking-wider uppercase mb-7 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          <span>Autonomous 3-Way Match & Fraud Prevention</span>
        </div>

        {/* Asymmetric Editorial Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Expressive Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl xl:text-7xl tracking-[-0.03em] text-[#F8FAFC] leading-[1.08]">
              Trust Every Invoice.<br />
              <span className="text-[#38BDF8]">Finance With Clarity.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl font-normal leading-relaxed">
              AI-powered invoice intelligence for verification, duplicate detection, risk assessment, and transparent financing decisions.
            </p>

            {/* CTAs with identical heights and pixel-perfect horizontal alignment */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateToUpload}
                className="h-12 inline-flex items-center justify-center space-x-2 px-7 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A0E17] font-display font-bold text-sm tracking-tight transition-all duration-150 shadow-cyan-glow hover:shadow-lg transform active:scale-95 box-border"
              >
                <span>Verify an Invoice</span>
                <ArrowRight className="w-4 h-4 text-[#0A0E17] stroke-[2.5]" />
              </button>

              <button
                onClick={onExplorePlatform}
                className="h-12 inline-flex items-center justify-center space-x-2 px-7 rounded-full bg-[#111827] hover:bg-[#172236] text-[#F8FAFC] border border-[#1E2D47] hover:border-[#38BDF8]/40 text-sm font-medium transition-all duration-150 box-border"
              >
                <span>Explore Platform</span>
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>

            {/* Metrics Line */}
            <div className="pt-6 border-t border-[#1E2D47]/70 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <div className="font-display font-extrabold text-2xl text-[#F8FAFC]">100%</div>
                <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider font-mono">3-Way Match</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl text-[#38BDF8]">SHA-256</div>
                <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider font-mono">Hash Sealed</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl text-[#F8FAFC]">0.95</div>
                <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider font-mono">Confidence</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visualization Panel (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative p-6 sm:p-7 rounded-3xl bg-[#111827] border border-[#1E2D47] shadow-studio-panel space-y-5 overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2D47]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F8FAFC]">
                    Reconciliation Canvas
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#94A3B8] bg-[#0A0E17] px-2.5 py-1 rounded-full border border-[#1E2D47]">
                  INV-1042 • Live State
                </span>
              </div>

              {/* 3 Document Ingestion Streams */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E2D47] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-[#38BDF8]" />
                    <span className="text-xs font-medium text-[#F8FAFC]">Vendor Invoice (PDF)</span>
                  </div>
                  <span className="font-mono text-xs text-[#38BDF8] font-bold">₹4,72,000</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E2D47] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-[#94A3B8]" />
                    <span className="text-xs font-medium text-[#F8FAFC]">Purchase Order (PO)</span>
                  </div>
                  <span className="font-mono text-xs text-[#94A3B8]">Rate: ₹5,000/u</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E2D47] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-[#94A3B8]" />
                    <span className="text-xs font-medium text-[#F8FAFC]">Delivery Receipt (DR)</span>
                  </div>
                  <span className="font-mono text-xs text-emerald-400">59 Units Matched</span>
                </div>
              </div>

              {/* Cross-Verification Node Result */}
              <div className="p-4 rounded-xl bg-[#172236] border border-[#243553] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#94A3B8] font-mono">Discrepancy Check</span>
                  <span className="font-bold text-[#F87171] bg-[#F87171]/15 px-2 py-0.5 rounded-full border border-[#F87171]/30">
                    Price Discrepancy Flagged
                  </span>
                </div>
                <p className="text-xs text-[#F8FAFC] font-medium leading-relaxed">
                  Invoice rate (₹8,000) exceeds PO rate (₹5,000) by ₹3,000.
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#94A3B8] border-t border-[#1E2D47]">
                  <span>Risk Score: 75 / 100</span>
                  <span className="text-[#38BDF8]">Routed to Review Queue</span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Status */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] pt-1">
                <span className="flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1 text-[#38BDF8]" /> SHA-256 Non-Repudiation
                </span>
                <span className="text-emerald-400">Verified</span>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 text-center">
          <button 
            onClick={onExplorePlatform}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#111827] hover:bg-[#172236] border border-[#1E2D47] text-[#94A3B8] hover:text-[#38BDF8] transition text-xs font-mono"
          >
            <span className="uppercase tracking-widest text-[10px]">Explore Capabilities</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
