/**
 * Testes para storageService.js
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    UserService,
    ProfessorService,
    AlunoService,
    WorkoutService,
    PaymentService,
} from '../../src/services/storageService';
import { UserRole, PaymentStatus } from '../../src/models/dataModels';

describe('StorageService', () => {
    beforeEach(() => {
        AsyncStorage.__resetStore();
        jest.clearAllMocks();
    });

    describe('UserService', () => {
        const mockProfessor = {
            id: 'PROF-TEST01',
            name: 'Professor Teste',
            email: 'professor@test.com',
        };

        test('deve retornar null quando não há usuário logado', async () => {
            const user = await UserService.getCurrentUser();
            expect(user).toBeNull();
        });

        test('deve salvar e recuperar usuário atual', async () => {
            await UserService.setCurrentUser(mockProfessor, UserRole.PROFESSOR);
            const user = await UserService.getCurrentUser();
            expect(user).toEqual(mockProfessor);
        });

        test('deve salvar e recuperar role do usuário', async () => {
            await UserService.setCurrentUser(mockProfessor, UserRole.PROFESSOR);
            const role = await UserService.getUserRole();
            expect(role).toBe(UserRole.PROFESSOR);
        });

        test('deve verificar se está logado', async () => {
            expect(await UserService.isLoggedIn()).toBe(false);
            await UserService.setCurrentUser(mockProfessor, UserRole.PROFESSOR);
            expect(await UserService.isLoggedIn()).toBe(true);
        });

        test('deve limpar sessão (logout)', async () => {
            await UserService.setCurrentUser(mockProfessor, UserRole.PROFESSOR);
            expect(await UserService.isLoggedIn()).toBe(true);

            await UserService.clearSession();
            expect(await UserService.isLoggedIn()).toBe(false);
            expect(await UserService.getCurrentUser()).toBeNull();
        });

        test('logout deve funcionar como alias de clearSession', async () => {
            await UserService.setCurrentUser(mockProfessor, UserRole.PROFESSOR);
            await UserService.logout();
            expect(await UserService.isLoggedIn()).toBe(false);
        });
    });

    describe('ProfessorService', () => {
        const mockProfessor1 = {
            id: 'PROF-TEST01',
            name: 'Professor Um',
            students: [],
        };

        const mockProfessor2 = {
            id: 'PROF-TEST02',
            name: 'Professor Dois',
            students: [],
        };

        test('deve retornar array vazio quando não há professores', async () => {
            const professors = await ProfessorService.getAll();
            expect(professors).toEqual([]);
        });

        test('deve salvar e recuperar professor', async () => {
            await ProfessorService.save(mockProfessor1);
            const professors = await ProfessorService.getAll();
            expect(professors.length).toBe(1);
            expect(professors[0]).toEqual(mockProfessor1);
        });

        test('deve buscar professor por ID', async () => {
            await ProfessorService.save(mockProfessor1);
            await ProfessorService.save(mockProfessor2);

            const professor = await ProfessorService.getById('PROF-TEST01');
            expect(professor).toEqual(mockProfessor1);
        });

        test('deve retornar null para ID inexistente', async () => {
            const professor = await ProfessorService.getById('INVALID-ID');
            expect(professor).toBeNull();
        });

        test('deve atualizar professor existente', async () => {
            await ProfessorService.save(mockProfessor1);

            const updated = { ...mockProfessor1, name: 'Nome Atualizado' };
            await ProfessorService.save(updated);

            const professors = await ProfessorService.getAll();
            expect(professors.length).toBe(1);
            expect(professors[0].name).toBe('Nome Atualizado');
        });

        test('deve deletar professor', async () => {
            await ProfessorService.save(mockProfessor1);
            await ProfessorService.save(mockProfessor2);

            await ProfessorService.delete('PROF-TEST01');

            const professors = await ProfessorService.getAll();
            expect(professors.length).toBe(1);
            expect(professors[0].id).toBe('PROF-TEST02');
        });

        test('deve adicionar aluno ao professor', async () => {
            await ProfessorService.save(mockProfessor1);
            await ProfessorService.addStudent('PROF-TEST01', 'ALU-STUD01');

            const professor = await ProfessorService.getById('PROF-TEST01');
            expect(professor.students).toContain('ALU-STUD01');
        });

        test('deve remover aluno do professor', async () => {
            await ProfessorService.save({ ...mockProfessor1, students: ['ALU-01', 'ALU-02'] });
            await ProfessorService.removeStudent('PROF-TEST01', 'ALU-01');

            const professor = await ProfessorService.getById('PROF-TEST01');
            expect(professor.students).toEqual(['ALU-02']);
        });
    });

    describe('AlunoService', () => {
        const mockAluno1 = {
            id: 'ALU-TEST01',
            name: 'Aluno Um',
            professors: [],
        };

        const mockAluno2 = {
            id: 'ALU-TEST02',
            name: 'Aluno Dois',
            professors: [{ id: 'PROF-TEST01', name: 'Prof' }],
        };

        test('deve retornar array vazio quando não há alunos', async () => {
            const alunos = await AlunoService.getAll();
            expect(alunos).toEqual([]);
        });

        test('deve salvar e recuperar aluno', async () => {
            await AlunoService.save(mockAluno1);
            const alunos = await AlunoService.getAll();
            expect(alunos.length).toBe(1);
        });

        test('deve buscar aluno por ID', async () => {
            await AlunoService.save(mockAluno1);
            const aluno = await AlunoService.getById('ALU-TEST01');
            expect(aluno.name).toBe('Aluno Um');
        });

        test('deve buscar alunos por professor', async () => {
            await AlunoService.save(mockAluno1);
            await AlunoService.save(mockAluno2);

            const alunosComProf = await AlunoService.getByProfessorId('PROF-TEST01');
            expect(alunosComProf.length).toBe(1);
            expect(alunosComProf[0].id).toBe('ALU-TEST02');
        });

        test('deve deletar aluno', async () => {
            await AlunoService.save(mockAluno1);
            await AlunoService.delete('ALU-TEST01');

            const alunos = await AlunoService.getAll();
            expect(alunos.length).toBe(0);
        });

        test('deve vincular professor ao aluno', async () => {
            await AlunoService.save(mockAluno1);
            const profRef = { id: 'PROF-NEW01', name: 'Novo Prof' };

            await AlunoService.linkProfessor('ALU-TEST01', profRef);

            const aluno = await AlunoService.getById('ALU-TEST01');
            expect(aluno.professors).toContainEqual(profRef);
        });

        test('deve desvincular professor do aluno', async () => {
            await AlunoService.save(mockAluno2);
            await AlunoService.unlinkProfessor('ALU-TEST02', 'PROF-TEST01');

            const aluno = await AlunoService.getById('ALU-TEST02');
            expect(aluno.professors).toEqual([]);
        });
    });

    describe('WorkoutService', () => {
        const mockWorkout = {
            id: 'WORKOUT-01',
            professorId: 'PROF-TEST01',
            studentId: 'ALU-TEST01',
            name: 'Treino A',
            exercises: [],
            weekDays: [1, 3, 5],
        };

        test('deve salvar e recuperar treino', async () => {
            await WorkoutService.save(mockWorkout);
            const workouts = await WorkoutService.getAll();
            expect(workouts.length).toBe(1);
        });

        test('deve buscar por ID', async () => {
            await WorkoutService.save(mockWorkout);
            const workout = await WorkoutService.getById('WORKOUT-01');
            expect(workout.name).toBe('Treino A');
        });

        test('deve buscar treinos por professor', async () => {
            await WorkoutService.save(mockWorkout);
            const workouts = await WorkoutService.getByProfessorId('PROF-TEST01');
            expect(workouts.length).toBe(1);
        });

        test('deve buscar treinos por aluno', async () => {
            await WorkoutService.save(mockWorkout);
            const workouts = await WorkoutService.getByStudentId('ALU-TEST01');
            expect(workouts.length).toBe(1);
        });

        test('deve deletar treino', async () => {
            await WorkoutService.save(mockWorkout);
            await WorkoutService.delete('WORKOUT-01');

            const workouts = await WorkoutService.getAll();
            expect(workouts.length).toBe(0);
        });
    });

    describe('PaymentService', () => {
        const mockPayment = {
            id: 'PAY-01',
            professorId: 'PROF-TEST01',
            studentId: 'ALU-TEST01',
            amount: 150,
            status: PaymentStatus.PENDING,
            month: '2024-01',
        };

        test('deve salvar e recuperar pagamento', async () => {
            await PaymentService.save(mockPayment);
            const payments = await PaymentService.getAll();
            expect(payments.length).toBe(1);
        });

        test('deve buscar por ID', async () => {
            await PaymentService.save(mockPayment);
            const payment = await PaymentService.getById('PAY-01');
            expect(payment.amount).toBe(150);
        });

        test('deve buscar por professor', async () => {
            await PaymentService.save(mockPayment);
            const payments = await PaymentService.getByProfessorId('PROF-TEST01');
            expect(payments.length).toBe(1);
        });

        test('deve buscar por aluno', async () => {
            await PaymentService.save(mockPayment);
            const payments = await PaymentService.getByStudentId('ALU-TEST01');
            expect(payments.length).toBe(1);
        });

        test('deve buscar pagamentos pendentes', async () => {
            await PaymentService.save(mockPayment);
            await PaymentService.save({ ...mockPayment, id: 'PAY-02', status: PaymentStatus.PAID });

            const pending = await PaymentService.getPendingByProfessorId('PROF-TEST01');
            expect(pending.length).toBe(1);
            expect(pending[0].id).toBe('PAY-01');
        });

        test('deve marcar como pago', async () => {
            await PaymentService.save(mockPayment);
            await PaymentService.markAsPaid('PAY-01');

            const payment = await PaymentService.getById('PAY-01');
            expect(payment.status).toBe(PaymentStatus.PAID);
            expect(payment.paidAt).toBeDefined();
        });
    });
});
