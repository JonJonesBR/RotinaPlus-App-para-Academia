/**
 * ExerciseLogScreen - Registro de exercícios com design premium
 * 
 * Features:
 * - Seleção de aluno com cards elegantes
 * - Cards de séries com preview
 * - Ações rápidas
 * - Layout corrigido sem sobreposição
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import {
  PremiumCard,
  PremiumButton,
  Avatar,
  SectionHeader,
  Chip,
} from '../components/common';

export default function ExerciseLogScreen({ navigation, route }) {
  const { colors, spacing, borderRadius, shadows, isDark } = useTheme();
  const [selectedStudent, setSelectedStudent] = useState(route.params?.student || null);
  const [students, setStudents] = useState([]);
  const [customPlans, setCustomPlans] = useState([]);

  // Animações
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadStudents();
    loadPlans();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const unsubscribe = navigation.addListener('focus', () => {
      loadPlans();
      loadStudents();
    });

    return unsubscribe;
  }, [navigation]);

  // Atualizar aluno selecionado quando vier de outra tela
  useEffect(() => {
    if (route.params?.student) {
      setSelectedStudent(route.params.student);
    }
  }, [route.params?.student]);

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

  const handleDeletePlan = (plan) => {
    Alert.alert(
      'Excluir Série',
      `Deseja excluir a série "${plan.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const updatedPlans = customPlans.filter((p) => p.id !== plan.id);
            await AsyncStorage.setItem('@customPlans', JSON.stringify(updatedPlans));
            setCustomPlans(updatedPlans);
          },
        },
      ]
    );
  };

  const handleLinkPlan = (plan) => {
    if (!selectedStudent) {
      Alert.alert(
        'Selecione um Aluno',
        'Por favor, selecione um aluno antes de vincular uma série.',
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate('ConfirmSeries', {
      series: plan,
      student: selectedStudent,
    });
  };

  const renderStudentItem = ({ item }) => {
    const isSelected = selectedStudent?.id === item.id;

    return (
      <Pressable
        onPress={() => setSelectedStudent(item)}
        style={({ pressed }) => [
          styles.studentItem,
          {
            backgroundColor: isSelected ? colors.primary : colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Avatar
          name={item.name}
          size="sm"
          style={isSelected && { backgroundColor: 'rgba(255,255,255,0.2)' }}
        />
        <Text
          style={[
            styles.studentItemName,
            { color: isSelected ? colors.text.inverse : colors.text.primary }
          ]}
          numberOfLines={1}
        >
          {item.name.split(' ')[0]}
        </Text>
        {isSelected && (
          <Icon name="check" size={16} color={colors.text.inverse} />
        )}
      </Pressable>
    );
  };

  const renderPlanCard = (item) => (
    <PremiumCard key={item.id} style={styles.planCard}>
      <View style={styles.planHeader}>
        <View style={[styles.planIcon, { backgroundColor: colors.primarySurface }]}>
          <Icon name="fitness-center" size={20} color={colors.primary} />
        </View>
        <View style={styles.planInfo}>
          <Text style={[styles.planName, { color: colors.text.primary }]}>
            {item.name}
          </Text>
          <Text style={[styles.planDetails, { color: colors.text.secondary }]}>
            {item.exercises?.length || 0} exercícios
          </Text>
        </View>
      </View>

      {/* Preview dos exercícios */}
      {item.exercises?.length > 0 && (
        <View style={styles.exercisesPreview}>
          <View style={styles.exerciseChips}>
            {item.exercises.slice(0, 3).map((exercise, index) => (
              <Chip
                key={index}
                label={exercise}
                size="sm"
                variant="outline"
                style={styles.exerciseChip}
              />
            ))}
            {item.exercises.length > 3 && (
              <Chip
                label={`+${item.exercises.length - 3}`}
                size="sm"
                style={styles.moreChip}
              />
            )}
          </View>
        </View>
      )}

      {/* Ações */}
      <View style={[styles.planActions, { borderTopColor: colors.divider }]}>
        <View style={styles.planActionsLeft}>
          <PremiumButton
            title="Editar"
            icon="edit"
            variant="ghost"
            size="sm"
            onPress={() => navigation.navigate('SeriesForm', { series: item })}
          />
          <PremiumButton
            title="Excluir"
            icon="delete"
            variant="ghost"
            size="sm"
            onPress={() => handleDeletePlan(item)}
          />
        </View>
        <PremiumButton
          title="Vincular"
          icon="link"
          variant="primary"
          size="sm"
          onPress={() => handleLinkPlan(item)}
          style={styles.linkButton}
        />
      </View>
    </PremiumCard>
  );

  // Renderiza o conteúdo de séries vazio
  const renderEmptyPlans = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceVariant }]}>
        <Icon name="fitness-center" size={32} color={colors.text.disabled} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text.secondary }]}>
        Nenhuma série criada
      </Text>
      <Text style={[styles.emptyText, { color: colors.text.disabled }]}>
        Crie sua primeira série de exercícios para vincular aos alunos
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Exercícios
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Gerencie séries e vincule a alunos
            </Text>
          </View>

          {/* Seleção de Aluno */}
          <SectionHeader
            title="Selecione um Aluno"
            icon="person"
          />

          {students.length > 0 ? (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.studentsList}
              >
                {students.map((student) => (
                  <View key={student.id}>
                    {renderStudentItem({ item: student })}
                  </View>
                ))}
              </ScrollView>

              {selectedStudent && (
                <View style={[styles.selectedBanner, { backgroundColor: colors.primarySurface }]}>
                  <Icon name="check-circle" size={18} color={colors.primary} />
                  <Text style={[styles.selectedText, { color: colors.primary }]}>
                    Aluno selecionado: <Text style={{ fontWeight: '700' }}>{selectedStudent.name}</Text>
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <PremiumCard variant="outlined" style={styles.noStudentsCard}>
              <View style={styles.noStudentsContent}>
                <Icon name="person-add" size={24} color={colors.text.disabled} />
                <Text style={[styles.noStudentsText, { color: colors.text.secondary }]}>
                  Nenhum aluno cadastrado
                </Text>
                <PremiumButton
                  title="Cadastrar Aluno"
                  variant="primary"
                  size="sm"
                  onPress={() => navigation.navigate('StudentRegistration')}
                />
              </View>
            </PremiumCard>
          )}

          {/* Séries de Exercícios */}
          <SectionHeader
            title="Séries de Exercícios"
            icon="fitness-center"
          />

          {customPlans.length > 0 ? (
            <View style={styles.plansList}>
              {customPlans.map((plan) => renderPlanCard(plan))}
            </View>
          ) : (
            renderEmptyPlans()
          )}
        </Animated.View>
      </ScrollView>

      {/* Botões fixos no rodapé */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <PremiumButton
          title="Nova Série"
          icon="add"
          variant="primary"
          fullWidth
          onPress={() => navigation.navigate('SeriesForm')}
          style={styles.footerButton}
        />
        <PremiumButton
          title="Voltar ao Início"
          icon="home"
          variant="outline"
          fullWidth
          onPress={() => navigation.navigate('WelcomeScreen')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
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

  // Students List
  studentsList: {
    paddingVertical: 4,
    gap: 10,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 50,
    borderWidth: 1.5,
    gap: 8,
    marginRight: 10,
  },
  studentItemName: {
    fontSize: 14,
    fontWeight: '600',
    maxWidth: 80,
  },
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  selectedText: {
    fontSize: 14,
    flex: 1,
  },

  // No students
  noStudentsCard: {
    marginTop: 8,
  },
  noStudentsContent: {
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  noStudentsText: {
    fontSize: 14,
  },

  // Plans List
  plansList: {
    marginTop: 8,
  },
  planCard: {
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 17,
    fontWeight: '600',
  },
  planDetails: {
    fontSize: 13,
    marginTop: 2,
  },
  exercisesPreview: {
    marginBottom: 12,
  },
  exerciseChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  exerciseChip: {
    marginBottom: 0,
  },
  moreChip: {
    marginBottom: 0,
  },
  planActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  planActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkButton: {
    minWidth: 100,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Footer
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    gap: 10,
  },
  footerButton: {
    marginBottom: 0,
  },
});
