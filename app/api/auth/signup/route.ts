import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OTPService } from '@/lib/otp-service';
import { EncryptionService } from '@/lib/encryption';
import { CloudflareService } from '@/lib/cloudflare';
import { z } from 'zod';

const signupSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  whatsappNumber: z.string().min(10).max(15),
  email: z.string().email().optional(),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9]+$/),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = signupSchema.parse(body);

    // Clean phone number
    const cleanNumber = data.whatsappNumber.replace(/[^\d+]/g, '');

    // Check if subdomain is available
    const existingSubdomain = await prisma.user.findUnique({
      where: { subdomain: data.subdomain },
    });

    if (existingSubdomain) {
      return NextResponse.json(
        { error: 'Este nombre de sitio ya está en uso' },
        { status: 400 }
      );
    }

    // Check if WhatsApp number is already registered
    const users = await prisma.user.findMany();
    for (const user of users) {
      try {
        const decryptedNumber = EncryptionService.decrypt(user.encryptedWhatsApp);
        if (decryptedNumber === cleanNumber) {
          return NextResponse.json(
            { error: 'Este número de WhatsApp ya está registrado' },
            { status: 400 }
          );
        }
      } catch (error) {
        continue;
      }
    }

    // Create user
    const encryptedWhatsApp = EncryptionService.encrypt(cleanNumber);
    
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        encryptedWhatsApp,
        email: data.email,
        subdomain: data.subdomain,
      },
    });

    // Create subdomain in Cloudflare
    await CloudflareService.createSubdomain(data.subdomain);

    // Send OTP
    const success = await OTPService.sendWhatsAppOTP(cleanNumber, user.id);

    if (!success) {
      // Rollback user creation if OTP fails
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json(
        { error: 'Error al enviar código de verificación' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Usuario creado. Código de verificación enviado.',
      userId: user.id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}