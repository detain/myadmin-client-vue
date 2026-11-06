---
paths:
  - src/stores/**
  - test/stores/**
---

# Pinia Store Conventions

- Use **Options API** only: `defineStore('id', { state, getters, actions })`. Never setup stores. See `src/stores/vps.store.ts`, `src/stores/backup.store.ts`.
- Export as `use{Domain}Store` (e.g., `useVpsStore`, `useFloatingIpsStore`).
- API calls live in **actions**, never components. Always `fetchWrapper` from `@/helpers/fetchWrapper` — never `axios`, never raw `fetch`.
- Standard state shape: `{domain}List: T[]`, `serviceInfo: T`, `loading: boolean`, `error: boolean | string`, `pkg: string`, `linkDisplay: boolean | string`, `clientLinks: ClientLink[]`, `billingDetails`, `custCurrency`, `custCurrencySymbol`, `serviceExtra`, `extraInfoTables`.
- camelCase list field: `floatingIpList` not `floating_ipsList`.
- Use `@/` alias (`@/helpers/fetchWrapper`, `@/stores/site.store`) — never relative paths.
- For URL building: `const baseUrl = useSiteStore().getBaseUrl()` and `fetchWrapper.get(\`${baseUrl}/{api_path}\`)`.
- Define `titleField` / `titleField2` / `titleField3` getters from `state.serviceInfo`.
- Tests in `test/stores/{name}.store.spec.ts` use `createTestingPinia` from `@pinia/testing`.
