// test/visual/tickets.visual.ts — Visual regression tests for Ticket pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Ticket Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page', async ({ annotate }) => {
        await annotate('Visual Regression: Tickets list page - displays support ticket table with status and priority');
        await navigateTo(ctx.router, '/tickets');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('tickets-list');
    });

    test('new ticket page', async ({ annotate }) => {
        await annotate('Visual Regression: New ticket page - shows support ticket creation form with subject and category fields');
        await navigateTo(ctx.router, '/tickets/new');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('tickets-new');
    });

    test('ticket detail page', async ({ annotate }) => {
        await annotate('Visual Regression: Ticket detail page - shows ticket conversation thread with reply form');
        await navigateTo(ctx.router, '/tickets/1');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('tickets-detail');
    });
});
