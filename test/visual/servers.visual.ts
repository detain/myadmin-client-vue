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

    test('list page', async () => {
        await navigateTo(ctx.router, '/servers');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('servers-list');
    });

    test('detail page', async () => {
        await navigateTo(ctx.router, '/servers/301');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('servers-detail');
    });

    test('order page', async () => {
        await navigateTo(ctx.router, '/servers/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('servers-order');
    });
});
