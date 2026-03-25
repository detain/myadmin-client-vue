# CLAUDE.md — MyAdmin Client Vue

## Project Overview

**MyAdmin Client Interface** — a Vue 3 + TypeScript SPA for the InterServer billing and management platform. Built with Vite (Rolldown), deployed across web, desktop (Electron), mobile (Android/iOS), and Linux packages.

## Quick Reference

```bash
yarn dev              # Dev server with CORS (http://localhost:5173)
yarn build            # Type-check + production build
yarn lint             # ESLint with auto-fix (.ts, .vue, .js)
yarn format           # Prettier format all files
yarn format:check     # Check formatting without writing
yarn test             # Vitest unit tests (watch mode)
yarn test:coverage    # Vitest with coverage report
yarn test:e2e         # Playwright end-to-end tests
yarn ts               # Type-check only (vue-tsc --noEmit)
```

**Node version:** 20 (see `.nvmrc`). **Package manager:** Yarn.

## Architecture

### Directory Structure

```
src/
├── views/              # Route-based page components (lazy-loaded)
├── components/         # Reusable UI components
├── stores/             # Pinia stores (one per service domain)
├── router/             # Vue Router config with route guards
├── helpers/            # Utility functions (fetchWrapper, etc.)
├── types/              # TypeScript interfaces and type definitions
├── i18n/               # Internationalization setup
├── locales/            # Translation JSON files (40+ languages)
├── plugins/            # Vue plugins (jQuery integration)
├── mocks/              # MSW mock handlers for testing
└── assets/             # CSS, images, webfonts
```

### Key Patterns

- **Composition API** with `<script setup>` in all components
- **Pinia** for state management — each service domain has its own store (e.g., `vps.store.ts`, `domain.store.ts`)
- **Lazy-loaded routes** — views are dynamically imported via `() => import('@/views/...')`
- **`fetchWrapper`** (`src/helpers/fetchWrapper.ts`) — central HTTP client; adds `sessionid` or `X-API-KEY` headers; auto-logs out on 401/403
- **Admin-LTE + Bootstrap 4** for layout, **Tailwind CSS** for utility styling
- **jQuery** is used for legacy UI components (select2, tablesorter, datepickers)

### Path Alias

`@` maps to `src/` — use `@/stores/auth.store` not relative paths from views.

### API

- Backend API base URL is configured via `.env.local`
- All API calls go through `fetchWrapper` — never use raw `fetch` or `axios` directly
- Auth is session-based (`sessionId` in localStorage) or API key-based (`X-API-KEY` header)

### State Management

Stores follow this pattern:
- File: `src/stores/{domain}.store.ts`
- Export: `use{Domain}Store` (e.g., `useVpsStore`, `useAuthStore`)
- Auth persistence: `sessionId`, `user`, and `remember` flag stored in localStorage

## Code Style

### Formatting (Prettier)

- **Print width:** 9999 (effectively single-line preference)
- **Indent:** 4 spaces, no tabs
- **Quotes:** Single quotes
- **Semicolons:** Required
- **Trailing commas:** ES5
- **Arrow parens:** Always
- **Line endings:** LF
- **Vue:** No script/style indentation (`vueIndentScriptAndStyle: false`)

### Linting (ESLint)

- Flat config (`eslint.config.js`) with TypeScript and Vue plugins
- Strict TypeScript rules enabled
- `v-html` is allowed (rule disabled)
- Prefer template literals over string concatenation
- Ignore patterns: `.claire/**`, `.claude/**`, `dist/`, `node_modules/`

### TypeScript

- **Strict mode** enabled in `tsconfig.json`
- Target: ESNext, Module: ESNext
- `allowJs` and `checkJs` are enabled
- `noUnusedLocals` and `noUnusedParameters` are **off**
- Types include: `vite/client`, `vitest/globals`, `jquery`, `node`

## Conventions

### Components

