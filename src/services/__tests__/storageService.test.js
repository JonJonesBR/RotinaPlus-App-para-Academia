import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserService, AlunoService, LegacyService, STORAGE_KEYS } from '../storageService';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

describe('StorageService', () => {
    let consoleSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        // Reset __DEV__ to true by default for tests
        global.__DEV__ = true;
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe('UserService', () => {
        it('should set current user correctly', async () => {
            const user = { id: '1', name: 'Test User' };
            const role = 'admin';

            await UserService.setCurrentUser(user, role);

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEYS.CURRENT_USER,
                JSON.stringify(user)
            );
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEYS.USER_ROLE,
                role
            );
        });

        it('should get current user', async () => {
            const user = { id: '1', name: 'Test User' };
            AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(user));

            const result = await UserService.getCurrentUser();

            expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_USER);
            expect(result).toEqual(user);
        });

        it('should return null if no user is logged in', async () => {
            AsyncStorage.getItem.mockResolvedValueOnce(null);
            const result = await UserService.getCurrentUser();
            expect(result).toBeNull();
        });
    });

    describe('AlunoService', () => {
        it('should get all alunos', async () => {
            const alunos = [{ id: '1', name: 'Aluno 1' }];
            AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(alunos));

            const result = await AlunoService.getAll();

            expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ALUNOS);
            expect(result).toEqual(alunos);
        });

        it('should save a new aluno', async () => {
            const existingAlunos = [];
            const newAluno = { id: '1', name: 'Novo Aluno' };

            AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingAlunos));

            await AlunoService.save(newAluno);

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEYS.ALUNOS,
                JSON.stringify([newAluno])
            );
        });

        it('should update an existing aluno', async () => {
            const existingAlunos = [{ id: '1', name: 'Old Name' }];
            const updatedAluno = { id: '1', name: 'New Name' };

            AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingAlunos));

            await AlunoService.save(updatedAluno);

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEYS.ALUNOS,
                JSON.stringify([updatedAluno])
            );
        });

        it('should delete an aluno', async () => {
            const existingAlunos = [
                { id: '1', name: 'Keep Me' },
                { id: '2', name: 'Delete Me' }
            ];

            AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingAlunos));

            await AlunoService.delete('2');

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEYS.ALUNOS,
                JSON.stringify([{ id: '1', name: 'Keep Me' }])
            );
        });
    });

    describe('LegacyService Migration', () => {
        it('should migrate legacy data successfully', async () => {
            // Setup legacy data
            const legacyStudents = JSON.stringify([{ id: 'old1', name: 'Legacy Student' }]);

            // Mock sequence:
            // 1. hasLegacyData -> getItem(STORAGE_KEYS.STUDENTS)
            // 2. migrateLegacyData -> hasLegacyData -> getItem(STORAGE_KEYS.STUDENTS)
            // 3. migrateLegacyData -> getItem(STORAGE_KEYS.STUDENTS) (the actual read)
            // 4. migrateLegacyData -> AlunoService.getAll -> getItem(STORAGE_KEYS.ALUNOS)

            AsyncStorage.getItem
                .mockResolvedValueOnce(legacyStudents) // inside migrateLegacyData -> hasLegacyData check
                .mockResolvedValueOnce(legacyStudents) // read legacy data
                .mockResolvedValueOnce(JSON.stringify([])); // get current alunos

            const result = await LegacyService.migrateLegacyData();

            expect(result).toBe(true);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEYS.ALUNOS,
                expect.stringContaining('Legacy Student')
            );
            expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.STUDENTS);
        });

        it('should not migrate if no legacy data exists', async () => {
            AsyncStorage.getItem.mockResolvedValue(null);

            const result = await LegacyService.migrateLegacyData();

            expect(result).toBe(false);
            expect(AsyncStorage.setItem).not.toHaveBeenCalled();
        });
    });

    describe('Production Logs Safety', () => {
        it('should log error in DEV mode', async () => {
            global.__DEV__ = true;
            AsyncStorage.getItem.mockRejectedValueOnce(new Error('Async error'));

            await UserService.getCurrentUser();

            expect(consoleSpy).toHaveBeenCalled();
        });

        it('should NOT log error in Production mode', async () => {
            global.__DEV__ = false;
            AsyncStorage.getItem.mockRejectedValueOnce(new Error('Async error'));

            await UserService.getCurrentUser();

            expect(consoleSpy).not.toHaveBeenCalled();
        });
    });
});
