---
name: add-service-view
description: Creates a new service view page (View{Service}.vue) with info boxes, link-based sub-action routing, store integration, and breadcrumbs following existing patterns in src/views/. Use when user says 'add view page', 'create service detail page', 'new View component for a service'. Do NOT use for list pages (use ServiceListTable), order pages, or sub-action components.
---
# Add Service View Page

## Critical

- **Never use raw `fetch` or `axios`** — all API calls go through `fetchWrapper` from `@/helpers/fetchWrapper`.
- **Always import Cancel and Invoices** from `@/components/services/` — every service view supports these two sub-actions at minimum.
- **Route params: `id` is non-reactive (`Number(route.params.id)`), `link` must be `computed(() => route.params.link)`** — getting this wrong breaks sub-action navigation.
- **Call `store.getById(id)` at module level** (not inside onMounted) — this is how every existing view works.
- **Import the shared CSS** — `@import '../../assets/css/view_service.css'` in the `<style>` block (adjust relative path depth to match file location).
- **Use `moduleLink(module)`** for all URL paths — it maps module names like `'webhosting'` → `'websites'`, `'quickservers'` → `'qs'`.

## Instructions

### Step 1: Create the store (`src/stores/{service}.store.ts`)

Follow the pattern in `vps.store.ts` / `website.store.ts`:

```typescript
import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/stores/site.store';

export const use{Service}Store = defineStore('{service}', {
    state: () => ({
        {service}List: [] as any[],
        loading: false,
        error: false as any,
        pkg: '',
        linkDisplay: false as any,
        serviceInfo: {} as Record<string, any>,
        serviceMaster: {} as Record<string, any>,
        clientLinks: [] as any[],
        billingDetails: {} as Record<string, any>,
        custCurrency: '',
        custCurrencySymbol: '',
        serviceExtra: null as any,
        extraInfoTables: {} as Record<string, any>,
    }),
    getters: {
        titleField: (state) => state.serviceInfo.{service}_hostname ?? '',
        titleField2: (state) => state.serviceInfo.{service}_ip ?? '',
        titleField3: (state) => state.serviceInfo.{service}_id ?? '',
    },
    actions: {
        async getAll() {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                this.{service}List = await fetchWrapper.get(`${baseUrl}/{api_path}`);
            } catch (error: any) {
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id: number | string) {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            try {
                const response = await fetchWrapper.get(`${baseUrl}/{api_path}/${id}`);
                this.$reset();
                this.serviceInfo = response.serviceInfo;
                this.clientLinks = response.client_links;
                this.billingDetails = response.billingDetails;
                this.custCurrency = response.custCurrency;
                this.custCurrencySymbol = response.custCurrencySymbol;
                this.serviceMaster = response.serviceMaster;
                this.pkg = response.package;
                this.serviceExtra = response.serviceExtra;
                this.extraInfoTables = response.extraInfoTables;
            } catch (error: any) {
                this.error = error;
            }
        },
    },
});
```

**Verify:** Store exports `use{Service}Store`, has `getById` with `this.$reset()` before assignment.

### Step 2: Add routes in `src/router/index.ts`

Add a route group following the existing pattern:

```typescript
{
    path: '/{url_path}',
    meta: { i18n: ['{service}'] },
    children: [
        { path: '', component: () => import('../views/{service}/{Service}List.vue') },
        { path: 'order', component: () => import('../views/{service}/Order{Service}.vue') },
        { path: ':id(\\d+)', component: () => import('../views/{service}/View{Service}.vue') },
        { path: ':id(\\d+)/:link(cancel|invoices|welcome_email)', component: () => import('../views/{service}/View{Service}.vue') },
    ],
},
```

Expand the `:link(...)` regex as you add sub-action components. Both `:id` and `:id/:link` routes point to the same `View{Service}.vue`.

**Verify:** Route uses `\\d+` for id validation. The `meta.i18n` array matches the locale namespace.

### Step 3: Create the view component (`src/views/{service}/View{Service}.vue`)

