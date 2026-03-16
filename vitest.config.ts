/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        vue({
            script: {
                defineModel: true,
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        reporters: ['default', 'html'],
        setupFiles: ['./test/setup.ts'],
        exclude: ['**/.claire/**', '**/.claude/**', '**/e2e/**', '**/node_modules/**'],
        coverage: {
            reporter: ['text', 'json-summary', 'html'],
        },
    },
});
