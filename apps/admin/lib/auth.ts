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
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://cagueistudio.com', // production store domain (prepared, not deployed yet)
    'https://*.cagueistudio.com',
  ],
  // NOTE: NEXT_PUBLIC_ADMIN_URL must be a real routable host — never
  // "http://0.0.0.0:PORT", which silently breaks session validation.
  baseURL: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
});
