import React from 'react';
import { X, Home, Building2, Utensils, ShieldCheck, Heart, Users, Sparkles, CheckCircle2, Phone, Mail, MapPin, MessageSquare, Award, Zap } from 'lucide-react';

export default function AboutModal({ onClose, onOpenAdmin }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-4 relative flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-900 to-emerald-900 text-white p-5 sm:p-8 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> About Mess&Nest Platform
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Simplifying Student Accommodation & Dining
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mt-2 leading-relaxed">
            Mess&Nest is India's dedicated student-first platform for discovering verified PGs, student-friendly flats, and hygienic home-style mess services with 0% brokerage.
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div>
              <div className="text-2xl font-black text-teal-600">500+</div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Listings</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">100%</div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Zero Brokerage</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-600">15+</div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">College Hubs</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-500">4.9★</div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Student Rating</div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Our Mission
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-teal-50/50 p-4 rounded-2xl border border-teal-100/60">
              Moving to a new city for college or coaching should be exciting, not stressful. We connect university students and young professionals directly with verified PG owners, flat managers, and home mess providers — bypassing fake brokers and hidden fees.
            </p>
          </div>

          {/* Why Choose Us Features Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-600" /> Why Students Choose Mess&Nest
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 hover:border-teal-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Verified Properties</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Every PG, flat, and mess listed goes through quality and security checks.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 hover:border-teal-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Hygienic Mess Meals</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Nutritious North & South Indian meals with daily rotating menus and special Sunday feasts.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 hover:border-teal-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Direct WhatsApp Chat</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Chat directly with owners with one click. No broker commission or middleman charges.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 hover:border-teal-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Instant Booking Requests</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Submit your move-in date and room preferences in under 30 seconds online.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact & Support Section */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Get in Touch / Owner Support</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@messnest.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Bangalore, Delhi, Kota, Pune</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              if (onOpenAdmin) onOpenAdmin();
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Are you a PG / Mess Owner? Post Your Listing</span>
          </button>
          
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            Got It!
          </button>
        </div>

      </div>
    </div>
  );
}
