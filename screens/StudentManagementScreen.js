import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StudentManagementScreen({ navigation }) {
  const [students, setStudents] = useState([]);

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
        setStudents(JSON.parse(storedStudents));
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

  const handleUnlinkPlan = async (studentId) => {
    const updatedStudents = students.map((student) => {
      if (student.id === studentId) {
        return {
          ...student,
          linkedPlan: null,
        };
      }
      return student;
    });
    await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
    Alert.alert('Plano Desvinculado', 'Plano desvinculado do aluno com sucesso.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Alunos Cadastrados</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>
              {item.name} - {item.cpf}
            </Text>
            <View style={styles.actions}>
              <Button
                onPress={() => navigation.navigate('StudentForm', { student: item })}
              >
                Editar
              </Button>
              <Button onPress={() => handleDelete(item.id)} color="red">
                Excluir
              </Button>
              {item.linkedPlan && (
                <Button onPress={() => handleUnlinkPlan(item.id)} color="orange">
                  Desvincular Plano
                </Button>
              )}
            </View>
          </View>
        )}
      />
      <Button mode="contained" onPress={() => navigation.navigate('StudentForm')} style={styles.addButton}>
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
  },
  listText: {
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    marginTop: 20,
  },
});
