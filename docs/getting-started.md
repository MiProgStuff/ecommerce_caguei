# Getting Started Guide

Follow this guide to get the Caguei Luxury Streetwear e-commerce workspace running locally on your development system.

---

## Prerequisites

Ensure you have the following installed on your local environment:
- **Node.js** Version >= 18
- **pnpm** (Package Manager)
- **PostgreSQL** Database server running locally (or an accessible cloud database)

---

## Installation Steps

### 1. Bootstrap Workspace Dependencies
Run the installation command in the monorepo root directory:
```bash
pnpm install
```

### 2. Configure Environment Variables
You will need to verify and configure `.env` variables in three directories:
- **`apps/store/.env`** (Storefront Client)
- **`apps/admin/.env`** (Admin Client)
- **`apps/api/.env`** (Central API Server)

Each directory contains a template configured for local defaults:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caguei_db"
BETTER_AUTH_SECRET="caguei_auth_secret_placeholder_keys_for_development_123456"
BETTER_AUTH_URL="http://localhost:4000"
```

### 3. Generate Database Client & Types
Synchronize the Prisma models and generate the client bindings inside the shared database library:
```bash
pnpm --filter @caguei/db exec prisma generate
```

To create/migrate the database tables inside your PostgreSQL database instance:
```bash
pnpm --filter @caguei/db exec prisma db push
```

### 4. Populate Database Catalog
After setting up or resetting the database, seed it with the official product catalog:
```bash
cd packages/db && DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caguei_db" npx tsx prisma/seed.ts
```

### 5. Setup Stripe Local Tunnel
To test checkout and receive order payments successfully, you must run the Stripe CLI forwarder:
```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```
Copy the webhook secret (`whsec_...`) printed by the command and add it to `apps/api/.env` as:
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```
Then restart the API server.

---

## Development Workflow

### Launching Servers
To start the storefront, admin dashboard, and API server concurrently in development mode, run:
```bash
pnpm dev
```

The services will initialize at the following endpoints:
- **Storefront Application:** `http://localhost:3000`
- **Admin Dashboard:** `http://localhost:3001`
- **Central API Service:** `http://localhost:4000`

### Testing Authentication (OTP Flow)
1. Navigate to `/login` on either the Storefront or the Admin dashboard.
2. Submit your email address.
3. Keep the terminal console of the `api` app open. Look for the console logs displaying the verification output:
   ```text
   ========================================
   [CENTRAL API DEV AUTH LOGGER]
   Type: SIGN-IN
   To: user@example.com
   OTP Code: 123456
   ========================================
   ```
4. Enter the 6-digit OTP code in the frontend input field to complete authentication.

---

## Build & Verify Commands

Verify TypeScript type compilation across all projects:
```bash
pnpm check-types
```

Compile and bundle production-optimized packages for deployment:
```bash
pnpm build
```
