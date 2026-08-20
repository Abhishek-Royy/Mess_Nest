import React, { useState } from 'react';
import { PlusCircle, Trash2, Edit3, CheckCircle2, XCircle, Clock, Building, UserCheck, RefreshCw, Terminal, Phone, Mail, Calendar, LogOut } from 'lucide-react';

export default function AdminPortal({
  properties,
  bookings,
  adminUser,
  onAdminLogout,
  onCreateProperty,
  onUpdateProperty,
  onDeleteProperty,
  onUpdateBookingStatus,
  onDeleteBooking,
  onRefreshData,
  onOpenPostmanGuide
}) {
  const [adminTab, setAdminTab] = useState('bookings'); // 'bookings' or 'properties' or 'addProperty'

  // Form state for creating / editing property
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [propForm, setPropForm] = useState({
    title: '',
    category: 'PG',
    location: '',
    area: '',
    address: '',
    price: '',
    deposit: '',
    roomType: 'Single Room',
    furnishedStatus: 'Furnished',
    images: '',
    rating: 4.5,
    amenities: 'High-speed Wi-Fi, 24/7 Security, RO Water',
    description: '',
    contactPerson: '',
    whatsappNumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEditingPropertyId(null);
    setPropForm({
      title: '',
      category: 'PG',
      location: '',
      area: '',
      address: '',
      price: '',
      deposit: '',
      roomType: 'Single Room',
      furnishedStatus: 'Furnished',
      images: '',
      rating: 4.5,
      amenities: 'High-speed Wi-Fi, 24/7 Security, RO Water',
      description: '',
      contactPerson: '',
      whatsappNumber: ''
    });
  };

  const handleStartEdit = (property) => {
    setEditingPropertyId(property._id);
    setPropForm({
      title: property.title || '',
      category: property.category || 'PG',
      location: property.location || '',
      area: property.area || '',
      address: property.address || '',
      price: property.price || '',
      deposit: property.deposit || '',
      roomType: property.roomType || 'Single Room',
      furnishedStatus: property.furnishedStatus || 'Furnished',
      images: Array.isArray(property.images) ? property.images.join(', ') : property.images || '',
      rating: property.rating || 4.5,
      amenities: Array.isArray(property.amenities) ? property.amenities.join(', ') : property.amenities || '',
      description: property.description || '',
      contactPerson: property.contactPerson || '',
      whatsappNumber: property.whatsappNumber || ''
    });
    setAdminTab('addProperty');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingPropertyId) {
        await onUpdateProperty(editingPropertyId, propForm);
        alert('Property updated successfully!');
      } else {
        await onCreateProperty(propForm);
        alert('New Property posted successfully!');
      }
      resetForm();
      setAdminTab('properties');
    } catch (err) {
      alert('Error saving property: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Admin Management Portal</span>
            {adminUser && (
              <span className="text-emerald-400 font-normal">({adminUser.username})</span>
            )}
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Control Center & Booking Handler
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Authenticated via MongoDB database as <span className="text-white font-semibold">{adminUser?.name || 'Admin User'}</span> ({adminUser?.role || 'Super Admin'}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRefreshData}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={onOpenPostmanGuide}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Postman Docs</span>
          </button>

          {onAdminLogout && (
            <button
              onClick={onAdminLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              title="Log out of Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2">
        <button
          onClick={() => setAdminTab('bookings')}
          className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
            adminTab === 'bookings'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Student Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('properties')}
          className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
            adminTab === 'properties'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Manage Properties ({properties.length})</span>
        </button>

        <button
          onClick={() => {
            resetForm();
            setAdminTab('addProperty');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
            adminTab === 'addProperty'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingPropertyId ? 'Edit Property' : '+ Post New Property'}</span>
        </button>
      </div>

      {/* TAB 1: Student Bookings */}
      {adminTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Incoming Student Booking Requests</span>
            <span className="text-xs text-slate-500 font-normal">
              Click status button to approve or reject
            </span>
          </h3>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Clock className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium">No student bookings received yet.</p>
              <p className="text-xs">Students can book accommodations from the property cards or details view.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student Info</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Move-in / Stay</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{b.studentName}</div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-teal-600" /> {b.studentPhone}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-indigo-600" /> {b.studentEmail}
                        </div>
                        {b.notes && (
                          <div className="text-[10px] text-slate-500 italic mt-1 bg-slate-100 p-1.5 rounded-md">
                            "{b.notes}"
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800 line-clamp-1">{b.propertyTitle}</div>
                        <div className="text-[10px] text-slate-400">ID: {b.propertyId?._id || b.propertyId || 'N/A'}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.moveInDate}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{b.durationMonths || 6} Months Stay</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                          {b.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                          {b.status === 'Pending' && <Clock className="w-3 h-3" />}
                          <span>{b.status}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status !== 'Confirmed' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b._id, 'Confirmed')}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status !== 'Rejected' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b._id, 'Rejected')}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all"
                            >
                              Reject
                            </button>
                          )}
                          {b.studentPhone && (
                            <a
                              href={`https://wa.me/${b.studentPhone.replace(/[^0-9]/g, '').length === 10 ? '91' + b.studentPhone.replace(/[^0-9]/g, '') : b.studentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${b.studentName}, this is regarding your booking request for "${b.propertyTitle}" on Mess&Nest.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] px-2 py-1 rounded-lg text-[11px] font-bold transition-all"
                              title={`WhatsApp ${b.studentName}`}
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              WA
                            </a>
                          )}
                          <button
                            onClick={() => onDeleteBooking(b._id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Manage Properties */}
      {adminTab === 'properties' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Current Properties ({properties.length})</h3>
            <button
              onClick={() => {
                resetForm();
                setAdminTab('addProperty');
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Listing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p) => (
              <div key={p._id} className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between bg-slate-50/50">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {p.category}
                    </span>
                    <span className="text-xs font-extrabold text-teal-800">
                      ₹{Number(p.price).toLocaleString()}/mo
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">{p.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">{p.area}, {p.location}</p>
                  
                  <div className="text-[11px] text-slate-600 space-y-1 mb-3">
                    <div>Status: <span className="font-semibold">{p.furnishedStatus}</span></div>
                    <div>Room: <span className="font-semibold">{p.roomType}</span></div>
                    <div>WhatsApp: <span className="font-mono text-slate-800">+{p.whatsappNumber}</span></div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => handleStartEdit(p)}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDeleteProperty(p._id)}
                    className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Post/Edit Property Form */}
      {adminTab === 'addProperty' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingPropertyId ? 'Edit Property Listing' : 'Post New Flat, PG or Mess Listing'}
              </h3>
              <p className="text-xs text-slate-500">
                This endpoint is also accessible via Postman: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-700 font-mono">POST /api/properties</code>
              </p>
            </div>
            {editingPropertyId && (
              <button
                onClick={resetForm}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property Name / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Park Student PG"
                  value={propForm.title}
                  onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={propForm.category}
                  onChange={(e) => setPropForm({ ...propForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="PG">PG (Paying Guest)</option>
                  <option value="Flat">Flat / Apartment</option>
                  <option value="Mess">Mess / Food Service</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore"
                  value={propForm.location}
                  onChange={(e) => setPropForm({ ...propForm, location: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area / Suburb *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Koramangala"
                  value={propForm.area}
                  onChange={(e) => setPropForm({ ...propForm, area: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rent Price (₹/mo) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 8500"
                  value={propForm.price}
                  onChange={(e) => setPropForm({ ...propForm, price: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  value={propForm.deposit}
                  onChange={(e) => setPropForm({ ...propForm, deposit: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room Type</label>
                <select
                  value={propForm.roomType}
                  onChange={(e) => setPropForm({ ...propForm, roomType: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Single Room">Single Room</option>
                  <option value="Double Sharing">Double Sharing</option>
                  <option value="Triple Sharing">Triple Sharing</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="Full Mess Service">Full Mess Service</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Furnishing Status *</label>
                <select
                  value={propForm.furnishedStatus}
                  onChange={(e) => setPropForm({ ...propForm, furnishedStatus: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Contact No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 919876543210"
                  value={propForm.whatsappNumber}
                  onChange={(e) => setPropForm({ ...propForm, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. #42, 8th Main Road, Near College Gate 2, Koramangala"
                value={propForm.address}
                onChange={(e) => setPropForm({ ...propForm, address: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Image URLs (comma-separated for gallery)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..., https://..."
                value={propForm.images}
                onChange={(e) => setPropForm({ ...propForm, images: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Amenities (comma-separated)</label>
              <input
                type="text"
                placeholder="Wi-Fi, AC, Food, Power Backup, Security"
                value={propForm.amenities}
                onChange={(e) => setPropForm({ ...propForm, amenities: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Detailed property info, student suitability, nearby landmarks..."
                value={propForm.description}
                onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{editingPropertyId ? 'Save Updates' : 'Post Property Now'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
