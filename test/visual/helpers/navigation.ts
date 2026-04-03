// test/visual/helpers/navigation.ts — Route navigation utilities for visual tests
import type { Router } from 'vue-router';

/**
 * Navigate to a route and wait for the page to stabilize.
 * Waits for router readiness, loading overlay to clear, and content to render.
 */
export async function navigateTo(router: Router, path: string): Promise<void> {
    await router.push(path);
    await router.isReady();

    // Wait for Vue to flush pending renders
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Wait for content to appear in the content wrapper
    await waitForSelector('.content-wrapper', 5000);

    // Wait for lazy-loaded components and async data to settle
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Force a layout reflow to ensure dimensions are finalized
    document.body.getBoundingClientRect();
    await new Promise((resolve) => setTimeout(resolve, 200));
}

/** Poll until a selector is present in the DOM */
async function waitForSelector(selector: string, timeout: number): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (document.querySelector(selector)) return;
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
}
