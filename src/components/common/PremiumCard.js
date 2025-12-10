/**
 * PremiumCard - Card com design premium
 * 
 * Features:
 * - Sombras suaves
 * - Suporte a header com avatar
 * - Animação de pressão
 * - Variantes: default, outlined, elevated
 */
import React from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function PremiumCard({
    children,
    style,
    variant = 'default', // 'default' | 'outlined' | 'elevated'
    onPress,
    disabled = false,
    padding = 'md', // 'none' | 'sm' | 'md' | 'lg'
}) {
    const { colors, shadows, spacing, borderRadius } = useTheme();
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (onPress && !disabled) {
            Animated.spring(scaleAnim, {
                toValue: 0.98,
                useNativeDriver: true,
                friction: 8,
            }).start();
        }
    };

    const handlePressOut = () => {
        if (onPress && !disabled) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 8,
            }).start();
        }
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: colors.border,
                };
            case 'elevated':
                return {
                    backgroundColor: colors.surface,
                    ...shadows.large,
                };
            default:
                return {
                    backgroundColor: colors.surface,
                    ...shadows.medium,
                };
        }
    };

    const getPadding = () => {
        const paddingMap = {
            none: 0,
            sm: spacing.sm,
            md: spacing.md,
            lg: spacing.lg,
        };
        return paddingMap[padding] || spacing.md;
    };

    const cardStyle = [
        styles.card,
        {
            borderRadius: borderRadius.lg,
            padding: getPadding(),
        },
        getVariantStyles(),
        disabled && { opacity: 0.6 },
        style,
    ];

    const content = (
        <Animated.View style={[cardStyle, { transform: [{ scale: scaleAnim }] }]}>
            {children}
        </Animated.View>
    );

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
            >
                {content}
            </Pressable>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
});
