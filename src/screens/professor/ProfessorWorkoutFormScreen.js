/**
 * ProfessorWorkoutFormScreen - Criar/Editar Treino
 * 
 * Formulário para criar séries de exercício
 */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import {
    UserService,
    AlunoService,
    WorkoutService
} from '../../services/storageService';
import { createWorkout, createExercise, WEEK_DAYS } from '../../models/dataModels';
import { PremiumCard, PremiumButton } from '../../components/common';

export default function ProfessorWorkoutFormScreen({ navigation, route }) {
    const { colors, shadows } = useTheme();
    const studentId = route.params?.studentId;
    const editWorkoutId = route.params?.workoutId;

    const [professor, setProfessor] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(studentId || '');
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState([createExercise()]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const user = await UserService.getCurrentUser();
        setProfessor(user);

        if (user) {
            const allStudents = await AlunoService.getByProfessorId(user.id);
            setStudents(allStudents);
        }
    };

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day].sort());
        }
    };

    const addExercise = () => {
        setExercises([...exercises, createExercise()]);
    };

    const removeExercise = (index) => {
        if (exercises.length > 1) {
            setExercises(exercises.filter((_, i) => i !== index));
        }
    };

    const updateExercise = (index, field, value) => {
        const updated = [...exercises];
        updated[index] = { ...updated[index], [field]: value };
        setExercises(updated);
    };

    const validateForm = () => {
        if (!selectedStudent) {
            Alert.alert('Erro', 'Selecione um aluno');
            return false;
        }
        if (!workoutName.trim()) {
            Alert.alert('Erro', 'Digite o nome do treino');
            return false;
        }
        if (selectedDays.length === 0) {
            Alert.alert('Erro', 'Selecione pelo menos um dia da semana');
            return false;
        }
        const hasValidExercise = exercises.some(e => e.name.trim());
        if (!hasValidExercise) {
            Alert.alert('Erro', 'Adicione pelo menos um exercício');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const validExercises = exercises.filter(e => e.name.trim());

            const workout = createWorkout({
                professorId: professor.id,
                studentId: selectedStudent,
                name: workoutName.trim(),
                exercises: validExercises,
                weekDays: selectedDays,
            });

            await WorkoutService.save(workout);

            Alert.alert(
                'Treino Salvo!',
                'Deseja gerar um QR Code para enviar ao aluno?',
                [
                    {
                        text: 'Depois',
                        onPress: () => navigation.goBack()
                    },
                    {
                        text: 'Gerar QR',
                        onPress: () => {
                            navigation.replace('ProfessorQRExport', {
                                type: 'workout',
                                workoutId: workout.id
                            });
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Erro ao salvar treino:', error);
            Alert.alert('Erro', 'Não foi possível salvar o treino');
        } finally {
            setLoading(false);
        }
    };

    const ExerciseCard = ({ exercise, index }) => (
        <View style={[styles.exerciseCard, { backgroundColor: colors.surface, ...shadows.small }]}>
            <View style={styles.exerciseHeader}>
                <View style={[styles.exerciseNumber, { backgroundColor: colors.primary }]}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <Text style={[styles.exerciseTitle, { color: colors.text.primary }]}>
                    Exercício {index + 1}
                </Text>
                {exercises.length > 1 && (
                    <Pressable onPress={() => removeExercise(index)}>
                        <Icon name="close" size={22} color={colors.danger} />
                    </Pressable>
                )}
            </View>

            <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                value={exercise.name}
                onChangeText={(v) => updateExercise(index, 'name', v)}
                placeholder="Nome do exercício"
                placeholderTextColor={colors.text.hint}
            />

            <View style={styles.exerciseRow}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Séries</Text>
                    <TextInput
                        style={[styles.smallInput, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                        value={String(exercise.sets)}
                        onChangeText={(v) => updateExercise(index, 'sets', parseInt(v) || 0)}
                        keyboardType="number-pad"
                        placeholderTextColor={colors.text.hint}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Reps</Text>
                    <TextInput
                        style={[styles.smallInput, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                        value={exercise.reps}
                        onChangeText={(v) => updateExercise(index, 'reps', v)}
                        placeholder="12-15"
                        placeholderTextColor={colors.text.hint}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Peso</Text>
                    <TextInput
                        style={[styles.smallInput, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                        value={exercise.weight}
                        onChangeText={(v) => updateExercise(index, 'weight', v)}
                        placeholder="10kg"
                        placeholderTextColor={colors.text.hint}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Desc</Text>
                    <TextInput
                        style={[styles.smallInput, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                        value={String(exercise.rest)}
                        onChangeText={(v) => updateExercise(index, 'rest', parseInt(v) || 60)}
                        keyboardType="number-pad"
                        placeholder="60s"
                        placeholderTextColor={colors.text.hint}
                    />
                </View>
            </View>

            <TextInput
                style={[styles.input, styles.notesInput, { backgroundColor: colors.surfaceVariant, color: colors.text.primary }]}
                value={exercise.notes}
                onChangeText={(v) => updateExercise(index, 'notes', v)}
                placeholder="Observações (opcional)"
                placeholderTextColor={colors.text.hint}
                multiline
            />
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Student Selection */}
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Aluno</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.studentsScroll}
                >
                    {students.map(student => (
                        <Pressable
                            key={student.id}
                            style={[
                                styles.studentChip,
                                {
                                    backgroundColor: selectedStudent === student.id
                                        ? colors.primary
                                        : colors.surface,
                                    borderColor: selectedStudent === student.id
                                        ? colors.primary
                                        : colors.border,
                                },
                            ]}
                            onPress={() => setSelectedStudent(student.id)}
                        >
                            <Text
                                style={[
                                    styles.studentChipText,
                                    { color: selectedStudent === student.id ? '#FFFFFF' : colors.text.primary }
                                ]}
                            >
                                {student.name.split(' ')[0]}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Workout Name */}
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                    Nome do Treino
                </Text>
                <TextInput
                    style={[styles.input, styles.nameInput, { backgroundColor: colors.surface, color: colors.text.primary }]}
                    value={workoutName}
                    onChangeText={setWorkoutName}
                    placeholder="Ex: Treino A - Peito e Tríceps"
                    placeholderTextColor={colors.text.hint}
                />

                {/* Days of Week */}
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                    Dias da Semana
                </Text>
                <View style={styles.daysContainer}>
                    {Object.entries(WEEK_DAYS).map(([day, info]) => (
                        <Pressable
                            key={day}
                            style={[
                                styles.dayButton,
                                {
                                    backgroundColor: selectedDays.includes(parseInt(day))
                                        ? colors.primary
                                        : colors.surface,
                                    borderColor: selectedDays.includes(parseInt(day))
                                        ? colors.primary
                                        : colors.border,
                                },
                            ]}
                            onPress={() => toggleDay(parseInt(day))}
                        >
                            <Text
                                style={[
                                    styles.dayButtonText,
                                    {
                                        color: selectedDays.includes(parseInt(day))
                                            ? '#FFFFFF'
                                            : colors.text.secondary
                                    }
                                ]}
                            >
                                {info.short}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Exercises */}
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                    Exercícios
                </Text>
                {exercises.map((exercise, index) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
                ))}

                <Pressable
                    style={[styles.addExerciseButton, { borderColor: colors.primary }]}
                    onPress={addExercise}
                >
                    <Icon name="add" size={22} color={colors.primary} />
                    <Text style={[styles.addExerciseText, { color: colors.primary }]}>
                        Adicionar Exercício
                    </Text>
                </Pressable>

                {/* Save Button */}
                <View style={styles.footer}>
                    <PremiumButton
                        title="Salvar Treino"
                        onPress={handleSave}
                        loading={loading}
                        icon="save"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 16,
    },
    studentsScroll: {
        marginBottom: 8,
    },
    studentChip: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1.5,
    },
    studentChipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
    },
    nameInput: {
        marginBottom: 8,
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    dayButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
    },
    dayButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    exerciseCard: {
        padding: 14,
        borderRadius: 14,
        marginBottom: 12,
    },
    exerciseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    exerciseNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exerciseNumberText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    exerciseTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
    },
    exerciseRow: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 10,
    },
    inputGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 4,
    },
    smallInput: {
        padding: 10,
        borderRadius: 8,
        fontSize: 14,
        textAlign: 'center',
    },
    notesInput: {
        minHeight: 60,
        textAlignVertical: 'top',
    },
    addExerciseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        gap: 8,
    },
    addExerciseText: {
        fontSize: 15,
        fontWeight: '600',
    },
    footer: {
        marginTop: 24,
    },
});
