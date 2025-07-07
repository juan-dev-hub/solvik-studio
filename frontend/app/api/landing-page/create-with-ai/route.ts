import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createWithAISchema = z.object({
  selectedSections: z.array(z.string()),
  generatedContent: z.any().optional(),
  businessDescription: z.string(),
  language: z.enum(['es', 'en', 'fi']).default('es'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { selectedSections, generatedContent, businessDescription, language } = createWithAISchema.parse(body);

    // Check if user already has a landing page
    const existingLandingPage = await prisma.landingPage.findUnique({
      where: { userId: session.user.id },
    });

    if (existingLandingPage) {
      return NextResponse.json(
        { error: 'Ya tienes una landing page creada' },
        { status: 400 }
      );
    }

    // Create content structure based on generated content or defaults
    const content = {
      [language]: {
        title: generatedContent?.general?.title || 'Mi Negocio',
        subtitle: generatedContent?.general?.subtitle || 'Descripción de mi negocio',
        hero: generatedContent?.hero || {
          title: 'Bienvenido a mi negocio',
          subtitle: businessDescription,
          cta: 'Contáctanos'
        },
        benefits: generatedContent?.benefits || [
          { title: 'Calidad', description: 'Productos de alta calidad' },
          { title: 'Servicio', description: 'Atención personalizada' },
          { title: 'Precio', description: 'Precios competitivos' }
        ],
        testimonials: generatedContent?.testimonials || [
          { name: 'Cliente 1', text: 'Excelente servicio' },
          { name: 'Cliente 2', text: 'Muy recomendado' }
        ],
        contact: generatedContent?.contact || {
          phone: '+1234567890',
          email: 'info@minegocio.com',
          address: 'Dirección de mi negocio'
        }
      }
    };

    // Add other languages with basic translations
    if (language !== 'es') {
      content.es = {
        title: 'Mi Negocio',
        subtitle: 'Descripción de mi negocio',
        hero: {
          title: 'Bienvenido a mi negocio',
          subtitle: businessDescription,
          cta: 'Contáctanos'
        },
        benefits: [
          { title: 'Calidad', description: 'Productos de alta calidad' },
          { title: 'Servicio', description: 'Atención personalizada' },
          { title: 'Precio', description: 'Precios competitivos' }
        ],
        testimonials: [
          { name: 'Cliente 1', text: 'Excelente servicio' },
          { name: 'Cliente 2', text: 'Muy recomendado' }
        ],
        contact: {
          phone: '+1234567890',
          email: 'info@minegocio.com',
          address: 'Dirección de mi negocio'
        }
      };
    }

    if (language !== 'en') {
      content.en = {
        title: 'My Business',
        subtitle: 'My business description',
        hero: {
          title: 'Welcome to my business',
          subtitle: businessDescription,
          cta: 'Contact us'
        },
        benefits: [
          { title: 'Quality', description: 'High quality products' },
          { title: 'Service', description: 'Personalized attention' },
          { title: 'Price', description: 'Competitive prices' }
        ],
        testimonials: [
          { name: 'Customer 1', text: 'Excellent service' },
          { name: 'Customer 2', text: 'Highly recommended' }
        ],
        contact: {
          phone: '+1234567890',
          email: 'info@mybusiness.com',
          address: 'My business address'
        }
      };
    }

    if (language !== 'fi') {
      content.fi = {
        title: 'Yritykseni',
        subtitle: 'Yritykseni kuvaus',
        hero: {
          title: 'Tervetuloa yritykseeni',
          subtitle: businessDescription,
          cta: 'Ota yhteyttä'
        },
        benefits: [
          { title: 'Laatu', description: 'Korkealaatuiset tuotteet' },
          { title: 'Palvelu', description: 'Henkilökohtainen palvelu' },
          { title: 'Hinta', description: 'Kilpailukykyiset hinnat' }
        ],
        testimonials: [
          { name: 'Asiakas 1', text: 'Erinomainen palvelu' },
          { name: 'Asiakas 2', text: 'Erittäin suositeltava' }
        ],
        contact: {
          phone: '+358 XX XXX XXXX',
          email: 'info@yritykseni.fi',
          address: 'Yritykseni osoite'
        }
      };
    }

    const defaultColorScheme = {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937',
    };

    // Create landing page
    const landingPage = await prisma.landingPage.create({
      data: {
        userId: session.user.id,
        content: content,
        colorScheme: defaultColorScheme,
        seoKeywords: generatedContent?.seoKeywords || '',
        isPublished: true, // Auto-publish since it's generated
      },
    });

    // Create sections based on selected sections
    const sectionOrder = ['HERO', 'CATALOG', 'BENEFITS', 'TESTIMONIALS', 'MAP', 'CONTACT', 'FOOTER'];
    
    for (const sectionType of selectedSections) {
      let config: any = {};
      
      // Add specific config for contact form
      if (sectionType === 'CONTACT_FORM') {
        config = {
          contactForm: generatedContent?.contactForm || {
            enabled: true,
            title: {
              es: 'Contáctanos',
              en: 'Contact Us',
              fi: 'Ota yhteyttä'
            },
            subtitle: {
              es: 'Envíanos un mensaje y te responderemos pronto',
              en: 'Send us a message and we\'ll get back to you soon',
              fi: 'Lähetä meille viesti, niin vastaamme pian'
            },
            fields: [
              { id: 'name', type: 'text', label: { es: 'Nombre', en: 'Name', fi: 'Nimi' }, required: true, enabled: true },
              { id: 'phone', type: 'tel', label: { es: 'Teléfono', en: 'Phone', fi: 'Puhelin' }, required: true, enabled: true },
              { id: 'email', type: 'email', label: { es: 'Email', en: 'Email', fi: 'Sähköposti' }, required: false, enabled: true },
              { id: 'message', type: 'textarea', label: { es: 'Mensaje', en: 'Message', fi: 'Viesti' }, required: true, enabled: true }
            ],
            submitButton: {
              es: 'Enviar Mensaje',
              en: 'Send Message',
              fi: 'Lähetä viesti'
            },
            successMessage: {
              es: '¡Gracias! Tu mensaje ha sido enviado correctamente.',
              en: 'Thank you! Your message has been sent successfully.',
              fi: 'Kiitos! Viestisi on lähetetty onnistuneesti.'
            }
          }
        };
        
        // For contact form, we actually create a CONTACT section with form config
        await prisma.landingPageSection.create({
          data: {
            landingPageId: landingPage.id,
            sectionType: 'CONTACT',
            isEnabled: true,
            order: sectionOrder.indexOf('CONTACT') + 1,
            config: config,
          },
        });
      } else {
        await prisma.landingPageSection.create({
          data: {
            landingPageId: landingPage.id,
            sectionType: sectionType,
            isEnabled: true,
            order: sectionOrder.indexOf(sectionType) + 1,
            config: config,
          },
        });
      }
    }

    // Always add footer if not already included
    if (!selectedSections.includes('FOOTER')) {
      await prisma.landingPageSection.create({
        data: {
          landingPageId: landingPage.id,
          sectionType: 'FOOTER',
          isEnabled: true,
          order: sectionOrder.indexOf('FOOTER') + 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      landingPageId: landingPage.id,
      message: 'Landing page creada exitosamente'
    });
  } catch (error) {
    console.error('Create landing page with AI error:', error);
    
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