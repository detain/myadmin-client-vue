---
name: add-i18n-locale
description: Creates a new i18n locale namespace JSON file in src/locales/en/{namespace}.json with properly structured translation keys, then propagates to other language directories. Use when user says 'add translations', 'new locale file', 'add i18n namespace', or creates a new view domain that needs translations. Do NOT use for editing existing locale files or fixing individual translation keys.
---
# Add i18n Locale Namespace

## Critical

- **Never create `<i18n>` SFC blocks** — all translations go in locale JSON files under `src/locales/` (e.g., `src/locales/en/vps.json`, `src/locales/fr/vps.json`)
- The namespace name must match the route's `meta: { i18n: ['...'] }` value exactly (e.g., `floating_ips` not `floatingIps`)
- Use **snake_case** for namespace filenames matching the view directory name (e.g., `src/locales/en/floating_ips.json` for `src/views/floating_ips/`)
- The English (`en`) file is the source of truth — all other locales mirror its exact key structure
- There are 110 locale directories under `src/locales/`. Propagation creates the same file in every directory.

## Instructions

### Step 1: Determine the namespace name

The namespace must match the domain directory name in `src/views/`. Existing examples:

| View directory | Namespace file | Route meta |
|---|---|---|
| `src/views/vps/` | `src/locales/en/vps.json` | `['vps']` |
| `src/views/floating_ips/` | `src/locales/en/floating_ips.json` | `['floating_ips']` |
| `src/views/dns/` | `src/locales/en/dns.json` | `['dns']` |
| `src/views/billing/` | `src/locales/en/billing.json` | `['billing']` |

**Verify**: Confirm the namespace doesn't already exist:

```bash
ls src/locales/en/storage.json 2>/dev/null && echo 'EXISTS' || echo 'DOES NOT EXIST'
```

If it exists, stop — this skill is not for editing existing files.

### Step 2: Create the English source file

Create the new namespace JSON in `src/locales/en/` (e.g., `src/locales/en/storage.json` for a storage domain). Follow the standard key structure based on what the domain needs:

```json
{
    "list": {
        "title": "{Domain} Services List",
        "orderTitle": "Order {Domain} Registrations"
    },
    "view": {
        "title": "View {Domain} {id}",
        "package": "Package",
        "nextInvoiceDate": "Next Invoice Date:",
        "billing": "Billing",
        "billed": "billed:",
        "statusIs": "Status is:",
        "links": "Links",
        "welcomeEmailConfirm": "Are you sure you want to resend the welcome email?",
        "emailSent": "Email Sent",
        "emailSentMessage": "The welcome email has been resent. Check your inbox."
    },
    "order": {
        "title": "Order {Domain}"
    }
}
```

Key conventions:
- Top-level keys group by page/feature: `list`, `view`, `order`, plus domain-specific sections
- Use `camelCase` for key names: `nextInvoiceDate`, `confirmDelete`, `emailSentMessage`
- Use `{id}`, `{field}`, `{name}` for interpolation parameters (curly braces, no `$`)
- Indent with 4 spaces, trailing newline
- Values are human-readable English sentences or labels
- Reference existing files like `src/locales/en/vps.json` or `src/locales/en/mail.json` for real examples of key structure

**Verify**: The JSON is valid and keys match the UI elements planned for the views:

```bash
node -e "require('./src/locales/en/storage.json')" && echo 'Valid JSON'
```

### Step 3: Propagate to all locale directories

Copy the English file to every other locale directory. All non-English locales start with the English text (translated later):

```bash
for dir in src/locales/*/; do
    lang=$(basename "$dir")
    if [ "$lang" != "en" ]; then
        cp src/locales/en/storage.json "$dir/storage.json"
    fi
done
```

This includes the 7 themed locales: `pirate`, `space`, `fantasy`, `wizard`, `feudal`, `mad_scientist`, `merchant`. They must also get the file — themed locales maintain identical key structure with creative vocabulary.

**Verify**:

```bash
ls src/locales/*/storage.json | wc -l
```

Should equal the total number of locale directories (110).

### Step 4: Register the namespace in route meta

In `src/router/index.ts`, add `meta: { i18n: ['storage'] }` to every route that uses this domain's views. Follow the pattern of existing routes like the VPS block (line ~198) or mail block (line ~144):

```typescript
{
    path: '/storage',
    meta: { i18n: ['storage'] },
    children: [
        { path: '', component: () => import('../views/storage/StorageList.vue') },
        { path: ':id(\\d+)', component: () => import('../views/storage/ViewStorage.vue') },
        { path: ':id(\\d+)/:link(cancel|invoices)', component: () => import('../views/storage/ViewStorage.vue') },
        { path: 'order', component: () => import('../views/storage/OrderStorage.vue') },
    ],
},
```

The `meta: { i18n: [...] }` array triggers automatic namespace loading in the router's `beforeEach` guard (line ~297 of `src/router/index.ts`). Multiple namespaces can be listed: `['billing', 'validation']`.

**Verify**:

```bash
yarn ts
```

Passes with no type errors.

### Step 5: Use translations in components

In view components, import and use `useI18n`:

```typescript
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
```

Template usage: `{{ t('storage.list.title') }}` or `{{ t('storage.view.title', { id: serviceId }) }}`

Script usage: `t('storage.view.welcomeEmailConfirm')`

**Verify**: Run `yarn dev` and navigate to the route — translations should render without `[intlify]` warnings in console.

## Examples

**User says**: "Add i18n namespace for the new storage domain"

**Actions**:
1. Confirm `src/locales/en/storage.json` doesn't exist
2. Create `src/locales/en/storage.json` with `list`, `view`, `order` sections using storage-specific labels
3. Run the propagation loop to copy to all 110 locale directories (matching count of `src/locales/en/`, `src/locales/fr/`, `src/locales/pirate/`, etc.)
4. Add `meta: { i18n: ['storage'] }` to storage routes in `src/router/index.ts`
5. In `StorageList.vue`, use `const { t } = useI18n()` and reference `t('storage.list.title')`

**Result**: The new locale file exists in all directories alongside existing files like `src/locales/en/vps.json` and `src/locales/en/mail.json`. Route navigation auto-loads the namespace. Components display translated strings.

## Common Issues

**"Unknown message key: storage.list.title"**: The namespace isn't in the route's `meta: { i18n: [...] }` array. Add it to the route definition in `src/router/index.ts`.

**Translations show raw keys in production but work in dev**: The namespace file is missing from non-English locale directories. Re-run the propagation loop from Step 3.

**`[intlify] Not found 'storage' key in 'en' locale messages`**: The JSON file exists but hasn't been loaded. Ensure the route's `meta: { i18n: [...] }` includes the namespace — the `beforeEach` guard at line ~297 of `src/router/index.ts` handles loading.

**JSON parse error on dev server start**: Invalid JSON in the locale file. Check for trailing commas, missing quotes, or unescaped characters:

```bash
node -e "require('./src/locales/en/storage.json')"
```

**Themed locales show English instead of themed text**: This is expected after propagation. Themed locale files (`src/locales/pirate/`, `src/locales/space/`, `src/locales/fantasy/`, `src/locales/wizard/`, `src/locales/feudal/`, `src/locales/mad_scientist/`, `src/locales/merchant/`) need manual creative rewriting to match their theme vocabulary.