import React, { useState, useEffect, useRef } from 'react';
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
import UserAuthModal from './components/UserAuthModal';
import UserBookingsModal from './components/UserBookingsModal';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import { Home, Building2, Utensils, Sparkles, RefreshCw, AlertCircle, Phone, MessageSquare, CheckCircle2, XCircle, Bell } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'admin'
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('messnest_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [userBookings, setUserBookings] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const previousBookingsRef = useRef([]);

  // User Modals & Pending Actions
  const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState(false);
  const [userAuthInitialTab, setUserAuthInitialTab] = useState('login');
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [pendingBookingProperty, setPendingBookingProperty] = useState(null);
  const [isUserBookingsModalOpen, setIsUserBookingsModalOpen] = useState(false);
  const [userBookingsInitialTab, setUserBookingsInitialTab] = useState('bookings');

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

  // User Auth Handlers
  const handleOpenUserAuth = (tab = 'login', prompt = '') => {
    setUserAuthInitialTab(tab);
    setAuthPromptMessage(prompt);
    setIsUserAuthModalOpen(true);
  };

  // Intercept booking requests if user is not authenticated
  const handleBookNow = (property) => {
    if (!currentUser) {
      setPendingBookingProperty(property);
      setAuthPromptMessage(`Please sign in or register to book "${property.title}"`);
      setUserAuthInitialTab('login');
      setIsUserAuthModalOpen(true);
      showToast('Student sign-in required to request a room booking.');
      return;
    }
    setBookingModalProperty(property);
  };

  const handleUserAuthSuccess = (userData, token) => {
    setCurrentUser(userData);
    localStorage.setItem('messnest_user', JSON.stringify(userData));
    localStorage.setItem('messnest_user_token', token);
    
    // If user was attempting to book a property before auth, auto-open the booking modal!
    if (pendingBookingProperty) {
      const propToBook = pendingBookingProperty;
      setPendingBookingProperty(null);
      setAuthPromptMessage('');
      showToast(`Welcome ${userData.name}! Opening booking for ${propToBook.title}...`);
      setTimeout(() => {
        setBookingModalProperty(propToBook);
      }, 400);
    } else {
      showToast(`Welcome back, ${userData.name}!`);
    }

    fetchUserBookingsAndNotifications(userData);
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    setUserBookings([]);
    setUserNotifications([]);
    setPendingBookingProperty(null);
    setAuthPromptMessage('');
    localStorage.removeItem('messnest_user');
    localStorage.removeItem('messnest_user_token');
    showToast('You have been logged out.');
  };

  const handleOpenUserBookings = (tab = 'bookings') => {
    setUserBookingsInitialTab(tab);
    setIsUserBookingsModalOpen(true);
    if (currentUser) {
      fetchUserBookingsAndNotifications(currentUser);
    }
  };

  // Admin Auth Handlers
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

  // Fetch all bookings (for admin view)
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

  // Fetch user specific bookings & notifications
  const fetchUserBookingsAndNotifications = async (user = currentUser) => {
    if (!user) return;
    try {
      const userId = user.id || user._id;
      const email = user.email;

      // 1. Fetch user bookings
      const bookingRes = await axios.get(`${API_BASE}/users/my-bookings`, {
        params: { userId, email }
      });
      if (bookingRes.data && bookingRes.data.success) {
        const newBookings = bookingRes.data.data || [];
        
        // Detect status transition from Pending to Confirmed / Rejected
        if (previousBookingsRef.current.length > 0) {
          newBookings.forEach((nb) => {
            const oldB = previousBookingsRef.current.find((ob) => ob._id === nb._id);
            if (oldB && oldB.status !== nb.status) {
              if (nb.status === 'Confirmed') {
                showToast(`🎉 Booking Accepted! Your request for "${nb.propertyTitle}" is CONFIRMED.`);
              } else if (nb.status === 'Rejected') {
                showToast(`❌ Booking Update: Request for "${nb.propertyTitle}" was declined.`);
              }
            }
          });
        }
        previousBookingsRef.current = newBookings;
        setUserBookings(newBookings);
      }

      // 2. Fetch user notifications
      const notifRes = await axios.get(`${API_BASE}/users/notifications`, {
        params: { userId, email }
      });
      if (notifRes.data && notifRes.data.success) {
        setUserNotifications(notifRes.data.data || []);
      }
    } catch (err) {
      console.warn('Could not fetch user data:', err.message);
    }
  };

  // Mark single notification read
  const handleMarkNotificationRead = async (id) => {
    try {
      await axios.patch(`${API_BASE}/users/notifications/${id}/read`);
      setUserNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = async () => {
    if (!currentUser) return;
    try {
      await axios.patch(`${API_BASE}/users/notifications/mark-all-read`, {
        userId: currentUser.id || currentUser._id,
        email: currentUser.email
      });
      setUserNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  // Initial loads & filter changes
  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, [filters]);

  // Periodic Polling for user notifications & admin bookings (every 8 seconds)
  useEffect(() => {
    if (currentUser) {
      fetchUserBookingsAndNotifications(currentUser);
    }
    const interval = setInterval(() => {
      fetchBookings();
      if (currentUser) {
        fetchUserBookingsAndNotifications(currentUser);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      furnishedStatus: 'All',
      maxPrice: ''
    });
  };

  // Student Booking Submit Action
  const handleStudentSubmitBooking = async (bookingData) => {
    const res = await axios.post(`${API_BASE}/bookings`, bookingData);
    if (res.data && res.data.success) {
      showToast('Booking request submitted successfully!');
      fetchBookings();
      if (currentUser) {
        fetchUserBookingsAndNotifications(currentUser);
      }
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
      if (currentUser) {
        fetchUserBookingsAndNotifications(currentUser);
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking record?')) return;
    const res = await axios.delete(`${API_BASE}/bookings/${id}`);
    if (res.data && res.data.success) {
      showToast('Booking deleted.');
      fetchBookings();
      if (currentUser) {
        fetchUserBookingsAndNotifications(currentUser);
      }
    }
  };

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  const pendingBookingsCount = bookings.filter((b) => b.status === 'Pending').length;
  const unreadNotificationsCount = userNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">

      {/* Floating High-Visibility Toast Banner */}
      {notification && (
        <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center justify-between gap-3 text-xs font-bold animate-slideDown max-w-md ml-auto">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="leading-tight">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* Navbar Header with Dynamic Profile */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRequestAdminTab={handleRequestAdminTab}
        isAdminLoggedIn={isAdminLoggedIn}
        adminUser={adminUser}
        onAdminLogout={handleAdminLogout}
        onOpenAbout={() => setIsAboutOpen(true)}
        pendingBookingsCount={pendingBookingsCount}
        // User Auth props
        currentUser={currentUser}
        onOpenUserAuth={handleOpenUserAuth}
        onUserLogout={handleUserLogout}
        onOpenUserBookings={handleOpenUserBookings}
        userBookingsCount={userBookings.length}
        unreadNotificationsCount={unreadNotificationsCount}
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
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${isActive
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
                    onBookNow={(p) => handleBookNow(p)}
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
              if (currentUser) {
                fetchUserBookingsAndNotifications(currentUser);
              }
            }}
            onOpenPostmanGuide={() => setIsPostmanGuideOpen(false)}
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
            handleBookNow(p);
          }}
          onSubmitBooking={handleStudentSubmitBooking}
          currentUser={currentUser}
          onRequireAuth={(p) => {
            setSelectedProperty(null);
            handleBookNow(p);
          }}
        />
      )}

      {/* Quick Booking Modal */}
      {bookingModalProperty && (
        <BookingModal
          property={bookingModalProperty}
          onClose={() => setBookingModalProperty(null)}
          onSubmitBooking={handleStudentSubmitBooking}
          currentUser={currentUser}
          onRequireAuth={(p) => handleBookNow(p)}
        />
      )}

      {/* User Login & Register Modal */}
      <UserAuthModal
        isOpen={isUserAuthModalOpen}
        onClose={() => {
          setIsUserAuthModalOpen(false);
          setAuthPromptMessage('');
        }}
        onAuthSuccess={handleUserAuthSuccess}
        apiBase={API_BASE}
        initialTab={userAuthInitialTab}
        promptMessage={authPromptMessage}
      />

      {/* User Booking Status & Notifications Modal */}
      <UserBookingsModal
        isOpen={isUserBookingsModalOpen}
        onClose={() => setIsUserBookingsModalOpen(false)}
        currentUser={currentUser}
        userBookings={userBookings}
        userNotifications={userNotifications}
        onRefreshData={() => fetchUserBookingsAndNotifications(currentUser)}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        initialTab={userBookingsInitialTab}
      />

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

      {/* AI Chatbot — always visible, floating bottom-right */}
      <ChatbotWidget />

    </div>
  );
}
