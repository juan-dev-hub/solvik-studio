#!/bin/bash

# Solvik SaaS - Production Deployment Script for UpCloud
# Run this after setting up the server and configuring .env

set -e

echo "🚀 Deploying Solvik SaaS to production..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found. Copy .env.production to .env and configure it"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p /opt/solvik/backups
mkdir -p /opt/solvik/logs
mkdir -p /opt/solvik/public/uploads

# Set proper permissions
sudo chown -R $USER:$USER /opt/solvik
chmod +x scripts/*.sh

# Build and start services
echo "🔨 Building and starting services..."
docker-compose down || true
docker-compose build --no-cache
docker-compose up -d

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 15

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec -T app npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
docker-compose exec -T app npx prisma generate

# Setup Nginx
echo "🌐 Configuring Nginx..."
sudo cp scripts/nginx.conf /etc/nginx/sites-available/solvik.app
sudo ln -sf /etc/nginx/sites-available/solvik.app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
echo "🔒 Setting up SSL certificate..."
sudo certbot --nginx -d solvik.app -d www.solvik.app --non-interactive --agree-tos --email admin@solvik.app

# Setup automatic SSL renewal
echo "🔄 Setting up SSL auto-renewal..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

# Setup log rotation
echo "📝 Setting up log rotation..."
sudo cp scripts/logrotate.conf /etc/logrotate.d/solvik

# Setup backup cron job
echo "💾 Setting up automatic backups..."
echo "0 2 * * * /opt/solvik/scripts/backup-db.sh" | crontab -

# Health check
echo "🏥 Checking application health..."
sleep 10

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application is running locally!"
else
    echo "❌ Application health check failed!"
    docker-compose logs app
    exit 1
fi

# Final checks
echo "🔍 Running final checks..."
docker-compose ps
sudo systemctl status nginx

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Post-deployment checklist:"
echo "✅ Application running on http://localhost:3000"
echo "✅ Nginx configured for solvik.app"
echo "✅ SSL certificate installed"
echo "✅ Database migrations applied"
echo "✅ Automatic backups configured"
echo "✅ Log rotation configured"
echo ""
echo "🌐 Your site should be available at: https://solvik.app"
echo "🔧 Admin panel: https://solvik.app/admin"
echo ""
echo "📊 Monitoring commands:"
echo "  docker-compose logs -f app    # View app logs"
echo "  docker-compose ps             # Check container status"
echo "  ./scripts/backup-db.sh        # Manual backup"
echo "  sudo nginx -t                 # Test nginx config"