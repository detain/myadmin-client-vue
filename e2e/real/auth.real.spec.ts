import { test, expect } from '@playwright/test';

test.describe('Real Authentication', () => {
    test('user is logged in and on dashboard', async ({ page }) => {
        await page.goto('/');
        await expect(page).not.toHaveURL(/login/);
    });

    test('user info is stored in localStorage', async ({ page }) => {
        await page.goto('/');
        const sessionId = await page.evaluate(() => localStorage.getItem('sessionId'));
        expect(sessionId).toBeTruthy();
        expect(sessionId!.length).toBeGreaterThan(0);

        const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));
        expect(user.account_id).toBeTruthy();
    });
});
