module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['./jest.setup.js'],
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|expo|@expo|expo-crypto|expo-secure-store|expo-local-authentication|expo-notifications|expo-constants|@react-native-async-storage/async-storage)/)',
    ],
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!**/node_modules/**',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};
