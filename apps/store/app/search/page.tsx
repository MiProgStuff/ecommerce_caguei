import React from 'react';
import ShopClient from '../shop/shop-client';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage(props: PageProps) {
  const resolvedSearchParams = await props.searchParams;
  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';

  return (
    <ShopClient initialFilters={{ query }} />
  );
}
