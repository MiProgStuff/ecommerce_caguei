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
- **Authentication:** Individual accounts via email OTP (own `better-auth` instance in `lib/auth.ts`/`lib/auth-client.ts`, separate from the store's). `app/login/page.tsx` handles email → OTP → verify. `app/(main)/layout.tsx` gates the dashboard on two things: (1) a valid session, and (2) `session.user.role` being `ADMIN` or `SUPER_ADMIN` — a fresh sign-up defaults to `CUSTOMER` and is bounced back to `/login`, since proving email ownership isn't the same as being staff.
- **Staff management:** Only `SUPER_ADMIN` can promote a user to `ADMIN` or revoke it — enforced server-side via `requirePermission('users', 'UPDATE')` on `PATCH /api/users/:id/role` (the seeded `ADMIN` role only has `users:READ`, not `UPDATE`, so the SUPER_ADMIN bypass in that middleware is the only way through). `SUPER_ADMIN` itself is never editable through the API — it's only ever granted via `packages/db/prisma/seed.ts` (hardcoded email), to prevent self-lockout or privilege escalation via a bug. UI lives in `src/features/users-permissions/components/UsersPermissionsPage.tsx`.
- **Database Access:** Data operations (products, orders, analytics, staff roles, etc.) go through the central API on port `4000` via `lib/api.ts`.
- **Product pricing form** (`src/features/products/components/ProductForm.tsx`, section "4. Pricing & Promotions"): `originalPrice` and `promoPrice` are **derived, read-only fields**, not free-entry inputs — don't add editing back without confirming with the user first (this was deliberately changed after stale/inconsistent manual entries caused a real bug):
  - `originalPrice` = `costPrice × 10`, recalculated live via `useEffect` on every `costPrice` change (also re-derived server-side in `products.service.ts`, so it self-heals even if some other client writes the row).
  - `promoPrice` = `originalPrice × (1 − Discount % / 100)`, live from a local `discountPercent` state (not a persisted field) plus `originalPrice`.
  - Two mutually exclusive pricing modes toggle on `autoDiscountEnabled`: automatic (shows only `costPrice` + `cycleSalesCount`, the rest computed server-side by the discount-tier engine) vs. manual (shows the derived `originalPrice`/`promoPrice` fields above, `discountLabel`, `isPromoActive`). See `docs/api-reference.md` → Product Endpoints for the full pricing model.
- **Order management** (`src/features/orders/components/OrderDetailPage.tsx`): PENDING orders show a "Cancel Order" action (`POST /api/orders/:id/cancel`); enforcement is server-side (409 if not PENDING) — the UI hiding the button for other statuses is just a convenience, not the actual guard.

---

## Core Guidelines & Constraints

### 1. Centralized API References
- Never import `authClient` from `lib/auth-client` directly into pages. Always use the wrapper functions and hook exports (`sendVerificationOtp`, `signInWithOtp`, `signOutUser`, `useSession`, `fetchUsers`, `updateUserRole`) in `lib/api.ts`.

### 2. Styling Guardrails
- The admin panel stays a practical dark "obsidian" dashboard (`apps/admin/app/globals.css`, `--background: #141313`) — it does NOT adopt the storefront's cream/olive vintage palette. The brand comes through via the maroon accent (`--color-obsidian-accent`, `#C23B3B`) and the logo only.
- Small radii are fine (`rounded-[4px]`/`rounded-[8px]` per the `--radius-*` tokens) — there is no 0px-radius rule. See `docs/design-system.md` for the full palette rationale.
- Fonts are `Inter` (UI) + `JetBrains Mono` (data/metrics) — not Bodoni Moda/Hanken Grotesk, those are storefront-only.
