"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.auth = exports.app = void 0;
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
var firebaseConfig = {
    apiKey: "AIzaSyC5nJn2AIizZQZcxrQhJzFrWa_-WQN2IfY",
    authDomain: "f1voting.firebaseapp.com",
    projectId: "f1voting",
    storageBucket: "f1voting.firebasestorage.app",
    messagingSenderId: "350871409769",
    appId: "1:350871409769:web:bfec386c58a38c86b63ef8"
};
var app = (0, app_1.initializeApp)(firebaseConfig);
exports.app = app;
var auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
var db = (0, firestore_1.getFirestore)(app);
exports.db = db;
