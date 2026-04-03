// test/visual/scrub-ips.visual.ts — Visual regression tests for Scrub IP pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Scrub IP Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('list page renders correctly', async () => {
        await navigateTo(ctx.router, '/scrub_ips');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('scrub-ips-list');
    });

    test('detail page renders correctly', async () => {
        await navigateTo(ctx.router, '/scrub_ips/1101');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('scrub-ips-detail');
    });
});
