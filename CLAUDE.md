# CLAUDE.md — MyAdmin Client Vue

## Overview

**MyAdmin Client** — Vue 3 + TypeScript SPA for InterServer billing/hosting management. Built with Vite 8 (Rolldown). Web (`master`), desktop (`electron`), mobile (`capacitor`). Package: `my-interserver-client`.

## Commands

```bash
yarn dev              # Dev server at http://localhost:5173
yarn build            # vue-tsc --noEmit && vite build
yarn lint             # ESLint auto-fix (.ts,.vue,.js,.jsx,.cjs,.mjs)
yarn format           # Prettier write
yarn ts               # vue-tsc --noEmit only
yarn test             # Vitest watch (jsdom)
yarn test:coverage    # vitest run --coverage
yarn test:browser     # vitest --config=vitest.browser.config.ts (Playwright)
yarn test:visual      # vitest --config=vitest.visual.config.ts (pixelmatch)
yarn test:e2e         # playwright test --workers=1
```

```bash
yarn vitest run test/stores/auth.store.spec.ts                   # single Vitest file
yarn playwright test e2e/ --project=chromium                     # E2E mocked
yarn playwright test e2e/real/ --project=real                    # E2E real auth
```

```bash
caliber refresh && git add CLAUDE.md .claude/ .cursor/ AGENTS.md CALIBER_LEARNINGS.md 2>/dev/null   # sync agent configs before commit
yarn build && yarn test:e2e                                                                          # full pre-deploy check
```

**Node** 20 (`.nvmrc`) · **Yarn** node-modules linker (`.yarnrc.yml`) · **Commits** `@commitlint/config-conventional`

## Architecture

**Entry**: `src/main.ts` → `src/App.vue` mounts `<RouterView>` inside Admin-LTE shell · **Router**: `src/router/index.ts` · **HTML shell**: `index.html` (CSP headers) · **Vite config**: `vite.config.ts` (Rolldown, `@` → `src/`) · **TS config**: `tsconfig.json` (strict, ESNext, `vite/client`, `vitest/globals`, `jquery`, `node` types) · **Editor config**: `.vscode/` (contains `extensions.json` for recommended extensions and `settings.json` for workspace overrides)

**Views** (`src/views/`): `vps/` (`VpsList.vue`, `ViewVps.vue`, `OrderVps.vue`, `Backup.vue`, `Backups.vue`, `Restore.vue`, `Slices.vue`, `Vnc.vue`, `SetupVnc.vue`, `Slices.vue`, `TrafficUsage.vue`, `ReinstallOs.vue`, `ResetPassword.vue`, `ChangeHostname.vue`, `ChangeRootPassword.vue`, `ChangeTimezone.vue`, `ChangeWebuzoPassword.vue`, `InsertCd.vue`, `BuyHdSpace.vue`, `BuyIp.vue`, `ReverseDns.vue`) · `domains/` (`DomainsList.vue`, `ViewDomain.vue`, `OrderDomain.vue`, `Nameservers.vue`, `Renew.vue`, `Transfer.vue`, `Whois.vue`, `Dnssec.vue`, `Contact.vue`) · `webhosting/` (`WebsitesList.vue`, `ViewWebsite.vue`, `OrderWebsite.vue`, `BuyIp.vue`, `DownloadBackups.vue`, `Migration.vue`, `ReverseDns.vue`) · `servers/` (`ServersList.vue`, `ViewServer.vue`, `OrderServer.vue`, `OrderDedicated.vue`, `BandwidthGraph.vue`, `IpmiLive.vue`, `ReverseDns.vue`) · `quickservers/` · `scrub_ips/` (`Filters.vue`, `FirewallRules.vue`, `GeoFirewallRules.vue`) · `licenses/` (`ChangeIp.vue`, `ChangeOs.vue`) · `mail/` (`Alerts.vue`, `DenyRules.vue`, `Stats.vue`, `Logs.vue`, `Deliverability.vue`) · `floating_ips/` (`ChangeIp.vue`) · `ssl/` (`ChangeApproverEmail.vue`) · `tickets/` (`TicketsList.vue`, `NewTicket.vue`, `ViewTicket.vue`) · `backups/` · `dns/` (`DnsManager.vue`, `DnsEditor.vue`) · `billing/` (`Cart.vue`, `InvoicesList.vue`, `PaymentTypes.vue`, `PaymentSuccess.vue`, `PrePays.vue`) · `billing/affiliates/` (12 pages) · `account/` (`ContactInfo.vue`, `ChangePass.vue`, `ChangeUsername.vue`, `AccountSettings.vue`) · `users/` (`List.vue`, `AddEdit.vue`) · plus `Home.vue`, `ClientHome.vue`, `Login.vue`, `LoginOld.vue`, `Register.vue`, `Sudo.vue`

