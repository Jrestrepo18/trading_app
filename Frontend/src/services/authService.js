// Authentication Service
// Complete Firebase Auth integration with all required features
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    confirmPasswordReset,
    applyActionCode,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

// ===========================================
// PASSWORD VALIDATION
// ===========================================

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character (@#$%^&*!_-)
 */
export const validatePassword = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[@#$%^&*!_\-]/.test(password),
    };

    const allPassed = Object.values(requirements).every(v => v);
    const passedCount = Object.values(requirements).filter(v => v).length;

    return {
        isValid: allPassed,
        requirements,
        strength: passedCount, // 0-5
        strengthLabel: passedCount <= 2 ? 'Débil' : passedCount <= 4 ? 'Moderada' : 'Fuerte'
    };
};

/**
 * Validates that user is at least 18 years old
 */
export const validateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return {
        isValid: age >= 18,
        age
    };
};

// ===========================================
// REGISTRATION
// ===========================================

/**
 * Register a new user with email and password
 * Creates user in Firebase Auth and stores additional data in Firestore
 * Sends verification email
 */
export const registerWithEmail = async (name, email, password, birthDate) => {
    try {
        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            throw new Error('La contraseña no cumple con los requisitos de seguridad');
        }

        // Validate age
        const ageValidation = validateAge(birthDate);
        if (!ageValidation.isValid) {
            throw new Error('Debes ser mayor de 18 años para registrarte');
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name
        await updateProfile(user, { displayName: name });

        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: email,
            name: name,
            birthDate: birthDate,
            isVerified: false,
            createdAt: serverTimestamp(),
            authProvider: 'email',
            role: 'user',
            subscription: {
                plan: 'free',
                expiresAt: null
            }
        });

        // Send verification email
        await sendEmailVerification(user, {
            url: `${window.location.origin}/verify-email`,
            handleCodeInApp: true
        });

        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                name: name,
                emailVerified: user.emailVerified
            },
            message: 'Registro exitoso. Por favor verifica tu correo electrónico.'
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

// ===========================================
// LOGIN
// ===========================================

/**
 * Login with email and password
 */
export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        // Check if email is verified
        if (!user.emailVerified) {
            return {
                success: false,
                error: 'Por favor verifica tu correo electrónico antes de iniciar sesión.',
                needsVerification: true,
                user: { email: user.email }
            };
        }

        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                name: user.displayName || userData?.name,
                emailVerified: user.emailVerified,
                ...userData
            },
            token: await user.getIdToken()
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

/**
 * Login or Register with Google
 * If user exists -> login
 * If user doesn't exist -> create new account
 */
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user already exists in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            // New user - create Firestore document
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                birthDate: null, // Google doesn't provide this
                isVerified: true, // Google accounts are pre-verified
                createdAt: serverTimestamp(),
                authProvider: 'google',
                photoURL: user.photoURL,
                role: 'user',
                subscription: {
                    plan: 'free',
                    expiresAt: null
                }
            });
        }

        const userData = userDoc.exists() ? userDoc.data() : null;

        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                emailVerified: true,
                photoURL: user.photoURL,
                ...userData
            },
            token: await user.getIdToken(),
            isNewUser: !userDoc.exists()
        };
    } catch (error) {
        console.error('Google login error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

// ===========================================
// PASSWORD RESET
// ===========================================

/**
 * Send password reset email
 */
export const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email, {
            url: `${window.location.origin}/login`,
            handleCodeInApp: false
        });
        return {
            success: true,
            message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.'
        };
    } catch (error) {
        console.error('Password reset error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

/**
 * Confirm password reset with code from email
 */
export const confirmPasswordResetWithCode = async (oobCode, newPassword) => {
    try {
        // Validate new password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            throw new Error('La contraseña no cumple con los requisitos de seguridad');
        }

        await confirmPasswordReset(auth, oobCode, newPassword);
        return {
            success: true,
            message: 'Contraseña restablecida exitosamente.'
        };
    } catch (error) {
        console.error('Confirm password reset error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

// ===========================================
// EMAIL VERIFICATION
// ===========================================

/**
 * Apply email verification code (when user clicks link)
 */
export const verifyEmail = async (oobCode) => {
    try {
        await applyActionCode(auth, oobCode);

        // Update Firestore
        const user = auth.currentUser;
        if (user) {
            await setDoc(doc(db, 'users', user.uid), {
                isVerified: true
            }, { merge: true });
        }

        return {
            success: true,
            message: '¡Email verificado exitosamente!'
        };
    } catch (error) {
        console.error('Email verification error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No hay usuario autenticado');
        }

        await sendEmailVerification(user, {
            url: `${window.location.origin}/verify-email`,
            handleCodeInApp: true
        });

        return {
            success: true,
            message: 'Email de verificación reenviado.'
        };
    } catch (error) {
        console.error('Resend verification error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

// ===========================================
// LOGOUT
// ===========================================

/**
 * Sign out user
 */
export const logout = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Subscribe to auth state changes and real-time user profile updates
 */
export const onAuthStateChange = (callback) => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        // Clean up previous snapshot listener
        if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
            unsubscribeSnapshot = null;
        }

        if (user) {
            // Listen to Firestore document changes in real-time
            const userDocRef = doc(db, 'users', user.uid);
            unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                const userData = docSnap.exists() ? docSnap.data() : null;

                callback({
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || userData?.name,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    ...userData,
                    // Ensure role defaults to 'user' if not present
                    role: userData?.role || 'user'
                });
            }, (error) => {
                console.error('Error listening to user changes:', error);
                callback({
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    role: 'user'
                });
            });
        } else {
            callback(null);
        }
    });

    // Combined cleanup
    return () => {
        unsubscribeAuth();
        if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
    return auth.currentUser;
};

// ===========================================
// ERROR HANDLING
// ===========================================

const getErrorMessage = (errorCode) => {
    const errorMessages = {
        'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
        'auth/invalid-email': 'El correo electrónico no es válido.',
        'auth/operation-not-allowed': 'Operación no permitida.',
        'auth/weak-password': 'La contraseña es demasiado débil.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
        'auth/user-not-found': 'No existe una cuenta con este correo.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-credential': 'Credenciales inválidas.',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
        'auth/popup-closed-by-user': 'Inicio de sesión cancelado.',
        'auth/invalid-action-code': 'El enlace ha expirado o ya fue utilizado.',
        'auth/expired-action-code': 'El enlace ha expirado.',
    };

    return errorMessages[errorCode] || 'Ha ocurrido un error. Intenta de nuevo.';
};

export default {
    validatePassword,
    validateAge,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    confirmPasswordResetWithCode,
    verifyEmail,
    resendVerificationEmail,
    logout,
    onAuthStateChange,
    getCurrentUser
};
