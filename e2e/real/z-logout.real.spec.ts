import { test, expect } from '@playwright/test';

/**
 * Logout test runs LAST (z-prefix sorts it after all other test files).
 * This test invalidates the session server-side, so no test should run after it.
 */
test.describe('Logout', () => {
    test('logout redirects to login page and clears session', async ({ page }) => {
        await page.goto('/');
        await expect(page).not.toHaveURL(/login/);

        await page.goto('/logout');
        await expect(page).toHaveURL(/login/, { timeout: 15000 });

        const sessionId = await page.evaluate(() => localStorage.getItem('sessionId'));
        expect(!sessionId || sessionId === '').toBeTruthy();
    });
});
