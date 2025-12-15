# 🔧 Troubleshooting Guide

Guida per risolvere problemi comuni durante lo sviluppo dell'app ToDoList.

## 📱 Errori Metro Bundler

### ❌ "Cannot find module 'react-native-worklets/plugin'"

**Problema**: Manca la dipendenza `react-native-worklets-core` richiesta da `react-native-reanimated`.

**Soluzione**:
```bash
# 1. Installa il pacchetto mancante
npm install react-native-worklets-core --legacy-peer-deps

# 2. Pulisci la cache e riavvia
npm run start:clear

# In alternativa, pulisci completamente:
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --clear
```

### ❌ "Unable to resolve module"

**Soluzione**:
```bash
# Pulisci cache Watchman (macOS/Linux)
watchman watch-del-all

# Pulisci cache Metro
npx expo start --clear

# Reset completo
npm run reset
npx expo start --clear
```

### ❌ "SyntaxError: Cannot use import statement outside a module"

**Problema**: Configurazione Babel non corretta.

**Verifica `babel.config.js`**:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

## 🔐 Errori Autenticazione

### ❌ "Network Error" o "Failed to fetch"

**Possibili cause**:
1. Backend non in esecuzione
2. URL API errato
3. CORS non configurato

**Soluzioni**:

**1. Verifica backend attivo**:
```bash
curl https://bale231.pythonanywhere.com/api/
# Dovrebbe restituire una risposta JSON
```

**2. Verifica URL in `src/constants/config.ts`**:
```typescript
export const API_URL = 'https://bale231.pythonanywhere.com/api';
```

**3. Per backend locale, aggiorna URL con tuo IP**:
```typescript
// Trova tuo IP:
# Windows: ipconfig
# macOS/Linux: ifconfig | grep inet

export const API_URL = 'http://192.168.1.x:8000/api';
```

**4. Verifica CORS nel backend Django**:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "exp://192.168.1.x:8081",  # Sostituisci con tuo IP
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^exp://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:8081$",
]
```

### ❌ "401 Unauthorized"

**Problema**: Token JWT scaduto o invalido.

**Soluzione**:
```bash
# 1. Fai logout dall'app
# 2. Elimina dati app (iOS: Impostazioni > App > ToDoList > Elimina App)
# 3. Reinstalla e fai login
```

**Debug**:
```typescript
// In src/api/client.ts, aggiungi log:
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    console.log('Token:', token ? 'presente' : 'assente');
    // ...
  }
);
```

## 📦 Errori Installazione

### ❌ "ERESOLVE unable to resolve dependency tree"

**Soluzione**: Usa sempre `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

### ❌ "Module not found: Can't resolve '@react-native-async-storage/async-storage'"

**Soluzione**:
```bash
npm install @react-native-async-storage/async-storage --legacy-peer-deps
npx expo start --clear
```

### ❌ Errori dopo aggiornamento dipendenze

**Reset completo**:
```bash
# 1. Elimina node_modules e lock file
rm -rf node_modules package-lock.json

# 2. Reinstalla
npm install --legacy-peer-deps

# 3. Pulisci cache
npx expo start --clear
```

## 🍎 Errori iOS

### ❌ "No bundle URL present"

**Soluzioni**:
```bash
# 1. Riavvia Metro bundler
# Premi Ctrl+C e poi:
npm start

# 2. Se non funziona, pulisci tutto:
rm -rf ios/.expo
npx expo start --clear

# 3. Riavvia iOS Simulator
```

### ❌ "Command PhaseScriptExecution failed"

**Soluzione**:
```bash
# Reinstalla pods (se usi bare workflow)
cd ios
pod deintegrate
pod install
cd ..
npx expo run:ios
```

### ❌ Simulator non si avvia

**Verifica Xcode installato**:
```bash
xcode-select --install
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

## 🤖 Errori Android

### ❌ "SDK location not found"

**Soluzione**: Crea `android/local.properties`:
```properties
sdk.dir=/Users/USERNAME/Library/Android/sdk  # macOS
sdk.dir=C:\\Users\\USERNAME\\AppData\\Local\\Android\\Sdk  # Windows
sdk.dir=/home/USERNAME/Android/Sdk  # Linux
```

### ❌ "Gradle build failed"

**Soluzioni**:
```bash
# 1. Pulisci build Android
cd android
./gradlew clean
cd ..

