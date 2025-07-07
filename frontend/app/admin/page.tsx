'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Eye, 
  Save, 
  Palette, 
  Globe, 
  Image as ImageIcon,
  HelpCircle,
  Settings,
  MonitorPlay,
  Plus,
  Trash2,
  GripVertical,
  Mail
} from 'lucide-react';
import { LandingPageTemplate } from '@/components/landing-page-template';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('content');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [landingPage, setLandingPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('es');

  // Form states
  const [content, setContent] = useState<any>({});
  const [sections, setSections] = useState<any>({});
  const [colorScheme, setColorScheme] = useState<any>({});
  const [seoKeywords, setSeoKeywords] = useState('');

  // Contact form configuration
  const [contactForm, setContactForm] = useState({
    enabled: false,
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
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchLandingPage();
    }
  }, [status, router]);

  const fetchLandingPage = async () => {
    try {
      const response = await fetch('/api/landing-page');
      if (response.ok) {
        const data = await response.json();
        setLandingPage(data);
        setContent(data.content || {});
        setColorScheme(data.colorScheme || {});
        setSeoKeywords(data.seoKeywords || '');
        
        // Process sections
        const sectionsMap: any = {};
        data.sections?.forEach((section: any) => {
          sectionsMap[section.sectionType] = {
            isEnabled: section.isEnabled,
            config: section.config || {},
          };
        });
        setSections(sectionsMap);

        // Load contact form configuration if exists
        if (sectionsMap.CONTACT?.config?.contactForm) {
          setContactForm(sectionsMap.CONTACT.config.contactForm);
        }
      }
    } catch (error) {
      console.error('Error fetching landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sectionsArray = Object.entries(sections).map(([sectionType, data]: [string, any]) => {
        let config = data.config;
        
        // Add contact form config to CONTACT section
        if (sectionType === 'CONTACT') {
          config = {
            ...config,
            contactForm
          };
        }
        
        return {
          sectionType,
          isEnabled: data.isEnabled,
          config
        };
      });

      const response = await fetch('/api/landing-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          colorScheme,
          seoKeywords,
          sections: sectionsArray,
        }),
      });

      if (response.ok) {
        await fetchLandingPage();
        // Show success message
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, imageType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageType', imageType);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchLandingPage();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const updateContent = (language: string, key: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [key]: value,
      },
    }));
  };

  const toggleSection = (sectionType: string) => {
    setSections((prev: any) => ({
      ...prev,
      [sectionType]: {
        ...prev[sectionType],
        isEnabled: !prev[sectionType]?.isEnabled,
      },
    }));
  };

  // Contact form functions
  const addCustomField = () => {
    const newField = {
      id: `custom_${Date.now()}`,
      type: 'text',
      label: { es: 'Campo personalizado', en: 'Custom field', fi: 'Mukautettu kenttä' },
      required: false,
      enabled: true
    };
    setContactForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const removeField = (fieldId: string) => {
    setContactForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const updateField = (fieldId: string, updates: any) => {
    setContactForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const updateContactFormText = (key: string, language: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [language]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (isPreviewMode && landingPage) {
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={() => setIsPreviewMode(false)}
            variant="secondary"
            size="sm"
          >
            Volver al Editor
          </Button>
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="px-3 py-1 rounded border bg-white text-sm"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fi">Suomi</option>
          </select>
        </div>
        <LandingPageTemplate 
          landingPage={{ ...landingPage, content, colorScheme, sections: { ...sections, CONTACT: { ...sections.CONTACT, config: { ...sections.CONTACT?.config, contactForm } } } }}
          language={currentLanguage as any}
          isPreview={true}
        />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
                <p className="text-gray-600">
                  {session?.user?.subdomain}.solvik.app
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsPreviewMode(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Vista Previa
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  size="sm"
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="sections">Secciones</TabsTrigger>
              <TabsTrigger value="contact-form">Formulario</TabsTrigger>
              <TabsTrigger value="images">Imágenes</TabsTrigger>
              <TabsTrigger value="design">Diseño</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Contenido Multiidioma</h2>
                  <select
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="es">🇪🇸 Español</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="fi">🇫🇮 Suomi</option>
                  </select>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="flex items-center gap-2">
                        Título del Negocio
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>El nombre principal de tu negocio que aparecerá en toda la página</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="title"
                        value={content[currentLanguage]?.title || ''}
                        onChange={(e) => updateContent(currentLanguage, 'title', e.target.value)}
                        placeholder="Ej: Mi Zapatería"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subtitle" className="flex items-center gap-2">
                        Descripción Corta
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Una descripción breve de lo que ofreces</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="subtitle"
                        value={content[currentLanguage]?.subtitle || ''}
                        onChange={(e) => updateContent(currentLanguage, 'subtitle', e.target.value)}
                        placeholder="Ej: Los mejores zapatos de la ciudad"
                      />
                    </div>
                  </div>

                  {/* Hero Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sección Principal (Hero)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="hero-title">Título Principal</Label>
                        <Input
                          id="hero-title"
                          value={content[currentLanguage]?.hero?.title || ''}
                          onChange={(e) => updateContent(currentLanguage, 'hero', {
                            ...content[currentLanguage]?.hero,
                            title: e.target.value
                          })}
                          placeholder="Ej: Bienvenido a Mi Zapatería"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hero-subtitle">Subtítulo</Label>
                        <Textarea
                          id="hero-subtitle"
                          value={content[currentLanguage]?.hero?.subtitle || ''}
                          onChange={(e) => updateContent(currentLanguage, 'hero', {
                            ...content[currentLanguage]?.hero,
                            subtitle: e.target.value
                          })}
                          placeholder="Ej: Encuentra el calzado perfecto para cada ocasión"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hero-cta">Texto del Botón</Label>
                        <Input
                          id="hero-cta"
                          value={content[currentLanguage]?.hero?.cta || ''}
                          onChange={(e) => updateContent(currentLanguage, 'hero', {
                            ...content[currentLanguage]?.hero,
                            cta: e.target.value
                          })}
                          placeholder="Ej: Ver Catálogo"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Información de Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input
                            id="phone"
                            value={content[currentLanguage]?.contact?.phone || ''}
                            onChange={(e) => updateContent(currentLanguage, 'contact', {
                              ...content[currentLanguage]?.contact,
                              phone: e.target.value
                            })}
                            placeholder="+1234567890"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={content[currentLanguage]?.contact?.email || ''}
                            onChange={(e) => updateContent(currentLanguage, 'contact', {
                              ...content[currentLanguage]?.contact,
                              email: e.target.value
                            })}
                            placeholder="info@minegocio.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Dirección</Label>
                          <Input
                            id="address"
                            value={content[currentLanguage]?.contact?.address || ''}
                            onChange={(e) => updateContent(currentLanguage, 'contact', {
                              ...content[currentLanguage]?.contact,
                              address: e.target.value
                            })}
                            placeholder="Calle 123, Ciudad"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Sections Tab */}
            <TabsContent value="sections" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Secciones de la Página
                  </CardTitle>
                  <CardDescription>
                    Activa o desactiva las secciones que quieres mostrar en tu landing page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'HERO', name: 'Sección Principal', description: 'La primera pantalla con título y llamada a la acción' },
                    { key: 'CATALOG', name: 'Catálogo', description: 'Muestra tus productos o servicios' },
                    { key: 'BENEFITS', name: 'Beneficios', description: 'Por qué elegir tu negocio' },
                    { key: 'TESTIMONIALS', name: 'Testimonios', description: 'Opiniones de tus clientes' },
                    { key: 'MAP', name: 'Ubicación', description: 'Mapa y dirección de tu negocio' },
                    { key: 'CONTACT', name: 'Contacto', description: 'Información de contacto y formulario' },
                    { key: 'FOOTER', name: 'Pie de Página', description: 'Información adicional y links' },
                  ].map((section) => (
                    <div key={section.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{section.name}</h3>
                          {section.key === 'HERO' && (
                            <Badge variant="secondary">Obligatorio</Badge>
                          )}
                          {section.key === 'CONTACT' && contactForm.enabled && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <Mail className="w-3 h-3 mr-1" />
                              Con Formulario
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                      <Switch
                        checked={sections[section.key]?.isEnabled ?? true}
                        onCheckedChange={() => toggleSection(section.key)}
                        disabled={section.key === 'HERO'}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Form Tab */}
            <TabsContent value="contact-form" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Formulario de Contacto
                  </CardTitle>
                  <CardDescription>
                    Configura un formulario para que los visitantes puedan contactarte directamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Enable/Disable Form */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Activar Formulario de Contacto</h3>
                      <p className="text-sm text-gray-600">
                        Permite que los visitantes te envíen mensajes directamente desde tu landing page
                      </p>
                    </div>
                    <Switch
                      checked={contactForm.enabled}
                      onCheckedChange={(enabled) => setContactForm(prev => ({ ...prev, enabled }))}
                    />
                  </div>

                  {contactForm.enabled && (
                    <>
                      {/* Form Texts */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Textos del Formulario</h3>
                          <select
                            value={currentLanguage}
                            onChange={(e) => setCurrentLanguage(e.target.value)}
                            className="px-3 py-2 border rounded-md"
                          >
                            <option value="es">🇪🇸 Español</option>
                            <option value="en">🇬🇧 English</option>
                            <option value="fi">🇫🇮 Suomi</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="form-title">Título del Formulario</Label>
                            <Input
                              id="form-title"
                              value={contactForm.title[currentLanguage] || ''}
                              onChange={(e) => updateContactFormText('title', currentLanguage, e.target.value)}
                              placeholder="Ej: Contáctanos"
                            />
                          </div>
                          <div>
                            <Label htmlFor="form-subtitle">Subtítulo</Label>
                            <Input
                              id="form-subtitle"
                              value={contactForm.subtitle[currentLanguage] || ''}
                              onChange={(e) => updateContactFormText('subtitle', currentLanguage, e.target.value)}
                              placeholder="Ej: Envíanos un mensaje"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="submit-button">Texto del Botón</Label>
                            <Input
                              id="submit-button"
                              value={contactForm.submitButton[currentLanguage] || ''}
                              onChange={(e) => updateContactFormText('submitButton', currentLanguage, e.target.value)}
                              placeholder="Ej: Enviar Mensaje"
                            />
                          </div>
                          <div>
                            <Label htmlFor="success-message">Mensaje de Éxito</Label>
                            <Input
                              id="success-message"
                              value={contactForm.successMessage[currentLanguage] || ''}
                              onChange={(e) => updateContactFormText('successMessage', currentLanguage, e.target.value)}
                              placeholder="Ej: ¡Gracias! Tu mensaje ha sido enviado."
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Campos del Formulario</h3>
                          <Button
                            onClick={addCustomField}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Agregar Campo
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {contactForm.fields.map((field, index) => (
                            <div key={field.id} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">
                                    {field.label[currentLanguage] || field.label.es}
                                  </span>
                                  {field.required && (
                                    <Badge variant="secondary" className="text-xs">Obligatorio</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={field.enabled}
                                    onCheckedChange={(enabled) => updateField(field.id, { enabled })}
                                  />
                                  {!['name', 'phone', 'email', 'message'].includes(field.id) && (
                                    <Button
                                      onClick={() => removeField(field.id)}
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {field.enabled && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <Label htmlFor={`field-label-${field.id}`}>Etiqueta</Label>
                                    <Input
                                      id={`field-label-${field.id}`}
                                      value={field.label[currentLanguage] || ''}
                                      onChange={(e) => updateField(field.id, {
                                        label: { ...field.label, [currentLanguage]: e.target.value }
                                      })}
                                      placeholder="Nombre del campo"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`field-type-${field.id}`}>Tipo</Label>
                                    <select
                                      id={`field-type-${field.id}`}
                                      value={field.type}
                                      onChange={(e) => updateField(field.id, { type: e.target.value })}
                                      className="w-full px-3 py-2 border rounded-md"
                                    >
                                      <option value="text">Texto</option>
                                      <option value="email">Email</option>
                                      <option value="tel">Teléfono</option>
                                      <option value="number">Número</option>
                                      <option value="textarea">Área de texto</option>
                                      <option value="select">Lista desplegable</option>
                                    </select>
                                  </div>
                                  <div className="flex items-center gap-4 pt-6">
                                    <label className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                        className="rounded"
                                      />
                                      <span className="text-sm">Obligatorio</span>
                                    </label>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Gestión de Imágenes
                  </CardTitle>
                  <CardDescription>
                    Sube las imágenes que se mostrarán en tu landing page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: 'hero', name: 'Imagen Principal', description: 'Imagen de fondo de la sección principal' },
                    { key: 'logo', name: 'Logo', description: 'Logo que aparece en la navegación' },
                    { key: 'catalog', name: 'Imágenes del Catálogo', description: 'Fotos de tus productos (múltiples)' },
                  ].map((imageType) => (
                    <div key={imageType.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{imageType.name}</h3>
                          <p className="text-sm text-gray-600">{imageType.description}</p>
                        </div>
                      </div>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Arrastra una imagen aquí o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, imageType.key);
                          }}
                          className="hidden"
                          id={`upload-${imageType.key}`}
                        />
                        <label
                          htmlFor={`upload-${imageType.key}`}
                          className="bg-orange-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-orange-700 transition-colors"
                        >
                          Seleccionar Imagen
                        </label>
                      </div>

                      {/* Show current images */}
                      {landingPage?.images?.filter((img: any) => 
                        img.imageType.toLowerCase() === imageType.key.toLowerCase()
                      ).map((image: any) => (
                        <div key={image.id} className="mt-3 p-3 bg-gray-50 rounded border">
                          <div className="flex items-center gap-3">
                            <img
                              src={image.url}
                              alt={image.originalName}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{image.originalName}</p>
                              <p className="text-xs text-gray-600">
                                {(image.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Paleta de Colores
                  </CardTitle>
                  <CardDescription>
                    Personaliza los colores de tu landing page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: 'primary', name: 'Color Primario', description: 'Botones principales' },
                      { key: 'secondary', name: 'Color Secundario', description: 'Secciones destacadas' },
                      { key: 'accent', name: 'Color de Acento', description: 'Elementos decorativos' },
                    ].map((color) => (
                      <div key={color.key} className="space-y-2">
                        <Label htmlFor={`color-${color.key}`}>{color.name}</Label>
                        <div className="flex items-center gap-2">
                          <input
                            id={`color-${color.key}`}
                            type="color"
                            value={colorScheme[color.key] || '#F97316'}
                            onChange={(e) => setColorScheme(prev => ({
                              ...prev,
                              [color.key]: e.target.value
                            }))}
                            className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <div className="flex-1">
                            <Input
                              value={colorScheme[color.key] || '#F97316'}
                              onChange={(e) => setColorScheme(prev => ({
                                ...prev,
                                [color.key]: e.target.value
                              }))}
                              placeholder="#F97316"
                            />
                            <p className="text-xs text-gray-600 mt-1">{color.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Optimización SEO
                  </CardTitle>
                  <CardDescription>
                    Ayuda a Google a encontrar tu negocio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="keywords" className="flex items-center gap-2">
                      Palabras Clave
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Google quiere encontrarte y con estas palabras lo logra. Sepáralas con coma, es como hashtags. Ejemplo: zapatos, sandalias, cómodos, bonitos, baratos.</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Textarea
                      id="keywords"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="zapatos, sandalias, cómodos, bonitos, baratos, calzado, tienda"
                      rows={3}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Ejemplo: zapatos, sandalias, cómodos, bonitos, baratos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}