/// <reference types="vitest/config" />
import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import dts from 'vite-plugin-dts';

export default defineConfig({
    main: {
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'electron/main/index.ts'),
                },
            },
        },
    },
    preload: {
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'electron/preload/index.ts'),
                },
            },
        },
    },
    renderer: {
        root: '.',
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'index.html'),
                },
            },
        },
        resolve: {
            alias: {
                '@renderer': resolve('src'),
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        plugins: [
            vue({
                script: {
                    defineModel: true,
                },
            }),
            dts({
                insertTypesEntry: true,
            }),
        ],
    },
});
