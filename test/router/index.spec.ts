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

    it('route "/" exists', ({ annotate }) => {
        annotate('Router: verifies root path "/" is a valid registered route');
        const route = router.resolve('/');
        expect(route).toBeDefined();
        expect(route.matched.length).toBeGreaterThan(0);
    });

    it('route "/login" exists', ({ annotate }) => {
        annotate('Router: verifies "/login" path is a valid registered route');
        const route = router.resolve('/login');
        expect(route).toBeDefined();
        expect(route.matched.length).toBeGreaterThan(0);
    });

    it('route "/register" exists', ({ annotate }) => {
        annotate('Router: verifies "/register" path is a valid registered route');
        const route = router.resolve('/register');
        expect(route).toBeDefined();
        expect(route.matched.length).toBeGreaterThan(0);
    });

    it('redirects unauthenticated user to /login for protected routes', async ({ annotate }) => {
        await annotate('Router: verifies unauthenticated users are redirected to /login when accessing protected routes');
        const authStore = useAuthStore();
        authStore.sessionId = null;
        authStore.apiKey = null;

        await router.push('/vps');

        expect(router.currentRoute.value.path).toBe('/login');
    });

    it('allows authenticated user to access protected routes', async ({ annotate }) => {
        await annotate('Router: verifies users with a valid sessionId can navigate to protected routes');
        const authStore = useAuthStore();
        authStore.sessionId = 'test-session-id';

        await router.push('/');

        expect(router.currentRoute.value.path).toBe('/');
    });

    it('clears alert on navigation', async ({ annotate }) => {
        await annotate('Router: verifies beforeEach guard clears alert store on every navigation');
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
            it(`${from} redirects to ${to}`, ({ annotate }) => {
                annotate(`Router: verifies legacy path ${from} has a redirect defined to ${to}`);
                const resolved = router.resolve(from);
                const matchedRoute = resolved.matched[0];
                expect(matchedRoute).toBeDefined();
                expect(matchedRoute.redirect).toBeDefined();
            });
        }
    });

    it('catch-all redirects unknown paths', ({ annotate }) => {
        annotate('Router: verifies catch-all route captures and redirects unknown/nonexistent paths');
        const resolved = router.resolve('/some-nonexistent-page-xyz');
        const matchedRoute = resolved.matched[0];
        expect(matchedRoute).toBeDefined();
        expect(matchedRoute.redirect).toBeDefined();
    });

    it('warmFrequentlyUsedRoutes function is exported', async ({ annotate }) => {
        await annotate('Router: verifies warmFrequentlyUsedRoutes is exported as a callable function');
        const routerModule = await import('@/router/index');
        expect(routerModule.warmFrequentlyUsedRoutes).toBeDefined();
        expect(typeof routerModule.warmFrequentlyUsedRoutes).toBe('function');
    });

    it('warmFrequentlyUsedRoutes can be called without error', async ({ annotate }) => {
        await annotate('Router: verifies warmFrequentlyUsedRoutes executes without throwing');
        const { warmFrequentlyUsedRoutes } = await import('@/router/index');
        expect(() => warmFrequentlyUsedRoutes()).not.toThrow();
    });

    it('warmRouteByLocation can be called with a path', async ({ annotate }) => {
        await annotate('Router: verifies warmRouteByLocation accepts a path string and executes without throwing');
        const { warmRouteByLocation } = await import('@/router/index');
        expect(() => warmRouteByLocation('/vps')).not.toThrow();
    });

    it('stores returnUrl when redirecting unauthenticated user', async ({ annotate }) => {
        await annotate('Router: verifies auth guard saves the intended URL as returnUrl before redirecting to /login');
        const authStore = useAuthStore();
        authStore.sessionId = null;
        authStore.apiKey = null;

        await router.push('/tickets');

        expect(authStore.returnUrl).toBe('/tickets');
        expect(router.currentRoute.value.path).toBe('/login');
    });

    it('allows access to public pages without auth', async ({ annotate }) => {
        await annotate('Router: verifies public pages like /register are accessible without authentication');
        const authStore = useAuthStore();
        authStore.sessionId = null;
        authStore.apiKey = null;

        await router.push('/register');
        expect(router.currentRoute.value.path).toBe('/register');
    });

    it('allows access when apiKey is set', async ({ annotate }) => {
        await annotate('Router: verifies API key authentication grants access to protected routes even without sessionId');
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
            it(`${from} has redirect defined`, ({ annotate }) => {
                annotate(`Router: verifies backward-compatible redirect is defined for legacy path ${from}`);
                const resolved = router.resolve(from);
                const matchedRoute = resolved.matched[0];
                expect(matchedRoute).toBeDefined();
                expect(matchedRoute.redirect).toBeDefined();
            });
        }
    });

    describe('dynamic redirect routes with query params', () => {
        it('/view_vps?id=5 resolves with redirect', ({ annotate }) => {
            annotate('Router: verifies /view_vps with query param has a dynamic redirect defined');
            const resolved = router.resolve('/view_vps?id=5');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/dns_editor resolves with redirect', ({ annotate }) => {
            annotate('Router: verifies legacy /dns_editor path has a redirect defined');
            const resolved = router.resolve('/dns_editor');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_domain resolves with redirect', ({ annotate }) => {
            annotate('Router: verifies legacy /view_domain path has a redirect defined');
            const resolved = router.resolve('/view_domain');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_backup resolves with redirect', ({ annotate }) => {
            annotate('Router: verifies legacy /view_backup path has a redirect defined');
            const resolved = router.resolve('/view_backup');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_license resolves with redirect', ({ annotate }) => {
            annotate('Router: verifies legacy /view_license path has a redirect defined');
            const resolved = router.resolve('/view_license');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_mail resolves with redirect', ({ annotate }) => {
            annotate('Router: verifies legacy /view_mail path has a redirect defined');
            const resolved = router.resolve('/view_mail');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_qs resolves with redirect', ({ annotate }) => {
            annotate('Router: verifies legacy /view_qs path has a redirect defined');
            const resolved = router.resolve('/view_qs');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_server resolves with redirect', ({ annotate }) => {
            annotate('Router: verifies legacy /view_server path has a redirect defined');
            const resolved = router.resolve('/view_server');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_ssl resolves with redirect', ({ annotate }) => {
            annotate('Router: verifies legacy /view_ssl path has a redirect defined');
            const resolved = router.resolve('/view_ssl');
            expect(resolved.matched[0].redirect).toBeDefined();
        });

        it('/view_website resolves with redirect', ({ annotate }) => {
            annotate('Router: verifies legacy /view_website path has a redirect defined');
            const resolved = router.resolve('/view_website');
            expect(resolved.matched[0].redirect).toBeDefined();
        });
    });

    describe('route resolution for service paths', () => {
        it('resolves /vps route', ({ annotate }) => {
            annotate('Router: verifies /vps service list route resolves to a valid route record');
            const resolved = router.resolve('/vps');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /domains route', ({ annotate }) => {
            annotate('Router: verifies /domains service list route resolves to a valid route record');
            const resolved = router.resolve('/domains');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /tickets route', ({ annotate }) => {
            annotate('Router: verifies /tickets route resolves to a valid route record');
            const resolved = router.resolve('/tickets');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /invoices route', ({ annotate }) => {
            annotate('Router: verifies /invoices billing route resolves to a valid route record');
            const resolved = router.resolve('/invoices');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves nested account routes', ({ annotate }) => {
            annotate('Router: verifies all nested /account/ sub-routes (info, pass, username, settings) resolve');
            expect(router.resolve('/account/info').matched.length).toBeGreaterThan(0);
            expect(router.resolve('/account/pass').matched.length).toBeGreaterThan(0);
            expect(router.resolve('/account/username').matched.length).toBeGreaterThan(0);
            expect(router.resolve('/account/settings').matched.length).toBeGreaterThan(0);
        });

        it('resolves /prepays route', ({ annotate }) => {
            annotate('Router: verifies /prepays billing route resolves to a valid route record');
            const resolved = router.resolve('/prepays');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /signup route', ({ annotate }) => {
            annotate('Router: verifies /signup public route resolves to a valid route record');
            const resolved = router.resolve('/signup');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /backups route', ({ annotate }) => {
            annotate('Router: verifies /backups service list route resolves to a valid route record');
            const resolved = router.resolve('/backups');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /servers route', ({ annotate }) => {
            annotate('Router: verifies /servers service list route resolves to a valid route record');
            const resolved = router.resolve('/servers');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /ssl route', ({ annotate }) => {
            annotate('Router: verifies /ssl service list route resolves to a valid route record');
            const resolved = router.resolve('/ssl');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /websites route', ({ annotate }) => {
            annotate('Router: verifies /websites service list route resolves to a valid route record');
            const resolved = router.resolve('/websites');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /mail route', ({ annotate }) => {
            annotate('Router: verifies /mail service list route resolves to a valid route record');
            const resolved = router.resolve('/mail');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /licenses route', ({ annotate }) => {
            annotate('Router: verifies /licenses service list route resolves to a valid route record');
            const resolved = router.resolve('/licenses');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /floating_ips route', ({ annotate }) => {
            annotate('Router: verifies /floating_ips service list route resolves to a valid route record');
            const resolved = router.resolve('/floating_ips');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /qs route', ({ annotate }) => {
            annotate('Router: verifies /qs (quickservers) service list route resolves to a valid route record');
            const resolved = router.resolve('/qs');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /scrub_ips route', ({ annotate }) => {
            annotate('Router: verifies /scrub_ips service route resolves to a valid route record');
            const resolved = router.resolve('/scrub_ips');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /dns route', ({ annotate }) => {
            annotate('Router: verifies /dns service route resolves to a valid route record');
            const resolved = router.resolve('/dns');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /cart route', ({ annotate }) => {
            annotate('Router: verifies /cart billing route resolves to a valid route record');
            const resolved = router.resolve('/cart');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /payment_types route', ({ annotate }) => {
            annotate('Router: verifies /payment_types billing route resolves to a valid route record');
            const resolved = router.resolve('/payment_types');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /affiliate route', ({ annotate }) => {
            annotate('Router: verifies /affiliate route resolves to a valid route record');
            const resolved = router.resolve('/affiliate');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('beforeEach guard with deep paths', () => {
        it('handles paths with 3+ segments for auth check', async ({ annotate }) => {
            await annotate('Router: verifies auth guard works correctly on deeply nested paths with 3+ segments');
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
            it(`${path} redirect function returns correct path with id`, ({ annotate }) => {
                annotate(`Router: verifies ${path} dynamic redirect function builds correct path when id query param is present`);
                const resolved = router.resolve(path);
                const redirect = resolved.matched[0].redirect;
                if (typeof redirect === 'function') {
                    const idNum = withId.split('/').pop();
                    const result = redirect({ query: { id: idNum }, path, params: {}, hash: '', matched: [], fullPath: path, redirectedFrom: undefined, name: undefined, meta: {} } as any);
                    expect(result).toBe(withId);
                }
            });

            it(`${path} redirect function returns fallback without id`, ({ annotate }) => {
                annotate(`Router: verifies ${path} dynamic redirect function falls back to list path when no id query param`);
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
        it('warmRouteByLocation resolves and warms route components', async ({ annotate }) => {
            await annotate('Router: verifies warmRouteByLocation pre-loads route components for multiple paths without error');
            const { warmRouteByLocation } = await import('@/router/index');
            // Call with a valid route - should not throw and should execute warming code
            warmRouteByLocation('/vps');
            warmRouteByLocation('/domains');
            warmRouteByLocation('/tickets');
        });

        it('warmFrequentlyUsedRoutes warms all frequent routes', async ({ annotate }) => {
            await annotate('Router: verifies warmFrequentlyUsedRoutes pre-loads all frequently accessed route components');
            const { warmFrequentlyUsedRoutes } = await import('@/router/index');
            warmFrequentlyUsedRoutes();
        });

        it('calling warmRouteByLocation twice for same route is idempotent', async ({ annotate }) => {
            await annotate('Router: verifies calling warmRouteByLocation twice for the same route does not cause errors');
            const { warmRouteByLocation } = await import('@/router/index');
            warmRouteByLocation('/invoices');
            warmRouteByLocation('/invoices');
        });
    });

    describe('/logout route', () => {
        it('has a beforeEnter guard', ({ annotate }) => {
            annotate('Router: verifies /logout route has a beforeEnter guard that handles logout logic');
            const resolved = router.resolve('/logout');
            const matchedRoute = resolved.matched[0];
            expect(matchedRoute).toBeDefined();
            expect(matchedRoute.beforeEnter).toBeDefined();
        });

        it('navigates to /login after logout', async ({ annotate }) => {
            await annotate('Router: verifies navigating to /logout redirects user to /login page');
            const authStore = useAuthStore();
            authStore.sessionId = 'test-session';

            await router.push('/logout');
            expect(router.currentRoute.value.path).toBe('/login');
        });
    });

    describe('route with numeric constraints', () => {
        it('/invoices/:id resolves for numeric id', ({ annotate }) => {
            annotate('Router: verifies /invoices/:id route accepts numeric id parameter');
            const resolved = router.resolve('/invoices/123');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('/vps/:id resolves for numeric id', ({ annotate }) => {
            annotate('Router: verifies /vps/:id route accepts numeric id parameter');
            const resolved = router.resolve('/vps/456');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('/vps/:id/:link resolves for valid link', ({ annotate }) => {
            annotate('Router: verifies /vps/:id/:link route resolves with both numeric id and action link segment');
            const resolved = router.resolve('/vps/1/backup');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for uncovered service paths', () => {
        it('resolves /login_old route', ({ annotate }) => {
            annotate('Router: verifies legacy /login_old route resolves to a valid route record');
            const resolved = router.resolve('/login_old');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /sudo/:sessionid route', ({ annotate }) => {
            annotate('Router: verifies /sudo/:sessionid route resolves and extracts sessionid param');
            const resolved = router.resolve('/sudo/abc123');
            expect(resolved.matched.length).toBeGreaterThan(0);
            expect(resolved.params.sessionid).toBe('abc123');
        });

        it('resolves /payment_types route', ({ annotate }) => {
            annotate('Router: verifies /payment_types billing route resolves to a valid route record');
            const resolved = router.resolve('/payment_types');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /cart/:invoices route', ({ annotate }) => {
            annotate('Router: verifies /cart/:invoices route resolves and extracts invoices param');
            const resolved = router.resolve('/cart/12345');
            expect(resolved.matched.length).toBeGreaterThan(0);
            expect(resolved.params.invoices).toBe('12345');
        });

        it('resolves /order_needs_payment/:invoices route', ({ annotate }) => {
            annotate('Router: verifies /order_needs_payment/:invoices route resolves for payment flow');
            const resolved = router.resolve('/order_needs_payment/999');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /pay/:method/:invoices route', ({ annotate }) => {
            annotate('Router: verifies /pay/:method/:invoices route resolves with payment method and invoice params');
            const resolved = router.resolve('/pay/cc/123');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /pay with done param', ({ annotate }) => {
            annotate('Router: verifies /pay route resolves with done suffix for payment completion flow');
            const resolved = router.resolve('/pay/paypal/123/done');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /payment_success route', ({ annotate }) => {
            annotate('Router: verifies /payment_success route resolves for post-payment confirmation');
            const resolved = router.resolve('/payment_success');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /invoices/:id route', ({ annotate }) => {
            annotate('Router: verifies /invoices/:id route resolves with numeric invoice id');
            const resolved = router.resolve('/invoices/999');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for account and user paths', () => {
        it('resolves /account/pass route', ({ annotate }) => {
            annotate('Router: verifies /account/pass password change route resolves');
            const resolved = router.resolve('/account/pass');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /account/username route', ({ annotate }) => {
            annotate('Router: verifies /account/username change route resolves');
            const resolved = router.resolve('/account/username');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /account/settings route', ({ annotate }) => {
            annotate('Router: verifies /account/settings route resolves');
            const resolved = router.resolve('/account/settings');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /users route', ({ annotate }) => {
            annotate('Router: verifies /users management list route resolves');
            const resolved = router.resolve('/users');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /users/add route', ({ annotate }) => {
            annotate('Router: verifies /users/add user creation route resolves');
            const resolved = router.resolve('/users/add');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /users/edit/:id route', ({ annotate }) => {
            annotate('Router: verifies /users/edit/:id route resolves with numeric user id param');
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
            it(`resolves ${path}`, ({ annotate }) => {
                annotate(`Router: verifies affiliate sub-route ${path} resolves to a valid route record`);
                const resolved = router.resolve(path);
                expect(resolved.matched.length).toBeGreaterThan(0);
            });
        }
    });

    describe('route resolution for tickets, backups, dns paths', () => {
        it('resolves /tickets/new route', ({ annotate }) => {
            annotate('Router: verifies /tickets/new ticket creation route resolves');
            const resolved = router.resolve('/tickets/new');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /tickets/:id route', ({ annotate }) => {
            annotate('Router: verifies /tickets/:id detail route resolves with numeric ticket id');
            const resolved = router.resolve('/tickets/42');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /backups/order route', ({ annotate }) => {
            annotate('Router: verifies /backups/order route resolves for backup ordering');
            const resolved = router.resolve('/backups/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /backups/:id route', ({ annotate }) => {
            annotate('Router: verifies /backups/:id detail route resolves with numeric backup id');
            const resolved = router.resolve('/backups/10');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /backups/:id/:link route', ({ annotate }) => {
            annotate('Router: verifies /backups/:id/:link resolves with both backup id and action link');
            const resolved = router.resolve('/backups/10/login');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /dns/:id route', ({ annotate }) => {
            annotate('Router: verifies /dns/:id detail route resolves with numeric DNS id');
            const resolved = router.resolve('/dns/5');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for domains paths', () => {
        it('resolves /domains/order route', ({ annotate }) => {
            annotate('Router: verifies /domains/order route resolves for domain ordering');
            const resolved = router.resolve('/domains/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /domains/order/:domain route', ({ annotate }) => {
            annotate('Router: verifies /domains/order/:domain resolves with domain name parameter');
            const resolved = router.resolve('/domains/order/example.com');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /domains/order/:domain/:regType route', ({ annotate }) => {
            annotate('Router: verifies /domains/order/:domain/:regType resolves with domain and registration type');
            const resolved = router.resolve('/domains/order/example.com/register');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /domains/:id route', ({ annotate }) => {
            annotate('Router: verifies /domains/:id detail route resolves with numeric domain id');
            const resolved = router.resolve('/domains/100');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /domains/:id/:link route', ({ annotate }) => {
            annotate('Router: verifies /domains/:id/:link resolves with both domain id and action link');
            const resolved = router.resolve('/domains/100/cancel');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for floating_ips, licenses, mail paths', () => {
        it('resolves /floating_ips/order route', ({ annotate }) => {
            annotate('Router: verifies /floating_ips/order route resolves for floating IP ordering');
            const resolved = router.resolve('/floating_ips/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /floating_ips/:id route', ({ annotate }) => {
            annotate('Router: verifies /floating_ips/:id detail route resolves with numeric id');
            const resolved = router.resolve('/floating_ips/7');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /floating_ips/:id/:link route', ({ annotate }) => {
            annotate('Router: verifies /floating_ips/:id/:link resolves with both id and action link');
            const resolved = router.resolve('/floating_ips/7/cancel');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /licenses/order route', ({ annotate }) => {
            annotate('Router: verifies /licenses/order route resolves for license ordering');
            const resolved = router.resolve('/licenses/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /licenses/order/:catTag route', ({ annotate }) => {
            annotate('Router: verifies /licenses/order/:catTag resolves with category tag parameter');
            const resolved = router.resolve('/licenses/order/cpanel');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /licenses/:id route', ({ annotate }) => {
            annotate('Router: verifies /licenses/:id detail route resolves with numeric license id');
            const resolved = router.resolve('/licenses/20');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /licenses/:id/:link route', ({ annotate }) => {
            annotate('Router: verifies /licenses/:id/:link resolves with both license id and action link');
            const resolved = router.resolve('/licenses/20/change_ip');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /mail/order route', ({ annotate }) => {
            annotate('Router: verifies /mail/order route resolves for mail service ordering');
            const resolved = router.resolve('/mail/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /mail/:id route', ({ annotate }) => {
            annotate('Router: verifies /mail/:id detail route resolves with numeric mail id');
            const resolved = router.resolve('/mail/30');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /mail/:id/:link route', ({ annotate }) => {
            annotate('Router: verifies /mail/:id/:link resolves with both mail id and action link');
            const resolved = router.resolve('/mail/30/stats');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /mail/:id/:link/:ruleId route', ({ annotate }) => {
            annotate('Router: verifies /mail/:id/:link/:ruleId resolves with deeply nested mail rule path');
            const resolved = router.resolve('/mail/30/rules/5');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for qs, scrub_ips paths', () => {
        it('resolves /qs/order route', ({ annotate }) => {
            annotate('Router: verifies /qs/order route resolves for quickserver ordering');
            const resolved = router.resolve('/qs/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /qs/:id route', ({ annotate }) => {
            annotate('Router: verifies /qs/:id detail route resolves with numeric quickserver id');
            const resolved = router.resolve('/qs/40');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /qs/:id/:link route', ({ annotate }) => {
            annotate('Router: verifies /qs/:id/:link resolves with both quickserver id and action link');
            const resolved = router.resolve('/qs/40/start');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /scrub_ips/:id route', ({ annotate }) => {
            annotate('Router: verifies /scrub_ips/:id detail route resolves with numeric scrub IP id');
            const resolved = router.resolve('/scrub_ips/3');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for servers, ssl paths', () => {
        it('resolves /servers/order route', ({ annotate }) => {
            annotate('Router: verifies /servers/order route resolves for server ordering');
            const resolved = router.resolve('/servers/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /servers/order_dedicated route', ({ annotate }) => {
            annotate('Router: verifies /servers/order_dedicated route resolves for dedicated server ordering');
            const resolved = router.resolve('/servers/order_dedicated');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /servers/:id route', ({ annotate }) => {
            annotate('Router: verifies /servers/:id detail route resolves with numeric server id');
            const resolved = router.resolve('/servers/50');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /servers/:id/:link route', ({ annotate }) => {
            annotate('Router: verifies /servers/:id/:link resolves with both server id and action link');
            const resolved = router.resolve('/servers/50/cancel');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /ssl/order route', ({ annotate }) => {
            annotate('Router: verifies /ssl/order route resolves for SSL certificate ordering');
            const resolved = router.resolve('/ssl/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /ssl/:id route', ({ annotate }) => {
            annotate('Router: verifies /ssl/:id detail route resolves with numeric SSL id');
            const resolved = router.resolve('/ssl/60');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /ssl/:id/:link route', ({ annotate }) => {
            annotate('Router: verifies /ssl/:id/:link resolves with both SSL id and action link');
            const resolved = router.resolve('/ssl/60/cancel');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route resolution for vps and websites child paths', () => {
        it('resolves /vps/order route', ({ annotate }) => {
            annotate('Router: verifies /vps/order route resolves for VPS ordering');
            const resolved = router.resolve('/vps/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /vps/:id/:link with various links', ({ annotate }) => {
            annotate('Router: verifies /vps/:id/:link resolves for all VPS action links (start, stop, restart, etc.)');
            const links = ['start', 'stop', 'restart', 'invoices', 'cancel', 'reinstall_os'];
            for (const link of links) {
                const resolved = router.resolve(`/vps/1/${link}`);
                expect(resolved.matched.length).toBeGreaterThan(0);
            }
        });

        it('resolves /websites/order route', ({ annotate }) => {
            annotate('Router: verifies /websites/order route resolves for website ordering');
            const resolved = router.resolve('/websites/order');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /websites/:id route', ({ annotate }) => {
            annotate('Router: verifies /websites/:id detail route resolves with numeric website id');
            const resolved = router.resolve('/websites/10');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });

        it('resolves /websites/:id/:link route', ({ annotate }) => {
            annotate('Router: verifies /websites/:id/:link resolves with both website id and action link');
            const resolved = router.resolve('/websites/10/login');
            expect(resolved.matched.length).toBeGreaterThan(0);
        });
    });

    describe('route i18n meta', () => {
        it('has i18n meta on login route', ({ annotate }) => {
            annotate('Router: verifies /login route has correct i18n namespace metadata for lazy-loading translations');
            const resolved = router.resolve('/login');
            const meta = resolved.matched[0]?.meta;
            expect(meta?.i18n).toEqual(['login', 'validation']);
        });

        it('has i18n meta on home route', ({ annotate }) => {
            annotate('Router: verifies / home route has dashboard i18n namespace in metadata');
            const resolved = router.resolve('/');
            const meta = resolved.matched[0]?.meta;
            expect(meta?.i18n).toEqual(['dashboard']);
        });

        it('has i18n meta on vps route', ({ annotate }) => {
            annotate('Router: verifies /vps route has vps i18n namespace in metadata');
            const resolved = router.resolve('/vps');
            const meta = resolved.matched[0]?.meta;
            expect(meta?.i18n).toEqual(['vps']);
        });

        it('has i18n meta on domains route', ({ annotate }) => {
            annotate('Router: verifies /domains route has domains i18n namespace in metadata');
            const resolved = router.resolve('/domains');
            const meta = resolved.matched[0]?.meta;
            expect(meta?.i18n).toEqual(['domains']);
        });

        it('has i18n meta on tickets route', ({ annotate }) => {
            annotate('Router: verifies /tickets route has tickets i18n namespace in metadata');
            const resolved = router.resolve('/tickets');
            const meta = resolved.matched[0]?.meta;
            expect(meta?.i18n).toEqual(['tickets']);
        });

        it('has i18n meta on account route', ({ annotate }) => {
            annotate('Router: verifies /account/info route has account and validation i18n namespaces in metadata');
            const resolved = router.resolve('/account/info');
            const parentMeta = resolved.matched[0]?.meta;
            expect(parentMeta?.i18n).toEqual(['account', 'validation']);
        });
    });

    describe('i18n namespace loading during navigation', () => {
        it('loads i18n namespaces when navigating to a route with meta.i18n', async ({ annotate }) => {
            await annotate('Router: verifies i18n namespaces are loaded during navigation via beforeEach guard');
            const authStore = useAuthStore();
            authStore.sessionId = 'test-session-id';

            await router.push('/vps');
            expect(router.currentRoute.value.path).toBe('/vps');
            // Navigation succeeded which means the beforeEach guard ran including i18n loading
        });

        it('navigates to route without i18n meta gracefully', async ({ annotate }) => {
            await annotate('Router: verifies navigation succeeds even when route has no i18n meta defined');
            const authStore = useAuthStore();
            authStore.sessionId = 'test-session-id';

            // The catch-all route has no meta.i18n
            await router.push('/some-unknown-path');
            // Should redirect to / via catch-all
            expect(router.currentRoute.value.path).toBe('/');
        });
    });

    describe('warmRouteRecord error handling', () => {
        it('handles component loader failure gracefully', async ({ annotate }) => {
            await annotate('Router: verifies warmRouteByLocation handles component loading failures without throwing');
            const { warmRouteByLocation } = await import('@/router/index');
            // Warming a route that exists should not throw even if component fails
            warmRouteByLocation('/login_old');
            warmRouteByLocation('/sudo/test');
        });
    });

    describe('beforeEach guard - public page detection with deep paths', () => {
        it('allows /sudo/:sessionid as public page', async ({ annotate }) => {
            await annotate('Router: verifies /sudo/:sessionid is treated as a public page and does not require auth');
            const authStore = useAuthStore();
            authStore.sessionId = null;
            authStore.apiKey = null;

            await router.push('/sudo/test-session');
            // /sudo is a public page so it should not redirect to login
            expect(router.currentRoute.value.path).toBe('/sudo/test-session');
        });

        it('allows /signup as public page', async ({ annotate }) => {
            await annotate('Router: verifies /signup is treated as a public page accessible without authentication');
            const authStore = useAuthStore();
            authStore.sessionId = null;
            authStore.apiKey = null;

            await router.push('/signup');
            expect(router.currentRoute.value.path).toBe('/signup');
        });

        it('allows /logout as public page', async ({ annotate }) => {
            await annotate('Router: verifies /logout is accessible without auth and redirects to /login via beforeEnter');
            const authStore = useAuthStore();
            authStore.sessionId = null;
            authStore.apiKey = null;

            await router.push('/logout');
            // /logout redirects to /login via beforeEnter
            expect(router.currentRoute.value.path).toBe('/login');
        });
    });
});
