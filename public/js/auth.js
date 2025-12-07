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

function getFriendlyErrorMessage(error) {
    // Map Firebase error codes to friendly messages
    const errorCode = error.code || '';
    if (errorCode === 'auth/email-already-in-use') {
        return "This email is already in use. Please log in.";
    } else if (errorCode === 'auth/invalid-email') {
        return "Please enter a valid email address.";
    } else if (errorCode === 'auth/weak-password') {
        return "Password should be at least 6 characters.";
    } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        return "Invalid email or password.";
    } else if (errorCode === 'auth/network-request-failed') {
        return "Network error. Please check your internet connection.";
    }

    // Fallback to error message or a generic one
    return error.message || "An unexpected error occurred.";
}

function setLoading(button, isLoading) {
    if(isLoading) {
        button.dataset.originalText = button.innerText;
        button.innerText = "Processing...";
        button.disabled = true;
        button.style.opacity = "0.7";
    } else {
        button.innerText = button.dataset.originalText || "Submit";
        button.disabled = false;
        button.style.opacity = "1";
    }
}

// Login Logic
if(loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = loginEmail.value.trim();
        const password = loginPass.value;

        if(!email || !password) {
             loginError.innerText = "Please fill in all fields.";
             loginError.style.display = 'block';
             return;
        }

        setLoading(loginBtn, true);
        loginError.style.display = 'none';

        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            // Check if blocked
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if(userDoc.exists() && userDoc.data().isBlocked) {
                 await signOut(auth);
                 throw new Error("Your account has been blocked by the admin.");
            }

            // Real-time: Redirect immediately
            window.location.href = 'index.html';
        } catch (error) {
            console.error(error);
            loginError.innerText = getFriendlyErrorMessage(error);
            loginError.style.display = 'block';
            setLoading(loginBtn, false);
        }
    });
}

// Signup Logic
if(signupBtn) {
    signupBtn.addEventListener('click', async () => {
        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPass.value;

        if(!name || !email || !password) {
            signupError.innerText = "All fields are required";
            signupError.style.display = 'block';
            return;
        }

        setLoading(signupBtn, true);
        signupError.style.display = 'none';

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

            // Real-time: Redirect immediately
            window.location.href = 'index.html';
        } catch (error) {
            console.error(error);
            signupError.innerText = getFriendlyErrorMessage(error);
            signupError.style.display = 'block';
            setLoading(signupBtn, false);
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
