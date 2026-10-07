# Monevo — Your Money, In Motion.

> A minimalist, responsive, full-stack personal expense tracker built to help users record, understand, and manage their money with clarity.

---

## 1. Project Overview

**Monevo** is a modern personal finance and expense tracking application.

The application allows users to:

* Record income and expenses
* Edit existing transactions
* Delete transactions
* Categorize transactions
* View their financial balance
* View monthly income and expense summaries
* Analyze spending through simple visualizations
* Persist data locally using `LocalStorage`
* Persist data remotely using a Node.js backend and Neon PostgreSQL database
* Use the application comfortably across desktop, tablet, and mobile devices

The product should feel like a **real modern fintech product**, not a basic college CRUD application.

The visual language must be:

> **Minimal. Clean. Calm. Premium. Functional.**

---

# 2. Brand Identity

## Product Name

**Monevo**

## Tagline

**Your Money, In Motion.**

The tagline should appear in appropriate branding areas such as the landing/header experience, but should not be unnecessarily repeated throughout the dashboard.

---

# 3. Design Direction

The entire interface must follow a restrained minimalist aesthetic.

### Primary Visual Concept

Think:

* Premium fintech
* Editorial minimalism
* Modern productivity software
* Linear-inspired interface simplicity
* Calm financial dashboard
* Strong typography
* Generous whitespace
* Subtle borders
* Minimal shadows
* No visual clutter

Do **not** make the application look like:

* A generic Bootstrap dashboard
* A colorful banking app
* A neon fintech dashboard
* A glassmorphism template
* An AI-generated/vibecoded dashboard
* A template with excessive cards
* A UI overloaded with gradients

---

# 4. Color System

The core palette is intentionally restricted.

## Base Colors

### Off White

```text
#F7F5F0
```

Use as the primary application background.

### Charcoal

```text
#20201E
```

Use for:

* Main text
* Navigation
* Headings
* Primary buttons
* Important UI elements

### Secondary Charcoal

```text
#5F5E59
```

Use for:

* Secondary text
* Descriptions
* Metadata
* Supporting information

### Border

```text
#DEDCD6
```

Use subtle borders around cards, inputs and sections.

### Surface

```text
#FBFAF7
```

Use for elevated cards and panels.

---

## Semantic Colors

Use semantic colors sparingly.

### Income

Use a restrained muted green.

### Expense

Use a restrained muted red/burgundy.

### Warning

Use a muted amber.

Avoid highly saturated colors.

The UI should remain predominantly:

> **Off White + Charcoal**

with semantic colors appearing only where necessary.

---

# 5. Typography

The primary typeface must be:

## Outfit

Use the **Outfit** font throughout the application.

Font hierarchy should feel intentional.

### Suggested hierarchy

```text
Hero / major balance
48–64px

Page heading
32–40px

Section heading
20–24px

Card values
24–32px

Body
14–16px

Metadata
12–14px
```

Use appropriate font weights:

```text
400 — Regular
500 — Medium
600 — Semi Bold
700 — Bold
```

Do not use excessive font weights.

The typography should provide most of the visual hierarchy instead of decorative UI elements.

---

# 6. Technology Stack

## Frontend

Use:

* React
* Vite
* JavaScript
* CSS
* React Router
* Outfit font

The frontend source code must follow a clear structure with:

```text
src/pages
```

for page-level components.

---

## Backend

Use:

* Node.js
* Express.js
* JavaScript

The backend must expose REST APIs for transaction management.

---

## Database

Use:

**Neon PostgreSQL**

The application must use PostgreSQL through Neon for persistent backend storage.

Use an appropriate PostgreSQL driver/ORM.

Preferred:

```text
Prisma
```

with Neon PostgreSQL.

---

## Client-Side Persistence

The project requirements explicitly require:

> Store all data in LocalStorage for persistent client-side data management.

Therefore Monevo must implement **LocalStorage persistence** on the frontend.

The application should support both:

```text
Frontend
    ↓
LocalStorage
```

and

```text
Frontend
    ↓
Node.js / Express API
    ↓
Prisma
    ↓
Neon PostgreSQL
```

