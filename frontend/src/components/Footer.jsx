import React from 'react';
import { Home, ShieldCheck, Terminal, Heart, Phone, Mail, MapPin, Sparkles, Utensils, Building2, CheckCircle2, ArrowUp } from 'lucide-react';

export default function Footer({ setActiveTab, onOpenPostmanGuide, onOpenAbout }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 mt-12 sm:mt-20 relative overflow-hidden">
      
      {/* Decorative Top Accent Light */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand Info (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/20">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Mess<span className="text-teal-400">&</span>Nest
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              India's premier student-first platform for discovering verified PGs, student flats, and home-style mess facilities with 0% brokerage.
            </p>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-teal-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>100% Verified Owners</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Brokerage</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    scrollToTop();
                  }}
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Explore Stay & Mess</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-teal-400 transition-colors">
                  About Mess&Nest
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    scrollToTop();
                  }}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  <span>Admin Portal</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenPostmanGuide} className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-slate-500" />
                  <span>Postman API Guide</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Cities */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Top Student Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-teal-500" />
                <span>Bangalore (Koramangala, HSR)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-teal-500" />
                <span>Delhi (North Campus, GTB Nagar)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-teal-500" />
                <span>Kota (Rajeev Gandhi Nagar)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-teal-500" />
                <span>Pune (Viman Nagar, Kothrud)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Home className="w-3 h-3 text-teal-400" />
                <span>Boys & Girls PG Hostels</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-emerald-400" />
                <span>1, 2 & 3 BHK Student Flats</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Utensils className="w-3 h-3 text-amber-400" />
                <span>Hygienic Home Mess Service</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} Mess&Nest. Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Indian University Students.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={onOpenPostmanGuide} className="hover:text-teal-400 underline">
              API Docs
            </button>
            <button onClick={onOpenAbout} className="hover:text-teal-400 underline">
              About
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
