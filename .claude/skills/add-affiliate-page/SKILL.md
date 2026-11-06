---
name: add-affiliate-page
description: Scaffolds a new affiliate-system page under src/views/billing/affiliates/ following patterns in Affiliate.vue, Faq.vue, RichReport.vue, SalesGraph.vue, etc. Wires the route as a child of /affiliate in src/router/index.ts with meta.i18n: ['affiliate'] and adds keys under src/locales/en/affiliate.json. Use when user says 'add affiliate page', 'new affiliate report', 'affiliate dashboard view'. Do NOT use for non-affiliate billing pages (Cart, Invoices, PrePays) — those live directly under src/views/billing/.
paths:
  - src/views/billing/affiliates/**/*.vue
  - src/locales/en/affiliate.json
  - src/router/index.ts
---
# Add Affiliate Page

Scaffold a new page in the affiliate system under `src/views/billing/affiliates/`, wire it into the affiliate route group in `src/router/index.ts`, and add locale keys to `src/locales/en/affiliate.json`.

## Critical

- **Affiliate pages MUST be added as a child route of the affiliate parent** in `src/router/index.ts`, never as a top-level route. The parent has `meta: { i18n: ['affiliate'] }` so the child does not need its own `meta`.
- **All affiliate locale keys live under `src/locales/en/affiliate.json`** — never add a new locale file for a single affiliate page. Use the existing nested-namespace convention with keys like `faqPage` and `richReportPage` inside the affiliate namespace.
- **Never use `axios` or raw `fetch`** — only `fetchWrapper` from `@/helpers/fetchWrapper`.
- **All affiliate API calls must use `${baseUrl}/affiliate/<endpoint>`**, where `baseUrl = siteStore.getBaseUrl()`. See `src/views/billing/affiliates/RichReport.vue`.
- **Pages must call `siteStore.setPageHeading`, `setTitle`, and `setBreadcrums` inside `watchEffect`** so headings update on locale change. The breadcrumbs trail is always the home crumb, the affiliate parent crumb, and the current page title.
- **Do NOT** put new affiliate pages under `src/views/billing/` directly — that location is reserved for files such as `src/views/billing/Cart.vue`, `src/views/billing/InvoicesList.vue`, `src/views/billing/PaymentTypes.vue`, `src/views/billing/PaymentSuccess.vue`, `src/views/billing/PrePays.vue`.

## Instructions

1. **Determine the page name and route slug.** Page names use PascalCase matching the route slug (e.g. route `commission_report` → component `CommissionReport.vue`). Confirm the slug does not already exist by reading `src/router/index.ts` around the affiliate block (lines ~88-105). Verify no file with that name already exists under `src/views/billing/affiliates/` before proceeding.

2. **Add locale keys to `src/locales/en/affiliate.json`.** Add a new nested object keyed by `<pageName>Page` containing at minimum `title`. Example: `"commissionReportPage": { "title": "Commission Report", ... }`. Reuse existing keys already present in `src/locales/en/affiliate.json` and `src/locales/en/common.json` — do not duplicate them. Verify the JSON parses (no trailing commas) before proceeding.

3. **Create the component file under `src/views/billing/affiliates/`** with a PascalCase name like `src/views/billing/affiliates/CommissionReport.vue`. Use `<script setup lang="ts">`. Copy the boilerplate from `src/views/billing/affiliates/Faq.vue` (static content) or `src/views/billing/affiliates/RichReport.vue` (API-backed). Required imports:
   ```ts
   import { watchEffect } from 'vue';
   import { RouterLink } from 'vue-router';
   import { useI18n } from 'vue-i18n';
   import { useSiteStore } from '@/stores/site.store';
   ```
   For API-backed pages, also import `fetchWrapper` from `@/helpers/fetchWrapper`, `ref`/`onMounted` from `vue`, and `Swal from 'sweetalert2'`. Set up `const { t } = useI18n(); const siteStore = useSiteStore();` and (for API pages) `const baseUrl = siteStore.getBaseUrl();`. Put `setPageHeading`/`setTitle`/`setBreadcrums` inside `watchEffect(() => { ... })`. Verify the file compiles by running `yarn ts`.

4. **Build the template using Admin-LTE Bootstrap 4 card markup.** Wrap content in `<div class="row justify-content-center"><div class="col-md-8">` (or `col-md-10` for wider tables/graphs — see `src/views/billing/affiliates/RichReport.vue`). Inside, render a `<div class="card">` with `card-header` (containing `<h3 class="card-title py-2">` + icon + title, plus a back link to the affiliate index using `<router-link>` with `btn btn-custom btn-sm` and the `fa-arrow-left` icon) and `card-body`. Use `t('...')` for every label — no hard-coded strings.

