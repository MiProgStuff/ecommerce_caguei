import { prisma } from '@caguei/db';

export async function getUserOrdersService(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: { include: { product: true } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
