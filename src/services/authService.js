/**
 * AuthService - Serviço de autenticação local
 * 
 * Gerencia PIN, biometria e estado de autenticação
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const AUTH_KEYS = {
    PIN_HASH: 'auth_pin_hash',
    PIN_ENABLED: 'auth_pin_enabled',
    BIOMETRICS_ENABLED: 'auth_biometrics_enabled',
    LAST_AUTH_TIME: 'auth_last_time',
    AUTH_TIMEOUT: 'auth_timeout', // em minutos
};

// Tempo padrão para pedir PIN novamente (5 minutos)
const DEFAULT_TIMEOUT = 5;

export const AuthService = {
    /**
     * Verifica se PIN está configurado
     */
    async isPinEnabled() {
        try {
            const enabled = await AsyncStorage.getItem(AUTH_KEYS.PIN_ENABLED);
            return enabled === 'true';
        } catch {
            return false;
        }
    },

    /**
     * Configura um novo PIN
     */
    async setupPin(pin) {
        try {
            // Salva PIN de forma segura
            await SecureStore.setItemAsync(AUTH_KEYS.PIN_HASH, pin);
            await AsyncStorage.setItem(AUTH_KEYS.PIN_ENABLED, 'true');
            await this.updateLastAuthTime();
            return true;
        } catch (error) {
            console.error('Erro ao configurar PIN:', error);
            return false;
        }
    },

    /**
     * Valida o PIN informado
     */
    async validatePin(pin) {
        try {
            const savedPin = await SecureStore.getItemAsync(AUTH_KEYS.PIN_HASH);

            if (savedPin === pin) {
                await this.updateLastAuthTime();
                return { success: true };
            }

            return { success: false, error: 'PIN incorreto' };
        } catch (error) {
            console.error('Erro ao validar PIN:', error);
            return { success: false, error: 'Erro ao validar' };
        }
    },

    /**
     * Remove o PIN configurado
     */
    async removePin() {
        try {
            await SecureStore.deleteItemAsync(AUTH_KEYS.PIN_HASH);
            await AsyncStorage.setItem(AUTH_KEYS.PIN_ENABLED, 'false');
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Altera o PIN
     */
    async changePin(currentPin, newPin) {
        const validation = await this.validatePin(currentPin);
        if (!validation.success) {
            return { success: false, error: 'PIN atual incorreto' };
        }

        const result = await this.setupPin(newPin);
        return { success: result };
    },

    /**
     * Verifica se biometria está disponível
     */
    async isBiometricAvailable() {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            return compatible && enrolled;
        } catch {
            return false;
        }
    },

    /**
     * Verifica se biometria está habilitada
     */
    async isBiometricEnabled() {
        try {
            const enabled = await AsyncStorage.getItem(AUTH_KEYS.BIOMETRICS_ENABLED);
            return enabled === 'true';
        } catch {
            return false;
        }
    },

    /**
     * Habilita/desabilita biometria
     */
    async setBiometricEnabled(enabled) {
        try {
            await AsyncStorage.setItem(AUTH_KEYS.BIOMETRICS_ENABLED, enabled ? 'true' : 'false');
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Autentica com biometria
     */
    async authenticateWithBiometric() {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Autentique-se para acessar',
                cancelLabel: 'Usar PIN',
                fallbackLabel: 'Usar PIN',
                disableDeviceFallback: true,
            });

            if (result.success) {
                await this.updateLastAuthTime();
            }

            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Atualiza o timestamp da última autenticação
     */
    async updateLastAuthTime() {
        await AsyncStorage.setItem(AUTH_KEYS.LAST_AUTH_TIME, Date.now().toString());
    },

    /**
     * Verifica se precisa pedir autenticação novamente
     */
    async needsAuthentication() {
        try {
            // Se PIN não está habilitado, não precisa autenticar
            const pinEnabled = await this.isPinEnabled();
            if (!pinEnabled) return false;

            // Verifica o tempo desde última autenticação
            const lastAuth = await AsyncStorage.getItem(AUTH_KEYS.LAST_AUTH_TIME);
            if (!lastAuth) return true;

            const timeoutStr = await AsyncStorage.getItem(AUTH_KEYS.AUTH_TIMEOUT);
            const timeout = timeoutStr ? parseInt(timeoutStr) : DEFAULT_TIMEOUT;

            const elapsed = (Date.now() - parseInt(lastAuth)) / 1000 / 60; // em minutos
            return elapsed > timeout;
        } catch {
            return true;
        }
    },

    /**
     * Define o timeout de autenticação (em minutos)
     */
    async setAuthTimeout(minutes) {
        await AsyncStorage.setItem(AUTH_KEYS.AUTH_TIMEOUT, minutes.toString());
    },

    /**
     * Obtém o timeout configurado
     */
    async getAuthTimeout() {
        try {
            const timeout = await AsyncStorage.getItem(AUTH_KEYS.AUTH_TIMEOUT);
            return timeout ? parseInt(timeout) : DEFAULT_TIMEOUT;
        } catch {
            return DEFAULT_TIMEOUT;
        }
    },

    /**
     * Retorna informações de autenticação disponíveis
     */
    async getAuthInfo() {
        const [pinEnabled, biometricAvailable, biometricEnabled] = await Promise.all([
            this.isPinEnabled(),
            this.isBiometricAvailable(),
            this.isBiometricEnabled(),
        ]);

        return {
            pinEnabled,
            biometricAvailable,
            biometricEnabled: biometricAvailable && biometricEnabled,
        };
    },
};

export default AuthService;
