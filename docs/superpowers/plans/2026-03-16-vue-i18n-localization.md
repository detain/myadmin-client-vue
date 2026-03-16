# Vue i18n Localization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up vue-i18n across the entire MyAdmin Vue 3 app with Composition API, route-level lazy loading, build optimizations, and proper pluralization/datetime/number formatting — extracting all hardcoded strings from 147 Vue components into domain-split locale files.

**Architecture:** Route-level lazy loading via router `beforeEach` guard. `common` namespace loaded at boot, domain namespaces loaded on navigation. Components use `useI18n()` composable exclusively (no `$t` injection). Build optimized with runtime-only vue-i18n bundle.

**Tech Stack:** Vue 3, TypeScript, vue-i18n (latest), @intlify/unplugin-vue-i18n, Vite 8, Pinia

**Spec:** `docs/superpowers/specs/2026-03-16-vue-i18n-localization-design.md`

---

## File Map

### New Files
- `src/i18n/index.ts` — i18n instance, `loadLocaleMessages()` helper, datetime/number format configs
- `src/locales/en/common.json` — shared strings: menu labels, buttons, table headers, footer
- `src/locales/en/validation.json` — form validation messages
- `src/locales/en/login.json` — Login, Register, Forgot Password, 2FA, OAuth strings
- `src/locales/en/dashboard.json` — ClientHome page strings
- `src/locales/en/account.json` — Account settings, change pass/username, contact info, API, SSH, 2FA
- `src/locales/en/domains.json` — Domain list, order, view, sub-views
- `src/locales/en/vps.json` — VPS list, order, view, all action views
- `src/locales/en/servers.json` — Server list, order, view
- `src/locales/en/websites.json` — Webhosting list, order, view
- `src/locales/en/mail.json` — Mail list, order, view
- `src/locales/en/licenses.json` — License list, order, view
- `src/locales/en/ssl.json` — SSL list, order, view
- `src/locales/en/backups.json` — Backup list, order, view
- `src/locales/en/dns.json` — DNS manager, DNS editor
- `src/locales/en/floating_ips.json` — Floating IPs list, order, view
- `src/locales/en/scrub_ips.json` — Scrub IPs list, view
- `src/locales/en/quickservers.json` — Quick servers list, order, view
- `src/locales/en/billing.json` — Cart, invoices, payment types, prepays, pay
- `src/locales/en/tickets.json` — Ticket list, new ticket, view ticket
- `src/locales/en/users.json` — User list, add/edit
- `src/locales/en/affiliate.json` — All affiliate sub-views

### Modified Files
- `package.json` — pin vue-i18n and @intlify/unplugin-vue-i18n versions
- `vite.config.ts` — add intlify plugin and vue-i18n resolve alias
- `src/main.ts` — register i18n plugin, pre-load common namespace
- `src/router/index.ts` — add `meta.i18n` to all routes, add locale loading in beforeEach guard
- `test/setup.ts` — provide i18n instance for component tests
- `src/App.vue` — replace hardcoded strings with `t()` calls
- `src/components/MainMenu.vue` — convert menu data to computed with `t()` keys
- `src/components/*.vue` — all shared components (Alert, Searchbox, Nav, ServiceListTable, Dialog, etc.)
- `src/components/account/*.vue` — AccountFeatures, ApiAccess, IpLimits, LinkedAccounts, SshKeys, TwoFactorAuth
- `src/components/services/*.vue` — Alert, Cancel, Invoices, ServiceActionCardHeader
- `src/components/services/view_service/*.vue` — Billing, ClientLinks, InfoBox, Package
- `src/views/**/*.vue` — all 120+ view components across all domains

### Removed Files
- `src/locales/home.en.json` — replaced by new namespace structure

---

## Chunk 1: Infrastructure Setup

### Task 1: Install dependencies and configure Vite

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`

- [ ] **Step 1: Install vue-i18n and intlify plugin**

```bash
cd F:/dev/myadmin-client-vue/.claude/worktrees/jolly-pasteur
npm install vue-i18n@latest
npm install -D @intlify/unplugin-vue-i18n
```

- [ ] **Step 2: Add intlify plugin and vue-i18n alias to vite.config.ts**

Add import at top:
```ts
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { dirname, resolve } from 'node:path';
```

Add to plugins array (after `vue()`):
```ts
VueI18nPlugin({
    include: [resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**')],
}),
```

Add to resolve.alias:
```ts
'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
```

Add `vue-i18n` to the framework chunk in `manualChunks`:
```ts
if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router') || id.includes('vue-i18n')) {
    return 'framework';
}
```

- [ ] **Step 3: Verify build doesn't break**

```bash
npx vue-tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.ts
git commit -m "feat: add vue-i18n and intlify vite plugin"
```

---

### Task 2: Create i18n instance and loader

**Files:**
- Create: `src/i18n/index.ts`

- [ ] **Step 1: Create the i18n module**

Create `src/i18n/index.ts`:

```ts
import { createI18n } from 'vue-i18n';
import type { I18n, I18nOptions } from 'vue-i18n';

