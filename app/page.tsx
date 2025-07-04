'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  Smartphone, 
  Palette, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  Check,
  Languages,
  Menu,
  X,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Sparkles,
  Bot,
  Wand2,
  Crown,
  MonitorPlay,
  Settings,
  FileText,
  BarChart3
} from 'lucide-react';

type Language = 'es' | 'en' | 'fi';

interface Content {
  nav: {
    features: string;
    pricing: string;
    signin: string;
    signup: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    aiPowered: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  benefits: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      text: string;
      name: string;
      company: string;
    }>;
  };
  pricing: {
    title: string;
    subtitle: string;
    monthly: {
      name: string;
      price: string;
      description: string;
    };
    lifetime: {
      name: string;
      price: string;
      description: string;
      popular: string;
    };
    cta: string;
  };
  footer: {
    description: string;
    rights: string;
  };
}

const content: Record<Language, Content> = {
  es: {
    nav: {
      features: 'Características',
      pricing: 'Precios',
      signin: 'Iniciar Sesión',
      signup: 'Registrarse'
    },
    hero: {
      title: 'Crea tu Landing Page Profesional',
      subtitle: 'En 5 minutos, sin código',
      description: 'La plataforma más simple para que pequeños negocios tengan presencia online profesional. Hosting incluido, multiidioma automático y soporte 24/7.',
      cta: 'Crear Mi Sitio Web',
      aiPowered: 'Powered by Claude AI - Contenido generado automáticamente'
    },
    features: {
      title: 'Todo lo que necesitas para estar online',
      subtitle: 'Herramientas profesionales diseñadas para pequeños negocios',
      items: [
        {
          title: 'Generación con IA',
          description: 'Claude AI crea todo el contenido profesional automáticamente basado en tu descripción'
        },
        {
          title: 'Multiidioma Automático',
          description: 'Tu sitio web en español, inglés y finés sin configuración adicional'
        },
        {
          title: 'Hosting Ultra-rápido',
          description: 'Alojado en Finlandia con 99.9% uptime y máxima privacidad'
        },
        {
          title: 'Dominio Incluido',
          description: 'Tu subdominio tunegocio.solvik.app gratis para siempre'
        },
        {
          title: 'Editor Visual',
          description: 'Interfaz simple como "editar perfil" - sin complicaciones técnicas'
        },
        {
          title: 'SSL y Seguridad',
          description: 'Certificado SSL gratuito y máxima seguridad desde el primer día'
        }
      ]
    },
    benefits: {
      title: 'Por qué elegir Solvik',
      subtitle: 'Ventajas que marcan la diferencia',
      items: [
        {
          title: 'Simplicidad Extrema',
          description: 'No necesitas conocimientos técnicos. Si sabes usar Facebook, sabes usar Solvik.'
        },
        {
          title: 'Resultados Inmediatos',
          description: 'Tu landing page estará online en menos de 5 minutos, no en semanas.'
        },
        {
          title: 'Soporte Humano',
          description: 'Equipo real disponible 24/7 para ayudarte cuando lo necesites.'
        },
        {
          title: 'Precio Justo',
          description: 'Sin costos ocultos ni sorpresas. Paga solo por lo que usas.'
        }
      ]
    },
    testimonials: {
      title: 'Lo que dicen nuestros clientes',
      subtitle: 'Testimonios reales de negocios que ya están online',
      items: [
        {
          text: 'En 4 minutos tenía mi landing page funcionando. Mis ventas aumentaron 40% el primer mes.',
          name: 'María González',
          company: 'Panadería La Esquina'
        },
        {
          text: 'Dejé de perder clientes que no me encontraban online. Solvik cambió mi negocio.',
          name: 'Carlos Ruiz',
          company: 'Taller Mecánico CR'
        },
        {
          text: 'Súper fácil de usar. Mi hija de 15 años me ayudó a configurarlo en una tarde.',
          name: 'Ana López',
          company: 'Peluquería Estilo'
        }
      ]
    },
    pricing: {
      title: 'Precios simples y transparentes',
      subtitle: 'Elige el plan que mejor se adapte a tu negocio',
      monthly: {
        name: 'Plan Mensual',
        price: '$9',
        description: 'Perfecto para probar'
      },
      lifetime: {
        name: 'Plan Pro',
        price: '$97',
        description: 'Pago único - Acceso de por vida',
        popular: 'Más Popular'
      },
      cta: 'Ver Todos los Precios'
    },
    footer: {
      description: 'Solvik Studio - La forma más simple de tener presencia online profesional',
      rights: 'Todos los derechos reservados. Alojado en Finlandia'
    }
  },
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      signin: 'Sign In',
      signup: 'Sign Up'
    },
    hero: {
      title: 'Create Your Professional Landing Page',
      subtitle: 'In 5 minutes, no code required',
      description: 'The simplest platform for small businesses to have professional online presence. Hosting included, automatic multilingual and 24/7 support.',
      cta: 'Create My Website',
      aiPowered: 'Powered by Claude AI - Content generated automatically'
    },
    features: {
      title: 'Everything you need to be online',
      subtitle: 'Professional tools designed for small businesses',
      items: [
        {
          title: 'AI Generation',
          description: 'Claude AI creates all professional content automatically based on your description'
        },
        {
          title: 'Automatic Multilingual',
          description: 'Your website in Spanish, English and Finnish without additional configuration'
        },
        {
          title: 'Ultra-fast Hosting',
          description: 'Hosted in Finland with 99.9% uptime and maximum privacy'
        },
        {
          title: 'Domain Included',
          description: 'Your subdomain yourbusiness.solvik.app free forever'
        },
        {
          title: 'Visual Editor',
          description: 'Simple interface like "edit profile" - no technical complications'
        },
        {
          title: 'SSL & Security',
          description: 'Free SSL certificate and maximum security from day one'
        }
      ]
    },
    benefits: {
      title: 'Why choose Solvik',
      subtitle: 'Advantages that make the difference',
      items: [
        {
          title: 'Extreme Simplicity',
          description: 'No technical knowledge needed. If you can use Facebook, you can use Solvik.'
        },
        {
          title: 'Immediate Results',
          description: 'Your landing page will be online in less than 5 minutes, not weeks.'
        },
        {
          title: 'Human Support',
          description: 'Real team available 24/7 to help you when you need it.'
        },
        {
          title: 'Fair Price',
          description: 'No hidden costs or surprises. Pay only for what you use.'
        }
      ]
    },
    testimonials: {
      title: 'What our customers say',
      subtitle: 'Real testimonials from businesses already online',
      items: [
        {
          text: 'In 4 minutes I had my landing page working. My sales increased 40% the first month.',
          name: 'Maria Gonzalez',
          company: 'La Esquina Bakery'
        },
        {
          text: 'I stopped losing customers who couldn\'t find me online. Solvik changed my business.',
          name: 'Carlos Ruiz',
          company: 'CR Auto Shop'
        },
        {
          text: 'Super easy to use. My 15-year-old daughter helped me set it up in one afternoon.',
          name: 'Ana Lopez',
          company: 'Style Hair Salon'
        }
      ]
    },
    pricing: {
      title: 'Simple and transparent pricing',
      subtitle: 'Choose the plan that best fits your business',
      monthly: {
        name: 'Monthly Plan',
        price: '$9',
        description: 'Perfect for testing'
      },
      lifetime: {
        name: 'Pro Plan',
        price: '$97',
        description: 'One-time payment - Lifetime access',
        popular: 'Most Popular'
      },
      cta: 'View All Pricing'
    },
    footer: {
      description: 'Solvik Studio - The simplest way to have professional online presence',
      rights: 'All rights reserved. Hosted in Finland'
    }
  },
  fi: {
    nav: {
      features: 'Ominaisuudet',
      pricing: 'Hinnoittelu',
      signin: 'Kirjaudu',
      signup: 'Rekisteröidy'
    },
    hero: {
      title: 'Luo Ammattimainen Laskeutumissivu',
      subtitle: '5 minuutissa, ei koodia tarvita',
      description: 'Yksinkertaisin alusta pienille yrityksille ammattimaisen verkkoläsnäolon saamiseksi. Hosting mukana, automaattinen monikielisyys ja 24/7 tuki.',
      cta: 'Luo Verkkosivuni',
      aiPowered: 'Powered by Claude AI - Sisältö luotu automaattisesti'
    },
    features: {
      title: 'Kaikki mitä tarvitset verkossa olemiseen',
      subtitle: 'Ammattimaiset työkalut pienille yrityksille',
      items: [
        {
          title: 'Tekoäly Generointi',
          description: 'Claude AI luo kaiken ammattimaisen sisällön automaattisesti kuvauksesi perusteella'
        },
        {
          title: 'Automaattinen Monikielisyys',
          description: 'Verkkosivustosi espanjaksi, englanniksi ja suomeksi ilman lisäkonfiguraatiota'
        },
        {
          title: 'Ultranopea Hosting',
          description: 'Isännöity Suomessa 99.9% käyttöajalla ja maksimiyksityisyydellä'
        },
        {
          title: 'Domain Mukana',
          description: 'Alidomainisi yrityksesi.solvik.app ilmaiseksi ikuisesti'
        },
        {
          title: 'Visuaalinen Editori',
          description: 'Yksinkertainen käyttöliittymä kuten "muokkaa profiilia" - ei teknisiä komplikaatioita'
        },
        {
          title: 'SSL ja Turvallisuus',
          description: 'Ilmainen SSL-sertifikaatti ja maksimi turvallisuus ensimmäisestä päivästä'
        }
      ]
    },
    benefits: {
      title: 'Miksi valita Solvik',
      subtitle: 'Edut jotka tekevät eron',
      items: [
        {
          title: 'Äärimmäinen Yksinkertaisuus',
          description: 'Ei teknistä tietämystä tarvita. Jos osaat käyttää Facebookia, osaat käyttää Solvikia.'
        },
        {
          title: 'Välittömät Tulokset',
          description: 'Laskeutumissivusi on verkossa alle 5 minuutissa, ei viikoissa.'
        },
        {
          title: 'Inhimillinen Tuki',
          description: 'Todellinen tiimi saatavilla 24/7 auttamaan sinua kun tarvitset.'
        },
        {
          title: 'Reilu Hinta',
          description: 'Ei piilokustannuksia tai yllätyksiä. Maksa vain siitä mitä käytät.'
        }
      ]
    },
    testimonials: {
      title: 'Mitä asiakkaamme sanovat',
      subtitle: 'Todellisia kokemuksia jo verkossa olevista yrityksistä',
      items: [
        {
          text: '4 minuutissa minulla oli laskeutumissivu toiminnassa. Myyntini kasvoi 40% ensimmäisenä kuukautena.',
          name: 'Maria Gonzalez',
          company: 'La Esquina Leipomo'
        },
        {
          text: 'Lopetin asiakkaiden menettämisen jotka eivät löytäneet minua verkosta. Solvik muutti liiketoimintani.',
          name: 'Carlos Ruiz',
          company: 'CR Autokorjaamo'
        },
        {
          text: 'Erittäin helppokäyttöinen. 15-vuotias tyttäreni auttoi minua pystyttämään sen yhdessä iltapäivässä.',
          name: 'Ana Lopez',
          company: 'Style Kampaamo'
        }
      ]
    },
    pricing: {
      title: 'Yksinkertainen ja läpinäkyvä hinnoittelu',
      subtitle: 'Valitse yrityksellesi parhaiten sopiva suunnitelma',
      monthly: {
        name: 'Kuukausimaksu',
        price: '$9',
        description: 'Täydellinen testaamiseen'
      },
      lifetime: {
        name: 'Pro Suunnitelma',
        price: '$97',
        description: 'Kertamaksu - Elinikäinen pääsy',
        popular: 'Suosituin'
      },
      cta: 'Näytä Kaikki Hinnat'
    },
    footer: {
      description: 'Solvik Studio - Yksinkertaisin tapa saada ammattimainen verkkoläsnäolo',
      rights: 'Kaikki oikeudet pidätetään. Isännöity Suomessa'
    }
  }
};

