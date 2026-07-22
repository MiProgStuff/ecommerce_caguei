import { prisma } from '@caguei/db';

export async function getProductsService(category?: string) {
  const where = category ? { category: String(category) } : {};
  return await prisma.product.findMany({
    where,
    orderBy: { id: 'asc' },
  });
}

export async function getProductBySlugService(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
  });
}
