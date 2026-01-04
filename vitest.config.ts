import { defineConfig } from 'vitest/config'
//import { defineConfig } from 'vite';
import { playwright } from '@vitest/browser-playwright'
import Vue from '@vitejs/plugin-vue';
//import minimatch from 'minimatch'
import { server } from './src/mocks/setup';

export default defineConfig({
    plugins: [Vue()],
    optimizeDeps: {
      exclude: [
        'playwright',
        'playwright-core',
        'chromium-bidi'
      ]
    },
    test: {
        globals: true,
        environment: 'jsdom',
        browser: {
            enabled: true,
            provider: playwright(),
            name: 'chromium', // or 'firefox', 'webkit'
            headless: true, // set to false to watch tests in a UI
            setupFiles: ['./test/.setup.ts'],
            // Optional: configure specific options, e.g., launch options
            launchOptions: {
              headless: true, // Run headless in CI/locally
            },
            // https://vitest.dev/config/browser/playwright
            instances: [
                { browser: 'chromium' },
            ],
        },
    },
});
