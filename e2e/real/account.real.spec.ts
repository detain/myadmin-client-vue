import { test, expect, type Page } from '@playwright/test';

test.use({ navigationTimeout: 60000, actionTimeout: 15000 });

async function waitForPageReady(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.content-wrapper, .content, #app', { timeout: 15000 });
    await page.waitForTimeout(2000);
}

test.describe('Account - Contact Info', () => {
    test('contact info page loads with form fields', async ({ page }) => {
        await page.goto('/account/info');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
        // Should have form inputs for contact information
        const inputs = page.locator('input, select');
        const count = await inputs.count();
        expect(count).toBeGreaterThan(0);
    });

    test('contact info can be viewed and saved without changes', async ({ page }) => {
        await page.goto('/account/info');
        await waitForPageReady(page);

        // Find and click a save/update button if present
        const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update"), button[type="submit"]');
        const saveBtnCount = await saveBtn.count();
        if (saveBtnCount > 0) {
            await saveBtn.first().click();
            await waitForPageReady(page);
            // Should stay on the same page without errors
            await expect(page).toHaveURL(/account\/info/);
        }
    });
});

test.describe('Account - Change Password', () => {
    test('change password page loads', async ({ page }) => {
        await page.goto('/account/pass');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
        // Should have password input fields
        const passwordInputs = page.locator('input[type="password"]');
        const count = await passwordInputs.count();
        expect(count).toBeGreaterThan(0);
    });
});

test.describe('Account - Change Username', () => {
    test('change username page loads', async ({ page }) => {
        await page.goto('/account/username');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });
});

test.describe('Account - Settings', () => {
    test('account settings page loads', async ({ page }) => {
        await page.goto('/account/settings');
        await waitForPageReady(page);
        await expect(page).not.toHaveURL(/login/);
    });
});
