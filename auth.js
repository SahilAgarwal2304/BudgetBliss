// auth.js
// ==========================================
// Firebase Initialization & Imports
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBC86Kau3-C6zDCeluon0h-4pJ1hE9hHPg",
    authDomain: "budgetbliss-52cc5.firebaseapp.com",
    projectId: "budgetbliss-52cc5",
    storageBucket: "budgetbliss-52cc5.firebasestorage.app",
    messagingSenderId: "453839844426",
    appId: "1:453839844426:web:d3c56c638a6289b595e2b3",
    measurementId: "G-RVZVK4S99D"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ==========================================
// Routing & Page State
// ==========================================
const currentPage = window.location.pathname.split('/').pop();
const isLoginPage = currentPage === 'index.html' || currentPage === '';

// ==========================================
// Login / Logout Handlers
// ==========================================
const loginBtn = document.getElementById('google-login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login Failed:", error.message);
            alert("Could not log in. Please try again.");
        }
    });
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Failed:", error.message);
        }
    });
}

// ==========================================
// Security Guard & State Management
// ==========================================
const userAvatar = document.getElementById('user-avatar');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        window.currentUserId = user.uid; 
        
        if (userAvatar) {
            userAvatar.src = user.photoURL;
        }

        if (isLoginPage) {
            // Redirect away from login page if already logged in
            window.location.href = 'dashboard.html';
        } else if (typeof window.initAppAfterAuth === 'function') {
            // Trigger Firestore data load ONLY AFTER identity is confirmed
            window.initAppAfterAuth(); 
        }
    } else {
        // User is logged out
        window.currentUserId = null;
        
        if (!isLoginPage) {
            // Kick them back to the login page
            window.location.href = 'index.html';
        }
    }
});