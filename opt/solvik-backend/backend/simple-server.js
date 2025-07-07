const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Solvik SaaS API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth endpoints
app.post('/api/auth/signup', (req, res) => {
  res.json({
    success: true,
    message: 'Usuario creado. Código de verificación enviado.',
    userId: 'mock-user-id'
  });
});

app.post('/api/auth/send-otp', (req, res) => {
  res.json({
    success: true,
    message: 'Código de verificación enviado',
    userId: 'mock-user-id'
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  res.json({
    success: true,
    message: 'Código verificado correctamente',
    verified: true
  });
});

app.post('/api/auth/signin', (req, res) => {
  res.json({
    success: true,
    token: 'mock-token',
    user: {
      id: 'mock-user-id',
      name: 'Test User',
      email: 'usuario@ejemplo.com',
      subdomain: 'demo'
    }
  });
});

// Landing page endpoints
app.get('/api/landing-page', (req, res) => {
  res.json({
    id: 'mock-landing-page-id',
    userId: 'mock-user-id',
    isPublished: true,
    content: {
      es: {
        title: 'Mi Negocio',
        subtitle: 'Descripción de mi negocio',
        hero: {
          title: 'Bienvenido a mi negocio',
          subtitle: 'Ofrecemos los mejores productos y servicios',
          cta: 'Contáctanos'
        }
      }
    },
    sections: [
      { sectionType: 'HERO', isEnabled: true, order: 1 },
      { sectionType: 'CATALOG', isEnabled: true, order: 2 },
      { sectionType: 'BENEFITS', isEnabled: true, order: 3 },
      { sectionType: 'CONTACT', isEnabled: true, order: 4 },
      { sectionType: 'FOOTER', isEnabled: true, order: 5 }
    ],
    images: []
  });
});

app.put('/api/landing-page', (req, res) => {
  res.json({
    success: true,
    message: 'Landing page actualizada correctamente'
  });
});

// AI content generation endpoint
app.post('/api/ai/generate-content', (req, res) => {
  res.json({
    hero: {
      title: 'Título generado por IA',
      subtitle: 'Subtítulo generado automáticamente',
      cta: 'Llamada a la acción'
    },
    benefits: [
      { title: 'Calidad', description: 'Productos de alta calidad' },
      { title: 'Servicio', description: 'Atención personalizada' },
      { title: 'Precio', description: 'Precios competitivos' }
    ],
    seoKeywords: 'palabras clave, seo, negocio, servicio'
  });
});

// Contact form endpoint
app.post('/api/contact-form', (req, res) => {
  res.json({
    success: true,
    message: 'Formulario enviado correctamente'
  });
});

// Upload endpoint (mock)
app.post('/api/upload', (req, res) => {
  res.json({
    id: 'mock-image-id',
    url: '/uploads/mock-image.jpg',
    fileName: 'mock-image.jpg'
  });
});

// Payments endpoint
app.post('/api/payments/create-checkout', (req, res) => {
  res.json({
    checkoutUrl: '/payments/success?plan=monthly_global&amount=9&interval=month'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Solvik SaaS API running on port ${PORT}`);
});