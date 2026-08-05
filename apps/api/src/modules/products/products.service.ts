import { prisma } from '@caguei/db';
import { ProductInput } from '@caguei/validations';

export async function getProductsService(options?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (options?.category) {
    where.category = options.category;
  }
  if (options?.search) {
    where.OR = [
      { name: { contains: options.search, mode: 'insensitive' } },
      { slug: { contains: options.search, mode: 'insensitive' } },
      { color: { contains: options.search, mode: 'insensitive' } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlugService(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
  });
}

export async function getProductByIdService(id: string) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

export async function createProductService(data: ProductInput) {
  const id = data.id || `prod_${Date.now()}`;
  return await prisma.product.create({
    data: {
      id,
      name: data.name,
      slug: data.slug,
      category: data.category,
      price: data.price,
      currency: data.currency || 'EUR',
      color: data.color,
      material: data.material,
      description: data.description,
      images: data.images,
      details: data.details,
      fabricCare: data.fabricCare,
      shipping: data.shipping,
      sizes: data.sizes,
      stock: data.stock,
      costPrice: data.costPrice,
      originalPrice: data.originalPrice,
      promoPrice: data.promoPrice,
      discountLabel: data.discountLabel,
      isPromoActive: data.isPromoActive,
    },
  });
}

export async function updateProductService(id: string, data: Partial<ProductInput>) {
  return await prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProductService(id: string) {
  return await prisma.product.delete({
    where: { id },
  });
}
