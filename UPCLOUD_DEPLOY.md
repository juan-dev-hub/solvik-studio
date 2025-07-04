# 🚀 DEPLOYMENT RÁPIDO EN UPCLOUD

## 📋 **COMANDO ÚNICO PARA CLONAR**

```bash
git clone https://github.com/juan-deb-hub/solvik-studio.git .
```

## ⚡ **DEPLOYMENT EN 3 PASOS**

### 1️⃣ **Conectar al servidor**
```bash
ssh root@TU_IP_UPCLOUD
```

### 2️⃣ **Preparar directorio**
```bash
mkdir -p /opt/solvik && cd /opt/solvik
```

### 3️⃣ **Clonar y deployar**
```bash
git clone https://github.com/juan-deb-hub/solvik-studio.git .
chmod +x fix-clone-and-deploy.sh
./fix-clone-and-deploy.sh
```

## 🎯 **ESO ES TODO**

El script automático se encarga de:
- ✅ Instalar todas las dependencias
- ✅ Configurar Docker
- ✅ Crear base de datos
- ✅ Levantar la aplicación
- ✅ Verificar que funcione

## 🌐 **ACCEDER A TU APP**

Después del deployment:
- **Homepage**: `http://TU_IP:3000`
- **Admin Panel**: `http://TU_IP:3000/admin`

## 🔧 **CONFIGURACIÓN OPCIONAL**

Si quieres configurar servicios externos (WhatsApp, email, etc.):
```bash
nano .env
```

¡Pero la app funciona perfectamente sin configurar nada! 🚀