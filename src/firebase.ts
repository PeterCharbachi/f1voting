import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const isNode = typeof process !== 'undefined' && process.env;

const firebaseConfig = {
  apiKey: isNode ? process.env.VITE_FIREBASE_API_KEY : import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: isNode ? process.env.VITE_FIREBASE_AUTH_DOMAIN : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: isNode ? process.env.VITE_FIREBASE_PROJECT_ID : import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: isNode ? process.env.VITE_FIREBASE_STORAGE_BUCKET : import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: isNode ? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID : import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: isNode ? process.env.VITE_FIREBASE_APP_ID : import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, firebaseConfig };