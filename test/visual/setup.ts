// test/visual/setup.ts — Browser-mode MSW setup for visual regression tests
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupWorker } from 'msw/browser';
import { visualHandlers } from './mocks/visualHandlers';

const worker = setupWorker(...visualHandlers);

beforeAll(async () => {
    await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: true,
    });

    // Inject CSS to disable transitions/animations and stabilize layout for consistent screenshots
    const style = document.createElement('style');
    style.id = 'visual-test-overrides';
    style.textContent = `
        *, *::before, *::after {
            transition-duration: 0s !important;
            transition-delay: 0s !important;
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            animation-iteration-count: 1 !important;
        }
        .route-loading-overlay { display: none !important; }
        .content-dimmed { opacity: 1 !important; pointer-events: auto !important; }
        /* Force deterministic body dimensions matching viewport */
        html, body {
            width: 1280px !important;
            min-height: 800px !important;
            overflow: hidden !important;
        }
        /* Hide scrollbar differences across runs */
        ::-webkit-scrollbar { display: none !important; }
        /* Suppress blinking cursors in inputs */
        * { caret-color: transparent !important; }
    `;
    document.head.appendChild(style);

    // Wait for fonts to load for consistent text rendering
    await document.fonts.ready;
});

afterEach(() => {
    worker.resetHandlers();
});

afterAll(() => {
    worker.stop();
    document.getElementById('visual-test-overrides')?.remove();
});
