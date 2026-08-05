'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product, getPromoDisplay } from '../../lib/products';
import { useStore } from '../../lib/context/store-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useStore();
  const activeWishlist = isInWishlist(product.id);
  const promo = getPromoDisplay(product);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col w-full">
      {/* Product Image Container */}
      <Link href={`/shop/${product.slug}`} className="relative aspect-[3/4] mb-6 overflow-hidden bg-surface-container select-none cursor-pointer rounded-lg">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Discount Badge */}
        {promo.active && promo.label && (
          <span className="absolute top-4 left-4 z-10 bg-primary text-on-primary font-nav-item text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide">
            {promo.label}
          </span>
        )}

        {/* Wishlist Button Overlay */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/80 hover:bg-background flex items-center justify-center border border-outline-variant/30 hover:border-primary transition-all duration-300 cursor-pointer"
          aria-label={activeWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={`transition-colors duration-300 ${
              activeWishlist ? 'fill-primary text-primary' : 'text-on-surface-variant group-hover/btn:text-primary'
            }`}
          />
        </button>
      </Link>

      {/* Product Details info */}
      <div className="flex justify-between items-start font-sans">
        <div className="space-y-1 pr-4">
          <h4 className="font-headline-md text-lg md:text-xl leading-snug tracking-tight text-primary">
            <Link href={`/shop/${product.slug}`} className="hover:opacity-75 transition-opacity">
              {product.name}
            </Link>
          </h4>
          <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">
            {product.color} / {product.material.split(' ')[0]}
          </p>
        </div>
        <span className="font-nav-item text-nav-item whitespace-nowrap pt-1 flex items-baseline gap-1.5">
          {promo.active ? (
            <>
              <span className="text-on-surface-variant line-through text-[13px]">
                {product.currency}{promo.original!.toFixed(2)}
              </span>
              <span className="text-primary font-bold">
                {product.currency}{promo.current.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-primary">
              {product.currency}{product.price.toFixed(2)}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
