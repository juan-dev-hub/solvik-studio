'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Loader2,
  Wand2,
  Globe,
  ShoppingBag,
  Star,
  MessageSquare,
  MapPin,
  Mail,
  FileText
} from 'lucide-react';

interface Section {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  required?: boolean;
}

const AVAILABLE_SECTIONS: Section[] = [
  {
    id: 'HERO',
    name: 'Sección Principal',
    description: 'Título, subtítulo y llamada a la acción principal',
    icon: <Globe className="w-5 h-5" />,
    required: true
  },
  {
    id: 'CATALOG',
    name: 'Catálogo de Productos',
    description: 'Muestra tus productos o servicios principales',
    icon: <ShoppingBag className="w-5 h-5" />
  },
  {
    id: 'BENEFITS',
    name: 'Por qué Elegirnos',
    description: 'Beneficios y ventajas de tu negocio',
    icon: <Star className="w-5 h-5" />
  },
  {
    id: 'TESTIMONIALS',
    name: 'Testimonios',
    description: 'Opiniones y reseñas de clientes satisfechos',
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    id: 'MAP',
    name: 'Ubicación',
    description: 'Dirección y mapa de tu negocio',
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 'CONTACT',
    name: 'Información de Contacto',
    description: 'Teléfono, email y horarios de atención',
    icon: <Mail className="w-5 h-5" />
  },
  {
    id: 'CONTACT_FORM',
    name: 'Formulario de Contacto',
    description: 'Permite que los visitantes te envíen mensajes',
    icon: <FileText className="w-5 h-5" />
  }
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [selectedSections, setSelectedSections] = useState<string[]>(['HERO']);
  const [businessDescription, setBusinessDescription] = useState('');
  const [language, setLanguage] = useState('es');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSectionToggle = (sectionId: string) => {
    if (sectionId === 'HERO') return; // Hero is required
    
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleGenerateContent = async () => {
    if (!businessDescription.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessDescription,
          selectedSections,
          language
        })
      });
      
      if (response.ok) {
        const content = await response.json();
        setGeneratedContent(content);
        setStep(3);
      } else {
        throw new Error('Error generating content');
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback to manual content creation
      setStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateLandingPage = async () => {
    setIsCreating(true);
    
    try {
      // Create landing page with generated content
      const response = await fetch('/api/landing-page/create-with-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedSections,
          generatedContent,
          businessDescription,
          language
        })
      });
      
      if (response.ok) {
        router.push('/admin?welcome=true');
      } else {
        throw new Error('Error creating landing page');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Empecemos - Configura tu landing page';
      case 2: return 'Describe tu negocio';
      case 3: return 'Revisa y personaliza';
      default: return 'Configuración';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Selecciona las secciones que quieres incluir en tu landing page';
      case 2: return 'Cuéntanos sobre tu negocio para generar contenido profesional automáticamente';
      case 3: return 'Revisa el contenido generado y ajústalo si es necesario';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Solvik</h1>
                <p className="text-sm text-gray-600">{session?.user?.subdomain}.solvik.app</p>
              </div>
            </div>
            
            {/* Progress */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum === step
                      ? 'bg-orange-600 text-white'
                      : stepNum < step
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNum < step ? <CheckCircle className="w-4 h-4" /> : stepNum}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{getStepTitle()}</h2>
          <p className="text-lg text-gray-600">{getStepDescription()}</p>
        </div>

        {/* Step 1: Section Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-600" />
                Selecciona las secciones de tu landing page
              </CardTitle>
              <CardDescription>
                Elige qué información quieres mostrar a tus visitantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_SECTIONS.map((section) => (
                  <div
                    key={section.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSections.includes(section.id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${section.required ? 'opacity-75' : ''}`}
                    onClick={() => handleSectionToggle(section.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedSections.includes(section.id)}
                        disabled={section.required}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {section.icon}
                          <h3 className="font-medium text-gray-900">{section.name}</h3>
                          {section.required && (
                            <Badge variant="secondary" className="text-xs">Obligatorio</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {selectedSections.length} secciones seleccionadas
                </p>
                <Button
                  onClick={() => setStep(2)}
                  disabled={selectedSections.length === 0}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Business Description */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Describe tu negocio
              </CardTitle>
              <CardDescription>
                Nuestra IA creará contenido profesional automáticamente basado en tu descripción
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div>
                <Label htmlFor="language">Idioma principal</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="fi">🇫🇮 Suomi</option>
                </select>
              </div>

              {/* Business Description */}
              <div>
                <Label htmlFor="description">Describe tu negocio</Label>
                <Textarea
                  id="description"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Ejemplo: Tengo una pizzería en Barcelona que hace pizza artesanal con ingredientes importados de Italia. Ofrecemos entrega a domicilio y también tenemos mesas para comer en el local."
                  rows={4}
                  className="mt-1"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Incluye qué vendes, dónde estás ubicado, qué te hace especial, etc.
                </p>
              </div>

              {/* Selected Sections Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Contenido que se generará para:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSections.map((sectionId) => {
                    const section = AVAILABLE_SECTIONS.find(s => s.id === sectionId);
                    return (
                      <Badge key={sectionId} variant="outline" className="flex items-center gap-1">
                        {section?.icon}
                        {section?.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Button>
                
                <Button
                  onClick={handleGenerateContent}
                  disabled={!businessDescription.trim() || isGenerating}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Generar Contenido con IA
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review Generated Content */}
        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  ¡Contenido generado exitosamente!
                </CardTitle>
                <CardDescription>
                  Revisa el contenido y ajústalo si es necesario. Puedes editarlo más tarde desde el panel de administración.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Generated Content Preview */}
            {generatedContent ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedSections.map((sectionId) => {
                  const section = AVAILABLE_SECTIONS.find(s => s.id === sectionId);
                  const content = generatedContent[sectionId.toLowerCase()];
                  
                  return (
                    <Card key={sectionId}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {section?.icon}
                          {section?.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {content && (
                          <div className="space-y-2 text-sm">
                            {content.title && (
                              <div>
                                <span className="font-medium text-gray-700">Título:</span>
                                <p className="text-gray-900">{content.title}</p>
                              </div>
                            )}
                            {content.subtitle && (
                              <div>
                                <span className="font-medium text-gray-700">Subtítulo:</span>
                                <p className="text-gray-900">{content.subtitle}</p>
                              </div>
                            )}
                            {content.description && (
                              <div>
                                <span className="font-medium text-gray-700">Descripción:</span>
                                <p className="text-gray-900">{content.description}</p>
                              </div>
                            )}
                            {content.items && (
                              <div>
                                <span className="font-medium text-gray-700">Elementos:</span>
                                <ul className="list-disc list-inside text-gray-900 space-y-1">
                                  {content.items.map((item: any, index: number) => (
                                    <li key={index}>{item.title || item.text || item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-600 mb-4">
                    El contenido se generará manualmente en el panel de administración
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              
              <Button
                onClick={handleCreateLandingPage}
                disabled={isCreating}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Crear Mi Landing Page
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}