#!/bin/bash

# 🚀 Script para crear repositorio en GitHub y hacer deployment

echo "🔧 PASO 1: Creando repositorio local..."

# Inicializar git en el directorio actual
git init

# Configurar usuario de git
git config user.name "juan-deb-hub"
git config user.email "juan@solvik.app"

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "🚀 Initial commit: Solvik SaaS Platform"

echo "✅ Repositorio local creado"

echo ""
echo "🔧 PASO 2: Instrucciones para GitHub..."
echo ""
echo "Ahora necesitas crear el repositorio en GitHub:"
echo ""
echo "1. Ve a: https://github.com/new"
echo "2. Repository name: solvik-saas"
echo "3. Description: Plataforma SaaS para crear landing pages sin código"
echo "4. Selecciona 'Public' o 'Private'"
echo "5. NO marques 'Add a README file'"
echo "6. NO marques 'Add .gitignore'"
echo "7. NO marques 'Choose a license'"
echo "8. Click 'Create repository'"
echo ""
echo "Después de crear el repositorio, ejecuta:"
echo ""
echo "git remote add origin https://github.com/juan-deb-hub/solvik-saas.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""