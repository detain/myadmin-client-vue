// test/visual/backups.visual.ts — Visual regression tests for Backup pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Backup Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: Backups list page - displays service table with backup service entries');
        await navigateTo(ctx.router, '/backups');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('backups-list');
    });

    test('detail page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: Backup detail page - shows individual backup service info and action links');
        await navigateTo(ctx.router, '/backups/701');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('backups-detail');
    });

    test('order page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: Backup order page - displays backup plan selection and ordering form');
        await navigateTo(ctx.router, '/backups/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('backups-order');
    });
});
