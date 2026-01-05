import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { fileURLToPath, URL } from 'node:url';
import inject from '@rollup/plugin-inject';
import Inspect from 'vite-plugin-inspect';
/* import AutoImport from "unplugin-auto-import/vite";
import i18nResources from "vite-plugin-i18n-resources"
import checker from 'vite-plugin-checker';
import * as path from 'path';
import fs from 'fs';
import legacy from '@vitejs/plugin-legacy'
import { VitePWA } from 'vite-plugin-pwa';
import vueDevTools from 'vite-plugin-vue-devtools';
import Inspector from 'vite-plugin-vue-inspector';
import TurboConsole from 'unplugin-turbo-console/vite'; */

/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [
        vue({
            script: {
                defineModel: true,
            },
        }),
        dts({
            insertTypesEntry: true,
        }),
        inject({
            jQuery: 'jquery',
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
        legacy({ targets: ["defaults", "not IE 11"] }),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
        }), */
        Inspect(),
        //Inspector(),
        //vueDevTools(),
        //TurboConsole(),
    ],
    optimizeDeps: {
        include: [
            'jquery',
            'select2',
            'jquery-passwordRequirements'
        ]
    },
    include: [
      'jquery',
      'select2',
      'jquery-password-requirements'
    ]
    build: {
        sourcemap: false,
        rollupOptions: {
            preserveEntrySignatures: 'allow-extension',
            output: {
                preserveModules: false,
                validate: true,
                inlineDynamicImports: false,
                interop: 'compat', // "compat"| "auto"| "esModule"| "default"| "defaultOnly"
                format: 'es', // es | umd
                globals: {
                    jquery: '$',
                },
                generatedCode: {
                    preset: 'es2015', // es5 | es2015
                    constBindings: true,
                    arrowFunctions: true,
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
