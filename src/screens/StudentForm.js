/**
 * StudentForm - Formulário de cadastro/edição de alunos premium
 * 
 * Features:
 * - Design moderno com seções visuais
 * - Chips selecionáveis para dias da semana
 * - Validação visual inline
 * - Feedback de loading no botão
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { TextInput as PaperInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import {
  PremiumButton,
  PremiumCard,
  SectionHeader,
  Chip,
} from '../components/common';

const DAYS_OF_WEEK = [
  { id: 1, short: 'Seg', full: 'Segunda' },
  { id: 2, short: 'Ter', full: 'Terça' },
  { id: 3, short: 'Qua', full: 'Quarta' },
  { id: 4, short: 'Qui', full: 'Quinta' },
  { id: 5, short: 'Sex', full: 'Sexta' },
  { id: 6, short: 'Sáb', full: 'Sábado' },
  { id: 7, short: 'Dom', full: 'Domingo' },
];

export default function StudentForm({ route, navigation }) {
  const { colors, spacing, borderRadius, isDark } = useTheme();
  const { student } = route.params || {};
  const isEditing = !!student?.id;

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
    linkedExercises: student?.linkedExercises || [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Formatar CPF
  const formatCPF = (text) => {
    const onlyNumbers = text.replace(/\D/g, '').slice(0, 11);
    return onlyNumbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  // Formatar valor monetário
  const formatMoney = (text) => {
    const onlyNumbers = text.replace(/\D/g, '');
    if (!onlyNumbers) return '';
    const value = parseInt(onlyNumbers, 10) / 100;
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  // Validação
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Toggle dia da semana
  const toggleDay = (dayId) => {
    setFormData((prev) => {
      const days = prev.frequencyDays.includes(dayId)
        ? prev.frequencyDays.filter((d) => d !== dayId)
        : [...prev.frequencyDays, dayId].sort((a, b) => a - b);
      return { ...prev, frequencyDays: days };
    });
  };

  // Salvar
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const storedStudents = await AsyncStorage.getItem('@students');
      const students = storedStudents ? JSON.parse(storedStudents) : [];

      const studentData = {
        ...formData,
        id: formData.id || Date.now().toString(),
      };

      const updatedStudents = formData.id
        ? students.map((s) => (s.id === formData.id ? studentData : s))
        : [...students, studentData];

      await AsyncStorage.setItem('@students', JSON.stringify(updatedStudents));

      // Navegar para registro de exercícios
      navigation.navigate('ExerciseLog', { student: studentData });
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
    } finally {
      setLoading(false);
    }
  };

  // Estilo customizado para inputs
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
              {isEditing ? 'Editar Aluno' : 'Novo Aluno'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {isEditing
                ? 'Atualize as informações do aluno'
                : 'Preencha os dados para cadastrar um novo aluno'
              }
            </Text>
          </View>

          {/* Dados Pessoais */}
          <SectionHeader title="Dados Pessoais" icon="person" />

          <PremiumCard padding="md">
            <PaperInput
              label="Nome completo *"
              value={formData.name}
              onChangeText={(text) => {
                setFormData({ ...formData, name: text });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              mode="outlined"
              theme={inputTheme}
              error={!!errors.name}
              left={<PaperInput.Icon icon="account" color={colors.text.secondary} />}
              style={styles.input}
            />
            {errors.name && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {errors.name}
              </Text>
            )}

            <PaperInput
              label="CPF"
              value={formData.cpf}
              onChangeText={(text) => setFormData({ ...formData, cpf: formatCPF(text) })}
              mode="outlined"
              theme={inputTheme}
              keyboardType="numeric"
              left={<PaperInput.Icon icon="card-account-details" color={colors.text.secondary} />}
              style={styles.input}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <PaperInput
                  label="Idade"
                  value={formData.age}
                  onChangeText={(text) => setFormData({ ...formData, age: text.replace(/\D/g, '') })}
                  mode="outlined"
                  theme={inputTheme}
                  keyboardType="numeric"
                  right={<PaperInput.Affix text="anos" />}
                  style={styles.input}
                />
              </View>
              <View style={styles.halfInput}>
                <PaperInput
                  label="Peso"
                  value={formData.weight}
                  onChangeText={(text) => setFormData({ ...formData, weight: text.replace(/[^\d.,]/g, '') })}
                  mode="outlined"
                  theme={inputTheme}
                  keyboardType="decimal-pad"
                  right={<PaperInput.Affix text="kg" />}
                  style={styles.input}
                />
              </View>
            </View>

            <PaperInput
              label="Altura"
              value={formData.height}
              onChangeText={(text) => setFormData({ ...formData, height: text.replace(/\D/g, '') })}
              mode="outlined"
              theme={inputTheme}
              keyboardType="numeric"
              right={<PaperInput.Affix text="cm" />}
              style={styles.input}
            />

            <PaperInput
              label="Observações e objetivos"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              mode="outlined"
              theme={inputTheme}
              multiline
              numberOfLines={3}
              left={<PaperInput.Icon icon="note-text" color={colors.text.secondary} />}
              style={[styles.input, styles.textArea]}
            />
          </PremiumCard>

          {/* Dias de Frequência */}
          <SectionHeader title="Dias de Frequência" icon="calendar-today" />

          <PremiumCard padding="md">
            <Text style={[styles.helperText, { color: colors.text.secondary }]}>
              Selecione os dias que o aluno frequenta a academia
            </Text>
            <View style={styles.daysContainer}>
              {DAYS_OF_WEEK.map((day) => (
                <Pressable
                  key={day.id}
                  onPress={() => toggleDay(day.id)}
                  style={({ pressed }) => [
                    styles.dayButton,
                    {
                      backgroundColor: formData.frequencyDays.includes(day.id)
                        ? colors.primary
                        : colors.surfaceVariant,
                      borderColor: formData.frequencyDays.includes(day.id)
                        ? colors.primary
                        : colors.border,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    {
                      color: formData.frequencyDays.includes(day.id)
                        ? colors.text.inverse
                        : colors.text.primary,
                    },
                  ]}>
                    {day.short}
                  </Text>
                </Pressable>
              ))}
            </View>
            {formData.frequencyDays.length > 0 && (
              <Text style={[styles.selectedDays, { color: colors.text.secondary }]}>
                {formData.frequencyDays.length} {formData.frequencyDays.length === 1 ? 'dia' : 'dias'} selecionado{formData.frequencyDays.length > 1 ? 's' : ''}
              </Text>
            )}
          </PremiumCard>

          {/* Informações Financeiras */}
          <SectionHeader title="Informações Financeiras" icon="payments" />

          <PremiumCard padding="md">
            <PaperInput
              label="Mensalidade"
              value={formData.financialData.monthlyFee}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  financialData: { ...prev.financialData, monthlyFee: formatMoney(text) },
                }))
              }
              mode="outlined"
              theme={inputTheme}
              keyboardType="numeric"
              left={<PaperInput.Affix text="R$" />}
              style={styles.input}
            />

            <PaperInput
              label="Data de vencimento"
              value={formData.financialData.dueDate}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  financialData: { ...prev.financialData, dueDate: text },
                }))
              }
              mode="outlined"
              theme={inputTheme}
              placeholder="Ex: dia 10"
              left={<PaperInput.Icon icon="calendar" color={colors.text.secondary} />}
              style={styles.input}
            />
          </PremiumCard>

          {/* Botão de Salvar */}
          <View style={styles.footer}>
            <PremiumButton
              title={isEditing ? 'Salvar Alterações' : 'Cadastrar e Vincular Exercícios'}
              icon={isEditing ? 'save' : 'arrow-forward'}
              iconPosition="right"
              variant="primary"
              fullWidth
              loading={loading}
              onPress={handleSave}
              size="lg"
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
    lineHeight: 22,
  },

  // Inputs
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  textArea: {
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  helperText: {
    fontSize: 14,
    marginBottom: 16,
  },

  // Days selector
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedDays: {
    fontSize: 13,
    marginTop: 12,
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