type MessageSchema = Record<string, unknown>;

const datetimeFormats: I18nOptions['datetimeFormats'] = {
    en: {
        short: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        },
        long: {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        },
        dateOnly: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
        timeOnly: {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        },
    },
};

const numberFormats: I18nOptions['numberFormats'] = {
    en: {
        currency: {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        },
        decimal: {
            style: 'decimal',
            minimumFractionDigits: 2,
        },
        percent: {
            style: 'percent',
            minimumFractionDigits: 0,
        },
    },
};

const i18n = createI18n<[MessageSchema], 'en'>({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    globalInjection: false,
    missingWarn: import.meta.env.DEV,
    fallbackWarn: import.meta.env.DEV,
    datetimeFormats,
    numberFormats,
});

const loadedNamespaces = new Set<string>();

export async function loadLocaleMessages(locale: string, namespace: string): Promise<void> {
    const key = `${locale}:${namespace}`;
    if (loadedNamespaces.has(key)) {
        return;
    }

    try {
        const messages = await import(`../locales/${locale}/${namespace}.json`);
        i18n.global.mergeLocaleMessage(locale, { [namespace]: messages.default });
        loadedNamespaces.add(key);
    } catch (error) {
        console.error(`[i18n] Failed to load namespace "${namespace}" for locale "${locale}"`, error);
    }
}

export async function loadCommonMessages(): Promise<void> {
    await loadLocaleMessages('en', 'common');
}

