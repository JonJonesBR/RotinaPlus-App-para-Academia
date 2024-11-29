import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import StudentForm from './screens/StudentForm';
import StudentListScreen from './screens/StudentListScreen';
import ExerciseLogScreen from './screens/ExerciseLogScreen';
import StudentManagementScreen from './screens/StudentManagementScreen';
import FinancialManagementScreen from './screens/FinancialManagementScreen';
import SeriesFormScreen from './screens/SeriesFormScreen'; // Tela para cadastro/edição de séries
import ConfirmSeriesScreen from './screens/ConfirmSeriesScreen'; // Tela para confirmação de série
import StudentDetailsScreen from './screens/StudentDetailsScreen'; // Nova tela para detalhes do aluno

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Tela de Boas-vindas */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: 'Bem-vindo' }}
        />

        {/* Cadastro de Alunos */}
        <Stack.Screen
          name="StudentRegistration"
          component={StudentForm}
          options={{ title: 'Cadastro de Aluno' }}
        />

        {/* Lista de Alunos */}
        <Stack.Screen
          name="StudentList"
          component={StudentListScreen}
          options={{ title: 'Lista de Alunos' }}
        />

        {/* Registro de Exercícios */}
        <Stack.Screen
          name="ExerciseLog"
          component={ExerciseLogScreen}
          options={{ title: 'Registro de Exercícios' }}
        />

        {/* Gerenciar Alunos Cadastrados */}
        <Stack.Screen
          name="StudentManagement"
          component={StudentManagementScreen}
          options={{ title: 'Gerenciar Alunos Cadastrados' }}
        />

        {/* Detalhes do Aluno */}
        <Stack.Screen
          name="StudentDetails"
          component={StudentDetailsScreen}
          options={{ title: 'Detalhes do Aluno' }}
        />

        {/* Gerenciamento Financeiro */}
        <Stack.Screen
          name="FinancialManagement"
          component={FinancialManagementScreen}
          options={{ title: 'Gerenciamento Financeiro' }}
        />
        <Stack.Screen
          name="SeriesForm"
          component={SeriesFormScreen}
          options={{ title: 'Cadastrar/Editar Série' }}
        />
        <Stack.Screen
          name="ConfirmSeries"
          component={ConfirmSeriesScreen}
          options={{ title: 'Confirmar Série' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
