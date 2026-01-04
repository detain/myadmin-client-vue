import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    // ------------------------------------------------------------
    // ESLint core recommended
    // ------------------------------------------------------------
    js.configs.recommended,

    // ------------------------------------------------------------
    // Vue recommended rules (ARRAY → must be spread)
    // ------------------------------------------------------------
    ...vue.configs['flat/recommended'],

    // ------------------------------------------------------------
    // TypeScript + Vue files
    // ------------------------------------------------------------
    {
        files: ['src/**/*.ts', 'src/**/*.vue'],

        languageOptions: {
            parser: vueParser,
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                parser: tsParser,
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },

        plugins: {
            '@typescript-eslint': tseslint,
        },

        rules: {
            'prefer-template': 'error',
            'no-useless-concat': 'error',

            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            'vue/multi-word-component-names': 'off',
        },
    },

    // ------------------------------------------------------------
    // Disable formatting rules that conflict with Prettier
    // ------------------------------------------------------------
    prettier,
];
