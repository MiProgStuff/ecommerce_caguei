import { prisma } from '@caguei/db';

export async function getUserCartService(userId: string) {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function addToCartService(userId: string, productId: string, quantity: number, size: string) {
  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId_size: { userId, productId, size } },
  });

  if (existing) {
    return await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
      include: { product: true },
    });
  }

  return await prisma.cartItem.create({
    data: { userId, productId, quantity, size },
    include: { product: true },
  });
}

export async function updateCartItemService(userId: string, itemId: string, quantity: number) {
  const existing = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!existing) {
    return { status: 404, error: 'Cart item not found' };
  }
  if (existing.userId !== userId) {
    return { status: 403, error: 'Forbidden' };
  }

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: true },
  });
  return { status: 200, data: updated };
}

export async function deleteCartItemService(userId: string, itemId: string) {
  const existing = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!existing) {
    return { status: 404, error: 'Cart item not found' };
  }
  if (existing.userId !== userId) {
    return { status: 403, error: 'Forbidden' };
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return { status: 200, message: 'Item removed from cart' };
}

export async function clearCartService(userId: string) {
  await prisma.cartItem.deleteMany({ where: { userId } });
}
