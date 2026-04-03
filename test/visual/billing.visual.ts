// test/visual/billing.visual.ts — Visual regression tests for Billing pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Billing Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('invoices page', async ({ annotate }) => {
        await annotate('Visual Regression: Billing invoices page - displays invoice list with amounts and payment status');
        await navigateTo(ctx.router, '/invoices');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('billing-invoices');
    });

    test('cart page', async ({ annotate }) => {
        await annotate('Visual Regression: Billing cart page - shows shopping cart with pending order items');
        await navigateTo(ctx.router, '/cart');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('billing-cart');
    });

    test('prepays page', async ({ annotate }) => {
        await annotate('Visual Regression: Billing prepays page - displays prepaid balance and transaction history');
        await navigateTo(ctx.router, '/prepays');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('billing-prepays');
    });

    test('payment types page', async ({ annotate }) => {
        await annotate('Visual Regression: Billing payment types page - shows saved payment methods and options');
        await navigateTo(ctx.router, '/payment_types');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('billing-payment-types');
    });
});
