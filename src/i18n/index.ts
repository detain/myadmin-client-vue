import { createI18n } from 'vue-i18n';
import type { I18nOptions } from 'vue-i18n';

const DEFAULT_LOCALE = 'en';
const localeCommonMessageLoaders = import.meta.glob('../locales/*/common.json');
const supportedLocales = new Set(
    Object.keys(localeCommonMessageLoaders)
        .map((path) => path.match(/\.\.\/locales\/([^/]+)\/common\.json$/)?.[1])
        .filter((locale): locale is string => Boolean(locale))
);

function normalizeLocale(locale: string): string {
    return locale.trim().toLowerCase().replace(/_/g, '-');
}

function findBestSupportedLocale(locale: string): string | null {
    const raw = locale.trim().toLowerCase();
    const normalized = normalizeLocale(locale);
    const candidates = [raw, normalized, normalized.split('-')[0]];

    for (const candidate of candidates) {
        if (supportedLocales.has(candidate)) {
            return candidate;
        }
    }

    return null;
}

export function resolvePreferredLocale(preferredLocales: string[]): string {
    for (const locale of preferredLocales) {
        const matchedLocale = findBestSupportedLocale(locale);
        if (matchedLocale) {
            return matchedLocale;
        }
    }

    return DEFAULT_LOCALE;
}

export function getBrowserPreferredLocales(): string[] {
    if (typeof navigator === 'undefined') {
        return [DEFAULT_LOCALE];
    }

    const browserLocales = navigator.languages?.length ? navigator.languages : [navigator.language];
    return browserLocales.filter((locale): locale is string => Boolean(locale));
}

export function resolveAppLocale(accountLocale?: string | null): string {
    const normalizedAccountLocale = accountLocale?.trim();

    if (normalizedAccountLocale && normalizedAccountLocale.toLowerCase() !== 'auto') {
        return findBestSupportedLocale(normalizedAccountLocale) ?? DEFAULT_LOCALE;
    }

    return resolvePreferredLocale(getBrowserPreferredLocales());
}

export function setAppLocale(locale: string): string {
    const resolvedLocale = findBestSupportedLocale(locale) ?? DEFAULT_LOCALE;
    i18n.global.locale.value = resolvedLocale;
    return resolvedLocale;
}

const datetimeFormats: I18nOptions['datetimeFormats'] = {
    en: {
        short: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        },
        long: {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        },
        dateOnly: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
        timeOnly: {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        },
    },
};

const numberFormats: I18nOptions['numberFormats'] = {
    en: {
        currency: {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        },
        decimal: {
            style: 'decimal',
            minimumFractionDigits: 2,
        },
        percent: {
            style: 'percent',
            minimumFractionDigits: 0,
        },
    },
};

const i18n = createI18n({
    legacy: false,
    locale: DEFAULT_LOCALE,
    fallbackLocale: DEFAULT_LOCALE,
    globalInjection: false,
    missingWarn: import.meta.env.DEV,
    fallbackWarn: import.meta.env.DEV,
    datetimeFormats,
    numberFormats,
});

const loadedNamespaces = new Set<string>();

export async function loadLocaleMessages(locale: string, namespace: string): Promise<void> {
    const key = `${locale}:${namespace}`;
    if (loadedNamespaces.has(key)) {
        return;
    }

    try {
        const messages = await import(`../locales/${locale}/${namespace}.json`);
        i18n.global.mergeLocaleMessage(locale, { [namespace]: messages.default });
        loadedNamespaces.add(key);
    } catch (error) {
        console.error(`[i18n] Failed to load namespace "${namespace}" for locale "${locale}"`, error);
    }
}

export async function loadCommonMessages(): Promise<void> {
    const locale = i18n.global.locale.value;
    await Promise.all([loadLocaleMessages(locale, 'common'), loadLocaleMessages(DEFAULT_LOCALE, 'common')]);
}

export const defaultLocale = DEFAULT_LOCALE;

export default i18n;
