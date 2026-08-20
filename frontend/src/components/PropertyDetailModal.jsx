import React, { useState } from 'react';
import { X, MapPin, Star, MessageSquare, Calendar, ShieldCheck, CheckCircle2, User, Phone, Home, Sparkles, Send } from 'lucide-react';

export default function PropertyDetailModal({ property, onClose, onOpenBookingModal, onSubmitBooking, currentUser, onRequireAuth }) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  // Form state inside modal for fast booking
  const [bookingData, setBookingData] = useState({
    studentName: currentUser?.name || '',
    studentPhone: currentUser?.phone || '',
    studentEmail: currentUser?.email || '',
    moveInDate: '',
    durationMonths: 6,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Sync with currentUser when user logs in
  React.useEffect(() => {
    if (currentUser) {
      setBookingData((prev) => ({
        ...prev,
        studentName: currentUser.name || prev.studentName,
        studentPhone: currentUser.phone || prev.studentPhone,
        studentEmail: currentUser.email || prev.studentEmail
      }));
    }
  }, [currentUser]);

  if (!property) return null;

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'];

  const whatsappUrl = `https://wa.me/${(property.whatsappNumber || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hi! I saw your property "${property.title}" on Mess&Nest and would like to ask about availability and room visit.`
  )}`;

  const handleInlineBookingSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth(property);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitBooking({
        propertyId: property._id,
        propertyTitle: property.title,
        userId: currentUser?.id || currentUser?._id || null,
        ...bookingData
      });
      setBookingSuccess(true);
    } catch (err) {
      if (err.response?.data?.requireAuth) {
        if (onRequireAuth) onRequireAuth(property);
      } else {
        alert(err.response?.data?.message || 'Failed to submit booking request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 animate-fadeIn">
      
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition-all hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Section */}
        <div className="p-3 sm:p-6 bg-slate-900 rounded-t-2xl sm:rounded-t-3xl">
          <div className="relative aspect-[16/9] max-h-[380px] rounded-2xl overflow-hidden bg-slate-950 mb-3 shadow-inner">
            <img
              src={images[selectedImgIndex]}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            
            {/* Overlay Category Pill */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-teal-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                {property.category}
              </span>
              <span className="bg-slate-900/90 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700 backdrop-blur-md">
                {property.furnishedStatus}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImgIndex === idx ? 'border-teal-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 sm:p-8 space-y-6">
          
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4" />
                <span>{property.area}, {property.location}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                {property.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
                <Home className="w-4 h-4 text-slate-400" />
                <span>Full Address: {property.address}</span>
              </p>
            </div>

            {/* Price & Rating Box */}
            <div className="bg-teal-50/70 border border-teal-100 p-4 rounded-2xl text-right shrink-0 min-w-[200px]">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-800">
                ₹{Number(property.price).toLocaleString()}
                <span className="text-xs font-semibold text-slate-500"> / month</span>
              </div>
              
              {property.deposit > 0 && (
                <div className="text-xs text-slate-600 font-medium mt-1">
                  Security Deposit: <span className="font-bold">₹{Number(property.deposit).toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-1.5 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(property.rating || 4.5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{property.rating || 4.5} ({property.totalReviews || 12} reviews)</span>
              </div>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Category</span>
              <span className="font-bold text-slate-800">{property.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Room Config</span>
              <span className="font-bold text-slate-800">{property.roomType}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Furnishing</span>
              <span className="font-bold text-slate-800">{property.furnishedStatus}</span>
            </div>
              <div>
              <span className="text-slate-400 block font-medium">Availability</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Occupy
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>About this Property</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border border-slate-100">
              {property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Included Student Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(property.amenities || []).map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Contact & Direct Actions */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-teal-400 font-semibold uppercase tracking-wider">Contact Property Manager</div>
              <div className="text-lg font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-teal-400" />
                <span>{property.contactPerson || 'Caretaker / Owner'}</span>
              </div>
              <div className="text-xs text-slate-300">WhatsApp: +{property.whatsappNumber}</div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Inline Student Booking Form Section */}
          <div className="pt-4 border-t border-slate-200">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              
              <h3 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>Book This Accommodation Online</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Submit your booking request directly to the property admin. No upfront payment required.
              </p>

              {bookingSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-xs font-medium space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Booking Request Submitted Successfully!</span>
                  </div>
                  <p>The admin has received your details for <strong>{property.title}</strong> and will contact you shortly on phone or WhatsApp.</p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="text-xs text-teal-700 font-bold underline pt-1"
                  >
                    Submit another booking
                  </button>
                </div>
              ) : !currentUser ? (
                <div className="bg-amber-50 border border-amber-200/90 p-5 rounded-2xl text-center space-y-3 my-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-amber-950">Student Sign In Required to Book</h4>
                    <p className="text-xs text-amber-800/90 mt-1 max-w-md mx-auto leading-relaxed">
                      You need a student account to request bookings, track confirmation status, and receive real-time updates when the property admin approves your room.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRequireAuth && onRequireAuth(property)}
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-teal-600/20 transition-all inline-flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In / Register to Book</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInlineBookingSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={bookingData.studentName}
                        onChange={(e) => setBookingData({ ...bookingData, studentName: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={bookingData.studentPhone}
                        onChange={(e) => setBookingData({ ...bookingData, studentPhone: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@student.edu"
                        value={bookingData.studentEmail}
                        onChange={(e) => setBookingData({ ...bookingData, studentEmail: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Expected Move-in Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingData.moveInDate}
                        onChange={(e) => setBookingData({ ...bookingData, moveInDate: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Stay Duration</label>
                      <select
                        value={bookingData.durationMonths}
                        onChange={(e) => setBookingData({ ...bookingData, durationMonths: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      >
                        <option value={3}>3 Months</option>
                        <option value={6}>6 Months (Standard Semester)</option>
                        <option value={12}>12 Months (1 Full Year)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Special Requirements / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Prefer quiet room, double bed, or non-veg food"
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting Booking Request...' : 'Confirm & Request Booking Now'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