# 2. Pulisci cache Gradle
rm -rf ~/.gradle/caches/

# 3. Riavvia con cache pulita
npx expo start --clear
```

### ❌ "Unable to load script from assets 'index.android.bundle'"

**Soluzione**:
```bash
# 1. Assicurati Metro bundler sia in esecuzione
npm start

# 2. In un altro terminale:
npx expo start --android
```

## 🔥 Errori Firebase

### ❌ "Firebase app named '[DEFAULT]' already exists"

**Soluzione in `src/config/firebase.ts`**:
```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseApp = getApps().length === 0
  ? initializeApp(FIREBASE_CONFIG)
  : getApp();
```

### ❌ Push notifications non funzionano

**Checklist**:
1. ✅ Firebase configurato correttamente
2. ✅ FCM token salvato nel backend
3. ✅ Permessi notifiche accettati
4. ✅ App in foreground/background (non killed)

**Test notifiche**:
```bash
# Usa Firebase Console > Cloud Messaging
# Oppure curl al backend:
curl -X POST https://bale231.pythonanywhere.com/api/notifications/save-fcm-token/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fcm_token": "YOUR_FCM_TOKEN"}'
```

## 🎨 Errori UI/Styling

### ❌ "undefined is not an object (evaluating 'colors.text')"

**Problema**: Componente usato fuori da ThemeProvider.

**Soluzione**: Verifica `app/_layout.tsx`:
```typescript
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Componenti qui */}
      </AuthProvider>
    </ThemeProvider>
  );
}
```

### ❌ Dark mode non funziona

**Debug**:
```typescript
// In qualsiasi screen
const { theme, colors } = useTheme();
console.log('Current theme:', theme);
console.log('Colors:', colors);
```

## 🐛 Debug Tools

### Abilitare Developer Menu

**iOS Simulator**: Cmd + D
**Android Emulator**: Cmd + M (Mac) / Ctrl + M (Windows/Linux)
**Device**: Scuoti il dispositivo

### React Native Debugger

```bash
# Installa
brew install --cask react-native-debugger  # macOS

# Avvia
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Flipper (Advanced)

```bash
# Installa Flipper
brew install --cask flipper  # macOS

# Avvia e connetti alla tua app
```

### Log utili

```typescript
// In src/api/client.ts
apiClient.interceptors.request.use(
  async (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    console.log('Headers:', config.headers);
    return config;
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('Error:', error.response?.status, error.config?.url);
    console.log('Error data:', error.response?.data);
    return Promise.reject(error);
  }
);
```

## 🆘 Ultimo Resort

Se nulla funziona, reset completo:

```bash
# 1. Elimina tutto
rm -rf node_modules package-lock.json
rm -rf ios android  # Se esistono
rm -rf .expo

# 2. Reinstalla
npm install --legacy-peer-deps

# 3. Riavvia con cache pulita
npx expo start --clear

# 4. Se ancora problemi, reinstalla Expo CLI
npm install -g expo-cli@latest
```

## 📚 Risorse Utili

- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/docs/getting-started
- **Expo Discord**: https://chat.expo.dev/
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/expo
- **GitHub Issues**:
  - Expo Router: https://github.com/expo/router/issues
  - React Native: https://github.com/facebook/react-native/issues

## 📝 Report Bug

Se trovi un bug non documentato qui, apri una issue su GitHub con:

1. **Descrizione del problema**
2. **Steps to reproduce**
3. **Expected vs Actual behavior**
4. **Environment**:
   - OS: [es. macOS 14.0, Windows 11]
   - Node version: `node -v`
   - Expo version: `npx expo --version`
   - Device/Simulator: [es. iPhone 15 Pro Simulator]
5. **Logs completi**
6. **Screenshot/video** (se applicabile)

---

**Tip**: Salva questa guida nei preferiti! 🔖
