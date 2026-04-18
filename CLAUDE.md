# CLAUDE.md — MyAdmin Client Vue

## Overview

**MyAdmin Client Interface** — Vue 3 + TypeScript SPA for InterServer billing/management. Built with Vite 8 (Rolldown). Deployed to web, desktop (Electron), mobile (Capacitor).

## Commands

```bash
yarn dev              # Dev server (http://localhost:5173)
yarn build            # Type-check + production build
yarn lint             # ESLint auto-fix (.ts, .vue, .js)
yarn format           # Prettier format all files
yarn test             # Vitest unit tests (watch mode)
yarn test:coverage    # Vitest with coverage
yarn test:e2e         # Playwright E2E tests
yarn ts               # Type-check only (vue-tsc --noEmit)
```

**Node:** 20 (`.nvmrc`) · **Package manager:** Yarn (`.yarnrc.yml`)

## Architecture

**Entry**: `src/main.ts` → `src/App.vue` · **Router**: `src/router/index.ts` · **HTML shell**: `index.html`

**Views** (`src/views/`): `vps/` · `domains/` · `webhosting/` · `servers/` · `tickets/` · `billing/` · `billing/affiliates/` · `ssl/` · `licenses/` · `mail/` · `floating_ips/` · `scrub_ips/` · `quickservers/` · `backups/` · `dns/` · `account/` · `users/`

**Components** (`src/components/`): `MainMenu.vue` · `Searchbox.vue` · `ServiceListTable.vue` · `Alert.vue` · `Nav.vue` · `Dialog.vue` · `account/ApiAccess.vue` · `account/SshKeys.vue` · `account/TwoFactorAuth.vue` · `account/AccountFeatures.vue` · `account/IpLimits.vue` · `account/LinkedAccounts.vue` · `services/Cancel.vue` · `services/Invoices.vue` · `services/ServiceActionCardHeader.vue` · `services/view_service/ClientLinks.vue` · `services/view_service/InfoBox.vue`

**Stores** (`src/stores/`): one per domain — `account.store.ts` · `auth.store.ts` · `mail.store.ts` · `floating_ips.store.ts` · `website.store.ts` · `site.store.ts` · `alert.store.ts` · pattern: `use{Domain}Store` via `defineStore`

**Helpers** (`src/helpers/`): `fetchWrapper.ts` (central HTTP client) · `moduleLink.ts` · `ucwords.ts` · `generatePassword.ts` · `useDarkMode.ts` · `useServiceLoading.ts`

**i18n** (`src/i18n/index.ts`): lazy-loaded namespaces from `src/locales/en/vps.json`, `src/locales/en/domains.json`, etc. across 110 locale directories · 40+ languages · English default

**Types**: `src/types/` · **Plugins**: `src/plugins/` (jQuery) · **Mocks**: `src/mocks/` (MSW handlers) · **Assets**: `src/assets/` (CSS, images, webfonts, templates)

**CI/CD** (`.github/workflows/`): `ci-cd.yml` (build, deploy, branch sync), `playwright.yml` (E2E test runner) · **Git Hooks** (`.husky/`): pre-commit and commit-msg hooks via `.husky/_/husky.sh` enforcing lint and conventional commits · **Editor** (`.vscode/extensions.json`): recommended VS Code extensions · **Yarn** (`.yarn/install-state.gz`): PnP install state cache

**Static Files** (`public/`): `favicon.ico`, `.htaccess` (Apache SPA fallback), `mockServiceWorker.js` (MSW service worker for tests) · **Styles** (`src/assets/css/`): `admin_darkmode.css` · `tailwind.min.css` · `view_service.css` · `login.css` · `home_new.css` · `crud_table5.css`, plus `misha-theme/` jQuery UI theme · **Images** (`src/assets/images/`): provider logos (`cpanel.png`, `directadmin.png`, `litespeed.png`, `cloudlinux.png`), subdirectories: `icons/`, `logos/`, `myadmin/`, `crud/`, `vps/`

**MCP integrations**: Playwright browser automation available via `mcp__plugin_playwright_playwright__*` tools for E2E interaction.

## Key Patterns

- **Composition API** with `<script setup lang="ts">` in all `.vue` files
- **`fetchWrapper`** (`src/helpers/fetchWrapper.ts`) — adds `sessionid` or `X-API-KEY` headers; auto-logs out on 401/403; never use raw `fetch` or `axios`
- **Lazy-loaded routes** — `() => import('@/views/...')` with `meta: { i18n: ['namespace'] }`
- **`@` alias** maps to `src/` — use `@/stores/auth.store` not relative paths
- **Admin-LTE + Bootstrap 4** for layout, **Tailwind CSS** (`tailwind.config.js`, `postcss.config.cjs`) for utilities
- **jQuery** for legacy UI (select2, tablesorter) — included via `optimizeDeps.include` in `vite.config.ts`
- **SweetAlert2** (`sweetalert2`) for confirmations and loading dialogs
- **`ServiceListTable`** (`src/components/ServiceListTable.vue`) — reusable list component with sorting, status filtering, export
- Route warmup via `warmFrequentlyUsedRoutes()` and `warmRouteByLocation()` in `src/router/index.ts`

## Code Style

- **Prettier** (`.prettierrc.json`): Print width 9999 · 4 spaces · Single quotes · Semicolons · Trailing commas ES5 · LF · `vueIndentScriptAndStyle: false`
- **ESLint** (`eslint.config.js`): Flat config · TypeScript + Vue plugins · `v-html` allowed · Prefer template literals · Ignores `.claire/**`, `.claude/**`, `dist/`
- **TypeScript** (`tsconfig.json`): Strict mode · ESNext target/module · `allowJs`+`checkJs` · Types: `vite/client`, `vitest/globals`, `jquery`, `node`

