import { prisma } from '@caguei/db';

export async function getAnalyticsOverviewService() {
  const [totalRevenueResult, totalOrders, totalProducts, paidOrdersCount] = await Promise.all([
    prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { grandTotal: true },
      _avg: { grandTotal: true },
    }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PAID' } }),
  ]);

  const totalRevenue = totalRevenueResult._sum.grandTotal || 0;
  const averageOrderValue = totalRevenueResult._avg.grandTotal || 0;

  // Recent revenue timeline (grouped by month/day)
  const recentOrders = await prisma.order.findMany({
    where: { status: 'PAID' },
    select: { grandTotal: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    paidOrdersCount,
    averageOrderValue,
    recentOrders,
  };
}
