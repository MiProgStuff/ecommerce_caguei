import Stripe from 'stripe';
import { prisma } from '@caguei/db';
import { stripe } from '../../lib/stripe';
import * as fs from 'fs';

export async function processStripeWebhookService(rawBody: any, signature: string, webhookSecret: string) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    const logMsg =
      `${new Date().toISOString()} - Webhook error: ${err.message}\n` +
      `Headers signature present: ${!!signature}\n` +
      `Body Type: ${typeof rawBody} (Buffer: ${rawBody instanceof Buffer})\n\n`;
    fs.appendFileSync('webhook-debug.log', logMsg);
    console.error('Stripe webhook signature verification failed:', err.message);
    return { status: 400, error: `Webhook Error: ${err.message}` };
  }

  // Handle successful payment
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { orderId } = paymentIntent.metadata;

    if (!orderId) {
      console.error('Missing orderId in PaymentIntent metadata:', paymentIntent.id);
      return { status: 400, error: 'Missing orderId in metadata' };
    }

    try {
      await prisma.$transaction(async (tx: any) => {
        // Idempotency: only update if still PENDING
        const order = await tx.order.findUnique({ where: { id: orderId } });

        if (!order) {
          console.error(`Order ${orderId} not found for PaymentIntent ${paymentIntent.id}`);
          return;
        }

        if (order.status === 'PAID') {
          console.log(`Order ${orderId} already PAID, skipping.`);
          return;
        }

        // Mark the order as PAID and store the PaymentIntent ID
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            stripePaymentIntentId: paymentIntent.id,
          },
        });

        // Clear the user's DB cart
        await tx.cartItem.deleteMany({ where: { userId: order.userId } });
      });

      console.log(`[Stripe Webhook] Order ${orderId} marked as PAID (pi: ${paymentIntent.id})`);
    } catch (err) {
      console.error('Error processing payment_intent.succeeded webhook:', err);
      return { status: 500, error: 'Internal server error processing webhook' };
    }
  }

  return { status: 200, received: true };
}
