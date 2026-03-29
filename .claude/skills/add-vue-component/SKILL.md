---
name: add-vue-component
description: Creates a new shared Vue component in src/components/ following the project's Composition API pattern with <script setup lang='ts'>, useI18n(), and Admin-LTE/Bootstrap 4 markup. Handles props typing, emits, and fetchWrapper integration. Use when user says 'add component', 'create shared component', 'new reusable widget'. Do NOT use for view pages (use add-service-view/add-service-list) or store files.
---
# Add Vue Component

## Critical

- **Every component MUST have two script blocks**: `<script setup lang="ts">` AND `<script lang="ts">` with a `name` export matching the filename.
- **Never use `axios` or raw `fetch`** — always `fetchWrapper` from `@/helpers/fetchWrapper`.
- **Never add `<i18n>` SFC blocks** — use `useI18n()` with lazy-loaded namespace JSON files.
- **Use `@/` alias** for all imports — never relative paths like `../../stores/`.
- **Do NOT create view pages with this skill** — use `add-service-view` or `add-service-list` instead.

## Instructions

### Step 1: Determine component location and name

1. Choose PascalCase filename: e.g., `ServiceStatusBadge.vue`, `AccountFeatures.vue`
2. Place in `src/components/` for shared components, or in a domain-scoped subdirectory like `src/components/account/` (contains `ApiAccess.vue`, `SshKeys.vue`, `TwoFactorAuth.vue`) or `src/components/services/` (contains `Cancel.vue`, `Invoices.vue`)
3. Verify the directory exists:

```bash
ls src/components/account/
ls src/components/services/
```

Create a new subdirectory only if needed.

### Step 2: Define the component interface

Define props using a TypeScript interface above `defineProps`:

```typescript
interface Props {
    title: string;
    data: Record<string, any>;
    showHeader?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showHeader: true,
});
```

For simple props (2-3 fields), inline typing is acceptable:
```typescript
const props = defineProps<{ id: number; module: string }>();
```

If you need computed wrappers for props (common in action components):
```typescript
const id = computed(() => props.id);
```

Verify: Props interface uses proper TypeScript types. Optional props have defaults via `withDefaults`.

### Step 3: Write the `<script setup lang="ts">` block

Follow this exact import order:

```typescript
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'; // 1. Vue core (only what's used)
import { useI18n } from 'vue-i18n';                     // 2. vue-i18n
import { storeToRefs } from 'pinia';                    // 3. Pinia (if using storeToRefs)
import { useRouter } from 'vue-router';                 // 4. Vue Router (if navigating)
import Swal from 'sweetalert2';                         // 5. External packages
import { fetchWrapper } from '@/helpers/fetchWrapper';   // 6. Helpers
import { moduleLink } from '@/helpers/moduleLink';       // 7. More helpers
import { useSiteStore } from '@/stores/site.store';     // 8. Stores
import type { MyType } from '@/types/mytype';           // 9. Types (use `import type`)

const { t } = useI18n();  // ALWAYS first line after imports
```

Only import what you actually use. Remove unused imports.

Verify: `const { t } = useI18n();` is present. All paths use `@/` alias.

### Step 4: Add reactive state

Use `ref()` for all reactive state:
```typescript
const loading = ref(true);
const items = ref<MyType[]>([]);
const searchInput = ref('');
```

Use `computed()` for derived values:
```typescript
const filteredItems = computed(() => {
    return items.value.filter(item => item.active);
});
```

For store access, use `storeToRefs` only when you need reactive refs from the store:
```typescript
const alertStore = useAlertStore();
const { alert } = storeToRefs(alertStore);
```

For calling store methods, use the store directly:
```typescript
const siteStore = useSiteStore();
siteStore.setBreadcrums([{ title: 'Home', link: '/' }]);
```

### Step 5: Add data fetching (if needed)

Use `fetchWrapper` with the site store base URL:
```typescript
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();

onMounted(async () => {
    loading.value = true;
    try {
        const response = await fetchWrapper.get(`${baseUrl}/endpoint`);
        items.value = response;
    } catch (error: any) {
        console.log('fetch failed', error);
    } finally {
        loading.value = false;
    }
});
```

For POST requests:
```typescript
fetchWrapper.post(`${baseUrl}/endpoint`, { key: value }).then((response) => {
    console.log('success', response);
});
```

