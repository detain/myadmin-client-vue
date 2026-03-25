/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { fileURLToPath, URL } from 'node:url';
//import { dirname, resolve } from 'node:path';
import Inspect from 'vite-plugin-inspect';
// VueI18nPlugin removed - no <i18n> SFC blocks are used, locales are lazy-loaded via dynamic import()
// import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
//import { VitePWA } from 'vite-plugin-pwa';
import checker from 'vite-plugin-checker';
//import * as path from 'path';
//import fs from 'fs';
/* 
import vueDevTools from 'vite-plugin-vue-devtools'; 
*/
import Inspector from 'vite-plugin-vue-inspector';
import TurboConsole from 'unplugin-turbo-console/vite';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('vite').UserConfig} */
export default defineConfig({
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
    plugins: [
        vue({
            script: {
                defineModel: true,
            },
        }),
        // VueI18nPlugin - no <i18n> SFC blocks are used, locales are lazy-loaded via dynamic import()
        // VueI18nPlugin({
        //     include: [resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**')],
        // }),
        // dts generates .d.ts type declarations - only needed for library development
        ...(!isProd ? [dts({ insertTypesEntry: true })] : []),
        checker({
            vueTsc: true,
            typescript: false,
        }),
        /*
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
        }), */
        // Dev-only plugins: inspector, inspect, turbo-console
        ...(!isProd ? [Inspect(), Inspector(), TurboConsole()] : []),
    ],
    optimizeDeps: {
        include: ['jquery', 'select2'],
        exclude: ['playwright', 'playwright-core', 'chromium-bidi'],
    },
    include: ['jquery', 'select2'],
    build: {
        sourcemap: false,
        modulePreload: {
            polyfill: true,
        },
        rolldownOptions: {
            output: {
                format: 'es',
                globals: {
                    jquery: '$',
                },
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router') || id.includes('vue-i18n')) {
                            return 'framework';
                        }
                        if (id.includes('admin-lte') || id.includes('jquery') || id.includes('bootstrap') || id.includes('select2')) {
                            return 'legacy-ui';
                        }

                        return 'vendor';
                    }

                    if (id.includes('/src/views/')) {
                        const viewScope = id.split('/src/views/')[1]?.split('/')[0];
                        return viewScope ? `view-${viewScope}` : 'views';
                    }

                    return undefined;
                },
            },
        },
    },
    resolve: {
        alias: {
            //'@': path.resolve(__dirname, './src'),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
        },
    },
    server: {
        allowedHosts: true,
        cors: true,
        watch: {
          ignored: ['**/.claire/**', '**/.claude/**']
        }
    },
});
