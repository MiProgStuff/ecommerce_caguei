'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useStore } from '../../../../lib/context/store-context';
import ProductCard from '../../../../components/product/product-card';
import Button from '../../../../components/shared/button';
import { authClient } from '../../../../lib/auth-client';

export default function AccountWishlistPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { wishlist } = useStore();
  const { data: sessionData, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop text-center select-none">
        <h1 className="font-label-caps text-label-caps text-on-surface-variant animate-pulse">
          LOADING PROFILE...
        </h1>
      </main>
    );
  }

  if (!sessionData) {
    return null;
  }

  const accountTabs = [
    { name: 'PROFILE', href: '/account' },
    { name: 'ORDERS', href: '/account/orders' },
    { name: 'WISHLIST', href: '/account/wishlist' },
  ];

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop select-none">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-unit-sm mb-12">
        <h1 className="font-display-xl text-4xl md:text-headline-lg uppercase text-primary">MY ACCOUNT</h1>
      </div>

      {/* Account Tabs */}
      <div className="flex space-x-8 border-b border-outline-variant/20 pb-4 mb-12 font-label-caps text-label-caps">
        {accountTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`transition-colors cursor-pointer border-b-2 pb-2 -mb-[18px] ${
                isActive ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Wishlist Grid */}
      <div className="space-y-6">
        <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/20 pb-4">
          SAVED ITEMS
        </h2>

        {wishlist.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
            <Heart size={40} className="text-on-surface-variant/40" />
            <h3 className="font-headline-md text-xl text-primary">Your wishlist is currently empty.</h3>
            <p className="font-body-md text-on-surface-variant max-w-xs">
              Save pieces you love here to view and add to your bag later.
            </p>
            <Link href="/shop" passHref className="pt-4">
              <Button variant="primary">BROWSE PRODUCTS</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-gutter gap-y-unit-xl">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
