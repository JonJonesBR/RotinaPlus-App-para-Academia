import { validators, generateProfessorId, generateAlunoId, UserRole } from '../dataModels';

describe('dataModels', () => {
    describe('validators', () => {
        it('isValidEmail should validate email correctly', () => {
            expect(validators.isValidEmail('test@example.com')).toBe(true);
            expect(validators.isValidEmail('invalid-email')).toBe(false);
        });

        it('isValidPhone should validate phone correctly', () => {
            expect(validators.isValidPhone('11999999999')).toBe(true); // 11 digits
            expect(validators.isValidPhone('1199999999')).toBe(true);  // 10 digits
            expect(validators.isValidPhone('11999')).toBe(false);
        });

        it('isValidProfessorCode should validate format', () => {
            expect(validators.isValidProfessorCode('PROF-A1B2C3')).toBe(true);
            expect(validators.isValidProfessorCode('INVALID')).toBe(false);
        });
    });

    describe('ID Generators', () => {
        it('generateProfessorId should return string starting with PROF-', () => {
            const id = generateProfessorId();
            expect(id.startsWith('PROF-')).toBe(true);
            expect(id.length).toBe(11); // PROF- + 6 chars
        });

        it('generateAlunoId should return string starting with ALU-', () => {
            const id = generateAlunoId();
            expect(id.startsWith('ALU-')).toBe(true);
            expect(id.length).toBe(10); // ALU- + 6 chars
        });
    });

    describe('Enums', () => {
        it('UserRole should have expected values', () => {
            expect(UserRole.PROFESSOR).toBe('professor');
            expect(UserRole.ALUNO).toBe('aluno');
        });
    });
});
