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

    test('list page', async ({ annotate }) => {
        await annotate('Visual Regression: Licenses list page - displays service table with software license entries');
        await navigateTo(ctx.router, '/licenses');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('licenses-list');
    });

    test('detail page', async ({ annotate }) => {
        await annotate('Visual Regression: License detail page - shows individual license info, key, and action links');
        await navigateTo(ctx.router, '/licenses/401');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('licenses-detail');
    });

    test('order page', async ({ annotate }) => {
        await annotate('Visual Regression: License order page - displays license type selection and ordering form');
        await navigateTo(ctx.router, '/licenses/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('licenses-order');
    });
});
