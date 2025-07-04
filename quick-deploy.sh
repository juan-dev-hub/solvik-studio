#!/bin/bash

# 🚀 Script de deployment rápido para UpCloud

set -e

echo "🚀 Solvik SaaS - Deployment Rápido"
echo "=================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "Asegúrate de estar en el directorio del proyecto"
    exit 1
fi

echo "📁 Directorio correcto ✅"

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales reales"
    echo "nano .env"
    read -p "Presiona Enter cuando hayas configurado el .env..."
fi

# Dar permisos a scripts
echo "🔧 Configurando permisos..."
chmod +x scripts/*.sh

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p /opt/solvik/backups
mkdir -p /opt/solvik/logs
mkdir -p public/uploads

# Construir y levantar servicios
echo "🐳 Construyendo contenedores..."
docker-compose down || true
docker-compose build --no-cache

echo "▶️ Levantando servicios..."
docker-compose up -d

# Esperar que la base de datos esté lista
echo "⏳ Esperando base de datos..."
sleep 20

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
docker-compose exec -T app npx prisma migrate deploy || echo "⚠️ Migraciones fallaron, continuando..."
docker-compose exec -T app npx prisma generate || echo "⚠️ Generate falló, continuando..."

# Verificar salud
echo "🏥 Verificando salud de la aplicación..."
sleep 5

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ ¡Aplicación funcionando!"
    echo ""
    echo "🌐 Accede a tu aplicación:"
    echo "   Homepage: http://$(curl -s ifconfig.me):3000"
    echo "   Admin: http://$(curl -s ifconfig.me):3000/admin"
    echo ""
else
    echo "❌ La aplicación no responde"
    echo "📋 Logs de la aplicación:"
    docker-compose logs --tail=20 app
fi

echo ""
echo "📊 Estado de contenedores:"
docker-compose ps

echo ""
echo "🎉 Deployment completado!"