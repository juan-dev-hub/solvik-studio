#!/bin/bash

# Solvik SaaS Deployment Script
# This script handles the complete deployment process

set -e

echo "🚀 Starting Solvik SaaS deployment..."

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build new images
echo "🔨 Building new images..."
docker-compose build --no-cache

# Start services
echo "▶️ Starting services..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec app npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
docker-compose exec app npx prisma generate

# Check health
echo "🏥 Checking application health..."
sleep 5

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Deployment successful! Application is running."
else
    echo "❌ Deployment failed! Application is not responding."
    docker-compose logs app
    exit 1
fi

echo "🎉 Solvik SaaS deployed successfully!"