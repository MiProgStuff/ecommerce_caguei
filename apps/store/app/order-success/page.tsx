'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Button from '../../components/shared/button';

export default function OrderSuccessPage() {
  // Generate a random mock order number
  const orderNumber = "CAG-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop flex-1 flex flex-col items-center justify-center text-center select-none">
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
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Thank you for your purchase. We have received your order and are preparing it for delivery in our Kyoto atelier.
          </p>
        </div>

        {/* Order Details box */}
        <div className="w-full bg-surface-container-low border border-outline-variant/30 p-6 space-y-4 font-sans text-sm text-left">
          <div className="flex justify-between border-b border-outline-variant/20 pb-3">
            <span className="text-on-surface-variant">Order Number</span>
            <span className="text-primary font-bold">{orderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/20 pb-3">
            <span className="text-on-surface-variant">Estimated Delivery</span>
            <span className="text-primary font-bold">2 - 3 Business Days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Carrier</span>
            <span className="text-primary font-bold">DHL Express (Carbon Neutral)</span>
          </div>
        </div>

        <p className="font-body-md text-xs text-on-surface-variant/70 leading-relaxed">
          A confirmation email with tracking links has been sent to your registered address.
        </p>

        <div className="w-full pt-4">
          <Link href="/shop" passHref>
            <Button variant="primary" fullWidth>
              CONTINUE SHOPPING
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
