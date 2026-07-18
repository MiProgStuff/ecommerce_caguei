'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../products';
import {
  useSession,
  fetchCart,
  addToDbCart,
  updateDbCart,
  removeFromDbCart,
  clearDbCart,
  fetchWishlist,
  addToDbWishlist,
  removeFromDbWishlist,
} from '../api';

export interface CartItem {
  dbId?: string; // Optional database item ID
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

  const { data: sessionData, isPending } = useSession();

  // Load and sync cart & wishlist based on authentication status
  useEffect(() => {
    if (isPending) return;

    const syncState = async () => {
      if (sessionData?.user) {
        try {
          // 1. Sync and merge wishlist
          const dbWishlist = await fetchWishlist();
          const localWishlistStr = localStorage.getItem('caguei_wishlist');
          if (localWishlistStr) {
            const localWishlist = JSON.parse(localWishlistStr);
            if (Array.isArray(localWishlist)) {
              for (const item of localWishlist) {
                if (item?.id && !dbWishlist.some((dw) => dw.id === item.id)) {
                  await addToDbWishlist(item.id);
                }
              }
            }
            localStorage.removeItem('caguei_wishlist');
          }
          const finalWishlist = await fetchWishlist();
          setWishlist(finalWishlist);

          // 2. Sync and merge cart
          const dbCart = await fetchCart();
          const localCartStr = localStorage.getItem('caguei_cart');
          if (localCartStr) {
            const localCart = JSON.parse(localCartStr);
            if (Array.isArray(localCart)) {
              for (const item of localCart) {
                if (item?.product && item?.selectedSize) {
                  const inDb = dbCart.some(
                    (dc) => dc.productId === item.product.id && dc.size === item.selectedSize
                  );
                  if (!inDb) {
                    await addToDbCart(item.product.id, item.quantity, item.selectedSize);
                  }
                }
              }
            }
            localStorage.removeItem('caguei_cart');
          }
          const finalDbCart = await fetchCart();
          setCart(
            finalDbCart.map((item) => ({
              dbId: item.id,
              product: item.product as any,
              selectedSize: item.size,
              quantity: item.quantity,
            }))
          );
        } catch (error) {
          console.error('Error syncing store state with database:', error);
        }
      } else {
        // User is logged out: fetch locally
        const savedCart = localStorage.getItem('caguei_cart');
        const savedWishlist = localStorage.getItem('caguei_wishlist');
        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed)) {
              setCart(parsed.filter((item) => item?.product && typeof item.product.price === 'number'));
            }
          } catch (e) {
            console.error('Failed to parse local cart:', e);
          }
        } else {
          setCart([]);
        }
        if (savedWishlist) {
          try {
            const parsed = JSON.parse(savedWishlist);
            if (Array.isArray(parsed)) {
              setWishlist(parsed.filter((p) => p && typeof p.id === 'string'));
            }
          } catch (e) {
            console.error('Failed to parse local wishlist:', e);
          }
        } else {
          setWishlist([]);
        }
      }
    };

    syncState();
  }, [sessionData, isPending]);

  // Persist local cart changes for guests
  useEffect(() => {
    if (!sessionData?.user) {
      localStorage.setItem('caguei_cart', JSON.stringify(cart));
    }
  }, [cart, sessionData]);

  // Persist local wishlist changes for guests
  useEffect(() => {
    if (!sessionData?.user) {
      localStorage.setItem('caguei_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, sessionData]);

  const addToCart = async (product: Product, size: string, quantity = 1) => {
    // Optimistically update client state
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

    // Sync changes to server
    if (sessionData?.user) {
      await addToDbCart(product.id, quantity, size);
      const finalDbCart = await fetchCart();
      setCart(
        finalDbCart.map((item) => ({
          dbId: item.id,
          product: item.product as any,
          selectedSize: item.size,
          quantity: item.quantity,
        }))
      );
    }
  };

  const removeFromCart = async (productId: string, size: string) => {
    const item = cart.find((item) => item.product.id === productId && item.selectedSize === size);

    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );

    if (sessionData?.user && item?.dbId) {
      await removeFromDbCart(item.dbId);
    }
  };

  const updateCartQuantity = async (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size);
      return;
    }

    const item = cart.find((item) => item.product.id === productId && item.selectedSize === size);

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );

    if (sessionData?.user && item?.dbId) {
      await updateDbCart(item.dbId, quantity);
    }
  };

  const clearCart = async () => {
    setCart([]);

    if (sessionData?.user) {
      await clearDbCart();
    }
  };

  const toggleWishlist = async (product: Product) => {
    const isAlreadyIn = wishlist.some((item) => item.id === product.id);

    setWishlist((prevWishlist) => {
      if (isAlreadyIn) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });

    if (sessionData?.user) {
      if (isAlreadyIn) {
        await removeFromDbWishlist(product.id);
      } else {
        await addToDbWishlist(product.id);
      }
    }
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
