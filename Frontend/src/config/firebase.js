// Firebase Configuration
// Trading App - Firebase SDK Setup
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserSessionPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from project console
const firebaseConfig = {
    apiKey: "AIzaSyDS8UnxA7eAbHMUX1P8y9GDtOAOsfJq8qc",
    authDomain: "trading-app-23c3f.firebaseapp.com",
    projectId: "trading-app-23c3f",
    storageBucket: "trading-app-23c3f.firebasestorage.app",
    messagingSenderId: "8492770599",
    appId: "1:8492770599:web:ccd184b81dd26663457502"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with SESSION persistence
// Session persistence = auth state is cleared when browser/tab is closed
export const auth = getAuth(app);

// Set session persistence (more secure - closes on browser close)
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log('🔐 Firebase Auth: Session persistence enabled (closes on browser close)');
    })
    .catch((error) => {
        console.error('Error setting auth persistence:', error);
    });

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export default app;
