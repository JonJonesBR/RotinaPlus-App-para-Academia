/**
 * EmptyState - Componente para estados vazios
 * 
 * Features:
 * - Ícone grande
 * - Título e descrição
 * - Botão de ação opcional
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import PremiumButton from './PremiumButton';

export default function EmptyState({
    icon = 'inbox',
    title = 'Nada por aqui',
    description,
    actionLabel,
    onAction,
    style,
}) {
    const { colors, typography, spacing } = useTheme();

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.surfaceVariant }]}>
                <Icon
                    name={icon}
                    size={48}
                    color={colors.text.disabled}
                />
            </View>

            <Text style={[styles.title, { color: colors.text.secondary }]}>
                {title}
            </Text>

            {description && (
                <Text style={[styles.description, { color: colors.text.disabled }]}>
                    {description}
                </Text>
            )}

            {actionLabel && onAction && (
                <PremiumButton
                    title={actionLabel}
                    onPress={onAction}
                    variant="primary"
                    size="md"
                    style={styles.button}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 280,
    },
    button: {
        marginTop: 24,
    },
});
