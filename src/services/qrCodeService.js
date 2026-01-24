/**
 * QRCodeService - Geração e parsing de QR Codes
 * 
 * Serviço para criar e ler dados de QR Code
 * para sincronização entre Professor e Aluno
 */
import { CryptoService } from './cryptoService';
import { QRDataType, createQRPackage } from '../models/dataModels';

export const QRCodeService = {
    /**
     * Gera QR Code para vincular aluno ao professor
     * @param {object} professor - Dados do professor
     * @returns {Promise<object>} Pacote QR com dados e código
     */
    async generateProfessorLink(professor) {
        const payload = {
            id: professor.id,
            name: professor.name,
            academyName: professor.academyName || '',
            pixKey: professor.pixKey,
            pixKeyType: professor.pixKeyType,
        };

        const qrPackage = createQRPackage(QRDataType.PROFESSOR_LINK, payload);
        const signature = await CryptoService.createSignature(payload);

        return {
            ...qrPackage,
            signature,
            encoded: CryptoService.encodeForQR({ ...qrPackage, signature }),
            shortCode: await CryptoService.generateSecureCode(6),
        };
    },

    /**
     * Gera QR Code para enviar treino ao aluno
     * @param {object} workout - Dados do treino
     * @param {object} professor - Dados do professor (para PIX)
     * @returns {Promise<object>} Pacote QR com dados
     */
    async generateWorkoutExport(workout, professor) {
        const payload = {
            workout: {
                id: workout.id,
                name: workout.name,
                exercises: workout.exercises,
                weekDays: workout.weekDays,
                validFrom: workout.validFrom,
                validUntil: workout.validUntil,
            },
            professor: {
                id: professor.id,
                name: professor.name,
                academyName: professor.academyName,
            },
        };

        const qrPackage = createQRPackage(QRDataType.WORKOUT, payload);
        const signature = await CryptoService.createSignature(payload);

        return {
            ...qrPackage,
            signature,
            encoded: CryptoService.encodeForQR({ ...qrPackage, signature }),
            shortCode: await CryptoService.generateSecureCode(6),
        };
    },

    /**
     * Gera QR Code com informações de pagamento
     * @param {object} payment - Dados do pagamento
     * @param {object} professor - Dados do professor (PIX)
     * @returns {Promise<object>} Pacote QR com dados
     */
    async generatePaymentInfo(payment, professor) {
        const payload = {
            payment: {
                id: payment.id,
                amount: payment.amount,
                dueDay: payment.dueDay,
                month: payment.month,
            },
            pix: {
                key: professor.pixKey,
                keyType: professor.pixKeyType,
                name: professor.name,
                academyName: professor.academyName,
            },
        };

        const qrPackage = createQRPackage(QRDataType.PAYMENT_INFO, payload);
        const signature = await CryptoService.createSignature(payload);

        return {
            ...qrPackage,
            signature,
            encoded: CryptoService.encodeForQR({ ...qrPackage, signature }),
            shortCode: await CryptoService.generateSecureCode(6),
        };
    },

    /**
     * Decodifica e valida dados de QR Code
     * @param {string} rawData - Dados brutos do QR
     * @returns {Promise<object>} Dados validados ou erro
     */
    async parseQRData(rawData) {
        try {
            const decoded = CryptoService.decodeFromQR(rawData);

            if (!decoded) {
                return { success: false, error: 'Formato inválido' };
            }

            // Verifica expiração
            if (decoded.expiresAt && Date.now() > decoded.expiresAt) {
                return { success: false, error: 'QR Code expirado' };
            }

            // Verifica assinatura
            const { signature, ...dataWithoutSignature } = decoded;
            const isValid = await CryptoService.verifySignature(
                dataWithoutSignature.payload,
                signature,
            );

            if (!isValid) {
                return { success: false, error: 'Assinatura inválida' };
            }

            return {
                success: true,
                type: decoded.type,
                payload: decoded.payload,
                version: decoded.version,
            };
        } catch (error) {
            console.error('Erro ao parsear QR:', error);
            return { success: false, error: 'Erro ao processar QR Code' };
        }
    },

    /**
     * Cria código curto compartilhável (alternativa ao QR)
     * TODO: Em produção, isso usaria um backend para armazenar
     * Por agora, retorna apenas o código gerado
     * @param {object} data - Dados para compartilhar
     * @returns {Promise<string>} Código curto
     */
    async createShareableCode(data) {
        return await CryptoService.generateSecureCode(6);
    },
};

export default QRCodeService;
