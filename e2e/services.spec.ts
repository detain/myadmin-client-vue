import { test, expect } from '@playwright/test';

test.describe('Service Pages (smoke tests)', () => {
    // These tests verify pages load without errors
    // In a real environment with auth, they would test more functionality

    const servicePages = [
        { path: '/vps', name: 'VPS' },
        { path: '/domains', name: 'Domains' },
        { path: '/servers', name: 'Servers' },
        { path: '/licenses', name: 'Licenses' },
        { path: '/ssl', name: 'SSL' },
        { path: '/mail', name: 'Mail' },
        { path: '/backups', name: 'Backups' },
        { path: '/websites', name: 'Web Hosting' },
        { path: '/qs', name: 'Quick Servers' },
        { path: '/floating_ips', name: 'Floating IPs' },
        { path: '/tickets', name: 'Tickets' },
        { path: '/invoices', name: 'Invoices' },
    ];

    for (const { path, name } of servicePages) {
        test(`${name} page redirects to login when unauthenticated`, async ({ page }) => {
            await page.goto(path);
            await expect(page).toHaveURL(/login/);
        });
    }
});
