import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Platform,
    ActivityIndicator, Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../stores/authStore';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

const { width } = Dimensions.get('window');

// KPI Card Component
const KPICard = ({ icon, label, value, trend, trendUp, color }: any) => (
    <View style={styles.kpiCard}>
        <View style={[styles.kpiIconBox, { backgroundColor: `${color}15` }]}>
            <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.kpiLabel}>{label}</Text>
        <Text style={[styles.kpiValue, { color }]}>{value}</Text>
        {trend && (
            <View style={styles.kpiTrend}>
                <Ionicons name={trendUp ? 'trending-up' : 'trending-down'} size={12} color={trendUp ? colors.success : colors.error} />
                <Text style={[styles.kpiTrendText, { color: trendUp ? colors.success : colors.error }]}>{trend}</Text>
            </View>
        )}
    </View>
);

// Quick Action Button
const QuickAction = ({ icon, label, color, onPress }: any) => (
    <TouchableOpacity style={[styles.quickAction, { borderColor: `${color}30` }]} onPress={onPress}>
        <Ionicons name={icon} size={18} color={color} />
        <Text style={[styles.quickActionText, { color }]}>{label}</Text>
    </TouchableOpacity>
);

// Recent Signal Card
const RecentSignal = ({ signal }: any) => (
    <View style={styles.signalCard}>
        <View style={styles.signalHeader}>
            <Text style={styles.signalPair}>{signal.pair}</Text>
            <View style={[styles.signalTypeBadge, { backgroundColor: signal.type === 'BUY' ? `${colors.success}15` : `${colors.error}15` }]}>
                <Text style={[styles.signalTypeText, { color: signal.type === 'BUY' ? colors.success : colors.error }]}>{signal.type}</Text>
            </View>
        </View>
        <View style={styles.signalDetails}>
            <Text style={styles.signalDetail}>Entrada: {signal.entry}</Text>
            <Text style={[styles.signalDetail, { color: colors.success }]}>TP: {signal.tp}</Text>
            <Text style={[styles.signalDetail, { color: colors.error }]}>SL: {signal.sl}</Text>
        </View>
        <Text style={styles.signalTime}>{signal.time}</Text>
    </View>
);

// Recent User Card
const RecentUser = ({ user }: any) => (
    <View style={styles.userCard}>
        <View style={[styles.userAvatar, { backgroundColor: `${colors.brand.primary}20` }]}>
            <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
        </View>
        <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPlan}>{user.plan}</Text>
        </View>
        <View style={[styles.userStatus, { backgroundColor: user.active ? `${colors.success}15` : `${colors.error}15` }]}>
            <View style={[styles.statusDot, { backgroundColor: user.active ? colors.success : colors.error }]} />
        </View>
    </View>
);

