/**
 * Configuração de navegação do aplicativo RotinaPlus
 * Com header estilizado e tema dinâmico
 */
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';

// Telas
import WelcomeScreen from '../screens/WelcomeScreen';
import StudentForm from '../screens/StudentForm';
import StudentListScreen from '../screens/StudentListScreen';
import ExerciseLogScreen from '../screens/ExerciseLogScreen';
import StudentManagementScreen from '../screens/StudentManagementScreen';
import SeriesFormScreen from '../screens/SeriesFormScreen';
import ConfirmSeriesScreen from '../screens/ConfirmSeriesScreen';
import StudentDetailsScreen from '../screens/StudentDetailsScreen';

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
 * Botão de home
 */
function HomeButton({ navigation, colors }) {
    return (
        <Pressable
            onPress={() => navigation.navigate('WelcomeScreen')}
            style={({ pressed }) => [
                styles.headerButton,
                pressed && { opacity: 0.6 }
            ]}
        >
            <Icon name="home" size={24} color={colors.text.primary} />
        </Pressable>
    );
}

/**
 * Navegador principal do aplicativo
 */
export default function RootNavigator() {
    const { colors, isDark } = useTheme();

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

    return (
        <Stack.Navigator
            initialRouteName="WelcomeScreen"
            screenOptions={defaultScreenOptions}
        >
            <Stack.Screen
                name="WelcomeScreen"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="StudentRegistration"
                component={StudentForm}
                options={({ navigation }) => ({
                    title: 'Cadastro de Aluno',
                    headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
                })}
            />
            <Stack.Screen
                name="StudentList"
                component={StudentListScreen}
                options={({ navigation }) => ({
                    title: 'Lista de Alunos',
                    headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
                })}
            />
            <Stack.Screen
                name="ExerciseLog"
                component={ExerciseLogScreen}
                options={({ navigation }) => ({
                    title: 'Exercícios',
                    headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
                })}
            />
            <Stack.Screen
                name="StudentManagement"
                component={StudentManagementScreen}
                options={({ navigation }) => ({
                    title: 'Gerenciar Alunos',
                    headerLeft: () => <HomeButton navigation={navigation} colors={colors} />,
                })}
            />
            <Stack.Screen
                name="StudentDetails"
                component={StudentDetailsScreen}
                options={({ navigation }) => ({
                    title: 'Detalhes do Aluno',
                    headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
                })}
            />
            <Stack.Screen
                name="SeriesForm"
                component={SeriesFormScreen}
                options={({ navigation }) => ({
                    title: 'Série de Exercícios',
                    headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
                })}
            />
            <Stack.Screen
                name="ConfirmSeries"
                component={ConfirmSeriesScreen}
                options={({ navigation }) => ({
                    title: 'Confirmar Série',
                    headerLeft: () => <BackButton navigation={navigation} colors={colors} />,
                })}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    headerButton: {
        padding: 8,
        marginLeft: 8,
        borderRadius: 8,
    },
});

// Exporta nomes das rotas para uso tipado
export const ROUTES = {
    WELCOME: 'WelcomeScreen',
    STUDENT_REGISTRATION: 'StudentRegistration',
    STUDENT_LIST: 'StudentList',
    EXERCISE_LOG: 'ExerciseLog',
    STUDENT_MANAGEMENT: 'StudentManagement',
    STUDENT_DETAILS: 'StudentDetails',
    SERIES_FORM: 'SeriesForm',
    CONFIRM_SERIES: 'ConfirmSeries',
};
