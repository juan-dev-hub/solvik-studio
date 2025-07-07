#!/bin/bash

# Script to update the Solvik backend

cd /opt/solvik-backend/backend

# Pull latest changes if using git
# git pull origin main

# Restart the service
docker-compose down
docker-compose up -d

echo "Backend updated and restarted!"