**Components** (`src/components/`): `MainMenu.vue` · `Searchbox.vue` · `ServiceListTable.vue` · `Alert.vue` · `Nav.vue` · `Dialog.vue` · `account/{ApiAccess,SshKeys,TwoFactorAuth,AccountFeatures,IpLimits,LinkedAccounts}.vue` · `services/{Cancel,Invoices,ServiceActionCardHeader}.vue` · `services/view_service/{ClientLinks,InfoBox}.vue`

**Stores** (`src/stores/`, one per domain): `auth.store.ts` · `account.store.ts` · `site.store.ts` · `alert.store.ts` · `users.store.ts` · `vps.store.ts` · `domain.store.ts` · `website.store.ts` · `server.store.ts` · `ssl.store.ts` · `qs.store.ts` · `mail.store.ts` · `license.store.ts` · `floating_ips.store.ts` · `backup.store.ts` — all Options-API `defineStore('id', { state, getters, actions })`, exported as `use{Domain}Store`

**Helpers** (`src/helpers/`): `fetchWrapper.ts` (central HTTP — adds `sessionid` or `X-API-KEY`, auto-logs out on 401/403) · `moduleLink.ts` (module→path map: `webhosting`→`websites`, `quickservers`→`qs`) · `useDarkMode.ts` · `useServiceLoading.ts` · `generatePassword.ts` · `ucwords.ts` · `snakeToCamel.ts`

**i18n** (`src/i18n/index.ts`): `createI18n({ legacy: false })` with lazy `loadLocaleMessages(locale, namespace)` from `src/locales/{locale}/{namespace}.json` — 110 locale dirs, 21 namespaces (`common`, `dashboard`, `account`, `affiliate`, `backups`, `billing`, `dns`, `domains`, `floating_ips`, `licenses`, `login`, `mail`, `quickservers`, `scrub_ips`, `servers`, `ssl`, `tickets`, `users`, `validation`, `vps`, `webhosting`). English (`en/`) is source of truth. Browser locale resolved via `resolveAppLocale()` / `getBrowserPreferredLocales()`.

**Mocks** (`src/mocks/`): MSW handlers · service worker at `public/mockServiceWorker.js` · visual mocks at `test/visual/mocks/visualHandlers.ts`

**Plugins** (`src/plugins/jquery.ts`): jQuery + select2 + tablesorter wiring · **Assets** (`src/assets/`): `css/{admin_darkmode,tailwind.min,view_service,login,home_new,crud_table5}.css` + `misha-theme/`, `images/` (cpanel/directadmin/litespeed/cloudlinux logos + `icons/`, `logos/`, `myadmin/`, `crud/`, `vps/`), `webfonts/`

**CI/CD**: `.github/workflows/ci-cd.yml` (build/deploy/branch sync), `.github/workflows/playwright.yml` (E2E) · **Hooks**: `.husky/` pre-commit (lint) + commit-msg (commitlint) · **MCP**: Playwright via `mcp__plugin_playwright_playwright__*` for browser automation

## Key Patterns

