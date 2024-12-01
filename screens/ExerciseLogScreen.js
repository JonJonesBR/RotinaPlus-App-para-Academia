import React, { useState, useEffect } from 'react'; 
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExerciseLogScreen({ navigation }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [customPlans, setCustomPlans] = useState([]);

  useEffect(() => {
    loadStudents();
    loadPlans();

    // Listener para recarregar planos ao voltar para a tela
    const unsubscribe = navigation.addListener('focus', () => {
      loadPlans();
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

  const handleDeletePlan = (planId) => {
    Alert.alert('Confirmação', 'Deseja excluir esta série?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const updatedPlans = customPlans.filter((plan) => plan.id !== planId);
          await AsyncStorage.setItem('@customPlans', JSON.stringify(updatedPlans));
          setCustomPlans(updatedPlans);
        },
      },
    ]);
  };

  const handleLinkPlan = (plan) => {
    if (!selectedStudent) {
      Alert.alert('Erro', 'Nenhum aluno foi selecionado.');
      return;
    }
    navigation.navigate('ConfirmSeries', {
      series: plan,
      student: selectedStudent,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Exercícios</Text>

      <Text style={styles.subtitle}>Selecione um Aluno:</Text>
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
            <Text style={styles.studentName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedStudent && (
        <Text style={styles.selectedText}>
          Aluno Selecionado: {selectedStudent.name}
        </Text>
      )}

      <Text style={styles.subtitle}>Gerenciar Séries de Exercícios:</Text>
      <FlatList
        data={customPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <Text style={styles.planName}>{item.name}</Text>
            <View style={styles.planActions}>
              <Button
                mode="text"
                onPress={() =>
                  navigation.navigate('SeriesForm', { series: item })
                }
              >
                Editar
              </Button>
              <Button
                mode="text"
                onPress={() => handleDeletePlan(item.id)}
                color="red"
              >
                Excluir
              </Button>
              <Button
                mode="text"
                onPress={() => handleLinkPlan(item)}
                color="blue"
              >
                Vincular
              </Button>
            </View>
          </View>
        )}
      />

      <Button
        mode="contained"
        onPress={() => navigation.navigate('SeriesForm')}
        style={styles.addButton}
      >
        Adicionar Nova Série
      </Button>

      {/* Botão "Não Incluir Exercícios" */}
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('WelcomeScreen')}
        style={styles.noChangeButton}
      >
        Não Incluir Exercícios
      </Button>
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
  selectedButton: { backgroundColor: '#6C63FF' },
  studentName: { color: '#fff', fontWeight: 'bold' },
  selectedText: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  planItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  planName: { fontSize: 16, fontWeight: 'bold' },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    marginTop: 20,
  },
  noChangeButton: {
    marginTop: 15,
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 5,
  },
});
