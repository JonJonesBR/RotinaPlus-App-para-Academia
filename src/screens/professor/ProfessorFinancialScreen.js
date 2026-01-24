/**
 * ProfessorFinancialScreen - Controle Financeiro do Professor
 * 
 * Gerenciamento de mensalidades e pagamentos
 */
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    RefreshControl,
    Alert,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import {
    UserService,
    PaymentService,
    AlunoService,
} from '../../services/storageService';
import { PaymentStatus, createPayment } from '../../models/dataModels';
import { PremiumCard, PremiumButton } from '../../components/common';

export default function ProfessorFinancialScreen({ navigation }) {
    const { colors, shadows } = useTheme();

    const [professor, setProfessor] = useState(null);
    const [payments, setPayments] = useState([]);
    const [students, setStudents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all'); // all, pending, paid, overdue
    const [stats, setStats] = useState({
        totalReceived: 0,
        totalPending: 0,
        totalOverdue: 0,
    });

    const loadData = async () => {
        try {
            const user = await UserService.getCurrentUser();
            setProfessor(user);

            if (user) {
                // Atualiza status de pagamentos atrasados
                await PaymentService.updateOverduePayments();

                // Carrega pagamentos
                const allPayments = await PaymentService.getByProfessorId(user.id);
                setPayments(allPayments);

                // Carrega alunos
                const allStudents = await AlunoService.getByProfessorId(user.id);
                setStudents(allStudents);

                // Calcula estatísticas
                const paid = allPayments.filter(p => p.status === PaymentStatus.PAID);
                const pending = allPayments.filter(p => p.status === PaymentStatus.PENDING);
                const overdue = allPayments.filter(p => p.status === PaymentStatus.OVERDUE);

                setStats({
                    totalReceived: paid.reduce((sum, p) => sum + p.amount, 0),
                    totalPending: pending.reduce((sum, p) => sum + p.amount, 0),
                    totalOverdue: overdue.reduce((sum, p) => sum + p.amount, 0),
                });
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
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

    const handleMarkAsPaid = async (payment) => {
        Alert.alert(
            'Confirmar Pagamento',
            `Marcar mensalidade de ${payment.studentName || 'Aluno'} como paga?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        await PaymentService.markAsPaid(payment.id);
                        loadData();
                    },
                },
            ],
        );
    };

    const handleCreatePayment = async (student) => {
        const currentMonth = new Date().toISOString().slice(0, 7);

        // Verifica se já existe pagamento para este mês
        const existing = payments.find(
            p => p.studentId === student.id && p.month === currentMonth,
        );

        if (existing) {
            Alert.alert('Aviso', 'Já existe uma mensalidade para este mês.');
            return;
        }

        Alert.prompt(
            'Nova Mensalidade',
            `Valor da mensalidade para ${student.name}:`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Criar',
                    onPress: async (value) => {
                        const amount = parseFloat(value?.replace(',', '.') || '0');
                        if (amount <= 0) {
                            Alert.alert('Erro', 'Valor inválido');
                            return;
                        }

                        const payment = createPayment({
                            professorId: professor.id,
                            studentId: student.id,
                            studentName: student.name,
                            amount,
                            dueDay: 10,
                            month: currentMonth,
                        });

                        await PaymentService.save(payment);
                        loadData();
                    },
                },
            ],
            'plain-text',
            '',
            'numeric',
        );
    };

    const filteredPayments = payments.filter(p => {
        if (filter === 'all') return true;
        return p.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case PaymentStatus.PAID: return colors.success;
            case PaymentStatus.PENDING: return colors.warning;
            case PaymentStatus.OVERDUE: return colors.danger;
            default: return colors.text.secondary;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case PaymentStatus.PAID: return 'Pago';
            case PaymentStatus.PENDING: return 'Pendente';
            case PaymentStatus.OVERDUE: return 'Atrasado';
            default: return status;
        }
    };

    const FilterButton = ({ value, label, count }) => (
        <Pressable
            style={[
                styles.filterButton,
                {
                    backgroundColor: filter === value ? colors.primary : colors.surface,
                    borderColor: filter === value ? colors.primary : colors.border,
                },
            ]}
            onPress={() => setFilter(value)}
        >
            <Text
                style={[
                    styles.filterLabel,
                    { color: filter === value ? '#FFFFFF' : colors.text.secondary },
                ]}
            >
                {label}
            </Text>
            {count > 0 && (
                <View
                    style={[
                        styles.filterBadge,
                        { backgroundColor: filter === value ? '#FFFFFF' : colors.primary },
                    ]}
                >
                    <Text
                        style={[
                            styles.filterBadgeText,
                            { color: filter === value ? colors.primary : '#FFFFFF' },
                        ]}
                    >
                        {count}
                    </Text>
                </View>
            )}
        </Pressable>
    );

    const PaymentItem = ({ payment }) => (
        <PremiumCard style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
                <View style={styles.paymentInfo}>
                    <Text style={[styles.studentName, { color: colors.text.primary }]}>
                        {payment.studentName || 'Aluno'}
                    </Text>
                    <Text style={[styles.paymentMonth, { color: colors.text.secondary }]}>
                        {new Date(payment.month + '-01').toLocaleDateString('pt-BR', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                        {getStatusLabel(payment.status)}
                    </Text>
                </View>
            </View>

            <View style={styles.paymentDetails}>
                <View style={styles.paymentAmount}>
                    <Text style={[styles.amountLabel, { color: colors.text.secondary }]}>Valor</Text>
                    <Text style={[styles.amountValue, { color: colors.text.primary }]}>
                        R$ {payment.amount?.toFixed(2) || '0.00'}
                    </Text>
                </View>
                <View style={styles.paymentDue}>
                    <Text style={[styles.amountLabel, { color: colors.text.secondary }]}>Vencimento</Text>
                    <Text style={[styles.amountValue, { color: colors.text.primary }]}>
                        Dia {payment.dueDay}
                    </Text>
                </View>
            </View>

            {payment.status !== PaymentStatus.PAID && (
                <PremiumButton
                    title="Marcar como Pago"
                    onPress={() => handleMarkAsPaid(payment)}
                    variant="outline"
                    size="small"
                    icon="check"
                />
            )}

            {payment.status === PaymentStatus.PAID && payment.paidAt && (
                <Text style={[styles.paidDate, { color: colors.success }]}>
                    Pago em {new Date(payment.paidAt).toLocaleDateString('pt-BR')}
                </Text>
            )}
        </PremiumCard>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Stats Cards */}
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: colors.success + '20' }]}>
                        <Icon name="check-circle" size={24} color={colors.success} />
                        <Text style={[styles.statValue, { color: colors.success }]}>
                            R$ {stats.totalReceived.toFixed(2)}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                            Recebido
                        </Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: colors.warning + '20' }]}>
                        <Icon name="schedule" size={24} color={colors.warning} />
                        <Text style={[styles.statValue, { color: colors.warning }]}>
                            R$ {stats.totalPending.toFixed(2)}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                            Pendente
                        </Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: colors.danger + '20' }]}>
                        <Icon name="warning" size={24} color={colors.danger} />
                        <Text style={[styles.statValue, { color: colors.danger }]}>
                            R$ {stats.totalOverdue.toFixed(2)}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                            Atrasado
                        </Text>
                    </View>
                </View>

                {/* Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                    contentContainerStyle={styles.filters}
                >
                    <FilterButton
                        value="all"
                        label="Todos"
                        count={payments.length}
                    />
                    <FilterButton
                        value={PaymentStatus.PENDING}
                        label="Pendentes"
                        count={payments.filter(p => p.status === PaymentStatus.PENDING).length}
                    />
                    <FilterButton
                        value={PaymentStatus.OVERDUE}
                        label="Atrasados"
                        count={payments.filter(p => p.status === PaymentStatus.OVERDUE).length}
                    />
                    <FilterButton
                        value={PaymentStatus.PAID}
                        label="Pagos"
                        count={payments.filter(p => p.status === PaymentStatus.PAID).length}
                    />
                </ScrollView>

                {/* Payments List */}
                {filteredPayments.length > 0 ? (
                    filteredPayments.map(payment => (
                        <PaymentItem key={payment.id} payment={payment} />
                    ))
                ) : (
                    <PremiumCard style={styles.emptyCard}>
                        <Icon name="payments" size={48} color={colors.text.disabled} />
                        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                            Nenhum pagamento encontrado
                        </Text>
                        <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                            Crie mensalidades para seus alunos
                        </Text>
                    </PremiumCard>
                )}

                {/* Students without payment this month */}
                {students.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                            Criar Mensalidade
                        </Text>
                        {students.map(student => (
                            <Pressable
                                key={student.id}
                                style={[styles.studentItem, { backgroundColor: colors.surface, ...shadows.small }]}
                                onPress={() => handleCreatePayment(student)}
                            >
                                <View style={[styles.studentAvatar, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.studentInitial}>
                                        {student.name?.charAt(0) || 'A'}
                                    </Text>
                                </View>
                                <Text style={[styles.studentItemName, { color: colors.text.primary }]}>
                                    {student.name}
                                </Text>
                                <Icon name="add-circle" size={24} color={colors.primary} />
                            </Pressable>
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
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
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 11,
        marginTop: 4,
    },
    filtersContainer: {
        marginBottom: 16,
    },
    filters: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '500',
    },
    filterBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    filterBadgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    paymentCard: {
        marginBottom: 12,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    paymentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
    },
    paymentMonth: {
        fontSize: 13,
        marginTop: 2,
        textTransform: 'capitalize',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    paymentDetails: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 12,
    },
    paymentAmount: {},
    paymentDue: {},
    amountLabel: {
        fontSize: 11,
        marginBottom: 2,
    },
    amountValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    paidDate: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 8,
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 12,
    },
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        gap: 12,
    },
    studentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    studentInitial: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    studentItemName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
});
