'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Heart, User, ShoppingBag, Menu, X, Plus, Minus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../lib/context/store-context';
import { getEffectivePrice } from '../../lib/products';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    cart,
    wishlist,
    isCartOpen,
    setCartOpen,
    isSearchOpen,
    setSearchOpen,
    isMobileMenuOpen,
    setMobileMenuOpen,
    updateCartQuantity,
    removeFromCart,
  } = useStore();

  const [searchInput, setSearchInput] = useState('');

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'Lookbook', href: '/lookbook' },
    { name: 'About', href: '/about' },
  ];

  const totalItems = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + (item?.product ? getEffectivePrice(item.product) : 0) * (item?.quantity || 0),
    0
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };

  const menuVariants = {
    closed: { x: '-100%' },
    open: { x: 0 },
  };

  const drawerVariants = {
    closed: { x: '100%' },
    open: { x: 0 },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <>
      {/* Top Navigation */}
      <header className="sticky top-0 w-full z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/30 select-none">
        <div className="flex justify-between items-center h-20 px-6 md:px-margin-desktop max-w-[1440px] mx-auto">
          
          {/* Left: Desktop Links */}
          <div className="hidden md:flex items-center space-x-unit-lg">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-nav-item text-nav-item transition-colors pb-1 border-b-2 hover:text-primary ${
                    isActive ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Left: Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-primary hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Center: Logo */}
          <Link href="/" className="select-none cursor-pointer" aria-label="caguei — home">
            <Image
              src="/brand/logo-wordmark.png"
              alt="caguei"
              width={140}
              height={47}
              priority
              className="h-8 w-auto md:h-9"
            />
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
            <Link
              href="/account/wishlist"
              className="hidden md:block hover:opacity-70 transition-opacity relative"
              aria-label="View wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className="hover:opacity-70 transition-opacity"
              aria-label="Go to account"
            >
              <User size={20} />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              transition={{ duration: 0.3 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs"
            />

            {/* Drawer */}
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={drawerVariants}
              transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[450px] bg-background border-l border-outline-variant/30 flex flex-col justify-between shadow-xl"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center h-20 px-8 border-b border-outline-variant/30">
                <span className="font-label-caps text-label-caps text-primary">YOUR BAG ({totalItems})</span>
                <button
                  onClick={() => setCartOpen(false)}
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-8 divide-y divide-outline-variant/30">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <ShoppingBag size={32} strokeWidth={1} className="text-on-surface-variant/40" />
                    <p className="font-body-md text-on-surface-variant">Your bag is empty.</p>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        router.push('/shop');
                      }}
                      className="font-label-caps text-label-caps underline hover:opacity-70 transition-opacity mt-4 cursor-pointer"
                    >
                      SHOP NEW ARRIVALS
                    </button>
                  </div>
                ) : (
                  cart.filter(item => item && item.product).map((item, idx) => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="py-6 flex gap-6 first:pt-0 last:pb-0">
                      {/* Product Thumbnail */}
                      <Link href={`/shop/${item.product.slug}`} onClick={() => setCartOpen(false)} className="w-24 aspect-[3/4] bg-surface-container overflow-hidden shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-headline-md text-base leading-tight">
                              <Link href={`/shop/${item.product.slug}`} onClick={() => setCartOpen(false)} className="hover:opacity-70 transition-opacity">
                                {item.product.name}
                              </Link>
                            </h4>
                            <span className="font-nav-item text-nav-item text-primary ml-2">
                              {item.product.currency}{getEffectivePrice(item.product).toFixed(2)}
                            </span>
                          </div>
                          <p className="font-label-caps text-[10px] text-on-surface-variant mt-1.5 uppercase">
                            SIZE: {item.selectedSize} / COLOR: {item.product.color}
                          </p>
                        </div>

                        {/* Quantity Controls & Remove */}
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border border-outline-variant/60">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                              className="px-2.5 py-1.5 hover:bg-surface-container transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-label-caps text-xs px-3">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                              className="px-2.5 py-1.5 hover:bg-surface-container transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="font-label-caps text-[10px] text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-8 border-t border-outline-variant/30 bg-surface-container-low space-y-6">
                  <div className="flex justify-between items-baseline">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">SUBTOTAL</span>
                    <span className="font-headline-md text-xl">
                      {cart[0].product.currency}{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant">
                    Shipping and duties computed at checkout.
                  </p>
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <Link
                      href="/cart"
                      onClick={() => setCartOpen(false)}
                      className="w-full bg-transparent border border-primary text-primary font-label-caps text-label-caps py-4 text-center hover:bg-primary hover:text-on-primary transition-all duration-300"
                    >
                      VIEW SHOPPING BAG
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={() => setCartOpen(false)}
                      className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-4 text-center hover:opacity-90 transition-opacity"
                    >
                      CHECKOUT
                    </Link>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Full-Screen Search Drawer */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col justify-start"
          >
            <div className="max-w-[1440px] mx-auto w-full px-6 md:px-margin-desktop">
              {/* Search Header */}
              <div className="flex justify-between items-center h-20 border-b border-outline-variant/30">
                <span className="font-label-caps text-label-caps text-on-surface-variant">SEARCH DIRECTORY</span>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="mt-20 relative">
                <input
                  type="text"
                  placeholder="START TYPING..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary py-6 text-2xl md:text-5xl font-display-xl uppercase focus:outline-none placeholder:text-on-surface-variant/20 tracking-tighter"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 hover:opacity-75 transition-opacity cursor-pointer"
                  aria-label="Submit search"
                >
                  <Search size={32} strokeWidth={1.5} />
                </button>
              </form>

              {/* Trending Queries */}
              <div className="mt-12 space-y-6">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant">TRENDING SEARCHES</h4>
                <div className="flex flex-wrap gap-x-8 gap-y-3 font-nav-item text-nav-item uppercase">
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      router.push('/shop?category=Outerwear');
                    }}
                    className="hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    OUTERWEAR
                  </button>
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      router.push('/shop?query=wool');
                    }}
                    className="hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    WOOL COAT
                  </button>
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      router.push('/shop?category=Accessories');
                    }}
                    className="hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    LEATHER TOTE
                  </button>
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      router.push('/shop?category=Knitwear');
                    }}
                    className="hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    KNITWEAR
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs"
            />

            {/* Mobile Nav Menu */}
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[80%] max-w-[320px] bg-background border-r border-outline-variant/30 flex flex-col justify-between p-8 shadow-xl"
            >
              <div className="space-y-12">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <Image src="/brand/logo-wordmark.png" alt="caguei" width={112} height={37} className="h-7 w-auto" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:opacity-70 transition-opacity cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col space-y-6">
                  {navLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-headline-md text-2xl uppercase transition-colors hover:text-primary ${
                          isActive ? 'text-primary' : 'text-on-surface-variant'
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Footer / Utility */}
              <div className="space-y-6 border-t border-outline-variant/30 pt-8">
                <Link
                  href="/account/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 font-nav-item text-nav-item uppercase text-on-surface-variant hover:text-primary"
                >
                  <Heart size={16} /> Wishlist ({wishlist.length})
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 font-nav-item text-nav-item uppercase text-on-surface-variant hover:text-primary"
                >
                  <User size={16} /> Account
                </Link>
                <div className="text-[10px] font-label-caps text-on-surface-variant/40 pt-4">
                  © 2026 caguei. all rights reserved.
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
