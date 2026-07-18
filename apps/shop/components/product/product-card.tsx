'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '../../lib/products';
import { useStore } from '../../lib/context/store-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useStore();
  const activeWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col w-full">
      {/* Product Image Container */}
      <Link href={`/shop/${product.slug}`} className="relative aspect-[3/4] mb-6 overflow-hidden bg-surface-container select-none cursor-pointer">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Wishlist Button Overlay */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-background/80 hover:bg-background flex items-center justify-center border border-outline-variant/30 hover:border-primary transition-all duration-300 cursor-pointer"
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
        <span className="font-nav-item text-nav-item text-primary whitespace-nowrap pt-1">
          {product.currency}{product.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
