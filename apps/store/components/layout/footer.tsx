'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-surface-container py-unit-xl border-t border-outline-variant/60">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-6 md:px-margin-desktop max-w-[1440px] mx-auto select-none">
        
        {/* Brand info */}
        <div className="md:col-span-4 mb-unit-lg md:mb-0 space-y-6">
          <Link href="/">
            <Image src="/brand/logo-wordmark.png" alt="caguei" width={130} height={43} className="h-8 w-auto" />
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs leading-relaxed">
            Streetwear vintage/collegiate feito para durar — bordô, verde-oliva e cru, sem meias tintas.
          </p>
          <div className="flex space-x-6 font-label-caps text-[10px] text-on-surface-variant">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Pinterest</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TikTok</a>
          </div>
        </div>

        {/* Links 1 */}
        <div className="md:col-span-2 col-span-4">
          <h4 className="font-label-caps text-label-caps mb-6 text-primary select-none">COLLECTIONS</h4>
          <ul className="space-y-4">
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/shop?collection=Mainline">Mainline</Link></li>
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/shop?collection=Essentials">Essentials</Link></li>
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/shop?collection=Accessories">Accessories</Link></li>
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/shop?collection=Archive">Archive</Link></li>
          </ul>
        </div>

        {/* Links 2 */}
        <div className="md:col-span-2 col-span-4">
          <h4 className="font-label-caps text-label-caps mb-6 text-primary select-none">COMPANY</h4>
          <ul className="space-y-4">
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/about">About Us</Link></li>
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/about#atelier">Atelier</Link></li>
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/about#sustainability">Sustainability</Link></li>
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Links 3 */}
        <div className="md:col-span-2 col-span-4">
          <h4 className="font-label-caps text-label-caps mb-6 text-primary select-none">SUPPORT</h4>
          <ul className="space-y-4">
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/help#shipping">Shipping</Link></li>
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/help#returns">Returns</Link></li>
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/help#sizing">Size Guide</Link></li>
            <li><Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/help">FAQ</Link></li>
          </ul>
        </div>

        {/* Newsletter / Sign up */}
        <div className="md:col-span-2 col-span-12 mt-unit-lg md:mt-0 space-y-6">
          <h4 className="font-label-caps text-label-caps text-primary select-none">NEWSLETTER</h4>
          {subscribed ? (
            <p className="font-label-caps text-[10px] text-primary tracking-wider transition-opacity duration-300">
              THANK YOU FOR JOINING.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="relative border-b border-outline-variant py-2">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 font-body-md placeholder:text-on-surface-variant/40 text-sm"
                required
              />
              <button type="submit" className="absolute right-0 bottom-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" aria-label="Subscribe">
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Legal Bottom */}
        <div className="col-span-12 border-t border-outline-variant/30 mt-unit-xl pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label-caps text-[10px] text-on-surface-variant">© 2026 CAGUEI. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8">
            <Link className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary transition-colors" href="/help#privacy">PRIVACY POLICY</Link>
            <Link className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary transition-colors" href="/help#terms">TERMS OF SERVICE</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
