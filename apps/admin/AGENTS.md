<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Admin Dashboard Agent Guidelines

Welcome, coding agent. This is the **admin** application (administrative panel) of the Caguei e-commerce monorepo.

---

## App Role & Architecture
- **Framework:** Next.js 16 (App Router) + React 19 + Tailwind v4.
- **Role:** Handles store administration, product catalog uploads, and order dispatch management.
- **Authentication:** Pointed to the central API server on port `4000` via the custom wrappers in `lib/api.ts`.
- **Database Access:** Imports the database client from `@caguei/db`. Server component path protections check session cookies in `app/(main)/layout.tsx` using the `@caguei/db` prisma adapter.

---

## Core Guidelines & Constraints

### 1. Centralized API References
- Never import `authClient` from `lib/auth-client` directly into pages. Always use the wrapper functions and hook exports (`sendVerificationOtp`, `signInWithOtp`, `signOutUser`, `useSession`) in [lib/api.ts](file:///home/soumya/Desktop/Code/Projects/caguei-ecommerce/apps/admin/lib/api.ts).

### 2. Styling Guardrails (0px Corners)
- Adhere to the core Caguei styling rules. Never apply rounded borders (`border-radius`, `rounded-*`) to admin page containers, tables, charts, buttons, or input forms.
- Keep the dashboard interface minimal and high-contrast (Black/White/Zinc color scheme) to match the luxury aesthetic.
