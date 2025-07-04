#!/bin/bash

# Solvik SaaS - UpCloud Server Setup Script
# Run this script on your fresh UpCloud Ubuntu server

set -e

echo "🚀 Setting up Solvik SaaS on UpCloud..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx ufw fail2ban

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🐙 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (for local development/debugging)
echo "📗 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/solvik
sudo chown $USER:$USER /opt/solvik
cd /opt/solvik

# Clone repository (you'll need to do this manually with your repo)
echo "📥 Clone your repository here:"
echo "git clone https://github.com/tu-usuario/solvik-saas.git ."

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Setup fail2ban
echo "🛡️ Configuring fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

echo "✅ Basic server setup completed!"
echo ""
echo "🔄 Next steps:"
echo "1. Clone your repository to /opt/solvik"
echo "2. Copy .env.production to .env and configure it"
echo "3. Run ./scripts/production-deploy.sh"