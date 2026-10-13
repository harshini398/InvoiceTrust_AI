import React, { useState } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  UploadCloud, 
  FileCheck2, 
  History, 
  ClipboardCheck, 
  Menu, 
  X,
  Zap
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pendingCount, backendOnline, onOpenUpload }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload & Match', icon: UploadCloud },
    { id: 'report', label: 'Verification Report', icon: FileCheck2 },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { 
      id: 'queue', 
      label: 'Review Queue', 
      icon: ClipboardCheck,
      badge: pendingCount > 0 ? pendingCount : null 
    },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-canvas-950/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Left: Brand Icon & Name (Vectra style) */}
          <div 
            className="flex items-center space-x-3 cursor-pointer shrink-0 group" 
            onClick={() => handleSelectTab('dashboard')}
          >
            {/* Minimalist rounded square icon box matching Vectra */}
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black shadow-lg shadow-white/10 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 text-black fill-black" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-slate-200 transition">
                  InvoiceTrust<span className="text-orange-400 font-semibold ml-0.5">AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                  Canvas
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:inline">3-Way Match Intelligence</span>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs (Spaced cleanly, zero collision) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 relative whitespace-nowrap ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions & Status (No button collisions) */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Backend Status indicator */}
            <div 
              className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-[11px] font-mono border transition ${
                backendOnline 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
              }`}
              title={backendOnline ? "Connected to FastAPI :8000" : "Standalone mode (Mock contract simulation active)"}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-orange-400'}`} />
              <span className="text-[11px]">
                {backendOnline ? 'FastAPI :8000' : 'Contract Active'}
              </span>
            </div>

            {/* Sleek Vectra CTA button: Get Started / Verify */}
            <button
              onClick={() => handleSelectTab('upload')}
              className="px-4.5 py-2 rounded-full bg-[#1e1e24] hover:bg-[#282832] text-white border border-white/15 hover:border-white/25 text-xs font-medium tracking-wide transition-all duration-200 shadow-md hover:shadow-glow-subtle flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Get Started</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Smoothly organized, no collision) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/[0.08] py-4 space-y-2 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
