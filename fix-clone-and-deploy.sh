#!/bin/bash

# 🚀 Script para clonar correctamente y hacer deployment

echo "🔧 Clonando repositorio desde GitHub..."

# Limpiar directorio actual si tiene archivos
if [ "$(ls -A .)" ]; then
    echo "📁 Limpiando directorio actual..."
    rm -rf * .*git* 2>/dev/null || true
fi

# Clonar el repositorio correcto
echo "📥 Clonando desde GitHub..."
git clone https://github.com/juan-deb-hub/solvik-saas.git .

echo "✅ Repositorio clonado correctamente"

# Verificar que tenemos los archivos
if [ -f "package.json" ]; then
    echo "✅ Archivos del proyecto encontrados"
else
    echo "❌ Error: No se encontró package.json"
    exit 1
fi

# Configurar .env
echo "📝 Configurando variables de entorno..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Necesitas configurar el archivo .env"
    echo "Edita las siguientes variables críticas:"
    echo "- DATABASE_URL"
    echo "- NEXTAUTH_SECRET"
    echo "- ENCRYPTION_SECRET"
    echo ""
    echo "¿Quieres editarlo ahora? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        nano .env
    fi
fi

# Dar permisos
echo "🔧 Configurando permisos..."
chmod +x scripts/*.sh

# Crear directorios
echo "📁 Creando directorios necesarios..."
mkdir -p /opt/solvik/backups
mkdir -p /opt/solvik/logs
mkdir -p public/uploads

# Deployment
echo "🚀 Iniciando deployment..."
docker-compose down || true
docker-compose build --no-cache
docker-compose up -d

# Esperar base de datos
echo "⏳ Esperando base de datos (30 segundos)..."
sleep 30

# Migraciones
echo "🗄️ Ejecutando migraciones de base de datos..."
docker-compose exec -T app npx prisma migrate deploy
docker-compose exec -T app npx prisma generate

# Verificar
echo "🏥 Verificando aplicación..."
sleep 10

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo ""
    echo "🎉 ¡DEPLOYMENT EXITOSO!"
    echo "========================"
    echo ""
    echo "🌐 Tu aplicación está funcionando:"
    echo "   Homepage: http://$(curl -s ifconfig.me):3000"
    echo "   Admin Panel: http://$(curl -s ifconfig.me):3000/admin"
    echo ""
    echo "📊 Estado de contenedores:"
    docker-compose ps
    echo ""
    echo "📝 Próximos pasos:"
    echo "1. Configura tu dominio (opcional)"
    echo "2. Configura SSL con Let's Encrypt"
    echo "3. Configura tus servicios externos (Twilio, etc.)"
else
    echo "❌ Error en el deployment"
    echo "📋 Logs de la aplicación:"
    docker-compose logs --tail=30 app
    echo ""
    echo "📋 Estado de contenedores:"
    docker-compose ps
fi