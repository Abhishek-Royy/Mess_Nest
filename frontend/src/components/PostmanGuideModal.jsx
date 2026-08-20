import React, { useState } from 'react';
import { X, Terminal, Copy, Check, ExternalLink, Code } from 'lucide-react';

export default function PostmanGuideModal({ onClose, propertyIdSample }) {
  const [copiedId, setCopiedId] = useState(null);

  const samplePostmanBody = {
    title: "Greenwood Student PG & Mess",
    category: "PG",
    location: "Bangalore",
    area: "Indiranagar",
    address: "#102, 10th Main, Near Metro Station, Indiranagar, Bangalore",
    price: 9000,
    deposit: 10000,
    roomType: "Double Sharing",
    furnishedStatus: "Furnished",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.7,
    amenities: ["Wi-Fi", "3 Meals Daily", "AC", "Laundry", "24/7 Security"],
    description: "Modern student PG with daily organic meals, study rooms, and quiet atmosphere.",
    contactPerson: "Mr. Sharma (Manager)",
    whatsappNumber: "919876543210"
  };

  const sampleBookingBody = {
    propertyId: propertyIdSample || "66b1a2b3c4d5e6f7a8b9c0d1",
    studentName: "Priya Sharma",
    studentPhone: "919988776655",
    studentEmail: "priya.sharma@college.edu",
    moveInDate: "2026-09-01",
    durationMonths: 6,
    notes: "Prefer 2nd floor room with study table"
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-slate-900">
      
      <div className="bg-slate-900 text-slate-100 rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-800 p-5 sm:p-8 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Postman & cURL API Testing Guide</h2>
            <p className="text-xs text-slate-400">All backend REST endpoints for Admin and Student operations</p>
          </div>
        </div>

        <div className="space-y-6 text-xs">
          
          {/* Endpoint Overview Table */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-teal-400 mb-2 flex items-center gap-1.5">
              <Code className="w-4 h-4" />
              <span>Available API Routes (Base URL: http://localhost:5000)</span>
            </h3>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-emerald-400 font-bold">GET /api/properties</span>
                <span className="text-slate-400">Fetch properties (Query filters: search, category, location, maxPrice)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-indigo-400 font-bold">POST /api/properties</span>
                <span className="text-slate-400">Admin create flat/PG/mess (JSON body)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-amber-400 font-bold">PUT /api/properties/:id</span>
                <span className="text-slate-400">Admin update property (JSON body)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-rose-400 font-bold">DELETE /api/properties/:id</span>
                <span className="text-slate-400">Admin delete property</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-indigo-400 font-bold">POST /api/bookings</span>
                <span className="text-slate-400">Student create booking request</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-amber-400 font-bold">PATCH /api/bookings/:id/status</span>
                <span className="text-slate-400">Admin accept/reject booking status</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-teal-400 font-bold">POST /api/users/register</span>
                <span className="text-slate-400">Register student account (name, email, phone, password)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-teal-400 font-bold">POST /api/users/login</span>
                <span className="text-slate-400">Student login authentication</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-emerald-400 font-bold">GET /api/users/my-bookings</span>
                <span className="text-slate-400">Fetch user booking list & status (?userId=... or ?email=...)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-emerald-400 font-bold">GET /api/users/notifications</span>
                <span className="text-slate-400">Fetch real-time alerts on admin acceptance/rejection</span>
              </div>
            </div>
          </div>

          {/* Postman Sample 1: Create Property */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white text-xs">1. Postman Payload - Create New Property (POST /api/properties)</span>
              <button
                onClick={() => copyToClipboard(JSON.stringify(samplePostmanBody, null, 2), 'createProp')}
                className="flex items-center gap-1 text-[11px] font-bold text-teal-400 hover:text-teal-300"
              >
                {copiedId === 'createProp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'createProp' ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-teal-300 font-mono text-[11px] overflow-x-auto max-h-48">
              {JSON.stringify(samplePostmanBody, null, 2)}
            </pre>
          </div>

          {/* Postman Sample 2: Create Booking */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white text-xs">2. Postman Payload - Submit Student Booking (POST /api/bookings)</span>
              <button
                onClick={() => copyToClipboard(JSON.stringify(sampleBookingBody, null, 2), 'createBooking')}
                className="flex items-center gap-1 text-[11px] font-bold text-teal-400 hover:text-teal-300"
              >
                {copiedId === 'createBooking' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'createBooking' ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-indigo-300 font-mono text-[11px] overflow-x-auto">
              {JSON.stringify(sampleBookingBody, null, 2)}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
}