export default i18n;
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/index.ts
git commit -m "feat: create i18n instance with datetime/number formats and lazy loader"
```

---

### Task 3: Create common and validation locale files

**Files:**
- Create: `src/locales/en/common.json`
- Create: `src/locales/en/validation.json`
- Remove: `src/locales/home.en.json`

- [ ] **Step 1: Create `src/locales/en/common.json`**

This file contains all shared strings used across multiple components. Extract from: MainMenu.vue, App.vue, Nav.vue, Searchbox.vue, ServiceListTable.vue, and shared patterns across all views. The keys below are comprehensive — extracted from reading all components.

```json
{
    "menu": {
        "dashboard": "Dashboard",
        "domains": "Domains",
        "dnsManager": "DNS Manager",
        "vps": "VPS",
        "storage": "Storage",
        "mail": "Mail",
        "licenses": "Licenses",
        "webhosting": "Webhosting",
        "floatingIps": "Floating IPs",
        "scrubIps": "Scrub IPs",
        "rapidDeployServers": "Rapid Deploy Servers",
        "servers": "Servers",
        "affiliateSystem": "Affiliate System",
        "tickets": "Tickets",
        "billing": "Billing",
        "settings": "Settings",
        "cart": "Cart",
        "viewInvoices": "View Invoices",
        "creditCards": "Credit Cards",
        "prePaidFunds": "Pre-Paid Funds / Credit",
        "accountSettings": "Account Settings",
        "changeLogin": "Change Login",
        "changePassword": "Change Password"
    },
    "nav": {
        "home": "Home",
        "bugsSuck": "Bugs Suck",
        "users": "Users",
        "logout": "Logout"
    },
    "buttons": {
        "save": "Save",
        "cancel": "Cancel",
        "delete": "Delete",
        "edit": "Edit",
        "update": "Update",
        "submit": "Submit",
        "close": "Close",
        "confirm": "Confirm",
        "back": "Back",
        "next": "Next",
        "order": "Order",
        "orderNow": "Order Now",
        "add": "Add",
        "remove": "Remove",
        "search": "Search",
        "reset": "Reset",
        "refresh": "Refresh",
        "download": "Download",
        "upload": "Upload",
        "copy": "Copy",
        "print": "Print",
        "enable": "Enable",
        "disable": "Disable",
        "start": "Start",
        "stop": "Stop",
        "restart": "Restart",
        "viewAll": "View All",
        "copyToClipboard": "Copy to Clipboard",
        "addToCart": "Add to Cart",
        "payNow": "Pay Now",
        "login": "Login",
        "register": "Register",
        "signUp": "Sign Up"
    },
    "labels": {
        "id": "ID",
        "name": "Name",
        "email": "Email",
        "status": "Status",
        "action": "Action",
        "actions": "Actions",
        "date": "Date",
        "cost": "Cost",
        "amount": "Amount",
        "description": "Description",
        "type": "Type",
        "details": "Details",
        "server": "Server",
        "ip": "IP",
        "hostname": "Hostname",
        "domain": "Domain",
        "username": "Username",
        "password": "Password",
        "package": "Package",
        "comments": "Comments",
        "loading": "Loading...",
        "noData": "No data available",
        "noActiveServices": "No Active Services",
        "controlPanel": "Control Panel",
        "welcomeEmail": "Welcome Email",
        "invoices": "Invoices",
        "billingStatus": "Billing Status"
    },
    "table": {
        "serviceId": "Service ID",
        "ticketId": "Ticket ID",
        "subject": "Subject",
        "lastReplier": "Last Replier",
        "expirationDate": "Expiration Date"
    },
    "export": {
        "order": "Order",
        "xlsx": "Excel 2007+",
        "xlsxShort": "XLSX",
        "xls": "Excel 2003/BIFF",
        "xlsShort": "XLS",
        "ods": "OpenDocument Spreadsheet",
        "odsShort": "ODS",
        "pdf": "Adobe Portable Document Format",
        "pdfShort": "PDF",
        "xml": "Extensible Markup Language",
        "xmlShort": "XML",
        "php": "PHP Array",
        "phpShort": "PHP",
        "csv": "Comma-Separated Values",
        "csvShort": "CSV",
        "json": "JSON"
    },
    "confirm": {
        "title": "Are you sure?",
        "delete": "This action cannot be undone.",
        "yes": "Yes",
        "no": "No"
    },
    "footer": {
        "copyright": "Copyright \u00a9 {year} InterServer Inc.",
        "allRightsReserved": "All rights reserved."
    },
    "search": {
        "placeholder": "Search...",
        "noResults": "No search results found"
    },
    "breadcrumb": {
        "home": "Home"
    },
    "profile": {
        "editPersonalInfo": "Edit Personal Info",
        "profileImage": "Profile Image"
    }
}
```

- [ ] **Step 2: Create `src/locales/en/validation.json`**

```json
{
    "required": "{field} is required",
    "email": "Must be a valid email address",
    "minLength": "Must be at least {min} characters",
    "maxLength": "Must be no more than {max} characters",
    "passwordMatch": "Passwords must match",
    "invalidFormat": "Invalid format",
    "numeric": "Must be a number",
    "url": "Must be a valid URL",
    "ipAddress": "Must be a valid IP address",
    "hostname": "Must be a valid hostname"
}
```

- [ ] **Step 3: Remove old locale file**

```bash
rm src/locales/home.en.json
```

- [ ] **Step 4: Commit**

```bash
git add src/locales/en/common.json src/locales/en/validation.json
git rm src/locales/home.en.json
git commit -m "feat: add common and validation locale files, remove old home.en.json"
```

---

### Task 4: Register i18n in main.ts and pre-load common namespace

**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: Update main.ts**

Replace the commented-out i18n lines. Add import near top (after other imports):
```ts
import i18n, { loadCommonMessages } from './i18n';
```

Replace the commented-out lines `//const i18n = createI18n({})` and `//app.use(i18n)` with:
```ts
app.use(i18n);
```

Change `app.mount('#app')` to load common messages first:
```ts
loadCommonMessages().then(() => {
    app.mount('#app');
});
```

Also remove the old `//import { createI18n } from 'vue-i18n'` comment.

- [ ] **Step 2: Commit**

```bash
git add src/main.ts
git commit -m "feat: register i18n plugin and pre-load common namespace on boot"
```

---

### Task 5: Add route meta and locale loading to router

**Files:**
- Modify: `src/router/index.ts`

- [ ] **Step 1: Add i18n import and meta to all routes**

Add import at top:
```ts
import { loadLocaleMessages } from '@/i18n';
```

Add `meta: { i18n: [...] }` to each route group. For parent routes with children, put meta on the parent. Examples:

