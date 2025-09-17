"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.auth = exports.app = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyC5nJn2AIizZQZcxrQhJzFrWa_-WQN2IfY",
    authDomain: "f1voting.firebaseapp.com",
    projectId: "f1voting",
    storageBucket: "f1voting.firebasestorage.app",
    messagingSenderId: "350871409769",
    appId: "1:350871409769:web:bfec386c58a38c86b63ef8"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.app = app;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
