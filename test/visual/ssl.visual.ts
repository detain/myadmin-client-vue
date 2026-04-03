// test/visual/ssl.visual.ts — Visual regression tests for SSL pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('SSL Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page', async () => {
        await navigateTo(ctx.router, '/ssl');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('ssl-list');
    });

    test('detail page', async () => {
        await navigateTo(ctx.router, '/ssl/501');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('ssl-detail');
    });

    test('order page', async () => {
        await navigateTo(ctx.router, '/ssl/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('ssl-order');
    });
});
