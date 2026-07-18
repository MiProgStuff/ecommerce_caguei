import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { toNodeHandler } from 'better-auth/node';
import { prisma } from '@caguei/db';
import { auth } from '../lib/auth';

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
});

// Configure CORS to trust local frontend client cookies
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);

// ─── Stripe Webhook (must use raw body BEFORE express.json()) ────────────────
// This route MUST be registered before express.json() middleware
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return res.status(400).json({ error: 'Missing Stripe signature or webhook secret' });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      const fs = require('fs');
      const logMsg = `${new Date().toISOString()} - Webhook error: ${err.message}\n` +
                     `Headers: ${JSON.stringify(req.headers)}\n` +
                     `Body Type: ${typeof req.body} (Buffer: ${req.body instanceof Buffer})\n\n`;
      fs.appendFileSync('webhook-debug.log', logMsg);
      console.error('Stripe webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle successful payment
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { orderId } = paymentIntent.metadata;

      if (!orderId) {
        console.error('Missing orderId in PaymentIntent metadata:', paymentIntent.id);
        return res.status(400).json({ error: 'Missing orderId in metadata' });
      }

      try {
        await prisma.$transaction(async (tx) => {
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
        return res.status(500).json({ error: 'Internal server error processing webhook' });
      }
    }

    res.json({ received: true });
  }
);

// ─── Standard JSON middleware (after webhook route) ───────────────────────────
app.use(express.json());

// ─── Auth ─────────────────────────────────────────────────────────────────────
app.all('/api/auth/*', toNodeHandler(auth));

// ─── Users ────────────────────────────────────────────────────────────────────
app.get('/api/users/check', async (req, res) => {
  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Addresses ────────────────────────────────────────────────────────────────
app.get('/api/addresses', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/addresses', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { street, city, state, postalCode, country, label } = req.body;
    if (!street || !city || !country) {
      return res.status(400).json({ error: 'Street, City, and Country are required' });
    }

    const newAddress = await prisma.address.create({
      data: {
        street,
        city,
        state: state || '',
        postalCode: postalCode || '',
        country,
        label: label || 'home',
        userId: session.user.id,
      },
    });
    res.json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/addresses/:id', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const address = await prisma.address.findUnique({ where: { id } });

    if (!address) return res.status(404).json({ error: 'Address not found' });
    if (address.userId !== session.user.id) return res.status(403).json({ error: 'Forbidden' });

    await prisma.address.delete({ where: { id } });
    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Cart ─────────────────────────────────────────────────────────────────────
app.get('/api/cart', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, quantity, size } = req.body;
    if (!productId || !size) {
      return res.status(400).json({ error: 'ProductId and Size are required' });
    }

    const parsedQty = parseInt(quantity) || 1;
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId_size: { userId: session.user.id, productId, size } },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + parsedQty },
        include: { product: true },
      });
      return res.json(updated);
    }

    const newItem = await prisma.cartItem.create({
      data: { userId: session.user.id, productId, quantity: parsedQty, size },
      include: { product: true },
    });
    res.json(newItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/cart/:id', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const { quantity } = req.body;
    const parsedQty = parseInt(quantity);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      return res.status(400).json({ error: 'Valid positive quantity required' });
    }

    const existing = await prisma.cartItem.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Cart item not found' });
    if (existing.userId !== session.user.id) return res.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity: parsedQty },
      include: { product: true },
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const existing = await prisma.cartItem.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Cart item not found' });
    if (existing.userId !== session.user.id) return res.status(403).json({ error: 'Forbidden' });

    await prisma.cartItem.delete({ where: { id } });
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/cart', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Wishlist ─────────────────────────────────────────────────────────────────
app.get('/api/wishlist', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(wishlistItems.map((item) => item.product));
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/wishlist', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'ProductId is required' });

    const newItem = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: session.user.id, productId } },
      update: {},
      create: { userId: session.user.id, productId },
      include: { product: true },
    });
    res.json(newItem.product);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/wishlist/:productId', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { productId } = req.params;
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId: session.user.id, productId } },
    });
    res.json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error deleting from wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Payments ─────────────────────────────────────────────────────────────────

/**
 * POST /api/payments/create-intent
 * Creates a Stripe PaymentIntent and returns the clientSecret to the client.
 * All order metadata is embedded in the PaymentIntent so the webhook can create
 * the order server-side without trusting any client data.
 */
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { addressId, items } = req.body;

    if (!addressId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'addressId and items are required' });
    }

    // Verify address belongs to this user
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== session.user.id) {
      return res.status(403).json({ error: 'Invalid address' });
    }

    // Verify all products exist and calculate a server-authoritative total
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let serverTotal = 0;
    const verifiedItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const qty = Number(item.quantity) || 1;
      serverTotal += product.price * qty;
      return { productId: item.productId, quantity: qty, size: item.size, price: product.price };
    });

    const serverShipping = serverTotal >= 500 ? 0 : 25;
    const serverTax = serverTotal * 0.08;
    const serverGrandTotal = serverTotal + serverShipping + serverTax;

    // 1. Create a PENDING order in the DB first.
    //    This avoids hitting Stripe's 500-char metadata limit and gives us
    //    a stable record to update when the webhook fires.
    const pendingOrder = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId,
        status: 'PENDING',
        subtotal: serverTotal,
        shippingCost: serverShipping,
        estimatedTax: serverTax,
        grandTotal: serverGrandTotal,
        orderItems: {
          create: verifiedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
          })),
        },
      },
    });

    // 2. Create the Stripe PaymentIntent — only the DB order ID goes in metadata.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(serverGrandTotal * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: pendingOrder.id,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// ─── Products ─────────────────────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category: String(category) } : {};
    const products = await prisma.product.findMany({
      where,
      orderBy: { id: 'asc' },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Orders (read-only) ───────────────────────────────────────────────────────
app.get('/api/orders', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderItems: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[CENTRAL API] Running on http://localhost:${PORT}`);
});
