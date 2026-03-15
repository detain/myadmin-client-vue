import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test('old URLs redirect properly', async ({ page }) => {
        await page.goto('/view_vps_list');
        // Should redirect to /vps then to /login (unauthenticated)
        await expect(page).toHaveURL(/login/);
    });

    test('404 routes redirect to home', async ({ page }) => {
        await page.goto('/nonexistent-page');
        await expect(page).toHaveURL(/login/); // redirects to / then to /login
    });
});
