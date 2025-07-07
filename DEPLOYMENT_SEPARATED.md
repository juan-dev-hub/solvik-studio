# 🚀 DEPLOYMENT SEPARADO: FRONTEND + BACKEND

## 📋 **RESUMEN**
- **Frontend**: Vercel (Next.js)
- **Backend**: UpCloud (Express + PostgreSQL)

---

## 🎯 **PASO 1: DEPLOYAR BACKEND EN UPCLOUD**

### Conectar al servidor
```bash
ssh root@TU_IP_UPCLOUD
```

### Clonar y configurar backend
```bash
# Crear directorio
mkdir -p /opt/solvik-backend
cd /opt/solvik-backend

# Clonar repositorio
git clone https://github.com/juan-dev-hub/solvik-studio.git .

# Ir al directorio backend
cd backend

# Configurar variables de entorno
cp .env.example .env
nano .env
```

### Configurar .env del backend
```bash
# Server Configuration
PORT=8000
NODE_ENV="production"
FRONTEND_URL="https://tu-frontend.vercel.app"

# Database
DATABASE_URL="postgresql://solvik_user:TU_PASSWORD@localhost:5432/solvik_saas"
POSTGRES_PASSWORD="TU_PASSWORD"

# JWT & Encryption
JWT_SECRET="tu-jwt-secret-32-caracteres"
ENCRYPTION_SECRET="tu-encryption-secret-32-chars"

# Servicios externos (configurar después)
TWILIO_ACCOUNT_SID="mock_sid"
TWILIO_AUTH_TOKEN="mock_token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Levantar backend
```bash
# Construir y levantar
docker-compose up -d

# Verificar que funciona
curl http://localhost:8000/api/health
```

---

## 🎯 **PASO 2: DEPLOYAR FRONTEND EN VERCEL**

### Preparar frontend localmente
```bash
# En tu máquina local
cd frontend

# Instalar Vercel CLI
npm i -g vercel

# Login a Vercel
vercel login

# Deployar
vercel --prod
```

### Configurar variables de entorno en Vercel
En el dashboard de Vercel, agregar:

```bash
NEXT_PUBLIC_API_URL=http://TU_IP_UPCLOUD:8000
NEXTAUTH_URL=https://tu-proyecto.vercel.app
NEXTAUTH_SECRET=tu-nextauth-secret
```

---

## 🔗 **PASO 3: CONECTAR FRONTEND Y BACKEND**

### Actualizar CORS en backend
```bash
# En el servidor UpCloud
cd /opt/solvik-backend/backend
nano .env
```

Cambiar:
```bash
FRONTEND_URL="https://tu-proyecto.vercel.app"
```

Reiniciar:
```bash
docker-compose restart backend
```

---

## ✅ **VERIFICACIÓN FINAL**

### Backend funcionando
```bash
curl http://TU_IP_UPCLOUD:8000/api/health
```

### Frontend funcionando
Visita: `https://tu-proyecto.vercel.app`

### Conexión frontend-backend
En el frontend, debería poder:
- ✅ Cargar la homepage
- ✅ Registrarse (conecta con backend)
- ✅ Iniciar sesión
- ✅ Acceder al admin panel

---

## 🎉 **RESULTADO**

**Frontend**: `https://tu-proyecto.vercel.app`
- Homepage pública
- Panel de administración
- Páginas de auth

**Backend**: `http://TU_IP_UPCLOUD:8000`
- API REST
- Base de datos PostgreSQL
- Uploads de archivos

**¡Tu SaaS está funcionando en arquitectura separada!** 🚀

---

## 🔧 **COMANDOS ÚTILES**

### Backend (UpCloud)
```bash
# Ver logs
docker-compose logs -f backend

# Reiniciar
docker-compose restart backend

# Actualizar código
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```

### Frontend (Vercel)
```bash
# Redeploy
vercel --prod

# Ver logs
vercel logs
```