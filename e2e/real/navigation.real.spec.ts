import { test, expect, type Page } from '@playwright/test';

test.use({ navigationTimeout: 60000, actionTimeout: 15000 });

async function waitForPageReady(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.content-wrapper, .content, #app', { timeout: 15000 });
    await page.waitForTimeout(2000);
}

test.describe('Main Menu Navigation', () => {
    test('main sidebar menu is visible when authenticated', async ({ page }) => {
        await page.goto('/');
        await waitForPageReady(page);
        // AdminLTE sidebar should be present
        const sidebar = page.locator('.main-sidebar, .sidebar, nav');
        await expect(sidebar.first()).toBeVisible();
    });

    test('can navigate between service pages via URL', async ({ page }) => {
        // Navigate through multiple pages to ensure routing works
        const pages = ['/vps', '/domains', '/tickets', '/invoices', '/'];
        for (const path of pages) {
            await page.goto(path);
            await waitForPageReady(page);
            await expect(page).not.toHaveURL(/login/);
        }
    });
});

test.describe('Tickets', () => {
    test('tickets list page loads', async ({ page }) => {
        await page.goto('/tickets');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });

    test('new ticket page loads', async ({ page }) => {
        await page.goto('/tickets/new');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });

    test('can view a ticket if any exist', async ({ page }) => {
        await page.goto('/tickets');
        await waitForPageReady(page);

        // Find links to numeric ticket IDs only (not /tickets/new)
        const numericLinks = await page.locator('a[href*="/tickets/"]').evaluateAll((links) =>
            links.filter((a) => /\/tickets\/\d+/.test(a.getAttribute('href') || '')).map((a) => a.getAttribute('href'))
        );
        if (numericLinks.length > 0) {
            await page.goto(numericLinks[0]!);
            await waitForPageReady(page);
            await expect(page).toHaveURL(/\/tickets\/\d+/);
        }
    });
});

test.describe('Affiliate System', () => {
    test('affiliate dashboard loads', async ({ page }) => {
        await page.goto('/affiliate');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });

    test('affiliate FAQ loads', async ({ page }) => {
        await page.goto('/affiliate/faq');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });

    test('affiliate banners page loads', async ({ page }) => {
        await page.goto('/affiliate/banners');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });
});

test.describe('Users Management', () => {
    test('users list page loads', async ({ page }) => {
        await page.goto('/users');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });
});

test.describe('Legacy URL Redirects (authenticated)', () => {
    const redirects = [
        { from: '/view_vps_list', to: '/vps' },
        { from: '/view_domains_list', to: '/domains' },
        { from: '/view_servers_list', to: '/servers' },
        { from: '/contact_info', to: '/account/info' },
        { from: '/change_pass', to: '/account/pass' },
        { from: '/dns_manager', to: '/dns' },
    ];

    for (const { from, to } of redirects) {
        test(`${from} redirects to ${to}`, async ({ page }) => {
            await page.goto(from);
            await waitForPageReady(page);
            await expect(page).toHaveURL(new RegExp(to.replace(/\//g, '\\/')));
        });
    }
});

test.describe('Order Pages (read-only browsing)', () => {
    const orderPages = [
        { path: '/vps/order', name: 'Order VPS' },
        { path: '/domains/order', name: 'Order Domain' },
        { path: '/licenses/order', name: 'Order License' },
        { path: '/ssl/order', name: 'Order SSL' },
        { path: '/mail/order', name: 'Order Mail' },
        { path: '/websites/order', name: 'Order Website' },
        { path: '/backups/order', name: 'Order Backup' },
        { path: '/servers/order', name: 'Order Server' },
    ];

    for (const { path, name } of orderPages) {
        test(`${name} page loads (${path})`, async ({ page }) => {
            await page.goto(path);
            await waitForPageReady(page);
            await expect(page).not.toHaveURL(/login/);
        });
    }
});

test.describe('Scrub IPs', () => {
    test('scrub IPs list page loads', async ({ page }) => {
        await page.goto('/scrub_ips');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });
});

test.describe('No Console Errors on Key Pages', () => {
    const keyPages = ['/', '/vps', '/domains', '/invoices', '/account/info', '/tickets'];

    for (const path of keyPages) {
        test(`no uncaught errors on ${path}`, async ({ page }) => {
            const errors: string[] = [];
            page.on('pageerror', (error) => {
                errors.push(error.message);
            });

            await page.goto(path);
            await waitForPageReady(page);

            // Filter out known non-critical errors (e.g. third-party scripts)
            const criticalErrors = errors.filter(
                (e) => !e.includes('recaptcha') && !e.includes('turnstile') && !e.includes('Script error') && !e.includes('ResizeObserver')
            );
            expect(criticalErrors).toEqual([]);
        });
    }
});
