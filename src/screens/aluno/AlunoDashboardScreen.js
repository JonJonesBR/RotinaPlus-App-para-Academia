/**
 * AlunoDashboardScreen - Dashboard do Aluno
 * 
 * Tela principal com treino do dia, progresso e status de pagamento
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import {
    UserService,
    WorkoutService,
    PaymentService,
} from '../../services/storageService';
import { PaymentStatus, WEEK_DAYS } from '../../models/dataModels';
import {
    PremiumCard,
    PremiumButton,
    ThemeToggle,
} from '../../components/common';

export default function AlunoDashboardScreen({ navigation }) {
    const { colors, shadows } = useTheme();

    const [aluno, setAluno] = useState(null);
    const [todayWorkout, setTodayWorkout] = useState(null);
    const [nextPayment, setNextPayment] = useState(null);
    const [completedExercises, setCompletedExercises] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // Converte 0 (domingo) para 7

    const loadData = async () => {
        try {
            const user = await UserService.getCurrentUser();
            setAluno(user);

            if (user) {
                // Carrega treino do dia
                const workout = await WorkoutService.getTodayWorkout(user.id);
                setTodayWorkout(workout);

                // Carrega próximo pagamento
                const payments = await PaymentService.getByStudentId(user.id);
                const pending = payments
                    .filter(p => p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE)
                    .sort((a, b) => new Date(a.month) - new Date(b.month));

                if (pending.length > 0) {
                    setNextPayment(pending[0]);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, []),
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const getDaysUntilDue = () => {
        if (!nextPayment) return null;

        const [year, month] = nextPayment.month.split('-').map(Number);
        const dueDate = new Date(year, month - 1, nextPayment.dueDay);
        const now = new Date();
        const diff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

        return diff;
    };

    const getPaymentStatusColor = () => {
        const days = getDaysUntilDue();
        if (days === null) return colors.success;
        if (days < 0) return colors.danger;
        if (days <= 3) return colors.warning;
        return colors.success;
    };

    const getPaymentStatusText = () => {
        const days = getDaysUntilDue();
        if (days === null) return 'Em dia';
        if (days < 0) return `Atrasado ${Math.abs(days)} dias`;
        if (days === 0) return 'Vence hoje!';
        if (days === 1) return 'Vence amanhã';
        return `Vence em ${days} dias`;
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text.secondary }}>Carregando...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={[styles.greeting, { color: colors.text.secondary }]}>
                        Olá, {aluno?.name?.split(' ')[0] || 'Aluno'}! 💪
                    </Text>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                        {WEEK_DAYS[dayOfWeek]?.full || 'Hoje'}
                    </Text>
                </View>
                <ThemeToggle />
            </View>

            {/* Today's Workout Card */}
            <PremiumCard style={styles.workoutCard}>
                <View style={styles.workoutHeader}>
                    <View style={[styles.workoutIcon, { backgroundColor: colors.primary }]}>
                        <Icon name="fitness-center" size={28} color="#FFFFFF" />
                    </View>
                    <View style={styles.workoutInfo}>
                        <Text style={[styles.workoutLabel, { color: colors.text.secondary }]}>
                            Treino de Hoje
                        </Text>
                        <Text style={[styles.workoutName, { color: colors.text.primary }]}>
                            {todayWorkout?.name || 'Dia de descanso'}
                        </Text>
                    </View>
                </View>

                {todayWorkout ? (
                    <>
                        <View style={styles.workoutStats}>
                            <View style={styles.workoutStat}>
                                <Icon name="list" size={20} color={colors.primary} />
                                <Text style={[styles.workoutStatText, { color: colors.text.primary }]}>
                                    {todayWorkout.exercises?.length || 0} exercícios
                                </Text>
                            </View>
                            <View style={styles.workoutStat}>
                                <Icon name="timer" size={20} color={colors.secondary} />
                                <Text style={[styles.workoutStatText, { color: colors.text.primary }]}>
                                    ~{Math.round((todayWorkout.exercises?.length || 0) * 5)} min
                                </Text>
                            </View>
                        </View>

                        <PremiumButton
                            title="Iniciar Treino"
                            onPress={() => navigation.navigate('AlunoWorkoutDetail', {
                                workoutId: todayWorkout.id,
                            })}
                            icon="play-arrow"
                        />
                    </>
                ) : (
                    <View style={styles.restDay}>
                        <Icon name="self-improvement" size={48} color={colors.text.disabled} />
                        <Text style={[styles.restDayText, { color: colors.text.secondary }]}>
                            Aproveite para descansar e recuperar!
                        </Text>
                    </View>
                )}
            </PremiumCard>

            {/* Payment Status Card */}
            {aluno?.professors?.length > 0 && (
                <Pressable onPress={() => navigation.navigate('AlunoFinancial')}>
                    <PremiumCard
                        style={[
                            styles.paymentCard,
                            { borderLeftWidth: 4, borderLeftColor: getPaymentStatusColor() },
                        ]}
                    >
                        <View style={styles.paymentHeader}>
                            <View style={[styles.paymentIcon, { backgroundColor: getPaymentStatusColor() + '20' }]}>
                                <Icon
                                    name={getDaysUntilDue() < 0 ? 'warning' : 'payments'}
                                    size={24}
                                    color={getPaymentStatusColor()}
                                />
                            </View>
                            <View style={styles.paymentInfo}>
                                <Text style={[styles.paymentLabel, { color: colors.text.secondary }]}>
                                    Mensalidade
                                </Text>
                                <Text style={[styles.paymentStatus, { color: getPaymentStatusColor() }]}>
                                    {getPaymentStatusText()}
                                </Text>
                            </View>
                            {nextPayment && (
                                <Text style={[styles.paymentAmount, { color: colors.text.primary }]}>
                                    R$ {nextPayment.amount?.toFixed(2) || '0.00'}
                                </Text>
                            )}
                        </View>

                        {nextPayment && (
                            <View style={[styles.paymentHint, { backgroundColor: colors.surfaceVariant }]}>
                                <Icon name="pix" size={16} color={colors.primary} />
                                <Text style={[styles.paymentHintText, { color: colors.text.secondary }]}>
                                    Toque para ver a chave PIX e pagar
                                </Text>
                            </View>
                        )}
                    </PremiumCard>
                </Pressable>
            )}

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Acesso Rápido
            </Text>

            <View style={styles.quickActions}>
                <Pressable
                    style={[styles.quickAction, { backgroundColor: colors.surface, ...shadows.small }]}
                    onPress={() => navigation.navigate('AlunoProgress')}
                >
                    <View style={[styles.quickActionIcon, { backgroundColor: colors.primary }]}>
                        <Icon name="trending-up" size={22} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                        Progresso
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.quickAction, { backgroundColor: colors.surface, ...shadows.small }]}
                    onPress={() => navigation.navigate('AlunoQRImport')}
                >
                    <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary }]}>
                        <Icon name="qr-code-scanner" size={22} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                        Importar QR
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.quickAction, { backgroundColor: colors.surface, ...shadows.small }]}
                    onPress={() => navigation.navigate('AlunoFinancial')}
                >
                    <View style={[styles.quickActionIcon, { backgroundColor: colors.success }]}>
                        <Icon name="account-balance-wallet" size={22} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                        Financeiro
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.quickAction, { backgroundColor: colors.surface, ...shadows.small }]}
                    onPress={() => navigation.navigate('AlunoSettings')}
                >
                    <View style={[styles.quickActionIcon, { backgroundColor: colors.text.disabled }]}>
                        <Icon name="settings" size={22} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                        Ajustes
                    </Text>
                </Pressable>
            </View>

            {/* Professor Info */}
            {aluno?.professors?.length > 0 ? (
                <>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                        Meu Professor
                    </Text>

                    {aluno.professors.map((prof) => (
                        <PremiumCard key={prof.id} style={styles.professorCard}>
                            <View style={styles.professorInfo}>
                                <View style={[styles.professorAvatar, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.professorInitial}>
                                        {prof.name?.charAt(0) || 'P'}
                                    </Text>
                                </View>
                                <View style={styles.professorDetails}>
                                    <Text style={[styles.professorName, { color: colors.text.primary }]}>
                                        {prof.name}
                                    </Text>
                                    {prof.academyName && (
                                        <Text style={[styles.academyName, { color: colors.text.secondary }]}>
                                            {prof.academyName}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </PremiumCard>
                    ))}
                </>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                        Professor
                    </Text>
                    <PremiumCard style={styles.emptyCard}>
                        <Icon name="person-add" size={48} color={colors.text.disabled} />
                        <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                            Você ainda não tem um professor vinculado.
                        </Text>
                        <PremiumButton
                            title="Vincular Professor"
                            onPress={() => navigation.navigate('AlunoQRImport')}
                            variant="primary"
                            size="sm"
                        />
                    </PremiumCard>
                </View>
            )}
        </ScrollView>
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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    headerLeft: {
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    workoutCard: {
        marginBottom: 16,
    },
    workoutHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 14,
    },
    workoutIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    workoutInfo: {
        flex: 1,
    },
    workoutLabel: {
        fontSize: 13,
        marginBottom: 4,
    },
    workoutName: {
        fontSize: 20,
        fontWeight: '700',
    },
    workoutStats: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 16,
    },
    workoutStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    workoutStatText: {
        fontSize: 14,
        fontWeight: '500',
    },
    restDay: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    restDayText: {
        fontSize: 15,
        marginTop: 12,
        textAlign: 'center',
    },
    paymentCard: {
        marginBottom: 24,
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentInfo: {
        flex: 1,
    },
    paymentLabel: {
        fontSize: 12,
    },
    paymentStatus: {
        fontSize: 15,
        fontWeight: '600',
    },
    paymentAmount: {
        fontSize: 18,
        fontWeight: '700',
    },
    paymentHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        borderRadius: 8,
        marginTop: 12,
    },
    paymentHintText: {
        fontSize: 13,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    quickAction: {
        width: '47%',
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        gap: 10,
    },
    quickActionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    professorCard: {
        marginBottom: 12,
    },
    professorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    professorAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    professorInitial: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    professorDetails: {
        flex: 1,
    },
    professorName: {
        fontSize: 16,
        fontWeight: '600',
    },
    academyName: {
        fontSize: 13,
    },
    emptyState: {
        marginBottom: 24,
    },
    emptyCard: {
        alignItems: 'center',
        padding: 24,
        gap: 16,
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
});
