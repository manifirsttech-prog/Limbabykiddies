import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbOXPNgjzC3jEqWuEBzQTrTwxX9w4Czew",
  authDomain: "limbabykiddies.firebaseapp.com",
  databaseURL: "https://limbabykiddies-default-rtdb.firebaseio.com",
  projectId: "limbabykiddies",
  storageBucket: "limbabykiddies.firebasestorage.app",
  messagingSenderId: "939154494485",
  appId: "1:939154494485:web:ecaa659342fb8092b9ea1c",
  measurementId: "G-YQ4G93XD14"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
