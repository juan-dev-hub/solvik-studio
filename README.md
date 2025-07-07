# Solvik SaaS - Separado Frontend/Backend

🚀 **Plataforma SaaS para crear landing pages ultra simples sin código**

## 📁 Estructura del Proyecto

```
solvik-saas/
├── frontend/          # Next.js App (Deploy en Vercel)
│   ├── app/          # App Router
│   ├── components/   # Componentes React
│   ├── lib/         # Utilidades frontend
│   └── public/      # Assets estáticos
├── backend/          # Express API (Deploy en UpCloud)
│   ├── src/         # Código fuente
│   ├── prisma/      # Base de datos
│   └── uploads/     # Archivos subidos
└── shared/          # Código compartido (futuro)
```

## 🚀 Deployment

### Frontend (Vercel)

1. **Conectar repositorio a Vercel**
```bash
cd frontend
vercel --prod
```

2. **Variables de entorno en Vercel**
```bash
NEXT_PUBLIC_API_URL=https://tu-backend.upcloud.com
NEXTAUTH_URL=https://tu-frontend.vercel.app
NEXTAUTH_SECRET=tu-secret-key
```

### Backend (UpCloud)

1. **Conectar al servidor**
```bash
ssh root@TU_IP_UPCLOUD
```

2. **Clonar y deployar backend**
```bash
mkdir -p /opt/solvik-backend
cd /opt/solvik-backend
git clone https://github.com/tu-usuario/solvik-saas.git .
cd backend
cp .env.example .env
# Editar .env con tus credenciales
docker-compose up -d
```

## 🔧 Desarrollo Local

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configurar .env
npm run dev
```

## 🌐 URLs

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8000`
- **API Health**: `http://localhost:8000/api/health`

## 📋 Ventajas de la Separación

✅ **Frontend en Vercel**: CDN global, SSL automático, deploys instantáneos
✅ **Backend en UpCloud**: Control total, base de datos privada, uploads locales
✅ **Escalabilidad**: Cada parte escala independientemente
✅ **Desarrollo**: Equipos pueden trabajar por separado
✅ **Costos**: Optimización de recursos por servicio

## 🔄 Migración Completada

- ✅ API Routes movidas a Express backend
- ✅ Frontend adaptado para usar API externa
- ✅ Auth system refactorizado
- ✅ Base de datos en backend
- ✅ File uploads en backend
- ✅ CORS configurado
- ✅ Middleware de autenticación
- ✅ Docker setup para backend

¡Tu proyecto está listo para deployment separado! 🎉