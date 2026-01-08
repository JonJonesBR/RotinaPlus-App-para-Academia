/**
 * Testes para dataModels.js
 */
import {
    UserRole,
    PaymentStatus,
    PixKeyType,
    QRDataType,
    generateProfessorId,
    generateAlunoId,
    generateTempCode,
    createProfessor,
    createAluno,
    createProfessorRef,
    createExercise,
    createWorkout,
    createPayment,
    createQRPackage,
    validators,
    WEEK_DAYS,
} from '../../src/models/dataModels';

describe('dataModels', () => {
    describe('Enums', () => {
        test('UserRole deve ter valores corretos', () => {
            expect(UserRole.PROFESSOR).toBe('professor');
            expect(UserRole.ALUNO).toBe('aluno');
        });

        test('PaymentStatus deve ter valores corretos', () => {
            expect(PaymentStatus.PENDING).toBe('pending');
            expect(PaymentStatus.PAID).toBe('paid');
            expect(PaymentStatus.OVERDUE).toBe('overdue');
        });

        test('PixKeyType deve ter valores corretos', () => {
            expect(PixKeyType.CPF).toBe('cpf');
            expect(PixKeyType.EMAIL).toBe('email');
            expect(PixKeyType.PHONE).toBe('phone');
            expect(PixKeyType.RANDOM).toBe('random');
        });

        test('QRDataType deve ter valores corretos', () => {
            expect(QRDataType.PROFESSOR_LINK).toBe('professor_link');
            expect(QRDataType.WORKOUT).toBe('workout');
            expect(QRDataType.PAYMENT_INFO).toBe('payment_info');
        });
    });

    describe('ID Generators', () => {
        test('generateProfessorId deve gerar formato PROF-XXXXXX', () => {
            const id = generateProfessorId();
            expect(id).toMatch(/^PROF-[A-Z0-9]{6}$/);
        });

        test('generateProfessorId deve gerar IDs únicos', () => {
            const id1 = generateProfessorId();
            const id2 = generateProfessorId();
            const id3 = generateProfessorId();
            expect(id1).not.toBe(id2);
            expect(id2).not.toBe(id3);
        });

        test('generateAlunoId deve gerar formato ALU-XXXXXX', () => {
            const id = generateAlunoId();
            expect(id).toMatch(/^ALU-[A-Z0-9]{6}$/);
        });

        test('generateAlunoId deve gerar IDs únicos', () => {
            const ids = new Set();
            for (let i = 0; i < 100; i++) {
                ids.add(generateAlunoId());
            }
            expect(ids.size).toBe(100);
        });

        test('generateTempCode deve gerar 6 dígitos numéricos', () => {
            const code = generateTempCode();
            expect(code).toMatch(/^\d{6}$/);
            expect(parseInt(code)).toBeGreaterThanOrEqual(100000);
            expect(parseInt(code)).toBeLessThan(1000000);
        });
    });

    describe('Factories', () => {
        test('createProfessor deve criar objeto com defaults', () => {
            const professor = createProfessor();
            expect(professor.id).toMatch(/^PROF-[A-Z0-9]{6}$/);
            expect(professor.name).toBe('');
            expect(professor.email).toBe('');
            expect(professor.phone).toBe('');
            expect(professor.pixKey).toBe('');
            expect(professor.pixKeyType).toBe(PixKeyType.CPF);
            expect(professor.students).toEqual([]);
            expect(professor.createdAt).toBeDefined();
        });

        test('createProfessor deve usar dados fornecidos', () => {
            const data = {
                id: 'PROF-TEST01',
                name: 'João Silva',
                email: 'joao@email.com',
                pixKey: '12345678901',
            };
            const professor = createProfessor(data);
            expect(professor.id).toBe('PROF-TEST01');
            expect(professor.name).toBe('João Silva');
            expect(professor.email).toBe('joao@email.com');
            expect(professor.pixKey).toBe('12345678901');
        });

        test('createAluno deve criar objeto com defaults', () => {
            const aluno = createAluno();
            expect(aluno.id).toMatch(/^ALU-[A-Z0-9]{6}$/);
            expect(aluno.name).toBe('');
            expect(aluno.professors).toEqual([]);
            expect(aluno.birthDate).toBeNull();
            expect(aluno.goal).toBe('');
        });

        test('createAluno deve usar dados fornecidos', () => {
            const data = {
                name: 'Maria Santos',
                goal: 'Emagrecimento',
            };
            const aluno = createAluno(data);
            expect(aluno.name).toBe('Maria Santos');
            expect(aluno.goal).toBe('Emagrecimento');
        });

        test('createProfessorRef deve extrair campos corretos', () => {
            const professor = {
                id: 'PROF-ABC123',
                name: 'Carlos',
                pixKey: '11999998888',
                pixKeyType: PixKeyType.PHONE,
                academyName: 'Fitness Plus',
                extra: 'ignorado',
            };
            const ref = createProfessorRef(professor);
            expect(ref.id).toBe('PROF-ABC123');
            expect(ref.name).toBe('Carlos');
            expect(ref.pixKey).toBe('11999998888');
            expect(ref.academyName).toBe('Fitness Plus');
            expect(ref.extra).toBeUndefined();
        });

        test('createExercise deve criar objeto com defaults', () => {
            const exercise = createExercise();
            expect(exercise.id).toBeDefined();
            expect(exercise.name).toBe('');
            expect(exercise.sets).toBe(3);
            expect(exercise.reps).toBe('12');
            expect(exercise.weight).toBe('');
            expect(exercise.rest).toBe(60);
        });

        test('createWorkout deve criar objeto com defaults', () => {
            const workout = createWorkout();
            expect(workout.id).toBeDefined();
            expect(workout.exercises).toEqual([]);
            expect(workout.weekDays).toEqual([]);
        });

        test('createPayment deve criar objeto com defaults', () => {
            const payment = createPayment();
            expect(payment.id).toBeDefined();
            expect(payment.amount).toBe(0);
            expect(payment.dueDay).toBe(10);
            expect(payment.status).toBe(PaymentStatus.PENDING);
        });

        test('createQRPackage deve criar pacote corretamente', () => {
            const payload = { test: 'data' };
            const qr = createQRPackage(QRDataType.PROFESSOR_LINK, payload);
            expect(qr.type).toBe(QRDataType.PROFESSOR_LINK);
            expect(qr.version).toBe('1.0');
            expect(qr.payload).toEqual(payload);
            expect(qr.createdAt).toBeDefined();
            expect(qr.expiresAt).toBeGreaterThan(qr.createdAt);
        });

        test('createQRPackage deve respeitar expiresIn customizado', () => {
            const now = Date.now();
            const qr = createQRPackage('test', {}, 1000);
            expect(qr.expiresAt - qr.createdAt).toBe(1000);
        });
    });

    describe('Validators', () => {
        test('isValidEmail deve validar emails corretamente', () => {
            expect(validators.isValidEmail('teste@email.com')).toBe(true);
            expect(validators.isValidEmail('user@domain.org')).toBe(true);
            expect(validators.isValidEmail('invalid')).toBe(false);
            expect(validators.isValidEmail('invalid@')).toBe(false);
            expect(validators.isValidEmail('@domain.com')).toBe(false);
            expect(validators.isValidEmail('')).toBe(false);
        });

        test('isValidPhone deve validar telefones corretamente', () => {
            expect(validators.isValidPhone('11999998888')).toBe(true);
            expect(validators.isValidPhone('1199999888')).toBe(true);
            expect(validators.isValidPhone('(11) 99999-8888')).toBe(true);
            expect(validators.isValidPhone('123456789')).toBe(false);
            expect(validators.isValidPhone('123456789012')).toBe(false);
        });

        test('isValidCPF deve validar formato de CPF', () => {
            expect(validators.isValidCPF('12345678901')).toBe(true);
            expect(validators.isValidCPF('123.456.789-01')).toBe(true);
            expect(validators.isValidCPF('1234567890')).toBe(false);
            expect(validators.isValidCPF('123456789012')).toBe(false);
        });

        test('isValidCNPJ deve validar formato de CNPJ', () => {
            expect(validators.isValidCNPJ('12345678000199')).toBe(true);
            expect(validators.isValidCNPJ('12.345.678/0001-99')).toBe(true);
            expect(validators.isValidCNPJ('1234567800019')).toBe(false);
        });

        test('isValidProfessorCode deve validar código de professor', () => {
            expect(validators.isValidProfessorCode('PROF-ABC123')).toBe(true);
            expect(validators.isValidProfessorCode('PROF-123456')).toBe(true);
            expect(validators.isValidProfessorCode('ALU-ABC123')).toBe(false);
            expect(validators.isValidProfessorCode('PROF-AB')).toBe(false);
        });

        test('isValidAlunoCode deve validar código de aluno', () => {
            expect(validators.isValidAlunoCode('ALU-ABC123')).toBe(true);
            expect(validators.isValidAlunoCode('ALU-999999')).toBe(true);
            expect(validators.isValidAlunoCode('PROF-ABC123')).toBe(false);
            expect(validators.isValidAlunoCode('ALU-AB')).toBe(false);
        });
    });

    describe('WEEK_DAYS', () => {
        test('deve ter todos os 7 dias da semana', () => {
            expect(Object.keys(WEEK_DAYS).length).toBe(7);
        });

        test('deve ter formato correto', () => {
            expect(WEEK_DAYS[1].short).toBe('Seg');
            expect(WEEK_DAYS[1].full).toBe('Segunda-feira');
            expect(WEEK_DAYS[7].short).toBe('Dom');
            expect(WEEK_DAYS[7].full).toBe('Domingo');
        });
    });
});
