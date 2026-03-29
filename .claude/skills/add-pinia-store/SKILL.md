---
name: add-pinia-store
description: Creates a new Pinia store in src/stores/{domain}.store.ts following the Options API pattern with fetchWrapper, typed state interfaces, and standard CRUD actions. Use when user says 'add store', 'create new store', 'new Pinia store for {domain}'. Do NOT use for modifying existing stores or for non-service stores like auth/alert.
---
# Add Pinia Store

## Critical

- **Options API only** — all service stores use `defineStore('name', { state, getters, actions })`, never Setup stores.
- **Never use `axios` or raw `fetch`** — always `fetchWrapper` from `@/helpers/fetchWrapper`.
- **Use `@` alias** — import from `@/stores/...`, `@/helpers/...`, `@/types/...`. No relative paths.
- **One store per domain** — file goes in `src/stores/` following the pattern of `src/stores/mail.store.ts`, `src/stores/backup.store.ts`, `src/stores/vps.store.ts`, exported as `use{Domain}Store`.
- **API calls belong in actions, not components.**

## Instructions

1. **Determine the domain name and API endpoint.** Ask the user for:
   - Domain name (e.g., `backup`, `dns`, `ssl`) — used for file naming and store ID
   - API endpoint path (e.g., `backups`, `dns`) — used in fetchWrapper URLs
   - Key fields the service has (e.g., `backup_id`, `backup_hostname`, `backup_status`)
   - Which fields should be `titleField` / `titleField2` getters

   Verify: domain name is snake_case, store ID matches existing convention. Check existing stores for reference:

   ```bash
   ls src/stores/
   ```

2. **Create the `{Domain}Info` interface.** Define all service-specific fields with proper types. Follow the naming pattern `{domain}_{field}` matching the API response. Reference `src/stores/backup.store.ts` or `src/stores/mail.store.ts` for real examples:
   ```typescript
   interface BackupInfo {
       backup_id: number;
       backup_type: number;
       backup_currency: string;
       backup_order_date: string;
       backup_custid: number;
       backup_ip: string;
       backup_status: string;
       backup_invoice: number;
       backup_coupon: number;
       backup_extra: string;
       backup_server_status: string;
       backup_comment: string;
   }
   ```
   Verify: every field has an explicit type (no implicit `any`), ID field is `number`.

3. **Create the `{Domain}State` interface.** Always include these standard fields:
   ```typescript
   interface BackupState {
       backupList: BackupInfo[];        // camelCase domain + "List"
       serviceInfo: BackupInfo;
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
   Verify: `{domain}List` uses camelCase (e.g., `floatingIpList` not `floating_ipsList`). See `src/stores/floating_ips.store.ts` for this pattern.

4. **Write the store file** in `src/stores/` (e.g., `src/stores/backup.store.ts`). Use this exact template:

   ```typescript
   import { defineStore } from 'pinia';
   import { fetchWrapper } from '@/helpers/fetchWrapper';
   import { snakeToCamel } from '@/helpers/snakeToCamel';

   import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types/view-service-common';
   import { useAuthStore } from '@/stores/auth.store';
   import { useSiteStore } from '@/stores/site.store';

   // ... interfaces here ...

   export const useBackupStore = defineStore('backup', {
       state: (): BackupState => ({
           backupList: [],
           loading: false,
           error: false,
           pkg: '',
           linkDisplay: false,
           serviceInfo: { /* all fields with zero/empty defaults */ },
           clientLinks: [],
           billingDetails: {
               service_last_invoice_date: '',
               service_payment_status: '',
               service_frequency: '',
               next_date: '',
               service_next_invoice_date: '',
               service_currency: 'USD',
               service_currency_symbol: '$',
               service_coupon: '',
               service_cost_info: '0.00',
               service_extra: [],
           },
           custCurrency: 'USD',
           custCurrencySymbol: '$',
           serviceExtra: [],
           extraInfoTables: {
               backup: { title: 'Connection Information', rows: [] },
               tutorials: { title: 'Tutorials', rows: [] },
           },
           serviceType: {
               services_id: 0,
               services_name: '',
               services_cost: 0,
               services_category: 0,
               services_buyable: 0,
               services_type: 0,
               services_field1: '',
               services_field2: '',
               services_module: 'backups',
           },
           usage_count: 0,
       }),
       getters: {
           titleField: (state) => state.serviceInfo.backup_hostname,
           titleField2: (state) => state.serviceInfo.backup_ip,
       },
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
                   this.backupList = await fetchWrapper.get(`${baseUrl}/backups`);
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
                   const response = await fetchWrapper.get(`${baseUrl}/backups/${id}`);
                   this.$reset();
                   console.log(response);
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
               this.backupList = this.backupList.filter((x) => x.backup_id !== id);
           },
       },
   });
   ```

   Verify: file exports exactly one store. Run `yarn ts` to type-check:

   ```bash
   yarn ts
   ```

5. **Verify the store compiles.** Fix any type errors before proceeding. Confirm the store ID string passed to `defineStore` is unique across all stores in `src/stores/`:

   ```bash
   grep "defineStore(" src/stores/*.ts
   ```

## Examples

**User says:** "Create a new Pinia store for backups"

**Actions taken:**
1. Create `src/stores/backup.store.ts`
2. Define `BackupInfo` interface with fields: `backup_id`, `backup_hostname`, `backup_type`, `backup_currency`, `backup_order_date`, `backup_custid`, `backup_status`, `backup_invoice`, `backup_coupon`, `backup_extra`, `backup_server_status`, `backup_comment`
3. Define `BackupState` with `backupList: BackupInfo[]` and all standard service state fields
4. Export `useBackupStore = defineStore('backup', { ... })` with `getAll()` hitting `/backups`, `getById(id)` hitting `/backups/${id}`
5. Set `titleField` getter to `state.serviceInfo.backup_hostname`
6. Run `yarn ts` — passes with no errors

**Result:** `src/stores/backup.store.ts` matches the exact pattern of `src/stores/mail.store.ts` and `src/stores/floating_ips.store.ts`.

## Common Issues

- **`Type 'X' is not assignable to type 'Y'`**: Check that `serviceInfo` default values match the interface exactly — every field must be initialized with the correct type (`0` for numbers, `''` for strings).
- **`Property 'backupList' does not exist`**: The list property name must be camelCase. For `floating_ips` domain, it's `floatingIpList` not `floating_ipsList`. Use `snakeToCamel` mentally: underscores removed, next letter capitalized.
- **Store ID collision**: The string passed to `defineStore('...')` must be unique. Check existing stores with `grep "defineStore(" src/stores/*.ts`. Existing IDs include: `floating_ip`, `mail`, `website`, `account`, `auth`, `site`, `alert`. Use singular form matching the API module name.
- **`fetchWrapper is not defined`**: Must import from `@/helpers/fetchWrapper`, not destructure from a different path. The import is `import { fetchWrapper } from '@/helpers/fetchWrapper';`.
- **`billingDetails` missing fields**: Copy the exact `BillingDetails` default object from an existing store like `src/stores/mail.store.ts`. All optional fields from the type should still have empty-string defaults in state.
- **`getBaseUrl is not a function`**: You must call `useSiteStore()` inside each action, not at module level. Pinia stores aren't available until the app is mounted.