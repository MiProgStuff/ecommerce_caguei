import { authClient } from './auth-client';

// NOTE: NEXT_PUBLIC_API_URL must be a real routable host — never
// "http://0.0.0.0:PORT", which the browser can't actually connect to.
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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export async function fetchUsers(): Promise<AdminUser[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`, { credentials: 'include' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.users ?? [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: 'ADMIN' | 'CUSTOMER'): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
      credentials: 'include',
    });
    return res.ok;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}
