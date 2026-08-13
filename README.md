# ☕ CAFE: Smart Cafe Management System

CAFE is a modern, real-time, end-to-end cafe management system designed to streamline customer ordering, cash/digital payments, table service coordination, and kitchen preparation workflows.

Built on a decoupled architecture, it features a highly interactive React/Redux frontend, a robust NestJS/Prisma backend, real-time WebSocket synchronization, and integrated digital payment processing.

---

## 📐 System Architecture

The ecosystem consists of three major components:
1. **Frontend App (`client-side-cafe`)**: A multi-role interface (Customer, Waiter, Cashier, Kitchen, Barista) built using Vite, React, Redux Toolkit, and TailwindCSS.
2. **Backend Engine (`smart-cafe-be`)**: A modular API gateway built with NestJS, Prisma ORM, and PostgreSQL.
3. **WebSockets Layer**: Orchestrated via Socket.io for instant cross-device updates (e.g., checkout payments notifying waiters, and waiters pushing orders to kitchen displays).

```mermaid
graph TD
    subgraph Client Applications
        C[Customer App / Checkout]
        W[Waiter Dashboard]
        CA[Cashier Terminal]
        K[Kitchen & Barista Board]
    end

    subgraph Backend Services
        API[NestJS Gateway API]
        WS[Socket.IO Server]
        DB[(PostgreSQL Database)]
        Prisma[Prisma ORM]
    end

    subgraph Integrations
        Chapa[Chapa Payment Gateway]
    end

    C -->|REST API| API
    W -->|REST API| API
    CA -->|REST API| API
    
    WS <-->|Real-time Events| W
    WS <-->|Real-time Events| CA
    WS <-->|Real-time Events| K
    
    API --> Prisma
    Prisma --> DB
    
    API -->|Initialize / Verify| Chapa
    Chapa -->|Webhooks / Fallback| API
```

---

## 💳 Payment & Ordering Flows

The application orchestrates two distinct payment routing architectures to ensure financial validation before preparation begins.

### 💵 Flow 1: Cash Payment Route
Used when customers prefer to pay physically at the counter.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer / Waiter
    actor Cashier as Cashier Terminal
    actor Waiter as Waiter Dashboard
    actor Kitchen as Kitchen / Barista

    Customer->>Backend: Create Order (Status: pending)
    Backend-->>Waiter: Notify: New Order Received (Payment Status: pending)
    Customer->>Cashier: Pay physically at counter
    Cashier->>Backend: Confirm Cash Payment
    Backend-->>Waiter: Broadcast: Payment Completed (via WebSockets)
    Waiter->>Backend: Push to Kitchen (Status: confirmed)
    Backend-->>Kitchen: Broadcast: Ready to Prep (via WebSockets)
```

### 📱 Flow 2: Chapa Payment Route (Digital)
Used for automated, card/mobile payment verification (Telebirr, CBE Birr, Cards).

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    actor Waiter as Waiter Dashboard
    actor Kitchen as Kitchen / Barista
    participant Backend as Backend Gateway
    participant Chapa as Chapa API

    Customer->>Backend: Create Order (Status: pending)
    Customer->>Backend: Initialize Payment (Chapa)
    Backend->>Chapa: Get Checkout URL
    Backend-->>Waiter: Broadcast: Chapa Payment Pending (Order Hidden from Waiter)
    Customer->>Chapa: complete Payment Redirect
    Chapa-->>Backend: Webhook Callback OR Redirection Verify (Verify fallback)
    Backend-->>Waiter: Broadcast: Payment completed (Order Shows on Waiter as PAID)
    Waiter->>Backend: Push to Kitchen (Status: confirmed)
    Backend-->>Kitchen: Broadcast: Ready to Prep (via WebSockets)
```

---

## 🚀 Key Features

* **Multi-Role Workspaces**: Tailored dashboards for Customers, Waiters, Cashiers, Kitchen Staff, and Baristas.
* **Instant synchronization**: WebSockets handle ordering updates, cashier confirmations, and kitchen Kanban progression in under 100ms.
* **Dual-Path Payment Verification**: Digital payments verified automatically using webhook hooks supplemented by direct API redirection verification to protect against network delays or failed webhook endpoints.
* **Backend State Enforcement**: Rigid order state transitions (e.g., rejecting attempts to push unpaid orders to the kitchen) validation enforced via backend guard checks.
* **Live Kitchen Kanban**: Interactive drag-and-drop state progression (Confirmed → Preparing → Ready → Completed) separated by food and beverage categories (Kitchen vs. Barista display boards).

---

## 🛠️ Technology Stack

### Frontend (`client-side-cafe`)
* **Framework**: React 19 (TypeScript) via Vite
* **State Management**: Redux Toolkit & RTK Query
* **Styling**: TailwindCSS & shadcn/ui components
* **Motion & Icons**: Framer Motion & Lucide React
* **Real-time Sync**: Socket.io-client

### Backend (`smart-cafe-be`)
* **Framework**: NestJS (Node.js framework)
* **ORM**: Prisma ORM
* **Database**: PostgreSQL
* **Security**: Passport JWT Auth Guards, RBAC (Role-Based Access Control)
* **Real-time**: Socket.io gateway

---

## 📦 Installation & Setup

### Prerequisites
* Node.js (v18+ recommended)
* PostgreSQL database instance running locally or hosted

### 1. Backend Setup (`smart-cafe-be`)

1. Clone and navigate to backend directory:
   ```bash
   cd smart-cafe-be
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/cafe_db?schema=public"
   JWT_SECRET="your_jwt_secret"
   APP_URL="http://localhost:3000"
   FRONTEND_RETURN_URL="http://localhost:5173/payment/success"
   CHAPA_BASE_URL="https://api.chapa.co/v1"
   CHAPA_SECRET_KEY="your_chapa_secret_key"
   CHAPA_WEBHOOK_SECRET="your_chapa_webhook_signature_secret"
   ```
4. Run migrations and generate Prisma client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
5. Run the seed script to set up default roles, branches, and dummy menu items:
   ```bash
   npm run seed
   ```
6. Start the development server:
   ```bash
   npm run start:dev
   ```

---

### 2. Frontend Setup (`client-side-cafe`)

1. Navigate to frontend directory:
   ```bash
   cd ../client-side-cafe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL="http://localhost:3000/api/v1"
   VITE_SOCKET_URL="http://localhost:3000"
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🧪 Testing the Live System

To test the system from end to end:

1. **Role Access Setup**: Create test accounts using the database seed users or sign up as a customer, then change roles in the Database (`admin`, `cashier`, `waiter`, `kitchen`, `barista`).
2. **Placing a Cash Order**:
   - As a **Customer**, place an order choosing **Pay Cash at Counter**.
   - As a **Cashier**, see the order appear under **Incoming Payments** in real-time. Click **Confirm Payment**.
   - As a **Waiter**, the order badge turns green to **Paid**. Click **Push to Kitchen**.
   - The order immediately populates on the **KitchenDisplayPage**.
3. **Placing a Chapa Order**:
   - As a **Customer**, check out with **Pay with Chapa**. Complete the sandbox payment.
   - Upon redirect to the success page, the verify request will confirm the transaction status.
   - The **Waiter** page automatically adds the order as **Paid** (no cashier interaction needed).
   - Push to kitchen, and verify it updates the kitchen displays instantly.
