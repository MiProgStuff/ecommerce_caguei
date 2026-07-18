import React from 'react';

export default function AboutPage() {
  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop select-none">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-unit-sm mb-unit-xl">
        <h1 className="font-display-xl text-4xl md:text-headline-lg uppercase text-primary">ABOUT THE ATELIER</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-xl">
          Caguei is a collaborative project bridging Zurich's structural grid with Kyoto's heritage craft.
        </p>
      </div>

      {/* Editorial Spread 1 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center py-12">
        <div className="md:col-span-6 relative">
          <div className="aspect-[4/3] bg-surface-container overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCP-E7fi_GXbrGctAzf0QEeIwSz_e9wBldDY_UH80_Wql3XUXE41pGGh8x3ddsImK717yPx9ZGgursY76QYFaIeybbB6Os3fbAd75x3JzptnV-6_6cx0o5BwgopLjJ7xGPNE8a1oGOaeLEX_IU6VK2N60G9-JI0nD1WyGAo3h6P8OSRE0mnGzzZIPwX6gIjgUct3waUYeQxL_kNyz2X5hwiJx4U6fIse2DfELgAXS_DCYxGSi-Xjmd"
              alt="Atelier workspace in Kyoto"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8 space-y-6 mt-8 md:mt-0">
          <span className="font-label-caps text-label-caps text-on-surface-variant">01 / GEOGRAPHY</span>
          <h2 id="atelier" className="font-headline-lg text-3xl md:text-5xl text-primary leading-tight">
            Kyoto to Zurich
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Our atelier splits its workshops between two historic design hubs. In Kyoto, we work directly with local weavers sourcing raw Japanese indigo denim and custom heavy cotton loops. In Zurich, our CAD designers map and draft the architectural structures, balancing dimensions using a strict 12-column modular scale.
          </p>
        </div>
      </section>

      {/* Editorial Spread 2 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center py-12 border-t border-outline-variant/20 mt-12">
        <div className="md:col-span-5 space-y-6 order-2 md:order-1 mt-8 md:mt-0">
          <span className="font-label-caps text-label-caps text-on-surface-variant">02 / PHILOSOPHY</span>
          <h2 id="sustainability" className="font-headline-lg text-3xl md:text-5xl text-primary leading-tight">
            Less, but better.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            We reject the fast pace of modern web commercialism and seasonal fashion. We build limited production editions designed for longevity. Each outerwear piece comes with a lifetime repair guarantee—a commitment to keeping garments functional and avoiding landfill waste.
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7 order-1 md:order-2">
          <div className="aspect-[4/3] bg-surface-container overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsBtDH5XrL2lqdw5jfS95gARQx2uRb_J2T_ohvWZqeiqcJiwu_buFPK9iQlXen2KEw-kO7bjha_X3CjD8SWRmt_hj4flNXX5-ql1-Ks1DhlLROkbVtb-pGvsARL-w_VkKSH9_FEF3wX7DQtPQvn9-8EULhoNX1ArJg7N5Zx0H85FBxoU8D0bmS50yQQMHs7M6xA_g-h_dp9NOsZGkIJaKSD5825xCIxnHFAfr1iJrCsoUF34bsjt3g"
              alt="Hands on sewing machine"
              className="w-full h-full object-cover grayscale"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
