import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import prisma from './prisma';

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
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`\n========================================`);
        console.log(`[AUTH CLIENT DEV LOGGER]`);
        console.log(`Type: ${type.toUpperCase()}`);
        console.log(`To: ${email}`);
        console.log(`OTP Code: ${otp}`);
        console.log(`========================================\n`);
      },
    }),
  ],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001',
});
