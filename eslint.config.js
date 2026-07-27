const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
    {
        ignores: ['node_modules/', '.expo/', 'dist/', 'web-build/'],
    },
    js.configs.recommended,
    react.configs.flat.recommended,
    prettierConfig,
    {
        plugins: {
            'react-hooks': reactHooks,
        },
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                ...globals.es2021,
                ...globals.node,
                ...globals.jest,
            },
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
    },
];
