import React from 'react';
import { 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  FileCheck, 
  History, 
  ClipboardCheck, 
  Radio
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  pendingCount, 
  backendOnline,
  onOpenUpload 
}) {
  const navLinks = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'upload', label: 'Upload & Match' },
    { id: 'report', label: 'Verification Report' },
    { id: 'audit', label: 'Audit Trail' },
    { 
      id: 'queue', 
      label: 'Review Queue',
      badge: pendingCount > 0 ? pendingCount : null 
    },
  ];

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo matching screenshot: "// invoicetrust" */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="flex items-center tracking-tighter text-[#00F59B] text-xl font-mono font-black group-hover:scale-105 transition-transform">
              //
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-slate-100 transition">
              invoicetrust<span className="text-[#00F59B] font-extrabold text-xs ml-1 uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/20">ai</span>
            </span>
          </div>

          {/* Center Navigation Links matching screenshot */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`relative py-1 text-sm font-medium transition-colors duration-150 flex items-center space-x-1.5 ${
                    isActive 
                      ? 'text-white font-semibold' 
                      : 'text-slate-300/80 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F59B] to-transparent rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Pill Button matching "REQUEST DEMO" in screenshot */}
          <div className="flex items-center space-x-3">
            {/* Status indicator */}
            <div 
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono border ${
                backendOnline 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
              <span>{backendOnline ? 'FastAPI :8000' : 'Contract Mock Active'}</span>
            </div>

            {/* Neon Green Pill Button */}
            <button
              onClick={onOpenUpload}
              className="px-5 py-2.5 rounded-full bg-[#00F59B] hover:bg-[#00DC8C] text-slate-950 font-bold uppercase tracking-wider text-xs transition duration-150 shadow-neon hover:shadow-[0_0_30px_rgba(0,245,155,0.45)] transform active:scale-95"
            >
              RUN 3-WAY MATCH
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 space-x-3 scrollbar-none border-t border-white/5">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium transition ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-400">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
