import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    {
        ignores: ['dist/**', 'out/**', 'build/**', 'dev-dist/**', 'node_modules/**'],
    },
    // ------------------------------------------------------------
    // ESLint core recommended
    // ------------------------------------------------------------
    js.configs.recommended,

    // ------------------------------------------------------------
    // Vue recommended rules (ARRAY → must be spread)
    // ------------------------------------------------------------
    ...vue.configs['flat/recommended'],

    {
        files: ['*.cjs', '*.ts'],
        languageOptions: {
            globals: {
                process: 'readonly',
                module: 'readonly',
                require: 'readonly',
                __dirname: 'readonly',
            },
        },
    },

    // ------------------------------------------------------------
    // TypeScript + Vue files
    // ------------------------------------------------------------
    {
        files: ['src/**/*.ts', 'src/**/*.vue'],
        languageOptions: {
            parser: vueParser,
            globals: {
                ...globals.browser,
                $: 'readonly', // for jQuery or dev helpers
                NodeJS: 'readonly',
                JQuery: 'readonly',
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
            'vue/no-v-html': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            '@typescript-eslint/ban-types': 'off', // disable for d.ts if needed

            'vue/multi-word-component-names': 'off',
        },
    },

    // ------------------------------------------------------------
    // Disable formatting rules that conflict with Prettier
    // ------------------------------------------------------------
    prettier,
];
