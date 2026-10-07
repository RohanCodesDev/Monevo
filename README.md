# Monevo — Your Money, In Motion.

A minimalist, responsive, full-stack personal finance and expense tracker built with React, Vite, Node.js, Express, and Neon PostgreSQL (via Prisma), featuring seamless client-side LocalStorage persistence and offline resilience.

---

## ✦ Key Architecture & Features

- **Dual-Storage Engine:** Instant updates to `LocalStorage` for responsive offline-first usage, paired with synchronization to a **Node.js/Express REST API** backed by **Neon PostgreSQL** via Prisma.
- **Minimalist Fintech Design:** Engineered with a restrained aesthetic using **Off-White (`#F7F5F0`)**, **Charcoal (`#20201E`)**, and subtle semantic tones, driven by the **Outfit** typeface.
- **Dynamic Month Filtering & Analytics:** Real-time calculation of balance, monthly income/expense flow, net savings rate, and category breakdowns.
- **Full Transaction Lifecycle (CRUD):** Add, view, edit, and delete income and expenses with inline validation and confirmation dialogs.
- **Responsive Experience:** Clean spacious dashboard on desktop and mobile layout with quick-action bottom navigation.

---

## ✦ Folder Structure

```text
monevo/
├── frontend/
│   ├── src/
│   │   ├── components/       # UI Components (Header, Modals, Cards, Charts)
│   │   ├── context/          # TransactionContext state & sync manager
│   │   ├── layouts/          # Responsive AppLayout with mobile navigation
│   │   ├── pages/            # Page components (Dashboard, Transactions, NotFound)
│   │   ├── services/         # API client service
│   │   ├── utils/            # Storage & currency/date formatters
│   │   ├── App.jsx           # Routing configuration
│   │   ├── index.css         # Design tokens & global CSS reset
│   │   └── main.jsx          # App entry point
│   ├── public/               # Favicon & brand marks
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma     # Neon PostgreSQL schema definition
│   ├── src/
│   │   ├── controllers/      # REST API route handlers
│   │   ├── middleware/       # Centralized error handling
│   │   ├── routes/           # Express router endpoints
│   │   ├── utils/            # Response formatting helpers
│   │   ├── prisma/           # Prisma client singleton
│   │   └── server.js         # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── package.json              # Workspace root scripts
└── documentation.md          # Product specification
```

---

## ✦ Quick Start

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be running at `http://localhost:5173`.

### 2. Backend & Neon PostgreSQL
```bash
cd backend
npm install
cp .env.example .env
# Set your DATABASE_URL in .env
npx prisma generate
npm run dev
```
The API server will run on `http://localhost:5000`.
