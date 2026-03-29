---
name: add-service-list
description: Creates a new service list page using the ServiceListTable component from src/components/ServiceListTable.vue. Follows the pattern in src/views/webhosting/WebsitesList.vue — defines columns, fetches data via fetchWrapper, sets breadcrumbs via useSiteStore. Use when user says 'add list page', 'create services list', 'new {service} list view'. Do NOT use for detail/view pages or order pages.
---
# Add Service List Page

## Critical

- **Never use raw `fetch` or `axios`** — always use `fetchWrapper` from `@/helpers/fetchWrapper`.
- **Never add `<i18n>` SFC blocks** — all translations come from lazy-loaded locale JSON files in `src/locales/en/` (e.g., `src/locales/en/vps.json`, `src/locales/en/mail.json`).
- **Use `@/` alias** for all imports — never use relative paths like `../../`.
- The route path may differ from the module name (e.g., module `webhosting` routes under path `/websites` in `src/router/index.ts`, module `quickservers` routes under `/qs`). Check `src/helpers/moduleLink.ts` for mappings.

## Instructions

### Step 1: Create the list view file

Create the list view in the appropriate `src/views/` subdirectory. Follow the pattern of existing list views like `src/views/vps/VpsList.vue`, `src/views/backups/BackupsList.vue`, or `src/views/webhosting/WebsitesList.vue`.

Use this exact template:

```vue
<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const { t } = useI18n();

const module = 'backups';  // e.g., 'vps', 'domains', 'webhosting'
const siteStore = useSiteStore();
watchEffect(() => {
    siteStore.setPageHeading(t('backups.list.title'));
    siteStore.setTitle(t('backups.list.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('common.menu.backups')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'backup_id', label: t('common.labels.id') },
    { key: 'backup_hostname', label: t('common.labels.hostname'), link: true },
    { key: 'repeat_invoices_cost', label: t('common.labels.cost') },
    { key: 'backup_status', label: t('common.labels.status') },
    { key: 'services_name', label: t('common.labels.package') },
    { key: 'backup_comment', label: t('common.labels.comments') },
];

const data = ref<Record<string, any>[]>([]);

const loadData = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}`);
        data.value = response;
    } catch (error: any) {
        console.log('api failed', error);
    }
};
loadData();
</script>

<template>
    <ServiceListTable
        :module="module"
        :data="data"
        :columns="columns"
        id-field="backup_id"
        status-field="backup_status"
        :order-title="t('backups.list.orderTitle')"
    />
</template>
```

Replace the domain-specific values (`backups`, `backup_`) with your target domain's module name and API field prefix. Reference `src/views/webhosting/WebsitesList.vue` for a real working example.

**Verify:**

```bash
yarn ts
```

### Step 2: Add the route

In `src/router/index.ts`, add a route block following the pattern of existing service routes (e.g., the backups block at line ~87 or VPS block at line ~198):

```ts
{
    path: '/backups',
    meta: { i18n: ['backups'] },
    children: [
        { path: '', component: () => import('../views/backups/BackupsList.vue') },
        // order and view routes added separately
    ],
},
```

The route path is the URL — usually matches the module name, but check `src/helpers/moduleLink.ts` (e.g., `webhosting` → route path `/websites`, `quickservers` → route path `/qs`).

The `meta: { i18n: [...] }` array lists namespace(s) to lazy-load for this route.

**Verify:** The route is accessible at `http://localhost:5173/backups` after `yarn dev`.

### Step 3: Add i18n translations

Ensure the English locale file exists (e.g., `src/locales/en/backups.json`) with the required keys:

```json
{
    "list": {
        "title": "Backups List",
        "orderTitle": "Order Backups"
    }
}
```

Also verify that `src/locales/en/common.json` has any shared labels you referenced (e.g., `common.labels.id`, `common.labels.hostname`, `common.labels.status`).

**Verify:** No missing translation warnings in the browser console.

### Step 4: Optional — Add typed row interface

For better type safety, define an interface for the API response rows directly in the list file:

```ts
interface BackupRow {
    backup_id: number;
    backup_hostname: string;
    backup_status: string;
    repeat_invoices_cost: number;
    services_name: string;
}

const data = ref<BackupRow[]>([]);
```

This replaces `Record<string, any>[]`. Both patterns are used in the codebase.

## Examples

**User says:** "Add a list page for the mail service"

**Actions taken:**
1. Create `src/views/mail/MailList.vue` with `module = 'mail'`, columns using `mail_` prefix fields, `id-field="mail_id"`, `status-field="mail_status"`
2. Add route in `src/router/index.ts` under the mail route block (line ~144), child `{ path: '', component: () => import('../views/mail/MailList.vue') }`
3. Ensure `src/locales/en/mail.json` has `list.title` and `list.orderTitle` keys

**Result:** Navigating to the mail list route shows a sortable, filterable table with status tabs (active/pending/expired/all), export buttons, and an order button linking to the order page.

## Common Issues

**Empty table, no errors:** The API endpoint returns data in a format `fetchWrapper` doesn't expect. Check the network tab — `fetchWrapper.get()` expects the response to be a JSON array directly. If the API wraps it (e.g., `{ data: [...] }`), update `loadData` to extract: `data.value = response.data;`

**"Cannot read properties of undefined (reading 'setPageHeading')":** `useSiteStore()` called outside of a component setup context. Ensure it's called at the top level of `<script setup>`, not inside an async function.

**Route not loading / blank page:** Check that the route block in `src/router/index.ts` has a `children` array with the list component. Compare with working route blocks like the VPS routes (line ~198) or backups routes (line ~87).

**Missing translation warnings `[intlify]`:** The i18n namespace isn't listed in the route's `meta: { i18n: [...] }` array. Add the namespace string: `meta: { i18n: ['backups'] }`. Vue I18n lazy-loads based on this.

**`moduleLink` returns wrong path:** If your module name differs from the URL path, add a mapping in `src/helpers/moduleLink.ts`. Currently `quickservers` → `qs` and `webhosting` → `websites` are mapped; all others pass through unchanged.