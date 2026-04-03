// test/visual/mail.visual.ts — Visual regression tests for Mail pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Mail Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page renders correctly', async () => {
        await navigateTo(ctx.router, '/mail');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('mail-list');
    });

    test('detail page renders correctly', async () => {
        await navigateTo(ctx.router, '/mail/601');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('mail-detail');
    });

    test('order page renders correctly', async () => {
        await navigateTo(ctx.router, '/mail/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('mail-order');
    });
});
