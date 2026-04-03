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

    test('contact info page', async () => {
        await navigateTo(ctx.router, '/account/info');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('account-contact-info');
    });

    test('change password page', async () => {
        await navigateTo(ctx.router, '/account/pass');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('account-change-pass');
    });

    test('change username page', async () => {
        await navigateTo(ctx.router, '/account/username');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('account-change-username');
    });

    test('settings page', async () => {
        await navigateTo(ctx.router, '/account/settings');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('account-settings');
    });
});
