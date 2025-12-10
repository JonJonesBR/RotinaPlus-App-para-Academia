/**
 * AlunoQRImportScreen - Importar dados via QR Code
 * 
 * Scanner de QR Code para importar treinos e dados do professor
 */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { QRCodeService } from '../../services/qrCodeService';
import {
    UserService,
    AlunoService,
    WorkoutService,
    ProfessorService,
} from '../../services/storageService';
import { QRDataType, createProfessorRef } from '../../models/dataModels';
import { PremiumCard, PremiumButton } from '../../components/common';

export default function AlunoQRImportScreen({ navigation }) {
    const { colors, shadows } = useTheme();

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [useManual, setUseManual] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleBarCodeScanned = async ({ data }) => {
        if (scanned) return;
        setScanned(true);
        await processQRData(data);
    };

    const processQRData = async (rawData) => {
        setLoading(true);
        try {
            const result = await QRCodeService.parseQRData(rawData);

            if (!result.success) {
                Alert.alert('Erro', result.error || 'QR Code inválido');
                setScanned(false);
                setLoading(false);
                return;
            }

            const aluno = await UserService.getCurrentUser();

            switch (result.type) {
                case QRDataType.PROFESSOR_LINK:
                    await handleProfessorLink(result.payload, aluno);
                    break;
                case QRDataType.WORKOUT:
                    await handleWorkoutImport(result.payload, aluno);
                    break;
                case QRDataType.PAYMENT_INFO:
                    await handlePaymentInfo(result.payload, aluno);
                    break;
                default:
                    Alert.alert('Erro', 'Tipo de QR Code não reconhecido');
            }
        } catch (error) {
            console.error('Erro ao processar QR:', error);
            Alert.alert('Erro', 'Falha ao processar QR Code');
        } finally {
            setLoading(false);
            setScanned(false);
        }
    };

    const handleProfessorLink = async (payload, aluno) => {
        // Verifica se já está vinculado
        const isLinked = aluno.professors?.some(p => p.id === payload.id);

        if (isLinked) {
            Alert.alert('Aviso', 'Você já está vinculado a este professor');
            return;
        }

        Alert.alert(
            'Vincular Professor',
            `Deseja se vincular ao professor ${payload.name}${payload.academyName ? ` (${payload.academyName})` : ''}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Vincular',
                    onPress: async () => {
                        const professorRef = createProfessorRef(payload);
                        await AlunoService.linkProfessor(aluno.id, professorRef);

                        // Atualiza professor também
                        await ProfessorService.addStudent(payload.id, aluno.id);

                        Alert.alert('Sucesso!', `Você foi vinculado ao professor ${payload.name}`);
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const handleWorkoutImport = async (payload, aluno) => {
        const { workout, professor } = payload;

        Alert.alert(
            'Importar Treino',
            `Deseja importar o treino "${workout.name}" de ${professor.name}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Importar',
                    onPress: async () => {
                        const newWorkout = {
                            ...workout,
                            id: Date.now().toString(), // Novo ID
                            studentId: aluno.id,
                            professorId: professor.id,
                            createdAt: Date.now(),
                        };

                        await WorkoutService.save(newWorkout);

                        Alert.alert('Sucesso!', 'Treino importado com sucesso!');
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const handlePaymentInfo = async (payload, aluno) => {
        const { pix } = payload;

        Alert.alert(
            'Dados de Pagamento',
            `Professor: ${pix.name}\nChave PIX: ${pix.key}\n\nEsses dados foram salvos para facilitar seus pagamentos.`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    };

    const handleManualSubmit = async () => {
        if (!manualCode.trim()) {
            Alert.alert('Erro', 'Digite um código');
            return;
        }

        // Para códigos manuais, tenta processar como código de professor primeiro
        if (manualCode.toUpperCase().startsWith('PROF-')) {
            const professor = await ProfessorService.getById(manualCode.toUpperCase());
            if (professor) {
                const aluno = await UserService.getCurrentUser();
                await handleProfessorLink({
                    id: professor.id,
                    name: professor.name,
                    academyName: professor.academyName,
                    pixKey: professor.pixKey,
                    pixKeyType: professor.pixKeyType,
                }, aluno);
                return;
            }
        }

        // Tenta processar como dados codificados
        await processQRData(manualCode);
    };

    if (!permission) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text.primary }}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {!useManual && permission.granted ? (
                <>
                    {/* Camera Scanner */}
                    <View style={styles.cameraContainer}>
                        <CameraView
                            style={styles.camera}
                            barcodeScannerSettings={{
                                barcodeTypes: ['qr'],
                            }}
                            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        />

                        {/* Overlay */}
                        <View style={styles.overlay}>
                            <View style={[styles.scanFrame, { borderColor: colors.primary }]} />
                        </View>
                    </View>

                    <View style={styles.instructions}>
                        <Text style={[styles.instructionText, { color: colors.text.primary }]}>
                            Posicione o QR Code dentro do quadro
                        </Text>
                    </View>
                </>
            ) : (
                <>
                    {/* Manual Input */}
                    <PremiumCard style={styles.manualCard}>
                        <Icon name="keyboard" size={48} color={colors.primary} />
                        <Text style={[styles.manualTitle, { color: colors.text.primary }]}>
                            Digite o código
                        </Text>
                        <Text style={[styles.manualSubtitle, { color: colors.text.secondary }]}>
                            Insira o código do professor ou o código temporário
                        </Text>

                        <TextInput
                            style={[styles.codeInput, {
                                backgroundColor: colors.surfaceVariant,
                                color: colors.text.primary
                            }]}
                            value={manualCode}
                            onChangeText={setManualCode}
                            placeholder="PROF-XXXXXX"
                            placeholderTextColor={colors.text.hint}
                            autoCapitalize="characters"
                        />

                        <PremiumButton
                            title="Verificar Código"
                            onPress={handleManualSubmit}
                            loading={loading}
                            icon="check"
                        />
                    </PremiumCard>
                </>
            )}

            {/* Toggle Button */}
            <View style={styles.toggleContainer}>
                {!permission.granted && !useManual ? (
                    <PremiumButton
                        title="Permitir Câmera"
                        onPress={requestPermission}
                        variant="outline"
                        icon="camera-alt"
                    />
                ) : (
                    <Pressable
                        style={[styles.toggleButton, { backgroundColor: colors.surface }]}
                        onPress={() => setUseManual(!useManual)}
                    >
                        <Icon
                            name={useManual ? 'qr-code-scanner' : 'keyboard'}
                            size={20}
                            color={colors.primary}
                        />
                        <Text style={[styles.toggleText, { color: colors.primary }]}>
                            {useManual ? 'Usar câmera' : 'Digitar código'}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 3,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    instructions: {
        padding: 20,
        alignItems: 'center',
    },
    instructionText: {
        fontSize: 16,
        textAlign: 'center',
    },
    manualCard: {
        margin: 20,
        alignItems: 'center',
        paddingVertical: 40,
    },
    manualTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    manualSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    codeInput: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: 20,
    },
    toggleContainer: {
        padding: 20,
        alignItems: 'center',
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        gap: 8,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
