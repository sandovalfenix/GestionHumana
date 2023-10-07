import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Aquí debe agregar la configuración de su proyecto Firebase con variables de entorno
  apiKey: import.meta.env.VITE_FIREBASE_apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_authDomain,
  projectId: import.meta.env.VITE_FIREBASE_projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_appId,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
