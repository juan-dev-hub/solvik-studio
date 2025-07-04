import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const generateContentSchema = z.object({
  businessDescription: z.string().min(10),
  selectedSections: z.array(z.string()),
  language: z.enum(['es', 'en', 'fi']).default('es'),
});

// Mock AI service for development
class MockAIService {
  static async generateContent(businessDescription: string, selectedSections: string[], language: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const businessType = this.detectBusinessType(businessDescription);
    const location = this.extractLocation(businessDescription);
    
    const content: any = {};
    
    // Generate content for each selected section
    selectedSections.forEach(sectionId => {
      switch (sectionId) {
        case 'HERO':
          content.hero = this.generateHeroContent(businessDescription, businessType, language);
          break;
        case 'CATALOG':
          content.catalog = this.generateCatalogContent(businessType, language);
          break;
        case 'BENEFITS':
          content.benefits = this.generateBenefitsContent(businessType, language);
          break;
        case 'TESTIMONIALS':
          content.testimonials = this.generateTestimonialsContent(businessType, location, language);
          break;
        case 'MAP':
          content.map = this.generateMapContent(location, language);
          break;
        case 'CONTACT':
          content.contact = this.generateContactContent(language);
          break;
        case 'CONTACT_FORM':
          content.contactForm = this.generateContactFormContent(language);
          break;
      }
    });
    
    // Generate SEO keywords
    content.seoKeywords = this.generateSEOKeywords(businessDescription, businessType, location, language);
    
    // Generate general info
    content.general = this.generateGeneralContent(businessDescription, businessType, language);
    
    return content;
  }
  
  private static detectBusinessType(description: string): string {
    const types = {
      'pizzería|pizza': 'pizzeria',
      'restaurante|comida|cocina': 'restaurant',
      'peluquería|cabello|corte': 'salon',
      'tienda|ropa|zapatos': 'store',
      'taller|reparación|mecánico': 'workshop',
      'consultorio|médico|doctor': 'clinic',
      'gimnasio|fitness|entrenamiento': 'gym',
      'panadería|pan|pastelería': 'bakery',
      'farmacia|medicamentos': 'pharmacy',
      'hotel|hospedaje|alojamiento': 'hotel'
    };
    
    for (const [keywords, type] of Object.entries(types)) {
      if (new RegExp(keywords, 'i').test(description)) {
        return type;
      }
    }
    
    return 'business';
  }
  
