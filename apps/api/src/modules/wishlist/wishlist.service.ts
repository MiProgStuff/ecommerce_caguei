import { prisma } from '@caguei/db';

export async function getUserWishlistService(userId: string) {
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
  return wishlistItems.map((item) => item.product);
}

export async function addToWishlistService(userId: string, productId: string) {
  const newItem = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
    include: { product: true },
  });
  return newItem.product;
}

export async function removeFromWishlistService(userId: string, productId: string) {
  await prisma.wishlistItem.delete({
    where: { userId_productId: { userId, productId } },
  });
}
