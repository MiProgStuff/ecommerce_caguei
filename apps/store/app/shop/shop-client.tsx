'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { fetchProducts } from '../../lib/api';
import { Product } from '../../lib/products';
import ProductCard from '../../components/product/product-card';

interface ShopClientProps {
  initialFilters: {
    category?: string;
    collection?: string;
    query?: string;
    q?: string;
  };
}

type SortOption = 'newest' | 'price-asc' | 'price-desc';

export default function ShopClient({ initialFilters }: ShopClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialFilters.category || 'All'
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isSortOpen, setSortOpen] = useState(false);
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', 'Outerwear', 'Knitwear', 'Trousers', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Black', value: '#1c1b1b', label: 'Obsidian Black' },
    { name: 'White', value: '#ffffff', label: 'Optic White' },
    { name: 'Grey', value: '#5d5e5f', label: 'Charcoal' },
    { name: 'Oatmeal', value: '#A1887F', label: 'Oatmeal' },
  ];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? [...products] : [];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Size
    if (selectedSize) {
      result = result.filter((p) => p.sizes.includes(selectedSize) || p.sizes.includes('O/S'));
    }

    // Filter by Color
    if (selectedColor) {
      result = result.filter((p) =>
        p.color.toLowerCase().includes(selectedColor.toLowerCase())
      );
    }

    // Filter by Price
    result = result.filter((p) => p.price <= maxPrice);

    // Filter by Text Query (from initial search/q query)
    const searchQuery = initialFilters.query || initialFilters.q;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, selectedSize, selectedColor, maxPrice, sortBy, initialFilters]);

  const activeSortLabel = {
    newest: 'NEWEST',
    'price-asc': 'PRICE: LOW TO HIGH',
    'price-desc': 'PRICE: HIGH TO LOW',
  }[sortBy];

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSize(null);
    setSelectedColor(null);
    setMaxPrice(2000);
    setSortBy('newest');
  };

  if (loading) {
    return (
      <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop text-center select-none">
        <h1 className="font-label-caps text-label-caps text-on-surface-variant animate-pulse">
          LOADING CATALOGUE...
        </h1>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop">
      {/* Header & Sorting Bar */}
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-unit-xl border-b border-outline-variant/30 pb-unit-sm">
        <h1 className="font-display-xl text-4xl md:text-headline-lg uppercase mb-4 md:mb-0 text-primary">
          {initialFilters.query || initialFilters.q ? `Search Results` : `Shop All`}
        </h1>
        <div className="flex items-center gap-unit-lg w-full md:w-auto justify-between md:justify-end">
          <span className="font-label-caps text-label-caps text-on-surface-variant select-none">
            {filteredProducts.length} PRODUCTS
          </span>

          <div className="flex items-center space-x-6">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 font-label-caps text-label-caps text-primary cursor-pointer"
            >
              <SlidersHorizontal size={14} /> FILTERS
            </button>

            {/* Sorting Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!isSortOpen)}
                className="flex items-center gap-unit-xs cursor-pointer group font-label-caps text-label-caps text-primary"
              >
                <span>SORT BY: {activeSortLabel}</span>
                <ChevronDown size={14} className={`transform transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <ul className="absolute right-0 mt-3 bg-background border border-outline-variant/60 shadow-lg py-3 w-56 z-20 font-label-caps text-[11px] text-on-surface-variant divide-y divide-outline-variant/20">
                    <li>
                      <button
                        onClick={() => {
                          setSortBy('newest');
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 hover:text-primary transition-colors cursor-pointer ${
                          sortBy === 'newest' ? 'text-primary font-bold bg-surface-container-low' : ''
                        }`}
                      >
                        NEWEST
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSortBy('price-asc');
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 hover:text-primary transition-colors cursor-pointer ${
                          sortBy === 'price-asc' ? 'text-primary font-bold bg-surface-container-low' : ''
                        }`}
                      >
                        PRICE: LOW TO HIGH
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSortBy('price-desc');
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 hover:text-primary transition-colors cursor-pointer ${
                          sortBy === 'price-desc' ? 'text-primary font-bold bg-surface-container-low' : ''
                        }`}
                      >
                        PRICE: HIGH TO LOW
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Sidebar Filter - Desktop */}
        <aside className="hidden md:block col-span-2 space-y-unit-xl select-none">
          {/* Category */}
          <section className="space-y-unit-md">
            <h3 className="font-label-caps text-label-caps text-primary">CATEGORY</h3>
            <ul className="space-y-unit-sm font-nav-item text-nav-item uppercase text-on-surface-variant">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`transition-colors cursor-pointer hover:text-primary ${
                    selectedCategory === cat ? 'text-primary font-bold' : ''
                  }`}
                >
                  <button onClick={() => setSelectedCategory(cat)} className="cursor-pointer">
                    {cat === 'All' ? 'All items' : cat}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Size */}
          <section className="space-y-unit-md">
            <h3 className="font-label-caps text-label-caps text-primary">SIZE</h3>
            <div className="grid grid-cols-3 gap-unit-xs">
              {sizes.map((sz) => {
                const isActive = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(isActive ? null : sz)}
                    className={`border py-2 text-[10px] font-nav-item transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-primary border-primary text-on-primary font-bold'
                        : 'border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Color */}
          <section className="space-y-unit-md">
            <h3 className="font-label-caps text-label-caps text-primary">COLOR</h3>
            <div className="flex flex-wrap gap-unit-sm">
              {colors.map((c) => {
                const isActive = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(isActive ? null : c.name)}
                    className={`w-6 h-6 rounded-full border cursor-pointer transition-all ${
                      c.name === 'White' ? 'border-outline-variant/60' : 'border-transparent'
                    } ${
                      isActive ? 'ring-1 ring-primary ring-offset-2 scale-90' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                    aria-label={c.label}
                  />
                );
              })}
            </div>
          </section>

          {/* Price */}
          <section className="space-y-unit-md">
            <div className="flex justify-between items-baseline">
              <h3 className="font-label-caps text-label-caps text-primary">MAX PRICE</h3>
              <span className="font-nav-item text-xs font-bold text-primary">${maxPrice}</span>
            </div>
            <div className="space-y-4">
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary h-px bg-outline-variant/80 appearance-none cursor-pointer"
              />
              <div className="flex justify-between font-label-caps text-[9px] text-on-surface-variant">
                <span>$50</span>
                <span>$2,000+</span>
              </div>
            </div>
          </section>

          {/* Reset Filters */}
          {(selectedCategory !== 'All' || selectedSize || selectedColor || maxPrice < 2000) && (
            <button
              onClick={handleResetFilters}
              className="w-full py-3 border border-dashed border-outline-variant font-label-caps text-[10px] text-on-surface-variant hover:text-primary hover:border-primary transition-colors cursor-pointer"
            >
              CLEAR ALL FILTERS
            </button>
          )}
        </aside>

        {/* Product Grid */}
        <div className="col-span-12 md:col-span-10">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <p className="font-body-lg text-on-surface-variant">No items found matching your filters.</p>
              <button
                onClick={handleResetFilters}
                className="font-label-caps text-label-caps underline hover:opacity-75 cursor-pointer"
              >
                RESET SELECTIONS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-unit-xl">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="mt-section-gap flex justify-center items-center gap-unit-lg select-none">
              <button className="opacity-30 cursor-not-allowed" aria-label="Previous page">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div className="flex gap-unit-md font-label-caps text-label-caps">
                <span className="text-primary font-bold underline decoration-2 underline-offset-4 cursor-pointer">01</span>
                <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">02</span>
                <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">03</span>
                <span className="text-on-surface-variant">...</span>
                <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">12</span>
              </div>
              <button className="hover:text-primary transition-colors cursor-pointer" aria-label="Next page">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Filter Container */}
          <div className="relative w-[85%] max-w-[320px] h-full bg-background border-l border-outline-variant/30 p-8 flex flex-col justify-between shadow-xl z-10 overflow-y-auto">
            <div className="space-y-8 pb-12">
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
                <span className="font-label-caps text-label-caps text-primary">FILTERS</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Category */}
              <section className="space-y-4">
                <h4 className="font-label-caps text-[10px] text-primary">CATEGORY</h4>
                <ul className="space-y-2 font-nav-item text-xs uppercase text-on-surface-variant">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      className={selectedCategory === cat ? 'text-primary font-bold' : ''}
                    >
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setMobileFiltersOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        {cat === 'All' ? 'All items' : cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Size */}
              <section className="space-y-4">
                <h4 className="font-label-caps text-[10px] text-primary">SIZE</h4>
                <div className="grid grid-cols-3 gap-1">
                  {sizes.map((sz) => {
                    const isActive = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(isActive ? null : sz)}
                        className={`border py-1.5 text-[9px] font-nav-item cursor-pointer ${
                          isActive
                            ? 'bg-primary border-primary text-on-primary'
                            : 'border-outline-variant text-on-surface-variant'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Color */}
              <section className="space-y-4">
                <h4 className="font-label-caps text-[10px] text-primary">COLOR</h4>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => {
                    const isActive = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(isActive ? null : c.name)}
                        className={`w-5 h-5 rounded-full border cursor-pointer ${
                          c.name === 'White' ? 'border-outline-variant/60' : 'border-transparent'
                        } ${isActive ? 'ring-1 ring-primary ring-offset-2' : ''}`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    );
                  })}
                </div>
              </section>

              {/* Price */}
              <section className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-label-caps text-[10px] text-primary">MAX PRICE</h4>
                  <span className="font-nav-item text-xs font-bold text-primary">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary h-px bg-outline-variant"
                />
              </section>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-outline-variant/30 pt-4 flex gap-3">
              <button
                onClick={() => {
                  handleResetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="flex-1 py-3 border border-outline-variant font-label-caps text-[10px] text-on-surface-variant cursor-pointer text-center"
              >
                RESET
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-primary text-on-primary font-label-caps text-[10px] cursor-pointer text-center"
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
