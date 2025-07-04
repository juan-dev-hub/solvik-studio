import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { EncryptionService } from './encryption';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'otp',
      credentials: {
        whatsappNumber: { label: 'WhatsApp Number', type: 'text' },
        otpCode: { label: 'OTP Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.whatsappNumber || !credentials?.otpCode) {
          return null;
        }

        try {
          // Find user by encrypted WhatsApp number
          const users = await prisma.user.findMany();
          let user = null;

          for (const u of users) {
            try {
              const decryptedNumber = EncryptionService.decrypt(u.encryptedWhatsApp);
              if (decryptedNumber === credentials.whatsappNumber) {
                user = u;
                break;
              }
            } catch (error) {
              continue;
            }
          }

          if (!user) return null;

          // Verify OTP
          const otpRecord = await prisma.otpCode.findFirst({
            where: {
              userId: user.id,
              code: credentials.otpCode,
              type: 'WHATSAPP',
              used: false,
              expiresAt: { gt: new Date() },
            },
          });

          if (!otpRecord) return null;

          // Mark OTP as used
          await prisma.otpCode.update({
            where: { id: otpRecord.id },
            data: { used: true },
          });

          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            subdomain: user.subdomain,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.subdomain = user.subdomain;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.subdomain) {
        session.user.subdomain = token.subdomain as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};