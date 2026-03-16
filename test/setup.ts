// setup.ts
import { vi, beforeAll, afterAll, afterEach } from 'vitest';
import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { server } from '../src/mocks/setup';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    missingWarn: false,
    fallbackWarn: false,
});

config.global.plugins.push(i18n);

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that are used in individual tests
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Global jQuery mock (runs before every test file)
vi.mock('jquery', () => {
    const mockJquery = vi.fn(() => ({
        on: vi.fn(),
        off: vi.fn(),
        ready: vi.fn(),
        click: vi.fn(),
        keyup: vi.fn(),
        hide: vi.fn(),
        show: vi.fn(),
        toggle: vi.fn(),
        find: vi.fn(),
        css: vi.fn(),
        addClass: vi.fn(),
        removeClass: vi.fn(),
        delay: vi.fn().mockReturnThis(),
        queue: vi.fn().mockImplementation((fn) => fn()),
        outerHeight: vi.fn(() => 100),
        innerHeight: vi.fn(() => 80),
    }));

    // emulate $.ajax usage
    (mockJquery as any).ajax = vi.fn();

    return {
        default: mockJquery,
    };
});
