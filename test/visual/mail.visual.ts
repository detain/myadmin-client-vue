// test/visual/mail.visual.ts — Visual regression tests for Mail pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Mail Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: Mail list page - displays service table with mail service entries');
        await navigateTo(ctx.router, '/mail');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('mail-list');
    });

    test('detail page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: Mail detail page - shows individual mail service info and action links');
        await navigateTo(ctx.router, '/mail/601');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('mail-detail');
    });

    test('order page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: Mail order page - displays mail service plan selection and ordering form');
        await navigateTo(ctx.router, '/mail/order');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('mail-order');
    });
});
