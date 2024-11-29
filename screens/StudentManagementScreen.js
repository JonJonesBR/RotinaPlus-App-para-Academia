import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleDelete = (id) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Alunos Cadastrados</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.infoContainer}>
              <Text style={styles.listText}>{item.name} - {item.cpf}</Text>
              <Text style={styles.detailsText}>Idade: {item.age}</Text>
              <Text style={styles.detailsText}>Peso: {item.weight} kg</Text>
              <Text style={styles.detailsText}>Altura: {item.height} cm</Text>
              <Text style={styles.detailsText}>Observações: {item.notes || 'Nenhuma'}</Text>
              {item.linkedPlan ? (
                <>
                  <Text style={styles.detailsText}>
                    Plano Vinculado: {item.linkedPlan.name}
                  </Text>
                  <Text style={styles.detailsText}>
                    Séries: {item.linkedPlan.sets}, Repetições: {item.linkedPlan.reps}
                  </Text>
                </>
              ) : (
                <Text style={styles.detailsText}>Nenhum plano vinculado</Text>
              )}
            </View>
            <View style={styles.actions}>
              {/* Botão para Editar */}
              <Button
                mode="text"
                onPress={() => navigation.navigate('StudentRegistration', { student: item })}
                style={styles.editButton}
              >
                Editar
              </Button>

              {/* Botão para Excluir */}
              <Button
                mode="text"
                onPress={() => handleDelete(item.id)}
                color="red"
                style={styles.deleteButton}
              >
                Excluir
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoContainer: {
    flex: 2,
  },
  listText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  actions: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
  addButton: {
    marginTop: 20,
  },
});
