# 🐳 Docker Guide — MessNest

A complete step-by-step guide to build, run, and manage MessNest using Docker.

---

## 📁 Docker File Overview
## Take all the secret from docker actually, 


```
mess_hunting/
├── docker-compose.yaml          ← Orchestrates all 3 services
├── .dockerignore                ← Excludes junk from build contexts
│
├── backend/
│   └── Dockerfile               ← Node.js 20 Alpine (port 5000)
│
├── frontend/
│   ├── Dockerfile               ← Vite build → nginx (port 80)
│   └── nginx.conf               ← SPA routing + API proxy config
│
└── chatbot/
    └── Dockerfile               ← Python 3.11 Flask + ML model (port 5001)
```

---

## ✅ Prerequisites

Before you begin, make sure the following are installed:

| Tool | Minimum Version | Check |
|------|----------------|-------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | 24.x+ | `docker --version` |
| [Docker Compose](https://docs.docker.com/compose/) | v2.x+ | `docker compose version` |

> [!NOTE]
> Docker Desktop includes Docker Compose v2 out of the box on Windows and macOS.

---

## ⚙️ Step 1 — Configure Environment Variables

The backend needs your MongoDB Atlas connection string.  
Open `backend/.env` and verify it has the correct values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/mess_hunting?retryWrites=true&w=majority
```

> [!CAUTION]
> Never commit `.env` to Git. It is already listed in `.gitignore` and `.dockerignore`.

---

## 🏗️ Step 2 — Build All Docker Images

Run this **once** (or whenever you change source code):

```bash
# From the project root (mess_hunting/)
docker compose build
```

This builds three images:
- `messnest-frontend` — React/Vite app compiled and served via nginx
- `messnest-backend`  — Node.js Express REST API
- `messnest-chatbot`  — Python Flask chatbot with pre-trained ML model

---

## 🚀 Step 3 — Start All Services

```bash
# Start all services in the foreground (see live logs)
docker compose up

# — OR — start in the background (detached mode)
docker compose up -d
```

Once running, your app is available at:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | React UI served by nginx |
| **Backend API** | http://localhost:5000/api/health | REST API health check |
| **Chatbot API** | http://localhost:5001/api/health | ML chatbot health check |

> [!TIP]
> nginx automatically proxies any `/api/*` requests from the frontend to the backend container — no manual URL changes needed.

---

## 🔍 Step 4 — Verify Everything is Running

```bash
# List all running containers
docker compose ps

# Check backend health
curl http://localhost:5000/api/health

# Check chatbot health
curl http://localhost:5001/api/health
```

Expected output for backend health:
```json
{
  "status": "API operational",
  "dbState": "Connected to MongoDB Atlas"
}
```

---

## 📋 Step 5 — View Logs

```bash
# Tail logs for all services
docker compose logs -f

# Tail logs for a specific service
docker compose logs -f backend
docker compose logs -f chatbot
docker compose logs -f frontend
```

---

## 🔄 Step 6 — Rebuild After Code Changes

If you modify any source code, rebuild the affected service:

```bash
# Rebuild a single service and restart it
docker compose up -d --build backend
docker compose up -d --build frontend
docker compose up -d --build chatbot

# Rebuild everything from scratch (no cache)
docker compose build --no-cache
docker compose up -d
```

---

## 🛑 Step 7 — Stop the Application

```bash
# Stop all containers (keeps them, can restart)
docker compose stop

# Stop AND remove containers (clean slate)
docker compose down

# Stop, remove containers AND delete built images
docker compose down --rmi all
```

---

## 🧪 Running Individual Services (Optional)

You can build and run a single service independently for debugging:

### Backend only
```bash
cd backend
docker build -t messnest-backend .
docker run -p 5000:5000 --env-file .env messnest-backend
```

### Chatbot only
```bash
cd chatbot
docker build -t messnest-chatbot .
docker run -p 5001:5001 messnest-chatbot
```

### Frontend only
```bash
cd frontend
docker build -t messnest-frontend .
docker run -p 80:80 messnest-frontend
```

---

## 🗺️ Architecture Diagram

```
Browser
  │
  ▼
┌─────────────────────────────────┐
│  nginx (frontend container)     │  :80
│  ┌─────────────────────────┐    │
│  │  React SPA (static)     │    │
│  └─────────────────────────┘    │
│  /api/*  → proxy ──────────────────────────► backend:5000
└─────────────────────────────────┘           (Node/Express)
                                                    │
                                              MongoDB Atlas
                                              (external cloud)

Browser ──────────────────────────────────► chatbot:5001
(direct calls via /api/chat)               (Python Flask)

All containers share: messnest-net (Docker bridge network)
```

---

## 🐞 Troubleshooting

### Container fails to start
```bash
# Check detailed error logs
docker compose logs backend
```

### Port already in use
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill that process or change the port in docker-compose.yaml
```

### MongoDB connection refused
- Verify `MONGO_URI` in `backend/.env` is correct
- Ensure your MongoDB Atlas cluster allows connections from `0.0.0.0/0` (or your public IP) under **Network Access**

### Frontend shows old version after rebuild
```bash
docker compose build --no-cache frontend
docker compose up -d frontend
```

### Inspect a running container
```bash
docker compose exec backend sh
docker compose exec chatbot bash
```

---

## 📦 Useful Docker Commands Reference

```bash
# List all images
docker images

# Remove unused images and containers (free disk space)
docker system prune

# Remove everything including volumes
docker system prune -a --volumes
```

---

> [!NOTE]
> For production deployments, consider using Docker Secrets or a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault) instead of `.env` files to handle `MONGO_URI` and other sensitive credentials.
