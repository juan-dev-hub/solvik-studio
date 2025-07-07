import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contactFormSchema = z.object({
  subdomain: z.string().min(1),
  formData: z.record(z.string()),
  language: z.enum(['es', 'en', 'fi']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subdomain, formData, language = 'es' } = contactFormSchema.parse(body);

    // Find the user by subdomain
    const user = await prisma.user.findUnique({
      where: { subdomain },
      include: {
        landingPage: {
          include: {
            sections: true,
          },
        },
      },
    });

    if (!user || !user.landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }

    // Check if contact form is enabled
    const contactSection = user.landingPage.sections.find(
      section => section.sectionType === 'CONTACT'
    );

    if (!contactSection?.config?.contactForm?.enabled) {
      return NextResponse.json(
        { error: 'Contact form is not enabled' },
        { status: 400 }
      );
    }

    // Store the form submission in database
    await prisma.contactFormSubmission.create({
      data: {
        landingPageId: user.landingPage.id,
        formData: formData,
        language,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // Here you could also send an email notification to the business owner
    // using the email service configured in your environment

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}