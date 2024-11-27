import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalStyles } from '../styles/globalStyles';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bem-vindo ao Rotina+</Text>

      <Button
        mode="contained"
        icon="account-group"
        onPress={() => navigation.navigate('StudentRegistration')}
        style={styles.button}
      >
        Cadastro de Alunos
      </Button>

      <Button
        mode="contained"
        icon="dumbbell"
        onPress={() => navigation.navigate('ExerciseLog')}
        style={styles.button}
      >
        Registro de Exercícios
      </Button>

      <Button
        mode="contained"
        icon="account-edit"
        onPress={() => navigation.navigate('StudentManagement')}
        style={styles.button}
      >
        Gerenciar Alunos Cadastrados
      </Button>

      <Button
        mode="contained"
        icon="cash"
        onPress={() => navigation.navigate('FinancialManagement')}
        style={styles.button}
      >
        Gerenciamento Financeiro
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    borderRadius: 5,
  },
});
