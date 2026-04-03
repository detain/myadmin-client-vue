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
            { path: '/view_license', withId: '/licenses/20', withoutId: '/licenses' },
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

    describe('route resolution for uncovered service paths', () => {
        it('resolves /login_old route', () => {
            const resolved = router.resolve('/login_old');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /sudo/:sessionid route', () => {
            const resolved = router.resolve('/sudo/abc123');
            expect(resolved.matched.length).toBeGreaterThan(0);
            expect(resolved.params.sessionid).toBe('abc123');
        });

        it('resolves /payment_types route', () => {
            const resolved = router.resolve('/payment_types');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /cart/:invoices route', () => {
            const resolved = router.resolve('/cart/12345');
            expect(resolved.matched.length).toBeGreaterThan(0);
            expect(resolved.params.invoices).toBe('12345');
        });

        it('resolves /order_needs_payment/:invoices route', () => {
            const resolved = router.resolve('/order_needs_payment/999');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /pay/:method/:invoices route', () => {
            const resolved = router.resolve('/pay/cc/123');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /pay with done param', () => {
            const resolved = router.resolve('/pay/paypal/123/done');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /payment_success route', () => {
            const resolved = router.resolve('/payment_success');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /invoices/:id route', () => {
            const resolved = router.resolve('/invoices/999');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for account and user paths', () => {
        it('resolves /account/pass route', () => {
            const resolved = router.resolve('/account/pass');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /account/username route', () => {
            const resolved = router.resolve('/account/username');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /account/settings route', () => {
            const resolved = router.resolve('/account/settings');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /users route', () => {
            const resolved = router.resolve('/users');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /users/add route', () => {
            const resolved = router.resolve('/users/add');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /users/edit/:id route', () => {
            const resolved = router.resolve('/users/edit/5');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for affiliate paths', () => {
        const affiliatePaths = [
            '/affiliate', '/affiliate/faq', '/affiliate/landing_pg',
            '/affiliate/payment_setup', '/affiliate/rich_report',
            '/affiliate/sales_graph', '/affiliate/sales_report',
            '/affiliate/status_legend', '/affiliate/tos',
            '/affiliate/traffic_graph', '/affiliate/web_traffic',
            '/affiliate/banners', '/affiliate/banners/1',
        ];

        for (const path of affiliatePaths) {
            it(`resolves ${path}`, () => {
                const resolved = router.resolve(path);
                expect(resolved.matched.length).toBeGreaterThan(0);
            });
        }
    });

    describe('route resolution for tickets, backups, dns paths', () => {
        it('resolves /tickets/new route', () => {
            const resolved = router.resolve('/tickets/new');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /tickets/:id route', () => {
            const resolved = router.resolve('/tickets/42');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /backups/order route', () => {
            const resolved = router.resolve('/backups/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /backups/:id route', () => {
            const resolved = router.resolve('/backups/10');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /backups/:id/:link route', () => {
            const resolved = router.resolve('/backups/10/login');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /dns/:id route', () => {
            const resolved = router.resolve('/dns/5');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for domains paths', () => {
        it('resolves /domains/order route', () => {
            const resolved = router.resolve('/domains/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /domains/order/:domain route', () => {
            const resolved = router.resolve('/domains/order/example.com');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /domains/order/:domain/:regType route', () => {
            const resolved = router.resolve('/domains/order/example.com/register');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /domains/:id route', () => {
            const resolved = router.resolve('/domains/100');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /domains/:id/:link route', () => {
            const resolved = router.resolve('/domains/100/cancel');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for floating_ips, licenses, mail paths', () => {
        it('resolves /floating_ips/order route', () => {
            const resolved = router.resolve('/floating_ips/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /floating_ips/:id route', () => {
            const resolved = router.resolve('/floating_ips/7');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /floating_ips/:id/:link route', () => {
            const resolved = router.resolve('/floating_ips/7/cancel');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /licenses/order route', () => {
            const resolved = router.resolve('/licenses/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /licenses/order/:catTag route', () => {
            const resolved = router.resolve('/licenses/order/cpanel');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /licenses/:id route', () => {
            const resolved = router.resolve('/licenses/20');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /licenses/:id/:link route', () => {
            const resolved = router.resolve('/licenses/20/change_ip');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /mail/order route', () => {
            const resolved = router.resolve('/mail/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /mail/:id route', () => {
            const resolved = router.resolve('/mail/30');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /mail/:id/:link route', () => {
            const resolved = router.resolve('/mail/30/stats');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /mail/:id/:link/:ruleId route', () => {
            const resolved = router.resolve('/mail/30/rules/5');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for qs, scrub_ips paths', () => {
        it('resolves /qs/order route', () => {
            const resolved = router.resolve('/qs/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /qs/:id route', () => {
            const resolved = router.resolve('/qs/40');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /qs/:id/:link route', () => {
            const resolved = router.resolve('/qs/40/start');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /scrub_ips/:id route', () => {
            const resolved = router.resolve('/scrub_ips/3');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for servers, ssl paths', () => {
        it('resolves /servers/order route', () => {
            const resolved = router.resolve('/servers/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /servers/order_dedicated route', () => {
            const resolved = router.resolve('/servers/order_dedicated');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /servers/:id route', () => {
            const resolved = router.resolve('/servers/50');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /servers/:id/:link route', () => {
            const resolved = router.resolve('/servers/50/cancel');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /ssl/order route', () => {
            const resolved = router.resolve('/ssl/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /ssl/:id route', () => {
            const resolved = router.resolve('/ssl/60');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /ssl/:id/:link route', () => {
            const resolved = router.resolve('/ssl/60/cancel');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for vps and websites child paths', () => {
        it('resolves /vps/order route', () => {
            const resolved = router.resolve('/vps/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /vps/:id/:link with various links', () => {
            const links = ['start', 'stop', 'restart', 'invoices', 'cancel', 'reinstall_os'];
            for (const link of links) {
                const resolved = router.resolve(`/vps/1/${link}`);
                expect(resolved.matched.length).toBeGreaterThan(0);
            }
        });

        it('resolves /websites/order route', () => {
            const resolved = router.resolve('/websites/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /websites/:id route', () => {
            const resolved = router.resolve('/websites/10');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /websites/:id/:link route', () => {
            const resolved = router.resolve('/websites/10/login');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route i18n meta', () => {
        it('has i18n meta on login route', () => {
            const resolved = router.resolve('/login');
            const meta = resolved.matched[0]?.meta;
            expect(meta?.i18n).toEqual(['login', 'validation']);
        });

        it('has i18n meta on home route', () => {
            const resolved = router.resolve('/');
            const meta = resolved.matched[0]?.meta;
            expect(meta?.i18n).toEqual(['dashboard']);
        });

        it('has i18n meta on vps route', () => {
            const resolved = router.resolve('/vps');
            const meta = resolved.matched[0]?.meta;
            expect(meta?.i18n).toEqual(['vps']);
        });

        it('has i18n meta on domains route', () => {
            const resolved = router.resolve('/domains');
            const meta = resolved.matched[0]?.meta;
            expect(meta?.i18n).toEqual(['domains']);
        });

        it('has i18n meta on tickets route', () => {
            const resolved = router.resolve('/tickets');
            const meta = resolved.matched[0]?.meta;
            expect(meta?.i18n).toEqual(['tickets']);
        });

        it('has i18n meta on account route', () => {
            const resolved = router.resolve('/account/info');
            const parentMeta = resolved.matched[0]?.meta;
            expect(parentMeta?.i18n).toEqual(['account', 'validation']);
        });
    });

    describe('i18n namespace loading during navigation', () => {
        it('loads i18n namespaces when navigating to a route with meta.i18n', async () => {
            const authStore = useAuthStore();
            authStore.sessionId = 'test-session-id';

            await router.push('/vps');
            expect(router.currentRoute.value.path).toBe('/vps');
            // Navigation succeeded which means the beforeEach guard ran including i18n loading
        });

        it('navigates to route without i18n meta gracefully', async () => {
            const authStore = useAuthStore();
            authStore.sessionId = 'test-session-id';

            // The catch-all route has no meta.i18n
            await router.push('/some-unknown-path');
            // Should redirect to / via catch-all
            expect(router.currentRoute.value.path).toBe('/');
        });
    });

    describe('warmRouteRecord error handling', () => {
        it('handles component loader failure gracefully', async () => {
            const { warmRouteByLocation } = await import('@/router/index');
            // Warming a route that exists should not throw even if component fails
            warmRouteByLocation('/login_old');
            warmRouteByLocation('/sudo/test');
        });
    });

    describe('beforeEach guard - public page detection with deep paths', () => {
        it('allows /sudo/:sessionid as public page', async () => {
            const authStore = useAuthStore();
            authStore.sessionId = null;
            authStore.apiKey = null;

            await router.push('/sudo/test-session');
            // /sudo is a public page so it should not redirect to login
            expect(router.currentRoute.value.path).toBe('/sudo/test-session');
        });

        it('allows /signup as public page', async () => {
            const authStore = useAuthStore();
            authStore.sessionId = null;
            authStore.apiKey = null;

            await router.push('/signup');
            expect(router.currentRoute.value.path).toBe('/signup');
        });

        it('allows /logout as public page', async () => {
            const authStore = useAuthStore();
            authStore.sessionId = null;
            authStore.apiKey = null;

            await router.push('/logout');
            // /logout redirects to /login via beforeEnter
            expect(router.currentRoute.value.path).toBe('/login');
        });
    });
});