## Conventions

- **Views** in `src/views/{domain}/` — list (`{Domain}sList.vue`), view (`View{Domain}.vue`), order (`Order{Domain}.vue`), plus sub-actions
- **Stores** in `src/stores/{domain}.store.ts` — API calls inside actions, not components. All use **Options API** (`state`/`getters`/`actions`), not setup stores
- **Routes** in `src/router/index.ts` — parameterized with `:id(\\d+)`, sub-links via `:link(action1|action2)`
- **i18n** — `$t('key')` in templates, `t('key')` in `<script setup>` via `useI18n()` · Files at `src/locales/en/vps.json`, `src/locales/en/domains.json`, etc. · No `<i18n>` SFC blocks · Use `<i18n-t>` for interpolation with HTML/components
- **Commit messages** follow conventional commits (`@commitlint/config-conventional`)

## Testing

- **Vitest** (`vite.config.ts` test section): tests in `test/` mirroring `src/` · `jsdom` environment · Setup: `test/setup.ts` · MSW mocks: `src/mocks/`
- **Playwright** (`playwright.config.ts`): tests in `e2e/` · Chromium only · Dev server auto-start · 2 retries on CI

```bash
yarn vitest run test/stores/auth.store.spec.ts    # Run single test file
yarn playwright test e2e/ --project=chromium      # Run E2E tests locally
yarn vitest --coverage                            # Coverage report
```

## Build & Deploy

- **Vite 8 + Rolldown** (`vite.config.ts`) — chunks: `framework` (Vue/Pinia/Router/i18n), `legacy-ui` (jQuery/Bootstrap/AdminLTE/Select2), `vendor`, `view-{scope}`
- Plugins: `vite-plugin-checker` (vue-tsc), `vite-plugin-inspect`, `vite-plugin-vue-inspector`, `unplugin-turbo-console`, `vite-plugin-dts`

## Branch Strategy

| Branch | Purpose | Targets |
|--------|---------|--------|
| `master` | Web SPA — primary dev branch | Web |
| `electron` | Desktop (Electron) | Win, macOS, Linux |
| `capacitor` | Mobile (Capacitor) | Android, iOS |

**All dev on `master`.** CI syncs to `electron`/`capacitor`. Do not commit shared code to platform branches.

## Important Rules

- Never use `axios` — always `fetchWrapper`
- Never add `<i18n>` SFC blocks — locales lazy-loaded via `import()`
- Never commit shared code to `electron`/`capacitor`
- `.claude/` and `.claire/` excluded from lint, tests, and Vite watch
- CSP headers configured in `index.html` — update when adding external scripts

## Before Committing

Run `caliber refresh` before creating git commits to keep docs in sync with code changes.
After it completes, stage any modified doc files before committing:

```bash
caliber refresh && git add CLAUDE.md .claude/ .cursor/ AGENTS.md CALIBER_LEARNINGS.md 2>/dev/null
```
## Session Learnings

Read `CALIBER_LEARNINGS.md` for patterns and anti-patterns learned from previous sessions.
These are auto-extracted from real tool usage — treat them as project-specific rules.

<!-- caliber:managed:pre-commit -->
## Before Committing

**IMPORTANT:** Before every git commit, you MUST ensure Caliber syncs agent configs with the latest code changes.

First, check if the pre-commit hook is already installed:
```bash
grep -q "caliber" .git/hooks/pre-commit 2>/dev/null && echo "hook-active" || echo "no-hook"
```

- If **hook-active**: the hook handles sync automatically — just commit normally. Tell the user: "Caliber will sync your agent configs automatically via the pre-commit hook."
- If **no-hook**: run Caliber manually before committing:
  1. Tell the user: "Caliber: Syncing agent configs with your latest changes..."
  2. Run: `/home/my/.nvm/versions/node/v22.22.2/bin/caliber refresh && git add CLAUDE.md .claude/ .cursor/ .cursorrules .github/copilot-instructions.md .github/instructions/ AGENTS.md CALIBER_LEARNINGS.md .agents/ .opencode/ 2>/dev/null`
  3. After it completes, briefly tell the user what Caliber updated. Then proceed with the commit.

If `/home/my/.nvm/versions/node/v22.22.2/bin/caliber` is not found, tell the user: "This project uses Caliber for agent config sync. Run /setup-caliber to get set up."
<!-- /caliber:managed:pre-commit -->

<!-- caliber:managed:learnings -->
## Session Learnings

Read `CALIBER_LEARNINGS.md` for patterns and anti-patterns learned from previous sessions.
These are auto-extracted from real tool usage — treat them as project-specific rules.
<!-- /caliber:managed:learnings -->

<!-- caliber:managed:model-config -->
## Model Configuration

Recommended default: `claude-sonnet-4-6` with high effort (stronger reasoning; higher cost and latency than smaller models).
Smaller/faster models trade quality for speed and cost — pick what fits the task.
Pin your choice (`/model` in Claude Code, or `CALIBER_MODEL` when using Caliber with an API provider) so upstream default changes do not silently change behavior.

<!-- /caliber:managed:model-config -->

<!-- caliber:managed:sync -->
## Context Sync

This project uses [Caliber](https://github.com/caliber-ai-org/ai-setup) to keep AI agent configs in sync across Claude Code, Cursor, Copilot, and Codex.
Configs update automatically before each commit via `/home/my/.nvm/versions/node/v22.22.2/bin/caliber refresh`.
If the pre-commit hook is not set up, run `/setup-caliber` to configure everything automatically.
<!-- /caliber:managed:sync -->
