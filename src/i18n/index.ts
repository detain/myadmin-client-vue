import { createI18n } from 'vue-i18n';
import type { I18nOptions } from 'vue-i18n';

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
    locale: 'en',
    fallbackLocale: 'en',
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
    await loadLocaleMessages('en', 'common');
}

export default i18n;
