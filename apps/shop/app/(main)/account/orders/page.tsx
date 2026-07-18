'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '../../../../lib/auth-client';

interface Order {
  id: string;
  date: string;
  status: 'DELIVERED' | 'IN TRANSIT' | 'PROCESSING';
  total: number;
  currency: string;
  items: string;
}

const ORDERS: Order[] = [
  {
    id: 'CAG-810238',
    date: 'June 15, 2026',
    status: 'DELIVERED',
    total: 840.00,
    currency: '$',
    items: 'Archive Overcoat (Charcoal / M)',
  },
  {
    id: 'CAG-749210',
    date: 'March 02, 2026',
    status: 'DELIVERED',
    total: 420.00,
    currency: '$',
    items: 'Structural Parka 01 (Matte Black / S)',
  },
];

export default function AccountOrdersPage() {
  const pathname = usePathname();
  const router = useRouter();
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

      {/* Orders List */}
      <div className="space-y-6">
        <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/20 pb-4">
          ORDER LEDGER
        </h2>

        {ORDERS.length === 0 ? (
          <p className="font-body-md text-on-surface-variant py-8">
            You have not placed any orders yet.
          </p>
        ) : (
          <div className="border border-outline-variant/30 bg-surface-container-lowest divide-y divide-outline-variant/30">
            {/* Headers row */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-8 py-4 bg-surface-container-low font-label-caps text-[10px] text-on-surface-variant">
              <span className="col-span-2">ORDER ID</span>
              <span className="col-span-2">DATE</span>
              <span className="col-span-2">STATUS</span>
              <span className="col-span-4">ITEMS</span>
              <span className="col-span-2 text-right">TOTAL</span>
            </div>

            {/* List Rows */}
            {ORDERS.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-8 py-6 items-center font-sans text-sm text-on-surface-variant hover:bg-surface-container-low/30 transition-colors"
              >
                <div className="col-span-2 flex flex-col justify-center sm:justify-start">
                  <span className="sm:hidden font-label-caps text-[9px] text-primary block mb-1">ORDER ID</span>
                  <span className="text-primary font-bold">{order.id}</span>
                </div>
                <div className="col-span-2">
                  <span className="sm:hidden font-label-caps text-[9px] text-primary block mb-1">DATE</span>
                  <span>{order.date}</span>
                </div>
                <div className="col-span-2">
                  <span className="sm:hidden font-label-caps text-[9px] text-primary block mb-1">STATUS</span>
                  <span className={`font-label-caps text-[10px] px-2 py-1 bg-surface-container-high text-primary font-bold`}>
                    {order.status}
                  </span>
                </div>
                <div className="col-span-4">
                  <span className="sm:hidden font-label-caps text-[9px] text-primary block mb-1">ITEMS</span>
                  <span>{order.items}</span>
                </div>
                <div className="col-span-2 sm:text-right font-headline-md text-base text-primary">
                  <span className="sm:hidden font-label-caps text-[9px] text-primary block mb-1">TOTAL</span>
                  {order.currency}{order.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
