import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SeriesFormScreen({ route, navigation }) {
  const { series } = route.params || {};
  const [name, setName] = useState(series?.name || '');
  const [exercises, setExercises] = useState(series?.exercises || []);
  const [newExercise, setNewExercise] = useState('');

  const handleAddExercise = () => {
    if (!newExercise.trim()) {
      Alert.alert('Erro', 'O exercício não pode estar vazio.');
      return;
    }
    setExercises((prev) => [...prev, newExercise.trim()]);
    setNewExercise('');
  };

  const handleDeleteExercise = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome da série é obrigatório.');
      return;
    }

    const newSeries = {
      id: series?.id || Date.now().toString(),
      name,
      exercises,
    };

    try {
      const storedPlans = await AsyncStorage.getItem('@customPlans');
      const customPlans = storedPlans ? JSON.parse(storedPlans) : [];

      const updatedPlans = series
        ? customPlans.map((plan) =>
            plan.id === series.id ? newSeries : plan
          )
        : [...customPlans, newSeries];

      await AsyncStorage.setItem('@customPlans', JSON.stringify(updatedPlans));

      Alert.alert(
        'Sucesso',
        `A série "${name}" foi salva com sucesso.`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('ExerciseLog', { refresh: true });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar a série:', error);
      Alert.alert('Erro', 'Não foi possível salvar a série. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {series ? 'Editar Série' : 'Nova Série'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da Série"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.exerciseContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar Exercício"
          value={newExercise}
          onChangeText={setNewExercise}
        />
        <Button mode="contained" onPress={handleAddExercise} style={styles.addButton}>
          Adicionar
        </Button>
      </View>
      <FlatList
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseText}>{item}</Text>
            <TouchableOpacity
              onPress={() => handleDeleteExercise(index)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum exercício adicionado.</Text>}
      />
      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Salvar Série
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  exerciseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    marginLeft: 10,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  exerciseText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  saveButton: {
    marginTop: 20,
  },
});
