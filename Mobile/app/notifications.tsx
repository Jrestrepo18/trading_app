import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Platform
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

type NotificationType = 'signal' | 'news' | 'system' | 'plan';

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const NotificationItem = ({ notification, onPress }: { notification: Notification; onPress: () => void }) => {
    const getIconAndColor = () => {
        switch (notification.type) {
            case 'signal': return { icon: 'flash', color: colors.brand.primary };
            case 'news': return { icon: 'newspaper', color: '#a855f7' };
            case 'system': return { icon: 'settings', color: colors.warning };
            case 'plan': return { icon: 'card', color: colors.success };
            default: return { icon: 'notifications', color: colors.text.muted };
        }
    };

    const { icon, color } = getIconAndColor();

    return (
        <TouchableOpacity
            style={[styles.notificationItem, !notification.read && styles.notificationUnread]}
            onPress={onPress}
        >
            <View style={[styles.notificationIcon, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon as any} size={20} color={color} />
            </View>
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
};

export default function NotificationsScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | NotificationType>('all');
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, type: 'signal', title: 'Nueva Señal', message: 'XAU/USD - Compra en 2024.50 con objetivo 2035.00', time: 'Hace 5 minutos', read: false },
        { id: 2, type: 'signal', title: 'Señal Actualizada', message: 'EUR/USD - Take Profit alcanzado +45 pips', time: 'Hace 30 minutos', read: false },
        { id: 3, type: 'news', title: 'Noticia Importante', message: 'La Fed mantiene tasas de interés sin cambios en su última reunión', time: 'Hace 1 hora', read: true },
        { id: 4, type: 'plan', title: 'Plan Renovado', message: 'Tu plan Pro se ha renovado automáticamente por 30 días más', time: 'Hace 2 horas', read: true },
        { id: 5, type: 'system', title: 'Mantenimiento Programado', message: 'El sistema estará en mantenimiento mañana de 2:00 a 4:00 UTC', time: 'Hace 5 horas', read: true },
        { id: 6, type: 'signal', title: 'Nueva Señal', message: 'GBP/JPY - Venta en 188.50 con stop loss en 189.20', time: 'Hace 1 día', read: true },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.type === filter);

    const onRefresh = async () => {
        setRefreshing(true);
        await new Promise(r => setTimeout(r, 1000));
        setRefreshing(false);
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const FilterButton = ({ type, label }: { type: 'all' | NotificationType; label: string }) => (
        <TouchableOpacity
            style={[styles.filterButton, filter === type && styles.filterButtonActive]}
            onPress={() => setFilter(type)}
        >
            <Text style={[styles.filterButtonText, filter === type && styles.filterButtonTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>CENTRO_<Text style={{ color: colors.brand.primary }}>NOTIFICACIONES</Text></Text>
                        <Text style={styles.headerSubtitle}>{unreadCount} sin leer</Text>
                    </View>
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                        <Text style={styles.markAllText}>Marcar todas</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    <FilterButton type="all" label="Todas" />
                    <FilterButton type="signal" label="Señales" />
                    <FilterButton type="news" label="Noticias" />
                    <FilterButton type="plan" label="Plan" />
                    <FilterButton type="system" label="Sistema" />
                </ScrollView>
            </View>

            {/* Notifications List */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand.primary} />}
            >
                {filteredNotifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={48} color={colors.text.muted} />
                        <Text style={styles.emptyText}>No hay notificaciones</Text>
                    </View>
                ) : (
                    filteredNotifications.map(notification => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onPress={() => markAsRead(notification.id)}
                        />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    backButton: { padding: spacing.xs },
    headerTitle: { fontSize: fontSize.md, fontWeight: '900', color: colors.white, fontStyle: 'italic' },
    headerSubtitle: { fontSize: 11, color: colors.text.muted, marginTop: 2 },
    markAllButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    markAllText: { fontSize: 12, color: colors.brand.primary, fontWeight: '600' },
    filterContainer: { borderBottomWidth: 1, borderBottomColor: colors.border },
    filterScroll: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
    filterButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background.secondary,
        marginRight: spacing.sm,
    },
    filterButtonActive: { backgroundColor: colors.brand.primary },
    filterButtonText: { fontSize: 12, fontWeight: '600', color: colors.text.muted },
    filterButtonTextActive: { color: colors.white },
    content: { flex: 1 },
    contentContainer: { padding: spacing.lg },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    notificationUnread: { borderColor: colors.brand.primary, borderWidth: 1 },
    notificationIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationContent: { flex: 1, marginLeft: spacing.md },
    notificationTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.white, marginBottom: 4 },
    notificationMessage: { fontSize: 12, color: colors.text.secondary, lineHeight: 18, marginBottom: spacing.sm },
    notificationTime: { fontSize: 10, color: colors.text.muted },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand.primary },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
    emptyText: { fontSize: fontSize.sm, color: colors.text.muted, marginTop: spacing.md },
});
