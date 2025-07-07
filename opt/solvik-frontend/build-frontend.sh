#!/bin/bash

# Script para construir y exportar el frontend de Solvik

echo "🔨 Construyendo el frontend de Solvik..."

# Instalar dependencias
npm install

# Construir y exportar
npm run build

# Verificar si la carpeta 'out' existe
if [ -d "out" ]; then
  echo "✅ Frontend construido exitosamente"
  echo "📁 Los archivos estáticos están en la carpeta 'out'"
else
  echo "❌ Error al construir el frontend"
  exit 1
fi

# Instalar express para el servidor estático si no está instalado
if ! npm list express | grep -q express; then
  echo "📦 Instalando express..."
  npm install --save express
fi

echo "🚀 Todo listo para iniciar el servidor con 'npm start'"