export default function AdminDashboard() {
    const { user, logout } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    const [stats] = useState({
        totalUsers: 1248,
        activeSignals: 12,
        monthlyRevenue: '$24,580',
        winRate: '87%'
    });

    const [recentSignals] = useState([
        { id: 1, pair: 'XAU/USD', type: 'BUY', entry: '2024.50', tp: '2035.00', sl: '2015.00', time: 'Hace 5 min' },
        { id: 2, pair: 'EUR/USD', type: 'SELL', entry: '1.09210', tp: '1.08500', sl: '1.09500', time: 'Hace 15 min' },
    ]);

    const [recentUsers] = useState([
        { id: 1, name: 'Carlos García', plan: 'Plan Pro', active: true },
        { id: 2, name: 'María López', plan: 'Plan Básico', active: true },
        { id: 3, name: 'Juan Rodríguez', plan: 'Plan Pro', active: false },
    ]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await new Promise(r => setTimeout(r, 1000));
        setRefreshing(false);
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>ADMIN_<Text style={{ color: colors.brand.primary }}>PANEL</Text></Text>
                        <Text style={styles.headerSubtitle}>Panel de control administrativo</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={22} color={colors.white} />
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationBadgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand.primary} />}
            >
                {/* Server Time */}
                <View style={styles.serverTime}>
                    <Ionicons name="time-outline" size={14} color={colors.brand.primary} />
                    <Text style={styles.serverTimeText}>SERVER: {currentTime} UTC</Text>
                </View>

                {/* KPI Grid */}
                <View style={styles.kpiGrid}>
                    <KPICard icon="people" label="Usuarios" value={stats.totalUsers} trend="+12%" trendUp={true} color={colors.brand.primary} />
                    <KPICard icon="flash" label="Señales" value={stats.activeSignals} color={colors.success} />
                    <KPICard icon="cash" label="Ingresos" value={stats.monthlyRevenue} trend="+8%" trendUp={true} color="#a855f7" />
                    <KPICard icon="checkmark-circle" label="Win Rate" value={stats.winRate} color={colors.warning} />
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACCIONES_<Text style={{ color: colors.brand.primary }}>RÁPIDAS</Text></Text>
                    <View style={styles.quickActionsGrid}>
                        <QuickAction icon="flash" label="Nueva Señal" color={colors.brand.primary} onPress={() => router.push('/admin/signals')} />
                        <QuickAction icon="person-add" label="Crear Usuario" color={colors.success} onPress={() => router.push('/admin/users')} />
                        <QuickAction icon="newspaper" label="Publicar Noticia" color="#a855f7" onPress={() => router.push('/admin/news')} />
                        <QuickAction icon="megaphone" label="Enviar Alerta" color={colors.warning} onPress={() => { }} />
                    </View>
                </View>

                {/* Recent Signals */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>SEÑALES_<Text style={{ color: colors.brand.primary }}>RECIENTES</Text></Text>
                        <TouchableOpacity onPress={() => router.push('/admin/signals')}>
                            <Text style={styles.seeAllText}>Ver todas</Text>
                        </TouchableOpacity>
                    </View>
                    {recentSignals.map(signal => <RecentSignal key={signal.id} signal={signal} />)}
                </View>

                {/* Recent Users */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>USUARIOS_<Text style={{ color: colors.brand.primary }}>RECIENTES</Text></Text>
                        <TouchableOpacity onPress={() => router.push('/admin/users')}>
                            <Text style={styles.seeAllText}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>
                    {recentUsers.map(user => <RecentUser key={user.id} user={user} />)}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={18} color={colors.error} />
                    <Text style={styles.logoutText}>Cerrar Sesión Admin</Text>
                </TouchableOpacity>
            </ScrollView>
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
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    backButton: { padding: spacing.xs },
    headerTitle: { fontSize: fontSize.lg, fontWeight: '900', color: colors.white, fontStyle: 'italic' },
    headerSubtitle: { fontSize: 10, color: colors.text.muted, marginTop: 2 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    iconButton: { position: 'relative', padding: spacing.xs },
    notificationBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.error,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadgeText: { fontSize: 9, fontWeight: '900', color: colors.white },
    content: { flex: 1 },
    contentContainer: { padding: spacing.lg, paddingBottom: 100 },
    serverTime: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        backgroundColor: `${colors.brand.primary}10`,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
    },
    serverTimeText: { fontSize: 10, fontWeight: '900', color: colors.brand.primary, letterSpacing: 1 },
    kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
    kpiCard: {
        width: (width - spacing.lg * 2 - spacing.md) / 2,
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    kpiIconBox: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
    kpiLabel: { fontSize: 10, fontWeight: '700', color: colors.text.muted, marginBottom: 4 },
    kpiValue: { fontSize: fontSize.xl, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
    kpiTrend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
    kpiTrendText: { fontSize: 10, fontWeight: '700' },
    section: { marginBottom: spacing.xl },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    sectionTitle: { fontSize: fontSize.md, fontWeight: '900', color: colors.white, fontStyle: 'italic' },
    seeAllText: { fontSize: 12, color: colors.brand.primary, fontWeight: '600' },
    quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    quickAction: {
        width: (width - spacing.lg * 2 - spacing.md) / 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.lg,
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
    },
    quickActionText: { fontSize: 11, fontWeight: '800' },
    signalCard: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    signalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    signalPair: { fontSize: fontSize.md, fontWeight: '900', color: colors.white },
    signalTypeBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
    signalTypeText: { fontSize: 10, fontWeight: '900' },
    signalDetails: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.sm },
    signalDetail: { fontSize: 11, color: colors.text.muted, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
    signalTime: { fontSize: 10, color: colors.text.muted },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    userAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    userAvatarText: { fontSize: fontSize.md, fontWeight: '900', color: colors.brand.primary },
    userInfo: { flex: 1, marginLeft: spacing.md },
    userName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.white },
    userPlan: { fontSize: 11, color: colors.text.muted },
    userStatus: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.lg,
        backgroundColor: `${colors.error}10`,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: `${colors.error}30`,
        marginTop: spacing.xl,
    },
    logoutText: { fontSize: 12, fontWeight: '700', color: colors.error },
});
