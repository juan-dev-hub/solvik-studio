#!/bin/bash

# 🚀 Script para crear y ejecutar deployment en UpCloud

echo "🔧 PASO 1: Configurando el servidor base..."

# Actualizar sistema
apt update && apt upgrade -y

# Instalar dependencias esenciales
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw fail2ban

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

echo "✅ Dependencias instaladas"

echo "🔧 PASO 2: Clonando proyecto..."

# Limpiar directorio actual
rm -rf * .*git* 2>/dev/null || true

# Clonar repositorio
git clone https://github.com/juan-deb-hub/solvik-saas.git .

if [ ! -f "package.json" ]; then
    echo "❌ Error: No se pudo clonar el repositorio"
    echo "Verifica que el repositorio existe y es público"
    exit 1
fi

echo "✅ Repositorio clonado"

echo "🔧 PASO 3: Configurando aplicación..."

# Crear .env
cp .env.example .env

# Configurar variables básicas para desarrollo
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://solvik_user:solvik_secure_password_2024@localhost:5432/solvik_saas"
POSTGRES_PASSWORD="solvik_secure_password_2024"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="solvik-super-secret-key-for-development-only-32-chars"

# Encryption
ENCRYPTION_SECRET="solvik-encryption-key-32-chars!!"

# Development mode - servicios externos deshabilitados
NODE_ENV="development"

# Twilio (Mock para desarrollo)
TWILIO_ACCOUNT_SID="mock_sid"
TWILIO_AUTH_TOKEN="mock_token"
TWILIO_PHONE_NUMBER="+1234567890"

# Email (Mock para desarrollo)
RESEND_API_KEY="mock_key"
ADMIN_EMAIL="admin@solvik.app"

# Lemon Squeezy (Mock para desarrollo)
LEMON_SQUEEZY_API_KEY="mock_key"
LEMON_SQUEEZY_STORE_ID="mock_store"
LEMON_SQUEEZY_WEBHOOK_SECRET="mock_secret"

# Cloudflare (Mock para desarrollo)
CLOUDFLARE_API_TOKEN="mock_token"
CLOUDFLARE_ZONE_ID="mock_zone"

# Upload settings
UPLOAD_MAX_SIZE="10485760"
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/webp"

# Rate limiting
OTP_RATE_LIMIT_MAX="5"
OTP_RATE_LIMIT_WINDOW="3600000"

# Admin access (para desarrollo)
ADMIN_WHATSAPP_NUMBER="+1234567890"
ADMIN_EMAIL_ADDRESS="admin@solvik.app"
EOF

echo "✅ Variables de entorno configuradas"

# Dar permisos a scripts
chmod +x scripts/*.sh 2>/dev/null || true

# Crear directorios necesarios
mkdir -p /opt/solvik/backups
mkdir -p /opt/solvik/logs
mkdir -p public/uploads

echo "🔧 PASO 4: Levantando aplicación..."

# Construir y levantar servicios
docker-compose down || true
docker-compose build --no-cache
docker-compose up -d

echo "⏳ Esperando que la base de datos esté lista..."
sleep 30

# Ejecutar migraciones
echo "🗄️ Configurando base de datos..."
docker-compose exec -T app npx prisma migrate deploy || echo "⚠️ Migraciones pendientes"
docker-compose exec -T app npx prisma generate || echo "⚠️ Generate pendiente"

echo "🔧 PASO 5: Verificando aplicación..."
sleep 10

# Obtener IP pública
PUBLIC_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "localhost")

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo ""
    echo "🎉 ¡DEPLOYMENT EXITOSO!"
    echo "========================"
    echo ""
    echo "🌐 Tu aplicación Solvik está funcionando:"
    echo "   Homepage: http://$PUBLIC_IP:3000"
    echo "   Admin Panel: http://$PUBLIC_IP:3000/admin"
    echo ""
    echo "📊 Estado de contenedores:"
    docker-compose ps
    echo ""
    echo "📝 Próximos pasos opcionales:"
    echo "1. Configurar dominio propio"
    echo "2. Configurar SSL con Let's Encrypt"
    echo "3. Configurar servicios externos (Twilio, Resend, etc.)"
    echo ""
    echo "🔧 Comandos útiles:"
    echo "   Ver logs: docker-compose logs -f app"
    echo "   Reiniciar: docker-compose restart app"
    echo "   Parar: docker-compose down"
    echo ""
else
    echo "❌ Error en el deployment"
    echo "📋 Logs de la aplicación:"
    docker-compose logs --tail=30 app
    echo ""
    echo "📋 Estado de contenedores:"
    docker-compose ps
    echo ""
    echo "🔧 Para debug:"
    echo "   docker-compose logs app"
    echo "   docker-compose ps"
fi

echo "✅ Script completado"