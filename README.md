# AadhaarLens

A modern full-stack platform for Aadhaar document verification, OCR data extraction, and identity intelligence.

---

## 🚀 Overview & Key Features

AadhaarLens provides an automated pipeline to scan, extract, and validate identity information from Indian Aadhaar cards with accuracy and privacy compliance.

- **Document Ingestion**: Supports high-resolution image uploads and camera captures (front and back).
- **OCR Field Extraction**: Detects and extracts key identity attributes (Name, Date of Birth, Gender, and 12-digit UID).
- **UID Checksum Verification**: Validates Aadhaar numbers using the mathematical **Verhoeff algorithm**.
- **QR Code Parsing**: Decodes and verifies secure, digitally signed QR codes from e-Aadhaar and physical cards.
- **Privacy Masking**: Automatically masks the first 8 digits (`XXXX-XXXX-1234`) for data protection compliance.
- **Real-Time Health Monitoring**: Built-in heartbeat telemetry between the client dashboard and backend server.

---

## 🛠 Tech Stack

- **Client**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Server**: [Node.js](https://nodejs.org/) (v24+), [Express 5](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), [tsx](https://github.com/privatenumber/tsx)
- **Monorepo & Tooling**: [pnpm Workspaces](https://pnpm.io/workspaces), [ESLint](https://eslint.org/)

---

## 🏗 Architecture & Flow

```
[ Client: React 19 + Vite ]
         │
         │  HTTP / REST (JSON)
         ▼
[ Server: Express 5 + TypeScript ]
  ├── Routes        (/api/* endpoint definitions)
  ├── Middlewares   (CORS, express.json, error handling)
  ├── Controllers   (Request validation & response formatting)
  └── Services      (OCR extraction, Verhoeff validator, QR parser)
```

---

## 📁 Project Structure

```
AadhaarLens/
├── client/
│   ├── public/                 # Static icons and assets
│   ├── src/
│   │   ├── assets/             # Images and visual media
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React state providers
│   │   ├── hooks/              # Custom reusable hooks
│   │   ├── pages/              # Application pages/views
│   │   ├── services/           # API integration (api.ts)
│   │   ├── types/              # Client TypeScript models
│   │   ├── utils/              # Helper functions
│   │   ├── App.tsx             # Main dashboard & status check
│   │   └── main.tsx            # Application entry point
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/             # Config & env loader (env.config.ts)
│   │   ├── controllers/        # Route controller handlers
│   │   ├── middlewares/        # Global error & utility middlewares
│   │   ├── models/             # Schema & data models
│   │   ├── routes/             # Express route routers
│   │   ├── service/            # Business logic & verification engines
│   │   ├── types/              # Backend TypeScript types
│   │   ├── utils/              # Utility helpers
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # Server bootstrap & graceful shutdown
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                # Workspace-wide scripts
└── pnpm-workspace.yaml         # Monorepo packages definition
```

> All subdirectories include `.gitkeep` to maintain directory structure in Git tracking.

---

## ⚡ Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v24.x` (recommended)
- **pnpm**: `v10.x` or `v12.x`

### 1. Clone the repository

```bash
git clone https://github.com/rashidnarikkodan/AadhaarLens.git
cd AadhaarLens
```

### 2. Install dependencies

Install all dependencies across the entire monorepo in one step:

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example environment files for both packages:

```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env
```

### 4. Start development mode

Run both client and backend concurrently:

```bash
pnpm dev
```

Or run each service separately:

```bash
# Run client only (http://localhost:5173)
pnpm dev:client

# Run server only with auto-reload (http://localhost:5000)
pnpm dev:server
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for the Express server to listen on |
| `NODE_ENV` | `development` | Environment mode (`development` / `production`) |
| `CLIENT_URL` | `http://localhost:5173` | Allowed frontend origin for CORS |

### Client (`client/.env`)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL of the backend API |

---

## 📡 API Endpoints

### 1. Health Status
Check if the backend service is up and running.

- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok",
  "uptime": 42.15,
  "timestamp": "2026-11-05T10:30:00.000Z",
  "service": "AadhaarLens Backend"
}
```

### 2. Root Discovery
- **Endpoint**: `GET /`
- **Response**:
```json
{
  "message": "Welcome to AadhaarLens API",
  "healthCheck": "/api/health"
}
```

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Runs client and server concurrently |
| `pnpm dev:client` | Starts Vite client dev server |
| `pnpm dev:server` | Starts server with `tsx watch` |
| `pnpm build` | Builds both client and server for production |
| `pnpm lint` | Runs ESLint across all workspace packages |
| `pnpm --filter server start` | Runs the compiled server from `server/dist` |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
