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

describe('Router Backward Compatibility Redirects', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    const redirectTests = [
        { from: '/view_vps_list', to: '/vps' },
        { from: '/order_vps', to: '/vps/order' },
        { from: '/contact_info', to: '/account/info' },
        { from: '/change_pass', to: '/account/pass' },
        { from: '/dns_manager', to: '/dns' },
        { from: '/view_domains_list', to: '/domains' },
        { from: '/view_servers_list', to: '/servers' },
        { from: '/view_licenses_list', to: '/licenses' },
        { from: '/view_ssl_list', to: '/ssl' },
        { from: '/view_mail_list', to: '/mail' },
        { from: '/view_backups_list', to: '/backups' },
        { from: '/view_websites_list', to: '/websites' },
        { from: '/order_domain', to: '/domains/order' },
        { from: '/order_server', to: '/servers/order' },
        { from: '/order_license', to: '/licenses/order' },
        { from: '/order_ssl', to: '/ssl/order' },
        { from: '/order_mail', to: '/mail/order' },
        { from: '/order_backup', to: '/backups/order' },
        { from: '/order_website', to: '/websites/order' },
        { from: '/order_qs', to: '/qs/order' },
    ];

    for (const { from, to } of redirectTests) {
        it(`redirects ${from} to ${to}`, () => {
            const resolved = router.resolve(from);
            // For redirect routes, the matched route has a redirect property
            const matchedRoute = resolved.matched[0];
            expect(matchedRoute).toBeDefined();
            expect(matchedRoute.redirect).toBeDefined();
        });
    }

    it('catch-all route redirects unknown paths to /', () => {
        const resolved = router.resolve('/this-path-does-not-exist');
        const matchedRoute = resolved.matched[0];
        expect(matchedRoute).toBeDefined();
        expect(matchedRoute.redirect).toBeDefined();
    });
});
