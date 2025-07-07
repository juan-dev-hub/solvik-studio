'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Calculator, ArrowRight, Sparkles, Languages, Menu, X } from 'lucide-react';
import { PRICING_PLANS, calculateSavings } from '@/lib/pricing-plans';

type Language = 'es' | 'en' | 'fi';

interface Content {
  nav: {
    features: string;
    pricing: string;
    signin: string;
    signup: string;
    home: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
  savings: {
    title: string;
    description: string;
  };
  comparison: {
    title: string;
    monthly: {
      title: string;
      points: string[];
    };
    lifetime: {
      title: string;
      points: string[];
    };
  };
  guarantee: {
    title: string;
    description: string;
  };
  powered: string;
  buttons: {
    monthly: string;
    lifetime: string;
    processing: string;
  };
}

const content: Record<Language, Content> = {
  es: {
    nav: {
      features: 'Características',
      pricing: 'Precios',
      signin: 'Iniciar Sesión',
      signup: 'Registrarse',
      home: 'Inicio'
    },
    header: {
      title: 'Elige tu Plan Perfecto',
      subtitle: 'Sin complicaciones regionales. Dos opciones simples para todo el mundo.'
    },
    savings: {
      title: 'Ahorro con Plan Pro:',
      description: 'Te ahorras'
    },
    comparison: {
      title: '¿Cuál es mejor para ti?',
      monthly: {
        title: 'Plan Mensual ($9/mes)',
        points: [
          'Quieres probar primero',
          'Presupuesto ajustado',
          'Negocio temporal/estacional',
          'Flexibilidad para cancelar'
        ]
      },
      lifetime: {
        title: 'Plan Pro ($97 una vez)',
        points: [
          'Negocio establecido',
          'Quieres ahorrar dinero',
          'Planeas usar por años',
          'Máximo valor por tu dinero'
        ]
      }
    },
    guarantee: {
      title: 'Garantía de 30 días',
      description: 'Si no estás satisfecho, te devolvemos tu dinero. Sin preguntas.'
    },
    powered: 'Pagos seguros procesados por Lemon Squeezy',
    buttons: {
      monthly: 'Empezar Mensual',
      lifetime: 'Comprar Lifetime',
      processing: 'Procesando...'
    }
  },
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      signin: 'Sign In',
      signup: 'Sign Up',
      home: 'Home'
    },
    header: {
      title: 'Choose Your Perfect Plan',
      subtitle: 'No regional complications. Two simple options for everyone worldwide.'
    },
    savings: {
      title: 'Savings with Pro Plan:',
      description: 'You save'
    },
    comparison: {
      title: 'Which is better for you?',
      monthly: {
        title: 'Monthly Plan ($9/month)',
        points: [
          'Want to try first',
          'Tight budget',
          'Temporary/seasonal business',
          'Flexibility to cancel'
        ]
      },
      lifetime: {
        title: 'Pro Plan ($97 once)',
        points: [
          'Established business',
          'Want to save money',
          'Plan to use for years',
          'Maximum value for your money'
        ]
      }
    },
    guarantee: {
      title: '30-day guarantee',
      description: 'If you\'re not satisfied, we\'ll refund your money. No questions asked.'
    },
    powered: 'Secure payments processed by Lemon Squeezy',
    buttons: {
      monthly: 'Start Monthly',
      lifetime: 'Buy Lifetime',
      processing: 'Processing...'
    }
  },
  fi: {
    nav: {
      features: 'Ominaisuudet',
      pricing: 'Hinnoittelu',
      signin: 'Kirjaudu',
      signup: 'Rekisteröidy',
      home: 'Koti'
    },
    header: {
      title: 'Valitse Täydellinen Suunnitelma',
      subtitle: 'Ei alueellisia komplikaatioita. Kaksi yksinkertaista vaihtoehtoa kaikille maailmanlaajuisesti.'
    },
    savings: {
      title: 'Säästöt Pro-suunnitelmalla:',
      description: 'Säästät'
    },
    comparison: {
      title: 'Kumpi on parempi sinulle?',
      monthly: {
        title: 'Kuukausimaksu ($9/kk)',
        points: [
          'Haluat kokeilla ensin',
          'Tiukka budjetti',
          'Väliaikainen/kausiluonteinen yritys',
          'Joustavuus peruuttaa'
        ]
      },
      lifetime: {
        title: 'Pro-suunnitelma ($97 kerran)',
        points: [
          'Vakiintunut yritys',
          'Haluat säästää rahaa',
          'Aiot käyttää vuosia',
          'Maksimi arvo rahoillesi'
        ]
      }
    },
    guarantee: {
      title: '30 päivän takuu',
      description: 'Jos et ole tyytyväinen, palautamme rahasi. Ei kysymyksiä.'
    },
    powered: 'Turvalliset maksut käsittelee Lemon Squeezy',
    buttons: {
      monthly: 'Aloita Kuukausimaksu',
      lifetime: 'Osta Lifetime',
      processing: 'Käsitellään...'
    }
  }
};

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('es');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const currentContent = content[language];
  const monthlyPlan = PRICING_PLANS.find(plan => plan.interval === 'month');
  const lifetimePlan = PRICING_PLANS.find(plan => plan.interval === 'lifetime');
  
  const savings = monthlyPlan && lifetimePlan 
    ? calculateSavings(monthlyPlan.price, lifetimePlan.price)
    : null;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSelectPlan = async (planId: string) => {
    if (!session) {
      // Redirect to signup if not authenticated
      router.push('/auth/signup');
      return;
    }

    setIsLoading(planId);
    
    try {
      // Create checkout session with Lemon Squeezy
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      if (response.ok) {
        const { checkoutUrl } = await response.json();
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Error creating checkout session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error al procesar el pago. Inténtalo de nuevo.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
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
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                {currentContent.nav.home}
              </Link>
              
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

              {session ? (
                <Button
                  onClick={() => router.push('/admin')}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Ir al Panel
                </Button>
              ) : (
                <Link href="/auth/signup">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    {currentContent.nav.signup}
                  </Button>
                </Link>
              )}
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
                <Link href="/" onClick={closeMobileMenu} className="block w-full text-left py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium">
                  {currentContent.nav.home}
                </Link>
                
                {/* Auth Buttons */}
                <Link href="/auth/signin" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3">
                    {currentContent.nav.signin}
                  </Button>
                </Link>

                {session ? (
                  <Button
                    onClick={() => {
                      router.push('/admin');
                      closeMobileMenu();
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg"
                  >
                    Ir al Panel
                  </Button>
                ) : (
                  <Link href="/auth/signup" onClick={closeMobileMenu}>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg">
                      {currentContent.nav.signup}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {currentContent.header.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {currentContent.header.subtitle}
          </p>
        </div>

        {/* Calculadora de ahorro */}
        {savings && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">{currentContent.savings.title}</span>
            </div>
            <p className="text-sm text-green-700">
              {currentContent.savings.description} <strong>${savings.yearSavings}</strong> en el primer año 
              ({savings.percentageSavings}% de descuento)
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Mensual */}
          {monthlyPlan && (
            <Card className="relative transition-all duration-300 hover:shadow-lg border border-gray-200">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Zap className="w-6 h-6 text-orange-500" />
                  {monthlyPlan.name}
                </CardTitle>
                
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${monthlyPlan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/mes</span>
                </div>
                
                <CardDescription className="mt-2">
                  Perfecto para probar sin compromiso
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {monthlyPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleSelectPlan(monthlyPlan.id)}
                  disabled={isLoading === monthlyPlan.id}
                >
                  {isLoading === monthlyPlan.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {currentContent.buttons.processing}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {currentContent.buttons.monthly}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  Cancela cuando quieras
                </p>
              </CardContent>
            </Card>
          )}

          {/* Plan Lifetime */}
          {lifetimePlan && (
            <Card className="relative transition-all duration-300 hover:shadow-lg border-2 border-orange-500 shadow-lg scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-600 text-white px-4 py-1">
                  <Crown className="w-4 h-4 mr-1" />
                  Más Popular
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Crown className="w-6 h-6 text-purple-500" />
                  {lifetimePlan.name}
                </CardTitle>
                
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${lifetimePlan.price}
                  </span>
                  <span className="text-gray-600 ml-2">una vez</span>
                </div>
                
                {savings && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    Equivale a ${Math.round(lifetimePlan.price / 12)}/mes el primer año
                  </p>
                )}
                
                <CardDescription className="mt-2">
                  La mejor inversión para tu negocio
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {lifetimePlan.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleSelectPlan(lifetimePlan.id)}
                  disabled={isLoading === lifetimePlan.id}
                >
                  {isLoading === lifetimePlan.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {currentContent.buttons.processing}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      {currentContent.buttons.lifetime}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Comparación directa */}
        <div className="mt-12 bg-white rounded-lg border p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-center mb-4">
            {currentContent.comparison.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="text-center">
              <div className="bg-orange-100 rounded-lg p-4 mb-3">
                <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-semibold">{currentContent.comparison.monthly.title}</h4>
              </div>
              <ul className="text-left space-y-1 text-gray-600">
                {currentContent.comparison.monthly.points.map((point, index) => (
                  <li key={index}>✅ {point}</li>
                ))}
              </ul>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-lg p-4 mb-3">
                <Crown className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-semibold">{currentContent.comparison.lifetime.title}</h4>
              </div>
              <ul className="text-left space-y-1 text-gray-600">
                {currentContent.comparison.lifetime.points.map((point, index) => (
                  <li key={index}>✅ {point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Garantía */}
        <div className="text-center mt-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="font-semibold text-green-800 mb-2">
              🛡️ {currentContent.guarantee.title}
            </h4>
            <p className="text-sm text-green-700">
              {currentContent.guarantee.description}
            </p>
          </div>
        </div>

        {/* Powered by Lemon Squeezy */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            {currentContent.powered}
          </p>
        </div>
      </div>
    </div>
  );
}