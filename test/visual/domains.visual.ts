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

    test('list page', async ({ annotate }) => {
        await annotate('Visual Regression: Domains list page - displays service table with registered domain entries');
        await navigateTo(ctx.router, '/domains');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('domains-list');
    });

    test('detail page', async ({ annotate }) => {
        await annotate('Visual Regression: Domain detail page - shows individual domain info, DNS settings, and action links');
        await navigateTo(ctx.router, '/domains/201');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('domains-detail');
    });

    test('order page', async ({ annotate }) => {
        await annotate('Visual Regression: Domain order page - displays domain registration and transfer form');
        await navigateTo(ctx.router, '/domains/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('domains-order');
    });
});
