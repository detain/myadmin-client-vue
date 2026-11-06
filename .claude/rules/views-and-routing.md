---
paths:
  - src/views/**
  - src/router/index.ts
---

# Views & Routing

- Every route in `src/router/index.ts` uses lazy `() => import('../views/...')` with `meta: { i18n: ['namespace'] }`. The `beforeEach` guard calls `loadLocaleMessages(locale, ns)` before rendering.
- Convention: `../views/` relative path (not `@/views/`) — matches existing entries.
- Service routes follow 4-child pattern: `{ path: '' }` (list), `{ path: 'order' }`, `{ path: ':id(\\d+)' }` (view), `{ path: ':id(\\d+)/:link(action1|action2|...)' }` (sub-action). See `/vps`, `/domains`, `/backups` blocks.
- Module path != module name: `webhosting` → `/websites`, `quickservers` → `/qs`. Mappings live in `src/helpers/moduleLink.ts`.
- View files: list `{Domain}sList.vue`, detail `View{Domain}.vue`, order `Order{Domain}.vue`, sub-actions named after `:link` value.
- `View{Service}.vue` reads `route.params.id` as non-reactive `Number(route.params.id)` but `link` must be `computed(() => route.params.link)`.
- Call `store.getById(id)` at module scope (not in `onMounted`).
- Import shared CSS: `@import '../../assets/css/view_service.css'` in `<style>`.
- Set breadcrumbs/title via `useSiteStore().setBreadcrums()` + `setPageHeading()` + `setTitle()` inside `watchEffect(() => {...})`.
- Use `ServiceListTable` from `@/components/ServiceListTable.vue` for all list pages with typed `ServiceListColumn[]`.
- Sub-actions always import `Cancel` + `Invoices` from `@/components/services/`.
- Redirect-only legacy routes go in the `// fallback compatibility routes` section near end of `src/router/index.ts`.
