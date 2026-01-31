import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Platform,
    ActivityIndicator, Image, Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../stores/authStore';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';
import { API_URL, ENDPOINTS } from '../constants/api';

const getSmartImage = (item: any) => {
    // Detect if the image is a logo or placeholder
    const isLogo = !item.imageurl || item.imageurl.includes('default') || item.imageurl === item.source_info?.img;

    if (isLogo) {
        // High quality fallback visuals from Unsplash
        return 'https://images.unsplash.com/photo-1611974717482-95317aa18f1a?auto=format&fit=crop&q=80&w=400';
    }

    return item.imageurl;
};

const SignalCard = ({ signal }: { signal: any }) => {
    const isPositive = parseFloat(signal.pips) >= 0;
    return (
        <View style={styles.signalCard}>
            <View style={styles.signalHeader}>
                <View>
                    <Text style={styles.signalPair}>{signal.pair}</Text>
                    <View style={[styles.signalType, { backgroundColor: signal.type === 'BUY' ? 'rgba(14,203,129,0.1)' : 'rgba(246,70,93,0.1)' }]}>
                        <Text style={[styles.signalTypeText, { color: signal.type === 'BUY' ? colors.success : colors.error }]}>{signal.type}</Text>
                    </View>
                </View>
                <View style={styles.signalProfit}>
                    <Text style={styles.signalProfitLabel}>Pips Netos</Text>
                    <Text style={[styles.signalProfitValue, { color: isPositive ? colors.success : colors.error }]}>
                        {signal.pips} <Text style={styles.pipsLabel}>PIPS</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.signalDetails}>
                <View style={styles.signalDetailItem}>
                    <Text style={styles.signalDetailLabel}>ENTRADA</Text>
                    <Text style={styles.signalDetailValue}>{signal.entry}</Text>
                </View>
                <View style={styles.signalDetailItem}>
                    <Text style={styles.signalDetailLabel}>T. PROFIT</Text>
                    <Text style={[styles.signalDetailValue, { color: colors.success }]}>{signal.tp}</Text>
                </View>
                <View style={styles.signalDetailItem}>
                    <Text style={styles.signalDetailLabel}>S. LOSS</Text>
                    <Text style={[styles.signalDetailValue, { color: colors.error }]}>{signal.sl}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.executeButton}>
                <Text style={styles.executeButtonText}>EJECUTAR ORDEN</Text>
                <Ionicons name="flash" size={12} color={colors.brand.primary} />
            </TouchableOpacity>
        </View>
    );
};

