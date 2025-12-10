/**
 * PremiumButton - Botão com design premium
 * 
 * Features:
 * - Variantes: primary, secondary, outline, ghost, danger
 * - Tamanhos: sm, md, lg
 * - Ícone à esquerda ou direita
 * - Estado de loading
 * - Animação de pressão
 */
import React from 'react';
import {
    StyleSheet,
    Pressable,
    Text,
    View,
    ActivityIndicator,
    Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function PremiumButton({
    title,
    onPress,
    variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size = 'md', // 'sm' | 'md' | 'lg'
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    style,
}) {
    const { colors, typography, spacing, borderRadius } = useTheme();
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
            friction: 8,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
        }).start();
    };

    const getSizeStyles = () => {
        const sizes = {
            sm: {
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                minHeight: 40,
                fontSize: 14,
                iconSize: 18,
            },
            md: {
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                minHeight: 52,
                fontSize: 16,
                iconSize: 20,
            },
            lg: {
                paddingVertical: spacing.md + 4,
                paddingHorizontal: spacing.xl,
                minHeight: 60,
                fontSize: 18,
                iconSize: 24,
            },
        };
        return sizes[size] || sizes.md;
    };

    const getVariantStyles = () => {
        const variants = {
            primary: {
                container: {
                    backgroundColor: colors.primary,
                },
                text: {
                    color: colors.text.inverse,
                },
                iconColor: colors.text.inverse,
            },
            secondary: {
                container: {
                    backgroundColor: colors.surfaceVariant,
                },
                text: {
                    color: colors.text.primary,
                },
                iconColor: colors.text.primary,
            },
            outline: {
                container: {
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: colors.primary,
                },
                text: {
                    color: colors.primary,
                },
                iconColor: colors.primary,
            },
            ghost: {
                container: {
                    backgroundColor: 'transparent',
                },
                text: {
                    color: colors.primary,
                },
                iconColor: colors.primary,
            },
            danger: {
                container: {
                    backgroundColor: colors.danger,
                },
                text: {
                    color: colors.text.inverse,
                },
                iconColor: colors.text.inverse,
            },
        };
        return variants[variant] || variants.primary;
    };

    const sizeStyles = getSizeStyles();
    const variantStyles = getVariantStyles();
    const isDisabled = disabled || loading;

    const buttonStyle = [
        styles.button,
        {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            minHeight: sizeStyles.minHeight,
            borderRadius: borderRadius.md,
        },
        variantStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && { opacity: 0.5 },
        style,
    ];

    const textStyle = [
        styles.text,
        {
            fontSize: sizeStyles.fontSize,
            fontWeight: '600',
        },
        variantStyles.text,
    ];

    const renderIcon = (position) => {
        if (!icon || iconPosition !== position || loading) return null;

        return (
            <Icon
                name={icon}
                size={sizeStyles.iconSize}
                color={variantStyles.iconColor}
                style={position === 'left' ? styles.iconLeft : styles.iconRight}
            />
        );
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isDisabled}
        >
            <Animated.View style={[buttonStyle, { transform: [{ scale: scaleAnim }] }]}>
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={variantStyles.iconColor}
                    />
                ) : (
                    <View style={styles.content}>
                        {renderIcon('left')}
                        <Text style={textStyle}>{title}</Text>
                        {renderIcon('right')}
                    </View>
                )}
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    fullWidth: {
        width: '100%',
    },
});
