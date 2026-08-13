# ☕ CAFE: Smart Cafe Management & Real-Time POS Ecosystem

CAFE is a production-grade, multi-branch, role-based cafe operating system designed to automate ordering workflows, digital/cash payment reconciliations, table-service dispatch, and real-time kitchen preparation displays. 

It is built as a split-architecture workspace:
1. **Frontend App (`client-side-cafe`)**: React 19, Redux Toolkit (RTK Query), Socket.IO-Client, TailwindCSS, and Framer Motion.
2. **Backend Engine (`smart-cafe-be`)**: NestJS (TypeScript), Prisma ORM, WebSockets Gateway, and PostgreSQL.

---

## 📐 Architecture & Real-Time Sync

CAFE eliminates database polling by coordinating real-time events over Socket.IO rooms. When action state shifts (e.g., cash payment confirmed by a cashier or Chapa webhook fires), the backend broadcasts state modifications to target rooms.

### WebSockets Room Topology
* **`kitchen:${branchId}` Room**: Listened to by waitstaff, cashier terminals, kitchen screens, and barista monitors. Handles new order announcements (`kitchen.new_order`) and payment status synchronization.
* **`order:${orderId}` Room**: Listened to by the customer's order tracker page. Syncs preparation steps and alerts in real-time.

```mermaid
graph TD
    subgraph Client Environments
        Cust[Customer Checkout] -->|REST API| Nest[NestJS Backend API]
        W[Waiter Dashboard] <-->|Socket.IO Events| Gateway[Socket.IO Gateway]
        C[Cashier Terminal] <-->|Socket.IO Events| Gateway
        K[Kitchen & Barista Boards] <-->|Socket.IO Events| Gateway
    end

    subgraph Core Services
        Nest -->|Prisma| DB[(PostgreSQL)]
        Nest <--> Gateway
    end

    subgraph Integrations
        Nest -->|Direct Verification| Chapa[Chapa Payment API]
        Chapa -->|Webhook Updates| Nest
    end
```

---

## 💳 Complete Workflow Routings

### 💵 1. Cash Payment & Prep Pipeline
For walk-in or table customers paying with physical currency at the counter.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer / Waiter
    actor Cashier as Cashier Terminal
    actor Waiter as Waiter Dashboard
    actor Kitchen as Kitchen Displays

    Customer->>Backend: Create Order (Post /orders)
    Note over Backend: Order Status: pending | Payment Status: pending (Cash)
    Backend-->>Cashier: Broadcasts kitchen.new_order (real-time)
    Backend-->>Waiter: Broadcasts kitchen.new_order (real-time)
    Note over Waiter: Waiter sees order as "Unpaid"<br/>"Push to Kitchen" button is DISABLED
    Customer->>Cashier: Pays physical cash at counter
    Cashier->>Backend: Confirm Cash (Post /payments/cash-confirm)
    Note over Backend: Deducts Product Inventory<br/>Sets payment status to 'completed'
    Backend-->>Waiter: Broadcasts kitchen.order_update (real-time)
    Note over Waiter: Waiter sees order as "Paid"<br/>"Push to Kitchen" button is now ENABLED
    Waiter->>Backend: Push to Kitchen (Patch /orders/:id/status -> status: confirmed)
    Backend-->>Kitchen: Broadcasts kitchen.order_update (real-time)
    Note over Kitchen: Order card appears on Prep Board
