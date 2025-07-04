#!/bin/bash

# 🚀 Script completo para configurar Solvik SaaS desde cero

echo "🔧 Configurando Solvik SaaS desde cero..."

# Limpiar directorio completamente
echo "🧹 Limpiando directorio..."
rm -rf * .* 2>/dev/null || true

# Clonar repositorio completo
echo "📥 Clonando repositorio completo..."
git clone https://github.com/juan-dev-hub/solvik-studio.git .

# Verificar que tenemos los archivos necesarios
if [ ! -f "package.json" ]; then
    echo "❌ Error: El repositorio no contiene package.json"
    echo "📋 Contenido actual:"
    ls -la
    echo ""
    echo "🔄 Intentando clonar desde el repositorio correcto..."
    
    # Limpiar y intentar de nuevo
    cd ..
    rm -rf solvik
    mkdir solvik
    cd solvik
    
    # Intentar con diferentes URLs
    echo "🌐 Intentando diferentes URLs del repositorio..."
    
    if git clone https://github.com/juan-dev-hub/solvik-studio.git .; then
        echo "✅ Clonado exitosamente"
    elif git clone https://github.com/juan-deb-hub/solvik-studio.git .; then
        echo "✅ Clonado exitosamente (URL alternativa)"
    else
        echo "❌ Error clonando repositorio"
        echo "📝 Creando proyecto básico..."
        
        # Crear estructura básica del proyecto
        cat > package.json << 'EOF'
{
  "name": "solvik-saas",
  "version": "1.0.0",
  "description": "Plataforma SaaS para crear landing pages",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^5.7.1",
    "next": "13.5.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "prisma": "^5.7.1",
    "typescript": "5.2.2"
  }
}
EOF

        # Crear Dockerfile básico
        cat > Dockerfile << 'EOF'
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOF

        # Crear docker-compose.yml básico
        cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: solvik_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: solvik_saas
      POSTGRES_USER: solvik_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-solvik_secure_password_2024}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - solvik_network

  app:
    build: .
    container_name: solvik_app
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://solvik_user:${POSTGRES_PASSWORD:-solvik_secure_password_2024}@postgres:5432/solvik_saas
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    networks:
      - solvik_network

volumes:
  postgres_data:

networks:
  solvik_network:
    driver: bridge
EOF
    fi
fi

# Verificar archivos críticos
echo "🔍 Verificando archivos críticos..."
MISSING_FILES=()

if [ ! -f "package.json" ]; then
    MISSING_FILES+=("package.json")
fi

if [ ! -f "docker-compose.yml" ]; then
    MISSING_FILES+=("docker-compose.yml")
fi

if [ ! -f "Dockerfile" ]; then
    MISSING_FILES+=("Dockerfile")
fi

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo "❌ Archivos faltantes: ${MISSING_FILES[*]}"
    echo "📝 Creando archivos faltantes..."
    
    # Crear archivos básicos si faltan
    if [ ! -f "package.json" ]; then
        cat > package.json << 'EOF'
{
  "name": "solvik-saas",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start"
  },
  "dependencies": {
    "next": "13.5.1",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
EOF
    fi
    
    if [ ! -f "next.config.js" ]; then
        cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true }
};

module.exports = nextConfig;
EOF
    fi
    
    # Crear app básica
    mkdir -p app
    if [ ! -f "app/page.tsx" ]; then
        cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Solvik SaaS</h1>
        <p className="text-xl">Plataforma para crear landing pages</p>
      </div>
    </div>
  );
}
EOF
    fi
    
    if [ ! -f "app/layout.tsx" ]; then
        cat > app/layout.tsx << 'EOF'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
EOF
    fi
fi

echo "✅ Archivos verificados"

# Configurar .env
echo "📝 Configurando variables de entorno..."
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://solvik_user:solvik_secure_password_2024@localhost:5432/solvik_saas"
POSTGRES_PASSWORD="solvik_secure_password_2024"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="solvik-super-secret-key-for-development-only-32-chars"

# Development mode
NODE_ENV="development"
EOF

# Instalar Docker si no está
if ! command -v docker &> /dev/null; then
    echo "🐳 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Instalar Docker Compose si no está
if ! command -v docker-compose &> /dev/null; then
    echo "🐙 Instalando Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Crear directorios
echo "📁 Creando directorios..."
mkdir -p public uploads logs

# Deployment
echo "🚀 Iniciando deployment..."
docker-compose down || true

echo "🔨 Construyendo aplicación..."
docker-compose build --no-cache

echo "▶️ Levantando servicios..."
docker-compose up -d

# Esperar
echo "⏳ Esperando servicios (30 segundos)..."
sleep 30

# Verificar
echo "🏥 Verificando aplicación..."
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo ""
    echo "🎉 ¡DEPLOYMENT EXITOSO!"
    echo "========================"
    echo ""
    echo "🌐 Tu aplicación está funcionando:"
    echo "   Homepage: http://$PUBLIC_IP:3000"
    echo ""
    echo "📊 Estado de contenedores:"
    docker-compose ps
else
    echo "❌ Error en el deployment"
    echo "📋 Logs:"
    docker-compose logs --tail=20
fi

echo "✅ Setup completado"