import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS } from '../../../lib/products';
import ProductCard from '../../../components/product/product-card';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const COLLECTIONS_META: { [key: string]: { name: string; desc: string; banner: string } } = {
  'core-collection': {
    name: 'Core Collection',
    desc: 'The foundational wardrobe. Architectural, monochromatic pieces crafted in limited numbers from custom-woven Japanese wool and technical twills.',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz8BbpTan9_p2brYKZWRVFkBsOyXmJmmRARvXfrZj0Wz1OmIn7XQ4cqgrsPmyIGlG6_N9kEzkt3fGx-FVV_tPIcuANnJMYhaXJytPDwjAlHUusZxwx3HFLlOs0OGe9Y2r5HkGr4fcGnj5t1Cj0L7bEmnMH12tDGVQsGdPohTIRJnbCQAFhwsrtp1C-pIezXOJ57eOdLWe2zQgVlAQM_QYZr3mIwv7DkFx5eDbQ7uD0rkIZA_A-_-iR',
  },
  'lookbook-chapter-01': {
    name: 'Lookbook Chapter 01',
    desc: 'Autumn / Winter 2024. A photographic study of movement and shape against concrete brutalist architecture in Paris and Tokyo.',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoqvxLSWUXj-dLQvSTAIT86cfq1jbrp8joVWiYJR8WATc3A4Hqfemh0EXfOYpDaUaqYsQMCTfzQ_dGloiazJhklrHovL68m3TIKwy_WfcapiRhV3ebvvpA7yPR7vudWJQ4DgpgDmNNKxwnWL2QSosvLR2Gx-HywKKKfm7xY9gSl9GIGbp0nSDA6op31_EJzOhMma7M0LsjTGn6-duETCObnmx9S87RxngLd9JSG07gqUec46xCPcYz',
  },
  'essentials': {
    name: 'Essentials',
    desc: 'Minimalist basics designed for daily layering. Made from long-staple organic pima cotton and mid-weight jersey knitwear.',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfSLNQftPqgXbALjK48KEKYbOyC9NEkreDQ8P21xgkGA2IQRzkz_N6XgL36GZ2vswN6VIwsk9-MEJxwLmTfIKiKWfroduAwVIwkprZruXOTVxF-ERf40Zp32OU7ZeImhe2IZwYhfycI13eDnGEGkTwHa2sXS4QmyyS2LigG5ljEKPElyA9QVxDtif9siRyGM-xqVF5WEiWFJAlSNgNs5pwwkKA3PJVxo4RSJM4nu5rDcdkQQIM1gUH',
  },
  'archive': {
    name: 'Archive',
    desc: 'A collection of past experiments and iconic outerwear silhouettes from our earlier seasonal ateliers, made available in limited quantities.',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-4QB5i6XDMG83_zXujwGOUle46Rxb7NxMOJZUEFOEPSZ0oCZfYvvLmtvublReY4UA9bPzQXtzgAOsoZLHdXsuB2y2xz6gYyejBCS7LL3dRsGiqoDn2RKnOG5F_VNVwJtZz17Ss63TwseOrEvCo9fBL_SxMLbsE5Qy2xa7VNKT31CaJi-Mg5KjQv7hb4vf3EcoYHbFkk19av3GRbTjkWqfL7oqoTJWEicgO7y1kEk21mmPfJDz-VRc',
  },
};

export default async function CollectionDetailPage(props: PageProps) {
  const params = await props.params;
  const meta = COLLECTIONS_META[params.slug];

  if (!meta) {
    notFound();
  }

  // Filter products based on slugs to make realistic collections
  let matchedProducts = PRODUCTS;
  if (params.slug === 'core-collection') {
    matchedProducts = PRODUCTS.filter((p) =>
      ['sculptural-blazer-01', 'pleated-trousers', 'system-tote', 'large-architecture-tote'].includes(p.id)
    );
  } else if (params.slug === 'lookbook-chapter-01') {
    matchedProducts = PRODUCTS.filter((p) =>
      ['heavy-gauge-knit', 'pleated-wide-trouser', 'sculpted-wool-overcoat'].includes(p.id)
    );
  } else if (params.slug === 'essentials') {
    matchedProducts = PRODUCTS.filter((p) =>
      ['heavy-cotton-tee', 'structural-parka-01', 'heritage-trousers'].includes(p.id)
    );
  } else if (params.slug === 'archive') {
    matchedProducts = PRODUCTS.filter((p) =>
      ['archive-overcoat', 'raw-denim-chore', 'pleated-trouser-04', 'technical-utility-vest'].includes(p.id)
    );
  }

  return (
    <main className="pt-20 pb-section-gap">
      {/* Banner */}
      <section className="relative h-[450px] w-full flex items-center justify-center bg-surface-container select-none">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale opacity-80"
          style={{ backgroundImage: `url('${meta.banner}')` }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center max-w-2xl px-6">
          <h1 className="font-display-xl text-4xl md:text-6xl text-white uppercase tracking-tighter">
            {meta.name}
          </h1>
          <p className="font-body-md text-white/80 mt-4 leading-relaxed">
            {meta.desc}
          </p>
        </div>
      </section>

      {/* Grid listing */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-margin-desktop mt-20">
        <div className="flex justify-between items-baseline mb-12 border-b border-outline-variant/30 pb-4 select-none">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            {matchedProducts.length} PRODUCTS
          </span>
          <Link href="/collections" className="font-label-caps text-label-caps hover:text-primary transition-colors underline">
            BACK TO COLLECTIONS
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-gutter gap-y-unit-xl">
          {matchedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  return [
    { slug: 'core-collection' },
    { slug: 'lookbook-chapter-01' },
    { slug: 'essentials' },
    { slug: 'archive' },
  ];
}
