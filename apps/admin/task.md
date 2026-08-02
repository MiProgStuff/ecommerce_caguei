# Task List: CRUD Subpages & Order Dispatch Implementation

- [x] **1. Extend Express API Orders Module (`apps/api`)**
  - [x] Implement `getAllOrdersService`, `getOrderByIdService`, and `fulfillOrderService` in `orders.service.ts`
  - [x] Update `getOrdersHandler`, implement `getOrderByIdHandler` and `fulfillOrderHandler` in `orders.controller.ts`
  - [x] Register new routes in `orders.routes.ts`
  - [x] Test API compilation and startup

- [x] **2. Create Product Form & CRUD Pages (`apps/admin`)**
  - [x] Build reusable `ProductForm.tsx` feature component with `react-hook-form` + `@caguei/validations` schema
  - [x] Create `app/(main)/products/new/page.tsx` (product creation)
  - [x] Create `app/(main)/products/[id]/page.tsx` (product edit)
  - [x] Connect new pages to sidebar navigation and list view page

- [x] **3. Create Order Detail & Fulfillment interface (`apps/admin`)**
  - [x] Build `OrderDetailPage.tsx` feature component displaying full order logs and a fulfillment update panel
  - [x] Create `app/(main)/orders/[id]/page.tsx` capturing route params and rendering details

- [x] **4. Build & Typecheck Verification**
  - [x] Run `pnpm check-types` across all monorepo scopes
  - [x] Build Next.js administrative client with `pnpm --filter admin run build`
