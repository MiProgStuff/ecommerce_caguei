import { authClient } from './auth-client';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  auth: {
    sendOtp: `${API_BASE_URL}/api/auth/email-otp/send-verification-otp`,
    signIn: `${API_BASE_URL}/api/auth/sign-in/email-otp`,
    signOut: `${API_BASE_URL}/api/auth/sign-out`,
    session: `${API_BASE_URL}/api/auth/get-session`,
  },
  checkUser: `${API_BASE_URL}/api/users/check`,
  health: `${API_BASE_URL}/api/health`,
};

export interface Address {
  id: string;
  street: string;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  label: string; // 'home' | 'work' | 'other'
  userId: string;
}

// API Wrapper Functions
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_ENDPOINTS.checkUser}?email=${encodeURIComponent(email)}`);
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.exists;
  } catch (error) {
    console.error('Error calling checkUserExists API:', error);
    return false;
  }
}

export async function sendVerificationOtp(email: string, type: 'sign-in' | 'change-email' | 'email-verification' | 'forget-password') {
  return await authClient.emailOtp.sendVerificationOtp({
    email,
    type,
  });
}

export async function signInWithOtp(
  email: string,
  otp: string,
  name?: string,
  phoneNumber?: string,
  address?: string
) {
  return await authClient.signIn.emailOtp({
    email,
    otp,
    name: name || undefined,
    phoneNumber: phoneNumber || undefined,
    address: address || undefined,
  });
}

export async function signOutUser() {
  return await authClient.signOut();
}

export function useSession() {
  return authClient.useSession();
}

// Address Management API Wrappers
export async function fetchUserAddresses(): Promise<Address[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/addresses`, {
      credentials: 'include',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return [];
  }
}

export async function createUserAddress(addressData: {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  label: string;
}): Promise<Address | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error creating address:', error);
    return null;
  }
}

export async function deleteUserAddress(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.success;
  } catch (error) {
    console.error('Error deleting address:', error);
    return false;
  }
}

export interface DbCartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  size: string;
  product: {
    id: string;
    slug: string;
    name: string;
    category: string;
    price: number;
    currency: string;
    images: string[];
    sizes: string[];
  };
}

// Cart Database Sync SDK
export async function fetchCart(): Promise<DbCartItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cart`, {
      credentials: 'include',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching cart from DB:', error);
    return [];
  }
}

export async function addToDbCart(productId: string, quantity: number, size: string): Promise<DbCartItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity, size }),
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error adding to DB cart:', error);
    return null;
  }
}

export async function updateDbCart(id: string, quantity: number): Promise<DbCartItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error updating DB cart item:', error);
    return null;
  }
}

export async function removeFromDbCart(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cart/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.success;
  } catch (error) {
    console.error('Error removing from DB cart:', error);
    return false;
  }
}

export async function clearDbCart(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.success;
  } catch (error) {
    console.error('Error clearing DB cart:', error);
    return false;
  }
}

// Wishlist Database Sync SDK
export async function fetchWishlist(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
      credentials: 'include',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching wishlist from DB:', error);
    return [];
  }
}

export async function addToDbWishlist(productId: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error adding to DB wishlist:', error);
    return null;
  }
}

export async function removeFromDbWishlist(productId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/wishlist/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.success;
  } catch (error) {
    console.error('Error removing from DB wishlist:', error);
    return false;
  }
}

// Payments — Stripe Integration
export async function createPaymentIntent(data: {
  addressId: string;
  subtotal: number;
  shippingCost: number;
  estimatedTax: number;
  grandTotal: number;
  items: Array<{
    productId: string;
    quantity: number;
    size: string;
    price: number;
  }>;
}): Promise<{ clientSecret: string; orderId: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/create-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create payment intent');
    }
    return await res.json();
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Orders — Read-only (orders are created server-side by Stripe webhook)
export async function fetchOrders(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      credentials: 'include',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Products — Query endpoints from the database catalog
export async function fetchProducts(category?: string): Promise<any[]> {
  try {
    const url = category
      ? `${API_BASE_URL}/api/products?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/api/products`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${slug}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// User Profile Details Updates
export async function updateUserProfile(data: { name?: string; phoneNumber?: string }) {
  return await (authClient.updateUser as any)({
    name: data.name,
    phoneNumber: data.phoneNumber,
  });
}
