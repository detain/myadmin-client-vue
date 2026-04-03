// test/visual/dashboard.visual.ts — Visual regression tests for dashboard
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('Dashboard', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('home page', async () => {
        await navigateTo(ctx.router, '/');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('dashboard-home');
    });
});
