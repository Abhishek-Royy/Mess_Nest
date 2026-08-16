import React from 'react';
import { Search, MapPin, Building, Armchair, DollarSign, Sparkles } from 'lucide-react';

export default function HeroSearch({ filters, setFilters, onResetFilters }) {
  const quickLocations = ['Bangalore', 'Delhi', 'Kota', 'Pune'];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-slate-900 to-slate-900 text-white pt-8 sm:pt-10 pb-10 sm:pb-16 px-3.5 sm:px-6 lg:px-8 rounded-2xl sm:rounded-3xl shadow-xl border border-teal-800/50 mb-6 sm:mb-10">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        
        {/* Student Tag */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Student Housing & Mess Finder</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 sm:mb-3 leading-tight">
          Find Your Perfect <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">PG, Flat or Mess</span> Near Campus
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          Search verified student accommodations, compare rent, chat directly on WhatsApp with owners, and book online in seconds.
        </p>

        {/* Filter Bar Card */}
        <div className="bg-white text-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-2xl border border-slate-100 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            
            {/* Search Location / Area */}
            <div className="relative text-left">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Location / Area
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Hudson Lane"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Category */}
            <div className="text-left">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Type
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="All">All Types (PG, Flat, Mess)</option>
                  <option value="PG">PG Accommodation</option>
                  <option value="Flat">Flat / Apartment</option>
                  <option value="Mess">Food / Mess Service</option>
                </select>
              </div>
            </div>

            {/* Furnishing Status */}
            <div className="text-left">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Furnished
              </label>
              <div className="relative">
                <Armchair className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={filters.furnishedStatus}
                  onChange={(e) => setFilters({ ...filters, furnishedStatus: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="All">Any Status</option>
                  <option value="Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            {/* Max Budget */}
            <div className="text-left">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">
                Max Rent: {filters.maxPrice ? `₹${Number(filters.maxPrice).toLocaleString()}` : 'Any'}
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
            </div>

          </div>

          {/* Quick Location Pills & Reset */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-medium text-[11px]">Quick Cities:</span>
              {quickLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setFilters({ ...filters, search: loc })}
                  className={`px-2.5 py-0.5 sm:py-1 rounded-lg text-xs font-semibold transition-all ${
                    filters.search.toLowerCase() === loc.toLowerCase()
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            <button
              onClick={onResetFilters}
              className="text-teal-600 hover:text-teal-800 font-semibold underline text-xs ml-auto sm:ml-0"
            >
              Reset Filters
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
