import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { LandingPageTemplate } from '@/components/landing-page-template';

interface LandingPageProps {
  params: {
    subdomain: string;
  };
  searchParams: {
    lang?: string;
  };
}

async function getLandingPage(subdomain: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { subdomain },
      include: {
        landingPage: {
          include: {
            sections: true,
            images: true,
          },
        },
      },
    });

    if (!user || !user.landingPage || !user.landingPage.isPublished) {
      return null;
    }

    // Parse JSON fields
    const landingPage = {
      ...user.landingPage,
      content: JSON.parse(user.landingPage.content),
      colorScheme: JSON.parse(user.landingPage.colorScheme || '{}'),
    };

    return landingPage;
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: LandingPageProps) {
  const landingPage = await getLandingPage(params.subdomain);
  
  if (!landingPage) {
    return {
      title: 'Página no encontrada',
    };
  }

  const content = landingPage.content as any;
  const lang = searchParams.lang || 'es';
  const langContent = content[lang] || content.es;

  return {
    title: langContent.title || 'Mi Negocio',
    description: langContent.subtitle || 'Página de mi negocio',
    keywords: landingPage.seoKeywords || '',
  };
}

export default async function LandingPage({ params, searchParams }: LandingPageProps) {
  const landingPage = await getLandingPage(params.subdomain);
  
  if (!landingPage) {
    notFound();
  }

  const language = (searchParams.lang as 'es' | 'en' | 'fi') || 'es';

  return (
    <LandingPageTemplate 
      landingPage={landingPage}
      language={language}
      isPreview={false}
    />
  );
}