import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '../../../lib/prisma';
import ProductDetailsClient from './product-details-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const serializeProduct = (p: any) => ({
  ...p,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
});

export default async function ProductDetailsPage(props: PageProps) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    notFound();
  }

  // Related products
  const relatedProducts = await prisma.product.findMany({
    where: { NOT: { id: product.id } },
    take: 2,
  });

  return (
    <ProductDetailsClient
      product={serializeProduct(product) as any}
      relatedProducts={relatedProducts.map(serializeProduct) as any}
    />
  );
}

export const dynamic = 'force-dynamic';
