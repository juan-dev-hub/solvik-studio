#!/bin/bash

# Solvik SaaS - Monitoring Script
# Run this script to check system health

echo "🔍 Solvik SaaS System Health Check"
echo "=================================="

# Check Docker containers
echo "🐳 Docker Containers:"
docker-compose ps

echo ""
echo "💾 Database Status:"
if docker-compose exec -T postgres pg_isready -U solvik_user > /dev/null 2>&1; then
    echo "✅ Database is healthy"
else
    echo "❌ Database is not responding"
fi

echo ""
echo "🌐 Application Status:"
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy"
    curl -s http://localhost:3000/api/health | jq .
else
    echo "❌ Application is not responding"
fi

echo ""
echo "🔒 SSL Certificate:"
if command -v openssl > /dev/null 2>&1; then
    echo | openssl s_client -servername solvik.app -connect solvik.app:443 2>/dev/null | openssl x509 -noout -dates
fi

echo ""
echo "💽 Disk Usage:"
df -h /opt/solvik

echo ""
echo "🧠 Memory Usage:"
free -h

echo ""
echo "⚡ CPU Load:"
uptime

echo ""
echo "📊 Recent Logs (last 10 lines):"
docker-compose logs --tail=10 app