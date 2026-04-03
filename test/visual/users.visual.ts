// test/visual/users.visual.ts — Visual regression tests for User Management pages
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { page } from 'vitest/browser';
import { createVisualApp, type VisualAppContext } from './helpers/createVisualApp';
import { navigateTo } from './helpers/navigation';

describe('User Management Pages', () => {
    let ctx: VisualAppContext;

    beforeAll(async () => {
        ctx = await createVisualApp();
    });

    afterAll(() => ctx.cleanup());

    test('users list page', async () => {
        await navigateTo(ctx.router, '/users');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('users-list');
    });

    test('add user page', async () => {
        await navigateTo(ctx.router, '/users/add');
        await expect(page.elementLocator(document.body)).toMatchScreenshot('users-add');
    });
});
