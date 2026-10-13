import React, { useState, useEffect } from 'react';
import BusinessLogo from './BusinessLogo';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileCheck2, 
  History, 
  ClipboardCheck, 
  Menu, 
  X,
  Table,
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
        ? 'bg-[#101915]/95 backdrop-blur-xl border-b border-[#23352C] py-2.5 shadow-studio-panel' 
        : 'bg-[#101915]/75 backdrop-blur-md border-b border-white/[0.06] py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          
          {/* Left: Professional Business Corporate Logo */}
          <button 
            type="button"
            className="flex items-center cursor-pointer shrink-0 focus:outline-none" 
            onClick={() => handleSelectTab('dashboard')}
          >
            <BusinessLogo />
          </button>

          {/* Center: Desktop Navigation Tabs (Consistent height h-9, perfectly aligned) */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 bg-[#182821]/90 rounded-full border border-[#23352C] h-10 box-border">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`h-8 inline-flex items-center justify-center space-x-2 px-3.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#D9F99D] text-[#101915] font-bold shadow-sm'
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

          {/* Right: Status Pill & CTA (Both locked to exact h-9 for pristine vertical alignment) */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {/* Status indicator */}
            <div 
              className={`hidden sm:inline-flex items-center space-x-2 h-9 px-3.5 rounded-full text-[11px] font-mono border box-border ${
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
              className="h-9 inline-flex items-center justify-center space-x-1.5 px-4.5 rounded-full bg-[#D9F99D] hover:bg-[#C7EE84] text-[#101915] text-xs font-bold tracking-tight transition-all duration-150 shadow-lime-glow hover:shadow-lg transform active:scale-95 box-border"
            >
              <span>Verify an Invoice</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#101915] stroke-[2.5]" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-xl bg-[#182821] border border-[#23352C] text-[#89948C] hover:text-[#F4F5F0] transition box-border"
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
                  className={`w-full h-10 flex items-center justify-between px-4 rounded-xl text-xs font-medium transition ${
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
