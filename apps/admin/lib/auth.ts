import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { prisma } from '@caguei/db';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
      },
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[ADMIN AUTH DEV LOGGER] ${type}: ${email} OTP is ${otp}`);
      },
    }),
  ],
  // Must match apps/api/lib/auth-admin.ts's cookiePrefix — this instance
  // isn't mounted over HTTP, it's only used server-side (app/(main)/layout.tsx)
  // to read the session cookie the central admin-auth instance issued.
  advanced: {
    cookiePrefix: 'admin-auth',
  },
  trustedOrigins: [
    'http://localhost:3001',
    'https://admin.cagueistudio.com',
  ],
  // NOTE: NEXT_PUBLIC_ADMIN_URL must be a real routable host — never
  // "http://0.0.0.0:PORT", which silently breaks session validation.
  baseURL: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
});
