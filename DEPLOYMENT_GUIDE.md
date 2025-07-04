# 🚀 Guía de Deployment: Solvik SaaS en UpCloud

## 📋 **PREREQUISITOS**
- ✅ Servidor UpCloud creado
- ✅ SSH key generada
- ✅ Código en GitHub
- ✅ Dominio configurado (opcional)

## 🔧 **PASO 1: CONECTAR AL SERVIDOR**

### Obtener la IP de tu servidor UpCloud:
1. Ve a tu panel de UpCloud
2. Copia la **IP pública** de tu servidor

### Conectar por SSH:
```bash
ssh root@TU_IP_DEL_SERVIDOR
```

Si es la primera vez, te preguntará si confías en el servidor, escribe `yes`.

## 🛠️ **PASO 2: CONFIGURAR EL SERVIDOR**

### Actualizar el sistema:
```bash
apt update && apt upgrade -y
```

### Instalar dependencias esenciales:
```bash
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw fail2ban
```

### Instalar Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### Instalar Docker Compose:
```bash
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Instalar Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

## 📁 **PASO 3: CLONAR TU PROYECTO**

### Crear directorio de trabajo:
```bash
mkdir -p /opt/solvik
cd /opt/solvik
```

### Clonar desde GitHub:
```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git .
```

**⚠️ Reemplaza `TU_USUARIO/TU_REPOSITORIO` con tu información real**

## 🔐 **PASO 4: CONFIGURAR VARIABLES DE ENTORNO**

### Copiar archivo de configuración:
```bash
cp .env.production .env
```

### Editar variables de entorno:
```bash
nano .env
```

**Configura estas variables importantes:**
```bash
# Base de datos
DATABASE_URL="postgresql://solvik_user:TU_PASSWORD_SEGURO@localhost:5432/solvik_saas"
POSTGRES_PASSWORD="TU_PASSWORD_SEGURO"

# NextAuth
NEXTAUTH_URL="https://TU_DOMINIO.com"
NEXTAUTH_SECRET="tu-secret-super-seguro-de-32-caracteres"

# Encriptación
ENCRYPTION_SECRET="tu-clave-de-32-caracteres-exactos"

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID="tu-twilio-sid"
TWILIO_AUTH_TOKEN="tu-twilio-token"
TWILIO_PHONE_NUMBER="tu-numero-whatsapp"

# Email
RESEND_API_KEY="tu-resend-key"
ADMIN_EMAIL="admin@tudominio.com"

# Cloudflare
CLOUDFLARE_API_TOKEN="tu-cloudflare-token"
CLOUDFLARE_ZONE_ID="tu-zone-id"
```

**Para guardar en nano:** `Ctrl + X`, luego `Y`, luego `Enter`

## 🚀 **PASO 5: LEVANTAR LA APLICACIÓN**

### Dar permisos a scripts:
```bash
chmod +x scripts/*.sh
```

### Construir y levantar servicios:
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Esperar que la base de datos esté lista:
```bash
sleep 15
```

### Ejecutar migraciones:
```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma generate
```

## 🌐 **PASO 6: CONFIGURAR NGINX**

### Copiar configuración de Nginx:
```bash
cp scripts/nginx.conf /etc/nginx/sites-available/solvik.app
ln -sf /etc/nginx/sites-available/solvik.app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
```

### Probar configuración:
```bash
nginx -t
```

### Reiniciar Nginx:
```bash
systemctl reload nginx
```

## 🔒 **PASO 7: CONFIGURAR SSL (HTTPS)**

### Si tienes dominio propio:
```bash
certbot --nginx -d tudominio.com -d www.tudominio.com
```

### Si usas solo IP (para pruebas):
```bash
# Saltear este paso por ahora
```

## 🔥 **PASO 8: CONFIGURAR FIREWALL**

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
```

## ✅ **PASO 9: VERIFICAR QUE TODO FUNCIONA**

### Verificar contenedores:
```bash
docker-compose ps
```

### Verificar salud de la aplicación:
```bash
curl http://localhost:3000/api/health
```

### Ver logs si hay problemas:
```bash
docker-compose logs app
```

## 🎯 **ACCEDER A TU APLICACIÓN**

### Si configuraste dominio:
- **Homepage:** `https://tudominio.com`
- **Admin:** `https://tudominio.com/admin`

### Si usas solo IP:
- **Homepage:** `http://TU_IP:3000`
- **Admin:** `http://TU_IP:3000/admin`

## 🔧 **COMANDOS ÚTILES PARA MANTENIMIENTO**

### Ver logs en tiempo real:
```bash
docker-compose logs -f app
```

### Reiniciar aplicación:
```bash
docker-compose restart app
```

### Actualizar código:
```bash
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```

### Backup de base de datos:
```bash
./scripts/backup-db.sh
```

## 🆘 **SOLUCIÓN DE PROBLEMAS COMUNES**

### Si la aplicación no responde:
```bash
docker-compose logs app
docker-compose restart app
```

### Si hay problemas con la base de datos:
```bash
docker-compose logs postgres
docker-compose restart postgres
```

### Si Nginx da error:
```bash
nginx -t
systemctl status nginx
```

## 📞 **¿NECESITAS AYUDA?**

Si algo no funciona, comparte conmigo:
1. El error exacto que ves
2. Los logs: `docker-compose logs app`
3. El estado de los contenedores: `docker-compose ps`

¡Y te ayudo a solucionarlo! 🚀

---

**🎉 ¡Felicidades! Tu Solvik SaaS ya está en producción!**