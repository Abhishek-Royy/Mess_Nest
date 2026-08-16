# 🏠 Mess & Flat Hunting Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_v8.5-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A modern, full-stack web platform designed to simplify accommodation and food service discovery for college students, interns, and working professionals across major educational and IT hubs (e.g., Bangalore, Delhi, Kota, Pune). 

The platform connects users with verified **PGs (Paying Guest accommodations)**, **Shared/Full Flats**, and **Mess & Food Facilities**, enabling seamless search, instant booking requests, direct landlord WhatsApp communication, and an integrated admin management dashboard.

---

## 📋 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Database Seeding](#-database-seeding)
- [API Documentation](#-api-documentation)
  - [Health Check](#health-check)
  - [Properties Endpoints](#properties-endpoints)
  - [Bookings Endpoints](#bookings-endpoints)
  - [Seed Endpoint](#seed-endpoint)
- [Admin Portal & Workflow](#-admin-portal--workflow)
- [Troubleshooting & Gotchas](#-troubleshooting--gotchas)
- [License](#-license)

---

## ✨ Features

### 🔍 For Students & Seekers
* **Multi-Criteria Search & Filtering**: Filter listings by Category (`PG`, `Flat`, `Mess`), Location/City, Neighborhood Area, Furnishing Status (`Furnished`, `Semi-Furnished`, `Unfurnished`), Maximum Rent Budget, and freeform keywords.
* **Rich Accommodation Details**: Interactive image galleries, detailed price breakdown (Rent + Security Deposit), room types, verified amenities lists, and caretaker/owner profiles.
* **Instant One-Click Booking**: Submit room/mess reservation requests directly with desired move-in dates and stay duration.
* **Direct WhatsApp Integration**: Contact property owners directly via pre-configured WhatsApp chat links.

### 🛡️ For Administrators & Property Owners
* **Full CRUD Operations for Listings**: Create new listings with multi-image support, edit existing details, toggle availability, or delete old properties.
* **Booking Request Dashboard**: View incoming student reservation requests, filter by status (`Pending`, `Confirmed`, `Rejected`), approve/reject bookings, or delete outdated records.
* **One-Click Database Seeder**: Built-in seed trigger to populate MongoDB with high-quality sample listings across multiple cities.

### 🛠️ Developer & Integration Features
* **In-App API Guide**: Interactive Postman API documentation modal baked directly into the frontend interface.
* **Robust MongoDB Connection**: Built-in DNS resolver fallback (Google Public DNS) to eliminate Windows/ISP SRV record lookup issues with MongoDB Atlas.

---

## 📐 System Architecture

```mermaid
graph TD
    User([Student / User]) <--> Frontend[React + Vite + Tailwind CSS]
    Admin([Property Manager]) <--> Frontend
    
    Frontend <-->|REST API / JSON| Backend[Express.js Node Backend]
    
    subgraph Backend Infrastructure
        Backend -->|Mongoose ODM| DB[(MongoDB Atlas Cloud DB)]
        Backend -->|Routes| PropRoute[/api/properties]
        Backend -->|Routes| BookRoute[/api/bookings]
        Backend -->|Routes| SeedRoute[/api/seed]
        Backend -->|Health Check| HealthRoute[/api/health]
    end
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) (Vite bundler)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) with PostCSS & Autoprefixer
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js v4](https://expressjs.com/)
- **Database & ODM**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose v8](https://mongoosejs.com/)
- **Utility Tools**: `dotenv` for environment management, `cors` for cross-origin requests, `nodemon` for hot-reloading development server.

---

## 📁 Project Directory Structure

```text
mess-hunting/
├── backend/
│   ├── models/
│   │   ├── Booking.js          # Mongoose schema for student booking requests
│   │   └── Property.js         # Mongoose schema for PGs, Flats & Messes
│   ├── routes/
│   │   ├── bookingRoutes.js    # API endpoints for booking operations
│   │   ├── propertyRoutes.js   # API endpoints for property listing CRUD
│   │   └── seedRoutes.js       # Database seeder endpoint
│   ├── .env                    # Backend environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js               # Express app setup & MongoDB connection
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AboutModal.jsx          # Platform overview & mission modal
│   │   │   ├── AdminPortal.jsx         # Admin management dashboard
│   │   │   ├── BookingModal.jsx        # Reservation request form modal
│   │   │   ├── Footer.jsx              # Application footer
│   │   │   ├── HeroSearch.jsx          # Hero section with live search filters
│   │   │   ├── Navbar.jsx              # Navigation header
│   │   │   ├── PostmanGuideModal.jsx   # Interactive API reference guide
│   │   │   ├── PropertyCard.jsx        # Listing summary card component
│   │   │   └── PropertyDetailModal.jsx # Detailed view modal with gallery & CTA
│   │   ├── App.jsx                     # Main React Application state & logic
│   │   ├── index.css                   # Global styles & Tailwind directives
│   │   └── main.jsx                    # React DOM entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (v18.0.0 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (v9.0.0 or higher, comes bundled with Node.js)
- **MongoDB Atlas Account** (or a local MongoDB instance running on port `27017`)

---

## 🔐 Environment Configuration

Create or update the `.env` file in the `backend/` directory:

`backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.zpkiaxy.mongodb.net/mess_hunting?retryWrites=true&w=majority
```

> 💡 **Note**: If `MONGO_URI` is omitted, the server will log an error and exit.

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mess-hunting.git
cd mess-hunting
```

### 2. Backend Setup

Open a terminal window and navigate to the backend folder:

```bash
cd backend
npm install
```

Start the development server with hot-reloading:

```bash
npm run dev
```

*The backend server will launch on `http://localhost:5000`.*

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

*The frontend app will launch on `http://localhost:5173` (or port specified by Vite).*

---

## 🌱 Database Seeding

To quickly populate your MongoDB database with initial sample listings (PGs in Bangalore, Flats in Delhi, Messes in Kota, etc.) and a demo booking request:

1. Launch both the backend and frontend servers.
2. Click on the **"Reset / Seed Database"** button inside the **Admin Portal** in the web UI.
3. Alternatively, issue an HTTP `POST` request to:
   ```http
   POST http://localhost:5000/api/seed
   ```

---

## 📡 API Documentation

### Health Check

#### `GET /api/health`
Returns the status of the server and database connectivity.
* **Response `200 OK`**:
  ```json
  {
    "status": "API operational",
    "timestamp": "2026-08-16T11:00:00.000Z",
    "dbState": "Connected to MongoDB Atlas",
    "mongoUriConfigured": true
  }
  ```

---

### Properties Endpoints

#### `GET /api/properties`
Fetch all properties with optional query filtering.
* **Query Parameters**:
  * `category`: `PG` | `Flat` | `Mess` | `All`
  * `location`: Filter by city (case-insensitive substring)
  * `area`: Filter by area/neighborhood
  * `furnishedStatus`: `Furnished` | `Semi-Furnished` | `Unfurnished` | `All`
  * `maxPrice`: Maximum rent price (numeric)
  * `search`: Search keyword against title, location, area, room type, description
* **Response `200 OK`**:
  ```json
  {
    "success": true,
    "count": 6,
    "data": [ /* Array of Property objects */ ]
  }
  ```

#### `GET /api/properties/:id`
Fetch details for a specific property by ID.

#### `POST /api/properties`
Create a new property listing.
* **Request Body**:
  ```json
  {
    "title": "Sunrise Student PG",
    "category": "PG",
    "location": "Bangalore",
    "area": "Koramangala",
    "address": "42, 8th Main Road",
    "price": 8500,
    "deposit": 10000,
    "roomType": "Double Sharing",
    "furnishedStatus": "Furnished",
    "images": ["https://images.unsplash.com/..."],
    "amenities": ["High-speed Wi-Fi", "Daily 3-Time Food", "AC Room"],
    "whatsappNumber": "919876543210",
    "contactPerson": "Ramesh Owner"
  }
  ```

#### `PUT /api/properties/:id`
Update an existing property by ID.

#### `DELETE /api/properties/:id`
Delete a property by ID.

---

### Bookings Endpoints

#### `POST /api/bookings`
Submit a new student booking request.
* **Request Body**:
  ```json
  {
    "propertyId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "studentName": "Rahul Sharma",
    "studentPhone": "919876543210",
    "studentEmail": "rahul.sharma@example.com",
    "moveInDate": "2026-09-01",
    "durationMonths": 6,
    "notes": "Prefer upper floor room."
  }
  ```

#### `GET /api/bookings`
Fetch all booking requests (supports status filter `?status=Pending`).

#### `PATCH /api/bookings/:id/status`
Update a booking's status.
* **Request Body**:
  ```json
  {
    "status": "Confirmed" // "Pending" | "Confirmed" | "Rejected"
  }
  ```

#### `DELETE /api/bookings/:id`
Delete a booking record by ID.

---

### Seed Endpoint

#### `POST /api/seed`
Clears existing database records and inserts default sample properties & bookings.

---

## 🔑 Admin Portal & Workflow

Access the **Admin Portal** by clicking the **"Admin Portal"** button in the navigation header.

1. **Listing Management**:
   - Add new properties with custom image URLs, amenities, prices, and WhatsApp numbers.
   - Edit or soft-toggle property availability.
   - Remove out-of-service listings.
2. **Booking Management**:
   - Monitor real-time student reservation inquiries.
   - Mark applications as **Confirmed** or **Rejected**.
   - Contact applicants directly using recorded contact details.

---

## 🔧 Troubleshooting & Gotchas

* **MongoDB Atlas Connection Timeouts on Windows**:
  Some local ISPs or Windows DNS configurations fail to resolve MongoDB Atlas `mongodb+srv://` SRV records. The backend automatically forces Google Public DNS (`8.8.8.8`) at server startup in `server.js` to ensure reliable connectivity.
* **CORS Errors**:
  Ensure the backend is running on `http://localhost:5000`. The Express server has CORS enabled (`app.use(cors())`) for seamless communication with the frontend dev server (`http://localhost:5173`).

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
