'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, fetchOrders } from '../../../../lib/api';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  product: { name: string; images: string[] };
}

interface Order {
  id: string;
  status: string;
  stripePaymentIntentId?: string;
  grandTotal: number;
  subtotal: number;
  shippingCost: number;
  estimatedTax: number;
  createdAt: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  orderItems: OrderItem[];
}

const statusStyles: Record<string, string> = {
  PAID: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  PROCESSING: 'text-amber-700 bg-amber-50 border-amber-200',
  COMPLETED: 'text-blue-700 bg-blue-50 border-blue-200',
  CANCELLED: 'text-red-700 bg-red-50 border-red-200',
  PENDING: 'text-on-surface-variant bg-surface-container border-outline-variant/30',
};

export default function AccountOrdersPage() {
  const pathname = usePathname();
  const { data: sessionData, isPending } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionData?.user) {
      fetchOrders()
        .then((data) => setOrders(data))
        .finally(() => setLoading(false));
    } else if (!isPending) {
      setLoading(false);
    }
  }, [sessionData, isPending]);

  const accountTabs = [
    { name: 'PROFILE', href: '/account' },
    { name: 'ORDERS', href: '/account/orders' },
    { name: 'WISHLIST', href: '/account/wishlist' },
  ];

  if (isPending) {
    return (
      <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop text-center select-none">
        <h1 className="font-label-caps text-label-caps text-on-surface-variant animate-pulse">LOADING PROFILE...</h1>
      </main>
    );
  }

  if (!sessionData) return null;

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

      {/* Orders */}
      <div className="space-y-6">
        <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/20 pb-4">
          ORDER LEDGER
        </h2>

        {loading ? (
          <p className="font-body-md text-on-surface-variant py-8 animate-pulse">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center space-y-4">
            <p className="font-body-md text-on-surface-variant">You have not placed any orders yet.</p>
            <Link href="/shop" className="inline-block font-label-caps text-[10px] uppercase tracking-widest text-primary border border-primary px-6 py-3 hover:bg-primary hover:text-on-primary transition-colors">
              SHOP ALL PIECES
            </Link>
          </div>
        ) : (
          <div className="border border-outline-variant/30 bg-surface-container-lowest divide-y divide-outline-variant/30">
            {/* Headers row */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-surface-container-low font-label-caps text-[9px] text-on-surface-variant tracking-widest">
              <span className="col-span-3">REFERENCE</span>
              <span className="col-span-2">DATE</span>
              <span className="col-span-2">STATUS</span>
              <span className="col-span-3">DELIVERY TO</span>
              <span className="col-span-2 text-right">TOTAL</span>
            </div>

            {orders.map((order) => {
              const isExpanded = expandedId === order.id;
              const ref = order.stripePaymentIntentId
                ? `CAG-${order.stripePaymentIntentId.slice(-8).toUpperCase()}`
                : `CAG-${order.id.slice(0, 8).toUpperCase()}`;
              const statusStyle = statusStyles[order.status] || statusStyles.PENDING;

              return (
                <div key={order.id}>
                  {/* Row */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-5 items-center font-sans text-sm text-on-surface-variant hover:bg-surface-container-low/40 transition-colors text-left"
                  >
                    <div className="col-span-3">
                      <span className="sm:hidden font-label-caps text-[9px] text-primary block mb-1">REFERENCE</span>
                      <span className="text-primary font-bold font-mono text-xs">{ref}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="sm:hidden font-label-caps text-[9px] text-primary block mb-1">DATE</span>
                      <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="sm:hidden font-label-caps text-[9px] text-primary block mb-1">STATUS</span>
                      <span className={`font-label-caps text-[9px] px-2 py-1 border ${statusStyle}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <span className="sm:hidden font-label-caps text-[9px] text-primary block mb-1">DELIVERY TO</span>
                      <span className="truncate">{order.address?.city}, {order.address?.country}</span>
                    </div>
                    <div className="col-span-2 sm:text-right font-bold text-primary">
                      <span className="sm:hidden font-label-caps text-[9px] text-primary block mb-1">TOTAL</span>
                      ${order.grandTotal.toFixed(2)}
                    </div>
                  </button>

                  {/* Expanded items */}
                  {isExpanded && (
                    <div className="px-6 pb-6 bg-surface-container-lowest border-t border-outline-variant/20 space-y-3">
                      <p className="font-label-caps text-[9px] text-on-surface-variant pt-4 uppercase tracking-widest">Items in this order</p>
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-3 border-b border-outline-variant/10 last:border-0">
                          {item.product?.images?.[0] && (
                            <div className="w-12 aspect-[3/4] bg-surface-container shrink-0">
                              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 text-sm">
                            <p className="text-primary font-sans">{item.product?.name || item.productId}</p>
                            <p className="font-label-caps text-[9px] text-on-surface-variant mt-0.5">
                              SIZE: {item.size} / QTY: {item.quantity}
                            </p>
                          </div>
                          <span className="text-primary font-bold text-xs">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-2 space-y-1 text-xs text-on-surface-variant font-sans">
                        <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>${order.estimatedTax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-primary border-t border-outline-variant/20 pt-1 mt-1">
                          <span>Total</span><span>${order.grandTotal.toFixed(2)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant/60 font-sans">
                        Delivered to: {order.address?.street}, {order.address?.city}, {order.address?.country}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
