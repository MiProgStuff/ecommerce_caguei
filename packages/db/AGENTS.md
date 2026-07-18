# Database Package Agent Guidelines

Welcome, coding agent. This is the **db** shared database package (`@caguei/db`) of the Caguei e-commerce monorepo.

---

## Package Role & Architecture
- **Adapter Engine:** Prisma 7 + `@prisma/adapter-pg` (PostgreSQL client) + `pg` Pool.
- **Role:** Centralized repository for all relational database schemas, models, and adapter connections.
- **Compilation:** Exports raw TypeScript source files directly to workspace consumers (`apps/store`, `apps/admin`, `apps/api`), avoiding manual pre-build compile steps.

---

## Core Guidelines & Workflows

### 1. Schema Modifications & Migrations
When adding new models or changing existing columns in `prisma/schema.prisma`:
1. Run database schema validations and client code generation:
   ```bash
   pnpm --filter @caguei/db exec prisma generate
   ```
2. Push changes directly to the active development PostgreSQL database:
   ```bash
   pnpm --filter @caguei/db exec prisma db push
   ```

### 2. Client Pool Constraints
- Always import the default database wrapper `prisma` from `@caguei/db`. Avoid creating redundant `PrismaClient` instances inside consumer apps, as doing so will initiate extra connection pools and cause connection leaks.
- In Prisma 7, connection strings must be passed via the `Pool` parameter inside [src/index.ts](file:///home/soumya/Desktop/Code/Projects/caguei-ecommerce/packages/db/src/index.ts), not as parameters inside the prisma configuration file.
