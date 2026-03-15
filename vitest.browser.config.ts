import { defineConfig, mergeConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import viteConfig from './vitest.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            browser: {
                enabled: true,
                provider: playwright(),
                trace: 'on',
                instances: [{ browser: 'chromium' }],
            },
        },
    })
);
