---
paths:
  - test/**
  - e2e/**
  - src/mocks/**
---

# Testing

- **Vitest** config in `vite.config.ts` `test` section: `jsdom` environment, `globals: true`, setup `test/setup.ts`, excludes `.claire/**`, `.claude/**`, `e2e/**`. Files mirror `src/` under `test/` (`test/stores/`, `test/views/`, `test/components/`, `test/helpers/`, `test/router/`, `test/i18n/`).
- **Browser tests** (`vitest.browser.config.ts`): `@vitest/browser-playwright` provider, Chromium.
- **Visual tests** (`vitest.visual.config.ts`): `test/visual/*.visual.ts`, `pixelmatch` (threshold 0.2, allowedMismatchedPixelRatio 0.02), 1280x800 viewport. Bootstrap via `test/visual/helpers/createVisualApp.ts` (`createVisualApp()` mounts full app with seeded auth + site stores).
- **Playwright** (`playwright.config.ts`): `e2e/` directory, `baseURL` http://localhost:5173, `chromium` project for mocked tests, `real` project for `e2e/real/*.spec.ts` (uses `TEST_USERNAME`/`TEST_PASSWORD`/`TEST_SESSION_ID`/`TEST_API_KEY` from `.env.local`). CI: `workers: 1`, `retries: 2`.
- **MSW mocks** in `src/mocks/` (production handlers) + `test/visual/mocks/visualHandlers.ts` (visual-only). Service worker bundle at `public/mockServiceWorker.js`.
- Mount components with `@vue/test-utils` `mount()`. Use `createTestingPinia({ initialState })` from `@pinia/testing` to stub stores.
- Always guard `el.scrollIntoView?.({ block: 'nearest' })` — not in jsdom.
- `yarn test` exits non-zero with "Vite server" warning even on pass — verify the `Tests N passed` line, not the exit code (per `CALIBER_LEARNINGS.md`).
