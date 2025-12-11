# ToDoList Mobile App

Una potente app mobile per iOS e Android per la gestione di liste todo collaborative, costruita con React Native ed Expo.

## 🚀 Funzionalità

### ✅ Implementate
- **Autenticazione completa**
  - Login con username o email
  - Registrazione con verifica email
  - JWT token authentication con auto-refresh
  - Remember me functionality
  - Logout sicuro

- **Gestione Todo Lists**
  - Creazione, modifica ed eliminazione liste
  - Organizzazione in categorie
  - 5 colori predefiniti (blue, green, yellow, red, purple)
  - Progress tracking per ogni lista
  - Visualizzazione numero items

- **UI/UX**
  - Design glassmorphism (come webapp)
  - Dark/Light mode automatico
  - Animazioni smooth con React Native Reanimated
  - Safe Area support per notch/island
  - Pull to refresh

- **Architettura**
  - Expo Router (file-based routing)
  - Context API per state management
  - API service layer modulare
  - TypeScript per type safety
  - Secure storage per tokens (expo-secure-store)

### 🚧 In Sviluppo
- Gestione Todo con swipe gestures
- Sistema amici e condivisione liste
- Push notifications (Firebase Cloud Messaging)
- Upload immagine profilo
- Notifiche in-app
- Drag & drop per riordinare

## 📱 Tech Stack

### Frontend
- **React Native** 0.81.5
- **Expo SDK** 54
- **Expo Router** 6.0 (file-based navigation)
- **TypeScript** 5.9
- **Expo Secure Store** (JWT storage)
- **AsyncStorage** (preferences)
- **React Native Gesture Handler**
- **React Native Reanimated** 4.2
- **Axios** (HTTP client)
- **Expo Linear Gradient**
- **Expo Blur**
- **Firebase** 12.6 (push notifications)

### Backend
- **Django** 5.1.4 (esistente)
- **Django REST Framework** 3.16
- **PostgreSQL** (consigliato per production)
- **JWT Authentication** (djangorestframework_simplejwt)
- **Firebase Admin** (push notifications)

## 🏗️ Struttura Progetto

```
ToDoList_App/
├── app/                          # Expo Router screens
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx          # Tabs layout
│   │   ├── index.tsx            # Home (Lists)
│   │   ├── friends.tsx          # Friends screen
│   │   ├── notifications.tsx    # Notifications
│   │   └── profile.tsx          # User profile
│   ├── auth/                    # Auth screens
│   │   ├── login.tsx            # Login screen
│   │   └── register.tsx         # Register screen
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Splash/redirect screen
├── src/
│   ├── api/                     # API services
│   │   ├── client.ts            # Axios client with interceptors
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── todos.ts             # Todo/List endpoints
│   │   ├── friends.ts           # Friends endpoints
│   │   └── notifications.ts     # Notifications endpoints
│   ├── components/              # Reusable components
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx     # Auth state management
│   │   └── ThemeContext.tsx    # Theme management
│   ├── types/                   # TypeScript types
│   │   └── index.ts             # All type definitions
│   ├── constants/               # Constants and config
│   │   └── config.ts            # API URL, colors, keys
│   └── utils/                   # Utility functions
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript config
```

## 🛠️ Setup e Installazione

### Prerequisiti
- Node.js 18+ e npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) o Android Studio
- Account Expo (opzionale, per build)

### Installazione

1. **Clone il repository**
   ```bash
   git clone https://github.com/bale231/ToDoList_App.git
   cd ToDoList_App
   ```

2. **Installa le dipendenze**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configura le variabili d'ambiente** (opzionale)

   Modifica `src/constants/config.ts` se necessario:
   - API_URL: URL del backend Django
   - FIREBASE_CONFIG: Credenziali Firebase

4. **Avvia Expo**
   ```bash
   npm start
   ```

5. **Esegui su dispositivo/emulatore**
   - iOS: Premi `i` (richiede macOS + Xcode)
   - Android: Premi `a` (richiede Android Studio)
   - Expo Go: Scannerizza QR code con app Expo Go

## 🔐 Autenticazione

L'app utilizza JWT (JSON Web Tokens) per l'autenticazione:

1. **Login/Register** → Server restituisce `access` e `refresh` token
2. **Tokens salvati** in Expo Secure Store (encrypted storage)
3. **Auto-refresh**: Axios interceptor rinnova access token automaticamente
4. **Logout**: Tokens cancellati + chiamata API logout

### API Endpoints Backend

```
POST /api/login/                  # Login
POST /api/register/               # Registrazione
POST /api/token/refresh/          # Refresh token
GET  /api/jwt-user/               # Get user info
POST /api/logout/                 # Logout
```

## 🎨 Temi e Design

### Dark Mode
- Supporto automatico per dark/light mode
- Segue preferenze sistema
- Toggle manuale disponibile
- Persistenza con AsyncStorage
- Sincronizzazione con backend

### Colori
- **Lists**: 5 colori (blue, green, yellow, red, purple)
- **Glassmorphism**: Blur effects con Expo Blur
- **Gradients**: LinearGradient per backgrounds
- **Theme-aware**: Tutti i componenti supportano dark mode

## 🔄 Backend Setup (Opzionale)

Se vuoi eseguire il backend localmente:

### 1. Clone Backend
```bash
git clone https://github.com/bale231/todowebappbackend-django.git
cd todowebappbackend-django
```

### 2. Setup Python Environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### 3. Migrazione a PostgreSQL (Consigliato)

**Installa PostgreSQL:**
```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql postgresql-contrib
```

**Crea database:**
```bash
psql postgres
CREATE DATABASE todolist_db;
CREATE USER todolist_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE todolist_db TO todolist_user;
\q
```

**Aggiorna `settings.py`:**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'todolist_db',
        'USER': 'todolist_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 4. Migrations e Run
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

### 5. Aggiorna CORS per Mobile
In `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",      # Expo
    "http://localhost:19006",     # Expo web
    "exp://192.168.1.x:8081",     # Expo mobile (usa tuo IP)
]
```

## 🐳 Docker Setup (Opzionale)

### Crea `docker-compose.yml` nel backend:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: todolist_db
      POSTGRES_USER: todolist_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  web:
    build: .
    command: gunicorn todoproject.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
      - media:/app/media
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://todolist_user:your_password@db:5432/todolist_db

volumes:
  postgres_data:
  media:
```

### Run con Docker:
```bash
docker-compose up --build
```

## 📦 Build per Production

### iOS (richiede macOS)
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

### Web
```bash
npx expo export --platform web
```

## 🧪 Testing

```bash
# Run tests (quando implementati)
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## 📝 TODO

- [ ] Implementare dettaglio lista con todos
- [ ] Swipe gestures per delete/edit todos
- [ ] Drag & drop per riordinare
- [ ] Sistema amici completo
- [ ] Condivisione liste
- [ ] Push notifications Firebase
- [ ] Upload immagine profilo
- [ ] Search/filter liste
- [ ] Offline support con caching
- [ ] Unit tests
- [ ] E2E tests (Detox)

## 🔗 Links

- **Frontend Web**: https://github.com/bale231/todowebapp-frontend-reactts
- **Backend Django**: https://github.com/bale231/todowebappbackend-django
- **Backend Live**: https://bale231.pythonanywhere.com/api

## 📄 License

MIT

## 👤 Author

**bale231**

- GitHub: [@bale231](https://github.com/bale231)

---

**Note**: Questa è una versione mobile dell'app web ToDoList. Mantiene le stesse funzionalità e design ma ottimizzata per dispositivi mobili con gesture support e notifiche push native.
