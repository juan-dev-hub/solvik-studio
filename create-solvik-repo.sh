#!/bin/bash

# 🚀 Script para crear repositorio Solvik SaaS en GitHub

echo "🔧 Creando repositorio 'solvik-studio' en GitHub..."

# Configurar git
git config --global user.name "juan-deb-hub"
git config --global user.email "juan@solvik.app"

# Inicializar repositorio
git init
git add .
git commit -m "🚀 Solvik Studio: Plataforma SaaS para landing pages sin código

✨ Características:
- Landing pages en 5 minutos
- Multiidioma automático (ES/EN/FI)
- Hosting incluido
- Panel de administración simple
- Formularios de contacto
- Subdominio gratuito
- SSL automático

🛠️ Stack:
- Next.js 13 + TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- NextAuth.js + WhatsApp OTP
- Docker + Docker Compose

🚀 Listo para producción en UpCloud"

echo "✅ Repositorio local preparado"
echo ""
echo "🔗 ENLACE PARA CLONAR EN UPCLOUD:"
echo "=================================="
echo ""
echo "git clone https://github.com/juan-deb-hub/solvik-studio.git ."
echo ""
echo "📋 INSTRUCCIONES PARA UPCLOUD:"
echo "1. Conecta a tu servidor: ssh root@TU_IP"
echo "2. Crea directorio: mkdir -p /opt/solvik && cd /opt/solvik"
echo "3. Clona el repo: git clone https://github.com/juan-deb-hub/solvik-studio.git ."
echo "4. Ejecuta deployment: ./fix-clone-and-deploy.sh"
echo ""
echo "⚠️  IMPORTANTE: Primero necesitas crear el repositorio en GitHub:"
echo "1. Ve a: https://github.com/new"
echo "2. Repository name: solvik-studio"
echo "3. Description: Plataforma SaaS para crear landing pages sin código"
echo "4. Selecciona 'Public'"
echo "5. NO marques ninguna opción adicional"
echo "6. Click 'Create repository'"
echo ""
echo "Después ejecuta estos comandos:"
echo "git remote add origin https://github.com/juan-deb-hub/solvik-studio.git"
echo "git branch -M main"
echo "git push -u origin main"