export default function Homepage() {
  const [language, setLanguage] = useState<Language>('es');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentContent = content[language];

  // Close mobile menu when clicking outside or on links
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Function to scroll to section smoothly
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Windows 10 Style with Solvik Colors */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src="/logo.jpg"
                  alt="Solvik Logo"
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-gray-900">Solvik</span>
                <span className="text-xs text-gray-500">Studio</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                {currentContent.nav.features}
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                {currentContent.nav.pricing}
              </button>
              
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-gray-50 border border-gray-300 text-gray-700 rounded px-3 py-2 pr-8 appearance-none cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="es">🇪🇸 ES</option>
                  <option value="en">🇬🇧 EN</option>
                  <option value="fi">🇫🇮 FI</option>
                </select>
                <Languages className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Auth Buttons */}
              <Link href="/auth/signin">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  {currentContent.nav.signin}
                </Button>
              </Link>

              <Link href="/auth/signup">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  {currentContent.nav.signup}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 p-2 hover:bg-gray-100 rounded transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-4 bg-white">
              {/* Mobile Language Selector */}
              <div className="px-2">
                <label className="block text-sm text-gray-600 mb-2">Idioma / Language</label>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value as Language);
                    closeMobileMenu();
                  }}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-700 rounded px-3 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="fi">🇫🇮 Suomi</option>
                </select>
              </div>

              {/* Mobile Navigation Links */}
              <div className="px-2 space-y-3">
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  {currentContent.nav.features}
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="block w-full text-left py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  {currentContent.nav.pricing}
                </button>
                
                {/* Auth Buttons */}
                <Link href="/auth/signin" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3">
                    {currentContent.nav.signin}
                  </Button>
                </Link>

                <Link href="/auth/signup" onClick={closeMobileMenu}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg">
                    {currentContent.nav.signup}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Windows 10 Style with Solvik Colors */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {currentContent.hero.title}
                </h1>
                <p className="text-xl sm:text-2xl text-orange-600 font-semibold">
                  {currentContent.hero.subtitle}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {currentContent.hero.description}
                </p>
              </div>

              {/* AI Badge */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md">
                <p className="text-sm font-medium flex items-center gap-2 text-purple-800">
                  <Bot className="w-5 h-5" />
                  {currentContent.hero.aiPowered}
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                    {currentContent.hero.cta}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2 transition-colors"
                >
                  Ver características →
                </button>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8 border border-gray-200">
                <div className="space-y-6">
                  {/* Mock Browser */}
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500">
                        tunegocio.solvik.app
                      </div>
                    </div>
                    <div className="bg-white rounded p-4 space-y-3">
                      <div className="h-4 bg-orange-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-8 bg-orange-600 rounded w-32"></div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">5min</div>
                      <div className="text-xs text-gray-600">Setup</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">99.9%</div>
                      <div className="text-xs text-gray-600">Uptime</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">24/7</div>
                      <div className="text-xs text-gray-600">Soporte</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.features.items.map((feature, index) => {
              const icons = [Bot, Languages, Zap, Globe, MonitorPlay, Shield];
              const IconComponent = icons[index % icons.length];
              
              return (
                <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow bg-white">
                  <CardHeader>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.benefits.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.benefits.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentContent.benefits.items.map((benefit, index) => {
              const icons = [Sparkles, Clock, Users, DollarSign];
              const IconComponent = icons[index % icons.length];
              
              return (
                <div key={index} className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.testimonials.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentContent.testimonials.items.map((testimonial, index) => (
              <Card key={index} className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {currentContent.pricing.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentContent.pricing.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Monthly Plan */}
            <Card className="border border-gray-200 bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {currentContent.pricing.monthly.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {currentContent.pricing.monthly.price}
                  </span>
                  <span className="text-gray-600 ml-2">/mes</span>
                </div>
                <CardDescription className="mt-2">
                  {currentContent.pricing.monthly.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Lifetime Plan */}
            <Card className="border-2 border-orange-500 bg-white hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {currentContent.pricing.lifetime.popular}
                </span>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {currentContent.pricing.lifetime.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {currentContent.pricing.lifetime.price}
                  </span>
                  <span className="text-gray-600 ml-2">una vez</span>
                </div>
                <CardDescription className="mt-2">
                  {currentContent.pricing.lifetime.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-12">
            <Link href="/pricing">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-lg">
                {currentContent.pricing.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            {/* Footer Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.jpg"
                  alt="Solvik Logo"
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-gray-900">Solvik</span>
                <span className="text-sm text-gray-500">Studio</span>
              </div>
            </div>
            
            <p className="text-gray-600 max-w-md mx-auto">
              {currentContent.footer.description}
            </p>
            
            <div className="border-t border-gray-200 pt-8">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Solvik Studio. {currentContent.footer.rights} 🇫🇮
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}