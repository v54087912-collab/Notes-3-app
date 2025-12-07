import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc, onAuthStateChanged, signOut, getDoc } from './firebase-config.js';

// DOM Elements
const loginBtn = document.getElementById('btn-login');
const signupBtn = document.getElementById('btn-signup');
const loginEmail = document.getElementById('login-email');
const loginPass = document.getElementById('login-password');
const signupName = document.getElementById('signup-name');
const signupEmail = document.getElementById('signup-email');
const signupPass = document.getElementById('signup-password');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

// Login Logic
if(loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = loginEmail.value;
        const password = loginPass.value;

        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            // Check if blocked
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if(userDoc.exists() && userDoc.data().isBlocked) {
                 await signOut(auth);
                 throw new Error("Your account has been blocked by the admin.");
            }

            window.location.href = 'index.html';
        } catch (error) {
            loginError.innerText = error.message;
            loginError.style.display = 'block';
        }
    });
}

// Signup Logic
if(signupBtn) {
    signupBtn.addEventListener('click', async () => {
        const name = signupName.value;
        const email = signupEmail.value;
        const password = signupPass.value;

        if(!name || !email || !password) {
            signupError.innerText = "All fields are required";
            signupError.style.display = 'block';
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user profile to Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                role: "user", // default role
                createdAt: new Date(),
                isBlocked: false
            });

            window.location.href = 'index.html';
        } catch (error) {
            signupError.innerText = error.message;
            signupError.style.display = 'block';
        }
    });
}

// Global Auth State Handler (can be imported in other files)
export function checkAuth(callback) {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}

export function logoutUser() {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    });
}
