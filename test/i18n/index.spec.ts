import { describe, expect, it, vi, beforeEach } from 'vitest';
import i18n, { resolvePreferredLocale, resolveAppLocale, setAppLocale, defaultLocale } from '@/i18n';

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
