/**
 * ThemeToggle - Botão para alternar entre temas
 * 
 * Features:
 * - Toggle entre claro/escuro
 * - Animação suave
 * - Ícone dinâmico
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme, ThemeMode } from '../../theme/ThemeContext';

export default function ThemeToggle({
    showLabel = false,
    size = 'md', // 'sm' | 'md' | 'lg'
    style,
}) {
    const { colors, isDark, themeMode, setTheme, toggleTheme, borderRadius } = useTheme();
    const rotateAnim = React.useRef(new Animated.Value(isDark ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.spring(rotateAnim, {
            toValue: isDark ? 1 : 0,
            useNativeDriver: true,
            friction: 8,
        }).start();
    }, [isDark]);

    const getSizeStyles = () => {
        const sizes = {
            sm: { button: 36, icon: 18 },
            md: { button: 44, icon: 22 },
            lg: { button: 52, icon: 26 },
        };
        return sizes[size] || sizes.md;
    };

    const sizeStyles = getSizeStyles();

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const buttonStyle = [
        styles.button,
        {
            width: sizeStyles.button,
            height: sizeStyles.button,
            borderRadius: sizeStyles.button / 2,
            backgroundColor: colors.surfaceVariant,
        },
        style,
    ];

    return (
        <View style={styles.container}>
            <Pressable
                onPress={toggleTheme}
                style={({ pressed }) => [
                    buttonStyle,
                    pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                ]}
            >
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <Icon
                        name={isDark ? 'dark-mode' : 'light-mode'}
                        size={sizeStyles.icon}
                        color={isDark ? colors.accent : colors.primary}
                    />
                </Animated.View>
            </Pressable>

            {showLabel && (
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                    {isDark ? 'Escuro' : 'Claro'}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
});
