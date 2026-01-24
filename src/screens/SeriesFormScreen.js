/**
 * SeriesFormScreen - Formulário de séries de exercícios premium
 * 
 * Features:
 * - Design moderno com cards
 * - Lista de exercícios elegante
 * - Layout corrigido sem sobreposição
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { TextInput as PaperInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import {
  PremiumCard,
  PremiumButton,
  SectionHeader,
} from '../components/common';

export default function SeriesFormScreen({ route, navigation }) {
  const { colors, borderRadius, spacing, isDark } = useTheme();
  const { series } = route.params || {};
  const isEditing = !!series?.id;

  const [name, setName] = useState(series?.name || '');
  const [exercises, setExercises] = useState(series?.exercises || []);
  const [newExercise, setNewExercise] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  // Tema do input
  const inputTheme = {
    colors: {
      primary: colors.primary,
      error: colors.danger,
      background: colors.surface,
      text: colors.text.primary,
      placeholder: colors.text.hint,
      outline: colors.border,
    },
    roundness: borderRadius.md,
  };

  const handleAddExercise = () => {
    if (!newExercise.trim()) {
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
      setNameError('Nome da série é obrigatório');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert(
        'Atenção',
        'Adicione pelo menos um exercício à série.',
        [{ text: 'OK' }],
      );
      return;
    }

    setLoading(true);
    const newSeries = {
      id: series?.id || Date.now().toString(),
      name: name.trim(),
      exercises,
      sets: series?.sets || 3,
      reps: series?.reps || 10,
    };

    try {
      const storedPlans = await AsyncStorage.getItem('@customPlans');
      const customPlans = storedPlans ? JSON.parse(storedPlans) : [];

      const updatedPlans = series
        ? customPlans.map((plan) => (plan.id === series.id ? newSeries : plan))
        : [...customPlans, newSeries];

      await AsyncStorage.setItem('@customPlans', JSON.stringify(updatedPlans));

      navigation.navigate('ExerciseLog', { refresh: true });
    } catch (error) {
      console.error('Erro ao salvar a série:', error);
      Alert.alert('Erro', 'Não foi possível salvar a série. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderExerciseItem = (item, index) => (
    <View
      key={index}
      style={[
        styles.exerciseItem,
        {
          backgroundColor: colors.surfaceVariant,
          borderLeftColor: colors.primary,
        },
      ]}
    >
      <View style={styles.exerciseContent}>
        <View style={[styles.exerciseNumber, { backgroundColor: colors.primary }]}>
          <Text style={[styles.exerciseNumberText, { color: colors.text.inverse }]}>
            {index + 1}
          </Text>
        </View>
        <Text style={[styles.exerciseText, { color: colors.text.primary }]}>
          {item}
        </Text>
      </View>
      <Pressable
        onPress={() => handleDeleteExercise(index)}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && { opacity: 0.6 },
        ]}
      >
        <Icon name="close" size={20} color={colors.danger} />
      </Pressable>
    </View>
  );

  // Renderiza estado vazio de exercícios
  const renderEmptyExercises = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceVariant }]}>
        <Icon name="fitness-center" size={32} color={colors.text.disabled} />
      </View>
      <Text style={[styles.emptyText, { color: colors.text.disabled }]}>
        Nenhum exercício adicionado
      </Text>
      <Text style={[styles.emptyHint, { color: colors.text.hint }]}>
        Digite o nome do exercício acima e clique em +
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              {isEditing ? 'Editar Série' : 'Nova Série'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {isEditing
                ? 'Atualize os exercícios da série'
                : 'Crie uma nova série de exercícios'
              }
            </Text>
          </View>

          {/* Nome da Série */}
          <SectionHeader title="Informações" icon="info" />

          <PremiumCard padding="md">
            <PaperInput
              label="Nome da série *"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError('');
              }}
              mode="outlined"
              theme={inputTheme}
              error={!!nameError}
              left={<PaperInput.Icon icon="format-title" color={colors.text.secondary} />}
              placeholder="Ex: Treino A - Peito e Tríceps"
              style={styles.input}
            />
            {nameError && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {nameError}
              </Text>
            )}
          </PremiumCard>

          {/* Adicionar Exercício */}
          <SectionHeader
            title={`Exercícios (${exercises.length})`}
            icon="fitness-center"
          />

          <PremiumCard padding="md" style={styles.addCard}>
            <View style={styles.addExerciseRow}>
              <PaperInput
                label="Nome do exercício"
                value={newExercise}
                onChangeText={setNewExercise}
                mode="outlined"
                theme={inputTheme}
                style={styles.addInput}
                placeholder="Ex: Supino reto"
                onSubmitEditing={handleAddExercise}
                returnKeyType="done"
              />
              <Pressable
                onPress={handleAddExercise}
                style={({ pressed }) => [
                  styles.addButton,
                  { backgroundColor: colors.primary },
                  pressed && { opacity: 0.8 },
                  !newExercise.trim() && { opacity: 0.5 },
                ]}
                disabled={!newExercise.trim()}
              >
                <Icon name="add" size={28} color={colors.text.inverse} />
              </Pressable>
            </View>
          </PremiumCard>

          {/* Lista de Exercícios ou Estado Vazio */}
          {exercises.length > 0 ? (
            <View style={styles.exercisesList}>
              {exercises.map((exercise, index) => renderExerciseItem(exercise, index))}
            </View>
          ) : (
            renderEmptyExercises()
          )}

          {/* Botões */}
          <View style={styles.footer}>
            <PremiumButton
              title={isEditing ? 'Salvar Alterações' : 'Criar Série'}
              icon="check"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={handleSave}
              disabled={!name.trim() || exercises.length === 0}
            />
            <PremiumButton
              title="Cancelar"
              variant="ghost"
              onPress={() => navigation.goBack()}
              style={styles.cancelBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },

  // Input
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    fontSize: 12,
    marginTop: -4,
    marginLeft: 4,
  },

  // Add Exercise
  addCard: {
    marginBottom: 16,
  },
  addExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addInput: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  // Exercises List
  exercisesList: {
    marginTop: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 10,
  },
  exerciseContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 13,
    fontWeight: '700',
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Footer
  footer: {
    marginTop: 24,
  },
  cancelBtn: {
    marginTop: 8,
  },
});
