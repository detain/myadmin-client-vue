# Vue i18n Localization Design

**Date:** 2026-03-16
**Status:** Approved

## Overview

Set up vue-i18n across the entire MyAdmin Vue 3 application using the Composition API (`useI18n`), with route-level lazy loading of locale files, build-time optimizations, and proper handling of pluralization, datetime formatting, and number formatting. English is the base locale with infrastructure ready for additional languages. Grammar and spelling errors are fixed as strings are extracted.

## 1. Infrastructure & Configuration

### i18n Plugin Setup (`src/i18n/index.ts`)

Create a shared i18n instance:

```ts
import { createI18n } from 'vue-i18n';
import type { I18n } from 'vue-i18n';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    globalInjection: false,
    missingWarn: import.meta.env.DEV,
    fallbackWarn: import.meta.env.DEV,
    datetimeFormats: {
        en: {
            short: { year: 'numeric', month: '2-digit', day: '2-digit' },
            long: { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' },
            dateOnly: { year: 'numeric', month: 'long', day: 'numeric' },
            timeOnly: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
        },
    },
    numberFormats: {
        en: {
            currency: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
            decimal: { style: 'decimal', minimumFractionDigits: 2 },
            percent: { style: 'percent', minimumFractionDigits: 0 },
        },
    },
});
```

Export a `loadLocaleMessages(locale, namespace)` helper:

- Dynamically imports from `src/locales/{locale}/{namespace}.json`
- Calls `i18n.global.mergeLocaleMessage(locale, { [namespace]: messages })`
- Maintains a `Set<string>` of already-loaded `locale:namespace` pairs to avoid re-fetching

### Vite Build Optimization (`vite.config.ts`)

- Add `@intlify/unplugin-vue-i18n/vite` plugin with `runtimeOnly: true`, `compositionOnly: true`
- Add resolve alias: `'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'`
- These optimizations tree-shake the legacy API and use pre-compiled messages, reducing bundle size

### Global Formats

**Datetime formats (`en`):**
- `short`: `03/16/2026`
- `long`: `March 16, 2026, 02:30 PM`
- `dateOnly`: `March 16, 2026`
- `timeOnly`: `02:30:00 PM`

**Number formats (`en`):**
- `currency`: `$1,234.56`
- `decimal`: `1,234.56`
- `percent`: `85%`

**Pluralization:**
- Uses vue-i18n built-in pipe syntax: `"no items | {count} item | {count} items"`

## 2. Locale File Organization

### Directory Structure

```
src/locales/en/
├── common.json          # Shared: buttons, labels, table headers, validation, menu, footer
├── login.json           # Login, Register, Forgot Password, 2FA, OAuth
├── dashboard.json       # ClientHome (welcome, prepay, invoices, affiliate, tickets)
├── account.json         # Account settings, change pass/username, contact info, API, SSH, 2FA
├── domains.json         # Domain list, order, view, DNSSEC, EPP, nameservers, whois
├── vps.json             # VPS list, order, view, all action views
├── servers.json         # Server list, order, view
├── websites.json        # Webhosting list, order, view
├── mail.json            # Mail list, order, view
├── licenses.json        # License list, order, view
├── ssl.json             # SSL list, order, view
├── backups.json         # Backup list, order, view
├── dns.json             # DNS manager, DNS editor
├── floating_ips.json    # Floating IPs list, order, view
├── scrub_ips.json       # Scrub IPs list, view
├── quickservers.json    # Quick servers list, order, view
├── billing.json         # Cart, invoices, payment types, prepays, pay
├── tickets.json         # Ticket list, new ticket, view ticket
├── users.json           # User list, add/edit
└── affiliate.json       # Affiliate sub-views (status, FAQ, TOS, banners, reports)
```

### Key Conventions

- `common.json` is loaded at app boot (always available) — contains menu labels, generic buttons ("Save", "Cancel", "Delete", "Edit", "Loading..."), validation messages, table headers, footer text
- All other namespaces loaded lazily via router guard
- Keys are flat within the namespace: `"welcome": "Welcome, {name}"`, not deeply nested
- Pluralization: `"serviceCount": "No active services | {count} active service | {count} active services"`

## 3. Router Integration & Lazy Loading

### Route Meta

Each route declares its required locale namespace(s):

