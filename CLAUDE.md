# NeuralGate — Root CLAUDE.md
 
This is the root-level guide for the NeuralGate project. It covers the overall architecture, repository structure, Docker setup, and Git conventions. For frontend-specific rules see `frontend/CLAUDE.md`. For backend-specific rules see `backend/CLAUDE.md`.
 
---
 
## What is NeuralGate
 
NeuralGate is a fictional enterprise internal AI gateway portal built as a Cloudflare Associate Solutions Engineer take-home assessment. It demonstrates the full Cloudflare product stack:
 
- **Application Services** — Cloudflare proxy, WAF, rate limiting, TLS
- **Zero Trust** — Cloudflare Tunnel, Access policies, SSO via GitHub IdP
- **Developer Platform** — Cloudflare Worker, R2 bucket, D1 database, Workers AI
The app presents itself as an internal tool that gives company employees controlled, audited access to an AI model through a single secure gateway.

---
 
## Repository Structure
 
```
neuralgate/
├── frontend/                       # React + TypeScript + Tailwind (Vite)
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── CLAUDE.md                   # Frontend-specific rules
│
├── backend/                        # FastAPI (Python 3.11+)
│   ├── main.py
│   ├── routers/
│   ├── services/
│   ├── schemas/
│   ├── core/
│   ├── requirements.txt
│   └── CLAUDE.md                   # Backend-specific rules
│
├── worker/                         # Cloudflare Worker (TypeScript)
│   ├── src/
│   │   └── index.ts
│   ├── wrangler.toml
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml              # Local development orchestration
├── .env.example                    # Template for required environment variables
├── .gitignore
└── CLAUDE.md                       # This file
```
 
---

## Architecture Overview
 
```
Browser
  │
  ▼
Cloudflare (Proxy + WAF + Rate Limiting)
  │
  ├── / and /secure ──────────────────────► Cloudflare Tunnel ──► Origin Server (Render.com)
  │       │
  │       └── /secure ─── Cloudflare Access (Zero Trust / GitHub SSO)
  │                               │
  │                               └── Cloudflare Worker (identity stamping)
  │
  ├── /flags/:country ─────────────────────────────────────────► R2 Bucket (flag images)
  │
  └── /flags-d1/:country ──────────────────────────────────────► D1 Database (flag images)
```

### How the pieces connect
 
- **Frontend** (React) is built to a static `/dist` folder and served by the FastAPI backend
- **Backend** (FastAPI) serves the frontend static files and handles `POST /api/inference`
- **Cloudflare Tunnel** (`cloudflared`) runs on the origin server and exposes it to Cloudflare without opening inbound ports
- **Cloudflare Access** intercepts requests to `/secure` and enforces GitHub SSO authentication
- **Cloudflare Worker** runs on the `/secure` path after authentication — it reads the user's identity from the `Cf-Access-Jwt-Assertion` header and injects email, timestamp, and country into the response
- **Workers AI** is called by the FastAPI backend to generate AI responses
- **R2** stores flag images, served via the Worker at `/flags/:country`
- **D1** stores flag images as an alternative, served via the Worker at `/flags-d1/:country`
---
 
 ## Local Development Setup
 
### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker + Docker Compose
- Wrangler CLI (`npm install -g wrangler`)
### Running locally with Docker
 
```bash
# Copy environment variables
cp .env.example .env
# Fill in your values in .env
 
# Start all services
docker-compose up --build
```
 
Frontend available at: `http://localhost:5173`
Backend available at: `http://localhost:8000`

### Running services individually
 
```bash
# Frontend
cd frontend
npm install
npm run dev
 
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
 
# Worker (local dev)
cd worker
npm install
npx wrangler dev
```
 
---

## Docker Rules
 
- Frontend and backend run as separate services in `docker-compose.yml`
- Frontend builds to `/dist` via `npm run build`, served as static files by the backend in production
- Backend runs with `uvicorn main:app --host 0.0.0.0 --port 8000`
- Environment variables are passed via `.env` file — never hardcoded in `docker-compose.yml`
- `.env` is gitignored — `.env.example` is committed with all required keys and empty values
- Services communicate via Docker internal network, not localhost
### docker-compose.yml service names
- `frontend` — React Vite dev server (development only)
- `backend` — FastAPI Uvicorn server
---
 
## Environment Variables
 
All secrets and config live in `.env` at the root. Never commit `.env`.
 
`.env.example` (commit this):
```
# Cloudflare Workers AI
WORKERS_AI_API_KEY=
WORKERS_AI_ACCOUNT_ID=
 
# Backend
CORS_ORIGIN=http://localhost:5173
 
# Frontend
VITE_API_BASE_URL=http://localhost:8000
```
 
### Rules
- Backend reads env vars via `pydantic-settings` in `backend/core/config.py`
- Frontend reads env vars via `import.meta.env.VITE_*` only
- Worker reads secrets via `wrangler secret` — never in `wrangler.toml` plaintext
- Never hardcode any key, token, or secret anywhere in the codebase
---
 
## Git Rules
 
### Branch naming
```
feature/<short-description>     e.g. feature/landing-page
fix/<short-description>         e.g. fix/cors-header
chore/<short-description>       e.g. chore/update-dependencies
```
 
### Commit messages
- Imperative present tense: `Add identity banner component` not `Added identity banner`
- Scope prefix when helpful: `worker: Add R2 flag routing`
- Keep subject line under 72 characters
- No emoji in commit messages
### What to never commit
- `.env` files
- API keys or secrets of any kind
- `node_modules/`
- Python `__pycache__/` or `.venv/`
- Wrangler `.dev.vars`
- Any file containing real credentials
### .gitignore must cover
```
.env
.dev.vars
node_modules/
__pycache__/
.venv/
dist/
*.pyc
.wrangler/
```
 
---
 
## Deployment
 
### Origin server (Render.com)
- Backend deployed as a Web Service on Render.com free tier
- Frontend static files served by the backend in production (`/dist` folder)
- Environment variables set in Render.com dashboard, not via `.env`
### Cloudflare Worker
- Deployed via `wrangler deploy` from the `worker/` directory
- Worker code must always be pushed to the public GitHub repository
- R2 bucket and D1 database bindings declared in `wrangler.toml`
### Cloudflare Tunnel
- `cloudflared` runs as a service on the Render.com origin
- Tunnel connects the origin to Cloudflare without exposing the server's public IP
---
 
## Folder-Specific Rules
 
Always read the relevant `CLAUDE.md` before working in a subfolder:
 
| Folder | CLAUDE.md location | Covers |
|---|---|---|
| `frontend/` | `frontend/CLAUDE.md` | React, TypeScript, Tailwind, component rules |
| `backend/` | `backend/CLAUDE.md` | FastAPI, Pydantic, service patterns |
| `worker/` | No CLAUDE.md — see Worker section in this file | Wrangler, R2, D1, identity stamping |
