import React from 'react';
import { MapPin, Star, MessageSquare, CalendarCheck, Home, CheckCircle2, ChevronRight } from 'lucide-react';

export default function PropertyCard({ property, onSelectProperty, onBookNow }) {
  // Format whatsapp URL
  const formatWhatsAppUrl = (phone, title, price, location) => {
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '919876543210';
    const message = encodeURIComponent(
      `Hello! I am interested in booking/inquiring about your property "${title}" listed at ₹${price.toLocaleString()}/mo in ${location}. Is it currently available for students?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'PG':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Flat':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Mess':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const mainImage = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      
      {/* Property Image Container */}
      <div 
        onClick={() => onSelectProperty(property)}
        className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-slate-100"
      >
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap max-w-[75%]">
            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold border shadow-sm ${getCategoryBadgeClass(property.category)}`}>
              {property.category}
            </span>
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md shadow-sm">
              {property.furnishedStatus}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{property.rating || 4.5}</span>
          </div>
        </div>

        {/* Room Type Pill */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="bg-teal-900/90 backdrop-blur-sm text-teal-200 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">
            {property.roomType}
          </span>
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Location / Area */}
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mb-1 border-b border-slate-100/50 pb-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">{property.area}, {property.location}</span>
          </div>

          {/* Property Name / Title */}
          <h3 
            onClick={() => onSelectProperty(property)}
            className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-teal-700 transition-colors cursor-pointer mb-2"
          >
            {property.title}
          </h3>

          {/* Quick Amenities */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(property.amenities || []).slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-medium">
                • {amenity}
              </span>
            ))}
            {(property.amenities || []).length > 3 && (
              <span className="text-slate-400 text-[10px] sm:text-[11px] font-medium">
                +{(property.amenities || []).length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Rent & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
          
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">Monthly Rent</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                  ₹{Number(property.price).toLocaleString()}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">/ mo</span>
              </div>
            </div>
            
            {property.deposit > 0 && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Deposit</span>
                <span className="text-xs font-semibold text-slate-600">
                  ₹{Number(property.deposit).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Action CTAs: WhatsApp & Book Now */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* WhatsApp Contact */}
            <a
              href={formatWhatsAppUrl(property.whatsappNumber, property.title, property.price, property.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 sm:gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all hover:scale-[1.02]"
              title="Direct Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* Book Now */}
            <button
              onClick={() => onBookNow(property)}
              className="flex items-center justify-center gap-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
            >
              <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Book Now</span>
            </button>

          </div>

          <button
            onClick={() => onSelectProperty(property)}
            className="w-full text-center text-[11px] sm:text-xs font-semibold text-slate-500 hover:text-teal-700 flex items-center justify-center gap-1 pt-0.5"
          >
            <span>View Full Details & Photos</span>
            <ChevronRight className="w-3 h-3" />
          </button>

        </div>

      </div>

    </div>
  );
}
