/**
 * ConfirmSeriesScreen - Tela de confirmação de vinculação premium
 * 
 * Features:
 * - Contadores elegantes para séries e reps
 * - Preview dos exercícios
 * - Resumo visual
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import {
  PremiumCard,
  PremiumButton,
  Avatar,
  Chip,
  SectionHeader,
} from '../components/common';

export default function ConfirmSeriesScreen({ route, navigation }) {
  const { colors, borderRadius, spacing, isDark } = useTheme();
  const { series, student } = route.params || {};

  const [sets, setSets] = React.useState(series?.sets || 3);
  const [reps, setReps] = React.useState(series?.reps || 10);
  const [loading, setLoading] = React.useState(false);

  // Estado de erro
  if (!student || !series) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <View style={[styles.errorIcon, { backgroundColor: colors.dangerLight }]}>
            <Icon name="error-outline" size={48} color={colors.danger} />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text.primary }]}>
            Algo deu errado
          </Text>
          <Text style={[styles.errorText, { color: colors.text.secondary }]}>
            Aluno ou série não foram selecionados corretamente.
          </Text>
          <PremiumButton
            title="Voltar"
            icon="arrow-back"
            variant="primary"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const storedStudents = await AsyncStorage.getItem('@students');
      const students = storedStudents ? JSON.parse(storedStudents) : [];

      const updatedStudents = students.map((s) => {
        if (s.id === student.id) {
          const updatedExercises = s.linkedExercises || [];
          return {
            ...s,
            linkedExercises: [
              ...updatedExercises,
              {
                id: `${series.id}-${Date.now()}`,
                name: series.name,
                exercises: series.exercises,
                sets,
                reps,
              },
            ],
          };
        }
        return s;
      });

      await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));

      Alert.alert(
        '✅ Sucesso!',
        `A série "${series.name}" foi vinculada ao aluno "${student.name}".`,
        [
          {
            text: 'Ver Aluno',
            onPress: () => navigation.navigate('StudentManagement'),
          },
          {
            text: 'Voltar ao Início',
            onPress: () => navigation.navigate('WelcomeScreen'),
          },
        ],
      );
    } catch (error) {
      console.error('Erro ao vincular série:', error);
      Alert.alert('Erro', 'Não foi possível vincular a série. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const CounterControl = ({ label, value, onDecrease, onIncrease, min = 1, icon }) => (
    <View style={[styles.counterCard, { backgroundColor: colors.surface }, styles.shadow]}>
      <View style={styles.counterHeader}>
        <Icon name={icon} size={20} color={colors.primary} />
        <Text style={[styles.counterLabel, { color: colors.text.secondary }]}>
          {label}
        </Text>
      </View>
      <View style={styles.counterControls}>
        <Pressable
          onPress={onDecrease}
          disabled={value <= min}
          style={({ pressed }) => [
            styles.counterButton,
            {
              backgroundColor: colors.surfaceVariant,
              opacity: value <= min ? 0.4 : pressed ? 0.7 : 1,
            },
          ]}
        >
          <Icon name="remove" size={24} color={colors.text.primary} />
        </Pressable>
        <Text style={[styles.counterValue, { color: colors.text.primary }]}>
          {value}
        </Text>
        <Pressable
          onPress={onIncrease}
          style={({ pressed }) => [
            styles.counterButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Icon name="add" size={24} color={colors.text.inverse} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Confirmar Vinculação
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Revise os detalhes e confirme
          </Text>
        </View>

        {/* Preview Card */}
        <PremiumCard variant="elevated" style={styles.previewCard}>
          {/* Aluno */}
          <View style={styles.previewSection}>
            <View style={styles.previewRow}>
              <Avatar name={student.name} size="md" />
              <View style={styles.previewInfo}>
                <Text style={[styles.previewLabel, { color: colors.text.disabled }]}>
                  ALUNO
                </Text>
                <Text style={[styles.previewValue, { color: colors.text.primary }]}>
                  {student.name}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Série */}
          <View style={styles.previewSection}>
            <View style={styles.previewRow}>
              <View style={[styles.seriesIcon, { backgroundColor: colors.primarySurface }]}>
                <Icon name="fitness-center" size={24} color={colors.primary} />
              </View>
              <View style={styles.previewInfo}>
                <Text style={[styles.previewLabel, { color: colors.text.disabled }]}>
                  SÉRIE
                </Text>
                <Text style={[styles.previewValue, { color: colors.text.primary }]}>
                  {series.name}
                </Text>
              </View>
            </View>
          </View>
        </PremiumCard>

        {/* Exercícios */}
        <SectionHeader
          title={`Exercícios (${series.exercises?.length || 0})`}
          icon="list"
        />

        <PremiumCard padding="md">
          {series.exercises?.map((exercise, index) => (
            <View
              key={index}
              style={[
                styles.exerciseItem,
                index < series.exercises.length - 1 && styles.exerciseItemBorder,
                { borderBottomColor: colors.divider },
              ]}
            >
              <View style={[styles.exerciseNumber, { backgroundColor: colors.primarySurface }]}>
                <Text style={[styles.exerciseNumberText, { color: colors.primary }]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={[styles.exerciseName, { color: colors.text.primary }]}>
                {exercise}
              </Text>
            </View>
          ))}
        </PremiumCard>

        {/* Configurações */}
        <SectionHeader title="Configurações" icon="settings" />

        <View style={styles.countersRow}>
          <CounterControl
            label="Séries"
            value={sets}
            icon="repeat"
            onDecrease={() => setSets((prev) => Math.max(1, prev - 1))}
            onIncrease={() => setSets((prev) => prev + 1)}
          />
          <CounterControl
            label="Repetições"
            value={reps}
            icon="sync"
            onDecrease={() => setReps((prev) => Math.max(1, prev - 1))}
            onIncrease={() => setReps((prev) => prev + 1)}
          />
        </View>

        {/* Resumo */}
        <View style={[styles.summary, { backgroundColor: colors.primarySurface }]}>
          <Icon name="info" size={20} color={colors.primary} />
          <Text style={[styles.summaryText, { color: colors.primary }]}>
            Cada exercício terá {sets} {sets === 1 ? 'série' : 'séries'} de {reps} {reps === 1 ? 'repetição' : 'repetições'}
          </Text>
        </View>

        {/* Botões */}
        <View style={styles.footer}>
          <PremiumButton
            title="Confirmar Vinculação"
            icon="check"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onPress={handleConfirm}
          />
          <PremiumButton
            title="Cancelar"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={styles.cancelBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },

  // Preview Card
  previewCard: {
    padding: 0,
    overflow: 'hidden',
  },
  previewSection: {
    padding: 16,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewInfo: {
    marginLeft: 14,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  previewValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  seriesIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
  },

  // Exercises
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  exerciseItemBorder: {
    borderBottomWidth: 1,
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
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Counters
  countersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  counterCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  counterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  counterLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 32,
    fontWeight: '700',
  },

  // Summary
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  summaryText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },

  // Footer
  footer: {
    marginTop: 24,
  },
  cancelBtn: {
    marginTop: 8,
  },

  // Error State
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    minWidth: 160,
  },
});
