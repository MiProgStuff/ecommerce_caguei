import { createAuthClient } from 'better-auth/react';
import { emailOTPClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
  ],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001',
});
