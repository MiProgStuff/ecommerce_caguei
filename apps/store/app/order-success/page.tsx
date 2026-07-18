'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import Button from '../../components/shared/button';
import { useStore } from '../../lib/context/store-context';

// Inner component that uses useSearchParams — must be wrapped in <Suspense>
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useStore();

  const paymentIntentId = searchParams.get('payment_intent');
  const orderRef = paymentIntentId
    ? `CAG-${paymentIntentId.slice(-8).toUpperCase()}`
    : `CAG-${Math.floor(100000 + Math.random() * 900000)}`;

  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // Clear React state cart — DB cart is cleared by the Stripe webhook
    clearCart();
    const status = searchParams.get('redirect_status');
    if (status === 'processing') {
      setStatusMessage("Your payment is still being processed. We'll notify you when it's confirmed.");
    } else if (status && status !== 'succeeded') {
      setStatusMessage('Payment status: ' + status);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-md w-full space-y-8 flex flex-col items-center">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-primary text-on-primary flex items-center justify-center rounded-full">
        <Check size={28} className="text-white" />
      </div>

      <div className="space-y-4">
        <span className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em]">
          TRANSACTION COMPLETED
        </span>
        <h1 className="font-display-xl text-4xl md:text-5xl uppercase text-primary">
          ORDER CONFIRMED
        </h1>
        {statusMessage ? (
          <p className="font-body-md text-on-surface-variant leading-relaxed">{statusMessage}</p>
        ) : (
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Thank you for your purchase. We have received your order and are preparing it for
            delivery in our Kyoto atelier.
          </p>
        )}
      </div>

      {/* Order Details box */}
      <div className="w-full bg-surface-container-low border border-outline-variant/30 p-6 space-y-4 font-sans text-sm text-left">
        <div className="flex justify-between border-b border-outline-variant/20 pb-3">
          <span className="text-on-surface-variant">Order Reference</span>
          <span className="text-primary font-bold font-mono">{orderRef}</span>
        </div>
        <div className="flex justify-between border-b border-outline-variant/20 pb-3">
          <span className="text-on-surface-variant">Estimated Delivery</span>
          <span className="text-primary font-bold">2 – 3 Business Days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Carrier</span>
          <span className="text-primary font-bold">DHL Express (Carbon Neutral)</span>
        </div>
      </div>

      <p className="font-body-md text-xs text-on-surface-variant/70 leading-relaxed">
        A confirmation email with tracking links has been sent to your registered address.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
        <Link href="/account/orders" passHref className="flex-1">
          <Button variant="secondary" fullWidth>
            VIEW MY ORDERS
          </Button>
        </Link>
        <Link href="/shop" passHref className="flex-1">
          <Button variant="primary" fullWidth>
            CONTINUE SHOPPING
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop flex-1 flex flex-col items-center justify-center text-center select-none">
      <Suspense fallback={
        <div className="max-w-md w-full space-y-4 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full animate-pulse" />
          <div className="h-4 w-48 bg-surface-container rounded animate-pulse" />
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}
