import { NextRequest, NextResponse } from 'next/server';
import { OTPService } from '@/lib/otp-service';
import { z } from 'zod';

const verifyOtpSchema = z.object({
  userId: z.string(),
  otpCode: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, otpCode } = verifyOtpSchema.parse(body);

    const isValid = await OTPService.verifyOTP(userId, otpCode, 'WHATSAPP');

    if (!isValid) {
      return NextResponse.json(
        { error: 'Código de verificación inválido o expirado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Código verificado correctamente',
      success: true,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}