```ts
{ path: '/', component: () => import('../views/ClientHome.vue'), meta: { i18n: ['dashboard'] } },
{ path: '/login', component: () => import('../views/Login.vue'), meta: { i18n: ['login', 'validation'] } },
{ path: '/signup', component: () => import('../views/Login.vue'), meta: { i18n: ['login', 'validation'] } },
{ path: '/login_old', component: () => import('../views/LoginOld.vue'), meta: { i18n: ['login', 'validation'] } },
{ path: '/register', component: () => import('../views/Register.vue'), meta: { i18n: ['login', 'validation'] } },
{ path: '/sudo/:sessionid', component: () => import('../views/Sudo.vue'), meta: { i18n: ['login'] } },
{ path: '/prepays', component: () => import('../views/billing/PrePays.vue'), meta: { i18n: ['billing'] } },
{ path: '/payment_types', component: () => import('../views/billing/PaymentTypes.vue'), meta: { i18n: ['billing'] } },
{ path: '/cart', component: () => import('../views/billing/Cart.vue'), meta: { i18n: ['billing'] } },
{ path: '/cart/:invoices', component: () => import('../views/billing/Cart.vue'), meta: { i18n: ['billing'] } },
{ path: '/order_needs_payment/:invoices', component: () => import('../views/billing/OrderNeedsPayment.vue'), meta: { i18n: ['billing'] } },
{ path: '/pay/:method(...)/:invoices/:done(done)?', component: () => import('../views/billing/Pay.vue'), meta: { i18n: ['billing'] } },
{ path: '/payment_success', component: () => import('../views/billing/PaymentSuccess.vue'), meta: { i18n: ['billing'] } },
{ path: '/invoices', component: () => import('../views/billing/InvoicesList.vue'), meta: { i18n: ['billing'] } },
{ path: '/invoices/:id(\\d+)', component: () => import('../views/billing/InvoicesList.vue'), meta: { i18n: ['billing'] } },
// Nested route groups — meta on parent:
{ path: '/account', meta: { i18n: ['account', 'validation'] }, children: [...] },
{ path: '/users', meta: { i18n: ['users', 'validation'] }, children: [...] },
{ path: '/affiliate', meta: { i18n: ['affiliate'] }, children: [...] },
{ path: '/tickets', meta: { i18n: ['tickets'] }, children: [...] },
{ path: '/backups', meta: { i18n: ['backups'] }, children: [...] },
{ path: '/dns', meta: { i18n: ['dns'] }, children: [...] },
{ path: '/domains', meta: { i18n: ['domains'] }, children: [...] },
{ path: '/floating_ips', meta: { i18n: ['floating_ips'] }, children: [...] },
{ path: '/licenses', meta: { i18n: ['licenses'] }, children: [...] },
{ path: '/mail', meta: { i18n: ['mail'] }, children: [...] },
{ path: '/qs', meta: { i18n: ['quickservers'] }, children: [...] },
{ path: '/scrub_ips', meta: { i18n: ['scrub_ips'] }, children: [...] },
{ path: '/servers', meta: { i18n: ['servers'] }, children: [...] },
{ path: '/ssl', meta: { i18n: ['ssl'] }, children: [...] },
{ path: '/vps', meta: { i18n: ['vps'] }, children: [...] },
{ path: '/websites', meta: { i18n: ['websites'] }, children: [...] },
```

- [ ] **Step 2: Add locale loading to the beforeEach guard**

In the existing `router.beforeEach`, add locale loading after the auth check and before `return true`:

```ts
// Load i18n namespaces for the target route
const i18nNamespaces = to.matched.flatMap(
    (record) => (record.meta.i18n as string[] | undefined) ?? []
);
if (i18nNamespaces.length > 0) {
    await Promise.all(
        i18nNamespaces.map((ns) => loadLocaleMessages('en', ns))
    );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/router/index.ts
git commit -m "feat: add i18n route meta and lazy locale loading in beforeEach guard"
```

---

### Task 6: Update test setup for i18n

**Files:**
- Modify: `test/setup.ts`

- [ ] **Step 1: Add i18n setup for tests**

Add at the top of `test/setup.ts`:
```ts
import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    missingWarn: false,
    fallbackWarn: false,
});

config.global.plugins.push(i18n);
```

- [ ] **Step 2: Verify tests still pass**

```bash
npx vitest run 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add test/setup.ts
git commit -m "feat: provide i18n instance in test setup"
```

---

## Chunk 2: Core Component Migration (App, MainMenu, shared components)

### Task 7: Migrate App.vue

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Add useI18n and replace hardcoded strings**

In `<script setup>`, add:
```ts
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
```

Replace in template:
- `title="Cart"` → `:title="t('common.menu.cart')"`
- `<span class="brand-text font-weight-light">InterServer</span>` — keep as-is (brand name)
- `alt="Logo"` — keep as-is (alt for logo image)
- `title="Edit Personal Info"` → `:title="t('common.profile.editPersonalInfo')"`
- `alt="Profile Image"` → `:alt="t('common.profile.profileImage')"`
- Footer: `<strong>Copyright &copy; {{ new Date().getFullYear() }} <a href="https://interserver.net">InterServer Inc</a>.</strong> All rights reserved.` → `<strong>{{ t('common.footer.copyright', { year: new Date().getFullYear() }) }} </strong> {{ t('common.footer.allRightsReserved') }}` (keep the link to InterServer)

- [ ] **Step 2: Commit**

```bash
git add src/App.vue
git commit -m "feat(i18n): migrate App.vue to use translation keys"
```

---

### Task 8: Migrate MainMenu.vue

**Files:**
- Modify: `src/components/MainMenu.vue`

