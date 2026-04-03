// test/visual/account.visual.ts — Visual regression tests for Account pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Account Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('contact info page', async ({ annotate }) => {
        await annotate('Visual Regression: Account contact info page - displays editable contact information form');
        await navigateTo(ctx.router, '/account/info');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('account-contact-info');
    });

    test('change password page', async ({ annotate }) => {
        await annotate('Visual Regression: Account change password page - shows password update form with current and new password fields');
        await navigateTo(ctx.router, '/account/pass');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('account-change-pass');
    });

    test('change username page', async ({ annotate }) => {
        await annotate('Visual Regression: Account change username page - shows username update form');
        await navigateTo(ctx.router, '/account/username');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('account-change-username');
    });

    test('settings page', async ({ annotate }) => {
        await annotate('Visual Regression: Account settings page - displays account preferences and configuration options');
        await navigateTo(ctx.router, '/account/settings');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('account-settings');
    });
});
