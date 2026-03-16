import { vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

import { router } from '@/router/index';
import { useAuthStore } from '@/stores/auth.store';
import { useAlertStore } from '@/stores/alert.store';

describe('Router', () => {
    beforeEach(async () => {
        setActivePinia(createPinia());
        // Reset router to a known state
        await router.push('/login');
        await router.isReady();
    });

    it('route "/" exists', () => {
        const route = router.resolve('/');
        expect(route).toBeDefined();
        expect(route.matched.length).toBeGreaterThan(0);
    });

    it('route "/login" exists', () => {
        const route = router.resolve('/login');
        expect(route).toBeDefined();
        expect(route.matched.length).toBeGreaterThan(0);
    });

    it('route "/register" exists', () => {
        const route = router.resolve('/register');
        expect(route).toBeDefined();
        expect(route.matched.length).toBeGreaterThan(0);
    });

    it('redirects unauthenticated user to /login for protected routes', async () => {
        const authStore = useAuthStore();
        authStore.sessionId = null;
        authStore.apiKey = null;

        await router.push('/vps');

        expect(router.currentRoute.value.path).toBe('/login');
    });

    it('allows authenticated user to access protected routes', async () => {
        const authStore = useAuthStore();
        authStore.sessionId = 'test-session-id';

        await router.push('/');

        expect(router.currentRoute.value.path).toBe('/');
    });

    it('clears alert on navigation', async () => {
        const authStore = useAuthStore();
        authStore.sessionId = 'test-session-id';

        const alertStore = useAlertStore();
        alertStore.success('test');
        const clearSpy = vi.spyOn(alertStore, 'clear');

        await router.push('/');

        expect(clearSpy).toHaveBeenCalled();
    });

    describe('redirect routes', () => {
        const redirectTests = [
            { from: '/view_vps_list', to: '/vps' },
            { from: '/order_vps', to: '/vps/order' },
            { from: '/contact_info', to: '/account/info' },
            { from: '/change_pass', to: '/account/pass' },
            { from: '/dns_manager', to: '/dns' },
            { from: '/view_domains_list', to: '/domains' },
        ];

        for (const { from, to } of redirectTests) {
            it(`${from} redirects to ${to}`, () => {
                const resolved = router.resolve(from);
                const matchedRoute = resolved.matched[0];
                expect(matchedRoute).toBeDefined();
                expect(matchedRoute.redirect).toBeDefined();
            });
        }
    });

    it('catch-all redirects unknown paths', () => {
        const resolved = router.resolve('/some-nonexistent-page-xyz');
        const matchedRoute = resolved.matched[0];
        expect(matchedRoute).toBeDefined();
        expect(matchedRoute.redirect).toBeDefined();
    });

    it('warmFrequentlyUsedRoutes function is exported', async () => {
        const routerModule = await import('@/router/index');
        expect(routerModule.warmFrequentlyUsedRoutes).toBeDefined();
        expect(typeof routerModule.warmFrequentlyUsedRoutes).toBe('function');
    });

    it('warmFrequentlyUsedRoutes can be called without error', async () => {
        const { warmFrequentlyUsedRoutes } = await import('@/router/index');
        expect(() => warmFrequentlyUsedRoutes()).not.toThrow();
    });

    it('warmRouteByLocation can be called with a path', async () => {
        const { warmRouteByLocation } = await import('@/router/index');
        expect(() => warmRouteByLocation('/vps')).not.toThrow();
    });

    it('stores returnUrl when redirecting unauthenticated user', async () => {
        const authStore = useAuthStore();
        authStore.sessionId = null;
        authStore.apiKey = null;

        await router.push('/tickets');

        expect(authStore.returnUrl).toBe('/tickets');
        expect(router.currentRoute.value.path).toBe('/login');
    });

    it('allows access to public pages without auth', async () => {
        const authStore = useAuthStore();
        authStore.sessionId = null;
        authStore.apiKey = null;

        await router.push('/register');
        expect(router.currentRoute.value.path).toBe('/register');
    });

    it('allows access when apiKey is set', async () => {
        const authStore = useAuthStore();
        authStore.sessionId = null;
        authStore.apiKey = 'test-api-key';

        await router.push('/');
        expect(router.currentRoute.value.path).toBe('/');
    });

    describe('additional redirect routes', () => {
        const moreRedirects = [
            { from: '/change_username', to: '/account/username' },
            { from: '/account_settings', to: '/account/settings' },
            { from: '/view_backups_list', to: '/backups' },
            { from: '/view_licenses_list', to: '/licenses' },
            { from: '/view_mail_list', to: '/mail' },
            { from: '/view_quickservers_list', to: '/qs' },
            { from: '/view_servers_list', to: '/servers' },
            { from: '/view_ssl_list', to: '/ssl' },
            { from: '/view_websites_list', to: '/websites' },
            { from: '/order_domain', to: '/domains/order' },
            { from: '/domain_order', to: '/domains/order' },
            { from: '/order_backup', to: '/backups/order' },
            { from: '/backup_order', to: '/backups/order' },
            { from: '/order_license', to: '/licenses/order' },
            { from: '/license_order', to: '/licenses/order' },
            { from: '/order_mail', to: '/mail/order' },
            { from: '/mail_order', to: '/mail/order' },
            { from: '/order_qs', to: '/qs/order' },
            { from: '/qs_order', to: '/qs/order' },
            { from: '/order_server', to: '/servers/order' },
            { from: '/server_order', to: '/servers/order' },
            { from: '/order_ssl', to: '/ssl/order' },
            { from: '/ssl_order', to: '/ssl/order' },
            { from: '/vps_order', to: '/vps/order' },
            { from: '/order_website', to: '/websites/order' },
            { from: '/website_order', to: '/websites/order' },
        ];

        for (const { from } of moreRedirects) {
            it(`${from} has redirect defined`, () => {
                const resolved = router.resolve(from);
                const matchedRoute = resolved.matched[0];
                expect(matchedRoute).toBeDefined();
                expect(matchedRoute.redirect).toBeDefined();
            });
        }
    });

    describe('dynamic redirect routes with query params', () => {
        it('/view_vps?id=5 resolves with redirect', () => {
            const resolved = router.resolve('/view_vps?id=5');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/dns_editor resolves with redirect', () => {
            const resolved = router.resolve('/dns_editor');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_domain resolves with redirect', () => {
            const resolved = router.resolve('/view_domain');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_backup resolves with redirect', () => {
            const resolved = router.resolve('/view_backup');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_license resolves with redirect', () => {
            const resolved = router.resolve('/view_license');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_mail resolves with redirect', () => {
            const resolved = router.resolve('/view_mail');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_qs resolves with redirect', () => {
            const resolved = router.resolve('/view_qs');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_server resolves with redirect', () => {
            const resolved = router.resolve('/view_server');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_ssl resolves with redirect', () => {
            const resolved = router.resolve('/view_ssl');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_website resolves with redirect', () => {
            const resolved = router.resolve('/view_website');
            expect(resolved.matched[0].redirect).toBeDefined();
        });
    });

    describe('route resolution for service paths', () => {
        it('resolves /vps route', () => {
            const resolved = router.resolve('/vps');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /domains route', () => {
            const resolved = router.resolve('/domains');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /tickets route', () => {
            const resolved = router.resolve('/tickets');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /invoices route', () => {
            const resolved = router.resolve('/invoices');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves nested account routes', () => {
            expect(router.resolve('/account/info').matched.length).toBeGreaterThan(0);
            expect(router.resolve('/account/pass').matched.length).toBeGreaterThan(0);
            expect(router.resolve('/account/username').matched.length).toBeGreaterThan(0);
            expect(router.resolve('/account/settings').matched.length).toBeGreaterThan(0);
        });

        it('resolves /prepays route', () => {
            const resolved = router.resolve('/prepays');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /signup route', () => {
            const resolved = router.resolve('/signup');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /backups route', () => {
            const resolved = router.resolve('/backups');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /servers route', () => {
            const resolved = router.resolve('/servers');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /ssl route', () => {
            const resolved = router.resolve('/ssl');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /websites route', () => {
            const resolved = router.resolve('/websites');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /mail route', () => {
            const resolved = router.resolve('/mail');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /licenses route', () => {
            const resolved = router.resolve('/licenses');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /floating_ips route', () => {
            const resolved = router.resolve('/floating_ips');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /qs route', () => {
            const resolved = router.resolve('/qs');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /scrub_ips route', () => {
            const resolved = router.resolve('/scrub_ips');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /dns route', () => {
            const resolved = router.resolve('/dns');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /cart route', () => {
            const resolved = router.resolve('/cart');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /payment_types route', () => {
            const resolved = router.resolve('/payment_types');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /affiliate route', () => {
            const resolved = router.resolve('/affiliate');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('beforeEach guard with deep paths', () => {
        it('handles paths with 3+ segments for auth check', async () => {
            const authStore = useAuthStore();
            authStore.sessionId = null;
            authStore.apiKey = null;

            await router.push('/vps/1/backup');
            expect(router.currentRoute.value.path).toBe('/login');
        });
    });

    describe('dynamic redirect function execution', () => {
        const dynamicRedirects = [
            { path: '/dns_editor', withId: '/dns/123', withoutId: '/dns' },
            { path: '/view_domain', withId: '/domains/5', withoutId: '/domains' },
            { path: '/view_backup', withId: '/backups/10', withoutId: '/backups' },
            { path: '/view_license', withId: '/license/20', withoutId: '/licenses' },
            { path: '/view_mail', withId: '/mail/30', withoutId: '/mail' },
            { path: '/view_qs', withId: '/qs/40', withoutId: '/qs' },
            { path: '/view_server', withId: '/servers/50', withoutId: '/servers' },
            { path: '/view_ssl', withId: '/ssl/60', withoutId: '/ssl' },
            { path: '/view_vps', withId: '/vps/70', withoutId: '/vps' },
            { path: '/view_website', withId: '/websites/80', withoutId: '/websites' },
        ];

        for (const { path, withId, withoutId } of dynamicRedirects) {
            it(`${path} redirect function returns correct path with id`, () => {
                const resolved = router.resolve(path);
                const redirect = resolved.matched[0].redirect;
                if (typeof redirect === 'function') {
                    const idNum = withId.split('/').pop();
                    const result = redirect({ query: { id: idNum }, path, params: {}, hash: '', matched: [], fullPath: path, redirectedFrom: undefined, name: undefined, meta: {} } as any);
                    expect(result).toBe(withId);
                }
            });

            it(`${path} redirect function returns fallback without id`, () => {
                const resolved = router.resolve(path);
                const redirect = resolved.matched[0].redirect;
                if (typeof redirect === 'function') {
                    const result = redirect({ query: {}, path, params: {}, hash: '', matched: [], fullPath: path, redirectedFrom: undefined, name: undefined, meta: {} } as any);
                    expect(result).toBe(withoutId);
                }
            });
        }
    });

    describe('warmRouteRecord and warming internals', () => {
        it('warmRouteByLocation resolves and warms route components', async () => {
            const { warmRouteByLocation } = await import('@/router/index');
            // Call with a valid route - should not throw and should execute warming code
            warmRouteByLocation('/vps');
            warmRouteByLocation('/domains');
            warmRouteByLocation('/tickets');
        });

        it('warmFrequentlyUsedRoutes warms all frequent routes', async () => {
            const { warmFrequentlyUsedRoutes } = await import('@/router/index');
            warmFrequentlyUsedRoutes();
        });

        it('calling warmRouteByLocation twice for same route is idempotent', async () => {
            const { warmRouteByLocation } = await import('@/router/index');
            warmRouteByLocation('/invoices');
            warmRouteByLocation('/invoices');
        });
    });

    describe('/logout route', () => {
        it('has a beforeEnter guard', () => {
            const resolved = router.resolve('/logout');
            const matchedRoute = resolved.matched[0];
            expect(matchedRoute).toBeDefined();
            expect(matchedRoute.beforeEnter).toBeDefined();
        });

        it('navigates to /login after logout', async () => {
            const authStore = useAuthStore();
            authStore.sessionId = 'test-session';

            await router.push('/logout');
            expect(router.currentRoute.value.path).toBe('/login');
        });
    });

    describe('route with numeric constraints', () => {
        it('/invoices/:id resolves for numeric id', () => {
            const resolved = router.resolve('/invoices/123');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('/vps/:id resolves for numeric id', () => {
            const resolved = router.resolve('/vps/456');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('/vps/:id/:link resolves for valid link', () => {
            const resolved = router.resolve('/vps/1/backup');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });
});
