/// <reference types="vitest/config" />
import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import dts from 'vite-plugin-dts';

export default defineConfig({
    main: {},
    preload: {},
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
                '@': fileURLToPath(new URL('./src/renderer/src', import.meta.url)),
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
