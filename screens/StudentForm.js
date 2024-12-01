import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
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
    frequencyDays: student?.frequencyDays || [],
    financialData: student?.financialData || { monthlyFee: '', dueDate: '' },
  });

  // Função para formatar o CPF e limitar a 11 dígitos
  const formatCPF = (text) => {
    const onlyNumbers = text.replace(/\D/g, '').slice(0, 11); // Remove caracteres não numéricos e limita a 11 dígitos
    return onlyNumbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleSave = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('@students');
      const students = storedStudents ? JSON.parse(storedStudents) : [];

      const updatedStudents = formData.id
        ? students.map((s) => (s.id === formData.id ? formData : s))
        : [...students, { ...formData, id: Date.now().toString() }];

      await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));

      // Após salvar, direcionar para a página de registro de exercícios
      navigation.navigate('ExerciseLog', { student: { ...formData, id: updatedStudents.slice(-1)[0].id } });
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
    }
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const days = prev.frequencyDays.includes(day)
        ? prev.frequencyDays.filter((d) => d !== day)
        : [...prev.frequencyDays, day];
      return { ...prev, frequencyDays: days };
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>{formData.id ? 'Editar Aluno' : 'Novo Aluno'}</Text>

          {/* Dados Pessoais */}
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
            onChangeText={(text) => setFormData({ ...formData, cpf: formatCPF(text) })}
            mode="outlined"
            keyboardType="numeric"
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
            label="Observações e Objetivos"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            mode="outlined"
            multiline
            style={styles.input}
          />

          {/* Dias de Frequência */}
          <Text style={styles.sectionTitle}>Dias de Frequência</Text>
          <View style={styles.frequencyContainer}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <Checkbox.Item
                key={day}
                label={`Dia ${day}`}
                status={formData.frequencyDays.includes(day) ? 'checked' : 'unchecked'}
                onPress={() => toggleDay(day)}
              />
            ))}
          </View>

          {/* Informações Financeiras */}
          <Text style={styles.sectionTitle}>Informações Financeiras</Text>
          <TextInput
            label="Mensalidade (R$)"
            value={formData.financialData.monthlyFee}
            onChangeText={(text) =>
              setFormData((prev) => ({
                ...prev,
                financialData: { ...prev.financialData, monthlyFee: text },
              }))
            }
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Data de Vencimento"
            value={formData.financialData.dueDate}
            onChangeText={(text) =>
              setFormData((prev) => ({
                ...prev,
                financialData: { ...prev.financialData, dueDate: text },
              }))
            }
            mode="outlined"
            style={styles.input}
          />

          {/* Botão de Salvar */}
          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
            Salvar e Registrar Exercícios
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  frequencyContainer: {
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});
