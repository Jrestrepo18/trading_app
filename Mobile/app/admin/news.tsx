import React, { useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, Alert, Image
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

export default function AdminNews() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        category: 'Market',
        content: '',
        imageUrl: '',
        priority: 'Normal'
    });

    const handlePublishNews = async () => {
        if (!form.title || !form.content) {
            Alert.alert('Error', 'Por favor completa el título y el contenido.');
            return;
        }

        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setLoading(false);

        Alert.alert('Éxito', 'Noticia publicada globalmente.');
        router.back();
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
                        <Text style={styles.headerTitle}>NUEVA_<Text style={{ color: colors.brand.primary }}>NOTICIA</Text></Text>
                        <Text style={styles.headerSubtitle}>Publicación flash de mercado</Text>
                    </View>
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {/* Category Selection */}
                    <View style={styles.formSection}>
                        <Text style={styles.label}>CATEGORÍA</Text>
                        <View style={styles.categoryRow}>
                            {['Market', 'Signal', 'Global', 'Elite'].map(c => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.catButton, form.category === c && styles.catButtonActive]}
                                    onPress={() => setForm({ ...form, category: c })}
                                >
                                    <Text style={[styles.catButtonText, form.category === c && styles.textWhite]}>{c.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Title & Image */}
                    <View style={styles.formSection}>
                        <Text style={styles.label}>TÍTULO DE LA NOTICIA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Impulso alcista en el Oro por datos económicos..."
                            placeholderTextColor={colors.text.muted}
                            value={form.title}
                            onChangeText={(text) => setForm({ ...form, title: text })}
                        />

                        <Text style={[styles.label, { marginTop: spacing.lg }]}>URL DE LA IMAGEN (OPCIONAL)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://..."
                            placeholderTextColor={colors.text.muted}
                            value={form.imageUrl}
                            onChangeText={(text) => setForm({ ...form, imageUrl: text })}
                        />
                        {form.imageUrl ? (
                            <View style={styles.imagePreview}>
                                <Image source={{ uri: form.imageUrl }} style={styles.previewImg} />
                            </View>
                        ) : null}
                    </View>

                    {/* Content */}
                    <View style={styles.formSection}>
                        <Text style={styles.label}>CONTENIDO EXTENDIDO</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Escribe aquí el cuerpo de la noticia o reporte..."
                            placeholderTextColor={colors.text.muted}
                            multiline
                            numberOfLines={8}
                            value={form.content}
                            onChangeText={(text) => setForm({ ...form, content: text })}
                        />
                    </View>

                    {/* Priority */}
                    <View style={styles.formSection}>
                        <Text style={styles.label}>PRIORIDAD DE NOTIFICACIÓN</Text>
                        <View style={styles.riskRow}>
                            {['Normal', 'Urgent', 'Critical'].map(p => (
                                <TouchableOpacity
                                    key={p}
                                    style={[styles.riskButton, form.priority === p && { backgroundColor: p === 'Critical' ? colors.error : colors.brand.primary, borderColor: p === 'Critical' ? colors.error : colors.brand.primary }]}
                                    onPress={() => setForm({ ...form, priority: p })}
                                >
                                    <Text style={[styles.riskButtonText, form.priority === p && styles.textWhite]}>{p.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.disabledButton]}
                        onPress={handlePublishNews}
                        disabled={loading}
                    >
                        {loading ? (
                            <Text style={styles.submitButtonText}>PUBLICANDO...</Text>
                        ) : (
                            <>
                                <Ionicons name="megaphone" size={20} color={colors.white} />
                                <Text style={styles.submitButtonText}>LANZAR FLASH_NEWS</Text>
                            </>
                        )}
                    </TouchableOpacity>
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
    textArea: { height: 160, textAlignVertical: 'top' },
    categoryRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    catButton: {
        flex: 1,
        minWidth: '45%',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    catButtonActive: { backgroundColor: colors.brand.primary, borderColor: colors.brand.primary },
    catButtonText: { fontSize: 10, fontWeight: '900', color: colors.text.muted },
    textWhite: { color: colors.white },
    riskRow: { flexDirection: 'row', gap: spacing.sm },
    riskButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    riskButtonText: { fontSize: 10, fontWeight: '900', color: colors.text.muted },
    imagePreview: { marginTop: spacing.md, height: 120, borderRadius: borderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
    previewImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        backgroundColor: '#a855f7', // Purple for news
        paddingVertical: spacing.xl,
        borderRadius: borderRadius.xl,
        marginTop: spacing.md,
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    disabledButton: { opacity: 0.6 },
    submitButtonText: { color: colors.white, fontSize: fontSize.md, fontWeight: '900', fontStyle: 'italic' },
});