Verify: No raw `fetch()` or `axios` calls. URLs use template literals with `baseUrl`.

### Step 6: Add the name export block

Always add a second script block with the component name matching the filename:
```typescript
<script lang="ts">
export default {
    name: 'ServiceStatusBadge',
};
</script>
```

Verify: Name matches PascalCase filename exactly (without `.vue`).

### Step 7: Write the template

Use Admin-LTE + Bootstrap 4 classes. Common patterns:

**Card layout:**
```html
<template>
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">{{ t('namespace.title') }}</h3>
            <div class="card-tools">
                <button type="button" class="btn btn-tool" :title="t('common.buttons.refresh')">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
        </div>
        <div class="card-body">
            <!-- content -->
        </div>
    </div>
</template>
```

**Info box (AdminLTE small-box):**
```html
<div class="small-box bg-success b-radius">
    <div class="inner">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
    </div>
    <div class="small-box-footer">&nbsp;</div>
</div>
```

**Tables:** `.table .table-striped .table-hover .table-bordered`
**Buttons:** `.btn .btn-primary`, `.btn .btn-sm .btn-info`
**Grid:** `.row` > `.col-md-6`, `.col-lg-4`, etc.
**Icons:** `<i class="fas fa-edit"></i>` or `<i class="material-icons">icon_name</i>`

Use `t()` for all user-visible text. Use `v-if` for conditional rendering, `v-for` with `:key` for lists.

Verify: No hardcoded English strings in the template. Bootstrap 4 grid classes used.

### Step 8: Add SweetAlert2 confirmations (if needed)

For destructive or confirming actions:
```typescript
import Swal from 'sweetalert2';

function onConfirm() {
    Swal.fire({
        icon: 'question',
        title: `<h3>${t('namespace.confirmTitle')}</h3>`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: t('common.confirm.yes'),
        html: `<p>${t('namespace.confirmMessage')}</p>`,
        preConfirm: () => {
            return fetchWrapper.get(`${baseUrl}/action`).then((response) => {
                console.log('action success', response);
            });
        },
    });
}
```

### Step 9: Verify the component

```bash
yarn ts                  # Type-check
yarn lint                # Fix style issues
yarn dev                 # Check rendering at localhost:5173
```

If the component has i18n keys, verify the namespace JSON exists in `src/locales/en/` (e.g., `src/locales/en/vps.json`).

## Examples

**User says:** "Create a shared component for displaying service status badges"

**Actions:**
1. Create `src/components/ServiceStatusBadge.vue`
2. Define props: `{ status: string; module: string }`
3. Add computed for badge color class based on status
4. Use AdminLTE small-box markup with dynamic `bg-*` class
5. Add name export block
6. Run `yarn ts` to verify

**Result:** `src/components/ServiceStatusBadge.vue`
```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{ status: string; module: string }>();

const badgeClass = computed(() => {
    const map: Record<string, string> = { active: 'bg-success', pending: 'bg-orange', cancelled: 'bg-red' };
    return map[props.status] || 'bg-secondary';
});
</script>

<script lang="ts">
export default {
    name: 'ServiceStatusBadge',
};
</script>

<template>
    <span class="badge" :class="badgeClass">{{ t(`common.labels.${status}`) }}</span>
</template>
```

## Common Issues

- **`Cannot find module '@/stores/xxx.store'`**: The store file doesn't exist yet. Create it first with the `add-pinia-store` skill, or verify the exact filename in `src/stores/` (e.g., `src/stores/mail.store.ts`, `src/stores/vps.store.ts`).
- **`Property 'xxx' does not exist on type`**: You're accessing a prop without `props.` prefix. Use `props.myProp` in script, or just `myProp` in template.
- **`useI18n` must be called at the top of setup**: Move `const { t } = useI18n();` to be the first line after imports, before any other composable calls.
- **`Component name "MyComponent" should always be multi-word`**: ESLint vue/multi-word-component-names rule. Use two+ word names like `ServiceBadge` not `Badge`.
- **Missing translations at runtime**: Verify the i18n namespace is listed in the route's `meta: { i18n: [...] }` array in `src/router/index.ts`, and the key exists in the English locale file (e.g., `src/locales/en/vps.json`).
- **`fetchWrapper is not defined`**: You forgot to import it. Add `import { fetchWrapper } from '@/helpers/fetchWrapper';`