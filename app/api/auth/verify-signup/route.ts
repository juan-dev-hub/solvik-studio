import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OTPService } from '@/lib/otp-service';
import { z } from 'zod';

const verifySignupSchema = z.object({
  userId: z.string(),
  otpCode: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, otpCode } = verifySignupSchema.parse(body);

    const isValid = await OTPService.verifyOTP(userId, otpCode, 'WHATSAPP');

    if (!isValid) {
      return NextResponse.json(
        { error: 'Código de verificación inválido o expirado' },
        { status: 401 }
      );
    }

    // Activate user account
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    return NextResponse.json({
      message: 'Cuenta verificada y activada correctamente',
      success: true,
    });
  } catch (error) {
    console.error('Verify signup error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}