import { test, expect, type Page } from '@playwright/test';

test.use({ navigationTimeout: 60000, actionTimeout: 15000 });

/** Wait for the page to finish loading (route loading overlay gone). */
async function waitForPageReady(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    // Wait for Vue app to render content (content-wrapper is the main AdminLTE container)
    await page.waitForSelector('.content-wrapper, .content, #app', { timeout: 15000 });
    await page.waitForTimeout(2000);
}

test.describe('Dashboard', () => {
    test('loads dashboard with service counts', async ({ page }) => {
        await page.goto('/');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
        // Dashboard should have some visible content
        const body = await page.locator('body').textContent();
        expect(body!.length).toBeGreaterThan(50);
    });
});

test.describe('Service List Pages', () => {
    const services = [
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
        { path: '/dns', name: 'DNS Manager' },
    ];

    for (const { path, name } of services) {
        test(`${name} list page loads (${path})`, async ({ page }) => {
            await page.goto(path);
            await waitForPageReady(page);
            // Should stay on the service page, not redirect to login
            await expect(page).not.toHaveURL(/login/);
            // Page should have rendered something
            const body = await page.locator('body').textContent();
            expect(body!.length).toBeGreaterThan(20);
        });
    }
});

test.describe('Service Detail Pages', () => {
    const serviceDetailTests = [
        { path: '/vps', name: 'VPS' },
        { path: '/domains', name: 'Domains' },
        { path: '/mail', name: 'Mail' },
        { path: '/websites', name: 'Websites' },
    ];

    for (const { path, name } of serviceDetailTests) {
        test(`${name} list loads and can click into first item if available`, async ({ page }) => {
            await page.goto(path);
            await waitForPageReady(page);

            // Only match links to numeric IDs (e.g., /vps/12345), not /vps/order
            const detailLinks = page.locator(`a[href^="${path}/"]`).filter({
                has: page.locator(':scope'),
            });
            // Filter to only links with numeric IDs using evaluate
            const numericLinks = await detailLinks.evaluateAll(
                (links, basePath) => links.filter((a) => /^\d+$/.test(a.getAttribute('href')!.replace(basePath + '/', '').split('/')[0])).map((a) => a.getAttribute('href')),
                path
            );
            if (numericLinks.length > 0) {
                await page.goto(numericLinks[0]!);
                await waitForPageReady(page);
                const pattern = new RegExp(`${path.replace('/', '\\/')}\\/\\d+`);
                await expect(page).toHaveURL(pattern);
            }
        });
    }
});
