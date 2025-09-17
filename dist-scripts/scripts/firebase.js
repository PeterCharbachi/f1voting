import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyC5nJn2AIizZQZcxrQhJzFrWa_-WQN2IfY",
    authDomain: "f1voting.firebaseapp.com",
    projectId: "f1voting",
    storageBucket: "f1voting.firebasestorage.app",
    messagingSenderId: "350871409769",
    appId: "1:350871409769:web:bfec386c58a38c86b63ef8"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db, firebaseConfig };
