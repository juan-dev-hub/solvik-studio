#!/bin/bash

# Solvik SaaS - Production Testing Script
# Run this to test all functionality before going live

set -e

echo "🧪 Testing Solvik SaaS Production Setup..."

BASE_URL="https://solvik.app"
if [ "$1" = "local" ]; then
    BASE_URL="http://localhost:3000"
fi

echo "Testing against: $BASE_URL"

# Test 1: Health check
echo "🏥 Testing health endpoint..."
if curl -f "$BASE_URL/api/health" > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi

# Test 2: Homepage loads
echo "🏠 Testing homepage..."
if curl -f "$BASE_URL" > /dev/null 2>&1; then
    echo "✅ Homepage loads"
else
    echo "❌ Homepage failed to load"
    exit 1
fi

# Test 3: Auth pages load
echo "🔐 Testing auth pages..."
if curl -f "$BASE_URL/auth/signin" > /dev/null 2>&1; then
    echo "✅ Signin page loads"
else
    echo "❌ Signin page failed"
    exit 1
fi

if curl -f "$BASE_URL/auth/signup" > /dev/null 2>&1; then
    echo "✅ Signup page loads"
else
    echo "❌ Signup page failed"
    exit 1
fi

# Test 4: Database connection
echo "🗄️ Testing database connection..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/health")
if echo "$HEALTH_RESPONSE" | grep -q "connected"; then
    echo "✅ Database connection working"
else
    echo "❌ Database connection failed"
    echo "Response: $HEALTH_RESPONSE"
    exit 1
fi

# Test 5: SSL Certificate (if testing production)
if [ "$BASE_URL" = "https://solvik.app" ]; then
    echo "🔒 Testing SSL certificate..."
    if echo | openssl s_client -servername solvik.app -connect solvik.app:443 2>/dev/null | openssl x509 -noout -text | grep -q "solvik.app"; then
        echo "✅ SSL certificate is valid"
    else
        echo "❌ SSL certificate issue"
        exit 1
    fi
fi

# Test 6: File upload directory
echo "📁 Testing upload directory..."
if [ -d "/opt/solvik/public/uploads" ]; then
    echo "✅ Upload directory exists"
else
    echo "❌ Upload directory missing"
    exit 1
fi

# Test 7: Environment variables
echo "🔧 Testing environment variables..."
if docker-compose exec -T app node -e "console.log(process.env.DATABASE_URL ? 'DB_OK' : 'DB_MISSING')" | grep -q "DB_OK"; then
    echo "✅ Environment variables loaded"
else
    echo "❌ Environment variables missing"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Production setup is ready."
echo ""
echo "📋 Final checklist:"
echo "✅ Application health check"
echo "✅ Homepage accessibility"
echo "✅ Authentication pages"
echo "✅ Database connectivity"
if [ "$BASE_URL" = "https://solvik.app" ]; then
    echo "✅ SSL certificate"
fi
echo "✅ File upload directory"
echo "✅ Environment configuration"
echo ""
echo "🚀 Your Solvik SaaS is ready for production!"