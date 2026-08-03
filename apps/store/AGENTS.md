<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Storefront Agent Guidelines

Welcome, coding agent. This is the **store** application (customer-facing storefront) of the Caguei e-commerce monorepo.

---

## App Role & Architecture
- **Framework:** Next.js 16 (App Router) + React 19 + Tailwind v4 + Framer Motion.
- **Role:** Handles product browsing, bag management, address book, checkout (Stripe), and order history.
- **Authentication:** Pointed to the central API server on port `4000` via wrapper functions in `lib/api.ts`.
- **Payments:** Stripe client-side integration via `@stripe/react-stripe-js`. The client creates a PaymentIntent via `POST /api/payments/create-intent`, renders the hosted `<PaymentElement>`, and Stripe redirects to `/order-success` on success. **Orders are created server-side by the Stripe webhook — never from the client.**
- **Database Access:** Never query the DB directly from client components. Direct DB access is limited to server component auth checks in `app/(main)/layout.tsx`. All other data operations use API request wrappers in `lib/api.ts`.

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/api.ts` | All API wrappers: auth, addresses, cart, wishlist, payments, orders |
| `lib/auth-client.ts` | BetterAuth client — do NOT import directly in pages |
| `lib/context/store-context.tsx` | Global cart/wishlist state with DB sync on login |
| `app/(main)/checkout/page.tsx` | Checkout flow: address picker + Stripe Elements |
| `app/(main)/account/orders/page.tsx` | Real-time order history from `GET /api/orders` |
| `app/(main)/order-success/[id]/page.tsx` | Protected post-Stripe redirect; verifies order ownership & clears cart |

---

## Core Guidelines & Constraints

### 1. Centralized API References
- Always use the typed wrapper functions from `lib/api.ts`.
- Never import `authClient` from `lib/auth-client` directly into pages — always use the re-exports from `lib/api.ts`.

### 2. Stripe Integration
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is the only Stripe key on the client.
- Never put `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` in client code.
- Stripe `<Elements>` and `useStripe`/`useElements` must only be used in `'use client'` components.
- Components using `useSearchParams()` must be wrapped in `<Suspense>` for Next.js static builds.

### 3. Styling Guardrails (Vintage/Collegiate)
- Brand identity is vintage/collegiate streetwear, not minimalist luxury — see `docs/design-system.md` and `branding/` at the repo root for the source assets/palette (maroon `#7A1F1F`, navy, olive, cream).
- Rounded corners are fine and expected (`rounded-md`/`rounded-lg` on cards, buttons, images) — there is no 0px-radius rule.
- Typography: Use `Anton` (`font-display-*` utilities) for headlines/price tags. Use `Hanken Grotesk` for buttons, nav items, and body copy.
- Prefer real photography from `public/brand/photos/` over placeholder/stock image URLs.

### 4. Environment Variables
- `NEXT_PUBLIC_API_URL` — base URL for API requests (defaults to `http://localhost:4000`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
