import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OTPService } from '@/lib/otp-service';
import { EncryptionService } from '@/lib/encryption';
import { z } from 'zod';

const sendOtpSchema = z.object({
  whatsappNumber: z.string().min(10).max(15),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { whatsappNumber } = sendOtpSchema.parse(body);

    // Clean phone number
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '');

    // Find user by encrypted WhatsApp number
    const users = await prisma.user.findMany();
    let user = null;

    for (const u of users) {
      try {
        const decryptedNumber = EncryptionService.decrypt(u.encryptedWhatsApp);
        if (decryptedNumber === cleanNumber) {
          user = u;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Send OTP
    const success = await OTPService.sendWhatsAppOTP(cleanNumber, user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Error al enviar código de verificación' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Código de verificación enviado',
      userId: user.id,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}