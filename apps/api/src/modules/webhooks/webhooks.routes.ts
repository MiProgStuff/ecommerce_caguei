import { Router, raw } from 'express';
import { stripeWebhookHandler } from './webhooks.controller';

const router = Router();

// Note: Stripe Webhooks REQUIRE raw body parsing before express.json()
router.post('/stripe', raw({ type: 'application/json' }), stripeWebhookHandler);

export default router;
