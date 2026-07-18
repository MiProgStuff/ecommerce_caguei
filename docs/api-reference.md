# Central API Reference

This document covers the core endpoints exposed by the shared API server running on port `4000`.

---

## Authentication Endpoints (BetterAuth)

All authentication endpoints are mounted under the base path `/api/auth/*` on `http://localhost:4000`.

### 1. Request Login Code
Sends a 6-digit OTP code to the requested email address. In development, the code is printed directly to the server terminal console.

- **URL:** `/api/auth/email-otp/send-verification-otp`
- **Method:** `POST`
- **Payload:** `{ "email": "user@example.com", "type": "sign-in" }`
- **Response:** `{ "success": true }`

### 2. Verify Code & Sign In
- **URL:** `/api/auth/sign-in/email-otp`
- **Method:** `POST`
- **Payload:** `{ "email": "...", "otp": "123456", "name": "John Doe" }`
- **Response:** Sets `better-auth.session_token` cookie; returns `{ session, user }`.

### 3. Sign Out
- **URL:** `/api/auth/sign-out`
- **Method:** `POST`
- **Response:** Clears session cookie; returns `{ success: true }`.

### 4. Fetch Session
- **URL:** `/api/auth/get-session`
- **Method:** `GET`
- **Response:** `{ session, user }` or `null`.

---

## Health Check

- **URL:** `GET /api/health`
- **Response:** `{ "status": "ok", "database": "connected" }`

---

## User Endpoints

### Check if User Exists
- **URL:** `GET /api/users/check?email=<email>`
- **Response:** `{ "exists": boolean }`

---

## Address Endpoints

All address endpoints require an authenticated session cookie.

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/addresses` | Fetch all saved addresses for the current user |
| `POST` | `/api/addresses` | Create a new address |
| `DELETE` | `/api/addresses/:id` | Delete an address by ID (must own it) |

**POST `/api/addresses` payload:**
```json
{
  "street": "123 Sakura Lane",
  "city": "Kyoto",
  "state": "Kyoto Prefecture",
  "postalCode": "604-0000",
  "country": "Japan",
  "label": "home"
}
```
`label` must be one of: `"home"`, `"work"`, `"other"`.

---

## Cart Endpoints

All cart endpoints require an authenticated session cookie.

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/cart` | Get all cart items with product data |
| `POST` | `/api/cart` | Add item to cart (or increment if exists) |
| `PUT` | `/api/cart/:id` | Update quantity of a cart item |
| `DELETE` | `/api/cart/:id` | Remove a single cart item |
| `DELETE` | `/api/cart` | Clear entire cart |

---

## Wishlist Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/wishlist` | Get all wishlisted products |
| `POST` | `/api/wishlist` | Add product to wishlist |
| `DELETE` | `/api/wishlist/:productId` | Remove product from wishlist |

---

## Payment Endpoints (Stripe)

### Create a Payment Intent
Creates a Stripe PaymentIntent server-side. The **amount is calculated server-side** by verifying actual product prices — the client-submitted total is never trusted.

- **URL:** `POST /api/payments/create-intent`
- **Auth:** Session cookie required
- **Payload:**
  ```json
  {
    "addressId": "uuid",
    "subtotal": 420.00,
    "shippingCost": 25.00,
    "estimatedTax": 33.60,
    "grandTotal": 478.60,
    "items": [
      { "productId": "...", "quantity": 1, "size": "M", "price": 420.00 }
    ]
  }
  ```
- **Response:** `{ "clientSecret": "pi_xxx_secret_xxx" }`

---

## Stripe Webhook Handler

> **⚠️ Internal — not called by the client.**

- **URL:** `POST /api/webhooks/stripe`
- **Auth:** Stripe signature header (`stripe-signature`). Verified server-side using `STRIPE_WEBHOOK_SECRET`.
- **Event:** `payment_intent.succeeded`
- **Behavior on success:**
  1. Verifies the Stripe signature (rejects forged payloads)
  2. Reads order metadata embedded in the PaymentIntent
  3. Creates the `Order` and `OrderItem` records in the database atomically
  4. Clears the user's DB cart
  5. Is **idempotent** — replayed webhooks are safely ignored if the order already exists

---

## Orders Endpoints (Read-only)

Orders are **only created by the Stripe webhook**. The client can only read them.

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/orders` | Get all orders for the current user, with items and address |

---

## TypeScript Client SDK (`store/lib/api.ts`)

| Function | Description |
|----------|-------------|
| `useSession()` | React hook for live session state |
| `sendVerificationOtp(email, type)` | Send OTP email |
| `signInWithOtp(email, otp, name?)` | Verify OTP and authenticate |
| `signOutUser()` | Destroy session |
| `fetchUserAddresses()` | Get all addresses |
| `createUserAddress(data)` | Save a new address |
| `deleteUserAddress(id)` | Remove an address |
| `fetchCart()` | Get DB cart items |
| `addToDbCart(productId, quantity, size)` | Add/increment cart item |
| `updateDbCart(id, quantity)` | Update cart item quantity |
| `removeFromDbCart(id)` | Remove cart item |
| `clearDbCart()` | Empty DB cart |
| `fetchWishlist()` | Get wishlisted products |
| `addToDbWishlist(productId)` | Add to wishlist |
| `removeFromDbWishlist(productId)` | Remove from wishlist |
| `createPaymentIntent(data)` | Create Stripe PaymentIntent; returns `{ clientSecret }` |
| `fetchOrders()` | Fetch user's order history |