```

---

### 📱 2. Chapa Digital Payment Pipeline
For automated, instant card or mobile money payments (Telebirr, CBE Birr, M-Pesa, Cards).

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    actor Waiter as Waiter Dashboard
    actor Kitchen as Kitchen Displays
    participant Backend as NestJS Backend
    participant Chapa as Chapa Checkout

    Customer->>Backend: Create Order (Post /orders)
    Customer->>Backend: Initialize Chapa Payment (Post /payments/initialize)
    Note over Backend: Creates Payment Record with method: chapa, status: pending
    Backend-->>Waiter: Broadcasts real-time socket update (payment method set to chapa)
    Note over Waiter: Order is HIDDEN from Waiter's dashboard<br/>to avoid confusion during checkout
    Customer->>Chapa: Complete Sandbox Payment
    Chapa-->>Customer: Redirect back to /payment/success?orderId=xyz
    
    rect rgb(30, 40, 50)
        Note over Customer: Frontend Verification Fallback
        Customer->>Backend: Trigger Direct Verify (Post /payments/verify/:orderId)
        Backend->>Chapa: Call Chapa Verification API (Get /transaction/verify/:txRef)
        Chapa-->>Backend: Status: Success
    end

    Note over Backend: Deducts Product Inventory<br/>Sets payment status to 'completed'
    Backend-->>Waiter: Broadcasts kitchen.order_update (real-time)
    Note over Waiter: Order appears on Waiter board as "Paid"<br/>"Push to Kitchen" is now ENABLED
    Waiter->>Backend: Push to Kitchen (Patch /orders/:id/status -> status: confirmed)
    Backend-->>Kitchen: Broadcasts kitchen.order_update (real-time)
```

---

## 🧑‍💻 Role-Based Workspace Specifications

| Role Workspace | Key Views / Operations | Target Real-Time Actions |
| :--- | :--- | :--- |
| **Customer** | Menu Catalog, Cart checkout, Order Success Page (verifies Chapa status on landing), Live order status tracker. | Listens for `order.status.updated` to update the step-by-step progress timeline. |
| **Waiter** | **WaiterNewOrderPage**: Create custom orders for tables.<br>**WaiterIncomingOrdersPage**: Manage pending table orders. Push paid orders to prep queue. | Listens for `kitchen.new_order` and `kitchen.order_update` (adds new orders, merges live payment status). |
| **Cashier** | **Incoming Payments**: Track unpaid cash orders.<br>**Payment History**: Search completed transactions. | Listens for new cash orders via sockets. Confirm cash payments in one click. |
| **Kitchen & Barista** | **Live Prep Board**: Kanban view containing Confirmed → Preparing → Ready → Completed states. Automatically splits orders by product categories (e.g., drinks to Barista page, food to Kitchen page). | Listens for `kitchen.order_update` to append newly confirmed orders and remove completed cards. |
| **Manager / Admin** | Create Branches, Manage Employees, Adjust Menu pricing rules, Log Raw Materials inventory. | Material Request workflow, Inventory stock movement logs. |

---

## 🛢️ Database Schema & Entities

CAFE utilizes PostgreSQL managed via Prisma. Here is an overview of the core database entities:

### 1. User & Access Roles
* **`Role`**: Authorization levels (`admin`, `manager`, `cashier`, `waiter`, `kitchen`, `barista`, `customer`).
* **`User`**: Account identifiers, credential hashes, and Google OAuth ID references.
* **`Employee`**: Intermediate relation tying users to specific `Branch` locations.

### 2. Shop Configuration
* **`Branch`**: Local properties (address, timezone, active status). 
* **`Category`**: Parent divisions of items (image URLs, branch assignments).
* **`Product`**: Menu items with exact decimal price, category mapping, and optional Recipe attachments.

### 3. Orders & Financials
* **`Order`**: Order numbering metadata, statuses (`pending`, `confirmed`, `in_kitchen`, `ready`, `completed`, `cancelled`), and dining type (`dine_in`, `takeaway`).
* **`OrderItem`**: Quantity snapshots and individual unit prices to guarantee historical order reporting integrity.
* **`Payment`**: Financial records tracking payment methods (`cash`, `chapa`), transaction statuses (`pending`, `completed`, `failed`), transaction references (`txRef`), and checkout links.

### 4. Dual-Mode Inventory Management
* **`Inventory`**: Product-based stock metrics tracking current counts and reorder alert levels per branch.
* **`InventoryLog`**: Immutable ledger recording all product adjustments (order deductions, manual addition/removal, opening stock).
* **`RawMaterial`**: Raw ingredient definitions (e.g. coffee beans, milk, sugar) tracking raw stock.
* **`Recipe` & `RecipeIngredient`**: Ingredient formulas tying menu products to raw material consumption ratios.

