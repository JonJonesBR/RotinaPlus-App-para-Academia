/**
 * Chip - Componente de chip/tag
 * 
 * Features:
 * - Variantes: default, selected, outline
 * - Ícone opcional
 * - Removível
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function Chip({
    label,
    icon,
    selected = false,
    variant = 'default', // 'default' | 'outline'
    onPress,
    onRemove,
    size = 'md', // 'sm' | 'md'
    style,
}) {
    const { colors, borderRadius } = useTheme();

    const getStyles = () => {
        const isSelected = selected || variant === 'selected';

        if (isSelected) {
            return {
                container: {
                    backgroundColor: colors.primary,
                },
                text: {
                    color: colors.text.inverse,
                },
                iconColor: colors.text.inverse,
            };
        }

        if (variant === 'outline') {
            return {
                container: {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: colors.border,
                },
                text: {
                    color: colors.text.primary,
                },
                iconColor: colors.text.secondary,
            };
        }

        return {
            container: {
                backgroundColor: colors.surfaceVariant,
            },
            text: {
                color: colors.text.primary,
            },
            iconColor: colors.text.secondary,
        };
    };

    const getSizeStyles = () => {
        if (size === 'sm') {
            return {
                paddingVertical: 4,
                paddingHorizontal: 10,
                fontSize: 12,
                iconSize: 14,
            };
        }
        return {
            paddingVertical: 6,
            paddingHorizontal: 12,
            fontSize: 14,
            iconSize: 16,
        };
    };

    const variantStyles = getStyles();
    const sizeStyles = getSizeStyles();

    const containerStyle = [
        styles.container,
        {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            borderRadius: borderRadius.full,
        },
        variantStyles.container,
        style,
    ];

    const textStyle = [
        styles.text,
        {
            fontSize: sizeStyles.fontSize,
        },
        variantStyles.text,
    ];

    const content = (
        <View style={containerStyle}>
            {icon && (
                <Icon
                    name={icon}
                    size={sizeStyles.iconSize}
                    color={variantStyles.iconColor}
                    style={styles.icon}
                />
            )}
            <Text style={textStyle}>{label}</Text>
            {onRemove && (
                <Pressable onPress={onRemove} style={styles.removeButton}>
                    <Icon
                        name="close"
                        size={sizeStyles.iconSize}
                        color={variantStyles.iconColor}
                    />
                </Pressable>
            )}
        </View>
    );

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => pressed && { opacity: 0.7 }}
            >
                {content}
            </Pressable>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    text: {
        fontWeight: '500',
    },
    icon: {
        marginRight: 4,
    },
    removeButton: {
        marginLeft: 4,
    },
});
