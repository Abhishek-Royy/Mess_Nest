import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Sparkles, LogIn, UserPlus, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function UserAuthModal({ isOpen, onClose, onAuthSuccess, apiBase, initialTab = 'login', promptMessage = '' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' or 'register'
  
  // Update activeTab when initialTab changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, initialTab]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (activeTab === 'register') {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
        setErrorMessage('All fields are required.');
        return;
      }
      if (formData.password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }

      try {
        setIsLoading(true);
        const res = await axios.post(`${apiBase}/users/register`, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });

        if (res.data && res.data.success) {
          setSuccessMessage('Account created successfully! Logging you in...');
          setTimeout(() => {
            onAuthSuccess(res.data.user, res.data.token);
            onClose();
          }, 800);
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || 'Registration failed. Please verify your details or try again.'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // Login Flow
      if (!formData.email.trim() || !formData.password) {
        setErrorMessage('Please provide both email and password.');
        return;
      }

      try {
        setIsLoading(true);
        const res = await axios.post(`${apiBase}/users/login`, {
          email: formData.email,
          password: formData.password
        });

        if (res.data && res.data.success) {
          setSuccessMessage('Logged in successfully!');
          setTimeout(() => {
            onAuthSuccess(res.data.user, res.data.token);
            onClose();
          }, 600);
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || 'Invalid email or password. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-900 overflow-hidden">
        
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-teal-900 to-emerald-800 bg-clip-text text-transparent">
            {activeTab === 'login' ? 'Welcome Back Student' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === 'login'
              ? 'Access your booking statuses, real-time alerts & manage stays'
              : 'Sign up to track room bookings, check approvals & explore verified PGs'}
          </p>
        </div>

        {/* Action Prompt Banner (e.g. When trying to book without login) */}
        {promptMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-2xl flex items-center gap-2.5 mb-4 shadow-xs animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span className="font-semibold">{promptMessage}</span>
          </div>
        )}

        {/* Auth Tab Switcher */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold border border-slate-200">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Register</span>
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2 mb-4 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {activeTab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Abhishek Roy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="e.g. student@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{activeTab === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Switch Note */}
        <div className="mt-5 text-center text-xs text-slate-500">
          {activeTab === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => handleTabSwitch('register')}
                className="text-teal-700 font-bold hover:underline"
              >
                Register here
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                onClick={() => handleTabSwitch('login')}
                className="text-teal-700 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
