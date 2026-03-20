import { describe, expect, it, vi, beforeEach } from 'vitest';
import i18n, { resolvePreferredLocale, resolveAppLocale, setAppLocale, defaultLocale, getBrowserPreferredLocales, loadLocaleMessages, loadCommonMessages } from '@/i18n';

describe('i18n locale resolution', () => {
    beforeEach(() => {
        setAppLocale(defaultLocale);
    });

    it('matches full locale and then language fallback', () => {
        expect(resolvePreferredLocale(['fi-FI'])).toBe('fi');
        expect(resolvePreferredLocale(['en-US'])).toBe('en');
    });

    it('falls back to default locale when browser locales are unsupported', () => {
        expect(resolvePreferredLocale(['xx-YY', 'zz'])).toBe(defaultLocale);
    });

    it('prefers account locale override when not auto', () => {
        expect(resolveAppLocale('fi-FI')).toBe('fi');
        expect(resolveAppLocale(' fi ')).toBe('fi');
    });

    it('falls back to default locale when account locale is unsupported', () => {
        expect(resolveAppLocale('xx-YY')).toBe(defaultLocale);
    });

    it('uses browser locale order when account locale is auto/blank', () => {
        const languageGetter = vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');
        const languagesGetter = vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['xx-YY', 'fi-FI', 'en-US']);

        expect(resolveAppLocale('auto')).toBe('fi');
        expect(resolveAppLocale('')).toBe('fi');

        languageGetter.mockRestore();
        languagesGetter.mockRestore();
    });

    it('setAppLocale sets active i18n locale with fallback to default', () => {
        expect(setAppLocale('fi-FI')).toBe('fi');
        expect(i18n.global.locale.value).toBe('fi');
        expect(setAppLocale('unsupported-locale')).toBe(defaultLocale);
        expect(i18n.global.locale.value).toBe(defaultLocale);
    });
});

describe('getBrowserPreferredLocales', () => {
    it('returns default locale when navigator is undefined', () => {
        const originalNavigator = globalThis.navigator;
        Object.defineProperty(globalThis, 'navigator', { value: undefined, configurable: true });
        try {
            expect(getBrowserPreferredLocales()).toEqual([defaultLocale]);
        } finally {
            Object.defineProperty(globalThis, 'navigator', { value: originalNavigator, configurable: true });
        }
    });
});

describe('loadLocaleMessages', () => {
    it('logs error when loading a non-existent namespace', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        await loadLocaleMessages('en', 'nonexistent_namespace_xyz');
        expect(consoleSpy).toHaveBeenCalled();
        const allArgs = consoleSpy.mock.calls[0].join(' ');
        expect(allArgs).toContain('[i18n] Failed to load namespace');
        consoleSpy.mockRestore();
    });
});

describe('loadCommonMessages', () => {
    it('loads common messages for current and default locale', async () => {
        // This exercises lines 138-140 by calling loadCommonMessages
        // which calls loadLocaleMessages for both the current locale and the default locale
        await expect(loadCommonMessages()).resolves.toBeUndefined();
    });
});

describe('getBrowserPreferredLocales - navigator.languages empty', () => {
    it('falls back to navigator.language when navigator.languages is empty', () => {
        const languagesGetter = vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue([]);
        const languageGetter = vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('de');
        const result = getBrowserPreferredLocales();
        expect(result).toEqual(['de']);
        languagesGetter.mockRestore();
        languageGetter.mockRestore();
    });
});

describe('loadCommonMessages with non-default locale', () => {
    it('loads common messages for a non-default active locale and the default locale', async () => {
        // Set a non-default locale so loadCommonMessages calls loadLocaleMessages
        // for both the non-default locale and the default locale
        setAppLocale('fi');
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        await loadCommonMessages();
        consoleSpy.mockRestore();
        // Reset locale
        setAppLocale(defaultLocale);
    });
});
