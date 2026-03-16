import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    {
        ignores: ['.claude/**', 'dist/**', 'out/**', 'build/**', 'dev-dist/**', 'node_modules/**', 'html/**'],
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
    // Node/CJS files (electron main process, config files)
    // ------------------------------------------------------------
    {
        files: ['*.cjs', '*.ts', 'electron/**/*.ts'],
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
        files: ['src/**/*.ts', 'src/**/*.vue', 'electron/**/*.ts'],
        languageOptions: {
            parser: vueParser,
            globals: {
                ...globals.browser,
                $: 'readonly',
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
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            'vue/require-default-prop': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/block-lang': [
                'error',
                {
                    script: {
                        lang: 'ts',
                    },
                },
            ],
        },
    },

    // ------------------------------------------------------------
    // Electron main process — Node globals
    // ------------------------------------------------------------
    {
        files: ['electron/**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },

    // ------------------------------------------------------------
    // Disable formatting rules that conflict with Prettier
    // ------------------------------------------------------------
    prettier,
];
