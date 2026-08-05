import { prisma } from '@caguei/db';
import { stripe } from '../../lib/stripe';
import { resolveProductPricing } from '../../lib/pricing';

export interface CreatePaymentIntentItemDTO {
  productId: string;
  quantity: number;
  size: string;
}

export async function createPaymentIntentService(
  userId: string,
  addressId: string,
  items: CreatePaymentIntentItemDTO[]
) {
  // 1. Verify address belongs to this user
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) {
    return { status: 403, error: 'Invalid address' };
  }

  // 2. Verify all products exist and calculate a server-authoritative total
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  let serverTotal = 0;
  const verifiedItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    const qty = Number(item.quantity) || 1;
    // Always charge the current price — manual promo or, when the automatic
    // discount engine is on for this product, the current tier price — never
    // a client-supplied value. This is the server-authoritative total the
    // PaymentIntent is created from.
    const pricing = resolveProductPricing(product);
    const effectivePrice =
      pricing.isPromoActive && pricing.promoPrice != null ? pricing.promoPrice : pricing.price;
    serverTotal += effectivePrice * qty;
    return { productId: item.productId, quantity: qty, size: item.size, price: effectivePrice };
  });

  const serverShipping = serverTotal >= 500 ? 0 : 25;
  const serverTax = serverTotal * 0.08;
  const serverGrandTotal = serverTotal + serverShipping + serverTax;

  // 3. Create a PENDING order in the DB first
  const pendingOrder = await prisma.order.create({
    data: {
      userId,
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

  // 4. Create the Stripe PaymentIntent with metadata holding orderId
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(serverGrandTotal * 100),
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: {
      orderId: pendingOrder.id,
    },
  });

  return {
    status: 200,
    data: {
      clientSecret: paymentIntent.client_secret,
      orderId: pendingOrder.id,
    },
  };
}
