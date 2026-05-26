/**
 * Sistema de Tema Premium - RotinaPlus
 * Design System com suporte a modo claro/escuro
 * 
 * Cores otimizadas para app de academia:
 * - Teal/Emerald: energia, saúde, fitness
 * - Blue: profissionalismo, confiança
 * - Amber/Orange: motivação, ação
 */
import { StyleSheet } from 'react-native';

// ============================================
// PALETA DE CORES - TEMA CLARO
// ============================================
export const lightColors = {
    // Cores primárias - Teal energético
    primary: '#0D9488',        // Teal-600: energia e saúde
    primaryDark: '#0F766E',    // Teal-700: hover/pressed
    primaryLight: '#14B8A6',   // Teal-500: highlights
    primarySurface: '#CCFBF1', // Teal-100: backgrounds sutis

    // Cores secundárias - Azul profissional
    secondary: '#2563EB',      // Blue-600: confiança
    secondaryDark: '#1D4ED8',  // Blue-700
    secondaryLight: '#3B82F6', // Blue-500

    // Cores de ação - Amber para CTAs
    accent: '#F59E0B',         // Amber-500: motivação
    accentDark: '#D97706',     // Amber-600
    accentLight: '#FBBF24',    // Amber-400

    // Status
    success: '#22C55E',        // Green-500
    successLight: '#DCFCE7',   // Green-100
    warning: '#F59E0B',        // Amber-500
    warningLight: '#FEF3C7',   // Amber-100
    danger: '#EF4444',         // Red-500
    dangerLight: '#FEE2E2',    // Red-100
    info: '#0EA5E9',           // Sky-500
    infoLight: '#E0F2FE',      // Sky-100

    // Backgrounds
    background: '#F8FAFC',     // Slate-50: fundo principal
    surface: '#FFFFFF',        // Branco: cards
    surfaceVariant: '#F1F5F9', // Slate-100: seções alternadas

    // Texto
    text: {
        primary: '#0F172A',    // Slate-900: texto principal
        secondary: '#475569',  // Slate-600: texto secundário
        disabled: '#94A3B8',   // Slate-400: desabilitado
        inverse: '#FFFFFF',    // Branco: texto em backgrounds escuros
        hint: '#CBD5E1',       // Slate-300: placeholders
    },

    // Bordas e divisores
    border: '#E2E8F0',         // Slate-200
    divider: '#E2E8F0',        // Slate-200

    // Overlay
    overlay: 'rgba(15, 23, 42, 0.5)', // Slate-900 com opacidade

    // Gradientes (como arrays para LinearGradient)
    gradientPrimary: ['#0D9488', '#0EA5E9'],    // Teal -> Sky
    gradientSecondary: ['#2563EB', '#7C3AED'],  // Blue -> Violet
    gradientAccent: ['#F59E0B', '#EF4444'],     // Amber -> Red
    gradientSuccess: ['#22C55E', '#0D9488'],    // Green -> Teal
};

// ============================================
// PALETA DE CORES - TEMA ESCURO
// ============================================
export const darkColors = {
    // Cores primárias - Teal mais vibrante no escuro
    primary: '#14B8A6',        // Teal-500
    primaryDark: '#0D9488',    // Teal-600
    primaryLight: '#2DD4BF',   // Teal-400
    primarySurface: '#134E4A', // Teal-900

    // Cores secundárias
    secondary: '#3B82F6',      // Blue-500
    secondaryDark: '#2563EB',  // Blue-600
    secondaryLight: '#60A5FA', // Blue-400

    // Cores de ação
    accent: '#FBBF24',         // Amber-400
    accentDark: '#F59E0B',     // Amber-500
    accentLight: '#FCD34D',    // Amber-300

    // Status (mais vibrantes no escuro)
    success: '#4ADE80',        // Green-400
    successLight: '#14532D',   // Green-900
    warning: '#FBBF24',        // Amber-400
    warningLight: '#78350F',   // Amber-900
    danger: '#F87171',         // Red-400
    dangerLight: '#7F1D1D',    // Red-900
    info: '#38BDF8',           // Sky-400
    infoLight: '#0C4A6E',      // Sky-900

    // Backgrounds
    background: '#0F172A',     // Slate-900: fundo principal
    surface: '#1E293B',        // Slate-800: cards
    surfaceVariant: '#334155', // Slate-700: seções alternadas

    // Texto
    text: {
        primary: '#F8FAFC',    // Slate-50: texto principal
        secondary: '#CBD5E1',  // Slate-300: texto secundário
        disabled: '#64748B',   // Slate-500: desabilitado
        inverse: '#0F172A',    // Slate-900: texto em backgrounds claros
        hint: '#475569',       // Slate-600: placeholders
    },

    // Bordas e divisores
    border: '#334155',         // Slate-700
    divider: '#334155',        // Slate-700

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Gradientes
    gradientPrimary: ['#14B8A6', '#38BDF8'],    // Teal -> Sky
    gradientSecondary: ['#3B82F6', '#8B5CF6'],  // Blue -> Violet
    gradientAccent: ['#FBBF24', '#F87171'],     // Amber -> Red
    gradientSuccess: ['#4ADE80', '#14B8A6'],    // Green -> Teal
};

// ============================================
// ESPAÇAMENTOS
// ============================================
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

// ============================================
// TIPOGRAFIA
// ============================================
export const typography = {
    // Títulos
    h1: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 26,
        fontWeight: '700',
        lineHeight: 34,
        letterSpacing: -0.3,
    },
    h3: {
        fontSize: 22,
        fontWeight: '600',
        lineHeight: 30,
    },
    h4: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 26,
    },
    // Corpo
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    bodyMedium: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },
    // Caption e labels
    caption: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
        letterSpacing: 0.3,
    },
    button: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        letterSpacing: 0.5,
    },
};

