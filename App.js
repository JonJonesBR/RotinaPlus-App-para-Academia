import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import StudentForm from './screens/StudentForm';
import StudentListScreen from './screens/StudentListScreen';
import ExerciseLogScreen from './screens/ExerciseLogScreen';
import YouTubeScreen from './screens/YouTubeScreen';
import ProgressTrackingScreen from './screens/ProgressTrackingScreen';

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
          name="ProgressTracking"
          component={ProgressTrackingScreen}
          options={{ title: 'Acompanhamento de Progresso' }}
        />
        <Stack.Screen
          name="YouTube"
          component={YouTubeScreen}
          options={{ title: 'Vídeos do YouTube' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
