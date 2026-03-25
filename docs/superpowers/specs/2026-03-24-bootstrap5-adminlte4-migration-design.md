# Bootstrap 5 / AdminLTE 4 Migration Design

## Overview

Migrate the MyAdmin Client Vue SPA from Bootstrap 4.6 + AdminLTE 3 to Bootstrap 5.3 + AdminLTE 4, using a layered approach. Keep jQuery for Select2 and the custom passwordRequirements plugin only; migrate all Bootstrap JS calls to the vanilla BS5 API.

## Decisions

- **jQuery:** Keep for Select2 + passwordRequirements only. Migrate Bootstrap modal/tooltip/popover calls to vanilla BS5 JS API.
- **icheck-bootstrap:** Drop entirely, replace with BS5 native `form-check` markup.
- **SweetAlert2 BS4 theme:** Remove CSS import, use default SweetAlert2 styling.
- **Select2 theme:** Replace `select2-bootstrap-theme` with `select2-bootstrap-5-theme`.
- **Tempus Dominus:** Replace `tempusdominus-bootstrap-4` with `@eonasdan/tempus-dominus` v6.
- **Dark mode:** Keep `body.dark-mode` toggle mechanism, update selectors for renamed AdminLTE classes.
- **Sidebar persistence:** Keep custom cookie approach.

## Layer 1: Package Changes

### Remove

| Package | Reason |
|---------|--------|
| `bootstrap` ^4.6 | Replaced by ^5.3 |
| `admin-lte` ^3.0.1 | Replaced by AdminLTE 4 (master) |
| `popper.js` (import in main.ts) | BS5 bundle includes Popper |
| `@sweetalert2/theme-bootstrap-4` | Use SweetAlert2 built-in themes |
| `@ttskch/select2-bootstrap4-theme` | Replaced by BS5 theme |
| `select2-bootstrap-theme` | Replaced by BS5 theme |
| `icheck-bootstrap` | BS5 native form-check |
| `tempusdominus-bootstrap-4` | Replaced by @eonasdan/tempus-dominus |

### Add

| Package | Version |
|---------|---------|
| `bootstrap` | ^5.3 |
| `admin-lte` | ColorlibHQ/AdminLTE#master |
| `@popperjs/core` | ^2.11 |
| `select2-bootstrap-5-theme` | ^1.3.0 |
| `@eonasdan/tempus-dominus` | ^6.9 |

## Layer 2: Layout Shell (App.vue + MainMenu.vue)

### App.vue Template

| AdminLTE 3 | AdminLTE 4 |
|------------|------------|
| `<body class="sidebar-mini layout-fixed">` | `<body class="layout-fixed sidebar-expand-lg sidebar-mini bg-body-tertiary">` |
| `<div class="wrapper">` | `<div class="app-wrapper">` |
| `<nav class="main-header navbar navbar-expand navbar-dark">` | `<nav class="app-header navbar navbar-expand bg-body">` |
| `data-widget="pushmenu"` | `data-lte-toggle="sidebar"` |
| `<aside class="main-sidebar sidebar-dark-primary elevation-4">` | `<aside class="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">` |
| `<a class="brand-link">` wrapping | `<div class="sidebar-brand"><a class="brand-link">` |
| `<div class="sidebar">` | `<div class="sidebar-wrapper">` |
| `<div class="content-wrapper">` | `<main class="app-main">` |
| `<div class="content-header">` | `<div class="app-content-header">` |
| `<section class="content">` | `<div class="app-content">` |
| `<footer class="main-footer">` | `<footer class="app-footer">` |
| `font-weight-light` | `fw-light` |

### App.vue JS

- Replace `$('[data-toggle="popover"]').popover()` with `document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el))`
- Same for tooltips
- Update `.main-sidebar` selectors to `.app-sidebar`
- Update `sidebar-open` / `data-widget="pushmenu"` references

### App.vue CSS Imports

- Keep `bootstrap/dist/css/bootstrap.min.css` (now BS5)
- Remove `icheck-bootstrap/icheck-bootstrap.min.css`
- Replace `select2-bootstrap-theme/dist/select2-bootstrap.min.css` with `select2-bootstrap-5-theme/dist/select2-bootstrap-5-theme.min.css`
- Remove `@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css`
- Keep `admin-lte/dist/css/adminlte.min.css` (now v4)
- `.main-header` z-index rule → `.app-header`

### MainMenu.vue

| AdminLTE 3 | AdminLTE 4 |
|------------|------------|
| `nav nav-pills nav-sidebar flex-column nav-dark` | `nav sidebar-menu flex-column` |
| `data-widget="treeview"` | `data-lte-toggle="treeview"` |
| `has-treeview` class | Remove |
| `<i class="right fas fa-angle-left">` | `<i class="nav-arrow fas fa-angle-right">` |

## Layer 3: Global Class Renames

### Data Attributes

| Find | Replace |
|------|---------|
| `data-toggle=` | `data-bs-toggle=` |
| `data-target=` | `data-bs-target=` |
| `data-dismiss=` | `data-bs-dismiss=` |
| `data-ride=` | `data-bs-ride=` |
| `data-slide=` | `data-bs-slide=` |
| `data-slide-to=` | `data-bs-slide-to=` |
| `data-parent=` | `data-bs-parent=` |
| `data-backdrop=` | `data-bs-backdrop=` |
| `data-keyboard=` | `data-bs-keyboard=` |
| `data-content=` | `data-bs-content=` |
| `data-placement=` | `data-bs-placement=` |

