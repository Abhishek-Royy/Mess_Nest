import React, { useState } from 'react';
import { Home, ShieldCheck, Terminal, PlusCircle, Search, Info, Menu, X, LogOut, Lock } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onRequestAdminTab,
  isAdminLoggedIn,
  adminUser,
  onAdminLogout,
  onOpenPostmanGuide,
  onOpenAbout,
  pendingBookingsCount
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    if (tab === 'admin') {
      if (onRequestAdminTab) {
        onRequestAdminTab();
      } else {
        setActiveTab('admin');
      }
    } else {
      setActiveTab(tab);
    }
    setIsMobileMenuOpen(false);
  };

  const handleAboutClick = () => {
    onOpenAbout();
    setIsMobileMenuOpen(false);
  };

  const handlePostmanClick = () => {
    onOpenPostmanGuide();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 glass-nav shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleTabClick('explore')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-teal-900 to-emerald-800 bg-clip-text text-transparent">
              Mess<span className="text-teal-600">&</span>Nest
            </span>
            <span className="hidden sm:block text-[10px] font-semibold text-teal-600 uppercase tracking-widest -mt-1">
              Student Housing Platform
            </span>
          </div>
        </div>

        {/* Center / Navigation Tabs (Desktop View) */}
        <div className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 gap-0.5">
          <button
            onClick={() => handleTabClick('explore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'explore'
                ? 'bg-white text-teal-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Explore Stay & Mess</span>
          </button>

          <button
            onClick={() => handleTabClick('admin')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Admin Portal</span>
            {!isAdminLoggedIn && (
              <Lock className="w-3 h-3 text-slate-400 ml-0.5" />
            )}
            {pendingBookingsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                {pendingBookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all"
            title="About Mess&Nest Platform"
          >
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>About Us</span>
          </button>
        </div>

        {/* Right Actions (Desktop View) */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">


          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin ({adminUser?.username || 'admin'})</span>
              </span>
              <button
                onClick={onAdminLogout}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all"
                title="Log out of Admin mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleTabClick('admin')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-teal-600/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Listing</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger / Cross Toggle Button */}
        <div className="flex items-center md:hidden gap-2">
          {pendingBookingsCount > 0 && (
            <button
              onClick={() => handleTabClick('admin')}
              className="relative p-1.5 text-indigo-600 bg-indigo-50 rounded-lg border border-indigo-100 text-xs font-bold flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {pendingBookingsCount}
              </span>
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none transition-colors border border-slate-200/80"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-800" />
            ) : (
              <Menu className="w-6 h-6 text-slate-800" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 shadow-xl animate-slideDown">
          
          <button
            onClick={() => handleTabClick('explore')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'explore'
                ? 'bg-teal-50 text-teal-700 border border-teal-200/80'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-teal-600" />
              <span>Explore Stay & Mess</span>
            </div>
            {activeTab === 'explore' && <span className="w-2 h-2 rounded-full bg-teal-600"></span>}
          </button>

          <button
            onClick={() => handleTabClick('admin')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Admin Portal</span>
              {!isAdminLoggedIn && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            </div>
            {pendingBookingsCount > 0 ? (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingBookingsCount} pending
              </span>
            ) : (
              activeTab === 'admin' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            )}
          </button>

          <button
            onClick={handleAboutClick}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
          >
            <Info className="w-4 h-4 text-teal-600" />
            <span>About Us</span>
          </button>



          <div className="pt-2 border-t border-slate-100">
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  onAdminLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-bold rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Admin ({adminUser?.username || 'admin'})</span>
              </button>
            ) : (
              <button
                onClick={() => handleTabClick('admin')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-98"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Post Property Listing</span>
              </button>
            )}
          </div>

        </div>
      )}

    </header>
  );
}

