import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../lib/auth';

const app = express();

// Configure CORS to trust local frontend client cookies
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);

app.use(express.json());

// Catch-all auth endpoint mapping BetterAuth handlers
app.all('/api/auth/*', toNodeHandler(auth));

// Simple check-alive ping
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[CENTRAL API] Running on http://localhost:${PORT}`);
});
