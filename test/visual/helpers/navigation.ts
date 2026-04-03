// test/visual/helpers/navigation.ts — Route navigation utilities for visual tests
import type { Router } from 'vue-router';

/**
 * Navigate to a route and wait for the page to stabilize.
 * Waits for router readiness, loading overlay to clear, and content to render.
 */
export async function navigateTo(router: Router, path: string): Promise<void> {
    await router.push(path);
    await router.isReady();

    // Wait for any pending async operations and Vue rendering
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Wait for content to appear in the content wrapper
    await waitForSelector('.content-wrapper', 5000);

    // Extra settle time for lazy-loaded components
    await new Promise((resolve) => setTimeout(resolve, 300));
}

/** Poll until a selector is present in the DOM */
async function waitForSelector(selector: string, timeout: number): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (document.querySelector(selector)) return;
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
}
