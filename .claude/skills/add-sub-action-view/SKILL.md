---
name: add-sub-action-view
description: Scaffolds a new sub-action child component for VPS/QS/server/website services (e.g., src/views/vps/ChangeTimezone.vue, src/views/quickservers/Backup.vue). Sub-actions are rendered inside View{Service}.vue when route.params.link matches the action name in the :link(...) enum in src/router/index.ts. Uses fetchWrapper, Swal confirmations, useI18n() with the parent namespace, and follows the structure of existing sub-actions like src/views/vps/ResetPassword.vue or src/views/vps/ChangeTimezone.vue. Use when user says 'add sub-action', 'new VPS action', 'add ChangeX page', 'register new :link action'. Do NOT use for top-level list/view/order pages (use add-service-list/add-service-view/add-route).
paths:
  - src/views/vps/**/*.vue
  - src/views/quickservers/**/*.vue
  - src/views/servers/**/*.vue
  - src/views/webhosting/**/*.vue
  - src/router/index.ts
  - src/locales/en/*.json
---
# Add Sub-Action View

Scaffolds a sub-action child view rendered inside a parent service view such as `src/views/vps/ViewVps.vue` when the route's `link` param matches a string in the `:link(...)` enum defined in `src/router/index.ts`. Sub-actions are SFCs in service directories like `src/views/vps/`, `src/views/quickservers/`, `src/views/servers/`, and `src/views/webhosting/` that POST/GET against `{baseUrl}/{moduleLink(module)}/{id}/{action_name}`.

## Critical

- The action name MUST use `snake_case` (e.g. `change_timezone`, `reset_password`) in three places: the `:link(...)` router enum in `src/router/index.ts`, the `link == '...'` branch in the parent view (`src/views/vps/ViewVps.vue` etc.), and the URL passed to `fetchWrapper`. The Vue filename and component name use `PascalCase` (e.g. `src/views/vps/ChangeTimezone.vue`).
- The i18n key uses `camelCase` under the parent namespace (e.g. `vps.changeTimezone`). Never create a new locale namespace for a sub-action — reuse the parent service namespace (`vps`, `quickservers`, `webhosting`, `servers`) in `src/locales/en/`.
- Sub-actions MUST accept `id: number` and `module: string` as props. Most also accept `serviceInfo` (typed as `VpsInfo | QsInfo` for shared VPS/QS actions) or one or two scalar fields from `serviceInfo` (e.g. `curHostname: string`).
- Use `fetchWrapper` from `@/helpers/fetchWrapper` — NEVER raw `fetch` or `axios`.
- Use `moduleLink(module.value)` from `@/helpers/moduleLink` to build URLs — NEVER concatenate the raw module name.
- Use `Swal.fire(...)` for success/error feedback. The error key follows the parent's pattern, typically `vps.common.gotError` with `{ error: error.message }` or a local `gotError` with `{ message: error.message }`.
- Forms MUST include `<input type="hidden" name="link" value="{action_name}" />` (matches the legacy backend convention).

## Instructions

### Step 1 — Pick the service and action name

Identify the parent service directory and the snake_case action name. Verify the parent view exists:

```
src/views/vps/ViewVps.vue          # vps. namespace
src/views/quickservers/ViewQs.vue  # quickservers. namespace
src/views/servers/ViewServer.vue   # servers. namespace
src/views/webhosting/ViewWebsite.vue # webhosting. namespace
```

Verify the action does not already appear in the `:link(...)` enum for that service in `src/router/index.ts`. If it does, the sub-action already exists — abort and ask the user.

### Step 2 — Register the action in the router

Edit `src/router/index.ts`. Find the line for the service:

```ts
{ path: ':id(\\d+)/:link(backup|backups|...|view_desktop)', component: () => import('../views/vps/ViewVps.vue') },
```

Add the new action name (snake_case) to the pipe-delimited list inside `:link(...)`. Keep the list alphabetical-ish — match the surrounding order. Do NOT add a new route entry; the sub-action shares the parent view's route.

Verify by re-reading the line and confirming the new token appears exactly once.

### Step 3 — Create the sub-action SFC

Create the new file under the matching service directory (e.g. `src/views/vps/ResetFirewall.vue`) modeled on `src/views/vps/ChangeTimezone.vue` (preferred — uses `ServiceActionCardHeader`) or `src/views/vps/ResetPassword.vue` (simpler form-only pattern).

Minimal skeleton (for a form that POSTs):

```vue
<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import { VpsInfo } from '@/types/vps';
import { QsInfo } from '@/types/qs';
import Swal from 'sweetalert2';
import ServiceActionCardHeader from '@/components/services/ServiceActionCardHeader.vue';

const { t } = useI18n();

const props = defineProps<{
    id: number;
    module: string;
    serviceInfo: VpsInfo | QsInfo;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => props.id);
const module = computed(() => props.module);

// reactive form state
const fieldValue = ref('');

async function submitForm() {
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('vps.actionCamel.pleaseWait')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        const response = await fetchWrapper.post(
            `${baseUrl}/${moduleLink(module.value)}/${id.value}/action_snake`,
            { field: fieldValue.value },
        );
        Swal.close();
        Swal.fire({ icon: 'success', html: t('vps.actionCamel.success', { text: response.text }) });
    } catch (error: any) {
        Swal.close();
        Swal.fire({ icon: 'error', html: t('vps.actionCamel.gotError', { message: error.message }) });
    }
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <ServiceActionCardHeader
                    :title="t('vps.actionCamel.title', { module: module })"
                    material-icon="settings"
                    :back-to="'/' + moduleLink(module) + '/' + props.id"
                />
                <div class="card-body pb-0">
                    <form @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="action_snake" />
                        <!-- form-group rows here -->
                        <hr />
                        <div class="row justify-content-center">
                            <div class="controls col-md-12" style="text-align: center">
                                <input type="submit" :value="t('vps.actionCamel.submit')" class="btn btn-sm btn-order px-3 py-2" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
```

Replace `actionCamel` and `action_snake` placeholders with your real names. Drop the `serviceInfo` prop and use scalar props (e.g. `curHostname: string`) if the action only needs one or two fields — match the existing component closest in shape.

If the action needs a GET to pre-populate (like the timezone fetcher in `src/views/vps/ChangeTimezone.vue`), do a top-level `await` on `fetchWrapper.get(...)` in `<script setup>` — Vue 3 supports top-level await inside `<Suspense>`-wrapped routes.

Verify the file lints: `yarn lint` should not report errors on the new file.

### Step 4 — Wire it into the parent view

Edit the parent view file (e.g. `src/views/vps/ViewVps.vue`):

1. Add an import next to the other sub-action imports (keep alphabetical):

   ```ts
   import ChangeTimezone from '@/views/vps/ChangeTimezone.vue';
   ```

2. Add a `v-else-if` branch in the `<div v-if="link" class="row">` block, matching the style of neighboring entries:

   ```vue
   <div v-else-if="link == 'action_snake'" class="col">
       <PascalName :id="id" :module="module" :service-info="serviceInfo"></PascalName>
   </div>
   ```

   Pass only the props the component actually declares. Common prop combos found in the codebase:
   - `:id :module :cur-hostname="serviceInfo.vps_hostname"` (simple form actions)
   - `:id :module :service-info="serviceInfo"` (actions reading multiple fields)
   - `:id :module :service-info :currency-symbol="custCurrencySymbol"` (billing-related, like BuyIp/Slices)

Verify by re-reading the `v-if="link"` block and confirming the new branch sits between sibling branches in roughly alphabetical order.

### Step 5 — Add i18n keys

Edit `src/locales/en/vps.json` (or matching service namespace). Add a top-level key matching the camelCase action name with the strings your template references. Mirror the existing structure:

```json
"changeTimezone": {
    "title": "Change {module} Timezone",
    "pleaseWait": "Please wait!",
    "success": "Success{text}",
    "gotError": "Got error {message}",
    "submit": "Change Zone"
}
```

Do NOT translate to other languages — translations are managed separately. Only add to `src/locales/en/`.

Verify with `yarn ts` — vue-tsc will catch missing keys referenced via typed `t()` if the project ships locale types (it does not strictly here, so also smoke-test by navigating to the route).

### Step 6 — Smoke test

Run `yarn dev` and navigate to `http://localhost:5173/{moduleLink}/{id}/{action_snake}`. Confirm:

- The component renders inside the parent shell (not full-page).
- The page title updates from the `linkTitle` watcher in the parent view.
- The back button returns to `/{moduleLink}/{id}`.
- Form submission triggers the Swal loading dialog, then either success or error Swal.

If MSW mocks are needed, add a handler in `src/mocks/handlers.ts` matching the URL.

## Examples

**User says:** "Add a new VPS sub-action `reset_firewall` that POSTs to reset the firewall rules"

**Actions taken:**

1. `src/router/index.ts` — add `reset_firewall` to the VPS `:link(...)` enum.
2. Create `src/views/vps/ResetFirewall.vue` based on `src/views/vps/ResetPassword.vue` — single confirm checkbox, POST to `${baseUrl}/${moduleLink(module)}/${id}/reset_firewall`.
3. `src/views/vps/ViewVps.vue` — add `import ResetFirewall from '@/views/vps/ResetFirewall.vue'` and `<div v-else-if="link == 'reset_firewall'" class="col"><ResetFirewall :id="id" :module="module" :cur-hostname="serviceInfo.vps_hostname" /></div>`.
4. `src/locales/en/vps.json` — add `"resetFirewall": { "title": "Reset Firewall", "confirmReset": "...", "resetFirewallButton": "Reset Firewall" }`.

**Result:** Navigating to `/vps/123/reset_firewall` renders the confirmation form inside the VPS view shell.

## Common Issues

- **"Component renders blank but URL matches"** — the action was added to `:link(...)` but no `v-else-if` branch handles it. The fallback `<div v-else v-html="linkDisplay">` is hit instead. Add the branch in Step 4.
- **"404 from router"** — the action name is not in the `:link(...)` enum. Vue Router 4 only matches the literal alternatives. Add it in Step 2.
- **"t() returns the key path as a string"** — the i18n namespace is not loaded. Check the parent route in `src/router/index.ts` has `meta: { i18n: ['vps'] }` (or matching namespace). If missing, add it to the parent route's meta. Do not put `meta` on a sub-action because sub-actions share the parent route.
- **"Cannot read properties of undefined (reading 'vps_hostname')"** — `serviceInfo` is loaded by the parent store after mount. Either pass scalar props the parent already has, or guard the template with `v-if="serviceInfo"` at the wiring site in the parent view.
- **"fetchWrapper logged me out on first call"** — endpoint returned 401/403. Check that `moduleLink(module.value)` produces the correct backend path (it lowercases and prefixes). For VPS the URL is `/vps/{id}/{action}`; for QS it is `/quickservers/{id}/{action}`.
- **"Top-level await error in <script setup>"** — the component must be wrapped in `<Suspense>`. The parent view already provides this via `<router-view>` with Suspense — confirm the parent component handles it. If not, move the GET into `onMounted` instead of using top-level await.
- **Linter complaints about `any` on response/error** — the codebase uses `(response: any)` and `(error: any)` consistently for fetchWrapper callbacks. This is the project convention; do not introduce stricter typing unless the user asks.
