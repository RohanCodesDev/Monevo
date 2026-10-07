# Monevo — Your Money, In Motion.

> A minimalist, responsive, full-stack personal finance and expense tracking product built to help users record, understand, and manage their money with clarity.

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-black?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-black?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL%20%7C%20Prisma-black?logo=postgresql)](https://neon.tech/)

---

## ✦ Overview & Product Philosophy

**Monevo** is built as an editorial, production-grade financial web application adhering to a disciplined aesthetic: **Pure White & Deep Charcoal** with intentional, high-contrast category visualization.

Instead of generic dashboards overloaded with colored cards, Monevo follows Linear-inspired minimalist design principles:
- **Clarity over decoration:** Immediate access to net balance, income/expense flows, and categorical distribution.
- **Dual-Persistence Engine:** Immediate local caching in `LocalStorage` for instantaneous UX and offline resilience, paired with real-time remote synchronization to **Neon PostgreSQL** via Prisma.
- **Complete Transaction Lifecycle:** Record, categorize, filter, edit, and delete transactions with confirmation safeguards and keyboard shortcuts.

---

## ✦ Key Features

- **📊 Visual Analytics:** Interactive Chart.js Donut and Bar graphs with high-contrast color distinction per spending category.
- **🔒 User Authentication:** JWT-based authentication with bcrypt password hashing, session cleanup, and database-level user isolation.
- **🏷️ Category Spending Caps:** Customizable monthly budget caps with color-coded alerts (*On track*, *Near limit*, *Over budget*).
- **📈 Month-over-Month Comparisons:** Real-time percentage delta badges compared to the previous month's income and spending.
- **🗓️ Interactive Month Popover:** Quick-jump picker dialog to jump to any month or year seamlessly.
- **⌨️ Keyboard Shortcuts:** Press `N` or `Ctrl/Cmd + K` from anywhere in the app to immediately record a transaction.
- **📁 Tax & Backup CSV Export:** 1-click formatted spreadsheet export of filtered or full transaction history.
- **🌗 Dark Mode:** Seamless system-wide light/dark theme toggle adhering to monochromatic contrast guidelines.
- **📱 Fully Responsive:** Adaptive desktop layout with bottom sheet navigation on tablet and mobile.

---

## ✦ System Architecture

```text
                     ┌────────────────────────────────────────┐
                     │          MONEVO CLIENT (React)         │
                     │  - React 18 / Vite                     │
                     │  - React Router DOM                    │
                     │  - Context API State Manager           │
                     └───────────────────┬────────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
      ┌─────────────────────────┐                 ┌─────────────────────────┐
      │      LocalStorage       │                 │       REST API          │
      │   Client Cache / Sync   │                 │   Node.js + Express     │
      └─────────────────────────┘                 └────────────┬────────────┘
                                                               │
                                                               ▼
                                                  ┌─────────────────────────┐
                                                  │       Prisma ORM        │
                                                  └────────────┬────────────┘
                                                               │
                                                               ▼
                                                  ┌─────────────────────────┐
                                                  │    Neon PostgreSQL      │
                                                  │ (ep-misty-rain pooler)  │
                                                  └─────────────────────────┘
```

---

## ✦ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, React Router, Chart.js, react-chartjs-2, Lucide React |
| **Styling** | Vanilla CSS Tokens, CSS Variables, Responsive Grid/Flexbox |
| **Typography** | Outfit (Google Fonts) |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Auth & Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, User-Isolated Queries |
| **Database & ORM** | Neon Serverless PostgreSQL, Prisma ORM |
| **Persistence** | `LocalStorage` API + Remote PostgreSQL Sync Engine |

---

## ✦ Repository Structure

```text
monevo/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg             # Monevo geometric badge
│   │   ├── robots.txt              # SEO crawler instructions
│   │   └── sitemap.xml             # Search engine index sitemap
│   ├── src/
│   │   ├── components/             # Reusable UI modules (Header, Cards, Charts, Modals)
│   │   ├── context/                # TransactionContext state & sync manager
│   │   ├── layouts/                # AppLayout with mobile bottom navigation
│   │   ├── pages/                  # Dashboard, Transactions, and NotFound views
│   │   ├── services/               # API client service layer
│   │   ├── utils/                  # Storage engine, export, formatters
│   │   ├── App.jsx                 # Route definitions
│   │   ├── index.css               # Design tokens & CSS reset
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma           # User & Transaction database models
│   ├── src/
│   │   ├── controllers/            # Auth & Transaction route controllers
│   │   ├── middleware/             # Auth token verification & error handler
│   │   ├── routes/                 # Express router endpoints
│   │   ├── utils/                  # Standard response helpers
│   │   ├── prisma/                 # Prisma singleton client
│   │   └── server.js               # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── test-suite.js                   # Automated test verification script
├── README.md                       # Comprehensive project documentation
└── package.json                    # Root workspace script runner
```

---

## ✦ Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- Neon PostgreSQL database instance

### 1. Clone the Repository
```bash
git clone https://github.com/RohanCodesDev/Monevo.git
cd Monevo
```

### 2. Backend Configuration
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
```

Edit `backend/.env` with your Neon database credentials:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@ep-sample.region.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-secure-jwt-secret-key"
```

Sync the schema to your Neon PostgreSQL database:
```bash
npx prisma generate
npx prisma db push
```

Start the backend server:
```bash
npm run dev
```
The API server will run at `http://localhost:5000`.

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The client will launch at `http://localhost:5173`.

---

## ✦ REST API Documentation

### Authentication Endpoints
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`)
- `POST /api/auth/login` — Sign in and receive a 30-day JWT token
- `GET /api/auth/me` — Retrieve currently authenticated user profile

### Transaction Endpoints
- `GET /api/transactions` — Fetch transactions (supports `?month=`, `?year=`, `?type=`, `?category=`)
- `GET /api/transactions/:id` — Retrieve a single transaction by ID
- `POST /api/transactions` — Create a new income or expense
- `PUT /api/transactions/:id` — Update an existing transaction
- `DELETE /api/transactions/:id` — Remove a transaction
- `GET /api/health` — Service health check endpoint

---

## ✦ Automated Verification

Monevo includes an end-to-end automated test suite:
```bash
node test-suite.js
```
The test suite validates:
1. Health endpoint response and status
2. User registration & password hashing
3. Login & JWT authentication issuance
4. Income and expense creation with Decimal accuracy
5. Strict user data isolation (private vs unauthenticated queries)
6. Transaction updates and cascading deletions

---

## ✦ License

This project is licensed under the MIT License.
