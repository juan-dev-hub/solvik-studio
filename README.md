# Solvik SaaS - Landing Page Builder

🚀 **Plataforma SaaS para crear landing pages ultra simples sin código**

## ¿Qué es Solvik?

Solvik es una plataforma que permite a pequeños negocios crear su landing page en menos de 5 minutos, sin conocimientos técnicos.

### ✨ Características principales

- **Súper Simple**: Interfaz como "editar perfil" de Facebook
- **Multiidioma**: Español, Inglés y Finés automáticamente
- **Hosting Incluido**: Alojado en Finlandia con máxima privacidad
- **Subdominio Gratis**: `tunegocio.solvik.app`
- **Colores Personalizados**: Cambia la paleta de colores
- **Imágenes Ilimitadas**: Sube todas las fotos que quieras

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 13 + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js + WhatsApp OTP
- **Hosting**: Vercel (frontend) + Supabase (database)
- **Pagos**: Lemon Squeezy
- **DNS**: Cloudflare

## 🚀 Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/solvik-saas.git
cd solvik-saas
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
- Base de datos PostgreSQL
- Twilio (WhatsApp)
- Cloudflare
- Lemon Squeezy

4. **Configurar base de datos**
```bash
npx prisma generate
npx prisma db push
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
solvik-saas/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticación
│   └── landing/           # Landing pages dinámicas
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y servicios
├── prisma/               # Schema de base de datos
└── types/                # Tipos de TypeScript
```

## 🔧 Configuración de Producción

### Base de Datos (Supabase)
1. Crear proyecto en [Supabase](https://supabase.com)
2. Copiar URL de conexión a `DATABASE_URL`
3. Ejecutar migraciones: `npx prisma db push`

### WhatsApp OTP (Twilio)
1. Crear cuenta en [Twilio](https://twilio.com)
2. Configurar WhatsApp Business API
3. Agregar credenciales al `.env`

### DNS (Cloudflare)
1. Configurar dominio en Cloudflare
2. Crear API token con permisos de DNS
3. Configurar variables de entorno

### Pagos (Lemon Squeezy)
1. Crear cuenta en [Lemon Squeezy](https://lemonsqueezy.com)
2. Configurar productos y webhooks
3. Agregar API keys

## 🌍 Deployment

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Variables de entorno en Vercel
Configurar todas las variables del `.env.example` en el dashboard de Vercel.

## 📝 Uso

1. **Registro**: Los usuarios se registran con WhatsApp
2. **Verificación**: Código OTP por WhatsApp
3. **Configuración**: Panel simple para editar contenido
4. **Publicación**: Landing page disponible en `subdominio.solvik.app`

## 🎨 Personalización

### Colores
Los usuarios pueden cambiar la paleta de colores desde el panel de administración.

### Contenido
Todo el contenido es editable:
- Textos en 3 idiomas
- Imágenes (hero, logo, catálogo)
- Información de contacto
- Secciones habilitadas/deshabilitadas

## 🔒 Seguridad

- Números de WhatsApp encriptados
- Rate limiting en OTP
- Validación de archivos subidos
- Sanitización de inputs
- HTTPS obligatorio

## 📊 Monitoreo

- Logs de Prisma habilitados
- Error tracking con Next.js
- Métricas de uso en dashboard

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Email**: soporte@solvik.app
- **WhatsApp**: +358 XX XXX XXXX
- **Documentación**: [docs.solvik.app](https://docs.solvik.app)

---

**Hecho con ❤️ en Finlandia 🇫🇮**