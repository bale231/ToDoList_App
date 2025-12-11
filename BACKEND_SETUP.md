# Backend Setup Guide

Questa guida spiega come configurare il backend Django con PostgreSQL e Docker.

## 📋 Prerequisiti

- Docker e Docker Compose installati
- Git
- (Opzionale) Python 3.11+ per development locale

## 🐳 Setup con Docker (Consigliato)

### 1. Clone del Backend

```bash
cd ..
git clone https://github.com/bale231/todowebappbackend-django.git backend
cd backend
```

### 2. Crea `docker-compose.yml`

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: todolist_postgres
    environment:
      POSTGRES_DB: todolist_db
      POSTGRES_USER: todolist_user
      POSTGRES_PASSWORD: todolist_password_2024
      POSTGRES_HOST_AUTH_METHOD: trust
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - todolist_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U todolist_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  web:
    build: .
    container_name: todolist_django
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn todoproject.wsgi:application --bind 0.0.0.0:8000 --workers 3"
    volumes:
      - .:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    networks:
      - todolist_network

  nginx:
    image: nginx:alpine
    container_name: todolist_nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    ports:
      - "80:80"
    depends_on:
      - web
    networks:
      - todolist_network

volumes:
  postgres_data:
  static_volume:
  media_volume:

networks:
  todolist_network:
    driver: bridge
```

### 3. Crea `Dockerfile`

```dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    musl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Run migrations
RUN python manage.py migrate --noinput || true

EXPOSE 8000

CMD ["gunicorn", "todoproject.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### 4. Crea `.env`

```bash
# Django
SECRET_KEY=your-secret-key-here-change-this-in-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database
DATABASE_URL=postgresql://todolist_user:todolist_password_2024@db:5432/todolist_db

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006,exp://192.168.1.x:8081

# Email (Brevo)
BREVO_API_KEY=your-brevo-api-key

# Firebase
FIREBASE_CREDENTIALS_PATH=/app/todoproject/firebase-credentials.json
```

### 5. Aggiorna `settings.py`

Aggiungi al file `todoproject/settings.py`:

```python
import os
import dj_database_url

# Database
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600
    )
}

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# CORS per mobile
CORS_ALLOWED_ORIGINS += [
    "http://localhost:8081",      # Expo default
    "http://localhost:19006",     # Expo web
]

# Aggiungi regex per Expo mobile (cambia IP con il tuo)
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^exp://192\.168\.\d{1,3}\.\d{1,3}:8081$",
]
```

### 6. Crea `nginx.conf`

```nginx
user nginx;
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    upstream django {
        server web:8000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://django;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /static/ {
            alias /app/staticfiles/;
        }

        location /media/ {
            alias /app/media/;
        }
    }
}
```

### 7. Installa dipendenza aggiuntiva

Aggiungi a `requirements.txt`:

```
dj-database-url==2.1.0
psycopg2-binary==2.9.9
```

### 8. Build e Run

```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f web

# Create superuser
docker-compose exec web python manage.py createsuperuser
```

### 9. Verifica

```bash
# Test API
curl http://localhost:8000/api/

# Django admin
# Apri browser: http://localhost/admin/
```

## 🔧 Setup Locale (Senza Docker)

### 1. Installa PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Scarica installer da https://www.postgresql.org/download/windows/

### 2. Crea Database

```bash
# Accedi a PostgreSQL
psql postgres

# Crea database e user
CREATE DATABASE todolist_db;
CREATE USER todolist_user WITH PASSWORD 'todolist_password_2024';
ALTER ROLE todolist_user SET client_encoding TO 'utf8';
ALTER ROLE todolist_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE todolist_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE todolist_db TO todolist_user;
\q
```

### 3. Setup Python Environment

```bash
# Clone repository
git clone https://github.com/bale231/todowebappbackend-django.git backend
cd backend

# Crea virtual environment
python -m venv venv

# Attiva venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Installa dipendenze
pip install -r requirements.txt
pip install dj-database-url psycopg2-binary
```

### 4. Aggiorna `settings.py`

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'todolist_db',
        'USER': 'todolist_user',
        'PASSWORD': 'todolist_password_2024',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# CORS per mobile
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",              # Web app
    "http://localhost:8081",              # Expo
    "http://localhost:19006",             # Expo web
    "exp://192.168.1.x:8081",             # Cambia con tuo IP
]
```

### 5. Migrations e Run

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run development server
python manage.py runserver 0.0.0.0:8000
```

## 🔥 Firebase Setup (Push Notifications)

### 1. Ottieni Credenziali Firebase

1. Vai su https://console.firebase.google.com/
2. Seleziona progetto (o creane uno nuovo)
3. Vai in Project Settings > Service Accounts
4. Clicca "Generate new private key"
5. Salva file come `firebase-credentials.json`

### 2. Aggiungi al Backend

```bash
# Copia file nella directory del progetto
cp firebase-credentials.json backend/todoproject/
```

### 3. Test Notifiche

```python
# In Django shell
python manage.py shell

from todoproject.firebase_config import send_push_notification
send_push_notification(
    fcm_token="YOUR_DEVICE_TOKEN",
    title="Test",
    body="Push notification working!"
)
```

## 📧 Brevo Email Setup

### 1. Crea Account Brevo

1. Vai su https://www.brevo.com/
2. Sign up gratuito (300 email/giorno)
3. Vai in Settings > API Keys
4. Copia API key

### 2. Aggiungi a Backend

Crea file `todoproject/brevo_key.py`:

```python
BREVO_API_KEY = "xkeysib-your-api-key-here"
```

### 3. Test Email

```bash
# In browser
http://localhost:8000/api/test-email-config/
```

## 🧪 Testing

```bash
# Run tests
python manage.py test

# Test specifico
python manage.py test todos.tests

# Coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## 🚀 Production Deploy

### Con Docker su Server

```bash
# Build per production
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Nginx SSL con Let's Encrypt
# Usa certbot per SSL certificate
```

### Su PythonAnywhere (Attuale)

Il backend è già deployed su https://bale231.pythonanywhere.com/

## 📝 Comandi Utili

```bash
# Docker
docker-compose up -d                 # Start services
docker-compose down                  # Stop services
docker-compose logs -f web           # View logs
docker-compose exec web python manage.py shell  # Django shell
docker-compose restart web           # Restart Django

# Database
docker-compose exec db psql -U todolist_user todolist_db  # PostgreSQL shell

# Django
python manage.py makemigrations      # Create migrations
python manage.py migrate             # Apply migrations
python manage.py createsuperuser     # Create admin
python manage.py collectstatic       # Collect static files
```

## 🐛 Troubleshooting

### Port già in uso
```bash
# Trova processo
lsof -i :8000

# Kill processo
kill -9 <PID>
```

### Database connection error
```bash
# Verifica PostgreSQL running
docker-compose ps

# Restart database
docker-compose restart db
```

### CORS errors da mobile
```bash
# Trova tuo IP locale
ifconfig | grep inet  # macOS/Linux
ipconfig              # Windows

# Aggiorna CORS_ALLOWED_ORIGINS in settings.py
```

## 📚 References

- Django Docs: https://docs.djangoproject.com/
- PostgreSQL: https://www.postgresql.org/docs/
- Docker Compose: https://docs.docker.com/compose/
- Expo: https://docs.expo.dev/
