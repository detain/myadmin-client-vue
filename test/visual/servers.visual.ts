// test/visual/servers.visual.ts — Visual regression tests for Server pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Server Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page', async ({ annotate }) => {
        await annotate('Visual Regression: Servers list page - displays service table with dedicated server entries');
        await navigateTo(ctx.router, '/servers');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('servers-list');
    });

    test('detail page', async ({ annotate }) => {
        await annotate('Visual Regression: Server detail page - shows individual server info, hardware specs, and action links');
        await navigateTo(ctx.router, '/servers/301');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('servers-detail');
    });

    test('order page', async ({ annotate }) => {
        await annotate('Visual Regression: Server order page - displays dedicated server configuration and ordering form');
        await navigateTo(ctx.router, '/servers/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('servers-order');
    });
});
