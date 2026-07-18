'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Button from '../../components/shared/button';
import { PRODUCTS, Product } from '../../lib/products';
import ProductCard from '../../components/product/product-card';

export default function LookbookPage() {
  const lineRef = useRef(null);
  const isLineInView = useInView(lineRef, { once: true, margin: '-100px' });

  // Filter specific featured items for lookbook carousel
  const lookbookProducts = PRODUCTS.filter((p: Product) =>
    ['archive-overcoat', 'pleated-trousers', 'system-tote'].includes(p.id)
  );

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <main className="pt-20">
      {/* Hero Editorial Section */}
      <section className="min-h-[920px] grid grid-cols-1 md:grid-cols-12 gap-gutter px-6 md:px-margin-desktop items-center overflow-hidden py-12 md:py-0">
        <div className="col-span-12 md:col-span-7 h-[500px] md:h-[800px] relative overflow-hidden group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoqvxLSWUXj-dLQvSTAIT86cfq1jbrp8joVWiYJR8WATc3A4Hqfemh0EXfOYpDaUaqYsQMCTfzQ_dGloiazJhklrHovL68m3TIKwy_WfcapiRhV3ebvvpA7yPR7vudWJQ4DgpgDmNNKxwnWL2QSosvLR2Gx-HywKKKfm7xY9gSl9GIGbp0nSDA6op31_EJzOhMma7M0LsjTGn6-duETCObnmx9S87RxngLd9JSG07gqUec46xCPcYz"
            alt="Lookbook cover model in black streetwear"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute bottom-8 left-8 text-on-primary mix-blend-difference select-none">
            <p className="font-label-caps text-label-caps tracking-[0.3em] text-white">CHAPTER 01</p>
            <h2 className="font-display-xl text-5xl md:text-8xl mt-4 text-white">MONO</h2>
          </div>
        </div>
        <div className="col-span-12 md:col-span-5 flex flex-col justify-center md:pl-unit-xl select-none">
          <span className="font-label-caps text-label-caps text-on-surface-variant mb-unit-md">
            AUTUMN / WINTER 2024
          </span>
          <h1 className="font-headline-lg text-4xl md:text-6xl leading-none mb-unit-lg text-primary">
            The Silent
            <br />
            Transition
          </h1>
          <p className="font-body-lg text-body-lg max-w-sm text-on-surface-variant leading-relaxed">
            Exploring the intersection of architectural rigidity and human movement through heavy wool and structured silhouettes.
          </p>
          <div className="mt-unit-xl">
            <Link href="/shop" passHref>
              <Button variant="primary">EXPLORE THE SERIES</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vertical Text Spacer Line */}
      <div ref={lineRef} className="my-24 flex justify-center items-center px-6 md:px-margin-desktop max-w-[1440px] mx-auto">
        <div
          className="h-[1px] bg-outline-variant/60 transition-all duration-1000 ease-out"
          style={{ width: isLineInView ? '100%' : '0%' }}
        />
      </div>

      {/* Bento Grid Spreads */}
      <section className="px-6 md:px-margin-desktop mb-section-gap max-w-[1440px] mx-auto select-none">
        <div className="grid grid-cols-12 gap-gutter auto-rows-min">
          {/* Large Image Span */}
          <div className="col-span-12 md:col-span-8 h-[400px] md:h-[700px] relative group overflow-hidden bg-surface-container-high">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKy9SEtnufbptGcjXIn6ovP-SFQdO7_XMNnD1Y3Wp8rJ00s4uCuE-EX2OeZ74Hz74Sti41bX1dc-KfkIHBUdkkuvG7VoJiC5FGN_NPsXZOAmAOVHp57FeFfk512ox9j6PwTU7f2k_yAKWwYqHHRX0F3wFPZEg1XTabwMZZjM0c540TrA9i0fv9Rf4XXnMxNGRfQ5DsTnVsX-VztvSan71BBCrem2IeI_r8jlOVKbJ5cpD5lVUxMlU_"
              alt="Model standing in fields"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Link href="/shop" className="bg-background text-primary px-unit-lg py-unit-md font-label-caps text-label-caps shadow-xl scale-95 group-hover:scale-100 transition-transform flex items-center gap-2 border border-outline-variant/30">
                SHOP THE LOOK <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Text Card */}
          <div className="col-span-12 md:col-span-4 flex flex-col justify-end pb-unit-xl mt-8 md:mt-0">
            <div className="border-l border-outline-variant pl-unit-md space-y-4">
              <h3 className="font-headline-md text-2xl italic text-primary">"The texture of silence."</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Our signature heavy-weave wool is sourced from the Italian Alps, ensuring warmth without sacrificing the clean, structural lines of European minimalism.
              </p>
            </div>
          </div>

          {/* Side-by-Side Asymmetric */}
          <div className="col-span-12 md:col-span-5 mt-unit-xl">
            <div className="aspect-[4/5] overflow-hidden relative bg-surface-container">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQGOEtMm9W9s9Gqtg6yeTEn7xow_-zXeZaQKWfDL3YkC43lLxEuw1dp4V8W8-PnJ0i8RFb4uuNaVrDyjabHUuwpWb2vMvAsus6VDAjoxbxiZbjmOjya-Zz0s47ggvysGhJePw4ReWgV2XJiyUbZ2hs2_3SV1oBlTHrwQzKlbumAJoz6Qnyx44ZRdv4lmxVJ6CnYs6qEkEOchjPyZhRfSC-Hh9eyZT9VTHaonj1gGoCZiZWIqg57sU6"
                alt="Macro fabric detail"
                className="w-full h-full object-cover transition-transform duration-1000 hover:rotate-1"
              />
            </div>
            <p className="font-label-caps text-label-caps mt-unit-sm text-center text-on-surface-variant">
              STUDIO DETAIL — NO. 42
            </p>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7 mt-unit-xl">
            <div className="aspect-square overflow-hidden group relative bg-surface-container">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCm3ySNGh5ej0fhqzBpEtiKEiCsEVQK21clZgAteBc1TPxxvzPPFxl9WuM6ptDWSR7qQp274XV8qzXxmA4BAGPv5XDZ2zp9G2Ma51tHmxOMrk_YQdLr7v1hiNaWmhpXQy89ez9FcxlCt8p3oILkxGTKU8ShgdrBiRaeM8imSrNd4Dnc1Kx41v0Hu0RwXKEiP5EorNrTrCEatCayzH8IIQg9i2wpM9VsMG48Smk-PIJRzhLlw4WO6ps"
                alt="Walk in Paris"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <Link href="/shop" className="absolute bottom-8 right-8 w-12 h-12 bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Plus size={16} />
              </Link>
            </div>
            <div className="mt-unit-md space-y-2">
              <h4 className="font-headline-md text-2xl text-primary">Nightfall in Marais</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Versatile layers for the urban transition from daylight to dusk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Bleed Quote */}
      <section className="w-full h-[600px] bg-primary relative overflow-hidden flex items-center justify-center select-none text-center">
        <div className="relative z-10 px-6">
          <h2 className="font-display-xl text-5xl md:text-8xl text-white opacity-95 leading-tight tracking-tight">
            LESS BUT BETTER
          </h2>
          <p className="font-label-caps text-label-caps text-white/50 tracking-[0.4em] mt-unit-lg">
            THE CAGUEI MANIFESTO
          </p>
        </div>
      </section>

      {/* Product Carousel */}
      <section className="py-section-gap px-6 md:px-margin-desktop max-w-[1440px] mx-auto select-none overflow-hidden">
        <div className="flex justify-between items-end mb-unit-xl">
          <div>
            <h2 className="font-headline-lg text-4xl md:text-headline-lg text-primary">Featured Pieces</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              Selected from the Chapter 01 Lookbook.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => scrollCarousel('left')}
              className="w-12 h-12 border border-outline-variant/60 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300 cursor-pointer"
              aria-label="Scroll left"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="w-12 h-12 border border-outline-variant/60 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300 cursor-pointer"
              aria-label="Scroll right"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Carousel Grid */}
        <div
          ref={carouselRef}
          className="flex space-x-gutter overflow-x-auto pb-unit-lg no-scrollbar snap-x snap-mandatory"
        >
          {lookbookProducts.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[380px] snap-start shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Final Editorial Spread */}
      <section className="mb-section-gap px-6 md:px-margin-desktop max-w-[1440px] mx-auto select-none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="col-span-12 md:col-span-4 h-full flex flex-col justify-center space-y-4 mb-8 md:mb-0">
            <p className="font-label-caps text-label-caps text-on-surface-variant">EPILOGUE</p>
            <h2 className="font-headline-lg text-3xl md:text-4xl italic text-primary">
              Endless
              <br />
              Horizon
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-xs">
              The collection concludes where it began: in the quiet contemplation of form and function.
            </p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="grid grid-cols-2 gap-gutter">
              <div className="bg-surface-container overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_lg_2DSx_lWnbaV1RB5sb2gyAxr7MXjkwrhmmw5GRyaDbFw5wkJJpMFioX8zPmsuEcGMd1jLSvboOGcosEpEea2fpxzPIdRDLlZFVyO82TJ4TeawKSzNmpUh-MXs0NR6z7e4Hu-drjdk9RoUIzI4LU0XRAge-f4fjwP9KC6mtb52k3JN1SMGYsMRCJwMTeGo7jo53lyG6HfyDLGrg6ReApJk09DUZslvcnoAS5JPikhqeJszUWxO-"
                  alt="Minimalist landscape pillar"
                  className="w-full h-[300px] md:h-[600px] object-cover hover:scale-102 transition-transform duration-1000"
                />
              </div>
              <div className="bg-surface-container overflow-hidden translate-y-8 md:translate-y-16">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA825wESxd5QrJW4yQRRLMksp8rwGfPtZsB2nj9rsN9Qu3HM2zETaj0ihgDROlgti9Gd47wmkBy2szdDVJVFz_f0Nrwwh06Uc9r5nXSEzWdvm0A6WQd4bNhNFmuedvb8I42FKWuFVskmyT-rpvMihg6xAaDp0PazZVaI_3_QYN5axtyLjINwIoOF7DVwSiEOqCvXnlW_AZNJoL7pA4qvUcOcwbaumy6QVL1rnfNqgKsUmOBRHh-ZkLN"
                  alt="Collar detail shot"
                  className="w-full h-[300px] md:h-[600px] object-cover hover:scale-102 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
