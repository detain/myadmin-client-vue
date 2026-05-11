---
paths:
  - src/locales/**
  - src/i18n/**
  - src/views/**
  - src/components/**
---

# i18n Conventions

- **Never** add `<i18n>` SFC blocks — all messages lazy-loaded from `src/locales/{locale}/{namespace}.json` via `loadLocaleMessages()` in `src/i18n/index.ts`.
- Namespace names match view directory snake_case: `floating_ips`, `scrub_ips`, `quickservers` — must equal `meta.i18n` entry in `src/router/index.ts`.
- English (`src/locales/en/`) is source of truth. All other 109 locale dirs (`af/`, `am/`, `ar/`, ..., `zu/`) mirror exact key structure.
- In `<script setup>`: `const { t } = useI18n(); t('key')`. In templates: `$t('key')`.
- For HTML or component interpolation, use `<i18n-t keypath="key" tag="span"><template #param>...</template></i18n-t>` — never concatenate values outside the translation (breaks non-English word order). See `CALIBER_LEARNINGS.md`.
- Interpolation params use `{name}` curly-brace syntax (no `$`).
- Key naming: camelCase (`nextInvoiceDate`, `confirmDelete`). Top-level groups: `list`, `view`, `order`, plus domain-specific sections.
- Date formats from `datetimeFormats.en` in `src/i18n/index.ts`: `short`, `long`, `dateOnly`, `timeOnly`. Number formats: `currency` (USD), `decimal`, `percent`.
- Tests assert on **rendered** English string (e.g., `'No services found matching filter'`), not the i18n key.
