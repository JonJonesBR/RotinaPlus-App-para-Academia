import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import StudentForm from './screens/StudentForm';
import StudentListScreen from './screens/StudentListScreen';
import ExerciseLogScreen from './screens/ExerciseLogScreen';
import StudentManagementScreen from './screens/StudentManagementScreen';
import SeriesFormScreen from './screens/SeriesFormScreen';
import ConfirmSeriesScreen from './screens/ConfirmSeriesScreen';
import StudentDetailsScreen from './screens/StudentDetailsScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerShown: false }}
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
          options={({ navigation }) => ({
            title: 'Gerenciar Alunos',
            headerLeft: () => (
              <Icon
                name="home"
                size={24}
                color="#000"
                style={{ marginLeft: 15 }}
                onPress={() => navigation.navigate('WelcomeScreen')}
              />
            ),
          })}
        />
        <Stack.Screen
          name="StudentDetails"
          component={StudentDetailsScreen}
          options={{ title: 'Detalhes do Aluno' }}
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
