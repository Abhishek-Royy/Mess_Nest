import React, { useState } from 'react';
import { 
  X, Calendar, Building, CheckCircle2, XCircle, Clock, Bell, 
  CheckCheck, Phone, Mail, User, ShieldCheck, ExternalLink, RefreshCw, MessageSquare, AlertCircle
} from 'lucide-react';

export default function UserBookingsModal({
  isOpen,
  onClose,
  currentUser,
  userBookings,
  userNotifications,
  onRefreshData,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onSelectPropertyFromBooking,
  initialTab = 'bookings'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'bookings' or 'notifications'

  if (!isOpen || !currentUser) return null;

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 relative text-slate-900 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-extrabold text-xl shadow-inner">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold">{currentUser.name}</h2>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-400/30">
                  Student Member
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-teal-400" /> {currentUser.email}
                </span>
                {currentUser.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-teal-400" /> {currentUser.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tab Switcher in Header */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Booking Status ({userBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </button>

            <button
              onClick={onRefreshData}
              title="Refresh updates"
              className="ml-auto p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">

          {/* TAB 1: BOOKING STATUS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {userBookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No Booking Requests Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When you request a room or mess accommodation, your booking status and approval updates will appear here in real-time.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                  >
                    Browse Available Properties
                  </button>
                </div>
              ) : (
                userBookings.map((b) => {
                  const isConfirmed = b.status === 'Confirmed';
                  const isRejected = b.status === 'Rejected';
                  const isPending = b.status === 'Pending';

                  return (
                    <div
                      key={b._id}
                      className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-sm ${
                        isConfirmed
                          ? 'border-emerald-200 shadow-emerald-500/5'
                          : isRejected
                          ? 'border-rose-200 shadow-rose-500/5'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Booking Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              REF ID: #{b._id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Booked on {new Date(b.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <h4 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
                            <Building className="w-4 h-4 text-teal-600 shrink-0" />
                            <span>{b.propertyTitle}</span>
                          </h4>
                        </div>

                        {/* Status Badge */}
                        <div className="self-start sm:self-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                              isConfirmed
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isRejected
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {isConfirmed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                            {isPending && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                            <span>Status: {b.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Status Explanation Banner */}
                      <div
                        className={`my-3 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                          isConfirmed
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-100'
                            : isRejected
                            ? 'bg-rose-50 text-rose-900 border border-rose-100'
                            : 'bg-amber-50 text-amber-900 border border-amber-100'
                        }`}
                      >
                        {isConfirmed && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <strong>Accepted by Admin! 🎉</strong> Your accommodation reservation is confirmed for move-in date <strong>{b.moveInDate}</strong>. The property manager has been assigned to contact you for room key handoff.
                            </div>
                          </>
                        )}
                        {isRejected && (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong>Declined by Admin.</strong> This property is currently at full capacity for your selected dates. Please explore alternative accommodations on Mess&Nest.
                            </div>
                          </>
                        )}
                        {isPending && (
                          <>
                            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong>Pending Admin Review.</strong> Your request has been sent to the accommodation manager. Once they accept or reject, your status will update here automatically.
                            </div>
                          </>
                        )}
                      </div>

                      {/* WhatsApp Notification Badge */}
                      {(isConfirmed || isRejected) && b.studentPhone && (
                        <div className="flex items-center gap-2 my-2 px-3 py-2 rounded-xl bg-[#25D366]/8 border border-[#25D366]/20 text-[11px]">
                          <svg className="w-3.5 h-3.5 text-[#128C7E] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <span className="text-[#128C7E] font-semibold">WhatsApp notification dispatched to your registered number: <strong>+{b.studentPhone}</strong></span>
                        </div>
                      )}

                      {/* Booking Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-slate-600">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Move-In Date</span>
                          <span className="font-bold text-slate-800">{b.moveInDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Stay Duration</span>
                          <span className="font-bold text-slate-800">{b.durationMonths || 6} Months</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Registered Phone</span>
                          <span className="font-bold text-slate-800">{b.studentPhone}</span>
                        </div>
                      </div>

                      {b.notes && (
                        <div className="mt-2.5 text-xs text-slate-500 bg-slate-100/70 px-3 py-1.5 rounded-lg">
                          <span className="font-semibold text-slate-700">Special Notes:</span> "{b.notes}"
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS CENTER */}
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-600">
                  Real-time Booking & Account Updates
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 hover:underline"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all as read</span>
                  </button>
                )}
              </div>

              {userNotifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">No Notifications Yet</h4>
                  <p className="text-xs text-slate-500">
                    Whenever an admin accepts or rejects your booking, instant alerts will arrive here.
                  </p>
                </div>
              ) : (
                userNotifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => !n.isRead && onMarkNotificationRead(n._id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      !n.isRead
                        ? 'bg-teal-50/50 border-teal-200 shadow-xs'
                        : 'bg-white border-slate-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                            n.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : n.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-teal-100 text-teal-700'
                          }`}
                        >
                          {n.status === 'Confirmed' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : n.status === 'Rejected' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {n.title}
                            </h5>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {n.message}
                          </p>
                          <div className="text-[10px] text-slate-400 mt-2 font-medium">
                            {new Date(n.createdAt || Date.now()).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}{' '}
                            •{' '}
                            {new Date(n.createdAt || Date.now()).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      {n.status && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            n.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : n.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {n.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <div className="text-slate-500 font-medium">
            Active Student Account: <span className="font-bold text-slate-800">{currentUser.name}</span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
