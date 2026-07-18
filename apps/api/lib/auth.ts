import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { prisma } from '@caguei/db';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`\n========================================`);
        console.log(`[CENTRAL API DEV AUTH LOGGER]`);
        console.log(`Type: ${type.toUpperCase()}`);
        console.log(`To: ${email}`);
        console.log(`OTP Code: ${otp}`);
        console.log(`========================================\n`);
      },
    }),
  ],
  // Define trusted origins for both frontend applications
  trustedOrigins: [
    'http://localhost:3000', // store app default port
    'http://localhost:3001', // admin app default port
  ],
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4000',
});