The backend database should act as the persistent remote source while LocalStorage provides fast client-side persistence and satisfies the assignment requirement.

---

# 7. Important Data Strategy

Do not treat LocalStorage and PostgreSQL as two unrelated databases.

The application should use a simple synchronization strategy.

### When creating a transaction

1. Validate transaction.
2. Update local application state.
3. Save transaction to LocalStorage.
4. Send transaction to backend.
5. Backend stores it in Neon.
6. Return the persisted transaction.
7. Update the frontend with the backend response.

### When editing

1. Update UI optimistically.
2. Update LocalStorage.
3. Send update request to backend.
4. Persist in Neon.
5. Reconcile the returned data.

### When deleting

1. Remove transaction from UI.
2. Remove it from LocalStorage.
3. Send delete request to backend.
4. Remove it from Neon.

If the backend is temporarily unavailable, the application should remain usable with LocalStorage.

Display a subtle connection/sync status when appropriate.

---

# 8. Application Architecture

Use a clean separation between frontend and backend.

```text
monevo/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── context/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── prisma/
│   │   └── server.js
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

The exact structure may be adjusted if necessary, but maintain a clear separation between UI, business logic, API communication and database access.

---

# 9. Frontend Pages

The React frontend must use:

```text
src/pages
```

for page-level components.

Recommended pages:

```text
src/pages/
├── Dashboard.jsx
├── Transactions.jsx
└── NotFound.jsx
```

A separate Settings page is optional and should only be added if it improves the product.

---

# 10. Main Dashboard

The dashboard is the primary screen.

It should immediately communicate:

> How much money do I have, how much came in, how much went out, and where did it go?

---

## Dashboard Layout

### Header

Include:

```text
Monevo
Your Money, In Motion.
```

Navigation can contain:

```text
Overview
Transactions
```

On mobile, navigation should become appropriately compact.

---

# 11. Dashboard Financial Summary

Display three primary financial metrics.

### Balance

```text
Balance
₹24,850
```

### Income

```text
Income
₹40,000
```

### Expenses

```text
Expenses
₹15,150
```

Balance calculation:

```text
Balance = Total Income - Total Expenses
```

The cards should not look like generic colorful statistic cards.

Use:

* Off-white surface
* Charcoal typography
* Subtle border
* Small semantic indicator
* Generous whitespace

---

# 12. Month Selector

The dashboard must support monthly summaries.

Include a month selector such as:

```text
←  October 2026  →
```

or a compact dropdown/date control.

Changing the month should update:

* Total income
* Total expenses
* Balance
* Transaction list
* Charts
* Spending categories

Only transactions belonging to the selected month should contribute to the monthly summary.

---

# 13. Monthly Summary

The dashboard should contain a visual monthly overview.

Example:

```text
October 2026

Income       ₹40,000
Expenses     ₹15,150
Balance      ₹24,850
```

Add a simple visual comparison.

For example:

```text
Income

████████████████████  ₹40,000

Expenses

