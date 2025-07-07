'use client';

import React, { useState } from 'react';
import { LandingPage, LandingPageSection, LandingPageImage } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface LandingPageTemplateProps {
  landingPage: LandingPage & {
    sections: LandingPageSection[];
    images: LandingPageImage[];
  };
  language?: 'es' | 'en' | 'fi';
  isPreview?: boolean;
}

export function LandingPageTemplate({ 
  landingPage, 
  language = 'es', 
  isPreview = false 
}: LandingPageTemplateProps) {
  const content = landingPage.content as any;
  const colors = landingPage.colorScheme as any;
  const langContent = content[language] || content.es;
  
  const enabledSections = landingPage.sections
    .filter(section => section.isEnabled)
    .sort((a, b) => a.order - b.order);

  const getImage = (type: string) => {
    return landingPage.images.find(img => img.imageType.toLowerCase() === type.toLowerCase());
  };

  const heroImage = getImage('hero');
  const logoImage = getImage('logo');
  const catalogImages = landingPage.images.filter(img => img.imageType === 'CATALOG');

  // Contact form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get contact form configuration
  const contactSection = enabledSections.find(s => s.sectionType === 'CONTACT');
  const contactForm = contactSection?.config?.contactForm;

  // Function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to handle admin button click
  const handleAdminClick = () => {
    if (isPreview) {
      // If in preview mode, go back to admin panel
      window.location.href = '/admin';
    } else {
      // If on actual landing page, go to admin
      window.location.href = '/admin';
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate form submission (in real implementation, this would send to your backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just show success message
      setIsSubmitted(true);
      setFormData({});
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form field changes
  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Render form field based on type
  const renderFormField = (field: any) => {
    const fieldLabel = field.label[language] || field.label.es;
    const fieldValue = formData[field.id] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {fieldLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              rows={4}
              className="w-full"
              placeholder={fieldLabel}
            />
          </div>
        );
      
      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {fieldLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <select
              id={field.id}
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar...</option>
              {/* Add options here based on field configuration */}
            </select>
          </div>
        );
      
      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {fieldLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className="w-full"
              placeholder={fieldLabel}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ color: colors?.text || '#1F2937' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-black bg-opacity-40">
        {/* Logo and Company Name - Clickeable */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
        >
          {logoImage && (
            <Image
              src={logoImage.url}
              alt="Logo"
              width={48}
              height={48}
              className="h-12 w-12 object-cover rounded-full group-hover:scale-105 transition-transform"
            />
          )}
          <span className="text-white text-2xl font-semibold group-hover:text-gray-200 transition-colors">
            {langContent.title}
          </span>
        </button>
        
        {/* Admin Button - Always show, but change behavior based on context */}
        <button
          onClick={handleAdminClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          {isPreview ? 'Volver al Panel' : 'Entrar'}
        </button>
      </nav>

      {/* Hero Section */}
      {enabledSections.find(s => s.sectionType === 'HERO') && (
        <section id="inicio" className="relative min-h-screen flex flex-col justify-center pt-20">
          <div className="absolute inset-0">
            {heroImage ? (
              <Image
                src={heroImage.url}
                alt="Hero Background"
                fill
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700" />
            )}
            <div className="absolute inset-0 bg-black/40 z-0" />
          </div>
          
          <div className="h-screen flex flex-col items-center justify-center relative z-10 text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {langContent.hero?.title || langContent.title}
            </h1>
            <p className="text-xl sm:text-xl md:text-2xl font-semibold text-white mt-2 drop-shadow">
              {langContent.hero?.subtitle || langContent.subtitle}
            </p>
            <Link
              href="#contactanos"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg mt-8 inline-block shadow-lg transition-all"
              style={{ backgroundColor: colors?.primary || '#3B82F6' }}
            >
              {langContent.hero?.cta || 'Contáctanos'}
            </Link>
          </div>
        </section>
      )}

      {/* Catalog Section */}
      {enabledSections.find(s => s.sectionType === 'CATALOG') && catalogImages.length > 0 && (
        <section id="catalogo" className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              {language === 'es' && 'Nuestros Productos'}
              {language === 'en' && 'Our Products'}
              {language === 'fi' && 'Tuotteemme'}
            </h2>
            <p className="text-gray-600 text-center mb-12">
              {language === 'es' && 'Descubre nuestra amplia gama de productos de calidad'}
              {language === 'en' && 'Discover our wide range of quality products'}
              {language === 'fi' && 'Tutustu laajaan korkealaatuisten tuotteidemme valikoimaan'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {catalogImages.map((image, index) => (
                <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Image
                    src={image.url}
                    alt={image.originalName}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      Producto {index + 1}
                    </h3>
                    <p className="text-gray-600">
                      Descripción del producto
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {enabledSections.find(s => s.sectionType === 'BENEFITS') && (
        <section 
          id="beneficios" 
          className="py-16 text-white relative"
          style={{ backgroundColor: colors?.secondary || '#10B981' }}
        >
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              {language === 'es' && 'Por qué elegirnos'}
              {language === 'en' && 'Why choose us'}
              {language === 'fi' && 'Miksi valita meidät'}
            </h2>
            <p className="text-center text-lg mb-12 opacity-90">
              {language === 'es' && 'Nos distinguimos por nuestra calidad y servicio excepcional'}
              {language === 'en' && 'We stand out for our quality and exceptional service'}
              {language === 'fi' && 'Erotumme laadusta ja poikkeuksellisesta palvelusta'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {langContent.benefits?.map((benefit: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-full" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="opacity-90">{benefit.description}</p>
                </div>
              )) || (
                <>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Calidad</h3>
                    <p className="opacity-90">Productos de la más alta calidad</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Servicio</h3>
                    <p className="opacity-90">Atención personalizada y profesional</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Precio</h3>
                    <p className="opacity-90">Precios competitivos y justos</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {enabledSections.find(s => s.sectionType === 'TESTIMONIALS') && (
        <section id="opiniones" className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4" style={{ color: colors?.text || '#1F2937' }}>
              {language === 'es' && 'Lo que dicen nuestros clientes'}
              {language === 'en' && 'What our customers say'}
              {language === 'fi' && 'Mitä asiakkaamme sanovat'}
            </h2>
            <p className="text-center text-gray-600 mb-12">
              {language === 'es' && 'Testimonios reales de clientes satisfechos'}
              {language === 'en' && 'Real testimonials from satisfied customers'}
              {language === 'fi' && 'Todellisia kokemuksia tyytyväisiltä asiakkailta'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {langContent.testimonials?.map((testimonial: any, index: number) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                  <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold" style={{ color: colors?.text || '#1F2937' }}>
                    — {testimonial.name}
                  </p>
                </div>
              )) || (
                <>
                  <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                    <p className="text-gray-700 italic mb-4">"Excelente servicio y productos de calidad."</p>
                    <p className="font-semibold">— Cliente 1</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                    <p className="text-gray-700 italic mb-4">"Muy recomendado, superó mis expectativas."</p>
                    <p className="font-semibold">— Cliente 2</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                    <p className="text-gray-700 italic mb-4">"Atención personalizada y precios justos."</p>
                    <p className="font-semibold">— Cliente 3</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Map Section */}
      {enabledSections.find(s => s.sectionType === 'MAP') && (
        <section 
          id="ubicacion" 
          className="py-16 text-white"
          style={{ backgroundColor: colors?.secondary || '#10B981' }}
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              {language === 'es' && 'Cómo llegar'}
              {language === 'en' && 'How to get here'}
              {language === 'fi' && 'Miten tulla tänne'}
            </h2>
            <p className="text-center text-lg mb-12 opacity-90">
              {language === 'es' && 'Visítanos en nuestra ubicación'}
              {language === 'en' && 'Visit us at our location'}
              {language === 'fi' && 'Vieraile sijaintimme'}
            </p>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 mr-2" />
                <h3 className="text-2xl font-semibold">Dirección</h3>
              </div>
              <p className="text-lg mb-6">
                {langContent.contact?.address || 'Dirección de la empresa'}
              </p>
              <Link
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg inline-block transition-colors"
              >
                {language === 'es' && 'Ver en Google Maps'}
                {language === 'en' && 'View on Google Maps'}
                {language === 'fi' && 'Näytä Google Mapsissa'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {enabledSections.find(s => s.sectionType === 'CONTACT') && (
        <section id="contactanos" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4" style={{ color: colors?.text || '#1F2937' }}>
              {language === 'es' && 'Contáctanos'}
              {language === 'en' && 'Contact us'}
              {language === 'fi' && 'Ota yhteyttä'}
            </h2>
            <p className="text-center text-gray-600 mb-12">
              {language === 'es' && 'Estamos aquí para ayudarte'}
              {language === 'en' && 'We are here to help you'}
              {language === 'fi' && 'Olemme täällä auttamassa sinua'}
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <Phone className="w-12 h-12 mx-auto mb-4" style={{ color: colors?.primary || '#3B82F6' }} />
                    <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
                    <p className="text-gray-600">{langContent.contact?.phone || '+1234567890'}</p>
                  </div>
                  <div className="text-center">
                    <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: colors?.primary || '#3B82F6' }} />
                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                    <p className="text-gray-600">{langContent.contact?.email || 'info@empresa.com'}</p>
                  </div>
                </div>
                <div className="text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: colors?.primary || '#3B82F6' }} />
                  <h3 className="text-xl font-semibold mb-2">Horarios</h3>
                  <p className="text-gray-600">
                    {language === 'es' && 'Lun - Vie: 9:00 - 18:00'}
                    {language === 'en' && 'Mon - Fri: 9:00 - 18:00'}
                    {language === 'fi' && 'Ma - Pe: 9:00 - 18:00'}
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              {contactForm?.enabled && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: colors?.text || '#1F2937' }}>
                    {contactForm.title[language] || contactForm.title.es}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {contactForm.subtitle[language] || contactForm.subtitle.es}
                  </p>

                  {isSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <p className="text-green-800 font-semibold">
                        {contactForm.successMessage[language] || contactForm.successMessage.es}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {contactForm.fields
                        .filter(field => field.enabled)
                        .map(field => renderFormField(field))}
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                        style={{ backgroundColor: colors?.primary || '#3B82F6' }}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {language === 'es' && 'Enviando...'}
                            {language === 'en' && 'Sending...'}
                            {language === 'fi' && 'Lähetetään...'}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            {contactForm.submitButton[language] || contactForm.submitButton.es}
                          </div>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {enabledSections.find(s => s.sectionType === 'FOOTER') && (
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            {/* Footer Logo and Company Name - Also clickeable */}
            <button
              onClick={scrollToTop}
              className="flex items-center justify-center mb-4 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              {logoImage && (
                <Image
                  src={logoImage.url}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover rounded-full mr-3 group-hover:scale-105 transition-transform"
                />
              )}
              <h3 className="text-2xl font-bold group-hover:text-gray-200 transition-colors">
                {langContent.title}
              </h3>
            </button>
            
            <p className="text-gray-400 mb-6">{langContent.subtitle}</p>
            <div className="flex justify-center space-x-6 mb-6">
              <Link href="#contactanos" className="text-gray-400 hover:text-white transition-colors">
                {language === 'es' && 'Contacto'}
                {language === 'en' && 'Contact'}
                {language === 'fi' && 'Yhteystiedot'}
              </Link>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} {langContent.title}. 
                {language === 'es' && ' Todos los derechos reservados.'}
                {language === 'en' && ' All rights reserved.'}
                {language === 'fi' && ' Kaikki oikeudet pidätetään.'}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Powered by Solvik Studio
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}