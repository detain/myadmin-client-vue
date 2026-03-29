---
name: add-pinia-store
description: Creates a new Pinia store in src/stores/{domain}.store.ts following the Options API pattern with fetchWrapper, typed state interfaces, and standard CRUD actions. Use when user says 'add store', 'create new store', 'new Pinia store for {domain}'. Do NOT use for modifying existing stores or for non-service stores like auth/alert.
---
# Add Pinia Store

## Critical

- **All stores use Options API** (`state`, `getters`, `actions` object) — NOT Composition API / setup function, despite components using `<script setup>`.
- **Never use raw `fetch` or `axios`** — always use `fetchWrapper` from `@/helpers/fetchWrapper`.
- **Base URL** must come from `useSiteStore().getBaseUrl()` — never hardcode API URLs.
- **File naming**: `src/stores/{domain}.store.ts` — export as `use{Domain}Store`.
- **Call `this.$reset()`** inside `getById()` before mapping response properties to clear stale state.

## Instructions

### Step 1: Define the service info interface

Create the `{Domain}Info` interface at the top of the file. Fields follow the pattern `{prefix}_{field}` matching the API response. Every service has at minimum: `id`, `type`, `currency`, `order_date`, `custid`, `ip`, `status`, `invoice`, `coupon`, `extra`, `server_status`, `comment`.

```typescript
interface DomainInfo {
    domain_id: number;
    domain_type: number;
    domain_currency: string;
    domain_order_date: string;
    domain_custid: number;
    domain_ip: string;
    domain_status: string;
    domain_invoice: number;
    domain_coupon: number;
    domain_extra: string;
    domain_server_status: string;
    domain_comment: string;
}
```

**Verify**: Interface field names match the API's snake_case response keys before proceeding.

### Step 2: Define the state interface

Create `{Domain}State` with the standard service store shape:

```typescript
interface DomainState {
    domainList: DomainInfo[];
    serviceInfo: DomainInfo;
    loading: boolean;
    error: boolean | string;
    linkDisplay: boolean | string;
    pkg: string;
    clientLinks: ClientLink[];
    billingDetails: BillingDetails;
    custCurrency: string;
    custCurrencySymbol: string;
    serviceExtra: any;
    extraInfoTables: ExtraInfoTables;
    serviceType: ServiceType;
    usage_count: number;
}
```

**Verify**: Import shared types from `@/types/view-service-common`:
```typescript
import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types/view-service-common';
```

### Step 3: Create the store with defineStore

Use the exact import and export pattern:

```typescript
import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types/view-service-common';
import { useSiteStore } from '@/stores/site.store';

export const useDomainStore = defineStore('domain', {
    state: (): DomainState => ({ /* defaults */ }),
    getters: { /* titleField, titleField2 */ },
    actions: { /* register, getAll, getById, update, delete */ },
});
```

**Verify**: Store ID string (first arg to `defineStore`) matches the API endpoint name (e.g., `'mail'`, `'floating_ips'`).

### Step 4: Populate state defaults

Follow the exact default value pattern from existing stores:
- `{domain}List: []`
- `loading: false`, `error: false`, `linkDisplay: false`
- `pkg: ''`
- `serviceInfo`: all number fields default to `0`, strings to `''`
- `clientLinks: []`
- `billingDetails`: copy the exact shape from mail.store.ts (currency `'USD'`, symbol `'$'`, cost_info `'0.00'`, service_extra `[]`)
- `custCurrency: 'USD'`, `custCurrencySymbol: '$'`
- `serviceExtra: []`
- `extraInfoTables`: keyed by domain name + `'tutorials'`, each with `title` and `rows: []`
- `serviceType`: all defaults to `0`/`''`, set `services_module` to the API endpoint name
- `usage_count: 0`

**Verify**: `extraInfoTables` first key matches the domain name, `serviceType.services_module` matches the API endpoint.

### Step 5: Add getters

Define `titleField` and `titleField2` pointing to the most useful display fields:

```typescript
getters: {
    titleField: (state) => state.serviceInfo.domain_name,
    titleField2: (state) => state.serviceInfo.domain_ip,
},
```

