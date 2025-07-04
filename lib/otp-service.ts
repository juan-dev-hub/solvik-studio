import { prisma } from './prisma';
import { EncryptionService } from './encryption';

// Mock Twilio for development
const mockTwilio = {
  messages: {
    create: async (params: any) => {
      console.log('Mock WhatsApp OTP sent:', params);
      return { sid: 'mock_message_sid' };
    }
  }
};

export class OTPService {
  static async sendWhatsAppOTP(phoneNumber: string, userId?: string): Promise<boolean> {
    try {
      // Rate limiting check
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentOTPs = await prisma.otpCode.count({
        where: {
          userId: userId || undefined,
          type: 'WHATSAPP',
          createdAt: { gte: oneHourAgo },
        },
      });

      if (recentOTPs >= 5) {
        throw new Error('Rate limit exceeded. Maximum 5 OTP per hour.');
      }

      const otpCode = EncryptionService.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP to database
      if (userId) {
        await prisma.otpCode.create({
          data: {
            userId,
            code: otpCode,
            type: 'WHATSAPP',
            expiresAt,
          },
        });
      }

      // For development, just log the OTP
      console.log(`WhatsApp OTP for ${phoneNumber}: ${otpCode}`);
      
      // In production, use real Twilio:
      // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      // await twilio.messages.create({
      //   body: `Su código de verificación Solvik es: ${otpCode}. Válido por 10 minutos.`,
      //   from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      //   to: `whatsapp:${phoneNumber}`,
      // });

      return true;
    } catch (error) {
      console.error('WhatsApp OTP error:', error);
      return false;
    }
  }

  static async sendEmailOTP(email: string): Promise<boolean> {
    try {
      const otpCode = EncryptionService.generateOTP();
      
      // For development, just log the OTP
      console.log(`Email OTP for ${email}: ${otpCode}`);
      
      // In production, use real Resend:
      // const { Resend } = require('resend');
      // const resend = new Resend(process.env.RESEND_API_KEY);
      // await resend.emails.send({
      //   from: 'admin@solvik.com',
      //   to: email,
      //   subject: 'Código de verificación Solvik Admin',
      //   html: `<h2>Código de verificación</h2><p>Su código es: <strong>${otpCode}</strong></p>`,
      // });

      return true;
    } catch (error) {
      console.error('Email OTP error:', error);
      return false;
    }
  }

  static async verifyOTP(userId: string, code: string, type: 'WHATSAPP' | 'EMAIL'): Promise<boolean> {
    try {
      const otpRecord = await prisma.otpCode.findFirst({
        where: {
          userId,
          code,
          type,
          used: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpRecord) return false;

      // Mark as used
      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { used: true },
      });

      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  }
}