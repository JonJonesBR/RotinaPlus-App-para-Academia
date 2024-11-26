import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StudentForm({ route, navigation }) {
  const { student } = route.params || {};
  const [formData, setFormData] = useState({
    id: student?.id || '',
    name: student?.name || '',
    cpf: student?.cpf || '',
    age: student?.age || '',
    weight: student?.weight || '',
    height: student?.height || '',
    notes: student?.notes || '',
    progress: student?.progress || { q1: 0, q2: 0, q3: 0, q4: 0 },
  });

  const handleSave = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('@students');
      const students = storedStudents ? JSON.parse(storedStudents) : [];

      const updatedStudents = formData.id
        ? students.map((s) => (s.id === formData.id ? formData : s))
        : [...students, { ...formData, id: Date.now().toString() }];

      await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>{formData.id ? 'Editar Aluno' : 'Novo Aluno'}</Text>
          <TextInput
            label="Nome"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="CPF"
            value={formData.cpf}
            onChangeText={(text) => setFormData({ ...formData, cpf: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Idade"
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Peso (kg)"
            value={formData.weight}
            onChangeText={(text) => setFormData({ ...formData, weight: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Altura (cm)"
            value={formData.height}
            onChangeText={(text) => setFormData({ ...formData, height: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Observações"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            mode="outlined"
            multiline
            style={styles.input}
          />
          <TextInput
            label="Progresso Q1"
            value={formData.progress.q1.toString()}
            onChangeText={(text) => setFormData({ ...formData, progress: { ...formData.progress, q1: parseInt(text) } })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Progresso Q2"
            value={formData.progress.q2.toString()}
            onChangeText={(text) => setFormData({ ...formData, progress: { ...formData.progress, q2: parseInt(text) } })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Progresso Q3"
            value={formData.progress.q3.toString()}
            onChangeText={(text) => setFormData({ ...formData, progress: { ...formData.progress, q3: parseInt(text) } })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Progresso Q4"
            value={formData.progress.q4.toString()}
            onChangeText={(text) => setFormData({ ...formData, progress: { ...formData.progress, q4: parseInt(text) } })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
            Salvar
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});
