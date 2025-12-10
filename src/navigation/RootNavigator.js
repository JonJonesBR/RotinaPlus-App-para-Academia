/**
 * Configuração de navegação do aplicativo RotinaPlus
 * 
 * Nova estrutura com 3 stacks:
 * - AuthStack: Telas de autenticação/cadastro
 * - ProfessorStack: Área do professor
 * - AlunoStack: Área do aluno
 */
import React, { useState, useEffect } from 'react';
import { Pressable, View, StyleSheet, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import { UserService } from '../services/storageService';
import { UserRole } from '../models/dataModels';

// Auth Screens
import {
  RoleSelectionScreen,
  ProfessorRegistrationScreen,
  AlunoRegistrationScreen
} from '../screens/auth';

// Professor Screens
import {
  ProfessorDashboardScreen,
  ProfessorFinancialScreen,
  ProfessorQRExportScreen,
  ProfessorStudentsScreen,
  ProfessorWorkoutFormScreen,
} from '../screens/professor';

// Aluno Screens
import {
  AlunoDashboardScreen,
  AlunoFinancialScreen,
  AlunoQRImportScreen,
  AlunoWorkoutDetailScreen,
} from '../screens/aluno';

const Stack = createStackNavigator();

/**
 * Botão de voltar customizado
 */
function BackButton({ navigation, colors }) {
  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={({ pressed }) => [
        styles.headerButton,
        pressed && { opacity: 0.6 }
      ]}
    >
      <Icon name="arrow-back" size={24} color={colors.text.primary} />
    </Pressable>
  );
}

/**
 * Botão de menu/settings
 */
function SettingsButton({ navigation, colors, route }) {
  return (
    <Pressable
      onPress={() => navigation.navigate(route)}
      style={({ pressed }) => [
        styles.headerButton,
        pressed && { opacity: 0.6 }
      ]}
    >
      <Icon name="settings" size={24} color={colors.text.primary} />
    </Pressable>
  );
}

/**
 * Navegador principal do aplicativo
 */
export default function RootNavigator() {
  const { colors, isDark } = useTheme();
  const [initialRoute, setInitialRoute] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await UserService.getCurrentUser();
      const role = await UserService.getUserRole();

      if (user && role) {
        setUserRole(role);
        if (role === UserRole.PROFESSOR) {
          setInitialRoute('ProfessorDashboard');
        } else {
          setInitialRoute('AlunoDashboard');
        }
      } else {
        setInitialRoute('RoleSelection');
      }
    } catch (error) {
      console.error('Erro ao verificar auth:', error);
      setInitialRoute('RoleSelection');
    } finally {
      setLoading(false);
    }
  };

  // Opções padrão do header
  const defaultScreenOptions = {
    headerStyle: {
      backgroundColor: colors.surface,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitleStyle: {
      color: colors.text.primary,
      fontSize: 18,
      fontWeight: '600',
    },
    headerTintColor: colors.text.primary,
    headerBackTitleVisible: false,
    cardStyle: {
      backgroundColor: colors.background,
    },
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={defaultScreenOptions}
    >
      {/* ============================================ */}
      {/* AUTH STACK - Telas de autenticação */}
      {/* ============================================ */}
      <Stack.Screen
        name="RoleSelection"
        component={RoleSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfessorRegistration"
        component={ProfessorRegistrationScreen}
        options={({ navigation }) => ({
          title: 'Cadastro',
          headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
        })}
      />
      <Stack.Screen
        name="AlunoRegistration"
        component={AlunoRegistrationScreen}
        options={({ navigation }) => ({
          title: 'Cadastro',
          headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
        })}
      />

      {/* ============================================ */}
      {/* PROFESSOR STACK - Área do professor */}
      {/* ============================================ */}
      <Stack.Screen
        name="ProfessorDashboard"
        component={ProfessorDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfessorFinancial"
        component={ProfessorFinancialScreen}
        options={({ navigation }) => ({
          title: 'Financeiro',
          headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
        })}
      />
      <Stack.Screen
        name="ProfessorQRExport"
        component={ProfessorQRExportScreen}
        options={({ navigation }) => ({
          title: 'Gerar QR Code',
          headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
        })}
      />
      <Stack.Screen
        name="ProfessorStudents"
        component={ProfessorStudentsScreen}
        options={({ navigation }) => ({
          title: 'Meus Alunos',
          headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
        })}
      />
      <Stack.Screen
        name="ProfessorWorkoutForm"
        component={ProfessorWorkoutFormScreen}
        options={({ navigation }) => ({
          title: 'Novo Treino',
          headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
        })}
      />

      {/* ============================================ */}
      {/* ALUNO STACK - Área do aluno */}
      {/* ============================================ */}
      <Stack.Screen
        name="AlunoDashboard"
        component={AlunoDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AlunoFinancial"
        component={AlunoFinancialScreen}
        options={({ navigation }) => ({
          title: 'Financeiro',
          headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
        })}
      />
      <Stack.Screen
        name="AlunoWorkoutDetail"
        component={AlunoWorkoutDetailScreen}
        options={({ navigation }) => ({
          title: 'Meu Treino',
          headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
        })}
      />
      <Stack.Screen
        name="AlunoQRImport"
        component={AlunoQRImportScreen}
        options={({ navigation }) => ({
          title: 'Importar QR Code',
          headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
  },
});

// Exporta nomes das rotas para uso tipado
export const ROUTES = {
  // Auth
  ROLE_SELECTION: 'RoleSelection',
  PROFESSOR_REGISTRATION: 'ProfessorRegistration',
  ALUNO_REGISTRATION: 'AlunoRegistration',

  // Professor
  PROFESSOR_DASHBOARD: 'ProfessorDashboard',
  PROFESSOR_STUDENTS: 'ProfessorStudents',
  PROFESSOR_STUDENT_DETAIL: 'ProfessorStudentDetail',
  PROFESSOR_WORKOUTS: 'ProfessorWorkouts',
  PROFESSOR_WORKOUT_FORM: 'ProfessorWorkoutForm',
  PROFESSOR_FINANCIAL: 'ProfessorFinancial',
  PROFESSOR_QR_EXPORT: 'ProfessorQRExport',
  PROFESSOR_SETTINGS: 'ProfessorSettings',

  // Aluno
  ALUNO_DASHBOARD: 'AlunoDashboard',
  ALUNO_WORKOUT_DETAIL: 'AlunoWorkoutDetail',
  ALUNO_PROGRESS: 'AlunoProgress',
  ALUNO_FINANCIAL: 'AlunoFinancial',
  ALUNO_QR_IMPORT: 'AlunoQRImport',
  ALUNO_SETTINGS: 'AlunoSettings',
};
