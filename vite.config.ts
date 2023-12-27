import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
//import AutoImport from "unplugin-auto-import/vite";
//import i18nResources from "vite-plugin-i18n-resources"
//import checker from 'vite-plugin-checker';
//import * as path from 'path';
import { fileURLToPath, URL } from 'node:url';
import fs from 'fs';
import inject from '@rollup/plugin-inject';
import legacy from '@vitejs/plugin-legacy'
import { VitePWA } from 'vite-plugin-pwa';
//import VueDevTools from 'vite-plugin-vue-devtools';
import Inspect from 'vite-plugin-inspect';
//import Inspector from 'vite-plugin-vue-inspector';
//import TurboConsole from 'unplugin-turbo-console/vite';

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
        // https://github.com/feat-agency/vite-plugin-webfont-dl#options
        //webfontDownload(),
        inject({
            jQuery: 'jquery',
        }),
        /*
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
*/
        legacy({ targets: ["defaults", "not IE 11"] }),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
        }),
        Inspect(),
        //Inspector(),
        //VueDevTools(),
        //        TurboConsole(),
    ],
    /*
    optimizeDeps: {
        disabled: false,
        include: ['jquery'],
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    accounts: [ './src/views/account/*.vue',  ],
                    backups: [ './src/views/backups/*.vue',  ],
                    dns: [ './src/views/dns/*.vue',  ],
                    domains: [ './src/views/domains/*.vue',  ],
                    floating_ips: [ './src/views/floating_ips/*.vue',  ],
                    main: [ './src/views/*.vue', './src/views/billing/*.vue',  ],
                    licenses: [ './src/views/licenses/*.vue',  ],
                    mail: [ './src/views/mail/*.vue',  ],
                    quickservers: [ './src/views/quickservers/*.vue',  ],
                    servers: [ './src/views/servers/*.vue',  ],
                    ssl: [ './src/views/ssl/*.vue',  ],
                    tickets: [ './src/views/tickets/*.vue',  ],
                    users: [ './src/views/users/*.vue',  ],
                    vps: [ './src/views/vps/*.vue',  ],
                    webhosting: [ './src/views/webhosting/*.vue',  ],
                    affiliates: [ './src/views/billing/affiliates/*.vue', ],
                    chartjs: ['chart.js'],
                },
            },
        },
        commonjsOptions: {
            include: [],
        },
    },
    */
    resolve: {
        alias: {
            //'@': path.resolve(__dirname, './src'),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
