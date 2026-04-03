// test/visual/quickservers.visual.ts — Visual regression tests for Quick Server pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Quick Server Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: Quick Servers list page - displays service table with quick server entries');
        await navigateTo(ctx.router, '/qs');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('quickservers-list');
    });

    test('detail page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: Quick Server detail page - shows individual quick server info and action links');
        await navigateTo(ctx.router, '/qs/901');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('quickservers-detail');
    });

    test('order page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: Quick Server order page - displays quick server configuration and ordering form');
        await navigateTo(ctx.router, '/qs/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('quickservers-order');
    });
});
