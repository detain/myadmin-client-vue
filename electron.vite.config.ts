import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import dts from 'vite-plugin-dts';
import Inspect from 'vite-plugin-inspect';
import Inspector from 'vite-plugin-vue-inspector';
import TurboConsole from 'unplugin-turbo-console/vite';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
    main: {
        build: {
            rolldownOptions: {
                external: ['electron'],
                input: {
                    index: resolve(__dirname, 'electron/main/index.ts'),
                },
            },
        },
    },
    preload: {
        build: {
            rolldownOptions: {
                external: ['electron'],
                input: {
                    index: resolve(__dirname, 'electron/preload/index.ts'),
                },
            },
        },
    },
    renderer: {
        root: '.',
        plugins: [
            vue({
                script: {
                    defineModel: true,
                },
            }),
            ...(!isProd ? [dts({ insertTypesEntry: true })] : []),
            // Dev-only plugins: inspector, inspect, turbo-console
            ...(!isProd ? [Inspect(), Inspector(), TurboConsole()] : []),
        ],
        optimizeDeps: {
            include: ['jquery', 'select2'],
            exclude: ['playwright', 'playwright-core', 'chromium-bidi'],
        },
        build: {
            sourcemap: false,
            modulePreload: {
                polyfill: true,
            },
            rolldownOptions: {
                input: {
                    index: resolve(__dirname, 'index.html'),
                },
                output: {
                    format: 'es',
                    globals: {
                        jquery: '$',
                    },
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router' || id.includes('vue-i18n'))) {
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
                '@renderer': resolve('src'),
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
    },
});
