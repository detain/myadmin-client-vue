// test/visual/vps.visual.ts — Visual regression tests for VPS pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('VPS Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page', async () => {
        await navigateTo(ctx.router, '/vps');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('vps-list');
    });

    test('detail page', async () => {
        await navigateTo(ctx.router, '/vps/101');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('vps-detail');
    });

    test('order page', async () => {
        await navigateTo(ctx.router, '/vps/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('vps-order');
    });
});
