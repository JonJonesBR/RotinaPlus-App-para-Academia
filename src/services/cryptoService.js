/**
 * CryptoService - Serviços de Criptografia
 * 
 * Utilidades para criptografar/descriptografar dados
 * para compartilhamento seguro via QR Code
 */
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

// Chave para armazenar a senha do usuário
const USER_KEY_STORAGE = 'rotina_plus_user_key';

/**
 * Serviço de Criptografia
 */
export const CryptoService = {
    /**
     * Gera hash SHA-256 de uma string
     * @param {string} data - Dados para hash
     * @returns {Promise<string>} Hash em hexadecimal
     */
    async hashData(data) {
        const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            data,
        );
        return digest;
    },

    /**
     * Gera código aleatório seguro
     * @param {number} length - Tamanho do código
     * @returns {Promise<string>} Código gerado
     */
    async generateSecureCode(length = 6) {
        const bytes = await Crypto.getRandomBytesAsync(length);
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sem caracteres ambíguos
        let code = '';
        for (let i = 0; i < length; i++) {
            code += chars[bytes[i] % chars.length];
        }
        return code;
    },

    /**
     * Salva a chave do usuário de forma segura
     * @param {string} key - Chave a ser salva
     */
    async saveUserKey(key) {
        try {
            await SecureStore.setItemAsync(USER_KEY_STORAGE, key);
            return true;
        } catch (error) {
            console.error('Erro ao salvar chave:', error);
            return false;
        }
    },

    /**
     * Recupera a chave do usuário
     * @returns {Promise<string|null>} Chave ou null
     */
    async getUserKey() {
        try {
            return await SecureStore.getItemAsync(USER_KEY_STORAGE);
        } catch (error) {
            console.error('Erro ao recuperar chave:', error);
            return null;
        }
    },

    /**
     * Remove a chave do usuário (logout)
     */
    async clearUserKey() {
        try {
            await SecureStore.deleteItemAsync(USER_KEY_STORAGE);
            return true;
        } catch (error) {
            console.error('Erro ao limpar chave:', error);
            return false;
        }
    },

    /**
     * Codifica dados para QR Code (Base64 compactado)
     * Nota: Para simplicidade, usamos Base64 sem criptografia pesada
     * Em produção, considerar crypto-js ou similar
     * @param {object} data - Dados para codificar
     * @returns {string} String codificada
     */
    encodeForQR(data) {
        try {
            const jsonString = JSON.stringify(data);
            // Usando btoa polyfill para React Native
            const base64 = Buffer.from(jsonString, 'utf-8').toString('base64');
            return base64;
        } catch (error) {
            console.error('Erro ao codificar para QR:', error);
            return null;
        }
    },

    /**
     * Decodifica dados de QR Code
     * @param {string} encoded - String codificada
     * @returns {object} Dados decodificados
     */
    decodeFromQR(encoded) {
        try {
            const jsonString = Buffer.from(encoded, 'base64').toString('utf-8');
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Erro ao decodificar QR:', error);
            return null;
        }
    },

    /**
     * Cria assinatura para validar integridade
     * @param {object} data - Dados para assinar
     * @returns {Promise<string>} Assinatura
     */
    async createSignature(data) {
        const jsonString = JSON.stringify(data);
        const hash = await this.hashData(jsonString);
        return hash.slice(0, 12); // Primeiros 12 caracteres do hash
    },

    /**
     * Verifica assinatura
     * @param {object} data - Dados originais
     * @param {string} signature - Assinatura para verificar
     * @returns {Promise<boolean>} Válido ou não
     */
    async verifySignature(data, signature) {
        const expectedSignature = await this.createSignature(data);
        return expectedSignature === signature;
    },
};

export default CryptoService;
