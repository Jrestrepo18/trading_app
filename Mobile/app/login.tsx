import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { auth, db } from '../services/firebase';
import useAuthStore from '../stores/authStore';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

WebBrowser.maybeCompleteAuthSession();

console.log("Debug - Redirect URI:", AuthSession.makeRedirectUri());

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();

    // Google Auth Request
    // NOTE: These IDs need to be obtained from the Google Cloud Console / Firebase Console
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: "8492770599-pd69iphjuedbiadimdkgb162kv4v5nvq.apps.googleusercontent.com",
        iosClientId: "8492770599-pd69iphjuedbiadimdkgb162kv4v5nvq.apps.googleusercontent.com",
        androidClientId: "8492770599-pd69iphjuedbiadimdkgb162kv4v5nvq.apps.googleusercontent.com",
        redirectUri: "https://auth.expo.io/@jerocba/valor-trading",
    });

    useEffect(() => {
        if (response) {
            console.log("Debug - Google Response:", response);
        }
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleSignIn(id_token);
        }
    }, [response]);

    const handleGoogleSignIn = async (idToken: string) => {
        setIsLoading(true);
        try {
            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;
            const token = await user.getIdToken();

            // Check if user exists in Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // New user from Google
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    birthDate: null,
                    isVerified: true,
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

            login({
                uid: user.uid,
                email: user.email,
                name: user.displayName || userData?.name || 'Usuario',
                emailVerified: true,
                photoURL: user.photoURL,
                role: userData?.role || 'user',
            }, token);

            router.replace('/dashboard');
        } catch (error: any) {
            console.error('Google login error:', error);
            Alert.alert('Error', 'No se pudo iniciar sesión con Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor ingresa tu email y contraseña');
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            login({
                uid: user.uid,
                email: user.email,
                name: user.displayName || userData?.name || 'Usuario',
                emailVerified: user.emailVerified,
                photoURL: user.photoURL,
                role: userData?.role || 'user',
            }, token);

            router.replace('/dashboard');
        } catch (error: any) {
            let message = 'Error al iniciar sesión';
            if (error.code === 'auth/user-not-found') {
                message = 'No existe una cuenta con este email';
            } else if (error.code === 'auth/wrong-password') {
                message = 'Contraseña incorrecta';
            } else if (error.code === 'auth/invalid-credential') {
                message = 'Credenciales inválidas';
            }
            Alert.alert('Error', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoBox}>
                        <Ionicons name="pulse" size={32} color={colors.white} />
                    </View>
                    <Text style={styles.logoText}>
                        Valor<Text style={styles.logoAccent}>Trading</Text>
                    </Text>
                    <Text style={styles.subtitle}>Terminal de Trading</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Iniciar Sesión</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="tu@email.com"
                                placeholderTextColor={colors.text.muted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={colors.text.muted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.text.secondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <>
                                <Text style={styles.loginButtonText}>Acceder</Text>
                                <Ionicons name="arrow-forward" size={20} color={colors.white} />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>O inicia con</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Google Button */}
                    <TouchableOpacity
                        style={[styles.googleButton, !request && styles.googleButtonDisabled]}
                        onPress={() => promptAsync()}
                        disabled={!request || isLoading}
                    >
                        <Ionicons name="logo-google" size={20} color={colors.white} />
                        <Text style={styles.googleButtonText}>Google</Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
                        <Link href="/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.registerLink}> Regístrate</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
    logoContainer: { alignItems: 'center', marginBottom: spacing.xl },
    logoBox: {
        width: 64, height: 64, backgroundColor: colors.brand.primary, borderRadius: borderRadius.lg,
        justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md,
    },
    logoText: { fontSize: fontSize.xxl, fontWeight: 'bold', color: colors.white },
    logoAccent: { color: colors.brand.primary },
    subtitle: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: spacing.xs },
    formContainer: {
        backgroundColor: colors.background.secondary, borderRadius: borderRadius.xl, padding: spacing.lg,
        borderWidth: 1, borderColor: colors.border,
    },
    title: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.white, textAlign: 'center', marginBottom: spacing.lg },
    inputContainer: { marginBottom: spacing.md },
    label: { fontSize: fontSize.xs, fontWeight: 'bold', color: colors.text.secondary, marginBottom: spacing.sm },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: borderRadius.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    inputIcon: { marginLeft: spacing.md },
    input: { flex: 1, padding: spacing.md, color: colors.white, fontSize: fontSize.md },
    eyeButton: { padding: spacing.md },
    loginButton: {
        backgroundColor: colors.brand.primary, borderRadius: borderRadius.md, padding: spacing.md,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg,
    },
    loginButtonDisabled: { opacity: 0.7 },
    loginButtonText: { color: colors.white, fontSize: fontSize.md, fontWeight: 'bold' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
    dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
    dividerText: { fontSize: fontSize.xs, color: colors.text.muted, marginHorizontal: spacing.md },
    googleButton: {
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: borderRadius.md, padding: spacing.md,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    googleButtonDisabled: { opacity: 0.5 },
    googleButtonText: { color: colors.text.secondary, fontSize: fontSize.sm, fontWeight: 'bold' },
    registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
    registerText: { color: colors.text.secondary, fontSize: fontSize.sm },
    registerLink: { color: colors.brand.primary, fontSize: fontSize.sm, fontWeight: 'bold' },
});
