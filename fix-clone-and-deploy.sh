#!/bin/bash

# 🚀 Script para clonar correctamente y hacer deployment

echo "🔧 Verificando repositorio..."

# Verificar que tenemos los archivos del proyecto
if [ -f "package.json" ]; then
    echo "✅ Archivos del proyecto encontrados"
elif [ -f ".git/config" ]; then
    echo "📁 Repositorio git encontrado, verificando archivos..."
    ls -la
    if [ ! -f "package.json" ]; then
        echo "❌ Error: package.json no encontrado en el repositorio"
        echo "📋 Archivos disponibles:"
        ls -la
        echo ""
        echo "🔄 Intentando hacer git pull para obtener archivos faltantes..."
        git pull origin main
        
        if [ ! -f "package.json" ]; then
            echo "❌ Aún no se encuentra package.json. Verificando el repositorio..."
            echo "🌐 Repositorio remoto:"
            git remote -v
            echo ""
            echo "📂 Contenido actual:"
            find . -name "*.json" -o -name "*.js" -o -name "*.ts" | head -10
            exit 1
        fi
    fi
else
    echo "❌ Error: No se encontró ni package.json ni repositorio git"
    echo "📋 Contenido del directorio:"
    ls -la
    exit 1
fi

echo "✅ Archivos del proyecto verificados"

# Configurar .env
echo "📝 Configurando variables de entorno..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Archivo .env creado desde .env.example"
    else
        echo "📝 Creando archivo .env básico..."
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
    fi
    
    echo "⚠️  IMPORTANTE: Archivo .env configurado para desarrollo"
    echo "Para producción, edita las variables críticas:"
    echo "- DATABASE_URL"
    echo "- NEXTAUTH_SECRET"
    echo "- ENCRYPTION_SECRET"
else
    echo "✅ Archivo .env ya existe"
fi

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "🐳 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Verificar que Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "🐙 Instalando Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Dar permisos a scripts
echo "🔧 Configurando permisos..."
chmod +x scripts/*.sh 2>/dev/null || echo "⚠️ No se encontraron scripts adicionales"

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p /opt/solvik/backups
mkdir -p /opt/solvik/logs
mkdir -p public/uploads

# Verificar que tenemos docker-compose.yml
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encontró docker-compose.yml"
    echo "📋 Archivos disponibles:"
    ls -la *.yml *.yaml 2>/dev/null || echo "No hay archivos YAML"
    exit 1
fi

# Deployment
echo "🚀 Iniciando deployment..."
docker-compose down || true

echo "🔨 Construyendo contenedores..."
docker-compose build --no-cache

echo "▶️ Levantando servicios..."
docker-compose up -d

# Esperar base de datos
echo "⏳ Esperando base de datos (30 segundos)..."
sleep 30

# Verificar que los contenedores están corriendo
echo "📊 Estado de contenedores:"
docker-compose ps

# Migraciones
echo "🗄️ Ejecutando migraciones de base de datos..."
if docker-compose exec -T app npx prisma migrate deploy; then
    echo "✅ Migraciones ejecutadas correctamente"
else
    echo "⚠️ Error en migraciones, continuando..."
fi

if docker-compose exec -T app npx prisma generate; then
    echo "✅ Prisma client generado correctamente"
else
    echo "⚠️ Error generando Prisma client, continuando..."
fi

# Verificar
echo "🏥 Verificando aplicación..."
sleep 10

# Obtener IP pública
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "localhost")

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo ""
    echo "🎉 ¡DEPLOYMENT EXITOSO!"
    echo "========================"
    echo ""
    echo "🌐 Tu aplicación está funcionando:"
    echo "   Homepage: http://$PUBLIC_IP:3000"
    echo "   Admin Panel: http://$PUBLIC_IP:3000/admin"
    echo "   Health Check: http://$PUBLIC_IP:3000/api/health"
    echo ""
    echo "📊 Estado de contenedores:"
    docker-compose ps
    echo ""
    echo "📝 Próximos pasos:"
    echo "1. Configura tu dominio (opcional)"
    echo "2. Configura SSL con Let's Encrypt"
    echo "3. Configura tus servicios externos (Twilio, etc.)"
    echo ""
    echo "🔧 Comandos útiles:"
    echo "   Ver logs: docker-compose logs -f app"
    echo "   Reiniciar: docker-compose restart app"
    echo "   Parar: docker-compose down"
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
    echo "   docker-compose exec app ls -la"
fi

echo ""
echo "✅ Script completado"