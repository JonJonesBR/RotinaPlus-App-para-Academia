/**
 * Avatar - Componente de avatar com iniciais
 * 
 * Features:
 * - Gera cor baseada no nome
 * - Mostra iniciais
 * - Tamanhos variados
 * - Opcional: imagem de perfil
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

// Cores para avatares baseadas no nome
const AVATAR_COLORS = [
    '#0D9488', // Teal
    '#2563EB', // Blue
    '#7C3AED', // Violet
    '#DB2777', // Pink
    '#EA580C', // Orange
    '#16A34A', // Green
    '#0891B2', // Cyan
    '#9333EA', // Purple
    '#DC2626', // Red
    '#CA8A04', // Yellow
];

export default function Avatar({
    name = '',
    imageUrl,
    size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    style,
}) {
    const { colors, typography } = useTheme();

    // Gera cor baseada no nome
    const backgroundColor = useMemo(() => {
        if (!name) return colors.primary;
        const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return AVATAR_COLORS[charSum % AVATAR_COLORS.length];
    }, [name, colors.primary]);

    // Gera iniciais
    const initials = useMemo(() => {
        if (!name) return '?';
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }, [name]);

    // Estilos baseados no tamanho
    const sizeStyles = useMemo(() => {
        const sizes = {
            xs: { container: 28, fontSize: 11 },
            sm: { container: 36, fontSize: 13 },
            md: { container: 48, fontSize: 16 },
            lg: { container: 64, fontSize: 22 },
            xl: { container: 80, fontSize: 28 },
        };
        return sizes[size] || sizes.md;
    }, [size]);

    const containerStyle = [
        styles.container,
        {
            width: sizeStyles.container,
            height: sizeStyles.container,
            borderRadius: sizeStyles.container / 2,
            backgroundColor,
        },
        style,
    ];

    const textStyle = [
        styles.text,
        {
            fontSize: sizeStyles.fontSize,
            color: '#FFFFFF',
        },
    ];

    if (imageUrl) {
        return (
            <View style={containerStyle}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
        );
    }

    return (
        <View style={containerStyle}>
            <Text style={textStyle}>{initials}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    text: {
        fontWeight: '600',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
