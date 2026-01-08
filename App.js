/**
 * App.js - Ponto de entrada do aplicativo RotinaPlus
 * 
 * @author JonJonesBR
 * @version 0.1.0
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';

/**
 * Componente interno que usa o tema
 */
function AppContent() {
  const { colors, isDark } = useTheme();

  // Configura tema do React Native Paper
  const paperTheme = isDark ? {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      surface: colors.surface,
      error: colors.danger,
      onPrimary: colors.text.inverse,
      onSecondary: colors.text.inverse,
      onBackground: colors.text.primary,
      onSurface: colors.text.primary,
    },
  } : {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      surface: colors.surface,
      error: colors.danger,
      onPrimary: colors.text.inverse,
      onSecondary: colors.text.inverse,
      onBackground: colors.text.primary,
      onSurface: colors.text.primary,
    },
  };

  // Tema para Navigation
  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text.primary,
      border: colors.border,
      notification: colors.danger,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

/**
 * Componente principal do App
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
