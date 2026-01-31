import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import useAuthStore from '../stores/authStore';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

export default function ProfileScreen() {
    const { user, setUser } = useAuthStore();
    const [name, setName] = useState(user?.name || '');
    const [isLoading, setIsLoading] = useState(false);

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'El nombre no puede estar vacío');
            return;
        }

        setIsLoading(true);
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Update Firebase Auth Profile
                await updateProfile(currentUser, { displayName: name });

                // Update Firestore
                const userDocRef = doc(db, 'users', currentUser.uid);
                await updateDoc(userDocRef, { name });

                // Update Local Store
                setUser({
                    ...user!,
                    name: name
                });

                Alert.alert('Éxito', 'Perfil actualizado correctamente');
            }
        } catch (error: any) {
            console.error('Update profile error:', error);
            Alert.alert('Error', 'No se pudo actualizar el perfil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos de contraseña');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'Las nuevas contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert('Error', 'La nueva contraseña debe tener al menos 8 caracteres');
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const currentUser = auth.currentUser;
            if (currentUser && currentUser.email) {
                // Re-authenticate user
                const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
                await reauthenticateWithCredential(currentUser, credential);

                // Update Password
                await updatePassword(currentUser, newPassword);

                Alert.alert('Éxito', 'Contraseña actualizada correctamente');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }
        } catch (error: any) {
            console.error('Change password error:', error);
            let message = 'No se pudo cambiar la contraseña';
            if (error.code === 'auth/wrong-password') message = 'La contraseña actual es incorrecta';
            Alert.alert('Error', message);
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* User Info Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="person-circle-outline" size={20} color={colors.brand.primary} />
                            <Text style={styles.sectionTitle}>DATOS_PERSONALES</Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Nombre Completo</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="person-outline" size={18} color={colors.text.secondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Tu nombre"
                                        placeholderTextColor={colors.text.muted}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email (No editable)</Text>
                                <View style={[styles.inputWrapper, styles.inputDisabled]}>
                                    <Ionicons name="mail-outline" size={18} color={colors.text.muted} style={styles.inputIcon} />
                                    <Text style={[styles.input, { color: colors.text.muted }]}>{user?.email}</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.button, isLoading && styles.buttonDisabled]}
                                onPress={handleUpdateProfile}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={colors.white} />
                                ) : (
                                    <>
                                        <Text style={styles.buttonText}>Guardar Cambios</Text>
                                        <Ionicons name="save-outline" size={18} color={colors.white} />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Security Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="shield-half-outline" size={20} color={colors.brand.primary} />
                            <Text style={styles.sectionTitle}>SEGURIDAD</Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Contraseña Actual</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed-outline" size={18} color={colors.text.secondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        secureTextEntry={!showPasswords}
                                        placeholder="••••••••"
                                        placeholderTextColor={colors.text.muted}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Nueva Contraseña</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="key-outline" size={18} color={colors.text.secondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry={!showPasswords}
                                        placeholder="Mínimo 8 caracteres"
                                        placeholderTextColor={colors.text.muted}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="checkmark-circle-outline" size={18} color={colors.text.secondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={confirmNewPassword}
                                        onChangeText={setConfirmNewPassword}
                                        secureTextEntry={!showPasswords}
                                        placeholder="Repite la contraseña"
                                        placeholderTextColor={colors.text.muted}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => setShowPasswords(!showPasswords)}
                                style={styles.showPasswordRow}
                            >
                                <Ionicons
                                    name={showPasswords ? 'eye-off-outline' : 'eye-outline'}
                                    size={16}
                                    color={colors.text.secondary}
                                />
                                <Text style={styles.showPasswordText}>
                                    {showPasswords ? 'Ocultar' : 'Mostrar'} contraseñas
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.securityButton, isUpdatingPassword && styles.buttonDisabled]}
                                onPress={handleChangePassword}
                                disabled={isUpdatingPassword}
                            >
                                {isUpdatingPassword ? (
                                    <ActivityIndicator color={colors.white} />
                                ) : (
                                    <>
                                        <Text style={styles.buttonText}>Actualizar Contraseña</Text>
                                        <Ionicons name="lock-open-outline" size={18} color={colors.white} />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* App Version Info */}
                    <View style={styles.footer}>
                        <Text style={styles.versionText}>Senzacional v1.0.0</Text>
                        <Text style={styles.terminalText}>TERMINAL_ID: {user?.uid.substring(0, 8).toUpperCase()}</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    headerTitle: { fontSize: fontSize.lg, fontWeight: '900', color: colors.white, letterSpacing: 1 },
    scrollContent: { padding: spacing.lg, paddingBottom: 40 },
    section: { marginBottom: spacing.xl },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
    sectionTitle: { fontSize: 10, fontWeight: '900', color: colors.text.secondary, letterSpacing: 2 },
    card: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputContainer: { marginBottom: spacing.md },
    label: { fontSize: fontSize.xs, fontWeight: 'bold', color: colors.text.secondary, marginBottom: spacing.xs },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    inputDisabled: { opacity: 0.5, backgroundColor: 'rgba(255,255,255,0.05)' },
    inputIcon: { marginLeft: spacing.md },
    input: {
        flex: 1,
        padding: spacing.md,
        color: colors.white,
        fontSize: fontSize.md,
    },
    button: {
        backgroundColor: colors.brand.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    securityButton: { backgroundColor: 'rgba(59,130,246,0.2)', borderWidth: 1, borderColor: colors.brand.primary },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: colors.white, fontSize: fontSize.md, fontWeight: 'bold' },
    showPasswordRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg, marginTop: -spacing.xs },
    showPasswordText: { fontSize: fontSize.xs, color: colors.text.secondary, fontWeight: '600' },
    footer: { alignItems: 'center', marginTop: spacing.xl },
    versionText: { fontSize: 10, color: colors.text.muted, fontWeight: '800' },
    terminalText: { fontSize: 8, color: colors.text.muted, fontWeight: 'bold', letterSpacing: 1, marginTop: 4 },
});
