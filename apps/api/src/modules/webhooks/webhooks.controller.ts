import { Request, Response } from 'express';
import { processStripeWebhookService } from './webhooks.service';

export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: 'Missing Stripe signature or webhook secret' });
  }

  const result = await processStripeWebhookService(req.body, sig, webhookSecret);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.json({ received: true });
}
