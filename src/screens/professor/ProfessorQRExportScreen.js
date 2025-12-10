/**
 * ProfessorQRExportScreen - Geração de QR Codes
 * 
 * Permite ao professor gerar QR codes para:
 * - Vincular novos alunos
 * - Enviar treinos
 * - Enviar dados de pagamento
 */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Share,
    Clipboard,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../../theme/ThemeContext';
import { UserService } from '../../services/storageService';
import { QRCodeService } from '../../services/qrCodeService';
import { PremiumCard, PremiumButton } from '../../components/common';

const QR_TYPES = [
    {
        id: 'link',
        title: 'Vincular Aluno',
        description: 'Compartilhe para que novos alunos se cadastrem vinculados a você',
        icon: 'person-add',
        color: '#0D9488',
    },
    {
        id: 'workout',
        title: 'Enviar Treino',
        description: 'Envie uma série de exercícios para o aluno',
        icon: 'fitness-center',
        color: '#2563EB',
    },
    {
        id: 'payment',
        title: 'Dados de Pagamento',
        description: 'Envie sua chave PIX e valores de mensalidade',
        icon: 'payments',
        color: '#22C55E',
    },
];

export default function ProfessorQRExportScreen({ navigation, route }) {
    const { colors, shadows } = useTheme();
    const initialType = route.params?.type || 'link';

    const [professor, setProfessor] = useState(null);
    const [selectedType, setSelectedType] = useState(initialType);
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfessor();
    }, []);

    useEffect(() => {
        if (professor) {
            generateQR();
        }
    }, [professor, selectedType]);

    const loadProfessor = async () => {
        const user = await UserService.getCurrentUser();
        setProfessor(user);
    };

    const generateQR = async () => {
        if (!professor) return;

        setLoading(true);
        try {
            let data;
            switch (selectedType) {
                case 'link':
                    data = await QRCodeService.generateProfessorLink(professor);
                    break;
                case 'workout':
                    // Para treino, precisaria selecionar o treino primeiro
                    // Por agora, geramos apenas o link do professor
                    data = await QRCodeService.generateProfessorLink(professor);
                    break;
                case 'payment':
                    // Gera QR com dados de pagamento
                    data = await QRCodeService.generatePaymentInfo(
                        { amount: 0, dueDay: 10, month: new Date().toISOString().slice(0, 7) },
                        professor
                    );
                    break;
                default:
                    data = await QRCodeService.generateProfessorLink(professor);
            }
            setQrData(data);
        } catch (error) {
            console.error('Erro ao gerar QR:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyCode = () => {
        if (selectedType === 'link') {
            Clipboard.setString(professor?.id || '');
            Alert.alert('Copiado!', 'Código do professor copiado para a área de transferência');
        } else if (qrData?.shortCode) {
            Clipboard.setString(qrData.shortCode);
            Alert.alert('Copiado!', 'Código copiado para a área de transferência');
        }
    };

    const handleShare = async () => {
        try {
            const message = selectedType === 'link'
                ? `Olá! Use o código ${professor?.id} para se cadastrar no Rotina+ e se vincular como meu aluno. Baixe o app e insira este código no cadastro!`
                : `Use este código no Rotina+ para importar os dados: ${qrData?.shortCode || professor?.id}`;

            await Share.share({
                message,
                title: 'Rotina+ - Compartilhar Código',
            });
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
        }
    };

    const TypeSelector = ({ type }) => (
        <Pressable
            style={[
                styles.typeCard,
                {
                    backgroundColor: selectedType === type.id ? type.color + '15' : colors.surface,
                    borderColor: selectedType === type.id ? type.color : colors.border,
                    ...shadows.small,
                },
            ]}
            onPress={() => setSelectedType(type.id)}
        >
            <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
                <Icon name={type.icon} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.typeInfo}>
                <Text style={[styles.typeTitle, { color: colors.text.primary }]}>
                    {type.title}
                </Text>
                <Text style={[styles.typeDescription, { color: colors.text.secondary }]}>
                    {type.description}
                </Text>
            </View>
            {selectedType === type.id && (
                <Icon name="check-circle" size={24} color={type.color} />
            )}
        </Pressable>
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Type Selector */}
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                O que você quer compartilhar?
            </Text>

            {QR_TYPES.map(type => (
                <TypeSelector key={type.id} type={type} />
            ))}

            {/* QR Code Display */}
            <PremiumCard style={styles.qrCard}>
                <Text style={[styles.qrTitle, { color: colors.text.primary }]}>
                    {selectedType === 'link' ? 'Código do Professor' : 'QR Code'}
                </Text>

                <View style={styles.qrContainer}>
                    {selectedType === 'link' ? (
                        // Para link, mostra o ID do professor em destaque
                        <View style={[styles.codeBox, { backgroundColor: colors.surfaceVariant }]}>
                            <Text style={[styles.codeText, { color: colors.primary }]}>
                                {professor?.id || 'PROF-XXXXXX'}
                            </Text>
                        </View>
                    ) : (
                        // Para outros tipos, mostra QR Code
                        qrData?.encoded && (
                            <View style={styles.qrWrapper}>
                                <QRCode
                                    value={qrData.encoded}
                                    size={200}
                                    backgroundColor="#FFFFFF"
                                    color="#000000"
                                />
                            </View>
                        )
                    )}
                </View>

                {/* Short Code */}
                {(selectedType !== 'link' && qrData?.shortCode) && (
                    <View style={styles.shortCodeContainer}>
                        <Text style={[styles.shortCodeLabel, { color: colors.text.secondary }]}>
                            Ou use o código:
                        </Text>
                        <View style={[styles.shortCodeBox, { backgroundColor: colors.surfaceVariant }]}>
                            <Text style={[styles.shortCodeText, { color: colors.primary }]}>
                                {qrData.shortCode}
                            </Text>
                        </View>
                    </View>
                )}

                {/* PIX Info */}
                {selectedType === 'link' && professor?.pixKey && (
                    <View style={[styles.pixInfo, { backgroundColor: colors.successLight }]}>
                        <Icon name="pix" size={20} color={colors.success} />
                        <Text style={[styles.pixText, { color: colors.text.secondary }]}>
                            Sua chave PIX será compartilhada automaticamente
                        </Text>
                    </View>
                )}
            </PremiumCard>

            {/* Actions */}
            <View style={styles.actions}>
                <PremiumButton
                    title="Copiar Código"
                    onPress={handleCopyCode}
                    variant="outline"
                    icon="content-copy"
                    style={styles.actionButton}
                />
                <PremiumButton
                    title="Compartilhar"
                    onPress={handleShare}
                    icon="share"
                    style={styles.actionButton}
                />
            </View>

            {/* Instructions */}
            <PremiumCard style={styles.instructionsCard}>
                <Text style={[styles.instructionsTitle, { color: colors.text.primary }]}>
                    Como usar
                </Text>
                <View style={styles.instruction}>
                    <View style={[styles.instructionNumber, { backgroundColor: colors.primary }]}>
                        <Text style={styles.instructionNumberText}>1</Text>
                    </View>
                    <Text style={[styles.instructionText, { color: colors.text.secondary }]}>
                        {selectedType === 'link'
                            ? 'Compartilhe o código com seu aluno via WhatsApp'
                            : 'Deixe o aluno escanear o QR Code ou digite o código'}
                    </Text>
                </View>
                <View style={styles.instruction}>
                    <View style={[styles.instructionNumber, { backgroundColor: colors.primary }]}>
                        <Text style={styles.instructionNumberText}>2</Text>
                    </View>
                    <Text style={[styles.instructionText, { color: colors.text.secondary }]}>
                        {selectedType === 'link'
                            ? 'O aluno insere o código no cadastro do app'
                            : 'O aluno importa os dados no app dele'}
                    </Text>
                </View>
                <View style={styles.instruction}>
                    <View style={[styles.instructionNumber, { backgroundColor: colors.primary }]}>
                        <Text style={styles.instructionNumberText}>3</Text>
                    </View>
                    <Text style={[styles.instructionText, { color: colors.text.secondary }]}>
                        {selectedType === 'link'
                            ? 'Pronto! O aluno aparecerá na sua lista'
                            : 'Os dados são importados automaticamente'}
                    </Text>
                </View>
            </PremiumCard>
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    typeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        marginBottom: 10,
        gap: 12,
    },
    typeIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeInfo: {
        flex: 1,
    },
    typeTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    typeDescription: {
        fontSize: 12,
        marginTop: 2,
    },
    qrCard: {
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 24,
    },
    qrTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
    },
    qrContainer: {
        alignItems: 'center',
    },
    qrWrapper: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
    },
    codeBox: {
        paddingVertical: 20,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    codeText: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 2,
    },
    shortCodeContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    shortCodeLabel: {
        fontSize: 13,
        marginBottom: 8,
    },
    shortCodeBox: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    shortCodeText: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 3,
    },
    pixInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        marginTop: 16,
        gap: 10,
    },
    pixText: {
        flex: 1,
        fontSize: 13,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
    },
    instructionsCard: {
        marginTop: 20,
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    instruction: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 12,
    },
    instructionNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructionNumberText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    instructionText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});