```vue
<template>
    <div class="row mt-2">
        <!-- Info Box 1: Package -->
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>{{ t('{service}.view.package') }}</h3>
                    <p class="m-0 py-2">{{ pkg }}</p>
                    <p>{{ t('{service}.view.nextInvoiceDate') }} <b>{{ billingDetails.service_next_invoice_date }}</b></p>
                </div>
                <div class="icon"><i class="fas fa-briefcase"></i></div>
                <span class="small-box-footer text-bold">{{ serviceInfo.{service}_hostname }}</span>
            </div>
        </div>
        <!-- Info Box 2: Billing (status-colored) -->
        <div class="col-md-4">
            <div :class="{ 'small-box': true, 'bg-success': serviceInfo.{service}_status === 'active', 'bg-warning text-white': serviceInfo.{service}_status === 'pending', 'bg-danger': serviceInfo.{service}_status !== 'active' && serviceInfo.{service}_status !== 'pending' }">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>{{ t('{service}.view.billing') }}</h3>
                    <p class="m-0 py-2">{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</p>
                    <p>{{ t('{service}.view.status') }} <b>{{ serviceInfo.{service}_status }}</b></p>
                </div>
                <div class="icon"><i class="fas fa-dollar-sign"></i></div>
                <span class="small-box-footer">&nbsp;</span>
            </div>
        </div>
        <!-- Info Box 3: Service-specific -->
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>{{ t('{service}.view.info') }}</h3>
                    <p class="m-0 py-2">{{ serviceInfo.{service}_ip }}</p>
                </div>
                <div class="icon"><i class="fas fa-server"></i></div>
                <span class="small-box-footer">&nbsp;</span>
            </div>
        </div>
    </div>
    <!-- Sub-action content when :link is set -->
    <div v-if="link" class="row shadow-none">
        <div v-if="link == 'cancel'" class="col">
            <Cancel :id="id" :module="module" :package="pkg" :title-field="titleField" :title-field2="titleField2" :title-field3="titleField3"></Cancel>
        </div>
        <div v-else-if="link == 'invoices'" class="col">
            <Invoices :id="id" :module="module"></Invoices>
        </div>
        <div v-else class="col" v-html="linkDisplay"></div>
    </div>
    <!-- Default home view -->
    <div v-else class="row row-flex">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title py-2"><i class="fas fa-link"></i>&nbsp;{{ t('common.labels.links') }}</h3>
                </div>
                <div class="card-body text-center">
                    <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/' + moduleLink(module) + '/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text">
                        <i :class="clientLink.icon">{{ clientLink.icon_text }}</i>{{ clientLink.label }}
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ucwords } from '@/helpers/ucwords';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { use{Service}Store } from '@/stores/{service}.store';
import { useSiteStore } from '@/stores/site.store';
import Cancel from '@/components/services/Cancel.vue';
import Invoices from '@/components/services/Invoices.vue';
import Swal from 'sweetalert2';

const { t } = useI18n();
const module = '{service}';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const link = computed(() => route.params.link as string);

const { modules } = storeToRefs(siteStore);
const settings = computed(() => modules.value[module]);
const {service}Store = use{Service}Store();
const { loading, error, pkg, linkDisplay, serviceInfo, titleField, titleField2, titleField3, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceMaster, serviceExtra, extraInfoTables } = storeToRefs({service}Store);

{service}Store.getById(id);
loadLink(route.params.link as string);

watch(
    () => route.params.link,
    (newLink) => {
        loadLink(newLink as string);
    }
);

function loadLink(newLink: string) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t(`common.menu.${module}`)],
    ]);
    siteStore.addBreadcrum(`/${moduleLink(module)}/${id}`, t(`${module}.view.title`, { id }));
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading(t(`${module}.view.title`, { id }));
        siteStore.setTitle(t(`${module}.view.title`, { id }));
    } else {
        siteStore.setPageHeading(t(`${module}.view.linkTitle`, { id, link: ucwords(newLink.replace('_', ' ')) }));
        siteStore.setTitle(t(`${module}.view.linkTitle`, { id, link: ucwords(newLink.replace('_', ' ')) }));
        siteStore.addBreadcrum(`/${moduleLink(module)}/${id}/${newLink}`, ucwords(newLink.replace('_', ' ')));
        if (newLink == 'welcome_email') {
            Swal.fire({
                icon: 'question',
                title: `<h3>${t('common.confirm.title')}</h3>`,
                showCancelButton: true,
                confirmButtonText: t('common.confirm.yes'),
                html: t(`${module}.view.welcomeEmailConfirm`),
                preConfirm: () => {
                    Swal.close();
                    fetchWrapper.get(`/${moduleLink(module)}/${id}/welcome_email`).then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: `<h3>${t(`${module}.view.emailSent`)}</h3>`,
                            preConfirm: () => router.push(`/${moduleLink(module)}/${id}`),
                        });
                    });
                },
            });
        }
    }
}
</script>

<style>
@import '../../assets/css/view_service.css';
</style>
```

