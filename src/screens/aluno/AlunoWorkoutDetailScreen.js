/**
 * AlunoWorkoutDetailScreen - Detalhes e Execução do Treino
 * 
 * Exibe os exercícios do treino e permite marcar como feitos
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Animated,
    Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { WorkoutService } from '../../services/storageService';
import { PremiumCard, PremiumButton } from '../../components/common';

export default function AlunoWorkoutDetailScreen({ navigation, route }) {
    const { colors, shadows } = useTheme();
    const workoutId = route.params?.workoutId;

    const [workout, setWorkout] = useState(null);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [activeTimer, setActiveTimer] = useState(null);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const timerRef = useRef(null);
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadWorkout();
    }, []);

    useEffect(() => {
        // Atualiza animação de progresso
        const progress = workout?.exercises?.length
            ? completedExercises.length / workout.exercises.length
            : 0;

        Animated.spring(progressAnim, {
            toValue: progress,
            useNativeDriver: false,
        }).start();
    }, [completedExercises, workout]);

    useEffect(() => {
        // Timer cleanup
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const loadWorkout = async () => {
        if (workoutId) {
            const data = await WorkoutService.getById(workoutId);
            setWorkout(data);
        }
    };

    const toggleExercise = (exerciseId) => {
        if (completedExercises.includes(exerciseId)) {
            setCompletedExercises(completedExercises.filter(id => id !== exerciseId));
        } else {
            setCompletedExercises([...completedExercises, exerciseId]);
            Vibration.vibrate(50);
        }
    };

    const startTimer = (exerciseId, seconds) => {
        // Para timer anterior se existir
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        setActiveTimer(exerciseId);
        setTimerSeconds(seconds);

        timerRef.current = setInterval(() => {
            setTimerSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setActiveTimer(null);
                    Vibration.vibrate([0, 200, 100, 200]);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setActiveTimer(null);
        setTimerSeconds(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFinishWorkout = () => {
        const allCompleted = completedExercises.length === workout?.exercises?.length;

        if (allCompleted) {
            navigation.goBack();
        } else {
            // Oferece opção de finalizar parcialmente
            navigation.goBack();
        }
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    if (!workout) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text.secondary }}>Carregando...</Text>
            </View>
        );
    }

    const ExerciseCard = ({ exercise, index }) => {
        const isCompleted = completedExercises.includes(exercise.id);
        const isTimerActive = activeTimer === exercise.id;

        return (
            <Pressable onPress={() => toggleExercise(exercise.id)}>
                <PremiumCard
                    style={[
                        styles.exerciseCard,
                        isCompleted && {
                            backgroundColor: colors.successLight,
                            borderLeftWidth: 4,
                            borderLeftColor: colors.success,
                        }
                    ]}
                >
                    <View style={styles.exerciseHeader}>
                        <View style={styles.exerciseLeft}>
                            <View style={[
                                styles.checkbox,
                                {
                                    backgroundColor: isCompleted ? colors.success : 'transparent',
                                    borderColor: isCompleted ? colors.success : colors.border,
                                }
                            ]}>
                                {isCompleted && (
                                    <Icon name="check" size={18} color="#FFFFFF" />
                                )}
                            </View>
                            <View style={styles.exerciseInfo}>
                                <Text style={[
                                    styles.exerciseName,
                                    {
                                        color: colors.text.primary,
                                        textDecorationLine: isCompleted ? 'line-through' : 'none',
                                    }
                                ]}>
                                    {exercise.name}
                                </Text>
                                <Text style={[styles.exerciseDetails, { color: colors.text.secondary }]}>
                                    {exercise.sets} séries × {exercise.reps} reps
                                    {exercise.weight ? ` • ${exercise.weight}` : ''}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {!isCompleted && (
                        <View style={styles.exerciseActions}>
                            {/* Rest Timer */}
                            <Pressable
                                style={[
                                    styles.timerButton,
                                    {
                                        backgroundColor: isTimerActive ? colors.primary : colors.surfaceVariant
                                    }
                                ]}
                                onPress={() => {
                                    if (isTimerActive) {
                                        stopTimer();
                                    } else {
                                        startTimer(exercise.id, exercise.rest || 60);
                                    }
                                }}
                            >
                                <Icon
                                    name={isTimerActive ? 'pause' : 'timer'}
                                    size={18}
                                    color={isTimerActive ? '#FFFFFF' : colors.text.secondary}
                                />
                                <Text style={[
                                    styles.timerText,
                                    { color: isTimerActive ? '#FFFFFF' : colors.text.secondary }
                                ]}>
                                    {isTimerActive ? formatTime(timerSeconds) : `${exercise.rest || 60}s`}
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    {exercise.notes && (
                        <View style={[styles.notesBox, { backgroundColor: colors.surfaceVariant }]}>
                            <Icon name="info-outline" size={16} color={colors.text.secondary} />
                            <Text style={[styles.notesText, { color: colors.text.secondary }]}>
                                {exercise.notes}
                            </Text>
                        </View>
                    )}
                </PremiumCard>
            </Pressable>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Progress Header */}
            <View style={[styles.progressHeader, { backgroundColor: colors.surface }]}>
                <View style={styles.progressInfo}>
                    <Text style={[styles.workoutTitle, { color: colors.text.primary }]}>
                        {workout.name}
                    </Text>
                    <Text style={[styles.progressText, { color: colors.text.secondary }]}>
                        {completedExercises.length} de {workout.exercises?.length || 0} exercícios
                    </Text>
                </View>
                <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            { backgroundColor: colors.success, width: progressWidth }
                        ]}
                    />
                </View>
            </View>

            {/* Active Timer Display */}
            {activeTimer && (
                <View style={[styles.activeTimerBar, { backgroundColor: colors.primary }]}>
                    <Icon name="timer" size={20} color="#FFFFFF" />
                    <Text style={styles.activeTimerText}>
                        Descanso: {formatTime(timerSeconds)}
                    </Text>
                    <Pressable onPress={stopTimer}>
                        <Icon name="close" size={20} color="#FFFFFF" />
                    </Pressable>
                </View>
            )}

            {/* Exercises List */}
            <ScrollView
                style={styles.exercisesList}
                contentContainerStyle={styles.exercisesContent}
                showsVerticalScrollIndicator={false}
            >
                {workout.exercises?.map((exercise, index) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
                ))}

                {/* Finish Button */}
                <View style={styles.finishContainer}>
                    <PremiumButton
                        title={completedExercises.length === workout.exercises?.length
                            ? 'Finalizar Treino 🎉'
                            : 'Encerrar Sessão'
                        }
                        onPress={handleFinishWorkout}
                        icon="check-circle"
                        variant={completedExercises.length === workout.exercises?.length
                            ? 'primary'
                            : 'outline'
                        }
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    progressInfo: {
        marginBottom: 12,
    },
    workoutTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    progressText: {
        fontSize: 14,
    },
    progressBarContainer: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    activeTimerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 10,
    },
    activeTimerText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    exercisesList: {
        flex: 1,
    },
    exercisesContent: {
        padding: 16,
        paddingBottom: 40,
    },
    exerciseCard: {
        marginBottom: 12,
    },
    exerciseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    exerciseLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
    },
    exerciseDetails: {
        fontSize: 13,
        marginTop: 2,
    },
    exerciseActions: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    timerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 16,
        gap: 6,
    },
    timerText: {
        fontSize: 13,
        fontWeight: '600',
    },
    notesBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
    },
    notesText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    finishContainer: {
        marginTop: 16,
    },
});