████████             ₹15,150
```

Prefer a clean chart component over manually rendered ASCII-style bars in the actual UI.

---

# 14. Expense Breakdown

Provide a simple category-based spending visualization.

Example categories:

```text
Food
Transport
Shopping
Entertainment
Bills
Health
Education
Other
```

Example:

```text
Food              ₹4,850
Shopping          ₹3,200
Transport         ₹2,700
Entertainment     ₹2,100
Bills             ₹1,500
Other               ₹800
```

A donut chart or horizontal bar chart may be used.

Keep it visually restrained.

Do not use a rainbow palette.

---

# 15. Recent Transactions

Display recent transactions directly on the dashboard.

Each transaction should include:

```text
Category icon
Transaction title
Category
Date
Amount
```

Example:

```text
Food
Dinner
Today
− ₹450
```

Income should visually communicate a positive amount:

```text
+ ₹40,000
```

Expenses:

```text
− ₹450
```

Include a:

```text
View all transactions
```

action.

---

# 16. Transactions Page

Create a dedicated:

```text
Transactions
```

page.

It should provide a complete transaction history.

Features:

* List transactions
* Search transactions
* Filter by type
* Filter by category
* Filter by month
* Sort by date
* Edit transaction
* Delete transaction

Recommended filters:

```text
All
Income
Expenses
```

Category filtering should be available through a dropdown.

---

# 17. Add Transaction

The primary action should be:

```text
+ Add Transaction
```

The interaction can be implemented using a modal or responsive bottom sheet.

On desktop:

```text
Centered modal
```

On mobile:

```text
Bottom sheet / full-width modal
```

---

# 18. Transaction Form

Fields:

### Transaction Type

```text
Income
Expense
```

### Amount

Numeric input.

Example:

```text
₹ 2,500
```

### Category

Dropdown/select.

For income:

```text
Salary
Freelance
Business
Gift
Investment
Other
```

For expenses:

```text
Food
Transport
Shopping
Entertainment
Bills
Health
Education
Travel
Other
```

### Description

Optional.

Example:

```text
Dinner with friends
```

### Date

Date picker.

Default to today's date.

---

# 19. Form Validation

Validation must be implemented.

Rules:

### Amount

* Required
* Must be numeric
* Must be greater than zero

### Type

* Required

### Category

* Required

### Date

* Required

### Description

* Optional
* Reasonable maximum length

Show concise validation messages.

Do not use browser-default ugly validation popups as the primary experience.

---

# 20. Edit Transaction

Each transaction must support editing.

When editing:

1. Open the same transaction form.
2. Prepopulate all fields.
3. Allow changes.
4. Validate.
5. Update LocalStorage.
6. Send update request to backend.
7. Update Neon database.
8. Refresh relevant dashboard calculations.

---

# 21. Delete Transaction

Each transaction must support deletion.

Deletion should require confirmation.

Example:

```text
Delete transaction?

This action cannot be undone.

Cancel       Delete
```

Do not immediately delete an item without giving the user a chance to cancel.

After successful deletion:

* Update LocalStorage
* Update backend
* Update Neon
* Update dashboard totals
* Update charts
* Update transaction list

---

# 22. Empty States

The application must have thoughtful empty states.

Example:

```text
No transactions yet

Start tracking your money by adding
your first income or expense.

+ Add Transaction
```

For an empty month:

```text
Nothing recorded for October

Your financial activity for this month
will appear here.
```

Avoid generic:

```text
No data found.
```

---

# 23. Responsive Design

The application must be fully responsive.

Support:

```text
Mobile
Tablet
Laptop
Desktop
Large screens
```

Recommended breakpoints can be used, but do not design only around fixed device widths.

---

## Desktop

Use a spacious dashboard.

Possible layout:

```text
┌────────────────────────────────────────────────────────┐
│ MONEVO                          October 2026   + Add    │
│ Your Money, In Motion.                                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Balance            Income             Expenses         │
│ ₹24,850            ₹40,000            ₹15,150          │
│                                                        │
├─────────────────────────────┬──────────────────────────┤
│ Monthly Overview            │ Spending Breakdown       │
│                             │                          │
│ Chart                       │ Chart                    │
│                             │                          │
├─────────────────────────────┴──────────────────────────┤
│ Recent Transactions                                     │
│                                                        │
│ Food       Dinner             Today          - ₹450    │
│ Salary     Monthly salary     Oct 1        + ₹40,000  │
└────────────────────────────────────────────────────────┘
```

---

## Mobile

The layout should become vertically stacked.

```text
Monevo

October 2026

Balance
₹24,850

Income          Expenses
₹40,000         ₹15,150

Monthly Overview
[Chart]

Spending
[Chart]

Recent Transactions

Food
Dinner
− ₹450

Transport
Uber
− ₹280

