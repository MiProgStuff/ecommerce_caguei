'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: { category: string; items: FAQItem[] }[] = [
  {
    category: 'SHIPPING & DUTIES',
    items: [
      {
        id: 'ship-1',
        question: 'Where do you ship from, and what carriers are used?',
        answer: 'All orders are dispatched from our Tokyo or Kyoto ateliers. We ship globally via DHL Express carbon-neutral transit. Tracking numbers are generated once the courier collects the parcel.',
      },
      {
        id: 'ship-2',
        question: 'What are the shipping rates and estimated delivery times?',
        answer: 'We offer complimentary express shipping on all orders over €500. For orders under €500, a flat shipping fee of €25 applies. Delivery times average 2-3 business days globally.',
      },
    ],
  },
  {
    category: 'RETURNS & EXCHANGES',
    items: [
      {
        id: 'ret-1',
        question: 'What is your return policy?',
        answer: 'We accept returns within 14 days of delivery. Garments must be in their original condition, unworn, unwashed, and with all technical designer tags attached. Returns are processed through our online returns portal.',
      },
      {
        id: 'ret-2',
        question: 'How do I start a return or exchange?',
        answer: 'Email care@caguei.com with your order number to request a return authorization. We will provide a pre-paid DHL return label. The cost of return shipping is deducted from your refund.',
      },
    ],
  },
  {
    category: 'SIZING & GARMENT CARE',
    items: [
      {
        id: 'size-1',
        question: 'How do I choose the correct size?',
        answer: 'Our garments feature architectural, oversized cuts. We recommend choosing your standard size for the intended draped silhouette, or sizing down for a more structured, tailored fit. Refer to our size guide on product pages.',
      },
      {
        id: 'care-1',
        question: 'How should I care for wool and ripstop pieces?',
        answer: 'For 100% Japanese Wool items, we recommend dry clean only. For technical nylon ripstop pieces, hand wash cold and air dry only. Handle all hardware with care.',
      },
    ],
  },
];

export default function HelpPage() {
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setActiveFAQ((prev) => (prev === id ? null : id));
  };

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop select-none">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-unit-sm mb-unit-xl">
        <h1 className="font-display-xl text-4xl md:text-headline-lg uppercase text-primary">CUSTOMER CARE</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-xl">
          Find information regarding shipping rates, sizing fits, returns guidelines, and garment care.
        </p>
      </div>

      {/* FAQ Categories */}
      <section className="space-y-16">
        {FAQS.map((cat, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
            {/* Category header */}
            <div className="md:col-span-4 pb-4 border-b border-outline-variant/30 md:border-none">
              <h2 className="font-label-caps text-label-caps text-primary tracking-widest">
                {cat.category}
              </h2>
            </div>

            {/* Questions list */}
            <div className="md:col-span-8 divide-y divide-outline-variant/30">
              {cat.items.map((item) => {
                const isOpen = activeFAQ === item.id;
                return (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                    <button
                      onClick={() => toggleFAQ(item.id)}
                      className="flex justify-between items-center w-full text-left font-headline-md text-xl md:text-2xl text-primary cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      <span className="pr-4">{item.question}</span>
                      <ChevronDown
                        size={18}
                        className={`transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
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
                          <p className="font-body-md text-body-md text-on-surface-variant pt-4 leading-relaxed max-w-2xl">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