- **Composition API** with `<script setup lang="ts">` everywhere · pair with `<script lang="ts">` `export default { name }` block (test mount selectors)
- **`fetchWrapper`** from `@/helpers/fetchWrapper` — never `axios` (still in `package.json` as legacy), never raw `fetch`
- **Lazy routes** — `() => import('../views/...')` with `meta: { i18n: ['namespace'] }`, relative `../views/` path is convention in `src/router/index.ts`
- **`@` alias** → `src/` (`vite.config.ts` + `tsconfig.json` paths)
- **Route shape**: `:id(\\d+)` numeric ID + `:link(action1|action2|...)` enum for sub-actions on per-service view components
- **`ServiceListTable`** (`src/components/ServiceListTable.vue`) for all list pages — define `ServiceListColumn[]`
- **Route warmup**: `warmFrequentlyUsedRoutes()` + `warmRouteByLocation()` called from `src/App.vue` `onMounted`
- **SweetAlert2** for confirmations (`Swal.fire`) · **Admin-LTE 3 + Bootstrap 4** layout · **Tailwind** for utilities (`tailwind.config.js`, `postcss.config.cjs`)
- **LaunchDarkly** observability + session replay registered in `src/main.ts`

## Code Style

- **Prettier** (`.prettierrc.json`): printWidth `9999` · `tabWidth: 4` · single quotes · semis · `trailingComma: 'es5'` · LF · `vueIndentScriptAndStyle: false`
- **ESLint** (`eslint.config.js`): flat config · TS + Vue plugins · `prefer-template: error` · `no-useless-concat: error` · `vue/no-v-html: off` · `vue/multi-word-component-names: off` · ignores `.claire/**`, `.claude/**`, `dist/**`, `html/**`
- **TS** (`tsconfig.json`): `strict: true` · `allowJs` + `checkJs` · `noFallthroughCasesInSwitch` · types include `vitest/globals`

## Build & Deploy

- **Vite 8 + Rolldown** (`vite.config.ts`) chunks: `framework`, `legacy-ui`, `vendor`, `view-{scope}` per `src/views/{scope}/`
- Plugins: `@vitejs/plugin-vue` · `vite-plugin-checker` (vueTsc) · `vite-plugin-dts` (dev) · `vite-plugin-inspect` · `vite-plugin-vue-inspector` · `unplugin-turbo-console`
- `optimizeDeps.include: ['jquery', 'select2']` · `optimizeDeps.exclude: ['playwright', 'playwright-core', 'chromium-bidi']`

## Branch Strategy

| Branch | Targets |
|--------|---------|
| `master` | Web SPA — primary dev |
| `electron` | Desktop (Win/macOS/Linux) — CI-synced |
| `capacitor` | Mobile (Android/iOS) — CI-synced |

All dev on `master`. Never commit shared code to `electron`/`capacitor` directly.

## Important Rules

- Never use `axios` — always `fetchWrapper`
- Never add `<i18n>` SFC blocks — locales lazy-loaded via `loadLocaleMessages()`
- All Pinia stores use Options API (`state`/`getters`/`actions`), never setup stores
- Update `index.html` CSP when adding external script/connect sources
- `.claude/` and `.claire/` excluded from lint, tests, Vite watch (see `eslint.config.js`, `vite.config.ts`, `vitest.visual.config.ts`)
- See `CALIBER_LEARNINGS.md` for auto-extracted session patterns (e.g., `<i18n-t>` for interpolation, `el.scrollIntoView?.()` for jsdom)

@./CALIBER_LEARNINGS.md

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
  2. Run: `caliber refresh && git add CALIBER_LEARNINGS.md CLAUDE.md .claude/ 2>/dev/null`
  3. After it completes, briefly tell the user what Caliber updated. Then proceed with the commit.

**Valid `caliber refresh` options:** `--quiet` (suppress output) and `--dry-run` (preview without writing). Do not pass any other flags — options like `--auto-approve`, `--debug`, or `--force` do not exist and will cause errors.

**`caliber config`** takes no flags — it runs an interactive provider setup. Do not pass `--provider`, `--api-key`, or `--endpoint`.

If `caliber` is not found, tell the user: "This project uses Caliber for agent config sync. Run /setup-caliber to get set up."
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
Configs update automatically before each commit via `caliber refresh`.
If the pre-commit hook is not set up, run `/setup-caliber` to configure everything automatically.
<!-- /caliber:managed:sync -->
