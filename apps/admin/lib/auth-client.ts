import { createAuthClient } from 'better-auth/react';
import { emailOTPClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
  ],
  // NOTE: unused for admin login now (see lib/admin-access.ts), kept for
  // consistency. NEXT_PUBLIC_API_URL must be a real routable host — never
  // "http://0.0.0.0:PORT".
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});
