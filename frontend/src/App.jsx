import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import PropertyCard from './components/PropertyCard';
import PropertyDetailModal from './components/PropertyDetailModal';
import BookingModal from './components/BookingModal';
import AdminPortal from './components/AdminPortal';
import PostmanGuideModal from './components/PostmanGuideModal';
import AboutModal from './components/AboutModal';
import AdminLoginModal from './components/AdminLoginModal';
import Footer from './components/Footer';
import { Home, Building2, Utensils, Sparkles, RefreshCw, AlertCircle, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'admin'
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('messnest_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const isAdminLoggedIn = Boolean(adminUser);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  const handleRequestAdminTab = () => {
    if (isAdminLoggedIn) {
      setActiveTab('admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = (adminData, token) => {
    setAdminUser(adminData);
    localStorage.setItem('messnest_admin_user', JSON.stringify(adminData));
    localStorage.setItem('messnest_admin_token', token);
    setActiveTab('admin');
    showToast(`Logged in as Admin (${adminData.username || 'admin'})!`);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('messnest_admin_user');
    localStorage.removeItem('messnest_admin_token');
    setActiveTab('explore');
    showToast('Logged out of Admin Portal.');
  };

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    furnishedStatus: 'All',
    maxPrice: ''
  });

  // Modal States
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingModalProperty, setBookingModalProperty] = useState(null);
  const [isPostmanGuideOpen, setIsPostmanGuideOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch properties from backend
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.furnishedStatus && filters.furnishedStatus !== 'All') params.furnishedStatus = filters.furnishedStatus;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await axios.get(`${API_BASE}/properties`, { params });
      if (res.data && res.data.success) {
        setProperties(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Could not connect to backend server. Make sure node server is running on http://localhost:5000');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch student bookings from backend (for admin view & pending counter)
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bookings`);
      if (res.data && res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.warn('Could not fetch bookings:', err.message);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      furnishedStatus: 'All',
      maxPrice: ''
    });
  };

  // Student Actions
  const handleStudentSubmitBooking = async (bookingData) => {
    const res = await axios.post(`${API_BASE}/bookings`, bookingData);
    if (res.data && res.data.success) {
      showToast('Booking request submitted successfully!');
      fetchBookings();
    }
    return res.data;
  };

  // Admin Actions
  const handleCreateProperty = async (propData) => {
    const res = await axios.post(`${API_BASE}/properties`, propData);
    if (res.data && res.data.success) {
      showToast('New property created successfully!');
      fetchProperties();
    }
  };

  const handleUpdateProperty = async (id, propData) => {
    const res = await axios.put(`${API_BASE}/properties/${id}`, propData);
    if (res.data && res.data.success) {
      showToast('Property updated successfully!');
      fetchProperties();
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    const res = await axios.delete(`${API_BASE}/properties/${id}`);
    if (res.data && res.data.success) {
      showToast('Property deleted successfully!');
      fetchProperties();
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    const res = await axios.patch(`${API_BASE}/bookings/${id}/status`, { status });
    if (res.data && res.data.success) {
      showToast(`Booking request marked as ${status}!`);
      fetchBookings();
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking record?')) return;
    const res = await axios.delete(`${API_BASE}/bookings/${id}`);
    if (res.data && res.data.success) {
      showToast('Booking deleted.');
      fetchBookings();
    }
  };

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  const pendingBookingsCount = bookings.filter((b) => b.status === 'Pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-4 z-50 bg-teal-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-teal-700 flex items-center gap-2 text-xs font-bold animate-slideDown max-w-sm ml-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{notification}</span>
        </div>
      )}

      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRequestAdminTab={handleRequestAdminTab}
        isAdminLoggedIn={isAdminLoggedIn}
        adminUser={adminUser}
        onAdminLogout={handleAdminLogout}
        onOpenPostmanGuide={() => setIsPostmanGuideOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        pendingBookingsCount={pendingBookingsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* EXPLORE TAB (STUDENT HOME VIEW) */}
        {activeTab === 'explore' && (
          <div>
            
            {/* Hero & Search Banner */}
            <HeroSearch
              filters={filters}
              setFilters={setFilters}
              onResetFilters={handleResetFilters}
            />

            {/* Quick Category Filter Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full">
                {[
                  { label: 'All Listings', value: 'All', icon: Sparkles },
                  { label: 'PG Accommodations', value: 'PG', icon: Home },
                  { label: 'Flats & Apartments', value: 'Flat', icon: Building2 },
                  { label: 'Student Mess', value: 'Mess', icon: Utensils }
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = filters.category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setFilters({ ...filters, category: cat.value })}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-105'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-slate-500 font-semibold self-end sm:self-center">
                Showing <span className="text-slate-900 font-bold">{properties.length}</span> verified results
              </div>
            </div>

            {/* Error Message if API unreachable */}
            {error && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-xs flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={fetchProperties}
                  className="bg-amber-600 text-white font-bold px-3 py-1 rounded-xl text-xs shrink-0 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            )}

            {/* Loading Spinner */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-slate-200/60 rounded-2xl"></div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 my-8">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No properties found matching your filter</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search terms or selecting a different location / category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Property Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    onSelectProperty={(p) => setSelectedProperty(p)}
                    onBookNow={(p) => setBookingModalProperty(p)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* ADMIN PORTAL TAB */}
        {activeTab === 'admin' && (
          <AdminPortal
            properties={properties}
            bookings={bookings}
            adminUser={adminUser}
            onAdminLogout={handleAdminLogout}
            onCreateProperty={handleCreateProperty}
            onUpdateProperty={handleUpdateProperty}
            onDeleteProperty={handleDeleteProperty}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onDeleteBooking={handleDeleteBooking}
            onRefreshData={() => {
              fetchProperties();
              fetchBookings();
            }}
            onOpenPostmanGuide={() => setIsPostmanGuideOpen(true)}
          />
        )}

      </main>

      {/* Property Full Details Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onOpenBookingModal={(p) => {
            setSelectedProperty(null);
            setBookingModalProperty(p);
          }}
          onSubmitBooking={handleStudentSubmitBooking}
        />
      )}

      {/* Quick Booking Modal */}
      {bookingModalProperty && (
        <BookingModal
          property={bookingModalProperty}
          onClose={() => setBookingModalProperty(null)}
          onSubmitBooking={handleStudentSubmitBooking}
        />
      )}

      {/* Postman Guide Modal */}
      {isPostmanGuideOpen && (
        <PostmanGuideModal
          onClose={() => setIsPostmanGuideOpen(false)}
          propertyIdSample={properties[0]?._id}
        />
      )}

      {/* About Us Modal */}
      {isAboutOpen && (
        <AboutModal
          onClose={() => setIsAboutOpen(false)}
          onOpenAdmin={handleRequestAdminTab}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        apiBase={API_BASE}
      />

      {/* Rich Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onRequestAdminTab={handleRequestAdminTab}
        onOpenPostmanGuide={() => setIsPostmanGuideOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

    </div>
  );
}
