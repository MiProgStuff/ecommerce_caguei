import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { prisma } from '@caguei/db';
import { sendOtpEmail } from './email';

// Separate better-auth instance for the admin panel, mounted at its own
// basePath with its own cookie name (see advanced.cookiePrefix below) so an
// admin-panel session never gets read as a store session or vice versa —
// they share the same User/Session tables, just distinct session cookies.
export const adminAuth = betterAuth({
  basePath: '/api/admin-auth',
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
        await sendOtpEmail({ to: email, otp, appName: 'caguei Admin' });
      },
    }),
  ],
  advanced: {
    cookiePrefix: 'admin-auth',
  },
  trustedOrigins: [
    'http://localhost:3001', // admin app default port
    'http://192.168.1.100:3001', // dev: browser on another LAN machine via SSH — update if this box's IP changes
    'https://admin.cagueistudio.com', // production admin domain (prepared, not deployed yet)
  ],
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4000',
});
