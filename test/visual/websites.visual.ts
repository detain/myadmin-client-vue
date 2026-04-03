// test/visual/websites.visual.ts — Visual regression tests for Web Hosting pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Web Hosting Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page', async () => {
        await navigateTo(ctx.router, '/websites');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('websites-list');
    });

    test('detail page', async () => {
        await navigateTo(ctx.router, '/websites/801');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('websites-detail');
    });

    test('order page', async () => {
        await navigateTo(ctx.router, '/websites/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('websites-order');
    });
});