const MarketMarquee = () => {
    const [prices] = useState([
        { pair: 'XAU/USD', price: '2024.50', up: true },
        { pair: 'BTC/USDT', price: '42,650.20', up: false },
        { pair: 'EUR/USD', price: '1.09210', up: true },
        { pair: 'NAS100', price: '16,840.45', up: true },
    ]);

    return (
        <View style={styles.marqueeContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.marqueeContent}>
                {prices.map((p, i) => (
                    <View key={i} style={styles.marqueeItem}>
                        <Text style={styles.marqueePair}>{p.pair}</Text>
                        <Text style={styles.marqueePrice}>{p.price}</Text>
                        <Ionicons
                            name={p.up ? 'caret-up' : 'caret-down'}
                            size={10}
                            color={p.up ? colors.success : colors.error}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const MarketSentiment = () => {
    const [sentiment, setSentiment] = useState({ value: 50, label: 'Neutral' });

    useEffect(() => {
        const fetchSentiment = async () => {
            try {
                const response = await fetch('https://api.alternative.me/fng/');
                const data = await response.json();
                setSentiment({
                    value: parseInt(data.data[0].value),
                    label: data.data[0].value_classification.toUpperCase()
                });
            } catch (error) { }
        };
        fetchSentiment();
    }, []);

    return (
        <View style={styles.sentimentCard}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionIndicator} />
                <Text style={styles.sectionTitle}>SENTIMIENTO_<Text style={{ color: colors.brand.primary }}>MERCADO</Text></Text>
            </View>
            <View style={styles.sentimentContent}>
                <View style={styles.sentimentLabels}>
                    <Text style={[styles.sentimentLabel, { color: sentiment.value > 60 ? colors.success : sentiment.value < 40 ? colors.error : colors.warning }]}>
                        INDEX: {sentiment.value}%
                    </Text>
                    <Text style={[styles.sentimentLabel, { color: sentiment.value > 60 ? colors.success : sentiment.value < 40 ? colors.error : colors.warning }]}>
                        {sentiment.label}
                    </Text>
                </View>
                <View style={styles.sentimentBarBg}>
                    <View style={[styles.sentimentBarFill, {
                        width: `${sentiment.value}%`,
                        backgroundColor: sentiment.value > 60 ? colors.success : sentiment.value < 40 ? colors.error : colors.warning
                    }]} />
                </View>
                <Text style={styles.sentimentText}>Fuente: Alternative.me Fear & Greed Index</Text>
            </View>
        </View>
    );
};


const MarketNewsSection = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=ES');
                const data = await response.json();
                setNews(data.Data.slice(0, 8));
            } catch (error) { } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const featured = news[0];
    const secondary = news.slice(1);

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, { backgroundColor: colors.brand.primary }]} />
                <Text style={styles.sectionTitle}>NOTICIAS_<Text style={{ color: colors.brand.primary }}>MERCADO</Text></Text>
                <View style={styles.liveDot} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={colors.brand.primary} />
                </View>
            ) : (
                <View style={styles.newsContainerEditorial}>
                    {/* Featured News - BBC Style */}
                    {featured && (
                        <TouchableOpacity style={styles.newsFeaturedCard}>
                            <Image
                                source={{ uri: getSmartImage(featured) }}
                                style={styles.newsFeaturedImage}
                                resizeMode="cover"
                            />
                            <View style={styles.newsFeaturedOverlay} />
                            <View style={styles.newsFeaturedBadge}>
                                <Text style={styles.newsBadgeText}>BREAKING_ALPHA</Text>
                            </View>
                            <View style={styles.newsFeaturedContent}>
                                <View style={styles.newsHeader}>
                                    <Ionicons name="time-outline" size={10} color={colors.text.muted} />
                                    <Text style={styles.newsTime}>{new Date(featured.published_on * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</Text>
                                </View>
                                <Text style={styles.newsFeaturedTitle} numberOfLines={2}>{featured.title}</Text>
                                <View style={styles.featuredSourceRow}>
                                    <Text style={styles.newsSourceTextPrimary}>{featured.source_info.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Secondary News List */}
                    <View style={styles.newsVerticalList}>
                        {secondary.map((item, i) => (
                            <TouchableOpacity key={i} style={styles.newsCardVertical}>
                                <View style={styles.newsImageContainerVertical}>
                                    <Image
                                        source={{ uri: getSmartImage(item) }}
                                        style={styles.newsImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.newsBadgeSmall}>
                                        <Text style={styles.newsBadgeTextSmall}>{item.source_info.name.split(' ')[0]}</Text>
                                    </View>
                                </View>
                                <View style={styles.newsContentVertical}>
                                    <View style={styles.newsHeader}>
                                        <Ionicons name="time-outline" size={8} color={colors.text.muted} />
                                        <Text style={styles.newsTime}>{new Date(item.published_on * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</Text>
                                    </View>
                                    <Text style={styles.newsTitleVertical} numberOfLines={2}>{item.title}</Text>
                                    <Text style={styles.newsBodySmall} numberOfLines={1}>{item.body}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

const MarketIntelligenceHub = () => {
    return (
        <View style={styles.intelHub}>
            <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, { backgroundColor: colors.brand.primary, width: 4 }]} />
                <Text style={styles.sectionTitle}>INTELIGENCIA_<Text style={{ color: colors.brand.primary }}>SENZ</Text></Text>
            </View>
            <View style={styles.intelGrid}>
                <View style={styles.intelItem}>
                    <Text style={styles.intelLabel}>SENTIMIENTO</Text>
                    <Text style={[styles.intelValue, { color: colors.success }]}>72% COMPRA</Text>
                </View>
                <View style={styles.intelItem}>
                    <Text style={styles.intelLabel}>VOLATILIDAD</Text>
                    <Text style={[styles.intelValue, { color: colors.warning }]}>MODERADA</Text>
                </View>
            </View>
        </View>
    );
};

export default function DashboardScreen() {
    const { user, logout } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date().toUTCString().split(' ')[4]);
    const [refreshing, setRefreshing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    const [signals] = useState([
        { id: 1, pair: 'XAU/USD', type: 'BUY', entry: '2024.50', tp: '2035.00', sl: '2015.00', pips: '+16.5', time: '2m' },
        { id: 2, pair: 'EUR/USD', type: 'SELL', entry: '1.09210', tp: '1.08500', sl: '1.09500', pips: '+2.5', time: '8m' },
    ]);

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeToday: 0,
        newLast7Days: 0,
        retentionRate: '0%',
        loading: true
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toUTCString().split(' ')[4]), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(ENDPOINTS.ADMIN.STATS);
                const data = await response.json();
                if (data.success) {
                    setStats({ ...data.stats, loading: false });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                setStats(s => ({ ...s, loading: false }));
            }
        };
        fetchStats();
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

    const firstName = user?.name?.split(' ')[0] || 'Trader';

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.menuButton}>
                        <Ionicons name="menu" size={24} color={colors.brand.primary} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.headerTitle}>CONTROL_<Text style={{ color: colors.brand.primary }}>CENTER</Text></Text>
                        <View style={styles.terminalStatusMini}>
                            <View style={styles.statusDotLive} />
                            <Text style={styles.terminalLabel}>SESSION_ACTIVE</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    {user?.role === 'admin' && (
                        <TouchableOpacity onPress={() => router.push('/admin')} style={[styles.actionButton, styles.adminButton]}>
                            <Ionicons name="shield-half" size={20} color={colors.white} />
                            <Text style={styles.adminButtonText}>ADMIN</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.actionButton}>
                        <Ionicons name="notifications-outline" size={24} color={colors.brand.primary} />
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationBadgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/profile')} style={styles.actionButton}>
                        <Ionicons name="person-circle-outline" size={24} color={colors.brand.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Side Menu Drawer (Simple Implementation) */}
            {isMenuOpen && (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setIsMenuOpen(false)}
                    style={styles.drawerOverlay}
                >
                    <View style={styles.drawerContent}>
                        <View style={styles.drawerHeader}>
                            <Text style={styles.drawerTitle}>MENU_SENZ</Text>
                            <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                                <Ionicons name="close" size={24} color={colors.text.muted} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.drawerNav}>
                            {[
                                { id: 'dashboard', label: 'DASHBOARD', icon: 'grid-outline' },
                                { id: 'news', label: 'NOTICIAS', icon: 'newspaper-outline' },
                                { id: 'plans', label: 'MEJORAR PLAN', icon: 'card-outline' },
                                { id: 'academy', label: 'ACADEMIA', icon: 'school-outline' },
                            ].map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => { setActiveSection(item.id); setIsMenuOpen(false); }}
                                    style={[styles.drawerItem, activeSection === item.id && styles.drawerItemActive]}
                                >
                                    <Ionicons name={item.icon as any} size={20} color={activeSection === item.id ? colors.brand.primary : colors.text.muted} />
                                    <Text style={[styles.drawerItemText, activeSection === item.id && styles.drawerItemTextActive]}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity onPress={handleLogout} style={styles.drawerFooter}>
                            <Ionicons name="log-out-outline" size={20} color={colors.error} />
                            <Text style={styles.logoutText}>CERRAR_SESIÓN</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )}

            <MarketMarquee />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand.primary} />}
            >
                {activeSection === 'dashboard' && (
                    <>
                        {/* 1. Welcome & Time (Top Identity) */}
                        <View style={styles.welcomeSection}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <View>
                                    <Text style={styles.welcomeTitle}>Hola, <Text style={{ color: colors.brand.primary }}>{firstName}</Text></Text>
                                    <View style={styles.badgeRow}>
                                        <View style={styles.subscriptionBadge}>
                                            <Ionicons name="shield-checkmark" size={12} color={colors.brand.primary} />
                                            <Text style={styles.subscriptionText}>Trader PRO</Text>
                                        </View>
                                        <Text style={styles.expiryText}>Expira en 24 días</Text>
                                    </View>
                                </View>
                                <View style={styles.terminalStatus}>
                                    <Text style={styles.terminalStatusLabel}>SERVER_UTC</Text>
                                    <Text style={styles.terminalStatusValue}>{currentTime}</Text>
                                </View>
                            </View>
                        </View>

                        {/* 2. Stats Grid (Performance at a glance) */}
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>USUARIOS_PRO</Text>
                                <Text style={[styles.statValue, { color: colors.brand.primary }]}>
                                    {stats.loading ? '...' : stats.totalUsers}
                                </Text>
                                <View style={styles.statTrend}>
                                    <Ionicons name="people" size={8} color={colors.text.muted} />
                                    <Text style={styles.statTrendText}>{stats.activeToday} ACTIVOS HOY</Text>
                                </View>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>WIN_RATE</Text>
                                <Text style={[styles.statValue, { color: colors.white }]}>84.7%</Text>
                                <View style={styles.statTrend}>
                                    <Ionicons name="checkmark-circle" size={8} color={colors.brand.primary} />
                                    <Text style={styles.statTrendText}>ACCURACY_STABLE</Text>
                                </View>
                            </View>
                        </View>

                        {/* 3. Core Signals (Primary Action) */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIndicator, { backgroundColor: colors.brand.primary }]} />
                                <Text style={styles.sectionTitle}>SEÑALES_<Text style={{ color: colors.brand.primary }}>ACTIVAS</Text></Text>
                                <View style={styles.liveDot} />
                            </View>
                            {signals.map((signal) => <SignalCard key={signal.id} signal={signal} />)}
                        </View>

                        {/* 4. Market Intelligence Hub & BBC News Integration */}
                        <MarketIntelligenceHub />
                        <MarketNewsSection />

                        {/* 5. Market Sentiment */}
                        <MarketSentiment />
                    </>
                )}

                {activeSection === 'news' && <MarketNewsSection />}

                {activeSection === 'plans' && (
                    <View style={styles.plansContainer}>
                        <View style={styles.plansHeader}>
                            <View style={styles.institutionalBadge}>
                                <Ionicons name="shield-checkmark" size={12} color={colors.brand.primary} />
                                <Text style={styles.institutionalBadgeText}>INFRAESTRUCTURA INSTITUCIONAL</Text>
                            </View>
                            <Text style={styles.plansTitleInstitutional}>PLANES_<Text style={{ color: colors.brand.primary }}>SUSCRIPCIÓN</Text></Text>
                            <Text style={styles.plansSubtitleInstitutional}>Elige el plan que mejor se adapte a tu operativa profesional.</Text>
                        </View>

                        {[
                            {
                                id: 'standard',
                                name: 'Plan Básico',
                                price: '49',
                                tier: 'BÁSICO',
                                features: ['Señales Premium H1', 'Análisis Lite', 'Soporte Global'],
                                current: false,
                                color: colors.brand.primary
                            },
                            {
                                id: 'pro',
                                name: 'Plan Pro',
                                price: '99',
                                tier: 'PRO',
                                features: ['Todas las Señales', 'Sentimiento Pro Live', 'Acceso VIP'],
                                current: true,
                                color: colors.brand.primary
                            },
                            {
                                id: 'alpha',
                                name: 'Plan Institucional',
                                price: '199',
                                tier: 'PRIME',
                                features: ['API de Ejecución', 'Nodo Alta Frecuencia', 'Academia Completa'],
                                current: false,
                                color: '#a855f7'
                            },
                        ].map((plan) => (
                            <View key={plan.id} style={[styles.planCard, plan.current && styles.planCardActive]}>
                                {plan.current && <View style={styles.activePlanBadge}><Text style={styles.activePlanBadgeText}>ACTIVO</Text></View>}
                                <View style={styles.planHeader}>
                                    <View style={[styles.planTierBox, { backgroundColor: plan.id === 'alpha' ? '#a855f720' : `${colors.brand.primary}15`, borderColor: plan.id === 'alpha' ? '#a855f730' : `${colors.brand.primary}30` }]}>
                                        <Text style={[styles.planTierText, { color: plan.id === 'alpha' ? '#a855f7' : colors.brand.primary }]}>{plan.tier}</Text>
                                    </View>
                                    <Text style={styles.planName}>{plan.name}</Text>
                                </View>
                                <View style={styles.planPriceBox}>
                                    <Text style={styles.planCurrency}>$</Text>
                                    <Text style={styles.planPrice}>{plan.price}</Text>
                                    <Text style={styles.planPeriod}>/MO</Text>
                                </View>
                                <View style={styles.planFeatures}>
                                    {plan.features.map((feat, idx) => (
                                        <View key={idx} style={styles.planFeatureItem}>
                                            <Ionicons name="checkmark-circle" size={12} color={plan.current ? colors.brand.primary : colors.text.muted} />
                                            <Text style={styles.planFeatureText}>{feat}</Text>
                                        </View>
                                    ))}
                                </View>
                                <TouchableOpacity style={[styles.planButton, plan.current ? styles.planButtonSync : styles.planButtonActivate]}>
                                    <Text style={[styles.planButtonText, plan.current ? styles.planButtonTextSync : styles.planButtonTextActivate]}>
                                        {plan.current ? 'PLAN SINCRONIZADO' : 'ACTIVAR PLAN'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {activeSection === 'academy' && (
                    <View style={styles.academyContainer}>
                        <View style={styles.academyLockedBox}>
                            <View style={styles.lockIconCircle}>
                                <Ionicons name="lock-closed" size={40} color={colors.brand.primary} />
                            </View>
                            <Text style={styles.academyTitle}>SENZACIONAL_<Text style={{ color: colors.brand.primary }}>ACADEMY</Text></Text>
                            <View style={styles.securityBadge}>
                                <Text style={styles.securityBadgeText}>SECURE_ACCESS_REQUIRED</Text>
                            </View>
                            <Text style={styles.academyDescription}>
                                Módulos de entrenamiento avanzado bloqueados por protocolo de seguridad. Requiere sincronización de nodo Institutional_Prime para desencriptar.
                            </Text>
                            <TouchableOpacity
                                onPress={() => setActiveSection('plans')}
                                style={styles.academyButton}
                            >
                                <Text style={styles.academyButtonText}>UNRESTRICT_ALPHA_CONTENT</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.academyFooter}>
                            <Ionicons name="globe-outline" size={14} color={colors.text.muted} opacity={0.3} />
                            <Ionicons name="pulse-outline" size={14} color={colors.text.muted} opacity={0.3} />
                            <Ionicons name="shield-outline" size={14} color={colors.text.muted} opacity={0.3} />
                        </View>
                    </View>
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
        backgroundColor: colors.background.primary,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    logoBox: {
        width: 40,
        height: 40,
        backgroundColor: colors.brand.primary,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.brand.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    logoText: { fontSize: fontSize.lg, fontWeight: '900', color: colors.white, letterSpacing: -0.5 },
    logoAccent: { color: colors.brand.primary },
    headerTitle: { fontSize: fontSize.md, fontWeight: '900', color: colors.white, fontStyle: 'italic', letterSpacing: -0.5 },
    terminalLabel: { fontSize: 8, color: colors.text.muted, fontWeight: 'bold', letterSpacing: 1, marginTop: -2 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
    terminalStatus: {
        alignItems: 'flex-end',
        backgroundColor: 'rgba(59,130,246,0.05)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.1)',
    },
    terminalStatusLabel: { fontSize: 7, color: colors.text.muted, fontWeight: '900', letterSpacing: 1 },
    terminalStatusValue: {
        fontSize: fontSize.sm,
        fontWeight: '900',
        color: colors.brand.primary,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        marginTop: 2,
    },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    actionButton: { padding: spacing.xs, position: 'relative' },
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
    adminButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.brand.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
        marginRight: spacing.xs,
    },
    adminButtonText: { fontSize: 10, fontWeight: '900', color: colors.white },
    terminalStatusMini: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    statusDotLive: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.success },
    plansTitleInstitutional: {
        fontSize: fontSize.xxl,
        fontWeight: '900',
        color: colors.white,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: spacing.md
    },
    plansSubtitleInstitutional: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.text.muted,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 4
    },
    contentContainer: { padding: spacing.lg, paddingBottom: 100 },
    welcomeSection: { marginBottom: spacing.xl },
    welcomeTitle: { fontSize: fontSize.xxl, fontWeight: '900', color: colors.white, fontStyle: 'italic' },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
    subscriptionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        backgroundColor: 'rgba(59,130,246,0.1)',
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.2)',
    },
    subscriptionText: { fontSize: 10, color: colors.brand.primary, fontWeight: '900', letterSpacing: 0.5 },
    expiryText: { fontSize: 10, color: colors.text.muted, fontWeight: '800' },
    statsGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
    statCard: {
        flex: 1,
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 2,
    },
    statLabel: { fontSize: 9, fontWeight: '900', color: colors.text.secondary, letterSpacing: 1 },
    statValue: {
        fontSize: fontSize.xxl,
        fontWeight: '900',
        marginTop: spacing.xs,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        letterSpacing: -1,
    },
    statTrend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
    statTrendText: { fontSize: 8, color: colors.text.muted, fontWeight: '800' },
    section: { marginBottom: spacing.xl },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
    sectionIndicator: { width: 3, height: 14, backgroundColor: colors.brand.primary, borderRadius: 2 },
    sectionTitle: { fontSize: 11, fontWeight: '900', color: colors.text.secondary, letterSpacing: 2 },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success,
        marginLeft: spacing.xs,
    },
    signalCard: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.xl + 4,
        padding: spacing.xl,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    signalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
    signalPair: { fontSize: fontSize.xl, fontWeight: '900', color: colors.white, marginBottom: spacing.xs },
    signalType: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
        alignSelf: 'flex-start',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    signalTypeText: { fontSize: 10, fontWeight: '900' },
    signalProfit: { alignItems: 'flex-end' },
    signalProfitLabel: { fontSize: 8, fontWeight: '900', color: colors.text.muted, marginBottom: 2, letterSpacing: 1 },
    signalProfitValue: {
        fontSize: fontSize.xl,
        fontWeight: '900',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontStyle: 'italic',
    },
    pipsLabel: { fontSize: 10, fontWeight: '700' },
    signalDetails: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
    signalDetailItem: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 0.5,
        borderColor: colors.border,
    },
    signalDetailLabel: { fontSize: 8, fontWeight: '900', color: colors.text.muted, marginBottom: 4, textAlign: 'center' },
    signalDetailValue: {
        fontSize: fontSize.sm,
        fontWeight: '900',
        color: colors.white,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        textAlign: 'center',
    },
    executeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        backgroundColor: 'rgba(59,130,246,0.1)',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.3)',
    },
    executeButtonText: {
        fontSize: 10,
        fontWeight: '900',
        color: colors.brand.primary,
        letterSpacing: 2,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activityLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
    activityIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityPair: { fontSize: fontSize.md, fontWeight: '900', color: colors.white, letterSpacing: -0.5 },
    activityTime: { fontSize: 10, color: colors.text.muted, fontWeight: '700', marginTop: 2 },
    activityProfit: {
        fontSize: fontSize.lg,
        fontWeight: '900',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontStyle: 'italic',
    },
    pipsSubLabel: { fontSize: 8, color: colors.text.muted, fontWeight: '900', letterSpacing: 1 },
    marqueeContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 8,
    },
    marqueeContent: { paddingHorizontal: spacing.lg, gap: spacing.xl },
    marqueeItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    marqueePair: { fontSize: 9, fontWeight: '900', color: colors.text.muted, letterSpacing: 0.5 },
    marqueePrice: { fontSize: 11, fontWeight: 'bold', color: colors.white, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
    sentimentCard: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
    },
    sentimentContent: { marginTop: spacing.md },
    sentimentLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
    sentimentLabel: { fontSize: 10, fontWeight: '900' },
    sentimentBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' },
    sentimentBarFill: { height: '100%', backgroundColor: colors.success, borderRadius: 3 },
    sentimentText: { fontSize: 8, color: colors.text.muted, fontWeight: '800', textAlign: 'center', marginTop: spacing.sm, letterSpacing: 1 },

    // Drawer Styles
    menuButton: { padding: 4 },
    drawerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1000,
        flexDirection: 'row',
    },
    drawerContent: {
        width: '80%',
        height: '100%',
        backgroundColor: '#0D1117',
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.05)',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: spacing.lg,
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    drawerTitle: { color: colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    drawerNav: { flex: 1, gap: spacing.sm },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
    },
    drawerItemActive: { backgroundColor: 'rgba(59,130,246,0.1)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.2)' },
    drawerItemText: { color: colors.text.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    drawerItemTextActive: { color: colors.brand.primary, fontWeight: '900' },
    drawerFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        marginBottom: 30,
    },
    logoutText: { color: colors.error, fontSize: 11, fontWeight: '900', letterSpacing: 1 },

    // Intel Hub Styles
    intelHub: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.brand.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    intelGrid: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
    intelItem: { flex: 1, padding: spacing.md, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: borderRadius.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' },
    intelLabel: { fontSize: 8, fontWeight: '900', color: colors.text.muted, marginBottom: 4, letterSpacing: 1 },
    intelValue: { fontSize: 14, fontWeight: '900', letterSpacing: -0.5 },

    // News Section Styles (New Vertical Feed)
    newsVerticalList: { gap: spacing.md },
    loadingContainer: { height: 200, justifyContent: 'center', alignItems: 'center' },
    newsContainerEditorial: { gap: spacing.md },
    newsFeaturedCard: {
        height: 240,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        backgroundColor: colors.background.secondary,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    newsFeaturedImage: { width: '100%', height: '100%' },
    newsFeaturedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    newsFeaturedBadge: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: colors.error,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 10,
    },
    newsBadgeText: { color: colors.white, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
    newsFeaturedContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, zIndex: 10 },
    newsFeaturedTitle: { color: colors.white, fontSize: 18, fontWeight: '900', fontStyle: 'italic', lineHeight: 22, marginVertical: 6 },
    featuredSourceRow: { flexDirection: 'row', alignItems: 'center' },
    newsSourceTextPrimary: { color: colors.brand.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1, fontStyle: 'italic' },
    newsCardVertical: {
        flexDirection: 'row',
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        height: 100,
    },
    newsImageContainerVertical: { width: 100, height: '100%' },
    newsImage: { width: '100%', height: '100%' },
    newsImageOverlaySmall: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
    newsBadgeSmall: {
        position: 'absolute',
        top: 4,
        left: 4,
        backgroundColor: colors.brand.primary,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 2,
        zIndex: 10,
    },
    newsBadgeTextSmall: { color: colors.white, fontSize: 6, fontWeight: '900' },
    newsContentVertical: { flex: 1, padding: spacing.md, justifyContent: 'center' },
    newsHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
    newsTitleVertical: { color: colors.white, fontSize: 10, fontWeight: '800', lineHeight: 14, fontStyle: 'italic', marginBottom: 2 },
    newsBodySmall: { color: colors.text.muted, fontSize: 8, fontWeight: '600' },
    newsTime: { color: colors.text.muted, fontSize: 7, fontWeight: '700', letterSpacing: 0.5 },

    // Plans Styles
    plansContainer: { paddingBottom: 50 },
    plansHeader: { alignItems: 'center', marginBottom: spacing.xl },
    institutionalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(59,130,246,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.2)',
    },
    institutionalBadgeText: { color: colors.brand.primary, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
    plansTitle: { color: colors.white, fontSize: 24, fontWeight: '900', fontStyle: 'italic', textAlign: 'center', letterSpacing: -1 },
    plansSubtitle: { color: colors.text.muted, fontSize: 10, textAlign: 'center', marginTop: 8, letterSpacing: 0.5, fontWeight: '700' },
    planCard: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        position: 'relative',
        overflow: 'hidden',
    },
    planCardActive: { borderColor: colors.brand.primary, backgroundColor: '#161920', elevation: 5, shadowColor: colors.brand.primary, shadowOpacity: 0.1, shadowRadius: 20 },
    activePlanBadge: { position: 'absolute', top: 20, right: 20, backgroundColor: colors.brand.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    activePlanBadgeText: { color: colors.white, fontSize: 7, fontWeight: '900', fontStyle: 'italic' },
    planHeader: { marginBottom: spacing.lg },
    planTierBox: { backgroundColor: 'rgba(255,255,255,0.03)', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 8 },
    planTierText: { color: colors.text.muted, fontSize: 7, fontWeight: '900', letterSpacing: 1 },
    planName: { color: colors.white, fontSize: 20, fontWeight: '900', fontStyle: 'italic' },
    planPriceBox: { flexDirection: 'row', alignItems: 'baseline', gap: 2, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', marginBottom: spacing.lg },
    planCurrency: { color: colors.text.muted, fontSize: 14, fontWeight: '900', fontStyle: 'italic' },
    planPrice: { color: colors.white, fontSize: 48, fontWeight: '900', fontStyle: 'italic', letterSpacing: -2 },
    planPeriod: { color: colors.text.muted, fontSize: 10, fontWeight: '900' },
    planFeatures: { gap: spacing.md, marginBottom: spacing.xl },
    planFeatureItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    planFeatureText: { color: colors.text.secondary, fontSize: 11, fontWeight: '800', fontStyle: 'italic' },
    planButton: { width: '100%', paddingVertical: 16, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center' },
    planButtonActivate: { backgroundColor: colors.brand.primary },
    planButtonSync: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    planButtonText: { fontSize: 10, fontWeight: '900', letterSpacing: 2, fontStyle: 'italic' },
    planButtonTextActivate: { color: colors.white },
    planButtonTextSync: { color: colors.text.muted },

    // Academy Styles
    academyContainer: { paddingBottom: 50, flex: 1, justifyContent: 'center', paddingTop: 40 },
    academyLockedBox: {
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        paddingVertical: 50,
        borderStyle: 'dashed',
    },
    lockIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(59,130,246,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    academyTitle: { color: colors.white, fontSize: 18, fontWeight: '900', fontStyle: 'italic', marginBottom: 10 },
    securityBadge: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 6,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    securityBadgeText: { color: colors.text.muted, fontSize: 8, fontWeight: '900', letterSpacing: 4 },
    academyDescription: {
        color: colors.text.muted,
        fontSize: 10,
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: '700',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    academyButton: {
        backgroundColor: colors.brand.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: borderRadius.lg,
    },
    academyButtonText: { color: colors.white, fontSize: 9, fontWeight: '900', letterSpacing: 2, fontStyle: 'italic' },
    academyFooter: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 40, opacity: 0.5 },

    // Economic Calendar Toggle Styles
    weekToggle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 2,
        borderRadius: 8,
    },
    weekButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    weekButtonActive: {
        backgroundColor: colors.brand.primary,
    },
    weekButtonText: {
        fontSize: 8,
        fontWeight: '900',
        color: colors.text.muted,
    },
    textWhite: {
        color: colors.white,
    },
});
