# Caliber Learnings

Accumulated patterns and anti-patterns from development sessions.
Auto-managed by [caliber](https://github.com/caliber-ai-org/ai-setup) — do not edit manually.

- **[pattern]** For i18n interpolation with HTML elements or Vue components inside translated strings, use `<i18n-t keypath="key" tag="span"><template #paramName>...</template></i18n-t>` with named slots instead of `t('key', { param: '' })` with the value concatenated outside the translation string
- **[gotcha]** Anti-pattern found across multiple views: `{{ t('some.key', { param: '' }) }} <b>{{ actualValue }}</b>` — passing empty string for interpolation param and appending the real value outside breaks sentence structure in non-English languages where word order differs
- **[gotcha]** The `<i18n-t>` component is a vue-i18n runtime component and does NOT require `@intlify/unplugin-vue-i18n` (VueI18nPlugin). That plugin is only needed for `<i18n>` SFC blocks and message pre-compilation. The comment in `vite.config.ts` conflates the two
- **[gotcha]** Affiliate views are at `src/views/billing/affiliates/` (nested under affiliates subdirectory), not directly under `src/views/billing/` — the extra nesting level is easy to miss