- [ ] **Step 1: Convert menu data to computed with t() calls**

Add imports:
```ts
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
```

Change `menus` from `ref<MenuGroup>({...})` to `computed<MenuGroup>(() => ({...}))` and replace all hardcoded text values with `t('common.menu.xxx')` calls. For example:
```ts
const menus = computed<MenuGroup>(() => ({
    main: [
        { link: '/', icon: ['fas', 'tachometer-alt'], text: t('common.menu.dashboard') },
        { link: '/domains', icon: ['fas', 'globe'], text: t('common.menu.domains') },
        // ... etc for all menu items
    ],
    billing: [
        { link: '/cart', icon: ['fas', 'shopping-cart'], text: t('common.menu.cart') },
        // ... etc
    ],
    settings: [
        { link: '/account/settings', icon: ['fas', 'user-shield'], text: t('common.menu.accountSettings') },
        // ... etc
    ],
}));
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MainMenu.vue
git commit -m "feat(i18n): migrate MainMenu.vue to translated menu labels"
```

---

### Task 9: Migrate shared components (Searchbox, Nav, ServiceListTable, Dialog, Alert)

**Files:**
- Modify: `src/components/Searchbox.vue`
- Modify: `src/components/Nav.vue`
- Modify: `src/components/ServiceListTable.vue`
- Modify: `src/components/Dialog.vue`
- Modify: `src/components/Alert.vue`
- Modify: `src/components/HelloWorld.vue` (if has strings)
- Modify: `src/components/WelcomeItem.vue` (if has strings)

- [ ] **Step 1: Add `useI18n` and replace strings in each component**

For each component, add:
```ts
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
```

Key replacements:
- **Searchbox.vue**: `"No Search Results found"` → `t('common.search.noResults')`
- **Nav.vue**: `"Home"` → `t('common.nav.home')`, `"Bugs Suck"` → `t('common.nav.bugsSuck')`, `"Users"` → `t('common.nav.users')`, `"Logout"` → `t('common.nav.logout')`
- **ServiceListTable.vue**: All export format strings → `t('common.export.xlsx')`, `t('common.export.csv')`, etc. "Order" button → `t('common.buttons.order')`

- [ ] **Step 2: Commit**

```bash
git add src/components/Searchbox.vue src/components/Nav.vue src/components/ServiceListTable.vue src/components/Dialog.vue src/components/Alert.vue src/components/HelloWorld.vue src/components/WelcomeItem.vue
git commit -m "feat(i18n): migrate shared components to translation keys"
```

---

### Task 10: Migrate shared service components

**Files:**
- Modify: `src/components/services/Alert.vue`
- Modify: `src/components/services/Cancel.vue`
- Modify: `src/components/services/Invoices.vue`
- Modify: `src/components/services/ServiceActionCardHeader.vue`
- Modify: `src/components/services/view_service/Billing.vue`
- Modify: `src/components/services/view_service/ClientLinks.vue`
- Modify: `src/components/services/view_service/InfoBox.vue`
- Modify: `src/components/services/view_service/Package.vue`

- [ ] **Step 1: Add `useI18n` and replace strings in each component**

These components use keys from `common` namespace. Add `useI18n` import and `const { t } = useI18n()` to each, then replace all hardcoded strings.

- [ ] **Step 2: Commit**

```bash
git add src/components/services/ src/components/services/view_service/
git commit -m "feat(i18n): migrate shared service components to translation keys"
```

---

### Task 11: Migrate account components

**Files:**
- Modify: `src/components/account/AccountFeatures.vue`
- Modify: `src/components/account/ApiAccess.vue`
- Modify: `src/components/account/IpLimits.vue`
- Modify: `src/components/account/LinkedAccounts.vue`
- Modify: `src/components/account/SshKeys.vue`
- Modify: `src/components/account/TwoFactorAuth.vue`

- [ ] **Step 1: Add `useI18n` and replace strings**