  private static extractLocation(description: string): string {
    const cities = ['Barcelona', 'Madrid', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Zaragoza'];
    for (const city of cities) {
      if (description.includes(city)) {
        return city;
      }
    }
    return 'tu ciudad';
  }
  
  private static generateHeroContent(description: string, businessType: string, language: string) {
    const templates = {
      es: {
        pizzeria: {
          title: 'La Mejor Pizza Artesanal',
          subtitle: 'Auténtica pizza italiana con ingredientes frescos y recetas tradicionales',
          cta: 'Pide Tu Pizza Ahora'
        },
        restaurant: {
          title: 'Sabores Auténticos',
          subtitle: 'Experiencia gastronómica única con ingredientes frescos y recetas tradicionales',
          cta: 'Reserva Tu Mesa'
        },
        salon: {
          title: 'Tu Estilo, Nuestra Pasión',
          subtitle: 'Cortes modernos y tratamientos profesionales para realzar tu belleza natural',
          cta: 'Agenda Tu Cita'
        },
        store: {
          title: 'Calidad y Estilo',
          subtitle: 'Encuentra los mejores productos con la calidad que mereces',
          cta: 'Ver Catálogo'
        },
        business: {
          title: 'Excelencia en Cada Servicio',
          subtitle: 'Profesionalidad y calidad que superan tus expectativas',
          cta: 'Contáctanos'
        }
      },
      en: {
        pizzeria: {
          title: 'The Best Artisan Pizza',
          subtitle: 'Authentic Italian pizza with fresh ingredients and traditional recipes',
          cta: 'Order Your Pizza Now'
        },
        restaurant: {
          title: 'Authentic Flavors',
          subtitle: 'Unique gastronomic experience with fresh ingredients and traditional recipes',
          cta: 'Book Your Table'
        },
        salon: {
          title: 'Your Style, Our Passion',
          subtitle: 'Modern cuts and professional treatments to enhance your natural beauty',
          cta: 'Book Your Appointment'
        },
        store: {
          title: 'Quality and Style',
          subtitle: 'Find the best products with the quality you deserve',
          cta: 'View Catalog'
        },
        business: {
          title: 'Excellence in Every Service',
          subtitle: 'Professionalism and quality that exceed your expectations',
          cta: 'Contact Us'
        }
      },
      fi: {
        pizzeria: {
          title: 'Paras Käsityöpizza',
          subtitle: 'Aito italialainen pizza tuoreilla aineksilla ja perinteisillä resepteillä',
          cta: 'Tilaa Pizzasi Nyt'
        },
        restaurant: {
          title: 'Aidot Maut',
          subtitle: 'Ainutlaatuinen gastronominen kokemus tuoreilla aineksilla ja perinteisillä resepteillä',
          cta: 'Varaa Pöytäsi'
        },
        salon: {
          title: 'Sinun Tyylisi, Meidän Intohimomme',
          subtitle: 'Modernit leikkaukset ja ammattimaiset hoidot luonnollisen kauneutesi korostamiseksi',
          cta: 'Varaa Aikasi'
        },
        store: {
          title: 'Laatua ja Tyyliä',
          subtitle: 'Löydä parhaat tuotteet ansaitsemallasi laadulla',
          cta: 'Katso Luettelo'
        },
        business: {
          title: 'Huippuosaamista Jokaisessa Palvelussa',
          subtitle: 'Ammattitaitoa ja laatua, joka ylittää odotuksesi',
          cta: 'Ota Yhteyttä'
        }
      }
    };
    
    return templates[language][businessType] || templates[language].business;
  }
  
  private static generateBenefitsContent(businessType: string, language: string) {
    const templates = {
      es: {
        pizzeria: [
          { title: 'Ingredientes Premium', description: 'Importados directamente desde Italia para el sabor más auténtico' },
          { title: 'Masa Artesanal', description: 'Fermentada 24 horas para la textura perfecta' },
          { title: 'Entrega Rápida', description: 'Pizza caliente en tu puerta en menos de 30 minutos' }
        ],
        restaurant: [
          { title: 'Ingredientes Frescos', description: 'Seleccionamos los mejores productos locales diariamente' },
          { title: 'Chef Experimentado', description: 'Más de 15 años creando experiencias gastronómicas únicas' },
          { title: 'Ambiente Acogedor', description: 'El lugar perfecto para cualquier ocasión especial' }
        ],
        salon: [
          { title: 'Profesionales Certificados', description: 'Estilistas con formación internacional y experiencia comprobada' },
          { title: 'Productos Premium', description: 'Utilizamos solo las mejores marcas del mercado' },
          { title: 'Atención Personalizada', description: 'Cada cliente recibe un servicio único y personalizado' }
        ],
        business: [
          { title: 'Calidad Garantizada', description: 'Comprometidos con la excelencia en cada servicio' },
          { title: 'Experiencia Comprobada', description: 'Años de experiencia respaldando nuestro trabajo' },
          { title: 'Atención Personalizada', description: 'Cada cliente es único y especial para nosotros' }
        ]
      },
      en: {
        pizzeria: [
          { title: 'Premium Ingredients', description: 'Imported directly from Italy for the most authentic flavor' },
          { title: 'Artisan Dough', description: 'Fermented for 24 hours for the perfect texture' },
          { title: 'Fast Delivery', description: 'Hot pizza at your door in less than 30 minutes' }
        ],
        restaurant: [
          { title: 'Fresh Ingredients', description: 'We select the best local products daily' },
          { title: 'Experienced Chef', description: 'Over 15 years creating unique gastronomic experiences' },
          { title: 'Cozy Atmosphere', description: 'The perfect place for any special occasion' }
        ],
        salon: [
          { title: 'Certified Professionals', description: 'Stylists with international training and proven experience' },
          { title: 'Premium Products', description: 'We use only the best brands on the market' },
          { title: 'Personalized Attention', description: 'Each client receives unique and personalized service' }
        ],
        business: [
          { title: 'Guaranteed Quality', description: 'Committed to excellence in every service' },
          { title: 'Proven Experience', description: 'Years of experience backing our work' },
          { title: 'Personalized Attention', description: 'Each client is unique and special to us' }
        ]
      },
      fi: {
        pizzeria: [
          { title: 'Premium-ainekset', description: 'Tuotu suoraan Italiasta aidoimman maun saamiseksi' },
          { title: 'Käsityötaikina', description: 'Käytetty 24 tuntia täydellisen koostumuksen saamiseksi' },
          { title: 'Nopea Toimitus', description: 'Kuuma pizza ovellesi alle 30 minuutissa' }
        ],
        restaurant: [
          { title: 'Tuoreet Ainekset', description: 'Valitsemme parhaat paikalliset tuotteet päivittäin' },
          { title: 'Kokenut Kokki', description: 'Yli 15 vuoden kokemus ainutlaatuisten gastronomisten kokemusten luomisesta' },
          { title: 'Viihtyisä Tunnelma', description: 'Täydellinen paikka mihin tahansa erityiseen tilaisuuteen' }
        ],
        salon: [
          { title: 'Sertifioidut Ammattilaiset', description: 'Kampaajat kansainvälisellä koulutuksella ja todistetulla kokemuksella' },
          { title: 'Premium-tuotteet', description: 'Käytämme vain markkinoiden parhaita merkkejä' },
          { title: 'Henkilökohtainen Palvelu', description: 'Jokainen asiakas saa ainutlaatuisen ja henkilökohtaisen palvelun' }
        ],
        business: [
          { title: 'Taattu Laatu', description: 'Sitoutuneet huippuosaamiseen jokaisessa palvelussa' },
          { title: 'Todistettu Kokemus', description: 'Vuosien kokemus tukee työtämme' },
          { title: 'Henkilökohtainen Palvelu', description: 'Jokainen asiakas on meille ainutlaatuinen ja erityinen' }
        ]
      }
    };
    
    return templates[language][businessType] || templates[language].business;
  }
  
  private static generateTestimonialsContent(businessType: string, location: string, language: string) {
    const templates = {
      es: {
        pizzeria: [
          { name: 'María González', text: 'La mejor pizza que he probado en ' + location + '. Los ingredientes son fresquísimos.' },
          { name: 'Carlos Ruiz', text: 'Siempre pido aquí. La entrega es rápida y la pizza llega perfecta.' },
          { name: 'Ana López', text: 'El sabor es increíble, realmente sabe a Italia. Muy recomendado.' }
        ],
        restaurant: [
          { name: 'Pedro Martín', text: 'Una experiencia gastronómica excepcional. El chef es un artista.' },
          { name: 'Laura Sánchez', text: 'El ambiente es perfecto para una cena romántica. Volveremos seguro.' },
          { name: 'Miguel Torres', text: 'Cada plato es una obra de arte. Ingredientes de primera calidad.' }
        ],
        salon: [
          { name: 'Carmen Díaz', text: 'Salgo siempre perfecta. Las estilistas son muy profesionales.' },
          { name: 'Isabel Moreno', text: 'El mejor corte que me han hecho. Muy atentas y cuidadosas.' },
          { name: 'Rosa García', text: 'Llevo años viniendo aquí. Siempre me siento renovada.' }
        ],
        business: [
          { name: 'Cliente Satisfecho', text: 'Excelente servicio y atención. Muy profesionales.' },
          { name: 'Usuario Feliz', text: 'Superaron mis expectativas. Muy recomendado.' },
          { name: 'Cliente Fiel', text: 'Calidad y precio justos. Volveré sin duda.' }
        ]
      },
      en: {
        pizzeria: [
          { name: 'Maria Gonzalez', text: 'The best pizza I\'ve tried in ' + location + '. The ingredients are super fresh.' },
          { name: 'Carlos Ruiz', text: 'I always order here. Delivery is fast and pizza arrives perfect.' },
          { name: 'Ana Lopez', text: 'The flavor is incredible, it really tastes like Italy. Highly recommended.' }
        ],
        restaurant: [
          { name: 'Pedro Martin', text: 'An exceptional gastronomic experience. The chef is an artist.' },
          { name: 'Laura Sanchez', text: 'The atmosphere is perfect for a romantic dinner. We\'ll definitely return.' },
          { name: 'Miguel Torres', text: 'Each dish is a work of art. First-class ingredients.' }
        ],
        salon: [
          { name: 'Carmen Diaz', text: 'I always leave looking perfect. The stylists are very professional.' },
          { name: 'Isabel Moreno', text: 'The best cut I\'ve ever had. Very attentive and careful.' },
          { name: 'Rosa Garcia', text: 'I\'ve been coming here for years. I always feel renewed.' }
        ],
        business: [
          { name: 'Satisfied Customer', text: 'Excellent service and attention. Very professional.' },
          { name: 'Happy User', text: 'They exceeded my expectations. Highly recommended.' },
          { name: 'Loyal Customer', text: 'Fair quality and price. I\'ll definitely return.' }
        ]
      },
      fi: {
        pizzeria: [
          { name: 'Maria Gonzalez', text: 'Paras pizza jonka olen maistanut ' + location + 'ssa. Ainekset ovat erittäin tuoreita.' },
          { name: 'Carlos Ruiz', text: 'Tilaan aina täältä. Toimitus on nopeaa ja pizza saapuu täydellisessä kunnossa.' },
          { name: 'Ana Lopez', text: 'Maku on uskomaton, maistuu todella Italialta. Erittäin suositeltava.' }
        ],
        restaurant: [
          { name: 'Pedro Martin', text: 'Poikkeuksellinen gastronominen kokemus. Kokki on taiteilija.' },
          { name: 'Laura Sanchez', text: 'Tunnelma on täydellinen romanttiselle illalliselle. Palaamme varmasti.' },
          { name: 'Miguel Torres', text: 'Jokainen ruokalaji on taideteos. Ensiluokkaisia aineksia.' }
        ],
        salon: [
          { name: 'Carmen Diaz', text: 'Lähden aina täydellisen näköisenä. Kampaajat ovat erittäin ammattimaisia.' },
          { name: 'Isabel Moreno', text: 'Paras leikkaus jonka olen koskaan saanut. Erittäin huomaavaisia ja huolellisia.' },
          { name: 'Rosa Garcia', text: 'Olen käynyt täällä vuosia. Tunnen aina olevani uudistunut.' }
        ],
        business: [
          { name: 'Tyytyväinen Asiakas', text: 'Erinomainen palvelu ja huomio. Erittäin ammattimaista.' },
          { name: 'Iloinen Käyttäjä', text: 'He ylittivät odotukseni. Erittäin suositeltava.' },
          { name: 'Uskollinen Asiakas', text: 'Reilu laatu ja hinta. Palaan varmasti.' }
        ]
      }
    };
    
    return templates[language][businessType] || templates[language].business;
  }
  
  private static generateSEOKeywords(description: string, businessType: string, location: string, language: string) {
    const baseKeywords = {
      es: {
        pizzeria: ['pizzería', 'pizza', 'italiana', 'artesanal', 'entrega', 'domicilio'],
        restaurant: ['restaurante', 'comida', 'gastronomía', 'chef', 'menú', 'reservas'],
        salon: ['peluquería', 'corte', 'cabello', 'estilista', 'belleza', 'tratamiento'],
        business: ['negocio', 'servicio', 'profesional', 'calidad', 'local']
      },
      en: {
        pizzeria: ['pizzeria', 'pizza', 'italian', 'artisan', 'delivery', 'takeout'],
        restaurant: ['restaurant', 'food', 'gastronomy', 'chef', 'menu', 'reservations'],
        salon: ['salon', 'haircut', 'hair', 'stylist', 'beauty', 'treatment'],
        business: ['business', 'service', 'professional', 'quality', 'local']
      },
      fi: {
        pizzeria: ['pizzeria', 'pizza', 'italialainen', 'käsityö', 'toimitus', 'nouto'],
        restaurant: ['ravintola', 'ruoka', 'gastronomia', 'kokki', 'menu', 'varaukset'],
        salon: ['kampaamo', 'leikkaus', 'hiukset', 'kampaaja', 'kauneus', 'hoito'],
        business: ['yritys', 'palvelu', 'ammattilainen', 'laatu', 'paikallinen']
      }
    };
    
    const keywords = baseKeywords[language][businessType] || baseKeywords[language].business;
    if (location !== 'tu ciudad') {
      keywords.push(location.toLowerCase());
    }
    
    return keywords.join(', ');
  }
  
  private static generateGeneralContent(description: string, businessType: string, language: string) {
    const templates = {
      es: {
        pizzeria: {
          title: 'Pizzería Artesanal',
          subtitle: 'Auténtica pizza italiana con ingredientes frescos'
        },
        restaurant: {
          title: 'Restaurante Gourmet',
          subtitle: 'Experiencia gastronómica única'
        },
        salon: {
          title: 'Salón de Belleza',
          subtitle: 'Tu estilo, nuestra especialidad'
        },
        business: {
          title: 'Mi Negocio',
          subtitle: 'Calidad y servicio profesional'
        }
      },
      en: {
        pizzeria: {
          title: 'Artisan Pizzeria',
          subtitle: 'Authentic Italian pizza with fresh ingredients'
        },
        restaurant: {
          title: 'Gourmet Restaurant',
          subtitle: 'Unique gastronomic experience'
        },
        salon: {
          title: 'Beauty Salon',
          subtitle: 'Your style, our specialty'
        },
        business: {
          title: 'My Business',
          subtitle: 'Quality and professional service'
        }
      },
      fi: {
        pizzeria: {
          title: 'Käsityöpizzeria',
          subtitle: 'Aito italialainen pizza tuoreilla aineksilla'
        },
        restaurant: {
          title: 'Gourmet-ravintola',
          subtitle: 'Ainutlaatuinen gastronominen kokemus'
        },
        salon: {
          title: 'Kauneussalonki',
          subtitle: 'Sinun tyylisi, meidän erikoisuutemme'
        },
        business: {
          title: 'Yritykseni',
          subtitle: 'Laatua ja ammattimaista palvelua'
        }
      }
    };
    
    return templates[language][businessType] || templates[language].business;
  }
  
  private static generateContactContent(language: string) {
    const templates = {
      es: {
        title: 'Contáctanos',
        subtitle: 'Estamos aquí para ayudarte',
        phone: '+34 XXX XXX XXX',
        email: 'info@minegocio.com',
        address: 'Calle Principal 123, Tu Ciudad'
      },
      en: {
        title: 'Contact Us',
        subtitle: 'We are here to help you',
        phone: '+34 XXX XXX XXX',
        email: 'info@mybusiness.com',
        address: 'Main Street 123, Your City'
      },
      fi: {
        title: 'Ota Yhteyttä',
        subtitle: 'Olemme täällä auttamassa sinua',
        phone: '+358 XX XXX XXXX',
        email: 'info@yritykseni.fi',
        address: 'Pääkatu 123, Kaupunkisi'
      }
    };
    
    return templates[language];
  }
  
  private static generateContactFormContent(language: string) {
    const templates = {
      es: {
        enabled: true,
        title: 'Envíanos un Mensaje',
        subtitle: 'Te responderemos lo antes posible',
        submitButton: 'Enviar Mensaje',
        successMessage: '¡Gracias! Tu mensaje ha sido enviado correctamente.'
      },
      en: {
        enabled: true,
        title: 'Send Us a Message',
        subtitle: 'We will get back to you as soon as possible',
        submitButton: 'Send Message',
        successMessage: 'Thank you! Your message has been sent successfully.'
      },
      fi: {
        enabled: true,
        title: 'Lähetä Meille Viesti',
        subtitle: 'Vastaamme sinulle mahdollisimman pian',
        submitButton: 'Lähetä Viesti',
        successMessage: 'Kiitos! Viestisi on lähetetty onnistuneesti.'
      }
    };
    
    return templates[language];
  }
  
  private static generateMapContent(location: string, language: string) {
    const templates = {
      es: {
        title: 'Cómo Llegar',
        subtitle: 'Visítanos en nuestra ubicación',
        address: `Calle Principal 123, ${location}`
      },
      en: {
        title: 'How to Get Here',
        subtitle: 'Visit us at our location',
        address: `Main Street 123, ${location}`
      },
      fi: {
        title: 'Miten Tulla Tänne',
        subtitle: 'Vieraile sijaintimme',
        address: `Pääkatu 123, ${location}`
      }
    };
    
    return templates[language];
  }
  
  private static generateCatalogContent(businessType: string, language: string) {
    const templates = {
      es: {
        pizzeria: {
          title: 'Nuestras Pizzas',
          subtitle: 'Descubre nuestra deliciosa variedad',
          items: [
            { title: 'Margherita', description: 'Tomate, mozzarella fresca y albahaca' },
            { title: 'Pepperoni', description: 'Pepperoni, mozzarella y salsa de tomate' },
            { title: 'Quattro Stagioni', description: 'Jamón, champiñones, alcachofas y aceitunas' }
          ]
        },
        restaurant: {
          title: 'Nuestro Menú',
          subtitle: 'Platos elaborados con ingredientes frescos',
          items: [
            { title: 'Entrantes', description: 'Selección de aperitivos gourmet' },
            { title: 'Platos Principales', description: 'Especialidades de la casa' },
            { title: 'Postres', description: 'Dulces tentaciones caseras' }
          ]
        },
        salon: {
          title: 'Nuestros Servicios',
          subtitle: 'Tratamientos profesionales para tu belleza',
          items: [
            { title: 'Corte y Peinado', description: 'Estilos modernos y clásicos' },
            { title: 'Coloración', description: 'Técnicas avanzadas de color' },
            { title: 'Tratamientos', description: 'Cuidado capilar especializado' }
          ]
        },
        business: {
          title: 'Nuestros Servicios',
          subtitle: 'Soluciones profesionales para ti',
          items: [
            { title: 'Servicio 1', description: 'Descripción del primer servicio' },
            { title: 'Servicio 2', description: 'Descripción del segundo servicio' },
            { title: 'Servicio 3', description: 'Descripción del tercer servicio' }
          ]
        }
      },
      en: {
        pizzeria: {
          title: 'Our Pizzas',
          subtitle: 'Discover our delicious variety',
          items: [
            { title: 'Margherita', description: 'Tomato, fresh mozzarella and basil' },
            { title: 'Pepperoni', description: 'Pepperoni, mozzarella and tomato sauce' },
            { title: 'Quattro Stagioni', description: 'Ham, mushrooms, artichokes and olives' }
          ]
        },
        restaurant: {
          title: 'Our Menu',
          subtitle: 'Dishes made with fresh ingredients',
          items: [
            { title: 'Starters', description: 'Selection of gourmet appetizers' },
            { title: 'Main Courses', description: 'House specialties' },
            { title: 'Desserts', description: 'Homemade sweet temptations' }
          ]
        },
        salon: {
          title: 'Our Services',
          subtitle: 'Professional treatments for your beauty',
          items: [
            { title: 'Cut and Style', description: 'Modern and classic styles' },
            { title: 'Coloring', description: 'Advanced color techniques' },
            { title: 'Treatments', description: 'Specialized hair care' }
          ]
        },
        business: {
          title: 'Our Services',
          subtitle: 'Professional solutions for you',
          items: [
            { title: 'Service 1', description: 'Description of the first service' },
            { title: 'Service 2', description: 'Description of the second service' },
            { title: 'Service 3', description: 'Description of the third service' }
          ]
        }
      },
      fi: {
        pizzeria: {
          title: 'Meidän Pizzat',
          subtitle: 'Tutustu herkulliseen valikoimaamme',
          items: [
            { title: 'Margherita', description: 'Tomaatti, tuore mozzarella ja basilika' },
            { title: 'Pepperoni', description: 'Pepperoni, mozzarella ja tomaattikastike' },
            { title: 'Quattro Stagioni', description: 'Kinkku, sienet, artisokkaa ja oliivit' }
          ]
        },
        restaurant: {
          title: 'Meidän Menu',
          subtitle: 'Ruokia tuoreista aineksista',
          items: [
            { title: 'Alkuruoat', description: 'Valikoima gourmet-alkupaloja' },
            { title: 'Pääruoat', description: 'Talon erikoisuudet' },
            { title: 'Jälkiruoat', description: 'Kotitekoisia makeita kiusauksia' }
          ]
        },
        salon: {
          title: 'Meidän Palvelut',
          subtitle: 'Ammattimaisia hoitoja kauneutesi',
          items: [
            { title: 'Leikkaus ja Kampaus', description: 'Modernit ja klassiset tyylit' },
            { title: 'Värjäys', description: 'Edistyneet väritekniikat' },
            { title: 'Hoidot', description: 'Erikoistunut hiustenhoito' }
          ]
        },
        business: {
          title: 'Meidän Palvelut',
          subtitle: 'Ammattimaisia ratkaisuja sinulle',
          items: [
            { title: 'Palvelu 1', description: 'Ensimmäisen palvelun kuvaus' },
            { title: 'Palvelu 2', description: 'Toisen palvelun kuvaus' },
            { title: 'Palvelu 3', description: 'Kolmannen palvelun kuvaus' }
          ]
        }
      }
    };
    
    return templates[language][businessType] || templates[language].business;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { businessDescription, selectedSections, language } = generateContentSchema.parse(body);

    // For development, use mock AI service
    // In production, replace with real Claude API call
    const content = await MockAIService.generateContent(businessDescription, selectedSections, language);

    return NextResponse.json(content);
  } catch (error) {
    console.error('Generate content error:', error);
    
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