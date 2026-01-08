/**
 * Testes para formatters.js
 */
import {
    formatCPF,
    isValidCPFFormat,
    formatCurrency,
    formatDate,
    formatFrequencyDays,
} from '../../src/utils/formatters';

describe('formatters', () => {
    describe('formatCPF', () => {
        test('deve formatar CPF corretamente (XXX.XXX.XXX-XX)', () => {
            expect(formatCPF('12345678901')).toBe('123.456.789-01');
        });

        test('deve formatar CPF parcial', () => {
            expect(formatCPF('123')).toBe('123');
            expect(formatCPF('1234')).toBe('123.4');
            expect(formatCPF('1234567')).toBe('123.456.7');
        });

        test('deve remover caracteres não numéricos', () => {
            expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
            expect(formatCPF('abc123def456')).toBe('123.456');
        });

        test('deve limitar a 11 dígitos', () => {
            expect(formatCPF('123456789012345')).toBe('123.456.789-01');
        });

        test('deve retornar vazio para entrada vazia', () => {
            expect(formatCPF('')).toBe('');
        });
    });

    describe('isValidCPFFormat', () => {
        test('deve retornar true para CPF com 11 dígitos', () => {
            expect(isValidCPFFormat('12345678901')).toBe(true);
            expect(isValidCPFFormat('123.456.789-01')).toBe(true);
        });

        test('deve retornar false para CPF com menos de 11 dígitos', () => {
            expect(isValidCPFFormat('1234567890')).toBe(false);
            expect(isValidCPFFormat('123')).toBe(false);
        });

        test('deve retornar false para CPF com mais de 11 dígitos', () => {
            expect(isValidCPFFormat('123456789012')).toBe(false);
        });

        test('deve retornar false para string vazia', () => {
            expect(isValidCPFFormat('')).toBe(false);
        });
    });

    describe('formatCurrency', () => {
        test('deve formatar valores monetários corretamente', () => {
            const result = formatCurrency(150);
            expect(result).toMatch(/R\$\s?150,00/);
        });

        test('deve formatar valores decimais', () => {
            const result = formatCurrency(99.99);
            expect(result).toMatch(/R\$\s?99,99/);
        });

        test('deve formatar strings numéricas', () => {
            const result = formatCurrency('250.50');
            expect(result).toMatch(/R\$\s?250,50/);
        });

        test('deve retornar R$ 0,00 para valores inválidos', () => {
            const result = formatCurrency('abc');
            expect(result).toMatch(/R\$\s?0,00/);
        });

        test('deve formatar zero', () => {
            const result = formatCurrency(0);
            expect(result).toMatch(/R\$\s?0,00/);
        });

        test('deve formatar valores negativos', () => {
            const result = formatCurrency(-50);
            expect(result).toMatch(/-?\s?R\$\s?50,00/);
        });
    });

    describe('formatDate', () => {
        test('deve formatar Date para DD/MM/YYYY', () => {
            const date = new Date(2024, 0, 15); // 15 de janeiro de 2024
            const result = formatDate(date);
            expect(result).toBe('15/01/2024');
        });

        test('deve formatar string ISO date', () => {
            // Usando objeto Date local para evitar problemas de timezone
            const date = new Date(2024, 5, 20); // 20 de junho de 2024
            const result = formatDate(date);
            expect(result).toBe('20/06/2024');
        });

        test('deve retornar string vazia para null', () => {
            expect(formatDate(null)).toBe('');
        });

        test('deve retornar string vazia para undefined', () => {
            expect(formatDate(undefined)).toBe('');
        });
    });

    describe('formatFrequencyDays', () => {
        test('deve converter números para nomes dos dias', () => {
            expect(formatFrequencyDays([1])).toBe('Segunda');
            expect(formatFrequencyDays([2, 4])).toBe('Terça, Quinta');
            expect(formatFrequencyDays([1, 3, 5])).toBe('Segunda, Quarta, Sexta');
        });

        test('deve incluir todos os dias da semana', () => {
            expect(formatFrequencyDays([6])).toBe('Sábado');
            expect(formatFrequencyDays([7])).toBe('Domingo');
        });

        test('deve retornar mensagem padrão para array vazio', () => {
            expect(formatFrequencyDays([])).toBe('Nenhum dia selecionado');
        });

        test('deve retornar mensagem padrão para null', () => {
            expect(formatFrequencyDays(null)).toBe('Nenhum dia selecionado');
        });

        test('deve tratar dias inválidos', () => {
            expect(formatFrequencyDays([8])).toBe('Dia 8');
            expect(formatFrequencyDays([0])).toBe('Dia 0');
        });
    });
});
