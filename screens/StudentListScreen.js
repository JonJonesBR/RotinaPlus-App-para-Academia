import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Text, Button, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StudentListScreen({ navigation }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStudents();
    });
    return unsubscribe;
  }, [navigation]);

  // Carregar alunos do AsyncStorage
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

  // Excluir aluno
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
          Alert.alert('Sucesso', 'Aluno excluído com sucesso.');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Alunos</Text>
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
                mode="outlined"
                onPress={() => navigation.navigate('StudentForm', { student: item })}
                style={styles.editButton}
              >
                Editar
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
                color="red"
              >
                Excluir
              </Button>
            </View>
          </View>
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('StudentForm')}
      />
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
    marginTop: 10,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#3498db',
  },
});
