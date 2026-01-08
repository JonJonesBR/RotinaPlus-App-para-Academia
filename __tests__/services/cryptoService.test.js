/**
 * Testes para cryptoService.js
 */
import { CryptoService } from '../../src/services/cryptoService';
import * as SecureStore from 'expo-secure-store';

describe('CryptoService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        SecureStore.__resetStore();
    });

    describe('hashData', () => {
        test('deve gerar hash para uma string', async () => {
            const hash = await CryptoService.hashData('test data');
            expect(hash).toBeDefined();
            expect(typeof hash).toBe('string');
            expect(hash.length).toBeGreaterThan(0);
        });

        test('deve gerar hash diferente para strings diferentes', async () => {
            const hash1 = await CryptoService.hashData('string1');
            const hash2 = await CryptoService.hashData('string2');
            expect(hash1).not.toBe(hash2);
        });

        test('deve gerar hash igual para mesma string', async () => {
            const hash1 = await CryptoService.hashData('same string');
            const hash2 = await CryptoService.hashData('same string');
            expect(hash1).toBe(hash2);
        });
    });

    describe('generateSecureCode', () => {
        test('deve gerar código com tamanho padrão (6)', async () => {
            const code = await CryptoService.generateSecureCode();
            expect(code.length).toBe(6);
        });

        test('deve gerar código com tamanho customizado', async () => {
            const code = await CryptoService.generateSecureCode(10);
            expect(code.length).toBe(10);
        });

        test('deve gerar códigos únicos', async () => {
            const codes = new Set();
            for (let i = 0; i < 50; i++) {
                codes.add(await CryptoService.generateSecureCode());
            }
            // A maioria deve ser única (pode haver colisões raras)
            expect(codes.size).toBeGreaterThan(45);
        });

        test('deve usar apenas caracteres não ambíguos', async () => {
            const allowedChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            for (let i = 0; i < 20; i++) {
                const code = await CryptoService.generateSecureCode();
                for (const char of code) {
                    expect(allowedChars).toContain(char);
                }
            }
        });
    });

    describe('saveUserKey / getUserKey', () => {
        test('deve salvar e recuperar chave do usuário', async () => {
            const key = 'my-secret-key';
            const saved = await CryptoService.saveUserKey(key);
            expect(saved).toBe(true);

            const retrieved = await CryptoService.getUserKey();
            expect(retrieved).toBe(key);
        });

        test('deve retornar null quando não há chave salva', async () => {
            const key = await CryptoService.getUserKey();
            expect(key).toBeNull();
        });
    });

    describe('clearUserKey', () => {
        test('deve limpar a chave do usuário', async () => {
            await CryptoService.saveUserKey('key-to-delete');
            expect(await CryptoService.getUserKey()).toBe('key-to-delete');

            const cleared = await CryptoService.clearUserKey();
            expect(cleared).toBe(true);
            expect(await CryptoService.getUserKey()).toBeNull();
        });
    });

    describe('encodeForQR / decodeFromQR', () => {
        test('deve codificar e decodificar objeto corretamente', () => {
            const data = {
                type: 'test',
                payload: { id: 123, name: 'Test' },
                timestamp: Date.now(),
            };

            const encoded = CryptoService.encodeForQR(data);
            expect(typeof encoded).toBe('string');
            expect(encoded.length).toBeGreaterThan(0);

            const decoded = CryptoService.decodeFromQR(encoded);
            expect(decoded).toEqual(data);
        });

        test('deve preservar tipos de dados', () => {
            const data = {
                number: 42,
                string: 'hello',
                boolean: true,
                array: [1, 2, 3],
                nested: { a: 'b' },
            };

            const encoded = CryptoService.encodeForQR(data);
            const decoded = CryptoService.decodeFromQR(encoded);
            expect(decoded).toEqual(data);
        });

        test('deve retornar null para dados inválidos', () => {
            const decoded = CryptoService.decodeFromQR('invalid-base64!!!');
            expect(decoded).toBeNull();
        });

        test('encodeForQR deve retornar null para erro', () => {
            // Passa objeto circular que não pode ser stringificado
            const circular = {};
            circular.self = circular;
            const encoded = CryptoService.encodeForQR(circular);
            expect(encoded).toBeNull();
        });
    });

    describe('createSignature / verifySignature', () => {
        test('deve criar assinatura para dados', async () => {
            const data = { id: 1, name: 'teste' };
            const signature = await CryptoService.createSignature(data);
            expect(signature).toBeDefined();
            expect(signature.length).toBe(12);
        });

        test('deve verificar assinatura válida', async () => {
            const data = { id: 1, name: 'teste' };
            const signature = await CryptoService.createSignature(data);
            const isValid = await CryptoService.verifySignature(data, signature);
            expect(isValid).toBe(true);
        });

        test('deve rejeitar assinatura inválida', async () => {
            const data = { id: 1, name: 'teste' };
            const isValid = await CryptoService.verifySignature(data, 'invalid-sig');
            expect(isValid).toBe(false);
        });

        test('deve rejeitar assinatura de dados diferentes', async () => {
            const data1 = { id: 1 };
            const data2 = { id: 2 };
            const signature = await CryptoService.createSignature(data1);
            const isValid = await CryptoService.verifySignature(data2, signature);
            expect(isValid).toBe(false);
        });

        test('mesmos dados devem gerar mesma assinatura', async () => {
            const data = { key: 'value' };
            const sig1 = await CryptoService.createSignature(data);
            const sig2 = await CryptoService.createSignature(data);
            expect(sig1).toBe(sig2);
        });
    });
});
