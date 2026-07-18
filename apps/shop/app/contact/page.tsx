'use client';

import React, { useState } from 'react';
import Input from '../../components/shared/input';
import Button from '../../components/shared/button';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop select-none">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-unit-sm mb-unit-xl">
        <h1 className="font-display-xl text-4xl md:text-headline-lg uppercase text-primary">CONTACT</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-xl">
          Get in touch with our team for customer care, atelier appointments, or press inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        
        {/* Left: Atelier Locations */}
        <div className="md:col-span-5 space-y-12">
          <div className="space-y-4">
            <h3 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/20 pb-2">
              KYOTO ATELIER
            </h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              142 Kyoto Atelier Way
              <br />
              Shimogyo-ku, Kyoto 600-8216
              <br />
              <span className="text-primary font-bold">kyoto@caguei.com</span>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/20 pb-2">
              ZURICH HUB
            </h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              48 Sihlquai Strasse
              <br />
              Gewerbeschule, Zurich 8005
              <br />
              <span className="text-primary font-bold">zurich@caguei.com</span>
            </p>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="md:col-span-6 md:col-start-7 bg-surface-container-low p-8 border border-outline-variant/30 mt-12 md:mt-0">
          <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/20 pb-4 mb-6">
            SEND MESSAGE
          </h2>

          {submitted ? (
            <div className="py-8 space-y-4 text-center">
              <h3 className="font-headline-md text-xl text-primary uppercase">INQUIRY RECEIVED</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Thank you for your message. An advisor from our care team will follow up within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Your Name"
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <div className="flex flex-col">
                <label htmlFor="message" className="font-label-caps text-label-caps text-on-surface mb-2">
                  Message Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border border-outline-variant p-4 font-sans text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/40"
                  required
                />
              </div>
              <div className="pt-4">
                <Button variant="primary" type="submit" fullWidth>
                  SUBMIT INQUIRY
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}
