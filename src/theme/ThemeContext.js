/**
 * ThemeContext - Gerenciador de Tema Claro/Escuro
 * 
 * Provê o tema atual para toda a aplicação e persiste
 * a preferência do usuário no AsyncStorage.
 */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    lightColors,
    darkColors,
    spacing,
    typography,
    borderRadius,
    createShadows,
    createGlobalStyles,
    animations,
} from './index';

// Chave para persistência
const THEME_STORAGE_KEY = '@rotina_plus_theme';

// Tipos de tema
export const ThemeMode = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};

// Contexto
const ThemeContext = createContext(null);

/**
 * Hook para usar o tema
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
}

/**
 * Provider do Tema
 */
export function ThemeProvider({ children }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState(ThemeMode.SYSTEM);
    const [isLoading, setIsLoading] = useState(true);

    // Carrega preferência salva
    useEffect(() => {
        loadSavedTheme();
    }, []);

    const loadSavedTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && Object.values(ThemeMode).includes(savedTheme)) {
                setThemeMode(savedTheme);
            }
        } catch (error) {
            console.warn('Erro ao carregar tema:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Salva preferência
    const saveTheme = async (mode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.warn('Erro ao salvar tema:', error);
        }
    };

    // Alterna o tema
    const setTheme = (mode) => {
        setThemeMode(mode);
        saveTheme(mode);
    };

    // Alterna entre claro e escuro
    const toggleTheme = () => {
        const newMode = isDark ? ThemeMode.LIGHT : ThemeMode.DARK;
        setTheme(newMode);
    };

    // Determina se está em modo escuro
    const isDark = useMemo(() => {
        if (themeMode === ThemeMode.SYSTEM) {
            return systemColorScheme === 'dark';
        }
        return themeMode === ThemeMode.DARK;
    }, [themeMode, systemColorScheme]);

    // Monta o objeto de tema
    const theme = useMemo(() => {
        const colors = isDark ? darkColors : lightColors;
        const shadows = createShadows(isDark);
        const styles = createGlobalStyles(colors, shadows);

        return {
            // Cores e estilos
            colors,
            shadows,
            styles,

            // Tipografia e espaçamentos
            spacing,
            typography,
            borderRadius,
            animations,

            // Estado
            isDark,
            themeMode,

            // Ações
            setTheme,
            toggleTheme,

            // Utils
            isLoading,
        };
    }, [isDark, themeMode, isLoading]);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;
