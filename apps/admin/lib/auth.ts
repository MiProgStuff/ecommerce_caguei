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
        console.log(`[ADMIN AUTH DEV LOGGER] ${type}: ${email} OTP is ${otp}`);
      },
    }),
  ],
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
  ],
});