// ============================================
// BORDAS ARREDONDADAS
// ============================================
export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

// ============================================
// SOMBRAS
// ============================================
export const createShadows = (isDark) => ({
    small: {
        shadowColor: isDark ? '#000' : '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    medium: {
        shadowColor: isDark ? '#000' : '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: isDark ? '#000' : '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.5 : 0.16,
        shadowRadius: 16,
        elevation: 8,
    },
    // Sombra especial para FABs
    fab: {
        shadowColor: isDark ? '#14B8A6' : '#0D9488',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
});

// ============================================
// ANIMAÇÕES
// ============================================
export const animations = {
    duration: {
        fast: 150,
        normal: 250,
        slow: 400,
    },
    easing: {
        // Valores para Animated.timing
        standard: { useNativeDriver: true },
    },
};

// ============================================
// FUNÇÃO PARA CRIAR ESTILOS GLOBAIS
// ============================================
export const createGlobalStyles = (colors, shadows) => StyleSheet.create({
    // ========== CONTAINERS ==========
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    containerPadded: {
        flex: 1,
        padding: spacing.md,
        backgroundColor: colors.background,
    },
    containerCentered: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },

    // ========== SURFACES ==========
    surface: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...shadows.medium,
    },
    surfaceFlat: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },

    // ========== CARDS ==========
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.medium,
    },
    cardCompact: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.small,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    cardTitle: {
        ...typography.h4,
        color: colors.text.primary,
        flex: 1,
    },

    // ========== TÍTULOS ==========
    title: {
        ...typography.h2,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    subtitle: {
        ...typography.h4,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        ...typography.label,
        color: colors.text.secondary,
        textTransform: 'uppercase',
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },

    // ========== TEXTO ==========
    text: {
        ...typography.body,
        color: colors.text.primary,
    },
    textSecondary: {
        ...typography.bodySmall,
        color: colors.text.secondary,
    },
    textMuted: {
        ...typography.caption,
        color: colors.text.disabled,
    },
    textSuccess: {
        ...typography.body,
        color: colors.success,
    },
    textDanger: {
        ...typography.body,
        color: colors.danger,
    },

    // ========== INPUTS ==========
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...typography.body,
        color: colors.text.primary,
    },
    inputFocused: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    inputError: {
        borderColor: colors.danger,
    },
    inputLabel: {
        ...typography.label,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },

    // ========== BOTÕES ==========
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        minHeight: 52,
    },
    buttonText: {
        ...typography.button,
        color: colors.text.inverse,
    },
    buttonOutline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: borderRadius.md,
        minHeight: 52,
    },
    buttonOutlineText: {
        ...typography.button,
        color: colors.primary,
    },
    buttonSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.surfaceVariant,
        borderRadius: borderRadius.md,
        minHeight: 52,
    },
    buttonSecondaryText: {
        ...typography.button,
        color: colors.text.primary,
    },
    buttonDanger: {
        backgroundColor: colors.danger,
    },
    buttonDisabled: {
        backgroundColor: colors.border,
    },
    buttonDisabledText: {
        color: colors.text.disabled,
    },

    // ========== FAB ==========
    fab: {
        position: 'absolute',
        bottom: spacing.lg,
        right: spacing.lg,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.fab,
    },
    fabMini: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },

    // ========== LISTAS ==========
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    listItemContent: {
        flex: 1,
        marginLeft: spacing.md,
    },
    listText: {
        ...typography.body,
        color: colors.text.primary,
    },

    // ========== DIVIDERS ==========
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginVertical: spacing.md,
    },
    dividerLight: {
        height: 1,
        backgroundColor: colors.divider,
        marginVertical: spacing.sm,
        opacity: 0.5,
    },

    // ========== CHIPS/BADGES ==========
    chip: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.primarySurface,
        borderRadius: borderRadius.full,
    },
    chipText: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: '600',
    },
    badge: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.danger,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xs,
    },
    badgeText: {
        ...typography.caption,
        color: colors.text.inverse,
        fontWeight: '700',
    },

    // ========== AVATARS ==========
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarLarge: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    avatarSmall: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    avatarText: {
        ...typography.h4,
        color: colors.text.inverse,
    },

    // ========== LAYOUT HELPERS ==========
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowSpaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex1: {
        flex: 1,
    },

    // ========== EMPTY STATE ==========
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    emptyStateIcon: {
        marginBottom: spacing.md,
        opacity: 0.5,
    },
    emptyStateTitle: {
        ...typography.h4,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptyStateText: {
        ...typography.body,
        color: colors.text.disabled,
        textAlign: 'center',
    },

    // ========== MODAL ==========
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        ...shadows.large,
    },
    modalTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },

    // ========== SEARCH BAR ==========
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceVariant,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        height: 48,
    },
    searchInput: {
        flex: 1,
        ...typography.body,
        color: colors.text.primary,
        marginLeft: spacing.sm,
    },
});

// ============================================
// TEMA PADRÃO (LIGHT)
// ============================================
export const colors = lightColors;
export const shadows = createShadows(false);
export const globalStyles = createGlobalStyles(lightColors, shadows);

// ============================================
// EXPORT DEFAULT
// ============================================
export default {
    lightColors,
    darkColors,
    spacing,
    typography,
    borderRadius,
    createShadows,
    createGlobalStyles,
    animations,
    // Defaults
    colors: lightColors,
    shadows: createShadows(false),
    globalStyles: createGlobalStyles(lightColors, createShadows(false)),
};
