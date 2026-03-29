---
name: add-service-list
description: Creates a new service list page using the ServiceListTable component from src/components/ServiceListTable.vue. Follows the pattern in src/views/webhosting/WebsitesList.vue — defines columns, fetches data via fetchWrapper, sets breadcrumbs via useSiteStore. Use when user says 'add list page', 'create services list', 'new {service} list view'. Do NOT use for detail/view pages or order pages.
---
# Add Service List Page

## Critical

- **Always use `fetchWrapper`** — never raw `fetch` or `axios`. Import from `@/helpers/fetchWrapper`.
- **Always use `ServiceListTable`** component — do not build custom tables for service listings.
- **Module name must match** a key in `siteStore.modules` (defined in `src/stores/site.store.ts`). Valid modules: `domains`, `vps`, `backups`, `mail`, `licenses`, `ssl`, `floating_ips`, `webhosting`, `quickservers`, `servers`.
- **Use `moduleLink()`** to convert module name to URL path (e.g., `webhosting` → `websites`, `quickservers` → `qs`). Import from `@/helpers/moduleLink`.
- **All list views use `<script setup lang="ts">`** — no Options API.

## Instructions

1. **Create the list view file** at `src/views/{service}/{Service}List.vue` (or `{Service}sList.vue` — match existing naming like `DomainsList.vue`, `VpsList.vue`, `WebsitesList.vue`).

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

   const module = '{module_name}';
   const siteStore = useSiteStore();
   watchEffect(() => {
       siteStore.setPageHeading(t('{module_name}.list.title'));
       siteStore.setTitle(t('{module_name}.list.title'));
       siteStore.setBreadcrums([
           ['/home', t('common.breadcrumb.home')],
           ['', t('common.menu.{menuKey}')],
       ]);
   });
   const baseUrl = siteStore.getBaseUrl();

   const columns: ServiceListColumn[] = [
       { key: '{prefix}_id', label: t('common.labels.id') },
       { key: '{prefix}_hostname', label: t('common.labels.hostname'), link: true },
       { key: 'repeat_invoices_cost', label: t('common.labels.cost') },
       { key: '{prefix}_status', label: t('common.labels.status') },
       { key: 'services_name', label: t('common.labels.package') },
       { key: '{prefix}_comment', label: t('common.labels.comments') },
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
           id-field="{prefix}_id"
           status-field="{prefix}_status"
           :order-title="t('{module_name}.list.orderTitle')"
       />
   </template>
   ```

   Replace `{module_name}`, `{prefix}`, and `{menuKey}` with appropriate values. The `{prefix}` is the database table prefix (e.g., `vps`, `website`, `domain`, `floating_ip`).

   Verify: The file uses all 7 imports shown above and follows `<script setup lang="ts">` pattern.

2. **Define columns** using the `ServiceListColumn` interface: `{ key: string; label: string; link?: boolean }`. Set `link: true` on the column that should link to the detail view (typically hostname or name). The `key` must match the API response field name exactly.

   Verify: At minimum include ID, status, and cost columns. The ID column key must match the `id-field` prop.

3. **Register the route** in `src/router/index.ts`. Add a route group following this pattern:

   ```typescript
   {
       path: '/{url_path}',
       meta: { i18n: ['{module_name}'] },
       children: [
           { path: '', component: () => import('../views/{service}/{Service}List.vue') },
           { path: 'order', component: () => import('../views/{service}/Order{Service}.vue') },
           { path: ':id(\\d+)', component: () => import('../views/{service}/View{Service}.vue') },
       ],
   },
   ```

   The `{url_path}` is what `moduleLink(module)` returns. The `meta.i18n` array triggers lazy-loading of that i18n namespace.

   Verify: Route path matches `moduleLink()` output for the module. List route uses empty string path `''`.

4. **Add i18n keys** in `src/locales/en/{module_name}.json` (or `src/locales/en/common.json` if using common namespace). Required keys:
   - `{module_name}.list.title` — page heading and document title
   - `{module_name}.list.orderTitle` — text for the "Order" button
   - Any menu key used in breadcrumbs (e.g., `common.menu.{menuKey}`)

   Verify: Run `yarn dev` and confirm no missing translation warnings in console.

5. **Run checks:**
   ```bash
   yarn ts        # Type-check passes
   yarn lint      # No lint errors
   yarn dev       # Navigate to /{url_path} and verify table renders
   ```

## Examples

**User says:** "Add a list page for SSL certificates"

**Actions:**
1. Create `src/views/ssl/SslList.vue` with `module = 'ssl'`, prefix `ssl`, columns for `ssl_id`, `ssl_hostname`, `repeat_invoices_cost`, `ssl_status`, `services_name`
2. Set breadcrumbs: `['/home', 'Home'], ['', 'SSL Certificates']`
3. API call: `` fetchWrapper.get(`${baseUrl}/ssl`) `` (since `moduleLink('ssl')` returns `'ssl'`)
4. Template props: `id-field="ssl_id"`, `status-field="ssl_status"`
5. Register route at `/ssl` in router with `meta: { i18n: ['ssl'] }`

**Result:** Navigating to `/ssl` shows a sortable, filterable table of SSL certificates with status tabs, export buttons, and links to detail views.

## Common Issues

- **Empty table, no errors:** The API endpoint path doesn't match. Check `moduleLink()` — it remaps `webhosting` → `websites` and `quickservers` → `qs`. All other modules use their name directly. Log the full URL in `loadData` to verify.

- **"Cannot read properties of undefined (reading 'map')":** The API returned an object instead of an array. Some endpoints wrap data in `{ data: [...] }`. Check the raw response and adjust: `data.value = response.data ?? response;`

- **Columns show `undefined` values:** Column `key` doesn't match the API response field name. Log `response[0]` to see actual field names and update column keys accordingly.

- **Page heading/title not updating:** Missing `watchEffect` wrapper around `siteStore.setPageHeading()` and `siteStore.setTitle()`. These must be inside `watchEffect` so they re-run when the i18n locale changes.

- **Route not found (404 redirect to home):** The route was added after the catch-all `/:pathMatch(.*)*` redirect at the bottom of `src/router/index.ts`. Move it above the catch-all.

- **i18n warnings in console:** The `meta: { i18n: ['{namespace}'] }` in the route config is missing or the namespace JSON file doesn't exist at `src/locales/en/{namespace}.json`.