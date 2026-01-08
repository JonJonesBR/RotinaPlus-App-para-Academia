/**
 * Testes para qrCodeService.js
 */
import { QRCodeService } from '../../src/services/qrCodeService';
import { CryptoService } from '../../src/services/cryptoService';
import { QRDataType } from '../../src/models/dataModels';

describe('QRCodeService', () => {
    const mockProfessor = {
        id: 'PROF-TEST01',
        name: 'Professor Teste',
        academyName: 'Academia Top',
        pixKey: '12345678901',
        pixKeyType: 'cpf',
    };

    const mockWorkout = {
        id: 'WORKOUT-01',
        name: 'Treino A',
        exercises: [{ id: '1', name: 'Supino', sets: 3, reps: '10' }],
        weekDays: [1, 3, 5],
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
    };

    const mockPayment = {
        id: 'PAY-01',
        amount: 150,
        dueDay: 10,
        month: '2024-01',
    };

    describe('generateProfessorLink', () => {
        test('deve gerar pacote QR com tipo correto', async () => {
            const result = await QRCodeService.generateProfessorLink(mockProfessor);
            expect(result.type).toBe(QRDataType.PROFESSOR_LINK);
        });

        test('deve incluir dados do professor no payload', async () => {
            const result = await QRCodeService.generateProfessorLink(mockProfessor);
            expect(result.payload.id).toBe(mockProfessor.id);
            expect(result.payload.name).toBe(mockProfessor.name);
            expect(result.payload.pixKey).toBe(mockProfessor.pixKey);
        });

        test('deve gerar assinatura', async () => {
            const result = await QRCodeService.generateProfessorLink(mockProfessor);
            expect(result.signature).toBeDefined();
            expect(result.signature.length).toBeGreaterThan(0);
        });

        test('deve gerar código curto (shortCode)', async () => {
            const result = await QRCodeService.generateProfessorLink(mockProfessor);
            expect(result.shortCode).toBeDefined();
            expect(result.shortCode.length).toBe(6);
        });

        test('deve gerar string encoded em base64', async () => {
            const result = await QRCodeService.generateProfessorLink(mockProfessor);
            expect(result.encoded).toBeDefined();
            expect(typeof result.encoded).toBe('string');
        });

        test('deve incluir versão e timestamps', async () => {
            const result = await QRCodeService.generateProfessorLink(mockProfessor);
            expect(result.version).toBe('1.0');
            expect(result.createdAt).toBeDefined();
            expect(result.expiresAt).toBeGreaterThan(result.createdAt);
        });
    });

    describe('generateWorkoutExport', () => {
        test('deve gerar pacote QR com tipo WORKOUT', async () => {
            const result = await QRCodeService.generateWorkoutExport(mockWorkout, mockProfessor);
            expect(result.type).toBe(QRDataType.WORKOUT);
        });

        test('deve incluir dados do treino no payload', async () => {
            const result = await QRCodeService.generateWorkoutExport(mockWorkout, mockProfessor);
            expect(result.payload.workout.id).toBe(mockWorkout.id);
            expect(result.payload.workout.name).toBe(mockWorkout.name);
            expect(result.payload.workout.exercises).toEqual(mockWorkout.exercises);
        });

        test('deve incluir dados do professor no payload', async () => {
            const result = await QRCodeService.generateWorkoutExport(mockWorkout, mockProfessor);
            expect(result.payload.professor.id).toBe(mockProfessor.id);
            expect(result.payload.professor.name).toBe(mockProfessor.name);
        });
    });

    describe('generatePaymentInfo', () => {
        test('deve gerar pacote QR com tipo PAYMENT_INFO', async () => {
            const result = await QRCodeService.generatePaymentInfo(mockPayment, mockProfessor);
            expect(result.type).toBe(QRDataType.PAYMENT_INFO);
        });

        test('deve incluir dados de pagamento no payload', async () => {
            const result = await QRCodeService.generatePaymentInfo(mockPayment, mockProfessor);
            expect(result.payload.payment.id).toBe(mockPayment.id);
            expect(result.payload.payment.amount).toBe(mockPayment.amount);
        });

        test('deve incluir dados PIX no payload', async () => {
            const result = await QRCodeService.generatePaymentInfo(mockPayment, mockProfessor);
            expect(result.payload.pix.key).toBe(mockProfessor.pixKey);
            expect(result.payload.pix.keyType).toBe(mockProfessor.pixKeyType);
            expect(result.payload.pix.name).toBe(mockProfessor.name);
        });
    });

    describe('parseQRData', () => {
        test('deve decodificar dados válidos', async () => {
            const qrPackage = await QRCodeService.generateProfessorLink(mockProfessor);
            const result = await QRCodeService.parseQRData(qrPackage.encoded);

            expect(result.success).toBe(true);
            expect(result.type).toBe(QRDataType.PROFESSOR_LINK);
            expect(result.payload.id).toBe(mockProfessor.id);
        });

        test('deve retornar erro para dados inválidos', async () => {
            const result = await QRCodeService.parseQRData('invalid-data!!!');
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });

        test('deve verificar e rejeitar QR expirado', async () => {
            // Cria um QR já expirado
            const expiredData = {
                type: QRDataType.PROFESSOR_LINK,
                version: '1.0',
                payload: { id: 'test' },
                createdAt: Date.now() - 100000,
                expiresAt: Date.now() - 1000, // Já expirou
                signature: await CryptoService.createSignature({ id: 'test' }),
            };

            const encoded = CryptoService.encodeForQR(expiredData);
            const result = await QRCodeService.parseQRData(encoded);

            expect(result.success).toBe(false);
            expect(result.error).toContain('expirado');
        });

        test('deve verificar assinatura inválida', async () => {
            const invalidData = {
                type: QRDataType.PROFESSOR_LINK,
                version: '1.0',
                payload: { id: 'test' },
                createdAt: Date.now(),
                expiresAt: Date.now() + 86400000,
                signature: 'invalid-signature',
            };

            const encoded = CryptoService.encodeForQR(invalidData);
            const result = await QRCodeService.parseQRData(encoded);

            expect(result.success).toBe(false);
            expect(result.error).toContain('inválida');
        });

        test('deve incluir versão nos dados parseados', async () => {
            const qrPackage = await QRCodeService.generateProfessorLink(mockProfessor);
            const result = await QRCodeService.parseQRData(qrPackage.encoded);

            expect(result.version).toBe('1.0');
        });
    });

    describe('createShareableCode', () => {
        test('deve gerar código de 6 caracteres', async () => {
            const code = await QRCodeService.createShareableCode({ test: 'data' });
            expect(code.length).toBe(6);
        });

        test('deve gerar códigos únicos', async () => {
            const codes = new Set();
            for (let i = 0; i < 20; i++) {
                codes.add(await QRCodeService.createShareableCode({ id: i }));
            }
            expect(codes.size).toBeGreaterThan(15);
        });
    });
});
