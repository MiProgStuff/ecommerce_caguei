'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/shared/button';
import ProductCard from '../components/product/product-card';
import { fetchProducts } from '../lib/api';
import { Product } from '../lib/products';

export default function Home() {
  const [newArrivals, setNewArrivals] = React.useState<Product[]>([]);

  React.useEffect(() => {
    fetchProducts().then((data) => {
      if (Array.isArray(data)) {
        setNewArrivals(data.slice(0, 3));
      } else if (data && Array.isArray((data as any).products)) {
        setNewArrivals((data as any).products.slice(0, 3));
      }
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } },
  };

  return (
    <main className="flex-1 w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-start px-6 md:px-margin-desktop overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('/brand/photos/hero-bench.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        </div>

        <div className="relative z-10 max-w-4xl pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display-xl text-6xl md:text-display-xl text-white leading-none uppercase tracking-tight"
          >
            Wear
            <br />
            the crest
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="font-body-lg text-body-lg text-white/85 max-w-md mt-6"
          >
            Vintage collegiate streetwear built on maroon, olive and cru — no filler, just pieces that hold up.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="mt-10 flex flex-col md:flex-row gap-4"
          >
            <Link href="/shop" passHref>
              <Button variant="primary">SHOP THE DROP</Button>
            </Link>
            <Link href="/lookbook" passHref>
              <Button className="bg-white/95" variant="secondary">EXPLORE LOOKBOOK</Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center">
          <ArrowDown size={20} className="text-white" />
        </div>
      </section>

      {/* Featured Collection (Asymmetrical) */}
      <section className="py-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          
          {/* Left Image Block */}
          <div className="md:col-span-7 relative group overflow-hidden bg-surface-container-highest rounded-lg">
            <div
              className="aspect-[4/5] bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-103"
              style={{ backgroundImage: `url('/brand/photos/cap-adjust.jpg')` }}
            />
            <div className="absolute bottom-0 left-0 p-unit-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="font-label-caps text-label-caps text-white">01 / THE CREST CAP</p>
            </div>
          </div>

          {/* Right Content Block */}
          <div className="md:col-span-4 md:col-start-9 space-y-unit-lg mt-8 md:mt-0">
            <span className="font-label-caps text-label-caps text-primary">SEASONAL EDIT</span>
            <h2 className="font-headline-lg text-4xl md:text-headline-lg leading-tight text-on-background">
              Old patches,
              <br />
              new standard
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
              Heavyweight cotton, embroidered crests and a palette pulled straight from varsity closets — reworked for the street, not the bleachers.
            </p>
            <div className="pt-6">
              <Link
                className="font-label-caps text-label-caps border-b border-primary pb-2 inline-block hover:opacity-60 transition-all"
                href="/shop?collection=Seasonal"
              >
                VIEW SELECTION
              </Link>
            </div>
          </div>
        </div>

        {/* Asymmetrical overlap */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-24">
          <div className="md:col-span-3 md:col-start-2 order-2 md:order-1 flex flex-col justify-end pb-unit-xl mt-8 md:mt-0">
            <h3 className="font-headline-md text-headline-md mb-4 text-on-background">Built to Be Worn</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Every hoodie and tee is heavyweight-cotton first — cut generous, embroidered (never printed) with the caguei crest.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-6 order-1 md:order-2 bg-surface-container-low rounded-lg overflow-hidden">
            <div
              className="aspect-[16/10] bg-cover bg-center"
              style={{ backgroundImage: `url('/brand/photos/hoodie-green.jpg')` }}
            />
          </div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="bg-surface-container py-section-gap">
        <div className="max-w-[1440px] mx-auto px-6 md:px-margin-desktop">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">NEW ARRIVALS</span>
              <h2 className="font-headline-lg text-4xl md:text-headline-lg text-primary">Latest Drops</h2>
            </div>
            <Link className="font-label-caps text-label-caps hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1" href="/shop">
              SHOP ALL
            </Link>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-gutter gap-y-unit-xl"
          >
            {newArrivals.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brand Philosophy (Split) */}
      <section className="grid grid-cols-1 md:grid-cols-2 w-full min-h-[819px]">
        <div className="bg-primary flex flex-col justify-center px-6 md:px-margin-desktop py-unit-xl text-on-primary">
          <div className="max-w-md">
            <span className="font-label-caps text-label-caps mb-8 block opacity-70">WHY caguei</span>
            <h2 className="font-display-xl text-5xl md:text-7xl mb-8 leading-tight text-white">
              Worn.
              <br />
              Not worshipped.
            </h2>
            <p className="font-body-lg text-body-lg opacity-85 mb-10">
              No hype drops, no fast fashion. Just heavyweight fabrications, embroidered crests, and a vintage collegiate palette built to actually get worn in — not sit boxed on a shelf.
            </p>
            <div className="space-y-4 font-sans">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-on-primary opacity-40" />
                <span className="font-label-caps text-label-caps">HEAVYWEIGHT COTTON</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-on-primary opacity-40" />
                <span className="font-label-caps text-label-caps">EMBROIDERED, NEVER PRINTED</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-on-primary opacity-40" />
                <span className="font-label-caps text-label-caps">SMALL BATCH DROPS</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-highest relative min-h-[400px] md:min-h-0 overflow-hidden">
          <div
            className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-1000 bg-cover bg-center"
            style={{ backgroundImage: `url('/brand/photos/close-up.jpg')` }}
          />
        </div>
      </section>

      {/* Editorial Campaign (Immersive) */}
      <section className="relative py-section-gap">
        <div className="max-w-[1440px] mx-auto px-6 md:px-margin-desktop">
          <div className="relative z-10 text-center mb-16 select-none">
            <h2 className="font-display-xl text-4xl md:text-8xl uppercase tracking-widest text-primary/5 select-none absolute -top-12 left-1/2 -translate-x-1/2 w-full">
              CAMPAIGN 01
            </h2>
            <h3 className="font-headline-lg text-3xl md:text-headline-lg relative text-on-background">The Lineup</h3>
          </div>
          <div className="grid grid-cols-12 gap-gutter relative">
            <div className="col-span-12 md:col-span-8 md:col-start-3">
              <div className="aspect-video bg-surface-container-highest relative group overflow-hidden rounded-lg">
                <div
                  className="w-full h-full scale-103 group-hover:scale-100 transition-transform duration-1000 bg-cover bg-top"
                  style={{ backgroundImage: `url('/brand/photos/lineup-flatlay.png')` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Masonry */}
      <section className="pb-section-gap px-6 md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="flex flex-col items-center mb-12">
          <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">FOLLOW THE DIARY</span>
          <h2 className="font-headline-md text-headline-md text-primary">@CAGUEI_OFFICIAL</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            '/brand/photos/hero-bench.jpg',
            '/brand/photos/cap-adjust.jpg',
            '/brand/photos/hoodie-green.jpg',
            '/brand/photos/sleeve-detail.jpg',
          ].map((src, i) => (
            <div
              key={src}
              className={`aspect-square bg-surface-container-low bg-cover bg-center transition-opacity duration-300 hover:opacity-90 rounded-md ${i % 2 === 1 ? 'md:translate-y-10' : ''}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
        </div>
      </section>

      {/* Newsletter signup area is handled globally in the layout footer, so we skip it here to avoid duplication. */}
    </main>
  );
}
