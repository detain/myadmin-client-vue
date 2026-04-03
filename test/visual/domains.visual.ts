// test/visual/domains.visual.ts — Visual regression tests for Domain pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Domain Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page', async () => {
        await navigateTo(ctx.router, '/domains');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('domains-list');
    });

    test('detail page', async () => {
        await navigateTo(ctx.router, '/domains/201');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('domains-detail');
    });

    test('order page', async () => {
        await navigateTo(ctx.router, '/domains/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('domains-order');
    });
});