**Verify:** `id` is `Number()` not reactive. `link` is `computed`. `store.getById(id)` called at module level. `loadLink` called both at setup and in watch.

### Step 4: Add locale strings

Create/update `src/locales/en/{service}.json` with at minimum:

```json
{
    "{service}": {
        "view": {
            "title": "{Service} #{id}",
            "linkTitle": "{Service} #{id} - {link}",
            "package": "Package",
            "billing": "Billing",
            "info": "Information",
            "status": "Status:",
            "nextInvoiceDate": "Next Invoice: ",
            "welcomeEmailConfirm": "Resend the welcome email?",
            "emailSent": "Email Sent",
            "emailSentMessage": "Welcome email has been resent."
        }
    }
}
```

**Verify:** Keys match the `t()` calls in the component. Namespace matches `meta.i18n` in the route.

### Step 5: Add sub-action components

For each service-specific sub-action beyond Cancel/Invoices, create a component in `src/views/{service}/`:

```vue
<template>
    <!-- action-specific form/content -->
</template>
<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';

const props = defineProps<{ id: number; module: string }>();
const { t } = useI18n();
const router = useRouter();
</script>
```

Then add it to the route `:link(cancel|invoices|new_action)` regex and the `v-if/v-else-if` chain in `View{Service}.vue`.

**Verify:** Route regex includes the new action name. Component is imported and conditionally rendered.

## Examples

**User says:** "Create a service detail page for the SSL module"

**Actions taken:**
1. Create `src/stores/ssl.store.ts` with `useSslStore`, state matching `serviceInfo.ssl_*` fields, `getById` action calling `/ssl/{id}`
2. Add route group in `src/router/index.ts` under `path: '/ssl'` with `meta: { i18n: ['ssl'] }`, children for list, order, `:id(\\d+)`, and `:id(\\d+)/:link(cancel|invoices|welcome_email)`
3. Create `src/views/ssl/ViewSsl.vue` with three info boxes (package, billing status-colored, cert info), Cancel/Invoices sub-actions, clientLinks btn-app grid
4. Add locale keys in `src/locales/en/ssl.json`

**Result:** `ViewSsl.vue` loads SSL service data via store, shows info boxes with `ssl_status` coloring, renders Cancel/Invoices when `:link` is set, and shows clientLink buttons on the default view.

## Common Issues

- **"Cannot read properties of undefined (reading '{service}_hostname')"**: The store `getById` response field names don't match `serviceInfo.*` references in the template. Check the API response shape and update template bindings to match actual field names.
- **Sub-action component doesn't render when clicking a link button**: The action name is missing from the route `:link(...)` regex. Add it to the pipe-separated list in `src/router/index.ts`.
- **Page shows blank after navigating to a link action**: `loadLink` is not called on initial load. Ensure `loadLink(route.params.link as string)` is called at module level AND inside the `watch` callback.
- **`moduleLink` returns wrong path**: Check `src/helpers/moduleLink.ts` — it has special cases (`webhosting` → `websites`, `quickservers` → `qs`). If your module name differs from the URL path, add a mapping there.
- **Breadcrumbs don't update on sub-action navigation**: `siteStore.setBreadcrums` (note: this is the actual method name, not `setBreadcrumbs`) must be called before `addBreadcrum` in `loadLink`. Both use the non-standard spelling.
- **Info box colors not changing with status**: Verify the `:class` binding checks the correct `serviceInfo.{service}_status` field name. The status values are `'active'`, `'pending'`, `'expired'`, `'canceled'`.