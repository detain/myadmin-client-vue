// setup.ts
import { vi, beforeAll, afterAll, afterEach } from 'vitest';
import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { server } from '../src/mocks/setup';

// Import all locale messages so t() returns English text in tests
import account from '../src/locales/en/account.json';
import affiliate from '../src/locales/en/affiliate.json';
import backups from '../src/locales/en/backups.json';
import billing from '../src/locales/en/billing.json';
import common from '../src/locales/en/common.json';
import dashboard from '../src/locales/en/dashboard.json';
import dns from '../src/locales/en/dns.json';
import domains from '../src/locales/en/domains.json';
import floating_ips from '../src/locales/en/floating_ips.json';
import licenses from '../src/locales/en/licenses.json';
import login from '../src/locales/en/login.json';
import mail from '../src/locales/en/mail.json';
import quickservers from '../src/locales/en/quickservers.json';
import scrub_ips from '../src/locales/en/scrub_ips.json';
import servers from '../src/locales/en/servers.json';
import ssl from '../src/locales/en/ssl.json';
import tickets from '../src/locales/en/tickets.json';
import users from '../src/locales/en/users.json';
import validation from '../src/locales/en/validation.json';
import vps from '../src/locales/en/vps.json';
import webhosting from '../src/locales/en/webhosting.json';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    missingWarn: false,
    fallbackWarn: false,
    datetimeFormats: {
        en: {
            short: { year: 'numeric', month: '2-digit', day: '2-digit' },
            long: { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' },
            dateOnly: { year: 'numeric', month: 'long', day: 'numeric' },
            timeOnly: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
        },
    },
    numberFormats: {
        en: {
            currency: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
            decimal: { style: 'decimal', minimumFractionDigits: 2 },
            percent: { style: 'percent', minimumFractionDigits: 0 },
        },
    },
    messages: {
        en: {
            ...common, ...dashboard, ...account, ...affiliate, ...backups,
            ...billing, ...dns, ...domains, ...floating_ips, ...licenses,
            ...login, ...mail, ...quickservers, ...scrub_ips, ...servers,
            ...ssl, ...tickets, ...users, ...validation, ...vps, ...webhosting,
        },
    },
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
