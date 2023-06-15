import { defineConfig } from "vite";
import VueDevTools from "vite-plugin-vue-devtools";
import vue from "@vitejs/plugin-vue";
import Inspect from "vite-plugin-inspect";
import Inspector from "vite-plugin-vue-inspector";
//import Inspector from 'unplugin-vue-inspector/vite'
import AutoImport from "unplugin-auto-import/vite";
//import i18nResources from "vite-plugin-i18n-resources"
import checker from "vite-plugin-checker";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import inject from "@rollup/plugin-inject";
import { VitePWA } from "vite-plugin-pwa";
//import legacy from '@vitejs/plugin-legacy'
//import { dependencies } from "./package.json";
import webfontDownload from 'vite-plugin-webfont-dl';
//import { splitVendorChunkPlugin } from "vite";
//import basicSsl from '@vitejs/plugin-basic-ssl'

/*function renderChunks(deps) {
    console.log("Deps:");
    console.log(deps);
    let chunks = {};
    Object.keys(deps).forEach((key) => {
        if (["react", "react-router-dom", "react-dom"].includes(key)) return;
        chunks[key] = [key];
    });
    return chunks;
}*/

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.ELECTRON == "true" ? "./" : "/",
    plugins: [
        vue({
            script: {
                defineModel: true
            }
        }),
        // basicSsl(),
        // https://github.com/feat-agency/vite-plugin-webfont-dl#options
        webfontDownload(),
        inject({
            jQuery: "jquery"
        }),
        checker({
            vueTsc: false,
            typescript: false
        }),
        /*
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
            registerType: "autoUpdate",
            devOptions: {
                enabled: true
            }
        }),
        Inspect(),
        Inspector(),
        VueDevTools()
    ],
    optimizeDeps: {
        disabled: false,
        include: ["jquery"],
        /*esbuildOptions: {
            plugins: [globalExternals({ jquery: { type: "cjs", varName: "jQuery" } })]
        }*/
    },
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                //manualChunks: (path) => path.split('/').reverse()[path.split('/').reverse().indexOf('node_modules') - 1] // just a hack to get the next path segment of the last node_modules in path Worked like a charm (works better as an function as it seems)
                /*manualChunks: (path) => {
                    //console.log(path);
                    if (path.includes("datatables.net")) {
                        return "vendor-datatables";
                    }
                    if (path.includes("jquery")) {
                        return "vendor-jquery";
                    }
                    if (path.includes("vue")) {
                        return "vendor-vue";
                    }
                    if (path.includes("node_modules")) {
                        return "vendor";
                    }
                    return "index";
                },*/
                manualChunks: {
                    datatables: ['datatables.net-bs', 'datatables.net-bs4', 'datatables.net-dt', 'datatables.net-responsive-bs', 'datatables.net-responsive-bs4', 'datatables.net-select', 'datatables.net-select-bs', 'datatables.net-select-bs4', 'datatables.net-vue3', ],
                    bootstrap: ['admin-lte', 'bootstrap', 'select2', 'sweetalert2', '@sweetalert2/theme-bootstrap-4', 'tempusdominus-bootstrap-4', 'jquery', 'jquery-simple-pass-meter', 'jquery-sortable', 'jquery-ui', 'vue', 'vue-query', 'vue-recaptcha', 'vue-router',  '@vueuse/core', 'pinia', 'vee-validate'],
                    chartjs: ["chart.js"]
                    //vite: ['vite', '@vitejs/plugin-legacy', '@vitejs/plugin-vue', 'vite-plugin-checker', 'vite-plugin-chunk-split','vite-plugin-inspect', 'vite-plugin-pwa', 'vite-plugin-vue-devtools', 'vite-plugin-vue-inspector' ],
                    //...renderChunks(dependencies)
                }
            }
        },
        commonjsOptions: {
            include: []
        }
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
});
