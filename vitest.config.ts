/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

const isCI = process.env.GITHUB_ACTIONS === 'true';

/** @type {import('vite').UserConfig} */
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
        reporters: isCI ? ['default', 'github-actions', 'json', 'junit'] : ['default', 'html'],
        outputFile: isCI ? { json: 'test-results.json', junit: 'test-results.xml' } : undefined,
        setupFiles: ['./test/setup.ts'],
        exclude: ['**/.claire/**', '**/.claude/**', '**/e2e/**', '**/node_modules/**'],
        coverage: {
            reporter: ['text', 'json-summary', 'html'],
        },
    },
});
