import React, { useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput,
    ActivityIndicator, Alert, Platform
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

export default function AdminUsers() {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [users] = useState([
        { id: '1', name: 'Jerónimo Admin', email: 'admin@tradingapp.com', plan: 'Plan Institucional', status: 'Active', joins: '12 Jan 2024' },
        { id: '2', name: 'Carlos García', email: 'carlos@demo.com', plan: 'Plan Pro', status: 'Active', joins: '15 Jan 2024' },
        { id: '3', name: 'María López', email: 'maria@test.com', plan: 'Plan Básico', status: 'Suspended', joins: '20 Dec 2023' },
        { id: '4', name: 'Kevin Durant', email: 'kd35@suns.com', plan: 'Plan Pro', status: 'Active', joins: '05 Jan 2024' },
        { id: '5', name: 'LeBron James', email: 'king@lakers.com', plan: 'Plan Institucional', status: 'Active', joins: '01 Jan 2024' },
    ]);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleAction = (user: any, action: string) => {
        Alert.alert(
            'Acción de Usuario',
            `¿Estás seguro de que quieres ${action} a ${user.name}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => Alert.alert('Éxito', 'Acción realizada.') }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>GESTIÓN_<Text style={{ color: colors.brand.primary }}>USUARIOS</Text></Text>
                    <Text style={styles.headerSubtitle}>{users.length} usuarios registrados</Text>
                </View>
                <TouchableOpacity style={styles.addUserButton}>
                    <Ionicons name="person-add" size={20} color={colors.brand.primary} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color={colors.text.muted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por nombre o email..."
                        placeholderTextColor={colors.text.muted}
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={18} color={colors.text.muted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {loading ? (
                    <ActivityIndicator color={colors.brand.primary} style={{ marginTop: 40 }} />
                ) : filteredUsers.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={48} color={colors.text.muted} />
                        <Text style={styles.emptyText}>No se encontraron usuarios</Text>
                    </View>
                ) : (
                    filteredUsers.map(user => (
                        <View key={user.id} style={styles.userCard}>
                            <View style={styles.userInfoRow}>
                                <View style={[styles.avatar, { backgroundColor: `${colors.brand.primary}15` }]}>
                                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                                </View>
                                <View style={styles.userDetails}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: user.status === 'Active' ? `${colors.success}15` : `${colors.error}15` }]}>
                                    <Text style={[styles.statusText, { color: user.status === 'Active' ? colors.success : colors.error }]}>
                                        {user.status.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.planInfo}>
                                <View style={styles.planTag}>
                                    <Ionicons name="ribbon" size={12} color={colors.brand.primary} />
                                    <Text style={styles.planText}>{user.plan}</Text>
                                </View>
                                <Text style={styles.joinText}>Unido: {user.joins}</Text>
                            </View>

                            <View style={styles.actionsRow}>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction(user, 'editar')}>
                                    <Ionicons name="create-outline" size={16} color={colors.brand.primary} />
                                    <Text style={styles.actionBtnText}>EDITAR</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction(user, 'suspender')}>
                                    <Ionicons name="ban-outline" size={16} color={colors.warning} />
                                    <Text style={[styles.actionBtnText, { color: colors.warning }]}>SUSPENDER</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction(user, 'eliminar')}>
                                    <Ionicons name="trash-outline" size={16} color={colors.error} />
                                    <Text style={[styles.actionBtnText, { color: colors.error }]}>ELIMINAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        gap: spacing.md,
    },
    backButton: { padding: spacing.xs },
    headerTitle: { fontSize: fontSize.lg, fontWeight: '900', color: colors.white, fontStyle: 'italic' },
    headerSubtitle: { fontSize: 10, color: colors.text.muted, marginTop: 2 },
    addUserButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: `${colors.brand.primary}10`,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchSection: { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 44,
        gap: spacing.sm,
    },
    searchInput: { flex: 1, color: colors.white, fontSize: 13, fontWeight: '600' },
    content: { flex: 1 },
    contentContainer: { padding: spacing.lg, paddingBottom: 40 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
    emptyText: { fontSize: fontSize.sm, color: colors.text.muted, marginTop: spacing.md },
    userCard: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    userInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: `${colors.brand.primary}30`
    },
    avatarText: { fontSize: fontSize.lg, fontWeight: '900', color: colors.brand.primary },
    userDetails: { flex: 1, marginLeft: spacing.md },
    userName: { fontSize: fontSize.sm, fontWeight: '800', color: colors.white },
    userEmail: { fontSize: 11, color: colors.text.muted, marginTop: 2 },
    statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
    statusText: { fontSize: 9, fontWeight: '900' },
    planInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md
    },
    planTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    planText: { fontSize: 11, fontWeight: '700', color: colors.white },
    joinText: { fontSize: 10, color: colors.text.muted },
    actionsRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: spacing.md,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    actionBtnText: { fontSize: 9, fontWeight: '900', color: colors.brand.primary }
});
