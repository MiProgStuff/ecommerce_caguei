import React from 'react';
import ShopClient from './shop-client';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage(props: PageProps) {
  const resolvedSearchParams = await props.searchParams;
  
  return (
    <ShopClient initialFilters={{
      category: typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined,
      collection: typeof resolvedSearchParams.collection === 'string' ? resolvedSearchParams.collection : undefined,
      query: typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : undefined,
      q: typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined,
    }} />
  );
}
