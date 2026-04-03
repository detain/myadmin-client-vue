import { defineConfig, mergeConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
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
    })
);
