import React from 'react';
import Link from 'next/link';

interface Collection {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

const COLLECTIONS: Collection[] = [
  {
    slug: 'core-collection',
    name: 'Core Collection',
    tagline: 'Architectural silhouettes and essential fabrications.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz8BbpTan9_p2brYKZWRVFkBsOyXmJmmRARvXfrZj0Wz1OmIn7XQ4cqgrsPmyIGlG6_N9kEzkt3fGx-FVV_tPIcuANnJMYhaXJytPDwjAlHUusZxwx3HFLlOs0OGe9Y2r5HkGr4fcGnj5t1Cj0L7bEmnMH12tDGVQsGdPohTIRJnbCQAFhwsrtp1C-pIezXOJ57eOdLWe2zQgVlAQM_QYZr3mIwv7DkFx5eDbQ7uD0rkIZA_A-_-iR',
  },
  {
    slug: 'lookbook-chapter-01',
    name: 'Lookbook Chapter 01',
    tagline: 'A silent study in geometry and city transitions.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoqvxLSWUXj-dLQvSTAIT86cfq1jbrp8joVWiYJR8WATc3A4Hqfemh0EXfOYpDaUaqYsQMCTfzQ_dGloiazJhklrHovL68m3TIKwy_WfcapiRhV3ebvvpA7yPR7vudWJQ4DgpgDmNNKxwnWL2QSosvLR2Gx-HywKKKfm7xY9gSl9GIGbp0nSDA6op31_EJzOhMma7M0LsjTGn6-duETCObnmx9S87RxngLd9JSG07gqUec46xCPcYz',
  },
  {
    slug: 'essentials',
    name: 'Essentials',
    tagline: 'Refined basic layers in luxury organic cotton and wool.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfSLNQftPqgXbALjK48KEKYbOyC9NEkreDQ8P21xgkGA2IQRzkz_N6XgL36GZ2vswN6VIwsk9-MEJxwLmTfIKiKWfroduAwVIwkprZruXOTVxF-ERf40Zp32OU7ZeImhe2IZwYhfycI13eDnGEGkTwHa2sXS4QmyyS2LigG5ljEKPElyA9QVxDtif9siRyGM-xqVF5WEiWFJAlSNgNs5pwwkKA3PJVxo4RSJM4nu5rDcdkQQIM1gUH',
  },
  {
    slug: 'archive',
    name: 'Archive',
    tagline: 'Documented designs from previous seasonal workshops.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-4QB5i6XDMG83_zXujwGOUle46Rxb7NxMOJZUEFOEPSZ0oCZfYvvLmtvublReY4UA9bPzQXtzgAOsoZLHdXsuB2y2xz6gYyejBCS7LL3dRsGiqoDn2RKnOG5F_VNVwJtZz17Ss63TwseOrEvCo9fBL_SxMLbsE5Qy2xa7VNKT31CaJi-Mg5KjQv7hb4vf3EcoYHbFkk19av3GRbTjkWqfL7oqoTJWEicgO7y1kEk21mmPfJDz-VRc',
  },
];

export default function CollectionsPage() {
  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-unit-sm mb-unit-xl select-none">
        <h1 className="font-display-xl text-4xl md:text-headline-lg uppercase text-primary">COLLECTIONS</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-xl">
          Curated directories designed for seasonal transition, constructed with longevity at our core.
        </p>
      </div>

      {/* Collections Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-16">
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="group block flex flex-col space-y-6 cursor-pointer"
          >
            {/* Image Box */}
            <div className="aspect-[16/10] bg-surface-container overflow-hidden relative">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* Typography Details */}
            <div className="flex justify-between items-baseline pr-4 select-none">
              <div className="space-y-1">
                <h3 className="font-headline-md text-2xl text-primary group-hover:opacity-75 transition-opacity">
                  {collection.name}
                </h3>
                <p className="font-body-md text-on-surface-variant text-sm max-w-sm">
                  {collection.tagline}
                </p>
              </div>
              <span className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 shrink-0">
                DISCOVER
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