- Use **Single File Components** (`.vue`) with `<script setup lang="ts">`
- Feature-based folder organization under `views/` and `components/`
- Route components go in `views/`, shared UI goes in `components/`

### Stores

- One store per service domain in `src/stores/`
- Named exports using `defineStore` with `use{Domain}Store` convention
- Keep API calls inside store actions, not in components

### Routing

- Routes defined in `src/router/index.ts`
- Use parameterized routes with regex validation (e.g., `:id(\\d+)`)
- Protect routes with `beforeEnter` guards
- Always lazy-load view components

### Internationalization

- English is the default/fallback locale
- Translation files: `src/locales/{lang}/common.json`
- Use `$t('key')` in templates, `t('key')` in `<script setup>`
- 40+ languages supported with lazy loading

## Testing

### Unit Tests (Vitest)

- Test files in `test/` directory mirroring `src/` structure
- Uses `jsdom` environment with global test APIs
- Setup file: `test/setup.ts`
- Mock data via MSW (Mock Service Worker) in `src/mocks/handlers.ts`
- Run: `yarn test` (watch) or `yarn test:coverage` (with coverage)

### E2E Tests (Playwright)

- Test files in `e2e/` directory
- Configured for Chromium
- Auto-starts dev server on `http://localhost:5173`
- Run: `yarn test:e2e`
- 2 retries on CI, 0 locally

## Branch Strategy

### Three long-lived branches

| Branch | Purpose | Platform targets |
|--------|---------|-----------------|
| `master` | Web SPA — the primary development branch | Web |
| `electron` | Desktop app via Electron | Windows, macOS, Linux (AppImage, deb, Snap) |
| `capacitor` | Mobile app via Capacitor | Android, iOS |

### Automatic master sync

**All development happens on `master`.** The `electron` and `capacitor` branches automatically receive master updates via CI. On every push to `master`, a GitHub Actions job (`sync-release-branches` in `ci-cd.yml`):

1. Checks out each branch (`electron`, `capacitor`)
2. Merges `origin/master` with `--no-ff -Xignore-space-change`
3. If the only conflict is `yarn.lock`, it auto-resolves by running `yarn` and committing
4. Pushes the merged branch, then triggers the platform-specific build pipeline

**Do not commit shared app code directly to `electron` or `capacitor`.** Make changes on `master` and let CI propagate them. Only platform-specific code belongs on those branches:

- **`electron` branch extras:** Electron main process, `electron-builder` config, system tray integration (`src/helpers/useElectronTray.ts`), auto-updater, `resources/icon.png`, `vitest.config.ts`, `tsconfig.web.json`
- **`capacitor` branch extras:** Capacitor config, native plugin wrappers, platform-specific `vite.config.ts` adjustments, ESLint overrides for Capacitor TypeScript files

### CI/CD pipeline

- **Push to `master`:** runs tests + lint + coverage, then syncs `electron` and `capacitor` branches, then triggers their builds
- **Push to `electron`/`capacitor`:** triggers platform-specific build only (no tests — those run on master)
- **Pull requests** to any of the three branches run the test suite
- Workflow dispatch allows manually triggering `electron` or `capacitor` builds

## Build & Deployment

- **Vite 8 with Rolldown** for bundling
- Manual chunks: `framework` (Vue/Pinia/Router/i18n), `legacy-ui` (jQuery/Bootstrap/AdminLTE/Select2), `vendor` (other node_modules), `view-{scope}` (per-view code splitting)
- Source maps disabled in production
- Module preload polyfill enabled

## Important Notes

- **Do not use `axios` directly** — always use `fetchWrapper`
- **Do not add `<i18n>` SFC blocks** — locales are lazy-loaded via dynamic `import()`
- **Do not commit shared code to `electron` or `capacitor`** — commit to `master` and let CI sync
- The `.claude/` and `.claire/` directories are excluded from linting, test discovery, and Vite watching
- jQuery is included via `optimizeDeps.include` for Vite compatibility
- Commit messages follow conventional commits (`@commitlint/config-conventional` is a dependency)