5. **For API-backed pages, fetch in a top-level `try/catch` block (not inside `onMounted`).** Pattern from `src/views/billing/affiliates/RichReport.vue`:
   ```ts
   try {
       Swal.fire({ title: '', html: '<i class="fas fa-spinner fa-pulse"></i> Please wait!', allowOutsideClick: false, showConfirmButton: false });
       fetchWrapper.get(`${baseUrl}/affiliate/<endpoint>`).then((response) => {
           Swal.close();
           table.value = response.text;
       });
   } catch (error: any) {
       Swal.close();
       Swal.fire({ icon: 'error', html: `Got error ${error.text}` });
   }
   ```
   Render API HTML responses with `v-html="table"` on the `card-body`.

6. **Register the route in `src/router/index.ts`.** Add a new entry inside the `children: [...]` array of the affiliate route block (around line 91-105). Use the format: `{ path: '<slug>', component: () => import('../views/billing/affiliates/<PageName>.vue') },`. Keep entries grouped logically with the existing ones. Do not add a `name`, `meta`, or `redirect` — the parent's `meta.i18n` cascades. Verify the route resolves by running `yarn dev` and visiting the new path under the affiliate base.

7. **Propagate locale keys to other languages (optional).** New keys added to `src/locales/en/affiliate.json` should ideally be copied to the other 109 locale directories (`src/locales/<lang>/affiliate.json`). If the user does not request translation, leave a TODO comment in the PR description rather than translating manually.

8. **Verify before completion.** Run in order:
   ```bash
   yarn ts        # must pass with no errors
   yarn lint      # must pass
   yarn dev      # then navigate to the new affiliate page
   ```
   Confirm page heading, breadcrumb, back link, and rendered content all show correctly.

## Examples

**User says:** "Add an affiliate page for commission reports at the commission_report slug"

**Actions taken:**
1. Read `src/router/index.ts` lines 87-106 — confirm `commission_report` slug not present.
2. Edit `src/locales/en/affiliate.json` — add `"commissionReportPage": { "title": "Commission Report" }`.
3. Create `src/views/billing/affiliates/CommissionReport.vue` using the `src/views/billing/affiliates/RichReport.vue` template (table-style API page), fetching `${baseUrl}/affiliate/commission_report` and binding `response.text` to a `table` ref rendered with `v-html`.
4. Edit `src/router/index.ts` — add `{ path: 'commission_report', component: () => import('../views/billing/affiliates/CommissionReport.vue') },` to the affiliate children array, immediately after the `rich_report` entry.
5. Run `yarn ts && yarn lint` — both pass.
6. Run `yarn dev`, navigate to the new affiliate commission_report path, confirm the page renders with the correct heading, breadcrumb trail, and back-to-affiliate link.

**Result:** New child route accessible at the affiliate commission_report path with i18n bundle auto-loaded via `meta.i18n: ['affiliate']`, breadcrumbs showing Home > Affiliate > Commission Report, and a back button returning to the affiliate index.

## Common Issues

- **Heading does not update on locale switch:** You called `setPageHeading`/`setTitle`/`setBreadcrums` outside `watchEffect`. Wrap them in `watchEffect(() => { ... })` like `src/views/billing/affiliates/Faq.vue` line 10.
- **`t is not defined` / `siteStore is not defined`:** You used the wrong import or forgot `const { t } = useI18n(); const siteStore = useSiteStore();` at the top of `<script setup>`.
- **`Cannot find module '@/...'`:** The `@` alias resolves to `src/`. Use `@/stores/site.store`, not relative paths like `../../stores/site.store`.
- **Route renders blank page:** The component import path is wrong, or the route was added at the top level instead of inside the affiliate parent's `children` array. Re-check `src/router/index.ts` lines 87-106.
- **i18n keys show as raw strings:** You added the route outside the affiliate parent (which has `meta.i18n: ['affiliate']`) or you forgot to add the key to `src/locales/en/affiliate.json`. Verify both.
- **`response.text` is undefined:** The affiliate endpoint did not return the expected shape. `fetchWrapper` returns the parsed body — confirm the backend route exists and check the Network tab.
- **Sweetalert spinner never closes:** You forgot `Swal.close()` in the `.then()` callback or the request failed silently. Always call `Swal.close()` in both success and error paths.
- **`vue-tsc` reports an unused import (`RouterLink`):** If the template uses `<router-link>` (lowercase), the import is still required for type-check in strict mode. Keep it — it matches the pattern in every existing affiliate page.
