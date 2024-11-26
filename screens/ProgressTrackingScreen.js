import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';

export default function ProgressTrackingScreen() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.studentItem} onPress={() => setSelectedStudent(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProgressChart = () => {
    if (!selectedStudent || !selectedStudent.progress) return null;

    const data = [
      { quarter: 1, earnings: selectedStudent.progress.q1 || 0 },
      { quarter: 2, earnings: selectedStudent.progress.q2 || 0 },
      { quarter: 3, earnings: selectedStudent.progress.q3 || 0 },
      { quarter: 4, earnings: selectedStudent.progress.q4 || 0 },
    ];

    return (
      <VictoryChart>
        <VictoryAxis tickValues={[1, 2, 3, 4]} tickFormat={['Q1', 'Q2', 'Q3', 'Q4']} />
        <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
        <VictoryBar data={data} x="quarter" y="earnings" />
      </VictoryChart>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acompanhamento de Progresso</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      {renderProgressChart()}
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
  listContainer: {
    paddingVertical: 20,
  },
  studentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
