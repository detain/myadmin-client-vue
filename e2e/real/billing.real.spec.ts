import { test, expect, type Page } from '@playwright/test';

test.use({ navigationTimeout: 60000, actionTimeout: 15000 });

async function waitForPageReady(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.content-wrapper, .content, #app', { timeout: 15000 });
    await page.waitForTimeout(2000);
}

test.describe('Invoices', () => {
    test('invoices list page loads', async ({ page }) => {
        await page.goto('/invoices');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });

    test('can view an invoice if any exist', async ({ page }) => {
        await page.goto('/invoices');
        await waitForPageReady(page);

        // Find links to numeric invoice IDs only
        const numericLinks = await page.locator('a[href*="/invoices/"]').evaluateAll((links) =>
            links.filter((a) => /\/invoices\/\d+/.test(a.getAttribute('href') || '')).map((a) => a.getAttribute('href'))
        );
        if (numericLinks.length > 0) {
            await page.goto(numericLinks[0]!);
            await waitForPageReady(page);
            await expect(page).toHaveURL(/\/invoices\/\d+/);
        }
    });
});

test.describe('Payment Types', () => {
    test('payment types page loads', async ({ page }) => {
        await page.goto('/payment_types');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });
});

test.describe('Pre-Paid Funds', () => {
    test('prepays page loads', async ({ page }) => {
        await page.goto('/prepays');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });
});

test.describe('Cart', () => {
    test('cart page loads', async ({ page }) => {
        await page.goto('/cart');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });
});
