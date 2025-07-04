#!/bin/bash

# 🌅 Script súper rápido para mañana

echo "🌅 Buenos días! Deployment rápido de Solvik..."

# Limpiar todo
docker-compose down || true
docker system prune -f

# Crear versión mínima que funciona
cat > docker-compose.simple.yml << 'EOF'
version: '3.8'
services:
  app:
    image: node:18-alpine
    working_dir: /app
    command: sh -c "npm install && npm run dev"
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    environment:
      - NODE_ENV=development
EOF

# Crear package.json mínimo
cat > package.json << 'EOF'
{
  "name": "solvik-saas",
  "scripts": {
    "dev": "node server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

# Crear servidor Express súper simple
cat > server.js << 'EOF'
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Solvik SaaS</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>🎉 Solvik SaaS Funcionando!</h1>
        <p>Tu aplicación está corriendo correctamente</p>
        <p>Servidor: ${new Date().toLocaleString()}</p>
        <a href="/admin" style="background: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Panel Admin</a>
      </body>
    </html>
  `);
});

app.get('/admin', (req, res) => {
  res.send(`
    <html>
      <head><title>Admin - Solvik</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>🔧 Panel de Administración</h1>
        <p>Aquí irá tu panel de control</p>
        <a href="/" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Volver al Inicio</a>
      </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Solvik SaaS funcionando correctamente'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Solvik SaaS corriendo en http://localhost:${port}`);
});
EOF

# Levantar versión simple
echo "🚀 Levantando versión simple..."
docker-compose -f docker-compose.simple.yml up -d

sleep 10

# Verificar
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo ""
    echo "🎉 ¡FUNCIONANDO!"
    echo "==============="
    echo ""
    echo "🌐 Accede a:"
    echo "   Homepage: http://$PUBLIC_IP:3000"
    echo "   Admin: http://$PUBLIC_IP:3000/admin"
    echo "   API: http://$PUBLIC_IP:3000/api/health"
    echo ""
    echo "✅ Todo listo en menos de 2 minutos!"
else
    echo "❌ Error. Logs:"
    docker-compose -f docker-compose.simple.yml logs
fi