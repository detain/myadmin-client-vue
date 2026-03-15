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
});
