---
name: add-route
description: Adds new route entries to src/router/index.ts following the project's nested route pattern with lazy-loaded components, meta.i18n namespaces, parameterized :id(\d+) paths, and :link(action1|action2) sub-routes. Use when user says 'add route', 'new page route', 'register route for new service'. Do NOT use for redirect-only routes.
---
# Add Route

## Critical

- **All routes go in `src/router/index.ts`** — there is no separate route file per domain.
- **Never use raw `import` statements for route components** — always use lazy-loaded arrow functions: `() => import('../views/...')`.
- **Every route must have `meta: { i18n: ['namespace'] }`** — the router's `beforeEach` guard loads these namespaces before rendering.
- **Use `../views/` relative path in imports**, not the `@/` alias (this is the existing convention in the router file).
- **Service routes follow a strict 4-child pattern**: list → order → view by ID → view by ID with link actions.

## Instructions

### Step 1: Identify the route type

Determine which pattern applies by examining existing routes in `src/router/index.ts`:

| Type | Example files | Pattern |
|------|---------|--------|
| **Service domain** (most common) | `src/views/vps/VpsList.vue` → `src/views/vps/ViewVps.vue` | Nested children: list, order, `:id(\\d+)`, `:id(\\d+)/:link(...)` |
| **Account section** | `src/views/account/ContactInfo.vue`, `src/views/account/ChangePass.vue` | Nested children with named sub-paths, no numeric IDs |
| **Standalone page** | `src/views/billing/PrePays.vue`, `src/views/billing/Cart.vue` | Single flat route with component + meta |

Verify the i18n namespace exists (e.g., `src/locales/en/vps.json`, `src/locales/en/billing.json`) before proceeding. Create it if missing using the `add-i18n-locale` skill.

### Step 2: Create the view files

Before adding routes, ensure the target components exist. For a service domain like `backups`:

- `src/views/backups/BackupsList.vue` — list page
- `src/views/backups/OrderBackup.vue` — order page (if applicable)
- `src/views/backups/ViewBackup.vue` — detail/view page

```bash
ls src/views/backups/
```

Verify all referenced component files exist before proceeding to Step 3.

### Step 3: Add the route block to `src/router/index.ts`

Insert the new route block **before the `// fallback compatibility routes` comment** (line ~219). Follow the pattern of the existing VPS route block (line ~198) or backups block (line ~87):

```typescript
{
    path: '/storage',
    meta: { i18n: ['storage'] },
    children: [
        { path: '', component: () => import('../views/storage/StorageList.vue') },
        { path: 'order', component: () => import('../views/storage/OrderStorage.vue') },
        { path: ':id(\\d+)', component: () => import('../views/storage/ViewStorage.vue') },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices)', component: () => import('../views/storage/ViewStorage.vue') },
    ],
},
```

Key details:
- **`:id(\\d+)`** — numeric ID constraint uses double-escaped backslash in the string
- **`:link(action1|action2|...)`** — pipe-separated list of valid sub-actions; always include `cancel` and `invoices`
- The `:link` route points to the **same** View component as the `:id` route
- No `component` on the parent — only on children (the parent has no layout component in this project; note the commented-out lines)
- Keep routes alphabetically ordered among the service domain blocks

Verify the route block compiles:

```bash
yarn ts
```

### Step 4: Add compatibility redirects (if replacing legacy routes)

If the new routes replace old query-param-based URLs, add redirects after the `// fallback compatibility routes` comment (line ~219 of `src/router/index.ts`):

```typescript
{ path: '/view_storage', redirect: (to) => (to.query.id ? `/storage/${to.query.id}` : '/storage') },
{ path: '/view_storage_list', redirect: '/storage' },
{ path: '/order_storage', redirect: '/storage/order' },
{ path: '/storage_order', redirect: '/storage/order' },
```

Verify redirects resolve correctly by checking existing patterns in the file (e.g., the domain and VPS redirects at lines ~226-261).

### Step 5: Add to route warmup (if high-traffic)

If this is a frequently accessed route, add it to the `warmFrequentlyUsedRoutes()` function at line ~293 of `src/router/index.ts`:

```typescript
export function warmFrequentlyUsedRoutes() {
    ['/domains', '/servers', '/vps', '/websites', '/tickets', '/invoices', '/account/info', '/storage'].forEach((path) => warmRouteByLocation(path));
}
```

Verify the dev server starts without errors:

```bash
yarn dev
```

## Examples

### Adding a service domain route for "storage"

**User says:** "Add routes for a new storage service"

**Actions:**
1. Confirm view files exist: `src/views/storage/StorageList.vue`, `src/views/storage/OrderStorage.vue`, `src/views/storage/ViewStorage.vue`
2. Confirm i18n namespace: `src/locales/en/storage.json` exists
3. Add route block before fallback redirects in `src/router/index.ts`:

```typescript
{
    path: '/storage',
    meta: { i18n: ['storage'] },
    children: [
        { path: '', component: () => import('../views/storage/StorageList.vue') },
        { path: 'order', component: () => import('../views/storage/OrderStorage.vue') },
        { path: ':id(\\d+)', component: () => import('../views/storage/ViewStorage.vue') },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|resize)', component: () => import('../views/storage/ViewStorage.vue') },
    ],
},
```

4. Add compatibility redirects:
```typescript
{ path: '/view_storage', redirect: (to) => (to.query.id ? `/storage/${to.query.id}` : '/storage') },
{ path: '/view_storage_list', redirect: '/storage' },
{ path: '/order_storage', redirect: '/storage/order' },
{ path: '/storage_order', redirect: '/storage/order' },
```

5. Run `yarn ts` to verify.

**Result:** Routes for `/storage`, `/storage/order`, `/storage/123`, `/storage/123/cancel` all resolve correctly.

### Adding a standalone page route

**User says:** "Add a route for a new reports page"

**Actions:**
1. Add single route in `src/router/index.ts`:
```typescript
{ path: '/reports', component: () => import('../views/billing/Reports.vue'), meta: { i18n: ['billing'] } },
```
2. Run `yarn ts`.

## Common Issues

- **"Module not found" error after adding route:** The component path in the `import()` is wrong. Check that the file exists at the exact path. Use `../views/` prefix (not `@/views/`), matching the existing convention in `src/router/index.ts`.

- **i18n keys showing raw `key.name` instead of translated text:** The route's `meta: { i18n: [...] }` namespace doesn't match a file in `src/locales/en/`. Create the locale file (e.g., `src/locales/en/storage.json`) with at least `{}` as content.

- **Route params not matching (404 on `/storage/123`):** Ensure the `:id(\\d+)` constraint uses double backslash. A single `\d+` will be interpreted as an escape sequence, not a regex.

- **Sub-action link returns 404 (e.g., `/vps/123/cancel`):** The action name is missing from the `:link(...)` pipe-separated list. Add it to the regex: `:link(existing_actions|new_action)`.

- **New route not appearing in navigation:** Routes alone don't add menu items. Update `src/components/MainMenu.vue` separately.

- **Catch-all redirect swallowing new route:** The `/:pathMatch(.*)*` catch-all is last in `src/router/index.ts`, so this shouldn't happen. If it does, ensure the new route block is inserted **above** the fallback section at line ~219.