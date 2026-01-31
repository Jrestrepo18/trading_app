import React, { useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, Alert, Share, Clipboard
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';
import useAuthStore from '../../stores/authStore';
import { ENDPOINTS } from '../../constants/api';

export default function AdminSignals() {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState({
        pair: '',
        type: 'BUY',
        orderType: 'MARKET', // MARKET, BUY_LIMIT, SELL_LIMIT
        entry: '',
        tp1: '',
        tp2: '',
        tp3: '',
        sl: '',
        risk: 'Medium',
        notes: ''
    });

    // Generate copyable signal text
    const generateCopyableSignal = () => {
        const lines = [
            `🔔 ${form.pair}`,
            `📊 ${form.type}${form.orderType !== 'MARKET' ? ` ${form.orderType.replace('_', ' ')}` : ''}`,
            `🎯 Entrada: ${form.entry}`,
            `🛑 SL: ${form.sl}`,
        ];
        if (form.tp1) lines.push(`✅ T1: ${form.tp1}`);
        if (form.tp2) lines.push(`✅ T2: ${form.tp2}`);
        if (form.tp3) lines.push(`✅ T3: ${form.tp3}`);
        if (form.notes) lines.push(`📝 ${form.notes}`);
        return lines.join('\n');
    };

    const handleCopySignal = () => {
        Clipboard.setString(generateCopyableSignal());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareSignal = async () => {
        try {
            await Share.share({
                message: generateCopyableSignal(),
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendSignal = async () => {
        if (!form.pair || !form.entry || !form.sl) {
            Alert.alert('Error', 'Por favor completa Activo, Entrada y Stop Loss.');
            return;
        }

        const { user } = useAuthStore.getState();
        if (!user || user.role !== 'admin') {
            Alert.alert('Error', 'No tienes permisos para esta acción.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(ENDPOINTS.ADMIN.SIGNALS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Id': user.uid
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Éxito', `Señal emitida. Notificaciones enviadas: ${data.notificationsSent}`);
                router.back();
            } else {
                throw new Error(data.error || 'Error al emitir señal.');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>NUEVA_<Text style={{ color: colors.brand.primary }}>SEÑAL</Text></Text>
                        <Text style={styles.headerSubtitle}>Emisión de alerta institucional</Text>
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {/* Pair & Type Selection */}
                    <View style={styles.formSection}>
                        <Text style={styles.label}>ACTIVO / PAR</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: XAU/USD o BTC/USDT"
                            placeholderTextColor={colors.text.muted}
                            value={form.pair}
                            onChangeText={(text) => setForm({ ...form, pair: text.toUpperCase() })}
                        />

                        <Text style={styles.label}>TIPO DE OPERACIÓN</Text>
                        <View style={styles.typeRow}>
                            <TouchableOpacity
                                style={[styles.typeButton, form.type === 'BUY' && styles.buyButtonActive]}
                                onPress={() => setForm({ ...form, type: 'BUY' })}
                            >
                                <Ionicons name="trending-up" size={18} color={form.type === 'BUY' ? colors.white : colors.success} />
                                <Text style={[styles.typeButtonText, form.type === 'BUY' && styles.textWhite]}>COMPRA</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.typeButton, form.type === 'SELL' && styles.sellButtonActive]}
                                onPress={() => setForm({ ...form, type: 'SELL' })}
                            >
                                <Ionicons name="trending-down" size={18} color={form.type === 'SELL' ? colors.white : colors.error} />
                                <Text style={[styles.typeButtonText, form.type === 'SELL' && styles.textWhite]}>VENTA</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>TIPO DE ORDEN</Text>
                        <View style={styles.orderTypeRow}>
                            {['MARKET', 'BUY_LIMIT', 'SELL_LIMIT'].map(ot => (
                                <TouchableOpacity
                                    key={ot}
                                    style={[
                                        styles.orderTypeButton,
                                        form.orderType === ot && (
                                            ot === 'MARKET' ? styles.marketButtonActive :
                                                ot === 'BUY_LIMIT' ? styles.buyLimitActive :
                                                    styles.sellLimitActive
                                        )
                                    ]}
                                    onPress={() => setForm({ ...form, orderType: ot })}
                                >
                                    <Text style={[styles.orderTypeText, form.orderType === ot && styles.textWhite]}>
                                        {ot.replace('_', ' ')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Entry/SL Grid */}
                    <View style={styles.formSection}>
                        <View style={styles.inputRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>PRECIO ENTRADA</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0.0000"
                                    placeholderTextColor={colors.text.muted}
                                    keyboardType="numeric"
                                    value={form.entry}
                                    onChangeText={(text) => setForm({ ...form, entry: text })}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, { color: colors.error }]}>STOP LOSS</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: `${colors.error}30` }]}
                                    placeholder="0.0000"
                                    placeholderTextColor={colors.text.muted}
                                    keyboardType="numeric"
                                    value={form.sl}
                                    onChangeText={(text) => setForm({ ...form, sl: text })}
                                />
                            </View>
                        </View>

                        {/* Take Profits T1, T2, T3 */}
                        <Text style={[styles.label, { color: colors.success }]}>TAKE PROFITS</Text>
                        <View style={styles.tpRow}>
                            <View style={styles.tpItem}>
                                <Text style={styles.tpLabel}>T1</Text>
                                <TextInput
                                    style={[styles.input, styles.tpInput]}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.text.muted}
                                    keyboardType="numeric"
                                    value={form.tp1}
                                    onChangeText={(text) => setForm({ ...form, tp1: text })}
                                />
                            </View>
                            <View style={styles.tpItem}>
                                <Text style={styles.tpLabel}>T2</Text>
                                <TextInput
                                    style={[styles.input, styles.tpInput]}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.text.muted}
                                    keyboardType="numeric"
                                    value={form.tp2}
                                    onChangeText={(text) => setForm({ ...form, tp2: text })}
                                />
                            </View>
                            <View style={styles.tpItem}>
                                <Text style={styles.tpLabel}>T3</Text>
                                <TextInput
                                    style={[styles.input, styles.tpInput]}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.text.muted}
                                    keyboardType="numeric"
                                    value={form.tp3}
                                    onChangeText={(text) => setForm({ ...form, tp3: text })}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Risk & Notes */}
                    <View style={styles.formSection}>
                        <Text style={styles.label}>NIVEL DE RIESGO</Text>
                        <View style={styles.riskRow}>
                            {['Low', 'Medium', 'High'].map(r => (
                                <TouchableOpacity
                                    key={r}
                                    style={[styles.riskButton, form.risk === r && styles.riskButtonActive]}
                                    onPress={() => setForm({ ...form, risk: r })}
                                >
                                    <Text style={[styles.riskButtonText, form.risk === r && styles.textWhite]}>{r.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>NOTAS ADICIONALES (OPCIONAL)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Analisis tecnico o comentarios..."
                            placeholderTextColor={colors.text.muted}
                            multiline
                            numberOfLines={4}
                            value={form.notes}
                            onChangeText={(text) => setForm({ ...form, notes: text })}
                        />
                    </View>

                    {/* Copyable Signal Preview */}
                    {form.pair && form.entry && form.sl && (
                        <View style={styles.previewSection}>
                            <View style={styles.previewHeader}>
                                <Text style={styles.label}>VISTA PREVIA</Text>
                                <View style={styles.previewActions}>
                                    <TouchableOpacity onPress={handleCopySignal} style={styles.copyButton}>
                                        <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color={copied ? colors.success : colors.brand.primary} />
                                        <Text style={[styles.copyButtonText, copied && { color: colors.success }]}>
                                            {copied ? 'Copiado!' : 'Copiar'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleShareSignal} style={styles.shareButton}>
                                        <Ionicons name="share-outline" size={16} color={colors.brand.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.previewBox}>
                                <Text style={styles.previewText}>{generateCopyableSignal()}</Text>
                            </View>
                        </View>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.disabledButton]}
                        onPress={handleSendSignal}
                        disabled={loading}
                    >
                        {loading ? (
                            <Text style={styles.submitButtonText}>PROCESANDO...</Text>
                        ) : (
                            <>
                                <Ionicons name="paper-plane" size={20} color={colors.white} />
                                <Text style={styles.submitButtonText}>EMITIR SEÑAL GLOBAL</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.disclaimerText}>
                        Al emitir esta señal, se enviarán notificaciones push automáticas a todos los usuarios activos según su nivel de suscripción.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
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
    content: { flex: 1 },
    contentContainer: { padding: spacing.lg, paddingBottom: 40 },
    formSection: { marginBottom: spacing.xl },
    label: { fontSize: 10, fontWeight: '900', color: colors.text.muted, marginBottom: spacing.sm, letterSpacing: 1 },
    input: {
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        color: colors.white,
        fontSize: fontSize.sm,
        fontWeight: '600',
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    typeRow: { flexDirection: 'row', gap: spacing.md },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background.secondary,
    },
    buyButtonActive: { backgroundColor: colors.success, borderColor: colors.success },
    sellButtonActive: { backgroundColor: colors.error, borderColor: colors.error },
    typeButtonText: { fontSize: 12, fontWeight: '900' },
    textWhite: { color: colors.white },
    inputRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
    riskRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
    riskButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    riskButtonActive: { backgroundColor: colors.brand.primary, borderColor: colors.brand.primary },
    riskButtonText: { fontSize: 10, fontWeight: '900', color: colors.text.muted },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        backgroundColor: colors.brand.primary,
        paddingVertical: spacing.xl,
        borderRadius: borderRadius.xl,
        marginTop: spacing.md,
        shadowColor: colors.brand.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    disabledButton: { opacity: 0.6 },
    submitButtonText: { color: colors.white, fontSize: fontSize.md, fontWeight: '900', fontStyle: 'italic' },
    disclaimerText: {
        fontSize: 10,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: spacing.xl,
        lineHeight: 16,
        paddingHorizontal: spacing.lg,
    },
    // Order Type Styles
    orderTypeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
    orderTypeButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    orderTypeText: { fontSize: 9, fontWeight: '900', color: colors.text.muted },
    marketButtonActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
    buyLimitActive: { backgroundColor: colors.success, borderColor: colors.success },
    sellLimitActive: { backgroundColor: colors.error, borderColor: colors.error },
    // Take Profit Styles
    tpRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
    tpItem: { flex: 1 },
    tpLabel: { fontSize: 10, fontWeight: '900', color: colors.success, marginBottom: 4, textAlign: 'center' },
    tpInput: { textAlign: 'center', borderColor: `${colors.success}30` },
    // Preview Section Styles
    previewSection: { marginBottom: spacing.xl },
    previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    previewActions: { flexDirection: 'row', gap: spacing.sm },
    copyButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    copyButtonText: { fontSize: 10, fontWeight: '700', color: colors.brand.primary },
    shareButton: { padding: 4 },
    previewBox: {
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
    },
    previewText: { fontSize: 12, color: colors.text.secondary, lineHeight: 20, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
