
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, query, where, orderBy, limit, increment } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgo66656h9DeZT9ADiXk_m6Cq4X_ABrUI",
  authDomain: "music-app-fcfea.firebaseapp.com",
  projectId: "music-app-fcfea",
  storageBucket: "music-app-fcfea.firebasestorage.app",
  messagingSenderId: "1000221613506",
  appId: "1:1000221613506:web:33051454914b9c8bd38a5b",
  measurementId: "G-4JWSDQZ9S2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, query, where, orderBy, limit, increment };
