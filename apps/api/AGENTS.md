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

## Stripe Security — Critical Rules

### Order Creation is Webhook-Only
Orders are **never** created from client requests. The flow is:
1. Client calls `POST /api/payments/create-intent` → receives `clientSecret`
2. Stripe processes payment → fires `payment_intent.succeeded` webhook
3. Webhook verifies signature → creates `Order` + `OrderItem` in DB + clears cart

### Webhook Registration Order is Critical
The Stripe webhook handler MUST be registered **before** `app.use(express.json())` because it requires `express.raw()` to verify the Stripe signature. Swapping this order will break all webhook signature verification.

```typescript
// CORRECT ORDER — DO NOT CHANGE
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), handler);
app.use(express.json());
```

---

## Core Guidelines & Constraints

### 1. CORS & Origin Validation
- When adding new frontend clients, update both:
  1. The `cors` origin array in [server.ts](file:///home/soumya/Desktop/Code/Projects/caguei-ecommerce/apps/api/src/server.ts).
  2. The `trustedOrigins` array in [lib/auth.ts](file:///home/soumya/Desktop/Code/Projects/caguei-ecommerce/apps/api/lib/auth.ts).
- `credentials: true` must always be active to allow secure cookie transmission.

### 2. Passwordless OTP Logging
- The auth server is configured to bypass email sending during local development. All OTP tokens must be logged to stdout in a clean, visible format.

### 3. Server-Side Price Verification
- `POST /api/payments/create-intent` recalculates the order total from the database product prices — it never trusts the `grandTotal` value sent by the client.
- This prevents price manipulation attacks.

### 4. Webhook Idempotency
- The `payment_intent.succeeded` handler checks for an existing order with the same `stripePaymentIntentId` before creating a new one.
- This prevents duplicate orders if Stripe retries webhook delivery.

### 5. Environment Variables
| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key — never expose to client |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe Dashboard |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | BetterAuth signing secret |
| `BETTER_AUTH_URL` | Server's own base URL |
