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

    test('list page', async ({ annotate }) => {
        await annotate('Visual Regression: SSL list page - displays service table with SSL certificate entries');
        await navigateTo(ctx.router, '/ssl');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('ssl-list');
    });

    test('detail page', async ({ annotate }) => {
        await annotate('Visual Regression: SSL detail page - shows individual certificate info, expiry, and action links');
        await navigateTo(ctx.router, '/ssl/501');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('ssl-detail');
    });

    test('order page', async ({ annotate }) => {
        await annotate('Visual Regression: SSL order page - displays certificate type selection and ordering form');
        await navigateTo(ctx.router, '/ssl/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('ssl-order');
    });
});
