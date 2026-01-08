/**
 * Jest Setup - Mocks para módulos nativos
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
    let store = {};
    return {
        setItem: jest.fn((key, value) => {
            store[key] = value;
            return Promise.resolve();
        }),
        getItem: jest.fn((key) => {
            return Promise.resolve(store[key] || null);
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
            return Promise.resolve();
        }),
        multiRemove: jest.fn((keys) => {
            keys.forEach((key) => delete store[key]);
            return Promise.resolve();
        }),
        clear: jest.fn(() => {
            store = {};
            return Promise.resolve();
        }),
        getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
        __resetStore: () => {
            store = {};
        },
        __getStore: () => store,
    };
});

// Mock SecureStore
jest.mock('expo-secure-store', () => {
    let secureStore = {};
    return {
        setItemAsync: jest.fn((key, value) => {
            secureStore[key] = value;
            return Promise.resolve();
        }),
        getItemAsync: jest.fn((key) => {
            return Promise.resolve(secureStore[key] || null);
        }),
        deleteItemAsync: jest.fn((key) => {
            delete secureStore[key];
            return Promise.resolve();
        }),
        __resetStore: () => {
            secureStore = {};
        },
        __getStore: () => secureStore,
    };
});

// Mock expo-crypto
jest.mock('expo-crypto', () => ({
    digestStringAsync: jest.fn((algorithm, data) => {
        // Simula SHA256 com hash simples para testes
        const hash = Buffer.from(data).toString('base64').slice(0, 64);
        return Promise.resolve(hash);
    }),
    getRandomBytesAsync: jest.fn((length) => {
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
        return Promise.resolve(bytes);
    }),
    CryptoDigestAlgorithm: {
        SHA256: 'SHA256',
    },
}));

// Mock expo-local-authentication
jest.mock('expo-local-authentication', () => ({
    hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
    isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
    authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
    setNotificationHandler: jest.fn(),
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
    scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
    cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
    cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
    getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
    addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
    addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
    AndroidImportance: { MAX: 5 },
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
    appOwnership: 'standalone',
}));

// Mock Platform
jest.mock('react-native', () => ({
    Platform: {
        OS: 'android',
        select: jest.fn((obj) => obj.android || obj.default),
    },
}));

// Global Buffer polyfill para Node
if (typeof global.Buffer === 'undefined') {
    global.Buffer = require('buffer').Buffer;
}

// Silencia console.error e console.log durante testes
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};
