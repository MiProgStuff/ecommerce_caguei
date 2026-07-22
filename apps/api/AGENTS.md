# Central API Agent Guidelines

Welcome, coding agent. This is the **api** backend application (Express.js server) of the Caguei e-commerce monorepo.

---

## App Role & Architecture

- **Framework:** Express.js + TypeScript + ts-node.
- **Role:** Centralized endpoint gateway, authentication provider, and Stripe payment processor.
- **Port:** Listens on port `4000` (`http://localhost:4000`).
- **Database Access:** Connects to PostgreSQL via the shared `prisma` client from `@caguei/db`.
- **Authentication:** Runs the BetterAuth instance centrally, handling OTP verification, sign-in, sign-up, and session management.
- **Payments:** Implements Stripe PaymentIntent creation and webhook event handling for secure server-side order confirmation.

---

## Code Base Organization (Domain-Driven Layered Architecture)

The codebase is organized under `src/modules/` into category-specific domains. Each module uses a 3-layer structure (`.routes.ts`, `.controller.ts`, `.service.ts`):

```text
apps/api/src/
├── app.ts                         # Express setup, CORS, raw webhook route, JSON bodyparser, module routes
├── server.ts                      # Server startup entrypoint (listens on PORT)
├── lib/
│   └── stripe.ts                  # Shared Stripe SDK singleton instance
├── middleware/
│   └── auth.middleware.ts         # requireAuth middleware (validates session, attaches req.user / req.session)
└── modules/
    ├── users/                     # GET /api/users/check
    │   ├── users.routes.ts
    │   ├── users.controller.ts
    │   └── users.service.ts
    ├── addresses/                 # /api/addresses CRUD
    │   ├── addresses.routes.ts
    │   ├── addresses.controller.ts
    │   └── addresses.service.ts
    ├── cart/                      # /api/cart CRUD
    │   ├── cart.routes.ts
    │   ├── cart.controller.ts
    │   └── cart.service.ts
    ├── wishlist/                  # /api/wishlist CRUD
    │   ├── wishlist.routes.ts
    │   ├── wishlist.controller.ts
    │   └── wishlist.service.ts
    ├── payments/                  # POST /api/payments/create-intent
    │   ├── payments.routes.ts
    │   ├── payments.controller.ts
    │   └── payments.service.ts
    ├── products/                  # GET /api/products, GET /api/products/:slug
    │   ├── products.routes.ts
    │   ├── products.controller.ts
    │   └── products.service.ts
    ├── orders/                    # GET /api/orders
    │   ├── orders.routes.ts
    │   ├── orders.controller.ts
    │   └── orders.service.ts
    └── webhooks/                  # POST /api/webhooks/stripe (raw body processing)
        ├── webhooks.routes.ts
        ├── webhooks.controller.ts
        └── webhooks.service.ts
```

---

## Stripe Security — Critical Rules

### DB-First Order Flow
Orders are **never** created from client requests. The flow is:
1. Client calls `POST /api/payments/create-intent` → Backend verifies prices, creates `PENDING` Order in DB, creates Stripe PaymentIntent with `metadata: { orderId }`, returns `{ clientSecret, orderId }`.
2. Stripe processes payment → fires `payment_intent.succeeded` webhook.
3. Webhook verifies signature → updates Order status to `PAID` + attaches `stripePaymentIntentId` + clears DB cart.

### Webhook Registration Order is Critical
The Stripe webhook handler MUST be registered **before** `express.json()` middleware because it requires `express.raw()` to verify the Stripe signature.

```typescript
// CORRECT ORDER in src/app.ts — DO NOT CHANGE
app.use('/api/webhooks', webhooksRoutes); // Uses raw({ type: 'application/json' }) internally
app.use(express.json());
```

---

## Core Guidelines & Constraints

### 1. Layered Responsibilities
When adding or modifying API features:
- **Routes (`*.routes.ts`):** Define Express route paths and apply middleware like `requireAuth`.
- **Controllers (`*.controller.ts`):** Parse HTTP request params/body/query, validate inputs, send HTTP status codes and JSON responses.
- **Services (`*.service.ts`):** Execute database queries via Prisma or external APIs (Stripe). Keep logic decoupled from Express `req`/`res`.

### 2. Authentication Middleware
- Use `requireAuth` from `src/middleware/auth.middleware.ts` for all protected routes.
- Access authenticated session details via `req.user` and `req.session`.

### 3. CORS & Origin Validation
- When adding new frontend clients, update both:
  1. The `cors` origin array in [src/app.ts](file:///home/soumya/Desktop/Code/Projects/caguei-ecommerce/apps/api/src/app.ts).
  2. The `trustedOrigins` array in [lib/auth.ts](file:///home/soumya/Desktop/Code/Projects/caguei-ecommerce/apps/api/lib/auth.ts).

### 4. Environment Variables
| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key — never expose to client |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe Dashboard |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | BetterAuth signing secret |
| `BETTER_AUTH_URL` | Server's own base URL |
