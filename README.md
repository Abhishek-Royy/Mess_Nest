# 🏠 Mess & Flat Hunting Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_v8.5-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML_Chatbot-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A modern, full-stack web platform designed to simplify accommodation and food service discovery for college students, interns, and working professionals across major educational and IT hubs (e.g., Bangalore, Delhi, Kota, Pune).

The platform connects users with verified **PGs (Paying Guest accommodations)**, **Shared/Full Flats**, and **Mess & Food Facilities**, enabling seamless search, instant booking requests, direct landlord WhatsApp communication, an integrated admin management dashboard, and an **AI-powered chatbot** trained on custom Q&A data.

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
  - [3. Chatbot AI Setup](#3-chatbot-ai-setup)
  - [4. Frontend Setup](#4-frontend-setup)
- [Database Seeding](#-database-seeding)
- [API Documentation](#-api-documentation)
  - [Health Check](#health-check)
  - [Properties Endpoints](#properties-endpoints)
  - [Bookings Endpoints](#bookings-endpoints)
  - [Seed Endpoint](#seed-endpoint)
  - [Chatbot Endpoint](#chatbot-endpoint)
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
* **🤖 AI Chatbot Assistant**: A floating chat bubble (bottom-right corner) powered by a custom-trained ML model that answers mess/PG-related questions in real time. Includes typing indicator, quick-reply suggestions, and smart fallback responses.

### 🛡️ For Administrators & Property Owners
* **Full CRUD Operations for Listings**: Create new listings with multi-image support, edit existing details, toggle availability, or delete old properties.
* **Booking Request Dashboard**: View incoming student reservation requests, filter by status (`Pending`, `Confirmed`, `Rejected`), approve/reject bookings, or delete outdated records.
* **One-Click Database Seeder**: Built-in seed trigger to populate MongoDB with high-quality sample listings across multiple cities.

### 🛠️ Developer & Integration Features
* **In-App API Guide**: Interactive Postman API documentation modal baked directly into the frontend interface.
* **Robust MongoDB Connection**: Built-in DNS resolver fallback (Google Public DNS) to eliminate Windows/ISP SRV record lookup issues with MongoDB Atlas.
* **Custom-Trained NLP Model**: TF-IDF vectorization + Logistic Regression classifier trained on 74+ curated Q&A pairs, saved as portable `.pkl` files and served via a lightweight Flask API.

---

## 📐 System Architecture

```mermaid
graph TD
    User([Student / User]) <--> Frontend[React + Vite + Tailwind CSS]
    Admin([Property Manager]) <--> Frontend

    Frontend <-->|REST API / JSON| Backend[Express.js Node Backend]
    Frontend <-->|POST /api/chat| Chatbot[Flask Chatbot API :5001]

    subgraph Backend Infrastructure
        Backend -->|Mongoose ODM| DB[(MongoDB Atlas Cloud DB)]
        Backend -->|Routes| PropRoute[/api/properties]
        Backend -->|Routes| BookRoute[/api/bookings]
        Backend -->|Routes| SeedRoute[/api/seed]
        Backend -->|Health Check| HealthRoute[/api/health]
    end

    subgraph Chatbot AI Pipeline
        Chatbot -->|loads| Model[model.pkl + vectorizer.pkl]
        Model -->|trained from| CSV[training_data.csv]
        CSV -->|TF-IDF + LR| TrainScript[train.py]
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

### AI Chatbot
- **Language**: [Python 3.11+](https://www.python.org/)
- **ML Framework**: [scikit-learn](https://scikit-learn.org/) — TF-IDF Vectorizer + Logistic Regression classifier
- **API Server**: [Flask](https://flask.palletsprojects.com/) with [Flask-CORS](https://flask-cors.readthedocs.io/)
- **Model Persistence**: [joblib](https://joblib.readthedocs.io/) for `.pkl` serialization
- **Data Processing**: [pandas](https://pandas.pydata.org/), [numpy](https://numpy.org/)

---

## 📁 Project Directory Structure

```text
mess_hunting/
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
├── chatbot/                    # ← AI Chatbot (Python / Flask)
│   ├── data/
│   │   └── training_data.csv   # 74+ curated mess/PG Q&A pairs
│   ├── model.pkl               # Trained Logistic Regression model (generated)
│   ├── vectorizer.pkl          # Fitted TF-IDF vectorizer (generated)
│   ├── train.py                # Run once to train & save model artifacts
│   ├── app.py                  # Flask chatbot API server (port 5001)
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AboutModal.jsx          # Platform overview & mission modal
│   │   │   ├── AdminLoginModal.jsx     # Admin authentication modal
│   │   │   ├── AdminPortal.jsx         # Admin management dashboard
│   │   │   ├── BookingModal.jsx        # Reservation request form modal
│   │   │   ├── ChatbotWidget.jsx       # ← Floating AI chatbot bubble component
│   │   │   ├── Footer.jsx              # Application footer
│   │   │   ├── HeroSearch.jsx          # Hero section with live search filters
│   │   │   ├── Navbar.jsx              # Navigation header
│   │   │   ├── PostmanGuideModal.jsx   # Interactive API reference guide
│   │   │   ├── PropertyCard.jsx        # Listing summary card component
│   │   │   └── PropertyDetailModal.jsx # Detailed view modal with gallery & CTA
│   │   ├── App.jsx                     # Main React application state & logic
│   │   ├── index.css                   # Global styles & Tailwind directives
│   │   └── main.jsx                    # React DOM entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── implementation_plan.md      # AI chatbot feature plan
├── qna.csv                     # Source Q&A data
└── README.md
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (v18.0.0 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (v9.0.0 or higher, comes bundled with Node.js)
- **Python** (v3.11 or higher) - [Download Python](https://www.python.org/downloads/)
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

Follow these steps to set up and run the project locally. You will need **three terminal windows** running simultaneously.

### 1. Clone the Repository

```bash
git clone https://github.com/Abhishek-Royy/Mess_Nest.git
cd mess_hunting
```

### 2. Backend Setup

Open **Terminal 1** and navigate to the backend folder:

```bash
cd backend
npm install
npm start
```

*The backend server will launch on `http://localhost:5000`.*

### 3. Chatbot AI Setup

Open **Terminal 2** and navigate to the chatbot folder:

```bash
cd chatbot
pip install -r requirements.txt
```

**Train the model** (run once — regenerates `model.pkl` and `vectorizer.pkl`):

```bash
python train.py
```

Expected output:
```
[*] Loading training data from: .../chatbot/data/training_data.csv
[+] Loaded 74 Q&A pairs.
[+] Training accuracy: 100.0%
[+] model.pkl saved -> .../chatbot/model.pkl
[+] vectorizer.pkl saved -> .../chatbot/vectorizer.pkl

[OK] Training complete! You can now start the Flask server with: python app.py
```

**Start the Flask chatbot API server:**

```bash
python app.py
```

*The chatbot API will launch on `http://localhost:5001`.*

> ℹ️ **Tip**: Re-run `python train.py` only when you add new rows to `training_data.csv`. The trained `.pkl` files persist across restarts.

### 4. Frontend Setup

Open **Terminal 3** and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

*The frontend app will launch on `http://localhost:5173` (or the port specified by Vite).*

Once all three servers are running, open `http://localhost:5173` in your browser. The **💬 AI chat bubble** will appear in the bottom-right corner of every page.

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
    "timestamp": "2026-08-18T00:00:00.000Z",
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

### Chatbot Endpoint

The chatbot API runs as a separate Flask service on **port 5001**.

#### `POST /api/chat`
Send a user message and receive an AI-generated reply.
* **Request Body**:
  ```json
  { "message": "How do I book a mess?" }
  ```
* **Response `200 OK`**:
  ```json
  { "reply": "Open the mess listing, review the details, and submit your booking request with your required move-in date and stay duration." }
  ```
* **Low-confidence fallback**: If the model confidence is below threshold, returns:
  ```json
  { "reply": "I'm not sure about that. Please contact support or browse our listings for more information." }
  ```

#### `GET /api/health` *(chatbot server)*
Returns chatbot server health on `http://localhost:5001/api/health`.
```json
{ "status": "ok", "model": "loaded" }
```

> 💡 **Training your own data**: Edit `chatbot/data/training_data.csv` (add rows with `question` and `answer` columns), then re-run `python train.py` to retrain the model.

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
  Ensure the backend is running on `http://localhost:5000`. The Express server has CORS enabled (`app.use(cors())`) for seamless communication with the frontend dev server (`http://localhost:5173`). The Flask chatbot server also has CORS configured for `localhost:5173` and `localhost:3000`.

* **Chatbot replies "Could not connect to AI server"**:
  Make sure the Flask chatbot server is running (`python app.py` inside the `chatbot/` folder). If `model.pkl` or `vectorizer.pkl` are missing, run `python train.py` first.

* **`multi_class` FutureWarning from scikit-learn**:
  This is a non-breaking deprecation warning from scikit-learn ≥ 1.5. The model trains and predicts correctly. It will be resolved in a future update by removing the `multi_class='auto'` parameter.

* **UnicodeEncodeError on Windows terminals**:
  Emoji characters are intentionally removed from all Python `print()` statements to ensure compatibility with the Windows `cp1252` console encoding.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
