import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { prisma } from '@caguei/db';
import { sendOtpEmail } from './email';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      phoneNumber: {
        type: 'string',
        required: false,
      },
      address: {
        type: 'string',
        required: false,
      },
      role: {
        type: 'string',
        required: false,
      },
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await sendOtpEmail({ to: email, otp, appName: 'caguei' });
      },
    }),
  ],
  // This is the STORE customer auth instance — keep its cookie name distinct
  // from the admin instance (auth-admin.ts) so a session in one app never
  // reads as a session in the other. See §5 of the root CLAUDE.md.
  advanced: {
    cookiePrefix: 'store-auth',
  },
  trustedOrigins: [
    'http://localhost:3000', // store app default port
    'http://192.168.1.100:3000', // dev: browser on another LAN machine via SSH — update if this box's IP changes
    'https://cagueistudio.com', // production store domain (prepared, not deployed yet)
  ],
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4000',
});
