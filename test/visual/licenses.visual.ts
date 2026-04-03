// test/visual/licenses.visual.ts — Visual regression tests for License pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('License Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page', async () => {
        await navigateTo(ctx.router, '/licenses');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('licenses-list');
    });

    test('detail page', async () => {
        await navigateTo(ctx.router, '/licenses/401');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('licenses-detail');
    });

    test('order page', async () => {
        await navigateTo(ctx.router, '/licenses/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('licenses-order');
    });
});
