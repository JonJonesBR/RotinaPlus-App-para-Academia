import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ExerciseLogScreen from '../screens/ExerciseLogScreen';
import SeriesListScreen from '../screens/SeriesListScreen';
import SeriesFormScreen from '../screens/SeriesFormScreen';
import ConfirmSeriesScreen from '../screens/ConfirmSeriesScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ExerciseLog">
        <Stack.Screen name="ExerciseLog" component={ExerciseLogScreen} options={{ title: 'Registro de Exercícios' }} />
        <Stack.Screen name="SeriesList" component={SeriesListScreen} options={{ title: 'Séries de Exercícios' }} />
        <Stack.Screen name="SeriesForm" component={SeriesFormScreen} options={{ title: 'Cadastrar Série' }} />
        <Stack.Screen name="ConfirmSeries" component={ConfirmSeriesScreen} options={{ title: 'Confirmar Série' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
