/**
 * SectionHeader - Título de seção estilizado
 * 
 * Features:
 * - Título com linha decorativa
 * - Ação opcional à direita
 * - Ícone opcional
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function SectionHeader({
    title,
    icon,
    action,
    actionIcon = 'chevron-right',
    onAction,
    style,
}) {
    const { colors, typography, spacing } = useTheme();

    return (
        <View style={[styles.container, style]}>
            <View style={styles.left}>
                {icon && (
                    <Icon
                        name={icon}
                        size={20}
                        color={colors.primary}
                        style={styles.icon}
                    />
                )}
                <Text style={[styles.title, { color: colors.text.secondary }]}>
                    {title}
                </Text>
            </View>

            {(action || onAction) && (
                <Pressable
                    onPress={onAction}
                    style={({ pressed }) => [
                        styles.action,
                        pressed && { opacity: 0.7 },
                    ]}
                >
                    {action && (
                        <Text style={[styles.actionText, { color: colors.primary }]}>
                            {action}
                        </Text>
                    )}
                    {onAction && (
                        <Icon
                            name={actionIcon}
                            size={20}
                            color={colors.primary}
                        />
                    )}
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 12,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
        marginRight: 4,
    },
});
