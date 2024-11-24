import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import ExerciseLogScreen from './screens/ExerciseLogScreen';
import FoodLogScreen from './screens/FoodLogScreen';
import YouTubeScreen from './screens/YouTubeScreen';
import StudentListScreen from './screens/StudentListScreen';
import StudentForm from './screens/StudentForm';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#2ecc71',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="ExerciseLog" component={ExerciseLogScreen} />
          <Stack.Screen name="FoodLog" component={FoodLogScreen} />
          <Stack.Screen name="YouTube" component={YouTubeScreen} />
          <Stack.Screen
            name="StudentRegistration"
            component={StudentListScreen}
            options={{ title: 'Cadastro de Alunos' }}
          />
          <Stack.Screen
            name="StudentForm"
            component={StudentForm}
            options={{ title: 'Formulário de Aluno' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
