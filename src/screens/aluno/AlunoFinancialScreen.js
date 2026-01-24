/**
 * AlunoFinancialScreen - Área Financeira do Aluno
 * 
 * Exibe mensalidades, status de pagamento e chave PIX do professor
 */
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    RefreshControl,
    Clipboard,
    Alert,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { UserService, PaymentService } from '../../services/storageService';
import { PaymentStatus, PixKeyType } from '../../models/dataModels';
import { PremiumCard, PremiumButton } from '../../components/common';

export default function AlunoFinancialScreen({ navigation }) {
    const { colors, shadows } = useTheme();

    const [aluno, setAluno] = useState(null);
    const [payments, setPayments] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const user = await UserService.getCurrentUser();
            setAluno(user);

            if (user) {
                const allPayments = await PaymentService.getByStudentId(user.id);
                setPayments(allPayments.sort((a, b) =>
                    new Date(b.month) - new Date(a.month),
                ));
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

    const getProfessorPix = () => {
        if (!aluno?.professors?.length) return null;
        const prof = aluno.professors[0];
        return {
            key: prof.pixKey,
            keyType: prof.pixKeyType,
            name: prof.name,
            academyName: prof.academyName,
        };
    };

    const getNextPayment = () => {
        return payments.find(p =>
            p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE,
        );
    };

    const getDaysUntilDue = (payment) => {
        if (!payment) return null;
        const [year, month] = payment.month.split('-').map(Number);
        const dueDate = new Date(year, month - 1, payment.dueDay);
        const now = new Date();
        return Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    };

    const handleCopyPix = () => {
        const pix = getProfessorPix();
        if (pix?.key) {
            Clipboard.setString(pix.key);
            Alert.alert('Copiado!', 'Chave PIX copiada para a área de transferência');
        }
    };

    const handlePayPix = () => {
        const pix = getProfessorPix();
        const payment = getNextPayment();

        if (!pix?.key) {
            Alert.alert('Erro', 'Chave PIX não disponível');
            return;
        }

        // Tenta abrir app de pagamento
        // Formato PIX copia e cola
        const pixPayload = `${pix.key}`;
        Clipboard.setString(pixPayload);

        Alert.alert(
            'Chave PIX Copiada!',
            `Valor: R$ ${payment?.amount?.toFixed(2) || '0.00'}\n\nAbra seu app de banco e cole a chave PIX para pagar.`,
            [
                { text: 'OK' },
            ],
        );
    };

    const formatPixKeyType = (type) => {
        switch (type) {
            case PixKeyType.CPF: return 'CPF';
            case PixKeyType.CNPJ: return 'CNPJ';
            case PixKeyType.EMAIL: return 'E-mail';
            case PixKeyType.PHONE: return 'Telefone';
            case PixKeyType.RANDOM: return 'Chave aleatória';
            default: return type;
        }
    };

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

    const pixInfo = getProfessorPix();
    const nextPayment = getNextPayment();
    const daysUntilDue = getDaysUntilDue(nextPayment);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
        >
            {/* Next Payment Card */}
            {nextPayment && (
                <PremiumCard
                    style={[
                        styles.nextPaymentCard,
                        {
                            borderLeftWidth: 4,
                            borderLeftColor: daysUntilDue < 0 ? colors.danger :
                                daysUntilDue <= 3 ? colors.warning : colors.success,
                        },
                    ]}
                >
                    <View style={styles.nextPaymentHeader}>
                        <View>
                            <Text style={[styles.nextPaymentLabel, { color: colors.text.secondary }]}>
                                Próximo Vencimento
                            </Text>
                            <Text style={[styles.nextPaymentAmount, { color: colors.text.primary }]}>
                                R$ {nextPayment.amount?.toFixed(2) || '0.00'}
                            </Text>
                        </View>
                        <View style={[
                            styles.dueTag,
                            {
                                backgroundColor: daysUntilDue < 0 ? colors.danger :
                                    daysUntilDue <= 3 ? colors.warning : colors.primary,
                            },
                        ]}>
                            <Text style={styles.dueTagText}>
                                {daysUntilDue < 0
                                    ? `${Math.abs(daysUntilDue)} dias atrasado`
                                    : daysUntilDue === 0
                                        ? 'Vence hoje!'
                                        : `${daysUntilDue} dias`
                                }
                            </Text>
                        </View>
                    </View>

                    <View style={styles.nextPaymentInfo}>
                        <Icon name="event" size={16} color={colors.text.secondary} />
                        <Text style={[styles.nextPaymentDate, { color: colors.text.secondary }]}>
                            Dia {nextPayment.dueDay} de{' '}
                            {new Date(nextPayment.month + '-01').toLocaleDateString('pt-BR', {
                                month: 'long',
                            })}
                        </Text>
                    </View>
                </PremiumCard>
            )}

            {/* PIX Card */}
            {pixInfo && (
                <PremiumCard style={styles.pixCard}>
                    <View style={styles.pixHeader}>
                        <View style={[styles.pixIcon, { backgroundColor: colors.primary }]}>
                            <Icon name="pix" size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.pixInfo}>
                            <Text style={[styles.pixTitle, { color: colors.text.primary }]}>
                                Pagar com PIX
                            </Text>
                            <Text style={[styles.pixSubtitle, { color: colors.text.secondary }]}>
                                {pixInfo.name} {pixInfo.academyName ? `- ${pixInfo.academyName}` : ''}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.pixKeyBox, { backgroundColor: colors.surfaceVariant }]}>
                        <View style={styles.pixKeyHeader}>
                            <Text style={[styles.pixKeyType, { color: colors.text.secondary }]}>
                                {formatPixKeyType(pixInfo.keyType)}
                            </Text>
                            <Pressable onPress={handleCopyPix}>
                                <Icon name="content-copy" size={20} color={colors.primary} />
                            </Pressable>
                        </View>
                        <Text style={[styles.pixKeyValue, { color: colors.text.primary }]}>
                            {pixInfo.key}
                        </Text>
                    </View>

                    <PremiumButton
                        title="Copiar e Pagar"
                        onPress={handlePayPix}
                        icon="payments"
                    />
                </PremiumCard>
            )}

            {/* Payment History */}
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Histórico de Pagamentos
            </Text>

            {payments.length > 0 ? (
                payments.map(payment => (
                    <PremiumCard key={payment.id} style={styles.paymentCard}>
                        <View style={styles.paymentHeader}>
                            <View>
                                <Text style={[styles.paymentMonth, { color: colors.text.primary }]}>
                                    {new Date(payment.month + '-01').toLocaleDateString('pt-BR', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </Text>
                                <Text style={[styles.paymentAmount, { color: colors.text.secondary }]}>
                                    R$ {payment.amount?.toFixed(2) || '0.00'}
                                </Text>
                            </View>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(payment.status) + '20' },
                            ]}>
                                <Icon
                                    name={payment.status === PaymentStatus.PAID ? 'check-circle' : 'schedule'}
                                    size={16}
                                    color={getStatusColor(payment.status)}
                                />
                                <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                                    {getStatusLabel(payment.status)}
                                </Text>
                            </View>
                        </View>

                        {payment.status === PaymentStatus.PAID && payment.paidAt && (
                            <Text style={[styles.paidDate, { color: colors.success }]}>
                                Pago em {new Date(payment.paidAt).toLocaleDateString('pt-BR')}
                            </Text>
                        )}
                    </PremiumCard>
                ))
            ) : (
                <PremiumCard style={styles.emptyCard}>
                    <Icon name="receipt-long" size={48} color={colors.text.disabled} />
                    <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                        Nenhuma mensalidade registrada
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
    nextPaymentCard: {
        marginBottom: 16,
    },
    nextPaymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    nextPaymentLabel: {
        fontSize: 13,
    },
    nextPaymentAmount: {
        fontSize: 28,
        fontWeight: '700',
    },
    dueTag: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    dueTagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    nextPaymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    nextPaymentDate: {
        fontSize: 14,
        textTransform: 'capitalize',
    },
    pixCard: {
        marginBottom: 24,
    },
    pixHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    pixIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pixInfo: {
        flex: 1,
    },
    pixTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    pixSubtitle: {
        fontSize: 13,
    },
    pixKeyBox: {
        padding: 14,
        borderRadius: 12,
        marginBottom: 16,
    },
    pixKeyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    pixKeyType: {
        fontSize: 12,
        fontWeight: '500',
    },
    pixKeyValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    paymentCard: {
        marginBottom: 10,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentMonth: {
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    paymentAmount: {
        fontSize: 14,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 16,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    paidDate: {
        fontSize: 12,
        marginTop: 8,
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 14,
        marginTop: 12,
    },
});
