import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import StudentForm from './screens/StudentForm';
import StudentListScreen from './screens/StudentListScreen';
import ExerciseLogScreen from './screens/ExerciseLogScreen';
import StudentManagementScreen from './screens/StudentManagementScreen';
import FinancialManagementScreen from './screens/FinancialManagementScreen'; // Nova tela

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: 'Bem-vindo' }}
        />
        <Stack.Screen
          name="StudentRegistration"
          component={StudentForm}
          options={{ title: 'Cadastro de Aluno' }}
        />
        <Stack.Screen
          name="StudentList"
          component={StudentListScreen}
          options={{ title: 'Lista de Alunos' }}
        />
        <Stack.Screen
          name="ExerciseLog"
          component={ExerciseLogScreen}
          options={{ title: 'Registro de Exercícios' }}
        />
       <Stack.Screen
          name="StudentManagement"
          component={StudentManagementScreen}
          options={{ title: 'Gerenciar Alunos Cadastrados' }}
        />
        <Stack.Screen
          name="FinancialManagement"
          component={FinancialManagementScreen}
          options={{ title: 'Gerenciamento Financeiro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