These use keys from `account` namespace (loaded when visiting /account/* routes). Add useI18n and replace strings.

- [ ] **Step 2: Commit**

```bash
git add src/components/account/
git commit -m "feat(i18n): migrate account components to translation keys"
```

---

## Chunk 3: Domain Locale Files and View Migration

Each task below creates the domain locale JSON file and migrates all Vue components in that domain. Tasks in this chunk are **independent** and can be executed in parallel by subagents.

For every view component, the pattern is:
1. Read the component file
2. Extract all hardcoded user-facing strings
3. Add them to the domain's locale JSON file with descriptive keys
4. Add `import { useI18n } from 'vue-i18n'` and `const { t } = useI18n()` (add `d`, `n` if dates/numbers present)
5. Replace hardcoded strings with `t('namespace.key')` calls
6. Use `watchEffect` for `setPageHeading`/`setTitle`/`setBreadcrums` calls
7. Use `n(value, 'currency')` for currency formatting, `d(date, 'short')` or `d(date, 'long')` for dates
8. Fix grammar/spelling errors in the English text as strings are extracted
9. Use pluralization pipe syntax where counts are shown

### Task 12: Login domain (login.json + 5 views)

**Files:**
- Create: `src/locales/en/login.json`
- Modify: `src/views/Login.vue`
- Modify: `src/views/LoginOld.vue`
- Modify: `src/views/Register.vue`
- Modify: `src/views/Sudo.vue`
- Modify: `src/views/Home.vue` (if it has strings)

- [ ] **Step 1: Create `src/locales/en/login.json`**

Read all 5 view files, extract every hardcoded string, and create the JSON file. Include keys for: page titles, form labels, validation messages, button labels, OAuth prompts, 2FA labels, forgot password flow, etc.

- [ ] **Step 2: Migrate all 5 view files**

For each file: add `useI18n`, replace all hardcoded strings with `t('login.xxx')` or `t('validation.xxx')` calls. Use `watchEffect` for `setPageHeading`/`setBreadcrums`. Fix grammar/spelling.

- [ ] **Step 3: Commit**

```bash
git add src/locales/en/login.json src/views/Login.vue src/views/LoginOld.vue src/views/Register.vue src/views/Sudo.vue src/views/Home.vue
git commit -m "feat(i18n): migrate login/register views and create login locale"
```

---

### Task 13: Dashboard domain (dashboard.json + ClientHome.vue)

**Files:**
- Create: `src/locales/en/dashboard.json`
- Modify: `src/views/ClientHome.vue`

- [ ] **Step 1: Create `src/locales/en/dashboard.json`**

Extract strings from ClientHome.vue: "Dashboard", "Welcome, {name}", "Last Login", "Last Login IP", "PrePay Balance", "Prepay Remaining Balance", "Manage Account", "Unpaid Invoices", "Total Unpaid Invoices", "Total Amount To Be Paid", "Call in Pin", "Recent Tickets", "Ticket ID", "Subject", "Last Replier", "Status", "Action", "Edit", "No Active Services", "Control Panel", "Order Now", "Earn {amount} Per Sale", "Affiliate URL", "Copy to Clipboard", "Share with", etc.

Use pluralization for service counts. Use `n()` for currency amounts. Use `d()` for last_login date.

- [ ] **Step 2: Migrate ClientHome.vue**

Add `const { t, d, n } = useI18n()`. Replace all strings. Use `watchEffect` for `setPageHeading`/`setBreadcrums`.

- [ ] **Step 3: Commit**

```bash
git add src/locales/en/dashboard.json src/views/ClientHome.vue
git commit -m "feat(i18n): migrate dashboard view and create dashboard locale"
```

---

### Task 14: Account domain (account.json + 4 views)

**Files:**
- Create: `src/locales/en/account.json`
- Modify: `src/views/account/AccountSettings.vue`
- Modify: `src/views/account/ChangePass.vue`
- Modify: `src/views/account/ChangeUsername.vue`
- Modify: `src/views/account/ContactInfo.vue`

- [ ] **Step 1: Create locale file, extract strings from all 4 views**
- [ ] **Step 2: Migrate all 4 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/account.json src/views/account/
git commit -m "feat(i18n): migrate account views and create account locale"
```

---

### Task 15: Domains domain (domains.json + 14 views)

**Files:**
- Create: `src/locales/en/domains.json`
- Modify: All files in `src/views/domains/` (DomainsList.vue, DomainsList1.vue, DomainsList2.vue, ViewDomain.vue, OrderDomain.vue, Nameservers.vue, Contact.vue, EppCode.vue, Whois.vue, WhoisToggle.vue, Lock.vue, Dnssec.vue, Renew.vue, Transfer.vue)

- [ ] **Step 1: Create locale file, extract strings from all 14 views**
- [ ] **Step 2: Migrate all 14 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/domains.json src/views/domains/
git commit -m "feat(i18n): migrate domain views and create domains locale"
```

---

### Task 16: VPS domain (vps.json + 21 views)

**Files:**
- Create: `src/locales/en/vps.json`
- Modify: All files in `src/views/vps/` (VpsList.vue, ViewVps.vue, OrderVps.vue, BuyIp.vue, BuyHdSpace.vue, ChangeHostname.vue, ChangeRootPassword.vue, ChangeTimezone.vue, ChangeWebuzoPassword.vue, ReinstallOs.vue, ResetPassword.vue, ReverseDns.vue, Vnc.vue, SetupVnc.vue, IpmiLive.vue, InsertCd.vue, Backup.vue, Backups.vue, Restore.vue, TrafficUsage.vue, Slices.vue)

- [ ] **Step 1: Create locale file, extract strings from all 21 views**
- [ ] **Step 2: Migrate all 21 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/vps.json src/views/vps/
git commit -m "feat(i18n): migrate VPS views and create vps locale"
```

---

### Task 17: Servers domain (servers.json + 7 views)

**Files:**
- Create: `src/locales/en/servers.json`
- Modify: All files in `src/views/servers/` (ServersList.vue, ViewServer.vue, OrderServer.vue, OrderDedicated.vue, ReverseDns.vue, BandwidthGraph.vue, IpmiLive.vue)

- [ ] **Step 1: Create locale file, extract strings from all 7 views**
- [ ] **Step 2: Migrate all 7 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/servers.json src/views/servers/
git commit -m "feat(i18n): migrate server views and create servers locale"
```

---

### Task 18: Websites domain (websites.json + 7 views)

**Files:**
- Create: `src/locales/en/websites.json`
- Modify: All files in `src/views/webhosting/` (WebsitesList.vue, ViewWebsite.vue, OrderWebsite.vue, BuyIp.vue, ReverseDns.vue, DownloadBackups.vue, Migration.vue)

- [ ] **Step 1: Create locale file, extract strings from all 7 views**
- [ ] **Step 2: Migrate all 7 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/websites.json src/views/webhosting/
git commit -m "feat(i18n): migrate webhosting views and create websites locale"
```

---

### Task 19: Mail domain (mail.json + 9 views)

**Files:**
- Create: `src/locales/en/mail.json`
- Modify: All files in `src/views/mail/` (MailList.vue, ViewMail.vue, OrderMail.vue, Alerts.vue, Delist.vue, DenyRules.vue, Logs.vue, Stats.vue, Deliverability.vue)

- [ ] **Step 1: Create locale file, extract strings from all 9 views**
- [ ] **Step 2: Migrate all 9 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/mail.json src/views/mail/
git commit -m "feat(i18n): migrate mail views and create mail locale"
```

---

### Task 20: Licenses domain (licenses.json + 5 views)

**Files:**
- Create: `src/locales/en/licenses.json`
- Modify: All files in `src/views/licenses/` (LicensesList.vue, ViewLicense.vue, OrderLicense.vue, ChangeIp.vue, ChangeOs.vue)

- [ ] **Step 1: Create locale file, extract strings from all 5 views**
- [ ] **Step 2: Migrate all 5 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/licenses.json src/views/licenses/
git commit -m "feat(i18n): migrate license views and create licenses locale"
```

---

### Task 21: SSL domain (ssl.json + 4 views)

**Files:**
- Create: `src/locales/en/ssl.json`
- Modify: All files in `src/views/ssl/` (SslList.vue, ViewSsl.vue, OrderSsl.vue, ChangeApproverEmail.vue)

- [ ] **Step 1: Create locale file, extract strings from all 4 views**
- [ ] **Step 2: Migrate all 4 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/ssl.json src/views/ssl/
git commit -m "feat(i18n): migrate SSL views and create ssl locale"
```

---

### Task 22: Backups domain (backups.json + 3 views)

**Files:**
- Create: `src/locales/en/backups.json`
- Modify: All files in `src/views/backups/` (BackupsList.vue, ViewBackup.vue, OrderBackup.vue)

- [ ] **Step 1: Create locale file, extract strings from all 3 views**
- [ ] **Step 2: Migrate all 3 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/backups.json src/views/backups/
git commit -m "feat(i18n): migrate backup views and create backups locale"
```

---

### Task 23: DNS domain (dns.json + 2 views)

**Files:**
- Create: `src/locales/en/dns.json`
- Modify: `src/views/dns/DnsManager.vue`, `src/views/dns/DnsEditor.vue`

- [ ] **Step 1: Create locale file, extract strings from both views**
- [ ] **Step 2: Migrate both views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/dns.json src/views/dns/
git commit -m "feat(i18n): migrate DNS views and create dns locale"
```

---

### Task 24: Floating IPs domain (floating_ips.json + 4 views)

**Files:**
- Create: `src/locales/en/floating_ips.json`
- Modify: All files in `src/views/floating_ips/` (FloatingIpsList.vue, ViewFloatingIp.vue, OrderFloatingIp.vue, ChangeIp.vue)

- [ ] **Step 1: Create locale file, extract strings from all 4 views**
- [ ] **Step 2: Migrate all 4 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/floating_ips.json src/views/floating_ips/
git commit -m "feat(i18n): migrate floating IP views and create floating_ips locale"
```

---

### Task 25: Scrub IPs domain (scrub_ips.json + 5 views)

**Files:**
- Create: `src/locales/en/scrub_ips.json`
- Modify: All files in `src/views/scrub_ips/` (ScrubIpList.vue, ViewScrubIp.vue, Filters.vue, FirewallRules.vue, GeoFirewallRules.vue)

- [ ] **Step 1: Create locale file, extract strings from all 5 views**
- [ ] **Step 2: Migrate all 5 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/scrub_ips.json src/views/scrub_ips/
git commit -m "feat(i18n): migrate scrub IP views and create scrub_ips locale"
```

---

### Task 26: Quick Servers domain (quickservers.json + 3 views)

**Files:**
- Create: `src/locales/en/quickservers.json`
- Modify: All files in `src/views/quickservers/` (QsList.vue, ViewQs.vue, OrderQs.vue)

- [ ] **Step 1: Create locale file, extract strings from all 3 views**
- [ ] **Step 2: Migrate all 3 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/quickservers.json src/views/quickservers/
git commit -m "feat(i18n): migrate quick server views and create quickservers locale"
```

---

### Task 27: Billing domain (billing.json + 7 views)

**Files:**
- Create: `src/locales/en/billing.json`
- Modify: All files in `src/views/billing/` excluding affiliates/ (Cart.vue, InvoicesList.vue, Pay.vue, PaymentSuccess.vue, PaymentTypes.vue, PrePays.vue, OrderNeedsPayment.vue)

- [ ] **Step 1: Create locale file, extract strings from all 7 views**

Use `n()` for all currency amounts. Use `d()` for invoice dates.

- [ ] **Step 2: Migrate all 7 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/billing.json src/views/billing/Cart.vue src/views/billing/InvoicesList.vue src/views/billing/Pay.vue src/views/billing/PaymentSuccess.vue src/views/billing/PaymentTypes.vue src/views/billing/PrePays.vue src/views/billing/OrderNeedsPayment.vue
git commit -m "feat(i18n): migrate billing views and create billing locale"
```

---

### Task 28: Tickets domain (tickets.json + 3 views)

**Files:**
- Create: `src/locales/en/tickets.json`
- Modify: All files in `src/views/tickets/` (TicketsList.vue, ViewTicket.vue, NewTicket.vue)

- [ ] **Step 1: Create locale file, extract strings from all 3 views**
- [ ] **Step 2: Migrate all 3 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/tickets.json src/views/tickets/
git commit -m "feat(i18n): migrate ticket views and create tickets locale"
```

---

### Task 29: Users domain (users.json + 2 views)

**Files:**
- Create: `src/locales/en/users.json`
- Modify: `src/views/users/List.vue`, `src/views/users/AddEdit.vue`

- [ ] **Step 1: Create locale file, extract strings from both views**
- [ ] **Step 2: Migrate both views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/users.json src/views/users/
git commit -m "feat(i18n): migrate user views and create users locale"
```

---

### Task 30: Affiliate domain (affiliate.json + 14 views)

**Files:**
- Create: `src/locales/en/affiliate.json`
- Modify: All files in `src/views/billing/affiliates/` (Affiliate.vue, Layout.vue, Status.vue, PaymentSetup.vue, Signups.vue, RichReport.vue, SalesGraph.vue, TrafficGraph.vue, WebTraffic.vue, ViewBanner.vue, ViewBanners.vue, DockSetup.vue, Faq.vue, Tos.vue)

- [ ] **Step 1: Create locale file, extract strings from all 14 views**
- [ ] **Step 2: Migrate all 14 views with useI18n**
- [ ] **Step 3: Commit**

```bash
git add src/locales/en/affiliate.json src/views/billing/affiliates/
git commit -m "feat(i18n): migrate affiliate views and create affiliate locale"
```

---

## Chunk 4: Verification and Cleanup

### Task 31: Verify build and tests

- [ ] **Step 1: Run TypeScript type check**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run
```

- [ ] **Step 3: Run dev server and verify no console errors**

```bash
npx vite --host 2>&1 &
# Check that it starts without errors
```

- [ ] **Step 4: Fix any issues found**

Address any type errors, missing keys, import issues, or test failures.

- [ ] **Step 5: Commit fixes if needed**

```bash
git add -A
git commit -m "fix(i18n): resolve build/test issues from localization migration"
```

---

### Task 32: Final review and cleanup

- [ ] **Step 1: Grep for remaining hardcoded strings**

Search for common patterns that might have been missed:

```bash
# Look for hardcoded title attributes
rg 'title="[A-Z]' src/views/ src/components/ --glob '*.vue' | head -30

# Look for hardcoded text in templates (rough heuristic)
rg '>[A-Z][a-z]+\s+[A-Z]' src/views/ --glob '*.vue' -l | head -20
```

- [ ] **Step 2: Migrate any missed strings**

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(i18n): complete localization migration cleanup"
```
