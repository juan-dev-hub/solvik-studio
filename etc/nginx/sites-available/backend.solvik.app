server {
    listen 80;
    server_name api.solvik.app backend.solvik.app;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Configuración para health check
    location /api/health {
        proxy_pass http://localhost:8000/api/health;
        access_log off;
        proxy_cache_bypass $http_upgrade;
    }
}