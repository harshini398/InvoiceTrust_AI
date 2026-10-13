import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  UploadCloud, 
  FileCheck2, 
  History, 
  ClipboardCheck, 
  Menu, 
  X,
  Table,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pendingCount, backendOnline }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'upload', label: 'Workspace', icon: UploadCloud },
    { id: 'table', label: 'Invoices Ledger', icon: Table },
    { id: 'report', label: 'Audit Report', icon: FileCheck2 },
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-[#101915]/90 backdrop-blur-xl border-b border-[#23352C] py-3 shadow-studio-panel' 
        : 'bg-[#101915]/60 backdrop-blur-md border-b border-white/[0.06] py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Wordmark (Phenomenon Studio Style) */}
          <div 
            className="flex items-center space-x-3 cursor-pointer shrink-0 group" 
            onClick={() => handleSelectTab('dashboard')}
          >
            <div className="w-9 h-9 rounded-lg bg-[#D9F99D] text-[#101915] flex items-center justify-center font-black transition-transform duration-300 group-hover:scale-105 shadow-lime-glow">
              <ShieldCheck className="w-5 h-5 text-[#101915] stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg tracking-tight text-[#F4F5F0] group-hover:text-white transition">
                InvoiceTrust<span className="text-[#D9F99D] ml-0.5">.AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#89948C]">
                3-Way Match Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 bg-[#182821]/80 rounded-full border border-[#23352C]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 relative whitespace-nowrap ${
                    isActive
                      ? 'bg-[#D9F99D] text-[#101915] font-semibold shadow-sm'
                      : 'text-[#89948C] hover:text-[#F4F5F0] hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#101915]' : 'text-[#89948C]'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive 
                        ? 'bg-[#101915] text-[#D9F99D]' 
                        : 'bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status & Action */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Status indicator */}
            <div 
              className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-[11px] font-mono border ${
                backendOnline 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-[#182821] text-[#89948C] border-[#23352C]'
              }`}
              title={backendOnline ? "Connected to FastAPI :8000" : "Standalone mode (Contract Simulation Active)"}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-[#D9F99D]'}`} />
              <span>{backendOnline ? 'FastAPI :8000' : 'Contract Active'}</span>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => handleSelectTab('upload')}
              className="px-5 py-2 rounded-full bg-[#D9F99D] hover:bg-[#C7EE84] text-[#101915] text-xs font-bold tracking-tight transition-all duration-200 shadow-lime-glow hover:shadow-lg flex items-center space-x-1.5 transform active:scale-95"
            >
              <span>Verify an Invoice</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#101915] stroke-[2.5]" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#182821] border border-[#23352C] text-[#89948C] hover:text-[#F4F5F0] transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#23352C] space-y-1 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#D9F99D] text-[#101915] font-bold'
                      : 'text-[#89948C] hover:text-[#F4F5F0] hover:bg-[#182821]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F87171]/20 text-[#F87171]">
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
