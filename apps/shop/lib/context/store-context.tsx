'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../products';

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: Product[];
  searchQuery: string;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  setSearchQuery: (query: string) => void;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function GlobalStoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('caguei_cart');
    const savedWishlist = localStorage.getItem('caguei_wishlist');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { console.error(e); }
    }
  }, []);

  // Save cart to localStorage when changed
  useEffect(() => {
    localStorage.setItem('caguei_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage when changed
  useEffect(() => {
    localStorage.setItem('caguei_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, size: string, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { product, selectedSize: size, quantity }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const isAlreadyIn = prevWishlist.some((item) => item.id === product.id);
      if (isAlreadyIn) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        searchQuery,
        isCartOpen,
        isSearchOpen,
        isMobileMenuOpen,
        setSearchQuery,
        setCartOpen,
        setSearchOpen,
        setMobileMenuOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a GlobalStoreProvider');
  }
  return context;
}
