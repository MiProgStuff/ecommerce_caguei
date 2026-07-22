import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../lib/auth';

import webhooksRoutes from './modules/webhooks/webhooks.routes';
import usersRoutes from './modules/users/users.routes';
import addressesRoutes from './modules/addresses/addresses.routes';
import cartRoutes from './modules/cart/cart.routes';
import wishlistRoutes from './modules/wishlist/wishlist.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import productsRoutes from './modules/products/products.routes';
import ordersRoutes from './modules/orders/orders.routes';

const app = express();

// Configure CORS to trust local frontend client cookies
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);

// ─── 1. Stripe Webhook (must use raw body BEFORE express.json()) ─────────────
app.use('/api/webhooks', webhooksRoutes);

// ─── 2. Standard JSON middleware (after webhook route) ───────────────────────
app.use(express.json());

// ─── 3. Auth (BetterAuth Node Handler) ───────────────────────────────────────
app.all('/api/auth/*', toNodeHandler(auth));

// ─── 4. Domain Modules ───────────────────────────────────────────────────────
app.use('/api/users', usersRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

// ─── 5. Health Check ─────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

export default app;
