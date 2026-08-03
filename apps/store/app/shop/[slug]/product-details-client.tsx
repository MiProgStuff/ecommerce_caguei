'use client';

import React, { useState } from 'react';
import { ChevronDown, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../../lib/products';
import { useStore } from '../../../lib/context/store-context';
import ProductCard from '../../../components/product/product-card';
import Button from '../../../components/shared/button';

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
  };

  const toggleAccordion = (panel: string) => {
    setActiveAccordion((prev) => (prev === panel ? null : panel));
  };

  const accordions = [
    {
      id: 'details',
      title: 'Details',
      content: (
        <ul className="list-disc pl-4 space-y-2">
          {product.details.map((detail, idx) => (
            <li key={idx}>{detail}</li>
          ))}
        </ul>
      ),
    },
    {
      id: 'fabric',
      title: 'Fabric & Care',
      content: <p>{product.fabricCare}</p>,
    },
    {
      id: 'shipping',
      title: 'Shipping & Returns',
      content: <p>{product.shipping}</p>,
    },
  ];

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop">
      {/* Product Main Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        
        {/* Left: Scroll Gallery */}
        <div className="col-span-12 md:col-span-8 flex flex-col gap-gutter select-none">
          {product.images.map((image, idx) => (
            <div key={idx} className="w-full aspect-[3/4] bg-surface-container overflow-hidden rounded-lg">
              <img
                src={image}
                alt={`${product.name} - View ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Right: Sticky Product Info */}
        <aside className="col-span-12 md:col-span-4 h-fit md:sticky md:top-32 space-y-unit-lg mt-8 md:mt-0 select-none">
          <header className="space-y-unit-sm">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              Core Collection
            </p>
            <div className="flex justify-between items-start gap-4">
              <h1 className="font-headline-lg text-3xl md:text-5xl leading-none text-primary">
                {product.name}
              </h1>
              <button
                onClick={() => toggleWishlist(product)}
                className="p-2 border border-outline-variant/30 hover:border-primary transition-colors cursor-pointer"
                aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} className={isFavorited ? 'fill-primary text-primary' : 'text-on-surface-variant'} />
              </button>
            </div>
            <p className="font-body-lg text-body-lg text-primary mt-unit-sm">
              {product.currency}{product.price.toFixed(2)}
            </p>
          </header>

          <div className="space-y-unit-md border-t border-outline-variant/30 pt-unit-md">
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              {product.description}
            </p>
          </div>

          {/* Size Selector */}
          <div className="space-y-unit-sm pt-unit-sm">
            <div className="flex justify-between items-end">
              <label className="font-label-caps text-label-caps uppercase text-on-surface">
                Select Size
              </label>
              <button className="font-label-caps text-[10px] underline hover:text-primary transition-colors uppercase cursor-pointer">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border py-3 font-nav-item text-nav-item transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary text-on-primary font-bold'
                        : 'border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Add to Cart */}
          <div className="pt-unit-md">
            <Button variant="primary" fullWidth onClick={handleAddToCart}>
              ADD TO BAG
            </Button>
          </div>

          {/* Collapsible Accordions */}
          <div className="pt-unit-lg border-t border-outline-variant/30 space-y-2">
            {accordions.map((accordion) => {
              const isOpen = activeAccordion === accordion.id;
              return (
                <div key={accordion.id} className="border-b border-outline-variant/30 pb-4">
                  <button
                    onClick={() => toggleAccordion(accordion.id)}
                    className="flex justify-between items-center w-full text-left py-2 font-label-caps text-label-caps text-primary cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <span>{accordion.title}</span>
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="font-body-md text-body-md text-on-surface-variant pt-2 leading-relaxed">
                          {accordion.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </aside>
      </section>

      {/* Editorial Campaign Break */}
      <section className="py-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-gutter">
          <div className="col-span-12 md:col-span-7 bg-surface-container-high rounded-lg overflow-hidden">
            <img
              src="/brand/photos/close-up.jpg"
              alt="caguei campaign photo"
              className="w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-video object-cover"
            />
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 space-y-unit-md mt-6 md:mt-0">
            <h2 className="font-headline-lg text-3xl md:text-4xl leading-tight text-primary">
              Made to be lived in.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              caguei is a crest, not a logo. Heavyweight fabrications, embroidered patches, and a palette built from real varsity closets — every piece is made to earn its wear, not just look good on a hanger.
            </p>
          </div>
        </div>
      </section>

      {/* Related Products: Complete the Look */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-outline-variant/30 pt-unit-xl">
          <h3 className="font-label-caps text-label-caps uppercase tracking-widest mb-unit-lg text-center text-primary">
            Complete the Look
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
