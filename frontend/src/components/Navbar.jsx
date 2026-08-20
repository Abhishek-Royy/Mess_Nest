import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, ShieldCheck, PlusCircle, Search, Info, Menu, X, LogOut, Lock, 
  User, Bell, ChevronDown, Calendar, CheckCircle2, LogIn, Sparkles
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onRequestAdminTab,
  isAdminLoggedIn,
  adminUser,
  onAdminLogout,
  onOpenAbout,
  pendingBookingsCount,
  // User Auth & Profile props
  currentUser,
  onOpenUserAuth,
  onUserLogout,
  onOpenUserBookings,
  userBookingsCount = 0,
  unreadNotificationsCount = 0
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        <div className="hidden md:flex items-center gap-2.5 sm:gap-3">

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200/80 text-slate-800 transition-all shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight line-clamp-1 max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-700 font-semibold leading-none">
                    Student
                  </div>
                </div>

                {/* Unread Alert Indicator */}
                {unreadNotificationsCount > 0 ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                ) : (
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-200/90 py-2 z-50 animate-slideDown overflow-hidden">
                  {/* User details card header */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                    <div className="text-xs font-extrabold text-slate-900 line-clamp-1">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 font-medium mt-0.5">
                      {currentUser.email}
                    </div>
                    {currentUser.phone && (
                      <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
                        📞 +{currentUser.phone}
                      </div>
                    )}
                  </div>

                  {/* Dropdown Options */}
                  <div className="p-1 space-y-0.5">
                    {/* Booking Status item */}
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onOpenUserBookings('bookings');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-teal-800 hover:bg-teal-50/80 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <span>Booking Status</span>
                      </div>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {userBookingsCount}
                      </span>
                    </button>

                    {/* Notifications item */}
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onOpenUserBookings('notifications');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-teal-800 hover:bg-teal-50/80 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center">
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <span>Notifications</span>
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Logout Divider & Action */}
                  <div className="pt-1 mt-1 border-t border-slate-100 px-1">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onUserLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenUserAuth('login')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100/80 border border-teal-200 text-xs font-bold transition-all hover:scale-[1.02]"
            >
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Admin Logged-In Badge or Post Listing */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <span className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin ({adminUser?.username || 'admin'})</span>
              </span>
              <button
                onClick={onAdminLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all"
                title="Log out of Admin mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleTabClick('admin')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-teal-600/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Listing</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger / Cross Toggle Button */}
        <div className="flex items-center md:hidden gap-2">
          {currentUser && (
            <button
              onClick={() => onOpenUserBookings('bookings')}
              className="relative p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-bold text-xs flex items-center gap-1"
            >
              <User className="w-4 h-4 text-teal-600" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

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
          
          {/* Mobile User Profile Section */}
          {currentUser ? (
            <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-2xl mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onUserLogout();
                  }}
                  className="text-xs font-bold text-rose-600 p-1 hover:underline"
                >
                  Logout
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-teal-200/60">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenUserBookings('bookings');
                  }}
                  className="bg-white text-teal-800 border border-teal-200 font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Bookings ({userBookingsCount})</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenUserBookings('notifications');
                  }}
                  className="bg-white text-slate-800 border border-slate-200 font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Bell className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Alerts ({unreadNotificationsCount})</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenUserAuth('login');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Student Sign In / Register</span>
            </button>
          )}

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
