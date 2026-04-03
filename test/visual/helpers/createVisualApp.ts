// test/visual/helpers/createVisualApp.ts — Mounts full app for visual regression tests
import { createApp, type App } from 'vue';
import { createPinia, type Pinia } from 'pinia';
import { createHead } from '@unhead/vue/client';
import i18n, { loadCommonMessages, loadLocaleMessages } from '@/i18n';
import { router } from '@/router';
import AppComponent from '@/App.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useSiteStore } from '@/stores/site.store';
import type { Router } from 'vue-router';

export interface VisualAppContext {
    app: App;
    router: Router;
    pinia: Pinia;
    cleanup: () => void;
}

/** Load all i18n namespaces the app uses */
async function loadAllNamespaces(): Promise<void> {
    const namespaces = [
        'common', 'dashboard', 'account', 'affiliate', 'backups',
        'billing', 'dns', 'domains', 'floating_ips', 'licenses',
        'login', 'mail', 'quickservers', 'scrub_ips', 'servers',
        'ssl', 'tickets', 'users', 'validation', 'vps', 'webhosting',
    ];
    await Promise.all(namespaces.map((ns) => loadLocaleMessages('en', ns)));
}

/** Seed auth store with a test session so authenticated pages render */
function seedAuthStore(pinia: Pinia): void {
    const authStore = useAuthStore(pinia);
    authStore.sessionId = 'visual-test-session';
    authStore.user = {
        sessionId: 'visual-test-session',
        account_id: 1,
        account_lid: 'testuser',
        name: 'Test User',
        gravatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=80',
        ima: 'client',
    };
    authStore.counts = { vps: 3, websites: 2, servers: 1 };
}

/** Seed site store modules so service pages resolve titles and metadata */
function seedSiteStore(pinia: Pinia): void {
    const siteStore = useSiteStore(pinia);
    siteStore.routeLoading = false;
}

/**
 * Creates and mounts the full Vue application identical to src/main.ts.
 * Returns context for navigation and cleanup.
 */
export async function createVisualApp(): Promise<VisualAppContext> {
    const pinia = createPinia();
    const head = createHead();

    const app = createApp(AppComponent);
    app.use(pinia);
    app.use(router);
    app.use(head);
    app.use(i18n);

    // Load i18n messages before mount
    await loadCommonMessages();
    await loadAllNamespaces();

    // Seed stores
    seedAuthStore(pinia);
    seedSiteStore(pinia);

    // Create mount point
    const el = document.createElement('div');
    el.id = 'app';
    document.body.appendChild(el);

    // Add AdminLTE body classes the app expects
    document.body.classList.add('hold-transition', 'sidebar-mini', 'layout-fixed');

    app.mount(el);
    await router.isReady();

    return {
        app,
        router,
        pinia,
        cleanup() {
            app.unmount();
            el.remove();
            document.body.classList.remove('hold-transition', 'sidebar-mini', 'layout-fixed', 'sidebar-collapse');
        },
    };
}
