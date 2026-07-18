import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '../../../lib/products';
import ProductDetailsClient from './product-details-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage(props: PageProps) {
  const params = await props.params;
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Related products (different products in the same category, or first 2 other products)
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2);

  return (
    <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
  );
}

// Generate static params for dynamic routes to optimize compilation and SEO
export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}
