import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('login page loads', async ({ page }) => {
        await page.goto('/login');
        await expect(page).toHaveURL(/login/);
    });

    test('unauthenticated user is redirected to login', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/login/);
    });

    test('login form has required fields', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('#loginname')).toBeVisible();
        await expect(page.locator('#loginpassword')).toBeVisible();
    });

    test('register page loads', async ({ page }) => {
        await page.goto('/register');
        await expect(page.locator('text=Register')).toBeVisible();
    });
});
