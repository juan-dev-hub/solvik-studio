import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateLandingPageSchema = z.object({
  content: z.record(z.any()).optional(),
  colorScheme: z.record(z.any()).optional(),
  seoKeywords: z.string().optional(),
  isPublished: z.boolean().optional(),
  sections: z.array(z.object({
    sectionType: z.enum(['HERO', 'CATALOG', 'BENEFITS', 'TESTIMONIALS', 'MAP', 'CONTACT', 'FOOTER']),
    isEnabled: z.boolean(),
    config: z.record(z.any()).optional(),
  })).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const landingPage = await prisma.landingPage.findUnique({
      where: { userId: session.user.id },
      include: {
        sections: true,
        images: true,
      },
    });

    if (!landingPage) {
      // Create default landing page
      const defaultContent = {
        es: {
          title: 'Mi Negocio',
          subtitle: 'Descripción de mi negocio',
          hero: {
            title: 'Bienvenido a mi negocio',
            subtitle: 'Ofrecemos los mejores productos y servicios',
            cta: 'Contáctanos',
          },
          benefits: [
            { title: 'Calidad', description: 'Productos de alta calidad' },
            { title: 'Servicio', description: 'Atención personalizada' },
            { title: 'Precio', description: 'Precios competitivos' },
          ],
          testimonials: [
            { name: 'Cliente 1', text: 'Excelente servicio' },
            { name: 'Cliente 2', text: 'Muy recomendado' },
          ],
          contact: {
            phone: '+1234567890',
            email: 'info@minegocio.com',
            address: 'Dirección de mi negocio',
          },
        },
        en: {
          title: 'My Business',
          subtitle: 'My business description',
          hero: {
            title: 'Welcome to my business',
            subtitle: 'We offer the best products and services',
            cta: 'Contact us',
          },
          benefits: [
            { title: 'Quality', description: 'High quality products' },
            { title: 'Service', description: 'Personalized attention' },
            { title: 'Price', description: 'Competitive prices' },
          ],
          testimonials: [
            { name: 'Customer 1', text: 'Excellent service' },
            { name: 'Customer 2', text: 'Highly recommended' },
          ],
          contact: {
            phone: '+1234567890',
            email: 'info@mybusiness.com',
            address: 'My business address',
          },
        },
        fi: {
          title: 'Yritykseni',
          subtitle: 'Yritykseni kuvaus',
          hero: {
            title: 'Tervetuloa yritykseeni',
            subtitle: 'Tarjoamme parhaat tuotteet ja palvelut',
            cta: 'Ota yhteyttä',
          },
          benefits: [
            { title: 'Laatu', description: 'Korkealaatuiset tuotteet' },
            { title: 'Palvelu', description: 'Henkilökohtainen palvelu' },
            { title: 'Hinta', description: 'Kilpailukykyiset hinnat' },
          ],
          testimonials: [
            { name: 'Asiakas 1', text: 'Erinomainen palvelu' },
            { name: 'Asiakas 2', text: 'Erittäin suositeltava' },
          ],
          contact: {
            phone: '+1234567890',
            email: 'info@yritykseni.com',
            address: 'Yritykseni osoite',
          },
        },
      };

      const defaultColorScheme = {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1F2937',
      };

      const defaultLandingPage = await prisma.landingPage.create({
        data: {
          userId: session.user.id,
          content: defaultContent,
          colorScheme: defaultColorScheme,
        },
      });

      // Create default sections
      const defaultSections = [
        { sectionType: 'HERO', isEnabled: true, order: 1 },
        { sectionType: 'CATALOG', isEnabled: true, order: 2 },
        { sectionType: 'BENEFITS', isEnabled: true, order: 3 },
        { sectionType: 'TESTIMONIALS', isEnabled: true, order: 4 },
        { sectionType: 'MAP', isEnabled: true, order: 5 },
        { sectionType: 'CONTACT', isEnabled: true, order: 6 },
        { sectionType: 'FOOTER', isEnabled: true, order: 7 },
      ];

      for (const section of defaultSections) {
        await prisma.landingPageSection.create({
          data: {
            landingPageId: defaultLandingPage.id,
            sectionType: section.sectionType,
            isEnabled: section.isEnabled,
            order: section.order,
          },
        });
      }

      // Fetch the complete landing page with relations
      const completeLandingPage = await prisma.landingPage.findUnique({
        where: { id: defaultLandingPage.id },
        include: {
          sections: true,
          images: true,
        },
      });

      return NextResponse.json(completeLandingPage);
    }

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error('Get landing page error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateLandingPageSchema.parse(body);

    const landingPage = await prisma.landingPage.findUnique({
      where: { userId: session.user.id },
    });

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page no encontrada' },
        { status: 404 }
      );
    }

    // Update landing page
    const updateData: any = {};
    if (data.content) updateData.content = data.content;
    if (data.colorScheme) updateData.colorScheme = data.colorScheme;
    if (data.seoKeywords !== undefined) updateData.seoKeywords = data.seoKeywords;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;

    const updatedLandingPage = await prisma.landingPage.update({
      where: { id: landingPage.id },
      data: updateData,
    });

    // Update sections if provided
    if (data.sections) {
      for (const section of data.sections) {
        await prisma.landingPageSection.upsert({
          where: {
            landingPageId_sectionType: {
              landingPageId: landingPage.id,
              sectionType: section.sectionType,
            },
          },
          update: {
            isEnabled: section.isEnabled,
            config: section.config || null,
          },
          create: {
            landingPageId: landingPage.id,
            sectionType: section.sectionType,
            isEnabled: section.isEnabled,
            order: ['HERO', 'CATALOG', 'BENEFITS', 'TESTIMONIALS', 'MAP', 'CONTACT', 'FOOTER'].indexOf(section.sectionType) + 1,
            config: section.config || null,
          },
        });
      }
    }

    return NextResponse.json(updatedLandingPage);
  } catch (error) {
    console.error('Update landing page error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}