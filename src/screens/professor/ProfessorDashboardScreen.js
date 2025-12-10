/**
 * ProfessorDashboardScreen - Dashboard do Professor
 * 
 * Tela principal com resumo de alunos, mensalidades e ações rápidas
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    RefreshControl,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import {
    UserService,
    AlunoService,
    PaymentService,
    WorkoutService
} from '../../services/storageService';
import { PaymentStatus } from '../../models/dataModels';
import {
    PremiumCard,
    ThemeToggle,
    Avatar,
} from '../../components/common';

const { width } = Dimensions.get('window');

export default function ProfessorDashboardScreen({ navigation }) {
    const { colors, shadows, isDark } = useTheme();

    const [professor, setProfessor] = useState(null);
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeWorkouts: 0,
        pendingPayments: 0,
        overduePayments: 0,
        totalReceived: 0,
    });
    const [recentStudents, setRecentStudents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const user = await UserService.getCurrentUser();
            setProfessor(user);

            if (user) {
                // Carrega alunos
                const students = await AlunoService.getByProfessorId(user.id);

                // Carrega pagamentos
                const payments = await PaymentService.getByProfessorId(user.id);
                const pending = payments.filter(p => p.status === PaymentStatus.PENDING);
                const overdue = payments.filter(p => p.status === PaymentStatus.OVERDUE);
                const paid = payments.filter(p => p.status === PaymentStatus.PAID);
                const totalReceived = paid.reduce((sum, p) => sum + p.amount, 0);

                // Carrega treinos
                const workouts = await WorkoutService.getByProfessorId(user.id);

                setStats({
                    totalStudents: students.length,
                    activeWorkouts: workouts.length,
                    pendingPayments: pending.length,
                    overduePayments: overdue.length,
                    totalReceived,
                });

                // Últimos 5 alunos
                setRecentStudents(students.slice(-5).reverse());
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
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await PaymentService.updateOverduePayments();
        await loadData();
        setRefreshing(false);
    };

    const StatCard = ({ icon, value, label, color, onPress }) => (
        <Pressable
            style={[
                styles.statCard,
                { backgroundColor: colors.surface, ...shadows.small },
            ]}
            onPress={onPress}
        >
            <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
                <Icon name={icon} size={24} color={color} />
            </View>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                {label}
            </Text>
        </Pressable>
    );

    const QuickAction = ({ icon, title, subtitle, color, onPress }) => (
        <Pressable
            style={({ pressed }) => [
                styles.quickAction,
                {
                    backgroundColor: colors.surface,
                    ...shadows.small,
                    opacity: pressed ? 0.8 : 1,
                },
            ]}
            onPress={onPress}
        >
            <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
                <Icon name={icon} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.quickActionText}>
                <Text style={[styles.quickActionTitle, { color: colors.text.primary }]}>
                    {title}
                </Text>
                <Text style={[styles.quickActionSubtitle, { color: colors.text.secondary }]}>
                    {subtitle}
                </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text.disabled} />
        </Pressable>
    );

    const StudentItem = ({ student }) => (
        <Pressable
            style={[styles.studentItem, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('ProfessorStudentDetail', { studentId: student.id })}
        >
            <Avatar name={student.name} size={40} />
            <View style={styles.studentInfo}>
                <Text style={[styles.studentName, { color: colors.text.primary }]}>
                    {student.name}
                </Text>
                <Text style={[styles.studentGoal, { color: colors.text.secondary }]}>
                    {student.goal || 'Sem objetivo definido'}
                </Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.text.disabled} />
        </Pressable>
    );

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
                        Olá, {professor?.name?.split(' ')[0] || 'Professor'}! 👋
                    </Text>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                        {professor?.academyName || 'Rotina+'}
                    </Text>
                </View>
                <ThemeToggle />
            </View>

            {/* Professor ID Card */}
            <PremiumCard style={styles.idCard}>
                <View style={styles.idCardContent}>
                    <View>
                        <Text style={[styles.idLabel, { color: colors.text.secondary }]}>
                            Seu código de professor
                        </Text>
                        <Text style={[styles.idValue, { color: colors.primary }]}>
                            {professor?.id || 'PROF-XXXXXX'}
                        </Text>
                    </View>
                    <Pressable
                        style={[styles.shareButton, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('ProfessorQRExport', { type: 'link' })}
                    >
                        <Icon name="share" size={20} color="#FFFFFF" />
                    </Pressable>
                </View>
                <Text style={[styles.idHint, { color: colors.text.disabled }]}>
                    Compartilhe com seus alunos para vinculação
                </Text>
            </PremiumCard>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <StatCard
                    icon="people"
                    value={stats.totalStudents}
                    label="Alunos"
                    color={colors.primary}
                    onPress={() => navigation.navigate('ProfessorStudents')}
                />
                <StatCard
                    icon="fitness-center"
                    value={stats.activeWorkouts}
                    label="Treinos"
                    color={colors.secondary}
                    onPress={() => navigation.navigate('ProfessorWorkouts')}
                />
                <StatCard
                    icon="schedule"
                    value={stats.pendingPayments}
                    label="Pendentes"
                    color={colors.warning}
                    onPress={() => navigation.navigate('ProfessorFinancial')}
                />
                <StatCard
                    icon="warning"
                    value={stats.overduePayments}
                    label="Atrasados"
                    color={colors.danger}
                    onPress={() => navigation.navigate('ProfessorFinancial')}
                />
            </View>

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Ações Rápidas
            </Text>

            <View style={styles.quickActions}>
                <QuickAction
                    icon="add"
                    title="Novo Treino"
                    subtitle="Criar série de exercícios"
                    color={colors.primary}
                    onPress={() => navigation.navigate('ProfessorWorkoutForm')}
                />
                <QuickAction
                    icon="qr-code"
                    title="Gerar QR Code"
                    subtitle="Enviar dados para aluno"
                    color={colors.secondary}
                    onPress={() => navigation.navigate('ProfessorQRExport')}
                />
                <QuickAction
                    icon="attach-money"
                    title="Financeiro"
                    subtitle={`R$ ${stats.totalReceived.toFixed(2)} recebidos`}
                    color={colors.success}
                    onPress={() => navigation.navigate('ProfessorFinancial')}
                />
            </View>

            {/* Recent Students */}
            {recentStudents.length > 0 && (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                            Alunos Recentes
                        </Text>
                        <Pressable onPress={() => navigation.navigate('ProfessorStudents')}>
                            <Text style={[styles.seeAll, { color: colors.primary }]}>
                                Ver todos
                            </Text>
                        </Pressable>
                    </View>

                    <PremiumCard>
                        {recentStudents.map((student, index) => (
                            <React.Fragment key={student.id}>
                                <StudentItem student={student} />
                                {index < recentStudents.length - 1 && (
                                    <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                                )}
                            </React.Fragment>
                        ))}
                    </PremiumCard>
                </>
            )}

            {/* Empty State */}
            {stats.totalStudents === 0 && (
                <PremiumCard style={styles.emptyCard}>
                    <Icon name="group-add" size={48} color={colors.text.disabled} />
                    <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                        Nenhum aluno ainda
                    </Text>
                    <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                        Compartilhe seu código com seus alunos para começar!
                    </Text>
                </PremiumCard>
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
    idCard: {
        marginBottom: 20,
    },
    idCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    idLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    idValue: {
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 1,
    },
    shareButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    idHint: {
        fontSize: 12,
        marginTop: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        width: (width - 52) / 2,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    quickActions: {
        gap: 10,
        marginBottom: 24,
    },
    quickAction: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        gap: 14,
    },
    quickActionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickActionText: {
        flex: 1,
    },
    quickActionTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    quickActionSubtitle: {
        fontSize: 13,
    },
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 15,
        fontWeight: '600',
    },
    studentGoal: {
        fontSize: 13,
    },
    divider: {
        height: 1,
        marginLeft: 52,
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
