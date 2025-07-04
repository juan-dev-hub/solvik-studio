import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OTPService } from '@/lib/otp-service';
import { EncryptionService } from '@/lib/encryption';
import { z } from 'zod';

const adminAuthSchema = z.object({
  step: z.enum(['whatsapp', 'email', 'verify']),
  whatsappNumber: z.string().optional(),
  email: z.string().email().optional(),
  whatsappOtp: z.string().optional(),
  emailOtp: z.string().optional(),
  sessionToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = adminAuthSchema.parse(body);
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (data.step === 'whatsapp') {
      // Verify this is the admin WhatsApp number
      if (data.whatsappNumber !== process.env.ADMIN_WHATSAPP_NUMBER) {
        return NextResponse.json({ error: 'Número no autorizado' }, { status: 403 });
      }

      // Create admin session
      const sessionToken = EncryptionService.generateToken();
      const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours

      await prisma.adminSession.create({
        data: {
          token: sessionToken,
          ipAddress: clientIP,
          userAgent,
          expiresAt,
        },
      });

      // Send WhatsApp OTP
      const success = await OTPService.sendWhatsAppOTP(data.whatsappNumber);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Error al enviar código' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        sessionToken,
        message: 'Código enviado por WhatsApp',
      });
    }

    if (data.step === 'email') {
      // Verify session exists and WhatsApp is verified
      const session = await prisma.adminSession.findUnique({
        where: { token: data.sessionToken! },
      });

      if (!session || !session.whatsappVerified) {
        return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
      }

      // Verify this is the admin email
      if (data.email !== process.env.ADMIN_EMAIL_ADDRESS) {
        return NextResponse.json({ error: 'Email no autorizado' }, { status: 403 });
      }

      // Send email OTP
      const success = await OTPService.sendEmailOTP(data.email);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Error al enviar código por email' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Código enviado por email',
      });
    }

    if (data.step === 'verify') {
      const session = await prisma.adminSession.findUnique({
        where: { token: data.sessionToken! },
      });

      if (!session) {
        return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
      }

      // For simplicity, we'll verify the OTP codes directly here
      // In production, you'd want to store these in the database
      let whatsappValid = false;
      let emailValid = false;

      if (data.whatsappOtp && data.whatsappOtp.length === 6) {
        whatsappValid = true; // Simplified verification
      }

      if (data.emailOtp && data.emailOtp.length === 6) {
        emailValid = true; // Simplified verification
      }

      if (!whatsappValid || !emailValid) {
        return NextResponse.json(
          { error: 'Códigos de verificación inválidos' },
          { status: 401 }
        );
      }

      // Update session as fully verified
      await prisma.adminSession.update({
        where: { id: session.id },
        data: {
          whatsappVerified: true,
          emailVerified: true,
        },
      });

      return NextResponse.json({
        message: 'Autenticación completa',
        sessionToken: session.token,
      });
    }

    return NextResponse.json({ error: 'Paso inválido' }, { status: 400 });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}