[ + Add Transaction ]
```

The Add Transaction action should remain easy to reach on mobile.

---

# 24. Navigation

Keep navigation minimal.

Recommended:

```text
Overview
Transactions
```

Do not create unnecessary navigation items.

---

# 25. Icons

Use a consistent icon library such as:

```text
Lucide React
```

Icons should be:

* Simple
* Line-based
* Consistent
* Small
* Functional

Do not use random emoji as the primary UI icon system.

---

# 26. Animations

Animations should be subtle.

Use:

* Fade-in
* Small slide transitions
* Hover states
* Modal transitions
* Button interaction feedback
* Chart entrance animations where appropriate

Avoid:

* Excessive bouncing
* Large page transitions
* Constant movement
* Overly animated backgrounds
* Particle effects
* Glowing neon elements

The product should feel calm.

---

# 27. Database

Use:

```text
Neon PostgreSQL
```

with Prisma.

---

# 28. Database Schema

Create a transaction model.

Conceptually:

```prisma
model Transaction {
  id          String   @id @default(cuid())
  type        String
  amount      Decimal
  category    String
  description String?
  date        DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Use an appropriate PostgreSQL-compatible decimal type for financial amounts.

Do not use floating-point arithmetic for money calculations where precision could become an issue.

---

# 29. Backend API

Create REST endpoints.

## Get transactions

```http
GET /api/transactions
```

Support query parameters:

```text
month
year
type
category
```

---

## Get one transaction

```http
GET /api/transactions/:id
```

---

## Create transaction

```http
POST /api/transactions
```

Example request:

```json
{
  "type": "expense",
  "amount": 450,
  "category": "Food",
  "description": "Dinner",
  "date": "2026-10-07"
}
```

---

## Update transaction

```http
PUT /api/transactions/:id
```

---

## Delete transaction

```http
DELETE /api/transactions/:id
```

---

# 30. API Response Design

Return consistent JSON responses.

Success example:

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "type": "expense",
    "amount": 450,
    "category": "Food",
    "description": "Dinner",
    "date": "2026-10-07"
  }
}
```

Error example:

```json
{
  "success": false,
  "message": "Unable to create transaction"
}
```

---

# 31. Backend Validation

Never trust frontend validation alone.

Validate requests on the backend.

Check:

* Transaction type
* Amount
* Category
* Date
* Description length
* Required fields

Reject malformed requests with appropriate HTTP status codes.

---

# 32. Error Handling

The backend must have centralized error handling.

Handle:

* Invalid request
* Missing transaction
* Database errors
* Invalid IDs
* Validation errors
* Unexpected server errors

Frontend should gracefully handle API failures.

---

# 33. LocalStorage Structure

Use a clear key.

Recommended:

```text
monevo_transactions
```

Example:

```json
[
  {
    "id": "local-001",
    "type": "expense",
    "amount": 450,
    "category": "Food",
    "description": "Dinner",
    "date": "2026-10-07"
  }
]
```

Do not store sensitive information in LocalStorage.

---

# 34. LocalStorage Utility

Create a dedicated utility/service for LocalStorage operations.

For example:

```text
src/utils/storage.js
```

Functions can include:

```javascript
getTransactions()
saveTransactions()
addTransaction()
updateTransaction()
deleteTransaction()
clearTransactions()
```

Avoid scattering:

```javascript
localStorage.getItem(...)
```

throughout unrelated components.

---

# 35. API Service

Create a dedicated API layer.

Example:

```text
src/services/api.js
```

Handle:

```javascript
getTransactions()
createTransaction()
updateTransaction()
deleteTransaction()
```

Components should not contain large amounts of raw `fetch()` logic.

---

# 36. State Management

For this project, avoid unnecessary complexity.

React state and Context API are sufficient.

Possible structure:

```text
TransactionContext
```

Responsibilities:

* Maintain transaction state
* Load LocalStorage data
* Fetch remote data
* Add transaction
* Update transaction
* Delete transaction
* Calculate totals
* Manage selected month

Do not introduce Redux unless genuinely necessary.

---

# 37. Financial Calculations

Create reusable utility functions.

Example:

```javascript
calculateIncome(transactions)
calculateExpenses(transactions)
calculateBalance(transactions)
calculateCategoryTotals(transactions)
filterTransactionsByMonth(transactions, month, year)
```

### Income

```text
sum(all income transactions)
```

### Expenses

```text
sum(all expense transactions)
```

### Balance

```text
income - expenses
```

Never duplicate these calculations in multiple UI components.

---

# 38. Monthly Filtering

The selected month must be consistently applied.

Example:

```text
October 2026
```

should only include:

```text
2026-10-01
through
2026-10-31
```

The dashboard, charts and transaction lists should use the same filtered dataset.

---

# 39. Currency

Default currency:

```text
INR / ₹
```

Display values in Indian numbering format.

Example:

```text
₹1,250
₹15,500
₹1,25,000
```

Use JavaScript's `Intl.NumberFormat` where appropriate.

Example:

```javascript
new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR"
});
```

---

# 40. Date Formatting

Use readable dates.

Examples:

```text
Today
Yesterday
7 Oct 2026
```

Avoid unnecessarily verbose dates.

---

# 41. Loading States

Display subtle loading states when communicating with the backend.

Examples:

```text
Loading transactions...
```

or skeleton placeholders.

Do not freeze the entire interface unnecessarily.

---

# 42. Sync States

Because Monevo uses LocalStorage and a remote backend, consider a subtle synchronization indicator.

Possible states:

```text
Saved locally
Syncing...
Synced
Offline
```

Do not make this visually dominant.

---

# 43. Offline Behavior

If the backend is unavailable:

* Continue allowing transactions through LocalStorage.
* Do not crash the application.
* Display a subtle offline state.
* Attempt synchronization when connectivity returns if feasible.

A full offline-first synchronization engine is not required for this task.

Keep implementation reliable and understandable.

---

# 44. Dashboard Component Architecture

Suggested components:

```text
src/components/