```ts
{
    path: '/vps',
    component: () => import('@/views/vps/VpsList.vue'),
    meta: { i18n: ['vps'] }
}
```

### Router `beforeEach` Guard

- Reads `to.meta.i18n` (array of namespace strings)
- Calls `loadLocaleMessages('en', namespace)` for each unloaded namespace
- Awaits all loads with `Promise.all()` before proceeding
- `common` namespace is pre-loaded during app initialization in `main.ts` before `app.mount()`

### Component Usage Pattern

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t, d, n } = useI18n();
</script>

<template>
    <h3>{{ t('dashboard.welcome', { name: full_name }) }}</h3>
    <p>{{ d(new Date(last_login), 'long') }}</p>
    <p>{{ n(parseFloat(balance), 'currency') }}</p>
    <p>{{ t('dashboard.serviceCount', { count: value.count }) }}</p>
</template>
```

Shared components (ServiceListTable, Alert, MainMenu) use keys from `common` namespace.

## 4. Component Migration Strategy

### String Replacement Patterns

| Pattern | Before | After |
|---------|--------|-------|
| Template text | `<h3>Welcome, {{ name }}</h3>` | `<h3>{{ t('dashboard.welcome', { name }) }}</h3>` |
| Template attributes | `title="Edit Ticket"` | `:title="t('common.edit')"` |
| Script strings | `setPageHeading('Dashboard')` | `setPageHeading(t('dashboard.title'))` |
| Validation | `.required('Username is required')` | `.required(t('login.usernameRequired'))` |
| SweetAlert | `Swal.fire({ title: 'Are you sure?' })` | `Swal.fire({ title: t('common.confirmTitle') })` |
| Menu items | `text: 'Dashboard'` | `text: t('common.menu.dashboard')` (computed) |
| Currency | `` `$${amount}` `` | `n(parseFloat(amount), 'currency')` |

### Every Component Gets

1. `import { useI18n } from 'vue-i18n'` added to `<script setup>`
2. `const { t, d, n } = useI18n()` destructured (only what's used)
3. All hardcoded strings replaced with `t()` calls
4. Grammar/spelling fixes applied inline as strings are extracted

### What Stays Untranslated

- CSS class names, HTML structural attributes
- Brand names ("InterServer", "AdminLTE")
- Dynamic data from API responses (ticket subjects, hostnames, IPs)
- Code/technical values (URLs, email addresses)

## 5. Error Handling & Edge Cases

### Fallback Behavior

- `fallbackLocale: 'en'` ensures missing keys in future locales fall back to English
- `missingWarn: false` in production; enabled in development to catch missing keys
- If a namespace fails to load, the router guard catches the error, logs it, and proceeds — components render with raw keys rather than blocking navigation

### Reactive Locale Switching (Future-Ready)

- `locale` is a reactive ref — when switched, all `t()` calls update automatically
- MainMenu uses `computed()` wrapping menu data so labels re-translate on locale change
- `setPageHeading()` calls would need re-invocation on locale switch via watching `locale` (future concern)

### Pluralization Rules

- English uses built-in pipe syntax: `"no items | {count} item | {count} items"`
- Additional languages can define custom `pluralRules` in the i18n config

### Formatting Consistency

- All currency displays use `n(value, 'currency')` instead of template literals
- All date displays use `d(date, 'short')` or `d(date, 'long')` instead of raw strings
- Ensures proper locale-aware formatting when languages are added

## 6. Dependencies

### New Packages

- `@intlify/unplugin-vue-i18n` — build-time optimization plugin (dev dependency)

### Existing Packages (Already Installed)

- `vue-i18n` — already in package.json, currently commented out in main.ts

## 7. Files Created/Modified Summary

### New Files

- `src/i18n/index.ts` — i18n instance, loader helper, format configs
- `src/locales/en/*.json` — 20 locale namespace files

### Modified Files

- `src/main.ts` — import and register i18n plugin, pre-load common namespace
- `src/router/index.ts` — add beforeEach guard for lazy locale loading
- `vite.config.ts` — add intlify plugin and vue-i18n resolve alias
- All 142 Vue component files — replace hardcoded strings with `t()`/`d()`/`n()` calls
- `src/locales/home.en.json` — removed (replaced by new structure)
