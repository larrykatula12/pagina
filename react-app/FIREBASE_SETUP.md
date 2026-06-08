# Configuración de Firebase para guardar respuestas

## 📋 Pasos para configurar Firebase

### 1. Crear un proyecto en Firebase
1. Ve a https://console.firebase.google.com
2. Haz clic en "Crear proyecto"
3. Dale un nombre a tu proyecto (ej: "cuestionario")
4. Sigue los pasos hasta crear el proyecto

### 2. Habilitar Realtime Database
1. En la consola de Firebase, ve a **Realtime Database** (en el menú lateral)
2. Haz clic en "Crear base de datos"
3. Elige la ubicación más cercana
4. En las reglas de seguridad, elige: **Comenzar en modo de prueba** (para desarrollo)
   ```json
   {
     "rules": {
       "respuestas": {
         ".write": true,
         ".read": true
       }
     }
   }
   ```
5. Copia la URL de la base de datos (algo como: `https://tu-proyecto.firebaseio.com`)

### 3. Obtener las credenciales
1. Ve a **Configuración del proyecto** (engranaje en la esquina superior derecha)
2. Desplázate hasta "Tus apps" y haz clic en el ícono `</>` (Web)
3. Registra tu app con el nombre que desees
4. Se te mostrará el código de configuración con todas las claves

### 4. Actualizar `.env.local`
Edita el archivo `.env.local` en la raíz del proyecto y reemplaza los valores con los de tu proyecto Firebase:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyD...
REACT_APP_FIREBASE_AUTH_DOMAIN=mi-proyecto.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://mi-proyecto.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=mi-proyecto
REACT_APP_FIREBASE_STORAGE_BUCKET=mi-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 5. Ejecutar el proyecto localmente
```bash
npm start
```

### 6. Compilar y desplegar en Netlify
```bash
npm run build
```

Luego arrastra la carpeta `build` a Netlify Drop, o configura variables de entorno en Netlify:
- Ve a tu sitio en Netlify
- **Site settings** → **Build & deploy** → **Environment**
- Agrega todas las variables de `.env.local`

## ✅ Las respuestas se guardarán automáticamente en Firebase

Cuando un usuario complete el cuestionario, las respuestas se enviarán a tu Realtime Database de Firebase.

Para ver las respuestas guardadas:
1. Ve a tu proyecto en Firebase Console
2. Abre **Realtime Database**
3. Mira los datos bajo `respuestas`
