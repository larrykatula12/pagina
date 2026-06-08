// Configuración de Firebase REST API
// Las variables de entorno están en .env.local

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Función para guardar respuestas en Firebase Realtime Database
export const guardarRespuestasEnFirebase = async (respuestas) => {
  if (!firebaseConfig.databaseURL) {
    throw new Error('Firebase no está configurado. Verifica tus variables de entorno.');
  }

  const timestamp = new Date().toISOString();
  const nuevoRegistro = {
    id: Date.now(),
    fecha: timestamp,
    respuestas: respuestas,
  };

  // Usar REST API de Firebase
  const url = `${firebaseConfig.databaseURL}/respuestas.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevoRegistro),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al guardar en Firebase: ${errorData}`);
  }

  const data = await response.json();
  console.log('Respuesta guardada con ID:', data.name);
  return data;
};
