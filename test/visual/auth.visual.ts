// test/visual/auth.visual.ts — Visual regression tests for authentication pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue/client';
import i18n, { loadCommonMessages, loadLocaleMessages } from '@/i18n';
import { router } from '@/router';
import AppComponent from '@/App.vue';
import '@/plugins/jquery';

describe('Auth Pages', () => {
    let cleanup: () => void;

    beforeAll(async () => {
        const pinia = createPinia();
        const head = createHead();
        const app = createApp(AppComponent);
        app.use(pinia);
        app.use(router);
        app.use(head);
        app.use(i18n);

        await loadCommonMessages();
        await loadLocaleMessages('en', 'login');
        await loadLocaleMessages('en', 'validation');

        const el = document.createElement('div');
        el.id = 'app';
        document.body.appendChild(el);
        app.mount(el);
        await router.isReady();

        cleanup = () => {
            app.unmount();
            el.remove();
        };
    });

    afterAll(() => cleanup());

    test('login page', async ({ annotate }) => {
        await annotate('Visual Regression: Login page - captures unauthenticated login form layout');
        await router.push('/login');
        await router.isReady();
        await new Promise((r) => setTimeout(r, 500));
        await expect(page.elementLocator(document.body)).toMatchScreenshot('auth-login');
    });

    test('registration page', async ({ annotate }) => {
        await annotate('Visual Regression: Registration page - captures new user registration form layout');
        await router.push('/register');
        await router.isReady();
        await new Promise((r) => setTimeout(r, 500));
        await expect(page.elementLocator(document.body)).toMatchScreenshot('auth-register');
    });
});
