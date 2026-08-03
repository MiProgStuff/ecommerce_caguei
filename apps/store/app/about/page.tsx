import React from 'react';
import Link from 'next/link';
import Button from '../../components/shared/button';

export default function AboutPage() {
  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop select-none">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-unit-sm mb-unit-xl">
        <h1 className="font-display-xl text-4xl md:text-headline-lg uppercase text-primary">ABOUT CAGUEI</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-xl">
          Streetwear built on a Portuguese swear-word and zero interest in fitting in.
        </p>
      </div>

      {/* Editorial Spread 1 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center py-12">
        <div className="md:col-span-6 relative">
          <div className="aspect-[670/1050] bg-surface-container overflow-hidden">
            <img
              src="/brand/photos/about-the-name.jpg"
              alt="Caguei brand imagery"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8 space-y-6 mt-8 md:mt-0">
          <span className="font-label-caps text-label-caps text-on-surface-variant">01 / THE NAME</span>
          <h2 className="font-headline-lg text-3xl md:text-5xl text-primary leading-tight">
            Caguei means I don&apos;t care.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            The name comes straight from Portuguese slang — <em>caguei</em>, &quot;I don&apos;t care.&quot; It&apos;s a rebellious streak turned into a brand: an invitation to dress for yourself first, stop asking for permission, and treat self-expression as the whole point, not an afterthought.
          </p>
        </div>
      </section>

      {/* Editorial Spread 2 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center py-12 border-t border-outline-variant/20 mt-12">
        <div className="md:col-span-5 space-y-6 order-2 md:order-1 mt-8 md:mt-0">
          <span className="font-label-caps text-label-caps text-on-surface-variant">02 / PHILOSOPHY</span>
          <h2 className="font-headline-lg text-3xl md:text-5xl text-primary leading-tight">
            Street, art, attitude.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Our design language sits where street culture, contemporary art and city life overlap — vintage collegiate silhouettes reworked with the vibrant energy of streetwear, finished to a standard that doesn&apos;t cut corners. Bold, not polite.
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7 order-1 md:order-2">
          <div className="aspect-[1200/790] bg-surface-container overflow-hidden">
            <img
              src="/brand/photos/about-philosophy.jpg"
              alt="Design sketches behind the Caguei aesthetic"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Editorial Spread 3 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center py-12 border-t border-outline-variant/20 mt-12">
        <div className="md:col-span-6 relative">
          <div className="aspect-[635/910] bg-surface-container overflow-hidden">
            <img
              src="/brand/photos/about-craft.jpg"
              alt="Hands-on craftsmanship behind every Caguei piece"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8 space-y-6 mt-8 md:mt-0">
          <span className="font-label-caps text-label-caps text-on-surface-variant">03 / CRAFT</span>
          <h2 className="font-headline-lg text-3xl md:text-5xl text-primary leading-tight">
            Every piece earns its place.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            From first sketch to final stitch, we sweat the details — fabric weight, construction, fit — so every garment holds up to the standard we set for it, not just the one it shipped with.
          </p>
        </div>
      </section>

      {/* Editorial Spread 4 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center py-12 border-t border-outline-variant/20 mt-12">
        <div className="md:col-span-5 space-y-6 order-2 md:order-1 mt-8 md:mt-0">
          <span className="font-label-caps text-label-caps text-on-surface-variant">04 / VALUES</span>
          <h2 className="font-headline-lg text-3xl md:text-5xl text-primary leading-tight">
            Made for everyone, made to last.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Caguei welcomes every race, religion, gender identity, orientation, age and background — full stop. And because clothes shouldn&apos;t cost the planet more than they cost you, we keep chasing better materials, less waste and a supply chain we can stand behind.
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7 order-1 md:order-2">
          <div className="aspect-[605/1070] bg-surface-container overflow-hidden">
            <img
              src="/brand/photos/about-values.jpg"
              alt="A welcoming, inclusive community sign"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="text-center py-16 border-t border-outline-variant/20 mt-12 space-y-6">
        <h2 className="font-headline-lg text-2xl md:text-4xl text-primary leading-tight max-w-2xl mx-auto">
          Defying conventions with style and attitude — that&apos;s the whole brief.
        </h2>
        <Link href="/shop" passHref>
          <Button variant="primary">SHOP THE DROP</Button>
        </Link>
      </section>
    </main>
  );
}
