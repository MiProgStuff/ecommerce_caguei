import { createAuthClient } from 'better-auth/react';
import { emailOTPClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
  ],
  // Points at the admin-only auth instance (lib/auth-admin.ts on the API),
  // mounted at /api/admin-auth — a distinct basePath/cookie from the store's
  // /api/auth, so admin and store sessions never read as one another.
  // NEXT_PUBLIC_API_URL must be a real routable host — never "http://0.0.0.0:PORT".
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  basePath: '/api/admin-auth',
});
