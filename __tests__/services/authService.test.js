/**
 * Testes para authService.js
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { AuthService } from '../../src/services/authService';

describe('AuthService', () => {
    beforeEach(() => {
        AsyncStorage.__resetStore();
        SecureStore.__resetStore();
        jest.clearAllMocks();
    });

    describe('PIN Management', () => {
        describe('isPinEnabled', () => {
            test('deve retornar false quando PIN não está configurado', async () => {
                const enabled = await AuthService.isPinEnabled();
                expect(enabled).toBe(false);
            });

            test('deve retornar true quando PIN está configurado', async () => {
                await AsyncStorage.setItem('auth_pin_enabled', 'true');
                const enabled = await AuthService.isPinEnabled();
                expect(enabled).toBe(true);
            });
        });

        describe('setupPin', () => {
            test('deve configurar PIN corretamente', async () => {
                const result = await AuthService.setupPin('1234');
                expect(result).toBe(true);
                expect(await AuthService.isPinEnabled()).toBe(true);
            });

            test('deve salvar PIN no SecureStore', async () => {
                await AuthService.setupPin('5678');
                expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_pin_hash', '5678');
            });
        });

        describe('validatePin', () => {
            test('deve validar PIN correto', async () => {
                await AuthService.setupPin('1234');
                const result = await AuthService.validatePin('1234');
                expect(result.success).toBe(true);
            });

            test('deve rejeitar PIN incorreto', async () => {
                await AuthService.setupPin('1234');
                const result = await AuthService.validatePin('9999');
                expect(result.success).toBe(false);
                expect(result.error).toBeDefined();
            });

            test('deve atualizar último tempo de autenticação ao validar', async () => {
                await AuthService.setupPin('1234');
                await AuthService.validatePin('1234');
                const lastAuth = await AsyncStorage.getItem('auth_last_time');
                expect(lastAuth).toBeDefined();
            });
        });

        describe('removePin', () => {
            test('deve remover PIN configurado', async () => {
                await AuthService.setupPin('1234');
                expect(await AuthService.isPinEnabled()).toBe(true);

                const result = await AuthService.removePin();
                expect(result).toBe(true);
                expect(await AuthService.isPinEnabled()).toBe(false);
            });
        });

        describe('changePin', () => {
            test('deve alterar PIN quando PIN atual está correto', async () => {
                await AuthService.setupPin('1234');
                const result = await AuthService.changePin('1234', '5678');
                expect(result.success).toBe(true);

                const validation = await AuthService.validatePin('5678');
                expect(validation.success).toBe(true);
            });

            test('deve rejeitar alteração quando PIN atual está incorreto', async () => {
                await AuthService.setupPin('1234');
                const result = await AuthService.changePin('9999', '5678');
                expect(result.success).toBe(false);
                expect(result.error).toContain('incorreto');
            });
        });
    });

    describe('Biometrics', () => {
        describe('isBiometricAvailable', () => {
            test('deve retornar true quando hardware e enrollment disponíveis', async () => {
                LocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
                LocalAuthentication.isEnrolledAsync.mockResolvedValue(true);

                const available = await AuthService.isBiometricAvailable();
                expect(available).toBe(true);
            });

            test('deve retornar false quando hardware não disponível', async () => {
                LocalAuthentication.hasHardwareAsync.mockResolvedValue(false);
                LocalAuthentication.isEnrolledAsync.mockResolvedValue(true);

                const available = await AuthService.isBiometricAvailable();
                expect(available).toBe(false);
            });

            test('deve retornar false quando não há enrollment', async () => {
                LocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
                LocalAuthentication.isEnrolledAsync.mockResolvedValue(false);

                const available = await AuthService.isBiometricAvailable();
                expect(available).toBe(false);
            });
        });

        describe('isBiometricEnabled / setBiometricEnabled', () => {
            test('deve retornar false por padrão', async () => {
                const enabled = await AuthService.isBiometricEnabled();
                expect(enabled).toBe(false);
            });

            test('deve habilitar biometria', async () => {
                await AuthService.setBiometricEnabled(true);
                const enabled = await AuthService.isBiometricEnabled();
                expect(enabled).toBe(true);
            });

            test('deve desabilitar biometria', async () => {
                await AuthService.setBiometricEnabled(true);
                await AuthService.setBiometricEnabled(false);
                const enabled = await AuthService.isBiometricEnabled();
                expect(enabled).toBe(false);
            });
        });

        describe('authenticateWithBiometric', () => {
            test('deve chamar LocalAuthentication.authenticateAsync', async () => {
                LocalAuthentication.authenticateAsync.mockResolvedValue({ success: true });

                const result = await AuthService.authenticateWithBiometric();
                expect(result.success).toBe(true);
                expect(LocalAuthentication.authenticateAsync).toHaveBeenCalled();
            });

            test('deve atualizar último tempo ao autenticar com sucesso', async () => {
                LocalAuthentication.authenticateAsync.mockResolvedValue({ success: true });

                await AuthService.authenticateWithBiometric();
                const lastAuth = await AsyncStorage.getItem('auth_last_time');
                expect(lastAuth).toBeDefined();
            });
        });
    });

    describe('Authentication Timeout', () => {
        describe('needsAuthentication', () => {
            test('deve retornar false quando PIN não está habilitado', async () => {
                const needs = await AuthService.needsAuthentication();
                expect(needs).toBe(false);
            });

            test('deve retornar true quando PIN habilitado e sem última autenticação', async () => {
                await AuthService.setupPin('1234');
                await AsyncStorage.removeItem('auth_last_time');

                const needs = await AuthService.needsAuthentication();
                expect(needs).toBe(true);
            });

            test('deve retornar false quando autenticação recente', async () => {
                await AuthService.setupPin('1234');
                await AuthService.updateLastAuthTime();

                const needs = await AuthService.needsAuthentication();
                expect(needs).toBe(false);
            });

            test('deve retornar true quando timeout expira', async () => {
                await AuthService.setupPin('1234');
                // Define última autenticação como 10 minutos atrás
                const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
                await AsyncStorage.setItem('auth_last_time', tenMinutesAgo.toString());

                const needs = await AuthService.needsAuthentication();
                expect(needs).toBe(true);
            });
        });

        describe('setAuthTimeout / getAuthTimeout', () => {
            test('deve retornar timeout padrão (5 minutos)', async () => {
                const timeout = await AuthService.getAuthTimeout();
                expect(timeout).toBe(5);
            });

            test('deve salvar e recuperar timeout customizado', async () => {
                await AuthService.setAuthTimeout(15);
                const timeout = await AuthService.getAuthTimeout();
                expect(timeout).toBe(15);
            });
        });
    });

    describe('getAuthInfo', () => {
        test('deve retornar informações completas de autenticação', async () => {
            await AuthService.setupPin('1234');
            LocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
            LocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
            await AuthService.setBiometricEnabled(true);

            const info = await AuthService.getAuthInfo();
            expect(info.pinEnabled).toBe(true);
            expect(info.biometricAvailable).toBe(true);
            expect(info.biometricEnabled).toBe(true);
        });

        test('deve retornar biometricEnabled false quando não disponível', async () => {
            await AuthService.setBiometricEnabled(true);
            LocalAuthentication.hasHardwareAsync.mockResolvedValue(false);

            const info = await AuthService.getAuthInfo();
            expect(info.biometricEnabled).toBe(false);
        });
    });
});
