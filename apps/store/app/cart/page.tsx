'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useStore } from '../../lib/context/store-context';
import Button from '../../components/shared/button';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useStore();

  const totalItems = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  const subtotal = cart.reduce((sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0), 0);
  const currency = cart.length > 0 ? cart[0].product.currency : '$';

  // Free shipping above $500 or €500
  const shippingCost = subtotal >= 500 ? 0 : 25;
  const estimatedTax = subtotal * 0.08;
  const grandTotal = subtotal + shippingCost + estimatedTax;

  const handleCheckoutRedirect = () => {
    router.push('/checkout');
  };

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop min-h-[60vh] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="border-b border-outline-variant/30 pb-unit-sm mb-unit-xl select-none">
          <h1 className="font-display-xl text-4xl md:text-headline-lg uppercase text-primary">SHOPPING BAG</h1>
          <p className="font-body-md text-on-surface-variant mt-2">
            Review your selections before completing checkout.
          </p>
        </div>

        {/* Content Split */}
        {cart.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 select-none">
            <ShoppingBag size={48} strokeWidth={1} className="text-on-surface-variant/40" />
            <h2 className="font-headline-md text-xl text-primary">Your bag is currently empty.</h2>
            <p className="font-body-md text-on-surface-variant max-w-xs">
              Explore the latest collections to add pieces to your wardrobe.
            </p>
            <Link href="/shop" passHref className="pt-4">
              <Button variant="primary">SHOP ALL PIECES</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            
            {/* Left Column: Items */}
            <div className="lg:col-span-8 divide-y divide-outline-variant/30">
              {cart.filter(item => item && item.product).map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="py-8 flex flex-col sm:flex-row gap-6 first:pt-0"
                >
                  {/* Image */}
                  <Link href={`/shop/${item.product.slug}`} className="w-full sm:w-32 aspect-[3/4] bg-surface-container overflow-hidden shrink-0 select-none cursor-pointer">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1 select-none">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-headline-md text-xl md:text-2xl text-primary">
                            <Link href={`/shop/${item.product.slug}`} className="hover:opacity-75 transition-opacity">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mt-1.5">
                            SIZE: {item.selectedSize} / COLOR: {item.product.color}
                          </p>
                        </div>
                        <span className="font-headline-md text-lg text-primary">
                          {currency}{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="font-body-md text-sm text-on-surface-variant max-w-md line-clamp-2">
                        {item.product.description}
                      </p>
                    </div>

                    {/* Actions Row */}
                    <div className="flex justify-between items-center mt-8">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-outline-variant/60 font-sans">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-surface-container transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-label-caps text-sm px-4">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-surface-container transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="flex items-center gap-1.5 font-label-caps text-[10px] text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} /> REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-6 flex justify-between select-none">
                <Link href="/shop" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors underline">
                  CONTINUE SHOPPING
                </Link>
                <button
                  onClick={clearCart}
                  className="font-label-caps text-[10px] text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                >
                  CLEAR ALL ITEMS
                </button>
              </div>
            </div>

            {/* Right Column: Summary Panel */}
            <aside className="lg:col-span-4 bg-surface-container-low p-8 border border-outline-variant/30 select-none space-y-6 mt-12 lg:mt-0">
              <h3 className="font-label-caps text-label-caps text-primary pb-2 border-b border-outline-variant/30">
                ORDER SUMMARY
              </h3>
              
              <div className="space-y-4 font-sans text-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-primary">{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-primary">
                    {shippingCost === 0 ? 'FREE' : `${currency}${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-primary">{currency}{estimatedTax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-4 flex justify-between items-baseline select-none">
                <span className="font-label-caps text-label-caps text-primary">TOTAL</span>
                <span className="font-headline-md text-2xl text-primary">
                  {currency}{grandTotal.toFixed(2)}
                </span>
              </div>

              <div className="pt-4">
                <Button variant="primary" fullWidth onClick={handleCheckoutRedirect}>
                  PROCEED TO CHECKOUT
                </Button>
              </div>

              <p className="font-body-md text-[10px] text-on-surface-variant/60 leading-relaxed text-center">
                We accept major Credit Cards, Apple Pay, and bank transfers. Shipping is carbon neutral.
              </p>
            </aside>

          </div>
        )}
      </div>
    </main>
  );
}
