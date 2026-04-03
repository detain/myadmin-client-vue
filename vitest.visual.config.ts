import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath, URL } from 'node:url';

/**
 * Standalone config for visual regression tests.
 * Does NOT extend vite.config.ts test section to avoid inheriting
 * setupFiles that import msw/node (incompatible with browser mode).
 */
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
            'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js',
        },
    },
    optimizeDeps: {
        include: ['jquery', 'select2', 'admin-lte/dist/js/adminlte.js', 'bootstrap/dist/js/bootstrap.bundle.js', 'popper.js'],
        exclude: ['playwright', 'playwright-core', 'chromium-bidi'],
    },
    test: {
        globals: true,
        include: ['test/visual/**/*.visual.ts'],
        exclude: ['**/.claire/**', '**/.claude/**', '**/node_modules/**'],
        setupFiles: ['./test/visual/setup.ts'],
        fileParallelism: false,
        browser: {
            enabled: true,
            provider: playwright(),
            trace: 'on',
            instances: [{ browser: 'chromium' }],
            viewport: { width: 1280, height: 800 },
            expect: {
                toMatchScreenshot: {
                    comparatorName: 'pixelmatch',
                    comparatorOptions: {
                        threshold: 0.2,
                        allowedMismatchedPixelRatio: 0.02,
                    },
                },
            },
        },
    },
});
