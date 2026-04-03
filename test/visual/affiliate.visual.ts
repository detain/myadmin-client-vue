// test/visual/affiliate.visual.ts — Visual regression tests for Affiliate pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Affiliate Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('affiliate dashboard', async ({ annotate }) => {
        await annotate('Visual Regression: Affiliate dashboard - shows affiliate program overview with earnings and referral stats');
        await navigateTo(ctx.router, '/affiliate');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('affiliate-dashboard');
    });

    test('FAQ page', async ({ annotate }) => {
        await annotate('Visual Regression: Affiliate FAQ page - displays frequently asked questions about the affiliate program');
        await navigateTo(ctx.router, '/affiliate/faq');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('affiliate-faq');
    });

    test('sales report page', async ({ annotate }) => {
        await annotate('Visual Regression: Affiliate sales report page - shows referral sales data and commission details');
        await navigateTo(ctx.router, '/affiliate/sales_report');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('affiliate-sales-report');
    });

    test('banners page', async ({ annotate }) => {
        await annotate('Visual Regression: Affiliate banners page - displays promotional banner assets and embed codes');
        await navigateTo(ctx.router, '/affiliate/banners');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('affiliate-banners');
    });
});
