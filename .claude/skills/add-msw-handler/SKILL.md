---
name: add-msw-handler
description: Adds an MSW request handler to src/mocks/handlers.ts for new API endpoints exercised by Vitest/jsdom tests, with optional parallel entry in test/visual/mocks/visualHandlers.ts for visual regression coverage. Follows the project's exact pattern: http.get/post against BASE_URL='https://my.interserver.net/apiv2', returns HttpResponse.json() with realistic shapes that match fetchWrapper consumers. Use when user says 'add msw handler', 'mock this endpoint', 'add API mock', 'stub this API for tests', or implements a new fetchWrapper call that has no existing mock. Do NOT use for editing existing handlers, for Playwright e2e/ tests (those hit the dev server), for e2e/real/ tests (real backend), or for service worker patches in public/mockServiceWorker.js.
paths:
  - src/mocks/**/*.ts
  - test/visual/mocks/**/*.ts
---
# Add MSW Handler

## Critical

- Base URL is always `` `${BASE_URL}/path` `` where `const BASE_URL = 'https://my.interserver.net/apiv2'` — never hardcode the full URL inline.
- Append new handlers to the `handlers` array in `src/mocks/handlers.ts` between the last existing handler and the closing `]` — do not re-export, do not create a new file.
- MSW matches handlers in array order. Any path that conflicts with an existing `/resource/:id` pattern (e.g. `/vps/order` vs `/vps/:id`) MUST be inserted BEFORE the `:id` handler, or it will be swallowed.
- Only edit `test/visual/mocks/visualHandlers.ts` when the endpoint is exercised by a visual regression test under `test/visual/` AND its base shape needs populated data different from `src/mocks/handlers.ts`. Otherwise the base handler is reused automatically (`visualHandlers = [...visualOverrides, ...baseHandlers]`).
- All response shapes must match what the consuming code in `src/stores/*.store.ts`, `src/components/`, or `src/views/` actually destructures. Read the caller first.
- Never use raw `fetch` mocks or `vi.fn()` on `fetchWrapper` — the project routes everything through MSW.

## Instructions

### Step 1 — Identify the endpoint and its consumer

1. Read the caller (a `*.store.ts` action or a component) and capture: HTTP verb, path under `/apiv2`, request body shape if POST/PUT, and the exact property names the response is destructured into.
2. Grep for the endpoint to confirm no handler already exists:
   - `Grep` pattern: `` `${BASE_URL}/<your-path>` `` in `src/mocks/handlers.ts`.
   - If a handler exists, STOP — this skill is for new handlers only. Edit it manually instead.

Verify before Step 2: you have the verb, the full path segment after `/apiv2`, and a concrete response shape derived from real usage.

### Step 2 — Add the handler to `src/mocks/handlers.ts`

1. Open `src/mocks/handlers.ts`. The file already has `import { http, HttpResponse } from 'msw'` and `const BASE_URL = 'https://my.interserver.net/apiv2'` at the top — do not re-add.
2. Add the handler immediately before the closing `];` of the `handlers` array, grouped near related endpoints (VPS near other `/vps`, billing near `/billing/*`).
3. Match one of these shapes verbatim:

   GET with no params:
   ```ts
       http.get(`${BASE_URL}/<path>`, () => {
           return HttpResponse.json({ /* response shape */ });
       }),
   ```

   GET with path params (note: insert BEFORE any colliding `:id` handler if applicable):
   ```ts
       http.get(`${BASE_URL}/<resource>/:id`, ({ params }) => {
           return HttpResponse.json({ id: Number(params.id), /* ... */ });
       }),
   ```

   POST with body, branching on contents:
   ```ts
       http.post(`${BASE_URL}/<path>`, async ({ request }) => {
           const body = (await request.json()) as Record<string, string>;
           if (body.<field> === '<expected>') {
               return HttpResponse.json({ /* success shape */ });
           }
           return HttpResponse.json({ code: 400, message: 'Invalid', field: '<field>' }, { status: 400 });
       }),
   ```

4. Use 4-space indentation, single quotes, trailing commas — Prettier with the project's `.prettierrc.json` settings.
5. Realistic data only: IPs like `192.168.1.1`, dates like `'2024-01-15'`, currencies `'USD'` / `'$'`, sample IDs in the same numeric range as siblings (vps_id ~100, domain_id ~200, server_id ~300, license_id ~400, ssl_id ~500, mail_id ~600, backup_id ~700, website_id ~800, qs_id ~900, floating_ip_id ~1000, scrub_ip_id ~1100).

Verify before Step 3: the new handler compiles and matches Prettier (`yarn ts && yarn format`).

### Step 3 — Add a visual override only if needed

Skip this step unless one of the following is true:
- A test file under `test/visual/` imports a page that calls this endpoint AND the base handler returns an empty array / minimal shape that won't render the UI states under test.
- The endpoint is `*/order` or another path that collides with an existing `/:id` handler — in that case it must be present in `visualOverrides` to be matched before the catch-all `:id` from base handlers.

If needed, edit `test/visual/mocks/visualHandlers.ts`:
1. Insert the handler in the `visualOverrides` array (NOT in baseHandlers — those flow through automatically).
2. Order rule: any `/<resource>/order` or specific sub-path MUST appear before the `/<resource>/:id` handler in this file or in `src/mocks/handlers.ts`. There is a banner comment in the file marking this boundary — respect it.
3. Populate the shape with multi-row arrays, billing details (`service_last_invoice_date`, `service_payment_status`, `next_date`, etc.), and any nested objects the view destructures, mirroring the existing `visualOverrides` entries.

