# 🏠 MessNest — Mess & Flat Hunting Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_v8.5-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML_Chatbot-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose_v2-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A modern, full-stack web platform designed to simplify accommodation and food service discovery for college students, interns, and working professionals across major educational and IT hubs (e.g., Bangalore, Delhi, Kota, Pune).

The platform connects users with verified **PGs (Paying Guest accommodations)**, **Shared/Full Flats**, and **Mess & Food Facilities**, enabling seamless search, instant booking requests, direct landlord WhatsApp communication, an integrated admin management dashboard, and an **AI-powered chatbot** trained on custom Q&A data.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏛️ System Design](#️-system-design)
  - [High-Level Architecture](#high-level-architecture)
  - [Request Flow](#request-flow)
  - [Data Model](#data-model)
  - [AI Chatbot Pipeline](#ai-chatbot-pipeline)
  - [Docker Deployment Architecture](#docker-deployment-architecture)
- [💻 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🔐 Environment Configuration](#-environment-configuration)
- [🚀 Getting Started — Local Dev](#-getting-started--local-dev)
- [🐳 Getting Started — Docker](#-getting-started--docker)
- [🌱 Database Seeding](#-database-seeding)
- [📡 API Documentation](#-api-documentation)
- [🔑 Admin Portal & Workflow](#-admin-portal--workflow)
- [🔧 Troubleshooting & Gotchas](#-troubleshooting--gotchas)
- [📜 License](#-license)

---

## ✨ Features

### 🔍 For Students & Seekers
- **Multi-Criteria Search & Filtering** — Filter by Category (`PG`, `Flat`, `Mess`), Location, Area, Furnishing Status, Budget, and keywords
- **Rich Accommodation Details** — Image galleries, price breakdowns, room types, amenities, and owner profiles
- **Instant One-Click Booking** — Submit reservation requests with move-in dates and stay duration
- **Direct WhatsApp Integration** — Contact property owners via pre-configured WhatsApp chat links
- **🤖 AI Chatbot Assistant** — Floating chat bubble powered by a custom-trained ML model with typing indicators and smart fallback responses

### 🛡️ For Administrators & Property Owners
- **Full CRUD for Listings** — Create, edit, toggle availability, or delete properties with multi-image support
- **Booking Request Dashboard** — View, filter (`Pending`, `Confirmed`, `Rejected`), approve/reject bookings
- **One-Click Database Seeder** — Populate MongoDB with high-quality sample listings across multiple cities

### 🛠️ Developer & Integration Features
- **In-App API Guide** — Interactive Postman documentation modal baked into the frontend
- **Robust MongoDB Connection** — Built-in Google DNS fallback to fix Windows SRV lookup issues with Atlas
- **Custom-Trained NLP Model** — TF-IDF + Logistic Regression trained on 74+ Q&A pairs, served via Flask

---

## 🏛️ System Design

### High-Level Architecture

The application follows a **three-tier microservice architecture** composed of independently deployable services that communicate over a shared Docker bridge network in production.

```mermaid
graph TB
    subgraph Client["🌐 Client Layer"]
        Browser(["👤 User / Browser"])
    end

    subgraph Gateway["🚪 API Gateway Layer (nginx)"]
        NGINX["nginx\n:80\n(Frontend + Reverse Proxy)"]
    end

    subgraph Services["⚙️ Service Layer (Docker Network: messnest-net)"]
        FE["⚛️ React SPA\n(Static Assets)"]
        BE["🟢 Node.js / Express\nREST API :5000"]
        BOT["🐍 Python / Flask\nChatbot API :5001"]
    end

    subgraph Data["🗄️ Data Layer"]
        DB[("☁️ MongoDB Atlas\n(Cloud)")]
        PKL["📦 model.pkl\nvectorizer.pkl\n(In-container)"]
    end

    Browser -->|"HTTP :80"| NGINX
    NGINX -->|"Serve static files"| FE
    NGINX -->|"Proxy /api/*"| BE
    Browser -->|"Direct POST /api/chat :5001"| BOT

    BE -->|"Mongoose ODM"| DB
    BOT -->|"joblib.load()"| PKL

    style Client fill:#1e293b,color:#e2e8f0,stroke:#334155
    style Gateway fill:#0f172a,color:#e2e8f0,stroke:#1e40af
    style Services fill:#0f172a,color:#e2e8f0,stroke:#065f46
    style Data fill:#0f172a,color:#e2e8f0,stroke:#7c3aed
```

---

### Request Flow

This diagram traces the complete lifecycle of two core user journeys.

```mermaid
sequenceDiagram
    actor User
    participant nginx as nginx :80
    participant React as React SPA
    participant Express as Express :5000
    participant Atlas as MongoDB Atlas
    participant Flask as Flask Chatbot :5001

    Note over User,Atlas: 🔍 Browse & Book a Property

    User->>nginx: GET /
    nginx->>React: Serve index.html + JS bundle
    React-->>User: Render UI

    User->>nginx: GET /api/properties?category=PG&location=Bangalore
    nginx->>Express: Proxy request
    Express->>Atlas: db.properties.find({category:"PG", location:/bangalore/i})
    Atlas-->>Express: Array of Property documents
    Express-->>nginx: 200 JSON {success, count, data[]}
    nginx-->>React: Response
    React-->>User: Render property cards

    User->>nginx: POST /api/bookings {propertyId, studentName, ...}
    nginx->>Express: Proxy request
    Express->>Atlas: db.bookings.create(doc)
    Atlas-->>Express: Saved booking doc
    Express-->>User: 201 {success, data}

    Note over User,Flask: 🤖 Chat with AI Chatbot

    User->>Flask: POST /api/chat {"message": "How do I book?"}
    Flask->>Flask: vectorizer.transform(message)
    Flask->>Flask: model.predict_proba(vec)
    alt confidence ≥ 0.25
        Flask-->>User: 200 {"reply": "<best answer>"}
    else low confidence → cosine fallback
        Flask-->>User: 200 {"reply": "<cosine nearest match>"}
    end
```

---

### Data Model

```mermaid
erDiagram
    PROPERTY {
        ObjectId  _id           PK
        string    title
        string    category      "PG | Flat | Mess"
        string    location
        string    area
        string    address
        number    price
        number    deposit
        string    roomType
        string    furnishedStatus "Furnished | Semi | Unfurnished"
        string[]  images
        string[]  amenities
        string    whatsappNumber
        string    contactPerson
        boolean   isAvailable
        date      createdAt
    }

    BOOKING {
        ObjectId  _id            PK
        ObjectId  propertyId     FK
        string    studentName
        string    studentPhone
        string    studentEmail
        date      moveInDate
        number    durationMonths
        string    notes
        string    status         "Pending | Confirmed | Rejected"
        date      createdAt
    }

    PROPERTY ||--o{ BOOKING : "receives"
```

---

### AI Chatbot Pipeline

```mermaid
flowchart LR
    subgraph Offline["🔧 Offline Training (train.py)"]
        direction TB
        CSV["training_data.csv\n74+ Q&A pairs"]
        TFIDF["TF-IDF Vectorizer\nfit_transform(questions)"]
        LR["Logistic Regression\nfit(X_train, y_train)"]
        PKL2["model.pkl\nvectorizer.pkl"]
        CSV --> TFIDF --> LR --> PKL2
    end

    subgraph Online["⚡ Online Inference (app.py)"]
        direction TB
        INPUT["User Message\nPOST /api/chat"]
        TRANSFORM["vectorizer.transform(msg)"]
        PREDICT["model.predict_proba(vec)"]
        CONF{{"Confidence\n≥ 0.25?"}}
        LR_OUT["LR Best Class\n→ Answer"]
        COS["Cosine Similarity\nFallback"]
        FALLBACK["Generic fallback\nmessage"]
        REPLY["JSON Response\n{reply: '...'}"]

        INPUT --> TRANSFORM --> PREDICT --> CONF
        CONF -->|Yes| LR_OUT --> REPLY
        CONF -->|No| COS
        COS -->|sim ≥ 0.1| REPLY
        COS -->|sim < 0.1| FALLBACK --> REPLY
    end

    PKL2 -.->|"joblib.load() at startup"| Online

    style Offline fill:#1e3a2f,color:#d1fae5,stroke:#059669
    style Online fill:#1e1b4b,color:#e0e7ff,stroke:#4f46e5
```

---

### Docker Deployment Architecture

```mermaid
graph TB
    subgraph Host["💻 Host Machine"]
        P80(["Port :80"])
        P5000(["Port :5000"])
        P5001(["Port :5001"])
        ENV["backend/.env\n(MONGO_URI secret)"]
    end

    subgraph Docker["🐳 Docker Engine"]
        subgraph Network["Bridge Network: messnest-net"]
            FE_C["📦 messnest-frontend\nnginx:stable-alpine\nServes React build\n+ Proxies /api/*"]
            BE_C["📦 messnest-backend\nnode:20-alpine\nExpress REST API"]
            BOT_C["📦 messnest-chatbot\npython:3.11-slim\nFlask + ML model"]
        end
    end

    subgraph Cloud["☁️ External"]
        ATLAS[("MongoDB Atlas")]
    end

    P80 -->|"maps to"| FE_C
    P5000 -->|"maps to"| BE_C
    P5001 -->|"maps to"| BOT_C
    ENV -.->|"env_file injection"| BE_C

    FE_C -->|"internal: backend:5000"| BE_C
    BE_C -->|"TLS / SRV"| ATLAS

    style Host fill:#0f172a,color:#cbd5e1,stroke:#475569
    style Docker fill:#0d1b2a,color:#bae6fd,stroke:#0284c7
    style Network fill:#082f49,color:#e0f2fe,stroke:#0369a1
    style Cloud fill:#1c1917,color:#d6d3d1,stroke:#78716c
```

---

## 💻 Tech Stack

### Frontend
| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3 | UI component framework |
| Vite | 5.3 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| Lucide React | 0.395 | Icon library |
| Axios | 1.7 | HTTP client |

### Backend
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| Express.js | 4.19 | REST API framework |
| Mongoose | 8.5 | MongoDB ODM |
| MongoDB Atlas | — | Cloud database |
| dotenv | 16.4 | Env variable management |
| cors | 2.8 | Cross-origin request handling |

### AI Chatbot
| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.11+ | Runtime |
| Flask | latest | HTTP API server |
| Flask-CORS | latest | Cross-origin support |
| scikit-learn | latest | TF-IDF + Logistic Regression |
| joblib | latest | Model serialization (.pkl) |
| pandas / numpy | latest | Data handling |

### DevOps & Infrastructure
| Tool | Purpose |
|------|---------|
| Docker | Container runtime |
| Docker Compose v2 | Multi-service orchestration |
| nginx:stable-alpine | Static file serving + reverse proxy |

---

## 📁 Project Structure

```text
mess_hunting/
├── 🐳 docker-compose.yaml       ← Orchestrates all 3 services
├── 🚫 .dockerignore             ← Excludes node_modules, .env, dist, etc.
├── 📖 DOCKER.md                 ← Docker usage guide
├── 📖 README.md
│
├── backend/                     ← Node.js / Express REST API
│   ├── models/
│   │   ├── Booking.js           # Mongoose schema — booking requests
│   │   └── Property.js          # Mongoose schema — PGs, Flats, Messes
│   ├── routes/
│   │   ├── propertyRoutes.js    # /api/properties (CRUD)
│   │   ├── bookingRoutes.js     # /api/bookings (CRUD + status)
│   │   ├── seedRoutes.js        # /api/seed
│   │   ├── adminRoutes.js       # /api/admin
│   │   └── userRoutes.js        # /api/users
│   ├── utils/
│   ├── .env                     # MONGO_URI, PORT (git-ignored)
│   ├── server.js                # App entry — Express setup + DB connect
│   ├── package.json
│   └── 🐳 Dockerfile           ← node:20-alpine, multi-stage
│
├── chatbot/                     ← Python / Flask ML chatbot
│   ├── data/
│   │   └── training_data.csv   # 74+ Q&A pairs (question, answer)
│   ├── model.pkl               # Trained LR model (generated by train.py)
│   ├── vectorizer.pkl          # Fitted TF-IDF vectorizer (generated)
│   ├── train.py                # Offline training script
│   ├── app.py                  # Flask chatbot API server :5001
│   ├── requirements.txt
│   └── 🐳 Dockerfile          ← python:3.11-slim
│
└── frontend/                   ← React + Vite SPA
    ├── src/
    │   ├── components/
    │   │   ├── AboutModal.jsx
    │   │   ├── AdminLoginModal.jsx
    │   │   ├── AdminPortal.jsx
    │   │   ├── BookingModal.jsx
    │   │   ├── ChatbotWidget.jsx   # ← Floating AI chat bubble
    │   │   ├── Footer.jsx
    │   │   ├── HeroSearch.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PostmanGuideModal.jsx
    │   │   ├── PropertyCard.jsx
    │   │   └── PropertyDetailModal.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── nginx.conf              # SPA routing + /api proxy config
    └── 🐳 Dockerfile         ← Vite build → nginx:stable-alpine
```

---

## ⚙️ Prerequisites

### For Local Development
| Requirement | Version | Check |
|---|---|---|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| Python | 3.11+ | `python --version` |
| MongoDB Atlas account | — | [cloud.mongodb.com](https://cloud.mongodb.com) |

### For Docker
| Requirement | Version | Check |
|---|---|---|
| Docker Desktop | 24.x+ | `docker --version` |
| Docker Compose | v2.x+ | `docker compose version` |

---

## 🔐 Environment Configuration

Create or update `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.zpkiaxy.mongodb.net/mess_hunting?retryWrites=true&w=majority
```

> [!CAUTION]
> Never commit `.env` to Git. It is already covered by `.gitignore` and `.dockerignore`.

> [!NOTE]
> If `MONGO_URI` is missing, the backend will log an error and exit with code 1.

---

## 🚀 Getting Started — Local Dev

You need **three terminal windows** running simultaneously.

### 1. Clone the Repository

```bash
git clone https://github.com/Abhishek-Royy/Mess_Nest.git
cd mess_hunting
```

### 2. Backend (Terminal 1)

```bash
cd backend
npm install
npm start
# → http://localhost:5000
```

### 3. Chatbot AI (Terminal 2)

```bash
cd chatbot
pip install -r requirements.txt

# Train the model once (or when you update training_data.csv)
python train.py

# Start the Flask API
python app.py
# → http://localhost:5001
```

Expected training output:
```
[*] Loading training data from: .../chatbot/data/training_data.csv
[+] Loaded 74 Q&A pairs.
[+] Training accuracy: 100.0%
[+] model.pkl saved -> .../chatbot/model.pkl
[+] vectorizer.pkl saved -> .../chatbot/vectorizer.pkl
[OK] Training complete!
```

### 4. Frontend (Terminal 3)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Open **http://localhost:5173** — the 💬 AI chat bubble appears in the bottom-right corner.

---

## 🐳 Getting Started — Docker

> Full Docker guide: [DOCKER.md](./DOCKER.md)

### Quick Start (3 commands)

```bash
# 1. Ensure backend/.env has your MONGO_URI
# 2. Build all images
docker compose build

# 3. Start all services
docker compose up -d
```

| Service | URL |
|---------|-----|
| **Frontend (nginx)** | http://localhost |
| **Backend API** | http://localhost:5000/api/health |
| **Chatbot API** | http://localhost:5001/api/health |

### Common Docker Commands

```bash
docker compose up -d          # Start in background
docker compose logs -f        # Tail logs (all services)
docker compose logs -f backend # Tail a single service
docker compose ps             # Check container status
docker compose down           # Stop & remove containers
docker compose build --no-cache  # Force full rebuild
```

---

## 🌱 Database Seeding

To populate MongoDB with sample PGs, Flats, and Messes across Bangalore, Delhi, Kota, and Pune:

**Option A — via Admin Portal UI:**
1. Open the app → click **Admin Portal** in the navbar
2. Click **"Reset / Seed Database"**

**Option B — via HTTP:**
```bash
curl -X POST http://localhost:5000/api/seed
```

---

## 📡 API Documentation

### Health Check

#### `GET /api/health`
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

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/properties` | List all (supports query filters) |
| `GET` | `/api/properties/:id` | Get single property |
| `POST` | `/api/properties` | Create new listing |
| `PUT` | `/api/properties/:id` | Update listing |
| `DELETE` | `/api/properties/:id` | Delete listing |

**Query Parameters for `GET /api/properties`:**

| Param | Values | Description |
|-------|--------|-------------|
| `category` | `PG` \| `Flat` \| `Mess` \| `All` | Filter by type |
| `location` | string | Case-insensitive city match |
| `area` | string | Neighbourhood filter |
| `furnishedStatus` | `Furnished` \| `Semi-Furnished` \| `Unfurnished` | Filter |
| `maxPrice` | number | Upper rent limit |
| `search` | string | Full-text keyword search |

**`POST /api/properties` — Request Body:**
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

---

### Bookings Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bookings` | Submit booking request |
| `GET` | `/api/bookings` | List all bookings (`?status=Pending`) |
| `PATCH` | `/api/bookings/:id/status` | Update booking status |
| `DELETE` | `/api/bookings/:id` | Delete booking record |

**`POST /api/bookings` — Request Body:**
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

**`PATCH /api/bookings/:id/status` — Request Body:**
```json
{ "status": "Confirmed" }
```
Valid values: `Pending` | `Confirmed` | `Rejected`

---

### Seed Endpoint

#### `POST /api/seed`
Clears existing records and inserts default sample properties & bookings.

---

### Chatbot Endpoint

The chatbot runs as a **separate Flask service on port 5001**.

#### `POST /api/chat`
```json
// Request
{ "message": "How do I book a mess?" }

// Response 200
{ "reply": "Open the mess listing, review the details, and submit your booking request." }

// Low-confidence fallback
{ "reply": "I'm not sure about that. Please contact support or browse our listings." }
```

#### `GET /api/health` *(chatbot)*
```json
{ "status": "ok", "model": "loaded" }
```

> [!TIP]
> To train the chatbot on new data: edit `chatbot/data/training_data.csv` (add `question`,`answer` rows), then run `python train.py`.

---

## 🔑 Admin Portal & Workflow

Access via the **"Admin Portal"** button in the navbar.

**Listing Management:**
- Add properties with image URLs, amenities, prices, and WhatsApp numbers
- Edit or toggle availability of existing listings
- Remove out-of-service listings

**Booking Management:**
- Monitor real-time student reservation inquiries
- Mark as **Confirmed** or **Rejected**
- Contact applicants using recorded details

---

## 🔧 Troubleshooting & Gotchas

| Issue | Cause | Fix |
|-------|-------|-----|
| MongoDB Atlas connection timeout (Windows) | ISP DNS fails to resolve SRV records | `server.js` auto-forces Google DNS `8.8.8.8` at startup |
| CORS errors | Backend not running on `:5000` | Ensure Express backend is running; CORS is enabled for `:5173` |
| Chatbot "Could not connect to AI server" | Flask not running or `.pkl` missing | Run `python train.py` then `python app.py` |
| `multi_class` FutureWarning (scikit-learn) | scikit-learn ≥ 1.5 deprecation | Non-breaking warning; will be fixed in next update |
| UnicodeEncodeError on Windows terminal | `cp1252` console can't render emoji | All Python `print()` statements avoid emoji characters |
| Docker port conflict | Another process using `:80` / `:5000` | `netstat -ano \| findstr :80` → kill PID or remap port in `docker-compose.yaml` |
| Frontend shows stale version after rebuild | Docker layer cache | `docker compose build --no-cache frontend && docker compose up -d frontend` |

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
