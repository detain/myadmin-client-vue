---
name: add-route
description: Adds new route entries to src/router/index.ts following the project's nested route pattern with lazy-loaded components, meta.i18n namespaces, parameterized :id(\d+) paths, and :link(action1|action2) sub-routes. Use when user says 'add route', 'new page route', 'register route for new service'. Do NOT use for redirect-only routes.
---
# Add Route

## Critical

- **All routes go in `src/router/index.ts`** — the single route definition file. Never create separate route files.
- **Every route must have `meta: { i18n: ['namespace'] }`** matching a locale file in `src/locales/en/{namespace}.json`. Without this, translations won't load.
- **All view components must be lazy-loaded** using `() => import('../views/...')` — never static imports.
- **Use `../views/` relative imports** in route definitions (not the `@/` alias). This is the existing convention in `src/router/index.ts`.
- **ID params use `\\d+` regex**: `:id(\\d+)` — never bare `:id`.
- **Service domains use a nested children pattern** — parent defines `path` and `meta`, children define individual views.

## Instructions

### Step 1: Create the view directory and files

Create `src/views/{domain}/` with the required Vue SFC files. Standard service domains need three files:

- `{Domain}List.vue` — list page (mapped to empty child path `''`)
- `Order{Domain}.vue` — order page (mapped to child path `'order'`)
- `View{Domain}.vue` — detail page (mapped to `:id(\\d+)` and `:id(\\d+)/:link(...)` paths)

All files must use `<script setup lang="ts">`. Verify files exist before proceeding.

### Step 2: Create the i18n namespace file

Create `src/locales/en/{domain}.json` with at least `{}` as content. The namespace name must match what you put in `meta.i18n`.

Verify: `src/locales/en/{domain}.json` exists.

### Step 3: Add the route block to `src/router/index.ts`

Insert the new route block **before the `// fallback compatibility routes` comment** (line ~219). Follow this exact pattern:

```typescript
{
    path: '/{domain}',
    meta: { i18n: ['{domain}'] },
    children: [
        { path: '', component: () => import('../views/{domain}/{Domain}List.vue') },
        { path: 'order', component: () => import('../views/{domain}/Order{Domain}.vue') },
        { path: ':id(\\d+)', component: () => import('../views/{domain}/View{Domain}.vue') },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices)', component: () => import('../views/{domain}/View{Domain}.vue') },
    ],
},
```

Key rules:
- The `:link(...)` sub-route lists actions as `|`-separated values inside parentheses
- Both `:id(\\d+)` and `:id(\\d+)/:link(...)` point to the **same** `View{Domain}.vue` component
- Parent route has **no `component`** — only `path`, `meta`, and `children`
- Indent with 4 spaces (Prettier config)

Verify: Run `yarn ts` to type-check. No errors should appear from the router file.

### Step 4: Add to warmFrequentlyUsedRoutes (if high-traffic)

If this is a frequently accessed route, add it to the `warmFrequentlyUsedRoutes()` array in `src/router/index.ts`:

```typescript
export function warmFrequentlyUsedRoutes() {
    ['/domains', '/servers', '/vps', '/websites', '/tickets', '/invoices', '/account/info', '/{domain}'].forEach((path) => warmRouteByLocation(path));
}
```

Only add if the route will be commonly visited. Skip for niche services.

### Step 5: Add compatibility redirects (if replacing legacy routes)

If this route replaces old-style URLs, add redirects **after** the `// fallback compatibility routes` comment:

```typescript
{ path: '/view_{domain}', redirect: (to) => (to.query.id ? `/{domain}/${to.query.id}` : '/{domain}') },
{ path: '/view_{domain}_list', redirect: '/{domain}' },
{ path: '/order_{domain}', redirect: '/{domain}/order' },
{ path: '/{domain}_order', redirect: '/{domain}/order' },
```

## Examples

**User says:** "Add a route for a new 'storage' service"

**Actions taken:**
1. Create `src/views/storage/StorageList.vue`, `src/views/storage/OrderStorage.vue`, `src/views/storage/ViewStorage.vue` with `<script setup lang="ts">`
2. Create `src/locales/en/storage.json` with `{}`
3. Add to `src/router/index.ts` before fallback routes:
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
4. Add compatibility redirects.

**Result:** `/storage` shows list, `/storage/order` shows order form, `/storage/123` shows detail, `/storage/123/cancel` shows cancel action.

## Common Issues

- **"Cannot find module '../views/storage/StorageList.vue'"**: The view file doesn't exist yet. Create it before adding the route. Even an empty `<script setup lang="ts"></script><template><div></div></template>` is enough.
- **Translations not loading on navigation**: The `meta.i18n` namespace doesn't match any file in `src/locales/en/`. Check the filename matches exactly (e.g., `floating_ips` not `floatingIps`).
- **Route not matching numeric IDs**: You used `:id` instead of `:id(\\d+)`. The regex constraint is required.
- **`:link` sub-route showing blank page**: The `View{Domain}.vue` component doesn't read `route.params.link`. Add `const route = useRoute()` and switch on `route.params.link` to render the correct sub-view.
- **Vite chunk naming**: Views under `src/views/{domain}/` are automatically chunked as `view-{domain}` by `vite.config.ts`. No manual chunk config needed.
- **New route not in sidebar menu**: Routes are registered but menu items are separate. Update `src/components/MainMenu.vue` to add a navigation link.