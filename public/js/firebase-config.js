
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase, ref, set, get, child, push, update, remove, onValue, query, orderByChild, equalTo, limitToFirst, limitToLast, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signInAnonymously, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// New Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyAOR4rFCpb8P3ZTFBbo6RWlCVl4CEOuNL8",
  authDomain: "g-temp-bot.firebaseapp.com",
  databaseURL: "https://g-temp-bot-default-rtdb.firebaseio.com",
  projectId: "g-temp-bot",
  storageBucket: "g-temp-bot.firebasestorage.app",
  messagingSenderId: "15952638163",
  appId: "1:15952638163:web:098ed71ae684a5c50d6426",
  measurementId: "G-HGZ8ZKB263"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);

export {
    app,
    analytics,
    db,
    auth,
    signInWithEmailAndPassword,
    signInAnonymously,
    signOut,
    ref,
    set,
    get,
    child,
    push,
    update,
    remove,
    onValue,
    query,
    orderByChild,
    equalTo,
    limitToFirst,
    limitToLast,
    runTransaction
};
