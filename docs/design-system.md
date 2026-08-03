# Design System Guidelines

This document details the visual rules, typography rules, layout tokens, and UI guidelines for the Caguei storefront and admin applications.

Source of truth for the brand identity: `branding/caguei/` (logo files) and `branding/sessão antiga/` + `branding/Ideias futuras/` (real product photography). Colors below are extracted directly from the vector logo (`fill:` values in the SVG paths) and the product line flat-lay.

---

## 1. Core Principles

- **Vintage / Collegiate Streetwear:** Bold, embroidered-patch energy — not minimalist luxury. Think varsity jackets and letterman crests reworked for the street.
- **Soft structure, not sharp edges:** Rounded corners are welcome (`rounded-md`/`rounded-lg` on cards, buttons, images) — the brand mark itself (the "C" monogram) uses rounded corners. There is no global 0px-radius rule.
- **Real photography over stock/placeholder imagery:** Use actual product shots from `branding/` (or their web copies in each app's `public/brand/`), not generic external placeholder URLs.

---

## 2. Typography

- **Display (headlines):** `Anton` — bold, condensed, uppercase, high-impact. Loaded via `next/font/google` as `--font-collegiate` in `apps/store`.
- **Body / UI:** `Hanken Grotesk` — unchanged from the previous system, works fine for both moods.
- **Admin panel** uses its own pairing, independent of the storefront: `Inter` (UI) + `JetBrains Mono` (data/metrics), loaded in `apps/admin/app/layout.tsx`. Don't try to force Bodoni Moda/Hanken Grotesk into admin — it never used them in practice.

---

## 3. Color Palette

Extracted from `branding/caguei/Logo_Caguei_Vetorizado.svg` / `Logo_Premium_Vetorizado.svg` (fill colors) and the product flat-lay (`branding/Ideias futuras/1.png`).

| Token Name | Hex Code | Source / Usage |
| :--- | :--- | :--- |
| **Maroon (Primary)** | `#7A1F1F` (logo exact: `#980202`) | Primary brand color — buttons, links, headline accents |
| **Dusty Rose** | `#D79F9F` | Soft accent, logo shadow tone, hover tints |
| **Navy** | `#22314F` | Secondary — from the navy tee |
| **Olive** | `#6E7345` | Tertiary accent — from the hoodie |
| **Cream / Sand** | `#F5EFE1` | Store background — from the cru tee |
| **Black / White** | `#211A15` / `#FFFFFF` | Neutrals, text |

Store tokens live in `apps/store/app/globals.css` under `@theme` (Tailwind v4 CSS-native tokens — no JS config file). Admin tokens live in `apps/admin/app/globals.css` as a dark "obsidian" dashboard (`--background: #141313`) with the maroon (`#C23B3B`, brightened for dark-surface contrast) as its sole accent color — the admin panel intentionally stays a practical dark dashboard rather than adopting the cream/olive storefront palette; only the accent color and logo carry the brand through.

**Important:** `packages/ui` is unused dead weight (not imported by either app) — don't add shared tokens there expecting them to apply; each app owns its own `globals.css` independently.

---

## 4. Logo Usage

Two marks, both in `branding/caguei/`:
- **Wordmark** (`Logo_Caguei_Vetorizado.svg` / `cagueilogo.png`) — the "caguei" script, use in headers/footers. Copied to `apps/store/public/brand/logo-wordmark.png` and `apps/admin/public/brand/logo-wordmark.png`.
- **Mark** (`Logo_Premium_Vetorizado.svg` / `premium-logo.png`) — the rounded "C" monogram, used as favicon (`app/icon.png` in both apps) and small-space brand mark (e.g. admin sidebar).

Never render the brand name as plain text (`<span>CAGUEI</span>`) where the real logo asset fits — use `next/image` pointed at `/brand/logo-wordmark.png`.

---

## 5. Spacing & Grid System

Unchanged from the previous system — this was never luxury-specific:

- **Mobile Viewports (under 768px):** Left/Right Margins `24px`, 1-2 columns.
- **Desktop Viewports (over 1024px):** Left/Right Margins `80px`, Gutter `24px`, 12-column grid.
- **Vertical Spacing Rhythm:** Section Gaps `120px`-`160px`, Content Block Gaps `24px`-`48px`, Minor Details `8px`-`16px`.

---

## 6. Micro-Animations

Unchanged — still **Framer Motion**, `cubic-bezier(0.16, 1, 0.3, 1)` easing, `0.25s`-`0.35s` transitions, soft opacity/translate reveals, `1.03x` hover scale on product images.
