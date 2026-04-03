// test/visual/dns.visual.ts — Visual regression tests for DNS pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('DNS Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('manager page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: DNS manager page - displays DNS zone list with domain entries');
        await navigateTo(ctx.router, '/dns');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('dns-manager');
    });

    test('editor page renders correctly', async ({ annotate }) => {
        await annotate('Visual Regression: DNS editor page - shows DNS record editor with zone records table');
        await navigateTo(ctx.router, '/dns/101');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('dns-editor');
    });
});
