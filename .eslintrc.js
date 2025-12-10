module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    plugins: ['react', 'react-hooks', 'react-native'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    env: {
        'react-native/react-native': true,
        es2021: true,
        node: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        // React
        'react/prop-types': 'off', // Desativado pois não usamos PropTypes
        'react/react-in-jsx-scope': 'off', // React 17+ não precisa de import
        'react/display-name': 'off',

        // React Hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // Geral
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'prefer-const': 'error',
        'no-var': 'error',

        // Estilo
        'semi': ['error', 'always'],
        'quotes': ['error', 'single', { avoidEscape: true }],
        'comma-dangle': ['error', 'always-multiline'],
    },
    ignorePatterns: [
        'node_modules/',
        '.expo/',
        'dist/',
        'web-build/',
    ],
};
