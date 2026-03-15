/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { fileURLToPath, URL } from 'node:url';
import Inspect from 'vite-plugin-inspect';
import { VitePWA } from 'vite-plugin-pwa';
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
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
        }),
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
                        if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
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
    /**/
    resolve: {
        alias: {
            //'@': path.resolve(__dirname, './src'),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        allowedHosts: true,
    },
});
