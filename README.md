# Caguei Luxury Streetwear — Monorepo

An architectural, minimalist, luxury streetwear e-commerce platform built as a high-performance monorepo using **pnpm workspaces** and **Turborepo**.

---

## Workspace Layout

```text
caguei-ecommerce/
  apps/
    store/      # Next.js 16 Storefront (Customer-facing, Stripe Elements)
    admin/      # Next.js 16 Admin Panel (Internal product/order tracking)
    api/        # Express.js Central Backend (Auth, addresses, Stripe webhook, cart & orders)
  packages/
    db/         # Shared database ORM package (Prisma 7 client + PostgreSQL)
  docs/         # System documentation
```

---

## 🛠️ Local Development Setup

Follow these steps to run the Caguei ecosystem on your development machine.

### Prerequisites
* **Node.js** >= 18
* **pnpm** (Package manager)
* **PostgreSQL** running locally
* **Stripe CLI** (for local webhook testing)

---

### Step 1: Install Dependencies
Bootstrap the monorepo from the root directory:
```bash
pnpm install
```

### Step 2: Configure Environment Files
Set up `.env` files in each workspace folder. You can copy the defaults configured for local development:

#### `apps/api/.env`
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caguei_db"
BETTER_AUTH_SECRET="caguei_auth_secret_placeholder_keys_for_development_123456"
BETTER_AUTH_URL="http://localhost:4000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### `apps/store/.env`
```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caguei_db"
BETTER_AUTH_SECRET="caguei_auth_secret_placeholder_keys_for_development_123456"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

#### `packages/db/.env`
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caguei_db"
```

---

### Step 3: Database setup & Seeding
Inside the `packages/db` package, push the schema to PostgreSQL and populate the product catalog:

1. **Push schema to DB:**
   ```bash
   pnpm --filter @caguei/db exec prisma db push
   ```
2. **Seed product data:**
   ```bash
   cd packages/db && DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caguei_db" npx tsx prisma/seed.ts
   ```

---

### Step 4: Setup Stripe Webhook Tunnel
Stripe needs a way to forward payment notifications (`payment_intent.succeeded`) to your local backend.

1. **Start the forwarder tunnel:**
   ```bash
   stripe listen --forward-to localhost:4000/api/webhooks/stripe
   ```
2. Copy the webhook secret (`whsec_...`) printed in the console and paste it into `apps/api/.env` as `STRIPE_WEBHOOK_SECRET`.
3. Restart/Start the servers.

---

### Step 5: Start Development Servers
Run the dev server from the root directory to start all applications simultaneously:
```bash
pnpm dev
```
* **Storefront:** `http://localhost:3000`
* **Admin Dashboard:** `http://localhost:3001`
* **Central API & Auth:** `http://localhost:4000`

---

## 🚀 Production Build & Deployment

To deploy this monorepo to production (e.g. AWS, Vercel, Docker, Dokploy), configure variables and build options for production environments:

### 1. Database Provisioning
Run migrations to set up the database tables in your production PostgreSQL instance:
```bash
# Push production schema
DATABASE_URL="your-production-db-url" pnpm --filter @caguei/db exec prisma db push
```

### 2. Stripe Production Webhook
1. Go to the **Stripe Dashboard → Developers → Webhooks**.
2. Click **Add endpoint** and enter your production server webhook address:
   `https://api.yourdomain.com/api/webhooks/stripe`
3. Select the event: `payment_intent.succeeded`.
4. Copy the production **Signing Secret** (`whsec_...`) and configure it on your production API server as `STRIPE_WEBHOOK_SECRET`.

### 3. Production Environment Checklist
Set up these environment variables in your hosting provider's dashboard:

| App | Key | Production Value |
|-----|-----|------------------|
| **api** | `DATABASE_URL` | Production PostgreSQL connection URL |
| **api** | `STRIPE_SECRET_KEY` | Live secret key (`sk_live_...`) |
| **api** | `STRIPE_WEBHOOK_SECRET` | Live webhook secret (`whsec_...`) |
| **api** | `BETTER_AUTH_SECRET` | Secure random string (e.g. `openssl rand -hex 32`) |
| **api** | `BETTER_AUTH_URL` | API base domain (e.g. `https://api.yourdomain.com`) |
| **store** | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Live publishable key (`pk_live_...`) |
| **store** | `NEXT_PUBLIC_API_URL` | API base domain (e.g. `https://api.yourdomain.com`) |

---

### 4. Build the Applications
Run compile check and build from the root directory:
```bash
# Check TS compilation
pnpm check-types

# Build optimized production assets
pnpm build
```

### 5. Running in Production
Start each service using Node:
```bash
# API Server
pnpm --filter api start

# Storefront
pnpm --filter store start
```

## 🐳 Docker Deployment

The monorepo contains optimized Dockerfiles for each application:
* Storefront: `apps/store/Dockerfile`
* Admin Panel: `apps/admin/Dockerfile`
* API Backend: `apps/api/Dockerfile`

These Dockerfiles leverage **Turborepo multi-stage builds** (`turbo prune`) to minimize final image sizes and only compile the required workspace packages.

### How to Build & Run with Docker

Run these commands from the **root directory** of the repository:

#### 1. Build the API Server
```bash
docker build -t caguei-api -f apps/api/Dockerfile .
```
Run the container:
```bash
docker run -p 4000:4000 --env-file apps/api/.env caguei-api
```

#### 2. Build the Storefront
```bash
docker build -t caguei-store -f apps/store/Dockerfile .
```
Run the container:
```bash
docker run -p 3000:3000 --env-file apps/store/.env caguei-store
```

#### 3. Build the Admin Panel
```bash
docker build -t caguei-admin -f apps/admin/Dockerfile .
```
Run the container:
```bash
docker run -p 3001:3001 --env-file apps/admin/.env caguei-admin
```

### Running with Docker Compose

A root `docker-compose.yml` configures a PostgreSQL database container along with the API, storefront, and admin panel, running them in a unified container network.

1. **Spin up all services:**
   ```bash
   docker compose up --build -d
   ```
2. **Setup the database and seed catalog data inside the container:**
   ```bash
   # Push database schema
   docker compose exec api pnpm --filter @caguei/db exec prisma db push

   # Seed database catalog products
   docker compose exec api npx tsx packages/db/prisma/seed.ts
   ```

* **Storefront:** `http://localhost:3000`
* **Admin Dashboard:** `http://localhost:3001`
* **API Backend:** `http://localhost:4000`

To shut down and wipe database volumes:
```bash
docker compose down -v
```

---

## 📖 Additional Reference Docs

For deep technical details, check the `./docs` directory:
* **[Architecture Guide](file:///home/soumya/Desktop/Code/Projects/caguei-ecommerce/docs/architecture.md):** High-level component patterns and secure Stripe payment data flows.
* **[API Reference](file:///home/soumya/Desktop/Code/Projects/caguei-ecommerce/docs/api-reference.md):** Complete catalog of Express API endpoints, cart sync operations, and webhook behaviors.
* **[Design System](file:///home/soumya/Desktop/Code/Projects/caguei-ecommerce/docs/design-system.md):** Typography, color codes, spacing, and strict `0px` border-radius constraints.
