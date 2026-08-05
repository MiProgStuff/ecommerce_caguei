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

export async function getAllOrdersService(options?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (options?.status) {
    where.status = options.status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        orderItems: { include: { product: true } },
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getOrderByIdService(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: { include: { product: true } },
      address: true,
      user: { select: { id: true, name: true, email: true, phoneNumber: true } },
    },
  });
}

export async function fulfillOrderService(id: string, carrier: string, trackingCode: string) {
  return await prisma.order.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      carrier,
      trackingCode,
    },
  });
}

export async function cancelOrderService(id: string) {
  return await prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
}