├── Header.jsx
├── Navigation.jsx
├── MonthSelector.jsx
├── SummaryCards.jsx
├── SummaryCard.jsx
├── MonthlyOverview.jsx
├── SpendingBreakdown.jsx
├── TransactionList.jsx
├── TransactionItem.jsx
├── TransactionModal.jsx
├── TransactionForm.jsx
├── EmptyState.jsx
├── DeleteConfirmation.jsx
├── SyncStatus.jsx
└── Button.jsx
```

Component names can be adjusted where appropriate.

Avoid creating components for trivial markup that makes the project harder to understand.

---

# 45. Page Architecture

Use:

```text
src/pages/
```

### Dashboard

```text
Dashboard.jsx
```

Contains:

* Header
* Month selector
* Summary
* Charts
* Recent transactions
* Add transaction action

### Transactions

```text
Transactions.jsx
```

Contains:

* Search
* Filters
* Complete transaction list
* Edit
* Delete
* Add transaction

### Not Found

```text
NotFound.jsx
```

Simple, clean 404 experience.

---

# 46. Routing

Use React Router.

Routes:

```text
/
    Dashboard

/transactions
    Transactions

/*
    NotFound
```

The dashboard should be the default route.

---

# 47. Accessibility

The application should be accessible.

Requirements:

* Semantic HTML
* Proper labels
* Keyboard-accessible controls
* Visible focus states
* Sufficient contrast
* Buttons must have meaningful labels
* Inputs must have labels
* Modal must support keyboard interaction
* Escape should close modals where appropriate

Do not sacrifice accessibility for visual minimalism.

---

# 48. UX Principles

Follow these principles throughout the application.

### 1. Clarity over decoration

Every UI element should have a purpose.

### 2. Fewer, better components

Do not fill the screen with cards.

### 3. Numbers should be easy to scan

Financial values are the most important information.

### 4. Actions should be obvious

Adding a transaction should take very few steps.

### 5. Feedback should be immediate

Users should know when a transaction has been saved, updated or deleted.

### 6. Avoid unnecessary confirmation

Only destructive actions such as deletion need confirmation.

---

# 49. Security

Never expose:

```text
DATABASE_URL
```

to the frontend.

The Neon connection must exist only in the backend environment.

Use:

```text
.env
```

for secrets.

Example:

```env
DATABASE_URL="your-neon-connection-string"
PORT=5000
```

Add `.env` to `.gitignore`.

Never commit credentials.

---

# 50. Environment Variables

Backend:

```env
DATABASE_URL=
PORT=5000
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not hardcode production URLs throughout the application.

---

# 51. CORS

Configure CORS in Express so that the React frontend can communicate with the backend during development and production.

Keep the configuration understandable and secure.

---

# 52. Backend Server

The backend should:

1. Load environment variables.
2. Initialize Express.
3. Configure middleware.
4. Configure CORS.
5. Configure JSON parsing.
6. Register API routes.
7. Register error handling.
8. Start the server.

Example:

```text
server.js
```

---

# 53. Database Setup

Use Prisma migrations.

Typical workflow:

```bash
npx prisma generate
npx prisma migrate dev
```

For deployment:

```bash
npx prisma migrate deploy
```

The exact commands may be adjusted according to the final project configuration.

---

# 54. Development Commands

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
npm install
npm run dev
```

Production builds:

```bash
npm run build
```

---

# 55. Recommended Dependencies

Frontend may use:

```text
react
react-dom
react-router-dom
lucide-react
```

For charts, a lightweight React chart library may be used.

Backend:

```text
express
cors
dotenv
```

Database:

```text
prisma
@prisma/client
```

Use only dependencies that provide real value.

Do not install large libraries unnecessarily.

---

# 56. Charts

Charts are optional in the original task, but **Monevo should include them** because they significantly improve the product.

Recommended:

### Monthly Income vs Expense

Bar chart or simple comparison chart.

### Spending Breakdown

Donut chart or horizontal bar chart.

Charts must:

* Be responsive
* Have accessible labels/tooltips
* Use restrained colors
* Match the Monevo design system
* Not dominate the dashboard

---

# 57. Transaction Categories

## Expense Categories

```text
Food
Transport
Shopping
Entertainment
Bills
Health
Education
Travel
Subscriptions
Other
```

## Income Categories

```text
Salary
Freelance
Business
Investment
Gift
Other
```

Keep categories extensible so additional categories can be added later.

---

# 58. Transaction Icons

Use Lucide icons mapped to categories.

Examples:

```text
Food          Utensils
Transport     Car
Shopping      ShoppingBag
Bills         Receipt
Health        HeartPulse
Education     GraduationCap
Travel        Plane
Salary        Briefcase
Investment    TrendingUp
```

Do not use emoji as the main design language.

---

# 59. Microinteractions

Implement subtle interactions:

* Button hover
* Card hover where useful
* Input focus
* Modal entrance
* Delete confirmation
* Toast/success feedback
* Chart transitions
* Number updates

Keep all animation fast and restrained.

---

# 60. Toast Notifications

Use a lightweight notification system.

Examples:

```text
Transaction added
Transaction updated
Transaction deleted
Unable to sync with server
```

Notifications should disappear automatically.

Do not interrupt the user's workflow with large alerts.

---

# 61. Error UX

Never expose raw errors such as:

```text
AxiosError: 500...
```

Instead:

```text
Something went wrong.

Your transaction is still saved locally.
We'll try syncing again later.
```

This is especially important because LocalStorage provides resilience.

---

# 62. Performance

Keep the application lightweight.

Requirements:

* Avoid unnecessary rerenders
* Avoid huge dependencies
* Lazy-load pages if beneficial
* Keep chart rendering efficient
* Avoid excessive animation
* Keep API requests minimal
* Do not fetch the same transaction data repeatedly

For the expected scale of this assignment, simple React state architecture is sufficient.

---

# 63. Responsive Modal

Desktop:

```text
Width: approximately 420–500px
```

Mobile:

```text
Width: 100%
```

Use appropriate padding and safe spacing.

Inputs should be large enough for touch interaction.

---

# 64. Mobile Navigation

The mobile interface must not feel like a compressed desktop interface.

Reorganize content intentionally.

Possible bottom navigation:

```text
Overview       Transactions
```

The primary add action can remain a floating or prominent button.

Do not make the interface excessively dense.

---

# 65. Visual Hierarchy

The most important visual hierarchy should be:

```text
Monevo
   ↓
Current month
   ↓
Balance
   ↓
Income / Expenses
   ↓
Insights
   ↓
Transactions
```

Users should understand their financial position within seconds.

---

# 66. Logo Direction

Create a simple Monevo wordmark.

Preferred:

```text
MONEVO
```

with clean typography.

If creating an icon:

Use a minimal geometric interpretation of:

```text
M
+
movement
+
financial progression
```

Avoid obvious dollar signs.

Avoid generic wallet icons.

Avoid coins stacked into an M.

The identity should feel sophisticated.

---

# 67. Brand Usage

Header:

```text
MONEVO
Your Money, In Motion.
```

App icon:

```text
M
```

The wordmark should use Outfit SemiBold/Bold.

---

# 68. No Unnecessary Features

Do NOT add:

* Cryptocurrency tracking
* Investment trading
* Bank account integration
* AI financial advisor
* Complex authentication
* Credit score
* Loans
* Multi-currency
* Social features

unless specifically requested later.

Focus on making the expense tracker exceptionally polished.

---

# 69. Assignment Requirement Mapping

The implementation must explicitly satisfy every original requirement.

## Requirement 1

### Add, edit and delete income and expense items

Implementation:

```text
TransactionForm
TransactionModal
TransactionList
Edit
Delete
```

---

## Requirement 2

### Store data in LocalStorage

Implementation:

```text
monevo_transactions
```

with a dedicated storage utility.

---

## Requirement 3

### Monthly summary

Display:

```text
Total Income
Total Expenses
Balance
```

with month filtering.

---

## Requirement 4

### HTML, CSS and JavaScript

The React frontend is JavaScript-based and ultimately renders standard HTML/CSS.

Use React without TypeScript unless there is a compelling reason otherwise.

---

## Requirement 5

### Responsive

Implement responsive layouts for:

```text
Mobile
Tablet
Desktop
```

---

## Requirement 6

### Visual indicators / charts

Implement:

```text
Monthly income vs expense chart
Spending category breakdown
```

---

## Requirement 7

### Backend

Implement:

```text
Node.js
Express
REST API
```

---

## Requirement 8

### Database

Implement:

```text
Neon PostgreSQL
Prisma
```

---

# 70. Important Implementation Rule

Do not blindly follow the wording of the original assignment if it conflicts with the actual full-stack architecture.

The project should support both:

```text
LocalStorage
```

and:

```text
Neon PostgreSQL
```

LocalStorage is required for the assignment.

Neon is required for the full-stack implementation.

The application should therefore be designed as:

```text
                 ┌───────────────────┐
                 │      MONEVO       │
                 │  React Frontend   │
                 └─────────┬─────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌──────────────┐      ┌──────────────┐
        │ LocalStorage │      │ Express API  │
        │   Client     │      │   Node.js    │
        └──────────────┘      └──────┬───────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │    Prisma    │
                              └──────┬───────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │     Neon     │
                              │ PostgreSQL   │
                              └──────────────┘
```

---

# 71. Code Quality

The generated code must be:

* Modular
* Readable
* Maintainable
* Properly named
* Commented only where necessary
* Free from unnecessary duplication
* Free from placeholder functionality
* Free from fake API calls
* Free from hardcoded transaction data

Do not generate a single enormous React component.

Do not put all backend logic inside `server.js`.

Do not put database queries directly inside UI components.

---

# 72. Avoid Fake Data in Production UI

Demo data may be used only for initial development/testing.

The actual application must derive its displayed data from:

```text
LocalStorage
```

and/or:

```text
Neon PostgreSQL
```

Do not hardcode:

```text
₹40,000 income
₹15,150 expenses
```

as permanent dashboard values.

---

# 73. Initial Application State

When the application is opened for the first time:

```text
No transactions
```

should be the valid state.

Show the appropriate empty state.

Do not automatically create fake transactions.

---

# 74. Data Consistency

After every CRUD operation:

```text
Create
Update
Delete
```

all of the following must remain consistent:

```text
LocalStorage
React state
Dashboard totals
Charts
Transaction list
Backend database
```

If the backend is unavailable, LocalStorage and UI state should still remain functional.

---

# 75. Testing Checklist

Before considering the project complete, test:

### Transactions

* [ ] Add income
* [ ] Add expense
* [ ] Edit income
* [ ] Edit expense
* [ ] Delete income
* [ ] Delete expense

### Calculations

* [ ] Income total
* [ ] Expense total
* [ ] Balance
* [ ] Category totals
* [ ] Monthly filtering

### Persistence

* [ ] Refresh browser
* [ ] Data remains in LocalStorage
* [ ] Data persists in Neon
* [ ] Backend restart does not destroy data

### UI

* [ ] Desktop
* [ ] Tablet
* [ ] Mobile
* [ ] Modal
* [ ] Empty state
* [ ] Loading state
* [ ] Error state

### Backend

* [ ] GET
* [ ] POST
* [ ] PUT
* [ ] DELETE
* [ ] Validation
* [ ] Error handling

---

# 76. Final Visual Quality Checklist

Before finishing, inspect the entire interface and ask:

### Does it feel minimalist?

If not, remove unnecessary elements.

### Does the off-white background dominate?

It should.

### Is charcoal the primary visual anchor?

It should be.

### Does Outfit appear consistently?

It should.

### Are there too many colors?

Reduce them.

### Are there too many cards?

Combine sections.

### Is the balance immediately visible?

It should be.

### Can a user add an expense quickly?

They should be able to.

### Does it look like a real product?

It should.

---

# 77. Final Product Experience

The finished application should feel like this:

```text
Open Monevo
      ↓
Immediately see current balance
      ↓
Understand this month's income & expenses
      ↓
See where money is being spent
      ↓
Review recent transactions
      ↓
Add / edit / delete effortlessly
      ↓
Data remains persistent
```

The interface should communicate:

> **Less noise. More clarity. Better control.**

---

# 78. README Requirements

The final repository README should document:

1. Project overview
2. Monevo branding
3. Features
4. Tech stack
5. Architecture
6. Folder structure
7. LocalStorage strategy
8. Backend architecture
9. Database architecture
10. API endpoints
11. Environment variables
12. Installation
13. Running frontend
14. Running backend
15. Prisma setup
16. Neon setup
17. Assignment requirement mapping
18. Screenshots section
19. Future improvements

Keep the README professional and suitable for a GitHub portfolio.

---

# 79. Future Improvements

Do not implement these now, but structure the code so they could be added later:

* User authentication
* Multiple users
* User-specific transactions
* Recurring expenses
* Budget limits
* Savings goals
* Subscription tracking
* Advanced analytics
* Export to CSV
* Export to PDF
* Monthly reports
* Dark mode
* Multi-currency
* Cloud synchronization
* PWA/offline support
* AI-powered spending insights

---

# 80. Final Instruction to the Coding Model

You are building **Monevo — Your Money, In Motion.**

Treat this document as the complete product specification.

Do not produce a generic expense tracker.

Build a polished, functional, responsive, portfolio-quality application.

Prioritize:

```text
1. Functionality
2. Data correctness
3. Clean architecture
4. Responsive UX
5. Minimalist visual design
6. Accessibility
7. Performance
```

The visual foundation must remain:

```text
OFF WHITE
+
CHARCOAL
+
OUTFIT
+
SUBTLE SEMANTIC COLORS
```

The frontend must be React-based and use:

```text
src/pages
```

The backend must use:

```text
Node.js + Express
```

The database must use:

```text
Neon PostgreSQL + Prisma
```

Client persistence must use:

```text
LocalStorage
```

The final product must support:

```text
ADD
EDIT
DELETE
INCOME
EXPENSE
MONTHLY SUMMARY
BALANCE
CATEGORIES
CHARTS
LOCALSTORAGE
REST API
NEON DATABASE
RESPONSIVE UI
```

Do not skip any requirement.

Do not replace required functionality with mock functionality.

Do not use fake persistent data.

Do not expose database credentials.

Do not over-engineer the application.

Most importantly:

> **Make Monevo feel like a carefully designed financial product, not an assignment.**

---

## Monevo

### Your Money, In Motion.
