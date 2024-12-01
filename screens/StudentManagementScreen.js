import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para o ícone de casa

export default function StudentManagementScreen({ navigation }) {
  const [students, setStudents] = useState([]);

  // Carregar dados ao focar na tela
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStudents();
    });
    return unsubscribe;
  }, [navigation]);

  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('@students');
      if (storedStudents) {
        const sortedStudents = JSON.parse(storedStudents).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setStudents(sortedStudents);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  const handleDeleteStudent = (id) => {
    Alert.alert('Confirmação', 'Deseja excluir este aluno?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const updatedStudents = students.filter((s) => s.id !== id);
          await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));
          setStudents(updatedStudents);
        },
      },
    ]);
  };

  const handleDeleteExercise = (studentId, exerciseId) => {
    Alert.alert('Confirmação', 'Deseja excluir este exercício?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const updatedStudents = students.map((student) => {
            if (student.id === studentId) {
              const updatedExercises = student.linkedExercises.filter(
                (exercise) => exercise.id !== exerciseId
              );
              return { ...student, linkedExercises: updatedExercises };
            }
            return student;
          });

          await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));
          setStudents(updatedStudents);
        },
      },
    ]);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon
          name="home"
          size={24}
          color="#000"
          style={{ marginLeft: 15 }}
          onPress={() => navigation.navigate('WelcomeScreen')}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Alunos Cadastrados</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Informações Pessoais */}
            <Text style={styles.cardTitle}>{item.name} - {item.cpf}</Text>
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <Text style={styles.detailsText}>Idade: {item.age}</Text>
            <Text style={styles.detailsText}>Peso: {item.weight} kg</Text>
            <Text style={styles.detailsText}>Altura: {item.height} cm</Text>
            <Text style={styles.detailsText}>Observações: {item.notes || 'Nenhuma'}</Text>

            {/* Informações Financeiras */}
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Informações Financeiras</Text>
            <Text style={styles.detailsText}>
              Mensalidade: {item.financialData?.monthlyFee || 'Não informada'}
            </Text>
            <Text style={styles.detailsText}>
              Data de Vencimento: {item.financialData?.dueDate || 'Não informada'}
            </Text>

            {/* Dias de Frequência */}
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Dias de Frequência</Text>
            <Text style={styles.detailsText}>
              {item.frequencyDays?.length > 0
                ? item.frequencyDays.map((day) => `Dia ${day}`).join(', ')
                : 'Nenhum dia selecionado'}
            </Text>

            {/* Exercícios Vinculados */}
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Exercícios Vinculados</Text>
            {item.linkedExercises?.length > 0 ? (
              item.linkedExercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.detailsText}>Série: {exercise.name}</Text>
                  <Text style={styles.detailsText}>
                    Séries: {exercise.sets} - Repetições: {exercise.reps}
                  </Text>
                  <Text style={styles.detailsText}>
                    Exercícios: {exercise.exercises.join(', ')}
                  </Text>
                  <Button
                    mode="text"
                    color="red"
                    onPress={() => handleDeleteExercise(item.id, exercise.id)}
                    style={styles.deleteExerciseButton}
                  >
                    Excluir Exercício
                  </Button>
                </View>
              ))
            ) : (
              <Text style={styles.detailsText}>Nenhum exercício vinculado</Text>
            )}
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('ExerciseLog', { student: item })}
              style={styles.addExerciseButton}
            >
              Adicionar Exercícios
            </Button>

            {/* Botões de Ação */}
            <View style={styles.actions}>
              <Button
                mode="text"
                onPress={() => navigation.navigate('StudentRegistration', { student: item })}
                style={styles.editButton}
              >
                Editar
              </Button>
              <Button
                mode="text"
                onPress={() => handleDeleteStudent(item.id)}
                color="red"
                style={styles.deleteButton}
              >
                Excluir Aluno
              </Button>
            </View>
          </View>
        )}
      />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('StudentRegistration')}
        style={styles.addButton}
      >
        Adicionar Novo Aluno
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#ddd',
    height: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  exerciseItem: {
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#6C63FF',
  },
  deleteExerciseButton: {
    marginTop: 5,
  },
  addExerciseButton: {
    marginTop: 10,
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
  addButton: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 10,
  },
});