---

## 🔌 Socket.IO Event Reference

### 📤 Emitted by Clients (Frontend)
1. **`kitchen.join`**: Client joins branch-specific notifications.
   ```json
   { "branchId": "uuid-string" }
   ```
2. **`order.join`**: Client joins live order tracking.
   ```json
   { "orderId": "uuid-string" }
   ```

### 📥 Received by Clients (Frontend)
1. **`kitchen.new_order`**: Alerts dashboards of a newly created order.
   ```json
   {
     "event": "kitchen.new_order",
     "data": { "id": "uuid", "orderNumber": "ORD-0042", "status": "pending", "payment": null, "items": [] }
   }
   ```
2. **`kitchen.order_update` / `order.status.updated`**: Broadcasts status changes and verified payment details.
   ```json
   {
     "event": "order.status.updated",
     "data": {
       "orderId": "uuid",
       "status": "pending",
       "payment": { "id": "uuid", "status": "completed", "method": "chapa" }
     }
   }
   ```

---

## 🎛️ REST API Specification

### 1. Order Endpoints
* **`POST /api/v1/orders`**: Creates a new order.
* **`GET /api/v1/orders`**: Lists orders. Filters: `branchId`, `status`, `days`.
* **`GET /api/v1/orders/:id`**: Gets a single order's details.
* **`PATCH /api/v1/orders/:id/status`**: Updates order status. Enforces a strict state machine:
  * Transitions must match: `pending` → `confirmed`/`in_kitchen`/`cancelled` → `ready` → `completed`.
  * **Backend Guard**: Throws a `400 Bad Request` if attempting to set status to `confirmed` (Push to Kitchen) for any order whose payment status is not `completed`.

### 2. Payment Endpoints
* **`POST /api/v1/payments/initialize`**: Initializes a transaction. Returns a Chapa checkout URL for digital payments.
* **`POST /api/v1/payments/cash-confirm`**: Confirms physical cash reception (Cashier only). Deducts inventory counts and sets payment status to `completed`.
* **`POST /api/v1/payments/verify/:orderId`**: Frontend fallback verification. Queries Chapa status, verifies amounts, deducts inventory, and completes the payment record.
* **`POST /api/v1/payments/webhook`**: Receives asynchronous webhooks from Chapa. Validates signature headers, verifies transaction details, and updates payment state.

---

## ⚙️ Environment Variables

### Backend Configuration (`smart-cafe-be/.env`)
```bash
PORT=3000
DATABASE_URL="postgresql://user:pass@host:5232/dbname?schema=public"
JWT_SECRET="supersecretphrase"
APP_URL="http://localhost:3000"
FRONTEND_RETURN_URL="http://localhost:5173/payment/success"

# Chapa Gateway Credentials
CHAPA_BASE_URL="https://api.chapa.co/v1"
CHAPA_SECRET_KEY="CHASECK_TEST-..."
CHAPA_WEBHOOK_SECRET="your_signature_webhook_key"
```

### Frontend Configuration (`client-side-cafe/.env`)
```bash
VITE_API_URL="http://localhost:3000/api/v1"
VITE_SOCKET_URL="http://localhost:3000"
```

---

## ⚙️ State Management & RTK Query Tags

The frontend uses **RTK Query** inside Redux to manage caches. Cache lifecycle tags ensure live dashboards are invalidate-refetched automatically when state transitions occur.

### Invalidation Schema
* **`Order` Tag**: Invalidated when:
  * Creating a new order.
  * Updating order state (`POST /payments/cash-confirm`, `PATCH /orders/:id/status`).
  * Socket middleware intercepts `kitchen.order_update` or `kitchen.new_order`.
* **`Payment` Tag**: Invalidated upon payment initialization or verification.

---

## 🚀 Setup & Execution

### 1. Launch Backend Service
```bash
cd smart-cafe-be
npm install
npx prisma db push
npm run seed
npm run start:dev
```

### 2. Launch Frontend Application
```bash
cd client-side-cafe
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
