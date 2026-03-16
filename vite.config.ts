/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { fileURLToPath, URL } from 'node:url';
import { dirname, resolve } from 'node:path';
import Inspect from 'vite-plugin-inspect';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
/* import AutoImport from "unplugin-auto-import/vite";
import i18nResources from "vite-plugin-i18n-resources"
import checker from 'vite-plugin-checker';
import * as path from 'path';
import fs from 'fs';
import legacy from '@vitejs/plugin-legacy'
import vueDevTools from 'vite-plugin-vue-devtools'; */
import Inspector from 'vite-plugin-vue-inspector';
import TurboConsole from 'unplugin-turbo-console/vite';

/** @type {import('vite').UserConfig} */
export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        reporters: ['default', 'html'],
        setupFiles: ['./test/setup.ts'],
        exclude: ['**/.claude/**', '**/e2e/**', '**/node_modules/**'],
    },
    plugins: [
        vue({
            script: {
                defineModel: true,
            },
        }),
        VueI18nPlugin({
            include: [resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**')],
        }),
        dts({
            insertTypesEntry: true,
        }),
        /*
        // https://github.com/feat-agency/vite-plugin-webfont-dl#options
        webfontDownload(),
        checker({
            vueTsc: true,
            typescript: false,
        }),
        TurboConsole(),
        i18nResources({
            path: resolve(__dirname, "src/locales"),
        }),
        AutoImport({
            imports: ["vue", "@vueuse/core"],
            resolvers: [],
            dirs: ["./composables/" + "**", "./views/" + "**"],
            vueTemplate: true,
            cache: true
        }),
        splitVendorChunkPlugin(),
        legacy({ targets: ["defaults", "not IE 11"] }), */
        Inspect(),
        Inspector(),
        //vueDevTools(),
        TurboConsole(),
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
                        if (id.includes('fontawesome') || id.includes('fortawesome')) {
                            return 'fontawesome';
                        }
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
    },
});