Verify before Step 4: `visualHandlers` still ends with `export const visualHandlers = [...visualOverrides, ...baseHandlers];` and the file still compiles.

### Step 4 — Run the gates

1. Type-check: `yarn ts`
2. Lint the touched files: `yarn lint`
3. Run the consumer's test file (if it exists), e.g.: `yarn vitest run test/stores/<domain>.store.spec.ts`
4. If a visual override was added, run the matching visual spec: `yarn test:visual` (limit with `--testNamePattern` if iterating).

Do not claim success until all four commands exit zero.

## Examples

### Example 1 — New GET endpoint with no visual coverage

User: "Add an msw handler for `GET /apiv2/vps/:id/snapshots` — returns a list of snapshots."

Actions:
1. Read `src/stores/vps.store.ts` (or the view) to confirm the action destructures `snapshots: Array<{ id, name, created }>`.
2. Grep `${BASE_URL}/vps/:id/snapshots` in `src/mocks/handlers.ts` → no match.
3. Insert AFTER `http.get(\`${BASE_URL}/vps/:id\`, …)` in `src/mocks/handlers.ts`:
   ```ts
       http.get(`${BASE_URL}/vps/:id/snapshots`, ({ params }) => {
           return HttpResponse.json({
               vps_id: Number(params.id),
               snapshots: [
                   { id: 1, name: 'pre-upgrade', created: '2024-01-10 12:00:00' },
                   { id: 2, name: 'weekly', created: '2024-01-15 03:00:00' },
               ],
           });
       }),
   ```
   Note: this path is more specific than `/vps/:id`, so MSW prefers it regardless of order — but keeping related handlers grouped is the convention.
4. Run `yarn ts && yarn vitest run test/stores/vps.store.spec.ts`.

Result: vitest passes, visual handlers untouched.

### Example 2 — POST with success/error branching

User: "Mock `POST /apiv2/domains/:id/renew` — succeeds when years is 1–10, errors otherwise."

Actions:
1. Add to `src/mocks/handlers.ts` (near other `/domains` handlers):
   ```ts
       http.post(`${BASE_URL}/domains/:id/renew`, async ({ params, request }) => {
           const body = (await request.json()) as Record<string, string>;
           const years = Number(body.years);
           if (years >= 1 && years <= 10) {
               return HttpResponse.json({ success: true, domain_id: Number(params.id), invoice_id: 9001 });
           }
           return HttpResponse.json({ code: 422, message: 'Years must be 1–10', field: 'years' }, { status: 422 });
       }),
   ```
2. `yarn ts && yarn lint && yarn vitest run test/stores/domain.store.spec.ts`.

### Example 3 — Visual override required

User: "The new `BackupsList.vue` visual test renders empty — add populated backups data."

Actions:
1. Base handler returns `[{ backup_id: 701, ... }]` — only one row.
2. Edit `test/visual/mocks/visualHandlers.ts`, add to `visualOverrides` near other list endpoints:
   ```ts
       http.get(`${BASE_URL}/backups`, () => {
           return HttpResponse.json([
               { backup_id: 701, backup_username: 'backup1', backup_status: 'active',  services_name: 'Storage', repeat_invoices_cost: '5.00' },
               { backup_id: 702, backup_username: 'backup2', backup_status: 'active',  services_name: 'Storage', repeat_invoices_cost: '5.00' },
               { backup_id: 703, backup_username: 'backup3', backup_status: 'pending', services_name: 'Storage', repeat_invoices_cost: '5.00' },
           ]);
       }),
   ```
3. `yarn test:visual` and review the screenshot diff.

## Common Issues

- **Symptom: handler appears to be ignored, request falls through to network or 404.**
  1. The path probably collides with a `:id` handler listed earlier in the array. Move your specific path (e.g. `/vps/order`) above `http.get(\`${BASE_URL}/vps/:id\`, …)`.
  2. Confirm you used template literals with the `BASE_URL` constant — a typo like a leading `/api/` or missing `apiv2` will not match `fetchWrapper`'s URL.
  3. In jsdom tests, ensure `test/setup.ts` imported `server` from `src/mocks/setup` and that the test file uses `server.use(...)` only for per-test overrides, not for the default registration.

- **Symptom: `TypeError: Cannot read properties of undefined (reading '<field>')` inside the component under test.**
  Your response shape is missing a property the consumer destructures. Re-read the relevant file in `src/stores/` and the view's `<script setup>` to enumerate every property accessed and add stubs.

- **Symptom: visual test screenshot is correct in CI but local diff fails on dynamic content (dates, IDs).**
  Use fixed ISO dates like `'2024-01-15'` and integer IDs — never `new Date()`, `Date.now()`, or `Math.random()` inside a handler. The visual test setup disables animations but cannot freeze time.

- **Symptom: `Unhandled request` warning in vitest output.**
  Either add a handler for that URL, or for one-off out-of-scope calls, MSW is configured with `onUnhandledRequest: 'bypass'` in visual mode but warns in node mode — add the handler.

- **Symptom: TypeScript error `Property 'json' does not exist on type 'Request'` when reading POST body.**
  Use `(await request.json()) as Record<string, string>` (or a more specific type) — never `request.body`. This matches the cast pattern already used in `src/mocks/handlers.ts`.

- **Symptom: 401 returned even when credentials look right in a POST.**
  Re-check the branching condition — the existing pattern compares `body.login` / `body.passwd` against literal strings. Make sure your equality matches the test fixture, not production values.
