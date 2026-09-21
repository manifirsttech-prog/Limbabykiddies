import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCbOXPNgjzC3jEqWuEBzQTrTwxX9w4Czew",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "limbabykiddies.firebaseapp.com",
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID || "limbabykiddies"}-default-rtdb.firebaseio.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "limbabykiddies",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "limbabykiddies.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "939154494485",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:939154494485:web:ecaa659342fb8092b9ea1c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YQ4G93XD14"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
