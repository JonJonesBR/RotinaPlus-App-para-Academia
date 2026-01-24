/**
 * SearchBar - Barra de busca estilizada
 * 
 * Features:
 * - Ícone de busca
 * - Botão de limpar
 * - Animação suave
 */
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function SearchBar({
    value,
    onChangeText,
    placeholder = 'Buscar...',
    onFocus,
    onBlur,
    style,
}) {
    const { colors, borderRadius, spacing } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const focusAnim = React.useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(focusAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(focusAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
        onBlur?.();
    };

    const handleClear = () => {
        onChangeText?.('');
    };

    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.border, colors.primary],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceVariant,
                    borderRadius: borderRadius.full,
                    borderWidth: 2,
                    borderColor,
                },
                style,
            ]}
        >
            <Icon
                name="search"
                size={22}
                color={isFocused ? colors.primary : colors.text.disabled}
                style={styles.icon}
            />

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.text.hint}
                style={[
                    styles.input,
                    { color: colors.text.primary },
                ]}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />

            {value ? (
                <Pressable
                    onPress={handleClear}
                    style={styles.clearButton}
                >
                    <Icon
                        name="close"
                        size={20}
                        color={colors.text.secondary}
                    />
                </Pressable>
            ) : null}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 48,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
    },
    clearButton: {
        padding: 4,
    },
});
