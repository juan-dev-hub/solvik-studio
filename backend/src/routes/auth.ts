import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { EncryptionService } from '../lib/encryption';
import { OTPService } from '../lib/otp-service';
import { CloudflareService } from '../lib/cloudflare';
import jwt from 'jsonwebtoken';

const router = Router();

const signupSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  whatsappNumber: z.string().min(10).max(15),
  email: z.string().email().optional(),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9]+$/),
});

const sendOtpSchema = z.object({
  whatsappNumber: z.string().min(10).max(15),
});

const verifyOtpSchema = z.object({
  userId: z.string(),
  otpCode: z.string().length(6),
});

const signinSchema = z.object({
  whatsappNumber: z.string().min(10).max(15),
  otpCode: z.string().length(6),
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);
    const cleanNumber = data.whatsappNumber.replace(/[^\d+]/g, '');

    // Check if subdomain is available
    const existingSubdomain = await prisma.user.findUnique({
      where: { subdomain: data.subdomain },
    });

    if (existingSubdomain) {
      return res.status(400).json({ error: 'Este nombre de sitio ya está en uso' });
    }

    // Check if WhatsApp number is already registered
    const users = await prisma.user.findMany();
    for (const user of users) {
      try {
        const decryptedNumber = EncryptionService.decrypt(user.encryptedWhatsApp);
        if (decryptedNumber === cleanNumber) {
          return res.status(400).json({ error: 'Este número de WhatsApp ya está registrado' });
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
      await prisma.user.delete({ where: { id: user.id } });
      return res.status(500).json({ error: 'Error al enviar código de verificación' });
    }

    res.json({
      message: 'Usuario creado. Código de verificación enviado.',
      userId: user.id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { whatsappNumber } = sendOtpSchema.parse(req.body);
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
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Send OTP
    const success = await OTPService.sendWhatsAppOTP(cleanNumber, user.id);

    if (!success) {
      return res.status(500).json({ error: 'Error al enviar código de verificación' });
    }

    res.json({
      message: 'Código de verificación enviado',
      userId: user.id,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verify OTP (for signup)
router.post('/verify-signup', async (req, res) => {
  try {
    const { userId, otpCode } = verifyOtpSchema.parse(req.body);

    const isValid = await OTPService.verifyOTP(userId, otpCode, 'WHATSAPP');

    if (!isValid) {
      return res.status(401).json({ error: 'Código de verificación inválido o expirado' });
    }

    // Activate user account
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    res.json({
      message: 'Cuenta verificada y activada correctamente',
      success: true,
    });
  } catch (error) {
    console.error('Verify signup error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { whatsappNumber, otpCode } = signinSchema.parse(req.body);
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
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verify OTP
    const isValid = await OTPService.verifyOTP(user.id, otpCode, 'WHATSAPP');

    if (!isValid) {
      return res.status(401).json({ error: 'Código de verificación inválido' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        subdomain: user.subdomain,
        email: user.email 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '12h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        subdomain: user.subdomain,
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export { router as authRoutes };