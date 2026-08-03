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
import analyticsRoutes from './modules/analytics/analytics.routes';
import uploadRoutes from './modules/upload/upload.routes';

const app = express();

// TEMP DEBUG LOGGER — remove after diagnosing admin OTP login issue.
app.use((req, _res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.originalUrl} origin=${req.headers.origin ?? 'none'}`);
  next();
});

// Configure CORS to trust local frontend client cookies, plus the
// cagueistudio.com production domain and any subdomain of it (admin, api, etc.)
// once deployed — prepared now, not yet wired to real DNS/SSL.
const PRODUCTION_DOMAIN = 'cagueistudio.com';
const isAllowedOrigin = (origin: string) => {
  if (origin === 'http://localhost:3000' || origin === 'http://localhost:3001') return true;
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== 'https:') return false;
    return hostname === PRODUCTION_DOMAIN || hostname.endsWith(`.${PRODUCTION_DOMAIN}`);
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
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
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// ─── 5. Health Check ─────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

export default app;