### Directional Utilities

| Find | Replace |
|------|---------|
| `ml-` | `ms-` |
| `mr-` | `me-` |
| `pl-` | `ps-` |
| `pr-` | `pe-` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `float-left` | `float-start` |
| `float-right` | `float-end` |

### Font Utilities

| Find | Replace |
|------|---------|
| `font-weight-bold` | `fw-bold` |
| `font-weight-bolder` | `fw-bolder` |
| `font-weight-normal` | `fw-normal` |
| `font-weight-light` | `fw-light` |
| `font-italic` | `fst-italic` |

### Form Classes

| Find | Replace |
|------|---------|
| `form-group` | `mb-3` |
| `form-row` | `row g-3` |
| `form-inline` | `row row-cols-auto g-3 align-items-center` |
| `custom-control custom-checkbox` | `form-check` |
| `custom-control custom-radio` | `form-check` |
| `custom-control custom-switch` | `form-check form-switch` |
| `custom-control-input` | `form-check-input` |
| `custom-control-label` | `form-check-label` |
| `custom-select` | `form-select` |

### Input Groups

Remove `input-group-append` and `input-group-prepend` wrapper divs. Children become direct children of `input-group`.

### Other Renames

| Find | Replace |
|------|---------|
| `sr-only` | `visually-hidden` |
| `badge-primary` (etc) | `text-bg-primary` (etc) |
| `badge-pill` | `rounded-pill` |
| `close` (close button) | `btn-close` |
| `no-gutters` | `g-0` |
| `btn-block` | Wrap parent in `d-grid` |
| `left-0` | `start-0` |
| `right-0` | `end-0` |

### Care Points

- `ml-`/`mr-`/`pl-`/`pr-` renames must be scoped to Bootstrap class contexts (not `pr-password`, Tailwind classes, etc.)
- `data-toggle` rename must skip `data-lte-toggle` attributes
- `close` class rename must only target Bootstrap close buttons, not generic usage

## Layer 4: JS API Migration

### main.ts

```js
// Remove: import 'popper.js';
// Keep: import 'bootstrap/dist/js/bootstrap.bundle.js'; (now BS5)
// Keep: import 'admin-lte/dist/js/adminlte.js'; (now v4)
```

### plugins/jquery.ts

```js
// Remove: import 'bootstrap/js/dist/tooltip';
// Remove: import 'bootstrap/js/dist/popover';
// Keep: import 'select2' and passwordRequirements
```

### App.vue

```js
import * as bootstrap from 'bootstrap';
// Replace jQuery popover/tooltip init with vanilla BS5
document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
```

### Modal calls (Cart.vue, PaymentTypes.vue, etc.)

```js
// Before: $('#add-card').modal('hide');
// After: bootstrap.Modal.getInstance(document.getElementById('add-card'))?.hide();

// Before: $('#myModal').modal('show');
// After: bootstrap.Modal.getOrCreateInstance(document.getElementById('myModal')).show();
```

### Files requiring JS audit

- App.vue (popover, tooltip)
- Cart.vue (modal)
- PaymentTypes.vue (modal)
- Login.vue (jQuery Bootstrap calls)
- PrePays.vue (jQuery Bootstrap calls)
- OrderVps.vue (jQuery Bootstrap calls)

## Layer 5: Companion Packages

### icheck-bootstrap → form-check

```html
<!-- Before -->
<div class="icheck-success">
    <input type="checkbox" id="foo" />
    <label for="foo">Label</label>
</div>

<!-- After -->
<div class="form-check">
    <input class="form-check-input" type="checkbox" id="foo" />
    <label class="form-check-label" for="foo">Label</label>
</div>
```

~9 files affected.

### Select2 theme

CSS import path change: `select2-bootstrap-5-theme/dist/select2-bootstrap-5-theme.min.css`
Init option: `theme: 'bootstrap-5'`

### SweetAlert2

Remove CSS import. Use default styling.

### Tempus Dominus

If used in code: migrate to `@eonasdan/tempus-dominus` v6 vanilla JS API.
If only in package.json: just remove.

## Layer 6: Custom CSS Fixup

### admin_darkmode.css (14K)

- Update selectors: `.main-header` → `.app-header`, `.main-sidebar` → `.app-sidebar`, `.content-wrapper` → `.app-main`, `.main-footer` → `.app-footer`
- Keep `body.dark-mode` toggle mechanism

### custom_styles.css (18K)

- Update selectors referencing old AdminLTE/BS4 classes
- Tailwind directives unaffected

### style.css / style2.css

- Audit and update renamed class references

### App.vue scoped style

- `.main-header` → `.app-header`

## Layer 7: Build Verification

- `yarn install` (resolve dependency conflicts)
- `yarn build` (type-check + production build)
- `yarn lint` (fix any lint errors from changes)
- Visual spot-check of key pages (dashboard, VPS list, billing, settings)
