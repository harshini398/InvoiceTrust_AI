import React from 'react';

/**
 * Enterprise Business Logo for InvoiceTrust AI
 * Features a geometric interlocking trust crest:
 * - Hexagonal corporate shield
 * - 3-Way match intersection nodes
 * - Precision verification checkmark
 */
export default function BusinessLogo({ className = "h-8", showTagline = true, iconOnly = false }) {
  return (
    <div className={`flex items-center space-x-3 group ${className}`}>
      {/* Precision Geometric Vector Mark */}
      <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
        {/* Glow ambient layer */}
        <div className="absolute inset-0 rounded-xl bg-[#D9F99D]/20 blur-[6px] transition-all group-hover:bg-[#D9F99D]/30" />
        
        {/* Vector SVG Mark */}
        <svg 
          className="relative w-9 h-9" 
          viewBox="0 0 36 36" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Rounded Shield Frame */}
          <rect 
            x="1.5" 
            y="1.5" 
            width="33" 
            height="33" 
            rx="9" 
            fill="#14231C" 
            stroke="#263D33" 
            strokeWidth="1.5"
          />
          
          {/* Subtle Grid Accent */}
          <line x1="7" y1="18" x2="29" y2="18" stroke="#1F342B" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="18" y1="7" x2="18" y2="29" stroke="#1F342B" strokeWidth="1" strokeDasharray="2 2" />

          {/* Geometric Trust Hexagon */}
          <polygon 
            points="18,8 27,13 27,23 18,28 9,23 9,13" 
            fill="#1A2D24" 
            stroke="#D9F99D" 
            strokeWidth="1.75" 
            strokeLinejoin="round"
          />

          {/* Core Checkmark / Financial Verification Vector */}
          <path 
            d="M13.5 18L16.5 21L22.5 15" 
            stroke="#D9F99D" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* 3 Match Nodes (Invoice, PO, DR) */}
          <circle cx="18" cy="8" r="1.5" fill="#D9F99D" />
          <circle cx="9" cy="23" r="1.5" fill="#D9F99D" />
          <circle cx="27" cy="23" r="1.5" fill="#D9F99D" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1.5 leading-none">
            <span className="font-display font-extrabold text-base tracking-tight text-[#F4F5F0]">
              INVOICE<span className="text-[#D9F99D]">TRUST</span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D9F99D]/10 text-[#D9F99D] border border-[#D9F99D]/20">
              AI
            </span>
          </div>
          {showTagline && (
            <span className="text-[9.5px] font-mono tracking-widest uppercase text-[#89948C] mt-1 leading-none">
              Financial Integrity Engine
            </span>
          )}
        </div>
      )}
    </div>
  );
}
