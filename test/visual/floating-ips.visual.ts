// test/visual/floating-ips.visual.ts — Visual regression tests for Floating IP pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Floating IP Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page renders correctly', async () => {
        await navigateTo(ctx.router, '/floating_ips');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('floating-ips-list');
    });

    test('detail page renders correctly', async () => {
        await navigateTo(ctx.router, '/floating_ips/1001');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('floating-ips-detail');
    });

    test('order page renders correctly', async () => {
        await navigateTo(ctx.router, '/floating_ips/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('floating-ips-order');
    });
});
