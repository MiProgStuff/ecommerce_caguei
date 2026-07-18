# Design System Guidelines

This document details the visual rules, typography rules, layout tokens, and UI guidelines for the Caguei storefront and admin applications.

---

## 1. Core Principles

- **Avant-Garde Luxury Aesthetic:** High contrast, minimal structures, generous spacing, and fine Editorial layout.
- **Strict Square Borders:** Under no circumstances should rounded corners (`border-radius`, `rounded-*`) be applied to inputs, buttons, containers, images, or overlay elements. All borders must be exactly `0px` (square).
- **Asymmetric Rhythm:** Editorial image compositions and asymmetrical grids emphasize styling over generic patterns.

---

## 2. Typography

We use two primary typefaces:
- **Serif (Editorial Titles):** `Bodoni Moda` (for main headers, collections list titles, price tags).
- **Sans-serif (UI/Body/Labels):** `Hanken Grotesk` (for navigation menu items, product grid options, inputs, descriptions).

### Typographic Hierarchy
- **Main Heading:** Bodoni Moda, bold, size `3xl` to `5xl`, tracking tight.
- **Subheadings:** Bodoni Moda, regular, size `xl` to `2xl`.
- **Primary Labels / Buttons:** Hanken Grotesk, semi-bold, uppercase, tracking wide (1px to 2px).
- **Body Text:** Hanken Grotesk, light/regular, size `sm` to `base`, leading relaxed.

---

## 3. Color Palette

Our palette is built on rich neutrals, high-contrast values, and muted backgrounds:

| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| **Black (Primary)** | `#000000` | Primary text, main button fills, high-contrast borders |
| **White** | `#FFFFFF` | Background fills, card surfaces |
| **Alabaster (Warm White)**| `#FBFBFA` | Alternate block section backgrounds |
| **On-Surface Variant** | `#70706B` | Secondary labels, size guides, descriptions |
| **Outline-Variant** | `#E5E5E2` | Thin divider borders, inactive line guides |
| **Error Accent** | `#B3261E` | Validation failures, error state badges |

---

## 4. Spacing & Grid System

We implement a highly structured responsive grid layout:

- **Mobile Viewports (under 768px):**
  - Left/Right Margins: `24px`
  - Columns: `1` or `2`
- **Desktop Viewports (over 1024px):**
  - Left/Right Margins: `80px`
  - Gutter: `24px`
  - Grid: `12-column` layout
- **Vertical Spacing Rhythm:**
  - Section Gaps: `120px` to `160px`
  - Content Block Gaps: `24px` to `48px`
  - Minor Details: `8px` to `16px`

---

## 5. Micro-Animations

We use **Framer Motion** to add subtle transitions that make the page feel responsive and polished:
- **Hover Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Out-Expo)
- **Standard Transition Duration:** `0.25s` to `0.35s`
- **Fade Reveals:** Page views and drawer transitions should use soft opacity translations rather than abrupt slide-ins.
- **Micro-scale Interactions:** Images inside product grids can scale slightly (e.g., `1.03x` zoom) on pointer hover to signal interactivity.
