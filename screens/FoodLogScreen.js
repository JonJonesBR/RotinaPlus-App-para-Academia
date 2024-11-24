import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import foodData from '../data/foodData';

export default function FoodLogScreen() {
  const [selectedMeal, setSelectedMeal] = useState('Café da Manhã');
  const [meals, setMeals] = useState({});
  const [search, setSearch] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(foodData);
  const [planType, setPlanType] = useState('Diário'); // Planejamento inicial: Diário

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const storedMeals = await AsyncStorage.getItem('meals');
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }
    } catch (error) {
      console.error('Erro ao carregar refeições:', error);
    }
  };

  const saveMeals = async (updatedMeals) => {
    try {
      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
    } catch (error) {
      console.error('Erro ao salvar refeições:', error);
    }
  };

  const addFoodToMeal = (food) => {
    const updatedMeals = {
      ...meals,
      [planType]: {
        ...(meals[planType] || {}),
        [selectedMeal]: [
          ...(meals[planType]?.[selectedMeal] || []),
          food,
        ],
      },
    };
    setMeals(updatedMeals);
    saveMeals(updatedMeals);
  };

  const removeFoodFromMeal = (foodId) => {
    const updatedMeals = {
      ...meals,
      [planType]: {
        ...(meals[planType] || {}),
        [selectedMeal]: meals[planType]?.[selectedMeal]?.filter(
          (food) => food.id !== foodId
        ),
      },
    };
    setMeals(updatedMeals);
    saveMeals(updatedMeals);
  };

  const filterFoods = (text) => {
    setSearch(text);
    if (text) {
      const filtered = foodData.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods(foodData);
    }
  };

  const handlePlanTypeChange = (type) => {
    setPlanType(type);
    Alert.alert('Planejamento Alterado', `Planejamento definido como ${type}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Alimentos</Text>

      {/* Planejamento de Refeições */}
      <View style={styles.planSelector}>
        {['Diário', 'Semanal', 'Mensal'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.planButton,
              planType === type && styles.selectedPlanButton,
            ]}
            onPress={() => handlePlanTypeChange(type)}
          >
            <Text style={styles.planButtonText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Seletor de refeição */}
      <View style={styles.mealSelectorContainer}>
        <FlatList
          data={['Café da Manhã', 'Almoço', 'Café da Tarde', 'Jantar']}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.mealButton,
                selectedMeal === item && styles.selectedMealButton,
              ]}
              onPress={() => setSelectedMeal(item)}
            >
              <Text style={styles.mealButtonText}>{item}</Text>
            </TouchableOpacity>
          )}
          numColumns={2} // Botões em duas colunas
          columnWrapperStyle={styles.columnWrapper} // Estilo da linha
        />
      </View>

      {/* Lista de alimentos filtrados */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar alimento..."
        value={search}
        onChangeText={filterFoods}
      />
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.foodItem}
            onPress={() => addFoodToMeal(item)}
          >
            <Text>{item.name}</Text>
            <Text>{item.calories} kcal</Text>
          </TouchableOpacity>
        )}
        nestedScrollEnabled={true}
        style={styles.flatList}
      />

      {/* Alimentos na refeição selecionada */}
      <Text style={styles.subtitle}>
        Itens em {selectedMeal} ({planType}):
      </Text>
      <FlatList
        data={meals[planType]?.[selectedMeal] || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text>{item.name}</Text>
            <Text>{item.calories} kcal</Text>
            <TouchableOpacity onPress={() => removeFoodFromMeal(item.id)}>
              <Text style={styles.removeButton}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
        nestedScrollEnabled={true}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  planSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  planButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  selectedPlanButton: {
    backgroundColor: '#6C63FF',
  },
  planButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mealSelectorContainer: {
    marginBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Alinha uniformemente os itens da linha
    marginBottom: 10, // Espaçamento entre as linhas
  },
  mealButton: {
    flex: 1, // Cada botão ocupa espaço proporcional
    margin: 5, // Espaçamento entre botões
    padding: 10, // Espaçamento interno do botão
    backgroundColor: '#ddd', // Cor de fundo
    borderRadius: 5, // Borda arredondada
    alignItems: 'center', // Centraliza o texto
  },
  selectedMealButton: {
    backgroundColor: '#6C63FF', // Cor de fundo para o botão selecionado
  },
  mealButtonText: {
    color: '#fff', // Cor do texto
    fontWeight: 'bold', // Negrito no texto
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  foodItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  removeButton: {
    color: 'red',
  },
  flatList: {
    maxHeight: 200,
  },
});