### Step 6: Implement actions

All actions follow this exact pattern:

```typescript
actions: {
    async register(user: any): Promise<void> {
        const siteStore = useSiteStore();
        const baseUrl = siteStore.getBaseUrl();
        await fetchWrapper.post(`${baseUrl}/register`, user);
    },
    async getAll(): Promise<void> {
        const siteStore = useSiteStore();
        const baseUrl = siteStore.getBaseUrl();
        this.loading = true;
        try {
            this.domainList = await fetchWrapper.get(`${baseUrl}/domains`);
        } catch (error: any) {
            console.log(`got error response${error}`);
            this.error = error;
        }
        this.loading = false;
    },
    async getById(id: number | string): Promise<void> {
        const siteStore = useSiteStore();
        const baseUrl = siteStore.getBaseUrl();
        try {
            const response = await fetchWrapper.get(`${baseUrl}/domains/${id}`);
            this.$reset();
            this.serviceInfo = response.serviceInfo;
            this.clientLinks = response.client_links;
            this.billingDetails = response.billingDetails;
            this.custCurrency = response.custCurrency;
            this.custCurrencySymbol = response.custCurrencySymbol;
            this.pkg = response.package;
            this.serviceExtra = response.serviceExtra;
            this.extraInfoTables = response.extraInfoTables;
            this.serviceType = response.serviceType;
            this.usage_count = response.usage_count;
        } catch (error: any) {
            console.log('api failed', error);
        }
    },
    async update(id: number, params: any): Promise<void> {},
    async delete(id: number): Promise<void> {
        const siteStore = useSiteStore();
        const baseUrl = siteStore.getBaseUrl();
        await fetchWrapper.delete(`${baseUrl}/${id}`);
        this.domainList = this.domainList.filter((x) => x.domain_id !== id);
    },
},
```

**Verify**: `this.$reset()` is called in `getById` BEFORE mapping response. The `getAll` endpoint and `getById` endpoint match the API route.

### Step 7: Run type-check

```bash
yarn ts
```

**Verify**: No TypeScript errors related to the new store file.

## Examples

**User says**: "Create a new Pinia store for the CDN service"

**Actions taken**:
1. Create `src/stores/cdn.store.ts`
2. Define `CdnInfo` interface with `cdn_id`, `cdn_hostname`, `cdn_ip`, `cdn_status`, etc.
3. Define `CdnState` with `cdnList: CdnInfo[]` and standard service fields
4. Export `useCdnStore = defineStore('cdn', { ... })` with Options API
5. Set `extraInfoTables` key to `'cdn'`, `serviceType.services_module` to `'cdn'`
6. Add getters: `titleField` → `cdn_hostname`, `titleField2` → `cdn_ip`
7. Implement `register`, `getAll` (endpoint `/cdn`), `getById`, `update` (empty stub), `delete`
8. Run `yarn ts` to verify

**Result**: `src/stores/cdn.store.ts` exports `useCdnStore`, ready to import in views as:
```typescript
import { useCdnStore } from '@/stores/cdn.store';
import { storeToRefs } from 'pinia';
const cdnStore = useCdnStore();
const { cdnList, loading, serviceInfo } = storeToRefs(cdnStore);
```

## Common Issues

- **`Property 'xxx' does not exist on type`**: The `{Domain}Info` interface is missing a field. Add the field to the interface and provide a default in `state()`.
- **`this.$reset is not a function`**: You used Composition API (setup function) instead of Options API. Stores MUST use `defineStore('name', { state, getters, actions })` — the setup syntax does not support `$reset()`.
- **API returns 404 on `getAll()`**: The endpoint path in `fetchWrapper.get()` doesn't match the backend route. Check `useSiteStore().modules` for the correct `TBLNAME` value (e.g., `'floating_ips'` not `'floatingIps'`).
- **State not clearing between service views**: Ensure `this.$reset()` is called at the top of `getById()` before mapping response properties. This prevents stale data from a previous service leaking into the current view.
- **Import error for `ClientLink` / `BillingDetails`**: Import from `@/types/view-service-common`, not from individual type files.