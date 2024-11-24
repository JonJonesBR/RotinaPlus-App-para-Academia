import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const predefinedPlans = [
  { id: '1', name: 'Perda de Peso' },
  { id: '2', name: 'Ganho de Massa' },
  { id: '3', name: 'Resistência' },
  { id: '4', name: 'Teste de Aptidão Física' },
];

export default function ExerciseLogScreen() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customPlans, setCustomPlans] = useState([]);
  const [newPlanName, setNewPlanName] = useState('');

  useEffect(() => {
    loadStudents();
    loadPlans();
  }, []);

  // Carregar alunos do AsyncStorage
  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('@students');
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  // Carregar séries personalizadas do AsyncStorage
  const loadPlans = async () => {
    try {
      const storedPlans = await AsyncStorage.getItem('@customPlans');
      if (storedPlans) {
        setCustomPlans(JSON.parse(storedPlans));
      }
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    }
  };

  const savePlans = async (updatedPlans) => {
    try {
      await AsyncStorage.setItem('@customPlans', JSON.stringify(updatedPlans));
      setCustomPlans(updatedPlans);
    } catch (error) {
      console.error('Erro ao salvar planos:', error);
    }
  };

  const addCustomPlan = () => {
    if (!newPlanName.trim()) {
      Alert.alert('Erro', 'O nome da série não pode estar vazio.');
      return;
    }
    const newPlan = { id: Date.now().toString(), name: newPlanName, exercises: [] };
    const updatedPlans = [...customPlans, newPlan];
    savePlans(updatedPlans);
    setNewPlanName('');
  };

  const linkPlanToStudent = () => {
    if (!selectedStudent || !selectedPlan) {
      Alert.alert('Erro', 'Selecione um aluno e uma série de exercícios.');
      return;
    }
    Alert.alert(
      'Plano Vinculado',
      `Plano "${selectedPlan.name}" vinculado ao aluno "${selectedStudent.name}".`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Exercícios</Text>

      {/* Seletor de aluno */}
      <Text style={styles.subtitle}>Selecione o Aluno:</Text>
      {students.length > 0 ? (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.studentButton,
                selectedStudent?.id === item.id && styles.selectedButton,
              ]}
              onPress={() => setSelectedStudent(item)}
            >
              <Text style={styles.buttonText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>Nenhum aluno cadastrado.</Text>
      )}

      {/* Seletor de série */}
      <Text style={styles.subtitle}>Séries de Exercícios:</Text>
      <FlatList
        data={[...customPlans, ...predefinedPlans]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.planButton,
              selectedPlan?.id === item.id && styles.selectedButton,
            ]}
            onPress={() => setSelectedPlan(item)}
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Adicionar nova série personalizada */}
      <TextInput
        style={styles.input}
        placeholder="Nome da nova série"
        value={newPlanName}
        onChangeText={setNewPlanName}
      />
      <TouchableOpacity style={styles.addButton} onPress={addCustomPlan}>
        <Text style={styles.buttonText}>Adicionar Série</Text>
      </TouchableOpacity>

      {/* Vincular série ao aluno */}
      <TouchableOpacity style={styles.linkButton} onPress={linkPlanToStudent}>
        <Text style={styles.buttonText}>Vincular Série ao Aluno</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  studentButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#6C63FF',
  },
  planButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  linkButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});
