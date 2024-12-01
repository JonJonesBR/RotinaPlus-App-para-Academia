import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfirmSeriesScreen({ route, navigation }) {
  const { series, student } = route.params || {};

  if (!student || !series) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Erro: Aluno ou série não foram selecionados corretamente.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackButton}
        >
          <Text style={styles.goBackText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [sets, setSets] = React.useState(3);
  const [reps, setReps] = React.useState(10);

  const handleConfirm = async () => {
    try {
      // Recuperar os alunos armazenados
      const storedStudents = await AsyncStorage.getItem('@students');
      const students = storedStudents ? JSON.parse(storedStudents) : [];
  
      // Atualizar o aluno com os exercícios vinculados
      const updatedStudents = students.map((s) => {
        if (s.id === student.id) {
          const updatedExercises = s.linkedExercises || [];
          return {
            ...s,
            linkedExercises: [
              ...updatedExercises,
              {
                id: series.id,
                name: series.name,
                exercises: series.exercises,
                sets,
                reps,
              },
            ],
          };
        }
        return s;
      });
  
      // Salvar a lista de alunos atualizada
      await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));
  
      // Redirecionar para a tela de boas-vindas
      Alert.alert(
        'Sucesso',
        `A série "${series.name}" foi vinculada ao aluno "${student.name}".`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('WelcomeScreen'), // Redireciona para WelcomeScreen
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao vincular série:', error);
      Alert.alert('Erro', 'Não foi possível vincular a série. Tente novamente.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vincular Série</Text>
      <Text style={styles.seriesName}>{series.name}</Text>
      <Text style={styles.subtitle}>Exercícios:</Text>
      {series.exercises.map((exercise, index) => (
        <Text key={index} style={styles.exerciseText}>{exercise}</Text>
      ))}

      <View style={styles.counterContainer}>
        <Text>Número de Séries:</Text>
        <TouchableOpacity onPress={() => setSets((prev) => Math.max(1, prev - 1))}>
          <Text style={styles.counterButton}>-</Text>
        </TouchableOpacity>
        <Text>{sets}</Text>
        <TouchableOpacity onPress={() => setSets((prev) => prev + 1)}>
          <Text style={styles.counterButton}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.counterContainer}>
        <Text>Repetições:</Text>
        <TouchableOpacity onPress={() => setReps((prev) => Math.max(1, prev - 1))}>
          <Text style={styles.counterButton}>-</Text>
        </TouchableOpacity>
        <Text>{reps}</Text>
        <TouchableOpacity onPress={() => setReps((prev) => prev + 1)}>
          <Text style={styles.counterButton}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  seriesName: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  exerciseText: { fontSize: 16, marginBottom: 5 },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  counterButton: { fontSize: 18, paddingHorizontal: 10 },
  confirmButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  errorText: { fontSize: 16, color: 'red', marginBottom: 20 },
  goBackButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  goBackText: { color: '#fff', fontWeight: 'bold' },
});
