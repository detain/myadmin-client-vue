# Caliber Learnings

Accumulated patterns and anti-patterns from development sessions.
Auto-managed by [caliber](https://github.com/caliber-ai-org/ai-setup) — do not edit manually.

- **[pattern]** For i18n interpolation with HTML elements or Vue components inside translated strings, use `<i18n-t keypath="key" tag="span"><template #paramName>...</template></i18n-t>` with named slots instead of `t('key', { param: '' })` with the value concatenated outside the translation string
- **[gotcha]** Anti-pattern found across multiple views: `{{ t('some.key', { param: '' }) }} <b>{{ actualValue }}</b>` — passing empty string for interpolation param and appending the real value outside breaks sentence structure in non-English languages where word order differs
- **[gotcha]** The `<i18n-t>` component is a vue-i18n runtime component and does NOT require `@intlify/unplugin-vue-i18n` (VueI18nPlugin). That plugin is only needed for `<i18n>` SFC blocks and message pre-compilation. The comment in `vite.config.ts` conflates the two
- **[gotcha]** Affiliate views are at `src/views/billing/affiliates/` (nested under affiliates subdirectory), not directly under `src/views/billing/` — the extra nesting level is easy to miss
- **[gotcha]** `el.scrollIntoView` is not implemented in jsdom — always call it with optional chaining (`el.scrollIntoView?.({ block: 'nearest' })`) in any component code that may execute during Vitest runs, otherwise an unhandled `TypeError` is emitted even when tests pass
- **[gotcha]** `yarn test` / `yarn vitest run` exits with a non-zero status and `close timed out after 10000ms / Tests closed successfully but something prevents Vite server from exiting` warning even when all tests pass. Check the actual `Tests` line in the output (e.g. `Tests 840 passed`) rather than relying on the exit code
- **[fix]** In Vitest component tests, assert on the **rendered** English string (e.g., `'No services found matching filter'`) rather than the i18n key (e.g., `'noServicesMatchingFilter'`) — `useI18n()` resolves keys to values at render time, so `wrapper.text()` contains the translated string
- **[gotcha]** When a test targets a native form control via `#id` (e.g., `wrapper.find('#locale')`) and the component gets replaced by a custom dropdown like `LocalePreviewSelect.vue`, update selectors to the component's root class (e.g., `.locale-preview-select`) and click the trigger button before querying `li[role="option"]` — the options aren't in the DOM until the dropdown is opened
