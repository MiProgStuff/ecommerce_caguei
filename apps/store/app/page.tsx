'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown, Play } from 'lucide-react';
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
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBnLYVL9tfUVCCScSOnXANmb7Z_H_962h7KGRax247Hladu8rVdAxVtFD9Y3AX3TgjkC0c5JhDE1ONWI6VpNMoz8P7cSMztV6efcwUj8pbuVpDq_V3Fb1-uI3GD-kyLoIA9Wyt7UMsBxtlpssMb06eUffcI_w5pEZjhlF2ThErSLsk8X_FKW1LmQ_RIzxv-ELTkL5eunrTGxxtPvU-PGCulzEyqjRmQ7qNMVYZmeRscpHT5ul8LUXKB')`,
            }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="relative z-10 max-w-4xl pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display-xl text-6xl md:text-display-xl text-primary leading-none uppercase mix-blend-difference invert tracking-tighter"
          >
            THE NEW
            <br />
            STANDARD
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="mt-12 flex flex-col md:flex-row gap-6"
          >
            <Link href="/shop" passHref>
              <Button variant="primary">SHOP COLLECTION</Button>
            </Link>
            <Link href="/lookbook" passHref>
              <Button className='bg-white' variant="secondary">EXPLORE LOOKBOOK</Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center">
          <ArrowDown size={20} className="text-primary mix-blend-difference invert" />
        </div>
      </section>

      {/* Featured Collection (Asymmetrical) */}
      <section className="py-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          
          {/* Left Image Block */}
          <div className="md:col-span-7 relative group overflow-hidden bg-surface-container-highest">
            <div
              className="aspect-[4/5] bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-103"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2K-OTdhI9nr38Uz7gxZhek349VZnJRfPpF_TMuAslov2NjfdFQEyL5Dct4u4Wmb-imHNTXGoMJn0KdHMNkvWSBk8V162ir8gjkQ_sWQpBhcpJL2Qq-kybC2hoJMXLacWUQ2aSA2mGE6HI9qBqB4LSK7sfEXv8VyIH7UWTdX40lYSxQA7IQJBNBi2ORQm5qdPqkivSsYYTI8Qo3ZopoJdqBLAPYZmXURZtZP4OtUwnTPtmo6Wxo6zR')`,
              }}
            />
            <div className="absolute bottom-0 left-0 p-unit-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="font-label-caps text-label-caps text-white">01 / FABRICATIONS</p>
            </div>
          </div>

          {/* Right Content Block */}
          <div className="md:col-span-4 md:col-start-9 space-y-unit-lg mt-8 md:mt-0">
            <span className="font-label-caps text-label-caps text-on-surface-variant">SEASONAL EDIT</span>
            <h2 className="font-headline-lg text-4xl md:text-headline-lg leading-tight text-primary">
              Artisanal
              <br />
              Geometry
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
              Exploring the intersection of architectural structure and fluid movement. Our new seasonal edit focuses on redefined silhouettes crafted from heritage textiles.
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
            <h3 className="font-headline-md text-headline-md mb-4 text-primary">Precision Tailoring</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Each piece is constructed in our Tokyo atelier using traditional techniques merged with modern CAD precision.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-6 order-1 md:order-2 bg-surface-container-low">
            <div
              className="aspect-[16/10] bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCCP-E7fi_GXbrGctAzf0QEeIwSz_e9wBldDY_UH80_Wql3XUXE41pGGh8x3ddsImK717yPx9ZGgursY76QYFaIeybbB6Os3fbAd75x3JzptnV-6_6cx0o5BwgopLjJ7xGPNE8a1oGOaeLEX_IU6VK2N60G9-JI0nD1WyGAo3h6P8OSRE0mnGzzZIPwX6gIjgUct3waUYeQxL_kNyz2X5hwiJx4U6fIse2DfELgAXS_DCYxGSi-Xjmd')`,
              }}
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
            <span className="font-label-caps text-label-caps mb-8 block opacity-60">OUR PHILOSOPHY</span>
            <h2 className="font-display-xl text-5xl md:text-7xl mb-8 leading-tight text-white">
              Less,
              <br />
              but better.
            </h2>
            <p className="font-body-lg text-body-lg opacity-80 mb-10">
              We believe in the longevity of objects. In a world of fleeting trends, we anchor our brand in the permanence of quality and the silence of essential design. Every stitch is a commitment to the craft.
            </p>
            <div className="space-y-4 font-sans">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-on-primary opacity-40" />
                <span className="font-label-caps text-label-caps">SUSTAINABLE SOURCING</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-on-primary opacity-40" />
                <span className="font-label-caps text-label-caps">ETHICAL PRODUCTION</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-on-primary opacity-40" />
                <span className="font-label-caps text-label-caps">LIFETIME REPAIR GUARANTEE</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-highest relative min-h-[400px] md:min-h-0 overflow-hidden">
          <div
            className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-1000 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsBtDH5XrL2lqdw5jfS95gARQx2uRb_J2T_ohvWZqeiqcJiwu_buFPK9iQlXen2KEw-kO7bjha_X3CjD8SWRmt_hj4flNXX5-ql1-Ks1DhlLROkbVtb-pGvsARL-w_VkKSH9_FEF3wX7DQtPQvn9-8EULhoNX1ArJg7N5Zx0H85FBxoU8D0bmS50yQQMHs7M6xA_g-h_dp9NOsZGkIJaKSD5825xCIxnHFAfr1iJrCsoUF34bsjt3g')`,
            }}
          />
        </div>
      </section>

      {/* Editorial Campaign (Immersive) */}
      <section className="relative py-section-gap">
        <div className="max-w-[1440px] mx-auto px-6 md:px-margin-desktop">
          <div className="relative z-10 text-center mb-16 select-none">
            <h2 className="font-display-xl text-4xl md:text-8xl uppercase tracking-widest text-primary/5 select-none absolute -top-12 left-1/2 -translate-x-1/2 w-full">
              EDITORIAL 004
            </h2>
            <h3 className="font-headline-lg text-3xl md:text-headline-lg relative text-primary">The Brutalist Shadow</h3>
          </div>
          <div className="grid grid-cols-12 gap-gutter relative">
            <div className="col-span-12 md:col-span-8 md:col-start-3">
              <div className="aspect-video bg-surface-container-highest relative group overflow-hidden">
                <div
                  className="w-full h-full scale-103 group-hover:scale-100 transition-transform duration-1000 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAadre_4xLYttSM48ZorpGnMsIjOuo-f8mE4OrcFaKgmdYxRYvWVVt8kfrmGlMyvyAscvUj0bnsOcsQAvWDfR_BMybakJAKW1U3miQRYESFJ0og3fqIbq_eGl0djytvkszS5MsYgn8CSIuRXRTfLKGhjULCyH6nSl1BB9YEIyDK7llMf2E4iMCAAigPtadtmTamrUZrZDVWu_it_3g5ktD1y8P5-C0yPPbq2PXsEC9kYF7v15fOypVI')`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform group cursor-pointer" aria-label="Play campaign video">
                    <Play className="text-white fill-white ml-1" size={24} />
                  </button>
                </div>
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
          <div
            className="aspect-square bg-surface-container-low bg-cover bg-center transition-opacity duration-300 hover:opacity-90"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4wl8hj9p2_NXle3cPC7nYPjI0rTh1U2BjjRAZK5XfTdhAqC-XcFuF_X3Tcbay0mA7fZl4X14pbp_aoyUuXtjaY9ufucwo41U_Okzwo-2W0A5zn61WNquZEQ6-QYChjwJ7JxlzflsrZr3cY2Z9T5JK3PsNKNaihcLltDcTEablrh7ypWaIwK6ZG-u_ul3surxB2EqZUoIsgNUuZaxmpd7Toyxpz2R0ZHT185ifTyFamOrHM80uM8V3')`,
            }}
          />
          <div
            className="aspect-square bg-surface-container-low bg-cover bg-center transition-opacity duration-300 hover:opacity-90 md:translate-y-10"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAR4Z3LZtwiOr8IX4DZYov9okNXNymnmRezWEgHf4G1x0wLttZaHa8rRHZzg1_2P0wYZBKCOSC1Mv-0zXsPZLBOWE-VjfUBjBPG-qUya4M9NzsbNWRWLc5SYUgJpszO7lZYgEFU3AVyJMDFYgjOU5_ETBvzIrSnasRBFpgpfM5OQIMrlMofrj6B-ruV5yqzizbwRphMKVAMt4-s8JVi3B_aqFPTJvZJb69CbOkELwxn5yCDX_yVgYqF')`,
            }}
          />
          <div
            className="aspect-square bg-surface-container-low bg-cover bg-center transition-opacity duration-300 hover:opacity-90"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCeWcgabz_uS712s8z-AsbrxqJiP9s53Bda7OIOo8qyuhcL3aR4g24x-q3dUDRPAEIbgVXydW4It_AJ-fPJx2hrDlOGr4qrChfkT7cZYD3LxJ4u7katDwWPh5eeBmetcHMlFFcUZWwSYBm8Y86ubdxo4gLBJWCBfj184Oxw9aA1aUnPstxFzYXEoljvl7hcFKADjlovIse9jjQVrx3IZhzeX4VGOhvCXg1Xl_u2KE1kr9O9bSL1oYuP')`,
            }}
          />
          <div
            className="aspect-square bg-surface-container-low bg-cover bg-center transition-opacity duration-300 hover:opacity-90 md:translate-y-10"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCoSgBpY78igRqJ5n0obWAceCbkpCqZIpHZuJwBHC2cugRKvq-Am0APJRPv9isoTnAIbDahlqUdeDIMxz0pBOBFmiuLRMYKhntu-OtEYYhzlUoJN3bES13U9PLoPc4fjDkb34fYzOWDeJsqa6mhFba4pbe-HF4n7uEGw45ZJudQlvjF0u7lVV6hvnDF1qAmJSIx96OEqXdcOqXILjbau0xqjnjh3Z53XALouJkvke-LamAWxsuTmwI8')`,
            }}
          />
        </div>
      </section>

      {/* Newsletter signup area is handled globally in the layout footer, so we skip it here to avoid duplication. */}
    </main>
  );
}
