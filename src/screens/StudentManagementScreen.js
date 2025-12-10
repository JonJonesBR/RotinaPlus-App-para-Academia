/**
 * StudentManagementScreen - Gerenciamento de alunos com design premium
 * 
 * Features:
 * - Lista de alunos com cards elegantes
 * - Avatar com iniciais coloridas
 * - Chips para dias de frequência
 * - Busca de alunos
 * - FAB para adicionar
 * - Ações rápidas
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
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
  SearchBar,
  Chip,
  EmptyState,
  SectionHeader,
} from '../components/common';

const DAYS_MAP = {
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
  7: 'Dom',
};

export default function StudentManagementScreen({ navigation }) {
  const { colors, spacing, borderRadius, shadows, isDark } = useTheme();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Animação do FAB
  const fabAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStudents();
    });

    // Animar FAB entrada
    Animated.spring(fabAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      delay: 300,
    }).start();

    return unsubscribe;
  }, [navigation]);

  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('@students');
      if (storedStudents) {
        const sortedStudents = JSON.parse(storedStudents).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setStudents(sortedStudents);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  // Filtrar alunos pela busca
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(
      student =>
        student.name.toLowerCase().includes(query) ||
        student.cpf?.includes(query)
    );
  }, [students, searchQuery]);

  const handleDeleteStudent = (student) => {
    Alert.alert(
      'Excluir Aluno',
      `Tem certeza que deseja excluir ${student.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const updatedStudents = students.filter((s) => s.id !== student.id);
            await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));
            setStudents(updatedStudents);
          },
        },
      ]
    );
  };

  const handleDeleteExercise = (studentId, exerciseId) => {
    Alert.alert('Excluir Exercício', 'Deseja excluir esta série?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const updatedStudents = students.map((student) => {
            if (student.id === studentId) {
              const updatedExercises = student.linkedExercises.filter(
                (exercise) => exercise.id !== exerciseId
              );
              return { ...student, linkedExercises: updatedExercises };
            }
            return student;
          });

          await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));
          setStudents(updatedStudents);
        },
      },
    ]);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderStudentCard = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <PremiumCard
        style={styles.studentCard}
        padding="none"
      >
        {/* Header do Card */}
        <Pressable
          onPress={() => toggleExpand(item.id)}
          style={styles.cardHeader}
        >
          <Avatar name={item.name} size="md" />

          <View style={styles.cardHeaderInfo}>
            <Text style={[styles.studentName, { color: colors.text.primary }]}>
              {item.name}
            </Text>
            <Text style={[styles.studentCpf, { color: colors.text.secondary }]}>
              CPF: {item.cpf || 'Não informado'}
            </Text>
          </View>

          <Icon
            name={isExpanded ? 'expand-less' : 'expand-more'}
            size={28}
            color={colors.text.disabled}
          />
        </Pressable>

        {/* Dias de frequência (sempre visíveis) */}
        {item.frequencyDays?.length > 0 && (
          <View style={styles.frequencyContainer}>
            {item.frequencyDays.map((day) => (
              <Chip
                key={day}
                label={DAYS_MAP[day]}
                size="sm"
                style={styles.dayChip}
              />
            ))}
          </View>
        )}

        {/* Conteúdo expandido */}
        {isExpanded && (
          <View style={[styles.expandedContent, { borderTopColor: colors.divider }]}>
            {/* Informações Pessoais */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                <Icon name="person" size={14} color={colors.text.secondary} /> DADOS PESSOAIS
              </Text>
              <View style={styles.infoGrid}>
                <InfoItem
                  label="Idade"
                  value={item.age ? `${item.age} anos` : '-'}
                  colors={colors}
                />
                <InfoItem
                  label="Peso"
                  value={item.weight ? `${item.weight} kg` : '-'}
                  colors={colors}
                />
                <InfoItem
                  label="Altura"
                  value={item.height ? `${item.height} cm` : '-'}
                  colors={colors}
                />
              </View>
              {item.notes && (
                <View style={[styles.notesBox, { backgroundColor: colors.surfaceVariant }]}>
                  <Icon name="notes" size={16} color={colors.text.secondary} />
                  <Text style={[styles.notesText, { color: colors.text.secondary }]}>
                    {item.notes}
                  </Text>
                </View>
              )}
            </View>

            {/* Informações Financeiras */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                <Icon name="payments" size={14} color={colors.text.secondary} /> FINANCEIRO
              </Text>
              <View style={styles.infoGrid}>
                <InfoItem
                  label="Mensalidade"
                  value={item.financialData?.monthlyFee
                    ? `R$ ${item.financialData.monthlyFee}`
                    : '-'
                  }
                  colors={colors}
                />
                <InfoItem
                  label="Vencimento"
                  value={item.financialData?.dueDate || '-'}
                  colors={colors}
                />
              </View>
            </View>

            {/* Exercícios Vinculados */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                <Icon name="fitness-center" size={14} color={colors.text.secondary} /> EXERCÍCIOS
              </Text>

              {item.linkedExercises?.length > 0 ? (
                item.linkedExercises.map((exercise) => (
                  <View
                    key={exercise.id}
                    style={[styles.exerciseItem, {
                      backgroundColor: colors.surfaceVariant,
                      borderLeftColor: colors.primary,
                    }]}
                  >
                    <View style={styles.exerciseInfo}>
                      <Text style={[styles.exerciseName, { color: colors.text.primary }]}>
                        {exercise.name}
                      </Text>
                      <Text style={[styles.exerciseDetails, { color: colors.text.secondary }]}>
                        {exercise.sets} séries × {exercise.reps} repetições
                      </Text>
                      <Text style={[styles.exerciseList, { color: colors.text.disabled }]} numberOfLines={1}>
                        {exercise.exercises?.join(', ')}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleDeleteExercise(item.id, exercise.id)}
                      style={styles.deleteExerciseBtn}
                    >
                      <Icon name="delete-outline" size={20} color={colors.danger} />
                    </Pressable>
                  </View>
                ))
              ) : (
                <Text style={[styles.noExercises, { color: colors.text.disabled }]}>
                  Nenhum exercício vinculado
                </Text>
              )}

              <PremiumButton
                title="Adicionar Exercícios"
                icon="add"
                variant="outline"
                size="sm"
                fullWidth
                onPress={() => navigation.navigate('ExerciseLog', { student: item })}
                style={styles.addExerciseBtn}
              />
            </View>

            {/* Ações */}
            <View style={styles.actions}>
              <PremiumButton
                title="Editar"
                icon="edit"
                variant="secondary"
                size="sm"
                onPress={() => navigation.navigate('StudentRegistration', { student: item })}
                style={styles.actionBtn}
              />
              <PremiumButton
                title="Excluir"
                icon="delete"
                variant="danger"
                size="sm"
                onPress={() => handleDeleteStudent(item)}
                style={styles.actionBtn}
              />
            </View>
          </View>
        )}
      </PremiumCard>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header com busca */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Meus Alunos
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {students.length} {students.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}
        </Text>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar por nome ou CPF..."
          style={styles.searchBar}
        />
      </View>

      {/* Lista ou Empty State */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={searchQuery ? 'search-off' : 'person-add'}
          title={searchQuery ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
          description={searchQuery
            ? 'Tente buscar por outro termo'
            : 'Comece adicionando seu primeiro aluno'
          }
          actionLabel={!searchQuery ? 'Adicionar Aluno' : undefined}
          onAction={!searchQuery ? () => navigation.navigate('StudentRegistration') : undefined}
        />
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id}
          renderItem={renderStudentCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [
              { scale: fabAnim },
              {
                translateY: fabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                })
              }
            ],
          }
        ]}
      >
        <Pressable
          style={[styles.fab, { backgroundColor: colors.primary }, shadows.fab]}
          onPress={() => navigation.navigate('StudentRegistration')}
        >
          <Icon name="person-add" size={28} color={colors.text.inverse} />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

// Componente auxiliar para exibir informações
function InfoItem({ label, value, colors }) {
  return (
    <View style={infoStyles.container}>
      <Text style={[infoStyles.label, { color: colors.text.disabled }]}>{label}</Text>
      <Text style={[infoStyles.value, { color: colors.text.primary }]}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 80,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 16,
  },
  searchBar: {
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },

  // Student Card
  studentCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '600',
  },
  studentCpf: {
    fontSize: 13,
    marginTop: 2,
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 6,
  },
  dayChip: {
    marginBottom: 0,
  },

  // Expanded Content
  expandedContent: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },

  // Exercises
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
  },
  exerciseDetails: {
    fontSize: 13,
    marginTop: 2,
  },
  exerciseList: {
    fontSize: 12,
    marginTop: 4,
  },
  deleteExerciseBtn: {
    padding: 8,
  },
  noExercises: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  addExerciseBtn: {
    marginTop: 4,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },

  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
