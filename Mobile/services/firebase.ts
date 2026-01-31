import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
    getAuth,
    initializeAuth,
    Auth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// @ts-ignore: getReactNativePersistence is missing from the standard typings but present in the RN bundle
import { getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDS8UnxA7eAbHMUX1P8y9GDtOAOsfJq8qc",
    authDomain: "trading-app-23c3f.firebaseapp.com",
    projectId: "trading-app-23c3f",
    storageBucket: "trading-app-23c3f.firebasestorage.app",
    messagingSenderId: "8492770599",
    appId: "1:8492770599:web:ccd184b81dd26663457502"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;

try {
    auth = initializeAuth(app, {
        persistence: (getReactNativePersistence as any)(AsyncStorage)
    });
} catch (e) {
    // If already initialized, get the existing instance
    auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export default app;
