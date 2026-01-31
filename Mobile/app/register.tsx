import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { auth, db } from '../services/firebase';
import useAuthStore from '../stores/authStore';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

WebBrowser.maybeCompleteAuthSession();

console.log("Debug - Redirect URI:", AuthSession.makeRedirectUri());

// Validate password strength
const validatePassword = (password: string) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const strength = Object.values(requirements).filter(Boolean).length;
    return { requirements, strength, isValid: strength >= 4 };
};

// Validate age (18+)
const validateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return { isValid: age >= 18, age };
};

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();

    const passwordValidation = validatePassword(password);
    const ageValidation = birthDate ? validateAge(birthDate) : { isValid: false, age: 0 };

    // Google Auth Request
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

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
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
            console.error('Google register error:', error);
            Alert.alert('Error', 'No se pudo registrar con Google');
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = () => {
        if (passwordValidation.strength <= 2) return colors.error;
        if (passwordValidation.strength <= 3) return colors.warning;
        return colors.success;
    };

    const handleRegister = async () => {
        // Validations
        if (!name || !email || !birthDate || !password || !confirmPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }
        if (!passwordValidation.isValid) {
            Alert.alert('Error', 'La contraseña no cumple con los requisitos de seguridad');
            return;
        }
        if (!ageValidation.isValid) {
            Alert.alert('Error', 'Debes ser mayor de 18 años para registrarte');
            return;
        }
        if (!acceptTerms) {
            Alert.alert('Error', 'Debes aceptar los términos y condiciones');
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            await setDoc(doc(db, 'users', user.uid), {
                name, email, birthDate, role: 'user', createdAt: serverTimestamp(),
            });

            Alert.alert(
                '¡Verifica tu Email!',
                `Hemos enviado un enlace de verificación a ${email}`,
                [{ text: 'OK', onPress: () => router.replace('/login') }]
            );
        } catch (error: any) {
            let message = 'Error al crear la cuenta';
            if (error.code === 'auth/email-already-in-use') message = 'Ya existe una cuenta con este email';
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
                        <Ionicons name="pulse" size={28} color={colors.white} />
                    </View>
                    <Text style={styles.logoText}>Valor<Text style={styles.logoAccent}>Trading</Text></Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Crear Cuenta</Text>
                    <Text style={styles.subtitle}>Inicia tu trayectoria con nosotros</Text>

                    {/* Name */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nombre Completo</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={18} color={colors.text.secondary} style={styles.inputIcon} />
                            <TextInput style={styles.input} placeholder="Tu nombre completo" placeholderTextColor={colors.text.muted} value={name} onChangeText={setName} />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={18} color={colors.text.secondary} style={styles.inputIcon} />
                            <TextInput style={styles.input} placeholder="tu@email.com" placeholderTextColor={colors.text.muted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                        </View>
                    </View>

                    {/* Birth Date */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Fecha de Nacimiento</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="calendar-outline" size={18} color={colors.text.secondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={colors.text.muted}
                                value={birthDate}
                                onChangeText={setBirthDate}
                            />
                        </View>
                        {birthDate && !ageValidation.isValid && (
                            <Text style={styles.errorText}>Debes ser mayor de 18 años</Text>
                        )}
                    </View>

                    {/* Password */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={18} color={colors.text.secondary} style={styles.inputIcon} />
                            <TextInput style={styles.input} placeholder="Mínimo 8 caracteres" placeholderTextColor={colors.text.muted} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.text.secondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Password Strength */}
                        {password.length > 0 && (
                            <View style={styles.strengthContainer}>
                                <View style={styles.strengthBar}>
                                    <View style={[styles.strengthFill, { width: `${(passwordValidation.strength / 5) * 100}%`, backgroundColor: getStrengthColor() }]} />
                                </View>
                                <View style={styles.requirementsGrid}>
                                    {[
                                        { key: 'minLength', label: '8+ caracteres', valid: passwordValidation.requirements.minLength },
                                        { key: 'hasUppercase', label: 'Mayúscula', valid: passwordValidation.requirements.hasUppercase },
                                        { key: 'hasLowercase', label: 'Minúscula', valid: passwordValidation.requirements.hasLowercase },
                                        { key: 'hasNumber', label: 'Número', valid: passwordValidation.requirements.hasNumber },
                                        { key: 'hasSpecial', label: 'Símbolo', valid: passwordValidation.requirements.hasSpecial },
                                    ].map(req => (
                                        <View key={req.key} style={styles.requirementItem}>
                                            <Ionicons name={req.valid ? 'checkmark-circle' : 'ellipse-outline'} size={12} color={req.valid ? colors.success : colors.text.muted} />
                                            <Text style={[styles.requirementText, { color: req.valid ? colors.success : colors.text.muted }]}>{req.label}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirmar Contraseña</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={18} color={colors.text.secondary} style={styles.inputIcon} />
                            <TextInput style={styles.input} placeholder="Repite tu contraseña" placeholderTextColor={colors.text.muted} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} />
                            {confirmPassword && password === confirmPassword && (
                                <Ionicons name="checkmark-circle" size={18} color={colors.success} style={styles.checkIcon} />
                            )}
                        </View>
                        {confirmPassword && password !== confirmPassword && (
                            <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
                        )}
                    </View>

                    {/* Terms */}
                    <View style={styles.termsContainer}>
                        <Switch
                            value={acceptTerms}
                            onValueChange={setAcceptTerms}
                            trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.brand.primary }}
                            thumbColor={colors.white}
                        />
                        <Text style={styles.termsText}>
                            Acepto los <Text style={styles.termsLink}>Términos</Text> y <Text style={styles.termsLink}>Políticas de Privacidad</Text>
                        </Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>Crear Cuenta</Text>
                                <Ionicons name="arrow-forward" size={18} color={colors.white} />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>O regístrate con</Text>
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

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
                        <Link href="/login" asChild>
                            <TouchableOpacity><Text style={styles.loginLink}> Iniciar Sesión</Text></TouchableOpacity>
                        </Link>
                    </View>
                </View>

                {/* Security Badge */}
                <View style={styles.securityBadge}>
                    <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                    <Text style={styles.securityText}>CIFRADO DE GRADO BANCARIO</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg, paddingBottom: 50 },
    logoContainer: { alignItems: 'center', marginBottom: spacing.lg },
    logoBox: { width: 56, height: 56, backgroundColor: colors.brand.primary, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
    logoText: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.white },
    logoAccent: { color: colors.brand.primary },
    formContainer: { backgroundColor: colors.background.secondary, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
    title: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.white, textAlign: 'center' },
    subtitle: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.lg },
    inputContainer: { marginBottom: spacing.md },
    label: { fontSize: fontSize.xs, fontWeight: 'bold', color: colors.text.secondary, marginBottom: spacing.xs },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: borderRadius.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    inputIcon: { marginLeft: spacing.md },
    input: { flex: 1, padding: spacing.md, color: colors.white, fontSize: fontSize.md },
    eyeButton: { padding: spacing.md },
    checkIcon: { marginRight: spacing.md },
    errorText: { color: colors.error, fontSize: fontSize.xs, marginTop: spacing.xs, marginLeft: spacing.xs },
    strengthContainer: { marginTop: spacing.sm },
    strengthBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
    strengthFill: { height: '100%', borderRadius: 2 },
    requirementsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm, gap: spacing.xs },
    requirementItem: { flexDirection: 'row', alignItems: 'center', gap: 4, width: '48%' },
    requirementText: { fontSize: 9, fontWeight: 'bold' },
    termsContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg, marginTop: spacing.sm },
    termsText: { flex: 1, fontSize: fontSize.xs, color: colors.text.secondary },
    termsLink: { color: colors.brand.primary },
    button: { backgroundColor: colors.brand.primary, borderRadius: borderRadius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: colors.white, fontSize: fontSize.md, fontWeight: 'bold' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
    dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
    dividerText: { fontSize: fontSize.xs, color: colors.text.muted, marginHorizontal: spacing.md },
    googleButton: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: borderRadius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    googleButtonDisabled: { opacity: 0.5 },
    googleButtonText: { color: colors.text.secondary, fontSize: fontSize.sm, fontWeight: 'bold' },
    loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
    loginText: { color: colors.text.secondary, fontSize: fontSize.sm },
    loginLink: { color: colors.brand.primary, fontSize: fontSize.sm, fontWeight: 'bold' },
    securityBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.lg },
    securityText: { fontSize: 9, fontWeight: 'bold', color: colors.text.muted, letterSpacing: 1 },
});
