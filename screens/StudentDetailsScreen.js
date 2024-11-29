import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StudentDetailsScreen({ route }) {
  const { student } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Aluno</Text>
      <Text style={styles.detail}>Nome: {student.name}</Text>
      <Text style={styles.detail}>CPF: {student.cpf}</Text>
      <Text style={styles.detail}>Idade: {student.age}</Text>
      <Text style={styles.detail}>Peso: {student.weight} kg</Text>
      <Text style={styles.detail}>Altura: {student.height} cm</Text>
      <Text style={styles.detail}>Observações: {student.notes}</Text>
      {student.linkedPlan && (
        <Text style={styles.detail}>Plano Vinculado: {student.linkedPlan.name}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
});
