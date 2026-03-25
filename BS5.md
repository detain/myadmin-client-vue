# Bootstrap 4 / AdminLTE 3 → Bootstrap 5 / AdminLTE 4 Migration Guide

This document details every change needed for a BS4→BS5 and AdminLTE 3→4 migration. Originally derived from a Vue 3 SPA migration (126 files, ~8,900 insertions / ~8,500 deletions), but written to be applied to **any codebase** — including PHP + Smarty template projects with standalone JS/CSS files.

## Adapting This Guide to PHP / Smarty Projects

This guide was derived from a Vue SPA but is written for a **PHP + Smarty + JS/CSS project** that uses `package.json`/`yarn` for dependency management. The same BS4→BS5 changes apply but are spread across more file types since HTML is generated both in `.tpl` templates and directly in `.php` files:

| Vue SPA | PHP / Smarty Project |
|---------|---------------------|
| `.vue` single-file components | `.tpl` Smarty templates + `.php` files that emit HTML |
| `import * as bootstrap from 'bootstrap'` in JS modules | `<script>` tags in layout templates loading bundled/compiled JS |
| Vue reactive class bindings (`:class="..."`) | Smarty `class="{if ...}active{/if}"` or PHP `echo`/heredoc |
| `onMounted()` lifecycle hook | `$(document).ready()` or `DOMContentLoaded` in a `<script>` block |
| Single `App.vue` layout shell | Smarty layout template (e.g., `header.tpl`, `layout.tpl`, `footer.tpl`) |
| Changes in ~126 `.vue` files | Changes spread across `.tpl`, `.php`, `.css`, and `.js` files |

**File types to search when migrating:**
- `.tpl` — Smarty templates (bulk of HTML changes)
- `.php` — any PHP that generates HTML via `echo`, heredoc, or inline HTML
- `.css` — stylesheets referencing BS4/AdminLTE 3 selectors
- `.js` — JavaScript using jQuery Bootstrap API or BS4 data attributes
- `.html` — static HTML files (if any)

**Recommended search command (from project root):**

```bash
# Find all files containing BS4 data attributes
grep -rn 'data-toggle=' --include='*.tpl' --include='*.php' --include='*.js' --include='*.html'

# Find all files containing BS4 spacing classes
grep -rn '\bml-\|mr-\|pl-\|pr-' --include='*.tpl' --include='*.php' --include='*.css'
```

---

## Table of Contents

1. [Dependency Changes](#1-dependency-changes)
2. [HTML Attribute Renames](#2-html-attribute-renames)
3. [CSS Class Renames](#3-css-class-renames)
4. [AdminLTE 3 → 4 Layout Changes](#4-adminlte-3--4-layout-changes)
5. [JavaScript / Bootstrap API Changes](#5-javascript--bootstrap-api-changes)
6. [Tailwind CSS Conflicts](#6-tailwind-css-conflicts)
7. [Font Awesome 4 → 5 Icon Fixes](#7-font-awesome-4--5-icon-fixes)
8. [Removed BS4 Components](#8-removed-bs4-components)
9. [Color and Contrast Fixes](#9-color-and-contrast-fixes)
10. [Form Control Changes](#10-form-control-changes)
11. [Table and Sort Layout Fixes](#11-table-and-sort-layout-fixes)
12. [Sidebar Fixes](#12-sidebar-fixes)
13. [Miscellaneous Visual Regressions](#13-miscellaneous-visual-regressions)
14. [Global CSS Rules Added](#14-global-css-rules-added)
15. [Print Stylesheet Updates](#15-print-stylesheet-updates)
16. [Smarty Template Patterns](#16-smarty-template-patterns)
17. [Change Scale Reference](#17-change-scale-reference)

---

## 1. Dependency Changes

### package.json (npm/yarn)

| Old (BS4) | New (BS5) |
|-----------|-----------|
| `bootstrap: ^4.6` | `bootstrap: ^5.3` |
| `admin-lte: ^3.0.1` | `admin-lte: ColorlibHQ/AdminLTE#master` (v4) |
| `@sweetalert2/theme-bootstrap-4` | *(removed)* |
| `@ttskch/select2-bootstrap4-theme` | *(removed)* |
| `select2-bootstrap-theme: ^0.1.0-beta.10` | `select2-bootstrap-5-theme: ^1.3.0` |
| `tempusdominus-bootstrap-4` | `@eonasdan/tempus-dominus: ^6.9` |
| *(none)* | `@popperjs/core: ^2.11` (BS5 peer dep) |

### CSS/JS Includes in Layout Templates

Whether assets are served from `node_modules` or CDN, update the references in your Smarty layout template:

```smarty
{* BS4 / AdminLTE 3 *}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/path/to/adminlte.min.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="/path/to/adminlte.min.js"></script>

{* BS5 / AdminLTE 4 *}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/path/to/adminlte.min.css"> {* AdminLTE 4 version *}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="/path/to/adminlte.min.js"> {* AdminLTE 4 version *}
```

**Note:** BS5 bundles Popper.js inside `bootstrap.bundle.min.js`. If you were loading Popper separately for BS4, you can remove that separate include when using the bundle.

### Font Awesome v4 Shims

If your PHP backend generates FA4 class names (e.g., `fa fa-file-text-o` from database values or PHP helper functions), add the v4 compatibility shim:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/all.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/css/v4-shims.min.css">
```

---

## 2. HTML Attribute Renames

BS5 namespaces all data attributes under `data-bs-*`. This is the most universal change — it applies identically regardless of whether the HTML is in a `.tpl`, `.php`, `.vue`, or `.html` file.

| BS4 | BS5 |
|-----|-----|
| `data-toggle="dropdown"` | `data-bs-toggle="dropdown"` |
| `data-toggle="collapse"` | `data-bs-toggle="collapse"` |
| `data-toggle="modal"` | `data-bs-toggle="modal"` |
| `data-toggle="tooltip"` | `data-bs-toggle="tooltip"` |
| `data-toggle="popover"` | `data-bs-toggle="popover"` |
| `data-toggle="tab"` | `data-bs-toggle="tab"` |
| `data-target="#id"` | `data-bs-target="#id"` |
| `data-dismiss="modal"` | `data-bs-dismiss="modal"` |
| `data-dismiss="alert"` | `data-bs-dismiss="alert"` |
| `data-content="..."` | `data-bs-content="..."` |
| `data-placement="..."` | `data-bs-placement="..."` |
| `data-widget="pushmenu"` | `data-lte-toggle="sidebar"` |
| `data-slide="..."` | `data-bs-slide="..."` |
| `data-ride="carousel"` | `data-bs-ride="carousel"` |
| `data-interval="..."` | `data-bs-interval="..."` |
| `data-parent="..."` | `data-bs-parent="..."` |

**Bulk replacement commands:**

```bash
# Run from project root — covers .tpl, .php, .js, .html files
find . -type f \( -name '*.tpl' -o -name '*.php' -o -name '*.js' -o -name '*.html' \) \
  -exec sed -i 's/data-toggle=/data-bs-toggle=/g' {} +

find . -type f \( -name '*.tpl' -o -name '*.php' -o -name '*.js' -o -name '*.html' \) \
  -exec sed -i 's/data-target=/data-bs-target=/g' {} +

find . -type f \( -name '*.tpl' -o -name '*.php' -o -name '*.js' -o -name '*.html' \) \
  -exec sed -i 's/data-dismiss=/data-bs-dismiss=/g' {} +

find . -type f \( -name '*.tpl' -o -name '*.php' -o -name '*.js' -o -name '*.html' \) \
  -exec sed -i 's/data-content=/data-bs-content=/g' {} +

find . -type f \( -name '*.tpl' -o -name '*.php' -o -name '*.js' -o -name '*.html' \) \
  -exec sed -i 's/data-placement=/data-bs-placement=/g' {} +

find . -type f \( -name '*.tpl' -o -name '*.php' -o -name '*.js' -o -name '*.html' \) \
  -exec sed -i 's/data-parent=/data-bs-parent=/g' {} +
```

**Also check PHP code** that generates data attributes dynamically:

```php
// BS4
echo '<button data-toggle="modal" data-target="#myModal">';

// BS5
echo '<button data-bs-toggle="modal" data-bs-target="#myModal">';
```

---

## 3. CSS Class Renames

### Spacing and Alignment

| BS4 | BS5 |
|-----|-----|
| `ml-*` | `ms-*` |
| `mr-*` | `me-*` |
| `pl-*` | `ps-*` |
| `pr-*` | `pe-*` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `float-left` | `float-start` |
| `float-right` | `float-end` |

**Warning on word boundaries:** `ml-auto` → `ms-auto`, but don't accidentally match `html-*`, `email-*`, etc. Use regex with word boundaries:

```bash
# Safe sed replacement for ml- classes
sed -i 's/\bml-\([0-9]\)/ms-\1/g; s/\bml-auto/ms-auto/g' file.tpl
sed -i 's/\bmr-\([0-9]\)/me-\1/g; s/\bmr-auto/me-auto/g' file.tpl
sed -i 's/\bpl-\([0-9]\)/ps-\1/g' file.tpl
sed -i 's/\bpr-\([0-9]\)/pe-\1/g' file.tpl
```

### Typography and Utilities

| BS4 | BS5 |
|-----|-----|
| `font-weight-bold` | `fw-bold` |
| `font-weight-light` | `fw-light` |
| `font-weight-normal` | `fw-normal` |
| `text-bold` (AdminLTE) | `fw-bold` |
| `font-italic` | `fst-italic` |
| `sr-only` | `visually-hidden` |
| `badge-*` (e.g. `badge-success`) | `bg-*` on badge (e.g. `badge bg-success`) |
| `btn-block` | `d-grid` wrapper or `w-100` on the button |

**Badge detail:** In BS4, `badge badge-success` used one contextual class. In BS5, keep `badge` and change the color class: `badge bg-success`. The `badge` class provides shape; `bg-*` provides color.

**btn-block example:**

```html
{* BS4 *}
<button class="btn btn-primary btn-block">Submit</button>

{* BS5 option A: d-grid wrapper *}
<div class="d-grid">
    <button class="btn btn-primary">Submit</button>
</div>

{* BS5 option B: w-100 directly *}
<button class="btn btn-primary w-100">Submit</button>
```

### Forms (most frequent change category)

| BS4 | BS5 |
|-----|-----|
| `form-group` | `mb-3` |
| `form-row` | `row g-3` |
| `custom-control` | `form-check` |
| `custom-control-input` | `form-check-input` |
| `custom-control-label` | `form-check-label` |
| `custom-checkbox` | `form-check` |
| `custom-radio` | `form-check` |
| `custom-switch` | `form-check form-switch` |
| `custom-select` | `form-select` |
| `form-control` (on `<select>`) | `form-select` |
| `input-group-append` | *(removed — place button directly in input-group)* |
| `input-group-prepend` | *(removed — place span directly in input-group)* |

**Note:** `form-group` → `mb-3` is typically the single most frequent change in any AdminLTE migration.

### Close Button

BS5 replaces the close button class AND removes the inner `×` character. The new `btn-close` uses a CSS background-image for the X icon:

```html
{* BS4 *}
<button type="button" class="close" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>

{* BS5 *}
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
```

**Key difference:** The `<span>&times;</span>` inside the button must be removed entirely.

### Dropdowns

| BS4 | BS5 |
|-----|-----|
| `dropdown-menu-right` | `dropdown-menu-end` |
| `dropdown-menu-left` | `dropdown-menu-start` |

### Grid

| BS4 | BS5 |
|-----|-----|
| `no-gutters` | `g-0` |

### Opacity Utilities

| BS4 | BS5 |
|-----|-----|
| `style="opacity: 0.8"` | `opacity-75` class (or keep inline) |

BS5 provides `opacity-25`, `opacity-50`, `opacity-75`, `opacity-100` utility classes.

---

## 4. AdminLTE 3 → 4 Layout Changes

AdminLTE 4 renames the major layout wrapper classes. In a PHP/Smarty project, these typically live in your **layout/header/footer templates** (e.g., `header.tpl`, `layout.tpl`, `footer.tpl`):

| AdminLTE 3 | AdminLTE 4 |
|------------|------------|
| `.wrapper` | `.app-wrapper` |
| `.main-header` | `.app-header` |
| `.main-sidebar` | `.app-sidebar` |
| `.main-footer` | `.app-footer` |
| `.content-wrapper` | `.app-main` (outer) / `.app-content` (inner) |
| `.content-header` | `.app-content-header` |
| `.content` | `.app-content` (body area) |
| `sidebar-dark-primary` | `bg-body-secondary` + `data-bs-theme="dark"` |
| `navbar-dark` | `bg-dark` + `data-bs-theme="dark"` |
| `elevation-1` | `shadow-sm` |
| `elevation-2` | `shadow` |
| `elevation-4` | `shadow` (or `shadow-lg` for more) |
| `brand-link` (as direct child of aside) | Wrap in `<div class="sidebar-brand">` |
| `.sidebar` (scrollable area) | `.sidebar-wrapper` |
| `data-widget="pushmenu"` | `data-lte-toggle="sidebar"` |
| `data-widget="treeview"` | `data-lte-toggle="treeview"` |

### Navbar Structure

BS5 requires a `container-fluid` wrapper inside the navbar:

```html
{* BS4 / AdminLTE 3 (e.g., in header.tpl) *}
<nav class="main-header navbar navbar-expand navbar-dark">
    <ul class="navbar-nav">...</ul>
    <ul class="navbar-nav ml-auto">...</ul>
</nav>

{* BS5 / AdminLTE 4 *}
<nav class="app-header navbar navbar-expand bg-dark" data-bs-theme="dark">
    <div class="container-fluid">
        <ul class="navbar-nav">...</ul>
        <ul class="navbar-nav ms-auto">...</ul>
    </div>
</nav>
```

### Sidebar Brand

```html
{* BS4 / AdminLTE 3 *}
<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <a href="/" class="brand-link">
        <img src="logo.png" class="brand-image" />
        <span class="brand-text">App Name</span>
    </a>
    <div class="sidebar">...</div>
</aside>

{* BS5 / AdminLTE 4 *}
<aside class="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
    <div class="sidebar-brand">
        <a href="/" class="brand-link">
            <img src="logo.png" class="brand-image" />
            <span class="brand-text fw-light">App Name</span>
        </a>
    </div>
    <div class="sidebar-wrapper">...</div>
</aside>
```

### Sidebar Brand Alignment

AdminLTE 4 centers the brand by default. To left-align:

```css
.sidebar-brand .brand-link {
    justify-content: flex-start;
    padding-left: 0.5rem;
}
```

### User Panel Border

AdminLTE 4 removes the bottom border from `.user-panel`. Restore with:

```css
.user-panel {
    border-bottom: 1px solid #4f5b62;
}
```

### Content Header

AdminLTE 4 adds extra padding. Reduce with:

```html
{* Smarty *}
<div class="app-content-header pb-0">
    <div class="container-fluid">
        <div class="row mb-0">
            <div class="col-sm-6"><h3>{$page_title}</h3></div>
            <div class="col-sm-6">{* breadcrumbs *}</div>
        </div>
    </div>
</div>
```

### Body Classes

Update the `<body>` tag in your layout template:

```html
{* BS4 / AdminLTE 3 *}
<body class="hold-transition sidebar-mini layout-fixed">

{* BS5 / AdminLTE 4 *}
<body class="hold-transition sidebar-mini layout-fixed sidebar-expand-lg bg-body-tertiary">
```

### Treeview (Sidebar Submenu Toggle)

AdminLTE 4's treeview JS may not auto-initialize if AdminLTE's JS loads before the sidebar HTML is fully rendered (common in PHP apps that load JS in the `<head>`). Add a manual toggle handler:

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-lte-toggle="treeview"]').forEach(function(el) {
        el.addEventListener('click', function(event) {
            var target = event.target;
            var navItem = target.closest('.nav-item');
            var treeviewMenu = navItem ? navItem.querySelector('.nav-treeview') : null;
            if (!treeviewMenu || !navItem) return;
            var navLink = target.closest('.nav-link');
            if (target.getAttribute('href') === '#' || (navLink && navLink.getAttribute('href') === '#')) {
                event.preventDefault();
            }
            var isOpen = navItem.classList.contains('menu-open');
            // Accordion: close siblings
            var parent = navItem.parentElement;
            if (parent) {
                parent.querySelectorAll(':scope > .nav-item.menu-open').forEach(function(sib) {
                    if (sib !== navItem) {
                        sib.classList.remove('menu-open');
                        var sub = sib.querySelector('.nav-treeview');
                        if (sub) sub.style.display = 'none';
                    }
                });
            }
            if (isOpen) {
                navItem.classList.remove('menu-open');
                treeviewMenu.style.display = 'none';
            } else {
                navItem.classList.add('menu-open');
                treeviewMenu.style.display = 'block';
            }
        });
    });
});
</script>
```

### Sidebar Collapse Logic Rewrite

AdminLTE 3's `data-widget="pushmenu"` handled both mobile and desktop sidebar toggling automatically. AdminLTE 4 requires manual handling:

```js
function collapseMenu() {
    var body = document.body;
    var isMobile = window.innerWidth <= 992;
    if (isMobile) {
        body.classList.toggle('sidebar-open');
        body.classList.remove('sidebar-collapse');
    } else {
        body.classList.toggle('sidebar-collapse');
    }
    // Persist state in cookie
    var toggleState = body.classList.contains('sidebar-collapse') ? 'closed' : 'opened';
    document.cookie = 'toggleState=' + toggleState + '; path=/';
}
```

---

## 5. JavaScript / Bootstrap API Changes

### Tooltips and Popovers

BS5 requires explicit initialization. jQuery auto-init no longer works:

```js
// BS4 (jQuery)
$('[data-toggle="popover"]').popover();
$('[data-toggle="tooltip"]').tooltip();

// BS5 (vanilla JS — put in your footer.tpl or main.js)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function(el) {
        new bootstrap.Popover(el);
    });
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function(el) {
        new bootstrap.Tooltip(el);
    });
});
```

### Select2 Theme

```js
// BS4
$('.select2bs4').select2({ theme: 'bootstrap4' });

// BS5
$('.select2bs4').select2({ theme: 'bootstrap-5' });
```

### Bootstrap Component API (Modals, Collapse, etc.)

BS4 used jQuery methods. BS5 uses vanilla JS constructors:

```js
// BS4 (jQuery)
$('#myModal').modal('show');
$('#myModal').modal('hide');
$('#myCollapse').collapse('toggle');

// BS5 (vanilla JS)
var modalEl = document.getElementById('myModal');
var modal = new bootstrap.Modal(modalEl);
modal.show();
modal.hide();

var collapseEl = document.getElementById('myCollapse');
var collapse = new bootstrap.Collapse(collapseEl);
collapse.toggle();
```

**Common BS5 component constructors:**
- `new bootstrap.Modal(element)` — `.show()`, `.hide()`, `.toggle()`
- `new bootstrap.Collapse(element)` — `.show()`, `.hide()`, `.toggle()`
- `new bootstrap.Tooltip(element)` — `.show()`, `.hide()`, `.dispose()`
- `new bootstrap.Popover(element)` — `.show()`, `.hide()`, `.dispose()`
- `new bootstrap.Dropdown(element)` — `.show()`, `.hide()`, `.toggle()`
- `new bootstrap.Tab(element)` — `.show()`
- `new bootstrap.Toast(element)` — `.show()`, `.hide()`

**Important for PHP projects:** If you have inline `onclick="$('#modal').modal('show')"` attributes in your Smarty templates or PHP-generated HTML, these all need updating:

```html
{* BS4 *}
<button onclick="$('#myModal').modal('show')">Open</button>

{* BS5 option A: data attribute (preferred — no JS needed) *}
<button data-bs-toggle="modal" data-bs-target="#myModal">Open</button>

{* BS5 option B: vanilla JS *}
<button onclick="new bootstrap.Modal(document.getElementById('myModal')).show()">Open</button>
```

### jQuery Bootstrap Plugin Registration

BS4's `bootstrap.js` auto-registered as jQuery plugins (`$.fn.modal`, `$.fn.tooltip`, etc.). BS5 does **not** register jQuery plugins. If your code calls `$(...).modal()` etc., you have two choices:

1. **Recommended:** Rewrite to vanilla BS5 API (see above)
2. **Compatibility bridge:** Load the separate [Bootstrap 5 jQuery plugin](https://github.com/nicehash/bootstrap5-jquery) if you have too many jQuery calls to rewrite immediately

---

## 6. Tailwind CSS Conflicts

**Skip this section if your project does not use Tailwind CSS.**

### Heading Styles Stripped by Preflight

`@tailwind base` (Preflight) resets h1-h6 to `font-size: inherit; font-weight: inherit`. Restore BS5 defaults after the Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Restore BS5 heading styles stripped by Tailwind preflight */
h1 { font-size: 2.5rem; font-weight: 500; }
h2 { font-size: 2rem; font-weight: 500; }
h3 { font-size: 1.75rem; font-weight: 500; }
h4 { font-size: 1.5rem; font-weight: 500; }
h5 { font-size: 1.25rem; font-weight: 500; }
h6 { font-size: 1rem; font-weight: 500; }
```

### Button Border Stripped

Tailwind preflight also removes default button borders. If you have custom button classes (`.btn-app`, etc.), explicitly set `border`:

```css
.btn-app {
    border: 1px solid #ddd;
}
```

---

## 7. Font Awesome 4 → 5 Icon Fixes

### v4 Shims for Server-Generated Icons

If your PHP backend generates FA4 class names (from database, config, or helper functions), the v4 shims CSS handles most renames automatically. Add this to your layout template:

```html
<link rel="stylesheet" href="/path/to/fontawesome/css/v4-shims.min.css">
```

### Common Manual Renames

For icons hardcoded in templates and PHP files:

| FA4 | FA5 |
|-----|-----|
| `fa fa-file-text-o` | `far fa-file-alt` |
| `fa fa-trash-o` | `fas fa-trash` |
| `fa fa-money` | `fas fa-money-bill` |
| `fa fa-bar-chart` | `fas fa-chart-bar` |
| `fa fa-area-chart` | `fas fa-chart-area` |
| `fa fa-ticket` | `fas fa-ticket-alt` |
| `fa fa-file-text` | `fas fa-file-alt` |
| `fa fa-pencil` | `fas fa-pencil-alt` |
| `fa fa-envelope-o` | `far fa-envelope` |
| `fa fa-calendar-o` | `far fa-calendar` |
| `fa fa-clock-o` | `far fa-clock` |
| `fa fa-times-circle-o` | `far fa-times-circle` |
| `fa fa-check-circle-o` | `far fa-check-circle` |
| `fa fa-cog` / `fa fa-gear` | `fas fa-cog` |

### Prefix Issues: `far` vs `fas`

Some icons exist only in the `fas` (solid) set, not `far` (regular):

| Broken | Fix |
|--------|-----|
| `far fa-chart-line` | `fas fa-chart-line` |
| `far fa-ticket-alt` | `fas fa-ticket-alt` |
| `far fa-tachometer-alt` | `fas fa-tachometer-alt` |

### Icons Generated by PHP

Search your PHP codebase for icon class generation:

```bash
grep -rn "fa fa-\|fa-.*icon\|class.*fa-" --include='*.php' --include='*.tpl'
```

In PHP helper functions that return icon classes:

```php
// BS4
function getStatusIcon($status) {
    return 'fa fa-check-circle-o';
}

// BS5
function getStatusIcon($status) {
    return 'far fa-check-circle';
}
```

In Smarty templates:

```smarty
{* BS4 *}
<i class="fa fa-file-text-o"></i>

{* BS5 *}
<i class="far fa-file-alt"></i>
```

---

## 8. Removed BS4 Components

### `card-columns`

BS5 removed the `card-columns` class. Replace with responsive grid:

```html
{* BS4 *}
<div class="card-columns">
    <div class="card">...</div>
    <div class="card">...</div>
</div>

{* BS5 *}
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
    <div class="col">
        <div class="card">...</div>
    </div>
    <div class="col">
        <div class="card">...</div>
    </div>
</div>
```

**In Smarty with loops:**

```smarty
{* BS4 *}
<div class="card-columns">
    {foreach $items as $item}
        <div class="card">...</div>
    {/foreach}
</div>

{* BS5 *}
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
    {foreach $items as $item}
        <div class="col">
            <div class="card">...</div>
        </div>
    {/foreach}
</div>
```

### `card-deck`

Also removed in BS5. Replace with:

```html
{* BS4 *}
<div class="card-deck">...</div>

{* BS5 *}
<div class="row row-cols-1 row-cols-md-3 g-4">
    <div class="col">...</div>
</div>
```

### `input-group-append` / `input-group-prepend`

These wrappers are removed. Place buttons/spans directly inside `.input-group`:

```html
{* BS4 *}
<div class="input-group">
    <input class="form-control" />
    <div class="input-group-append">
        <button class="btn btn-primary">Go</button>
    </div>
</div>

{* BS5 *}
<div class="input-group">
    <input class="form-control" />
    <button class="btn btn-primary">Go</button>
</div>
```

### `jumbotron`

Removed in BS5. Replace with utility classes:

```html
{* BS4 *}
<div class="jumbotron">...</div>

{* BS5 *}
<div class="p-5 mb-4 bg-light rounded-3">...</div>
```

---

## 9. Color and Contrast Fixes

### Colored Backgrounds No Longer Auto-Set White Text

In BS4, `.bg-success`, `.bg-warning`, etc., automatically set `color: #fff`. BS5 does not. Add explicit white text:

```html
{* BS4 — white text was automatic *}
<div class="bg-success">White text here</div>

{* BS5 — must add text-white explicitly *}
<div class="bg-success text-white">White text here</div>
```

**Global CSS fix** for AdminLTE small-box info cards:

```css
.small-box[class*="bg-"] {
    color: #fff;
}
.small-box[class*="bg-"] a,
.small-box[class*="bg-"] .small-box-footer {
    color: rgba(255, 255, 255, 0.85);
}
```

### Info Box / Small Box Uniform Height

Set `min-height` to prevent different content lengths from creating uneven boxes:

```css
.small-box .inner {
    min-height: 120px;
}
```

---

## 10. Form Control Changes

### Select Elements

All `<select>` elements should use `form-select` instead of `form-control`:

```html
{* BS4 *}
<select class="form-control" name="status">

{* BS5 *}
<select class="form-select" name="status">
```

**In PHP-generated HTML:**

```php
// BS4
echo '<select class="form-control">';

// BS5
echo '<select class="form-select">';
```

### Scoping Width Rules

If you had global width rules on `.form-control` or `.custom-select` for DataTables length selectors, re-scope them to `.form-select`:

```css
/* BEFORE — breaks all selects after migration */
.form-select {
    width: 80px !important;
}

/* AFTER — scoped to DataTables only */
.dataTables_length .form-select,
.dt-length .form-select {
    width: 80px !important;
}
```

### Checkboxes and Radios (iCheck → native BS5)

AdminLTE 3 used the iCheck plugin. BS5 has native styled form controls that replace this entirely.

**All iCheck variants to replace:**
- `icheck-success` → `form-check`
- `icheck-primary` → `form-check`
- `icheck-danger` → `form-check`
- `icheck-info` → `form-check`
- `icheck-warning` → `form-check`

```html
{* BS4 / iCheck *}
<div class="icheck-success">
    <input type="checkbox" id="cb" />
    <label for="cb">Label</label>
</div>

{* BS5 *}
<div class="form-check">
    <input type="checkbox" id="cb" class="form-check-input" />
    <label for="cb" class="form-check-label">Label</label>
</div>
```

**For radio buttons:**

```html
{* BS4 / iCheck *}
<div class="icheck-primary">
    <input type="radio" id="r1" name="group" value="1" />
    <label for="r1">Option 1</label>
</div>

{* BS5 *}
<div class="form-check">
    <input type="radio" id="r1" name="group" value="1" class="form-check-input" />
    <label for="r1" class="form-check-label">Option 1</label>
</div>
```

**For switches:**

```html
{* BS4 *}
<div class="custom-control custom-switch">
    <input type="checkbox" class="custom-control-input" id="sw" />
    <label class="custom-control-label" for="sw">Toggle</label>
</div>

{* BS5 *}
<div class="form-check form-switch">
    <input type="checkbox" class="form-check-input" id="sw" />
    <label class="form-check-label" for="sw">Toggle</label>
</div>
```

Style the accent color to match the old iCheck theme:

```css
.form-check-input:checked {
    background-color: #136bdd !important;
    border-color: #136bdd !important;
}

.form-check-input:not(:checked):not(:disabled):hover {
    border-color: #136bdd !important;
}
```

**Also remove:** Any iCheck CSS/JS file includes and iCheck override rules in custom stylesheets.

---

## 11. Table and Sort Layout Fixes

### Sort Icons on Separate Line

Adding `display: inline` to `<th>` elements breaks `display: table-cell`. Instead, target only the icons inside headers:

```css
/* DO NOT do this — breaks table layout */
th.sortable { display: inline; }

/* DO this — keeps sort arrows inline with text */
th > i.fa,
th > i.fas,
th > i.far {
    display: inline;
}
```

### Table nowrap Overflow

BS5 may handle `nowrap` differently. If table content overflows its container, remove `nowrap` class and `white-space: nowrap` from `<th>` elements:

```html
{* Remove nowrap from table class and th styles *}
<table class="table table-striped">  {* removed 'nowrap' class *}
    <th style="cursor: pointer;">     {* removed 'white-space: nowrap' *}
```

---

## 12. Sidebar Fixes

### Profile Image Size

AdminLTE 4 may render the profile image smaller. Set explicit dimensions:

```html
<img src="{$user_avatar}" style="width: 42px; height: 42px; margin-left: 0.2rem; flex-shrink: 0" />
```

### Hide User Info When Collapsed

When sidebar is collapsed, long text causes overflow:

```html
<div class="user-panel d-flex align-items-center" style="overflow: hidden">
```

### Navbar Icon/Text Color

AdminLTE 4 may render navbar icons too dark. Ensure the navbar has `bg-dark` and `data-bs-theme="dark"`:

```html
<nav class="app-header navbar navbar-expand bg-dark" data-bs-theme="dark">
```

---

## 13. Miscellaneous Visual Regressions

### `.btn-app` (AdminLTE Link Buttons)

AdminLTE 4 removed the `.btn-app` styles. Recreate them:

```css
.btn-app {
    background-color: #f8f9fa !important;
    transition-duration: 0.3s;
    color: #6c757d !important;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 10px 5px 5px;
    min-width: 80px;
    text-align: center;
    margin-right: 5px;
}
.btn-app > .fas, .btn-app > .far, .btn-app > .fa {
    display: block;
    font-size: 1.4rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 0.25rem;
}
```

### Card Title Icon Spacing

AdminLTE 4 removes default spacing between card title icons and text. Add globally:

```css
.card-title > i {
    margin-right: 0.35rem;
}
```

### Status Filter Button Group

If status filter buttons used `nav-tabs`, switch to a `btn-group`:

```html
{* BS4 *}
<ul class="nav nav-tabs">
    <li class="nav-item"><a class="nav-link {if $status == 'active'}active{/if}">Active</a></li>
</ul>

{* BS5 *}
<div id="title_btns" class="btn-group">
    <a class="btn btn-info btn-sm {if $status == 'active'}active{/if}">Active</a>
</div>
```

### `text-bold` → `fw-bold`

AdminLTE 3 used `.text-bold`. BS5 uses `.fw-bold`:

```bash
# Bulk replace
find . -type f \( -name '*.tpl' -o -name '*.php' -o -name '*.css' \) \
  -exec sed -i 's/text-bold/fw-bold/g' {} +
```

---

## 14. Global CSS Rules Added

These rules fix widespread issues with a single rule rather than editing dozens of template files. Add them to your main custom stylesheet:

```css
/* 1. Card title icon spacing */
.card-title > i { margin-right: 0.35rem; }

/* 2. Uniform small-box height */
.small-box .inner { min-height: 120px; }

/* 3. White text on colored small-boxes */
.small-box[class*="bg-"] { color: #fff; }
.small-box[class*="bg-"] a,
.small-box[class*="bg-"] .small-box-footer { color: rgba(255, 255, 255, 0.85); }

/* 4. Sort icons inline with header text */
th > i.fa, th > i.fas, th > i.far { display: inline; }

/* 5. btn-app recreation (AdminLTE 4 removed it) */
.btn-app {
    background-color: #f8f9fa !important;
    transition-duration: 0.3s;
    color: #6c757d !important;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 10px 5px 5px;
    min-width: 80px;
    text-align: center;
    margin-right: 5px;
}
.btn-app > .fas, .btn-app > .far, .btn-app > .fa {
    display: block;
    font-size: 1.4rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 0.25rem;
}

/* 6. Checkbox accent color (to match old iCheck theme) */
.form-check-input:checked {
    background-color: #136bdd !important;
    border-color: #136bdd !important;
}

/* 7. Restore heading styles (only if using Tailwind CSS) */
/* h1 { font-size: 2.5rem; font-weight: 500; } */
/* h2 { font-size: 2rem; font-weight: 500; } */
/* ... etc ... */
```

---

## 15. Print Stylesheet Updates

Print stylesheets reference layout wrapper selectors that change with AdminLTE 4. Update all selectors:

```css
/* BS4 / AdminLTE 3 */
.content-wrapper { /* print rules */ }
.main-sidebar { display: none; }
.main-header { display: none; }
.main-footer { display: none; }

/* BS5 / AdminLTE 4 */
.app-main { /* print rules */ }
.app-sidebar { display: none; }
.app-header { display: none; }
.app-footer { display: none; }
```

Also update any dark mode CSS that targets the old class names.

---

## 16. Smarty Template Patterns

### Conditional Classes in Smarty

Smarty templates use `{if}` blocks where Vue/React use dynamic bindings. The class names change the same way:

```smarty
{* BS4 *}
<div class="badge badge-{if $status == 'active'}success{else}danger{/if}">
    {$status}
</div>

{* BS5 *}
<div class="badge bg-{if $status == 'active'}success{else}danger{/if}">
    {$status}
</div>
```

### PHP Helper Functions That Generate HTML

Search for PHP functions that return or echo HTML with BS4 classes. Common patterns:

```php
// BS4 — function generating a modal trigger
function modalButton($id, $label) {
    return '<button class="btn btn-primary" data-toggle="modal" data-target="#'.$id.'">'.$label.'</button>';
}

// BS5
function modalButton($id, $label) {
    return '<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#'.$id.'">'.$label.'</button>';
}
```

```php
// BS4 — function generating form groups
function formGroup($label, $input) {
    return '<div class="form-group">'.$label.$input.'</div>';
}

// BS5
function formGroup($label, $input) {
    return '<div class="mb-3">'.$label.$input.'</div>';
}
```

### Smarty Plugins / Modifiers

If you have custom Smarty plugins that generate BS4 markup, update those too:

```php
// In a Smarty plugin file (e.g., function.bs_alert.php)
// BS4
$html = '<div class="alert alert-'.$type.'">';
$html .= '<button type="button" class="close" data-dismiss="alert">&times;</button>';

// BS5
$html = '<div class="alert alert-'.$type.'">';
$html .= '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
```

### Finding All Affected Files

```bash
# Find all template files with BS4 patterns
echo "=== data-toggle ===" && grep -rl 'data-toggle=' --include='*.tpl' --include='*.php'
echo "=== form-group ===" && grep -rl 'form-group' --include='*.tpl' --include='*.php'
echo "=== ml-/mr-/pl-/pr- ===" && grep -rl '\bml-\|\bmr-\|\bpl-\|\bpr-' --include='*.tpl' --include='*.php' --include='*.css'
echo "=== icheck ===" && grep -rl 'icheck-' --include='*.tpl' --include='*.php'
echo "=== custom-control ===" && grep -rl 'custom-control\|custom-select\|custom-switch' --include='*.tpl' --include='*.php'
echo "=== input-group-append/prepend ===" && grep -rl 'input-group-append\|input-group-prepend' --include='*.tpl' --include='*.php'
echo "=== FA4 icons ===" && grep -rl '"fa fa-\|class="fa ' --include='*.tpl' --include='*.php'
echo "=== badge- ===" && grep -rl 'badge-success\|badge-danger\|badge-warning\|badge-info\|badge-primary' --include='*.tpl' --include='*.php'
echo "=== card-columns ===" && grep -rl 'card-columns' --include='*.tpl' --include='*.php' --include='*.css'
echo "=== btn-block ===" && grep -rl 'btn-block' --include='*.tpl' --include='*.php'
echo "=== AdminLTE 3 layout ===" && grep -rl 'main-sidebar\|main-header\|main-footer\|content-wrapper\|sidebar-dark-primary' --include='*.tpl' --include='*.php' --include='*.css'
```

---

## 17. Change Scale Reference

These counts are from the Vue SPA migration. Your PHP project may have different scale, but the relative proportions are typically similar:

| Category | Approximate Instance Count |
|----------|---------------------------|
| Form class migrations (`form-group`, `custom-*`, `input-group-*`) | ~400+ |
| Spacing/float utility renames (`ml-`→`ms-`, `float-left`→`float-start`, etc.) | ~370 |
| Font Awesome icon fixes | ~260 lines |
| Data attribute namespace changes (`data-toggle`→`data-bs-toggle`) | ~197 |
| Typography utility renames (`font-weight-bold`→`fw-bold`, `text-bold`→`fw-bold`) | ~130 |
| iCheck → form-check migrations | ~61 |
| AdminLTE structural renames (wrapper, header, sidebar, footer) | ~50 |
| Bootstrap JS API conversions (jQuery → vanilla) | ~22 |
| Badge class migrations (`badge-*`→`bg-*`) | ~20 |
| Close button migrations | ~14 |
| Accessibility class renames (`sr-only`→`visually-hidden`) | ~7 |

---

## Migration Checklist

### Phase 1: Dependencies and Includes
- [ ] Update `package.json`: `bootstrap` ^4.6 → ^5.3
- [ ] Update `package.json`: `admin-lte` ^3.x → v4 (`ColorlibHQ/AdminLTE#master` or latest release)
- [ ] Replace `select2-bootstrap-theme` with `select2-bootstrap-5-theme` in package.json
- [ ] Replace `tempusdominus-bootstrap-4` with `@eonasdan/tempus-dominus` ^6.9
- [ ] Add `@popperjs/core` ^2.11 if not already present (BS5 peer dep)
- [ ] Remove BS4-only packages: `@sweetalert2/theme-bootstrap-4`, `@ttskch/select2-bootstrap4-theme`
- [ ] Run `yarn install` to regenerate lock file
- [ ] Add FA4 v4-shims CSS include if PHP backend generates FA4 class names
- [ ] Remove iCheck CSS/JS includes
- [ ] Remove any other BS4-specific theme CSS

### Phase 2: Global Find-Replace (mechanical, can be scripted)

These can be run as bulk `sed` commands across `.tpl`, `.php`, `.js`, `.css`, `.html` files:

- [ ] `data-toggle=` → `data-bs-toggle=`
- [ ] `data-target=` → `data-bs-target=`
- [ ] `data-dismiss=` → `data-bs-dismiss=`
- [ ] `data-content=` → `data-bs-content=`
- [ ] `data-placement=` → `data-bs-placement=`
- [ ] `data-parent=` → `data-bs-parent=`
- [ ] `data-slide` → `data-bs-slide`
- [ ] `data-ride=` → `data-bs-ride=`
- [ ] `data-interval=` → `data-bs-interval=`
- [ ] `ml-` → `ms-`, `mr-` → `me-`, `pl-` → `ps-`, `pr-` → `pe-` (use word boundaries!)
- [ ] `text-left` → `text-start`, `text-right` → `text-end`
- [ ] `float-left` → `float-start`, `float-right` → `float-end`
- [ ] `font-weight-bold` → `fw-bold`, `font-weight-light` → `fw-light`, `font-weight-normal` → `fw-normal`
- [ ] `text-bold` (AdminLTE) → `fw-bold`
- [ ] `sr-only` → `visually-hidden`
- [ ] `badge-success`/`-danger`/`-warning`/etc. → `bg-success`/`bg-danger`/`bg-warning`/etc. (keep `badge` class)
- [ ] `no-gutters` → `g-0`
- [ ] `dropdown-menu-right` → `dropdown-menu-end`
- [ ] `form-group` → `mb-3`
- [ ] `form-row` → `row g-3`

### Phase 3: Form Controls (semi-mechanical, review each)
- [ ] Replace `custom-control` → `form-check`, `custom-control-input` → `form-check-input`, `custom-control-label` → `form-check-label`
- [ ] Replace `custom-checkbox` → `form-check`, `custom-radio` → `form-check`
- [ ] Replace `custom-switch` → `form-check form-switch`
- [ ] Replace `custom-select` → `form-select`
- [ ] Replace `form-control` on `<select>` elements → `form-select`
- [ ] Replace `icheck-*` → `form-check` (all iCheck variants)
- [ ] Remove `input-group-append`/`input-group-prepend` wrappers (keep children)
- [ ] Replace `btn-block` → `d-grid` wrapper or `w-100`
- [ ] Replace `close` buttons with `btn-close` (remove inner `<span>&times;</span>`)

### Phase 4: AdminLTE Layout (manual, layout templates)
- [ ] Update layout wrapper classes in header/footer/layout templates
- [ ] `wrapper`→`app-wrapper`, `main-header`→`app-header`, `main-sidebar`→`app-sidebar`, `main-footer`→`app-footer`, `content-wrapper`→`app-main`
- [ ] Add `container-fluid` wrapper inside navbar
- [ ] Wrap `brand-link` in `sidebar-brand` div
- [ ] Replace `.sidebar` with `.sidebar-wrapper`
- [ ] Replace `sidebar-dark-primary` with `bg-body-secondary` + `data-bs-theme="dark"`
- [ ] Replace `navbar-dark` with `bg-dark` + `data-bs-theme="dark"`
- [ ] Replace `elevation-*` with `shadow`/`shadow-sm`
- [ ] Add `sidebar-expand-lg` and `bg-body-tertiary` to `<body>` classes
- [ ] Rewrite sidebar collapse logic for mobile/desktop
- [ ] Add treeview JS handler in `DOMContentLoaded`
- [ ] Replace `data-widget="pushmenu"` → `data-lte-toggle="sidebar"`

### Phase 5: JavaScript API (manual)
- [ ] Replace `$(...).tooltip()` with `new bootstrap.Tooltip()`
- [ ] Replace `$(...).popover()` with `new bootstrap.Popover()`
- [ ] Replace `$(...).modal('show'/'hide')` with `new bootstrap.Modal()` API
- [ ] Replace `$(...).collapse()` with `new bootstrap.Collapse()` API
- [ ] Replace inline `onclick` jQuery BS4 calls with `data-bs-*` attributes or vanilla JS
- [ ] Update Select2 theme: `'bootstrap4'` → `'bootstrap-5'`
- [ ] Check PHP helper functions that generate JS with BS4 API calls

### Phase 6: Template-Specific (manual)
- [ ] Replace `card-columns` with `row row-cols-*` grid (wrap items in `<div class="col">`)
- [ ] Replace `card-deck` with `row row-cols-*` grid
- [ ] Replace `jumbotron` with `p-5 mb-4 bg-light rounded-3`
- [ ] Fix FA4→FA5 icon names in templates (see Section 7 table)
- [ ] Fix FA4→FA5 icon names in PHP helper functions
- [ ] Fix `far` → `fas` prefix for solid-only icons
- [ ] Check Smarty plugins that generate BS4 markup

### Phase 7: CSS Fixes (global stylesheet)
- [ ] Add btn-app recreation CSS (if using AdminLTE btn-app)
- [ ] Add card-title icon spacing rule
- [ ] Add small-box white text rules
- [ ] Add sort icon inline display rules
- [ ] Add checkbox accent color rules
- [ ] Scope any global form-select width rules to DataTables only
- [ ] Update print stylesheet selectors for AdminLTE 4 class names
- [ ] Update dark mode CSS selectors for AdminLTE 4 class names
- [ ] Add Tailwind heading restoration CSS (only if using Tailwind)

### Phase 8: Visual QA
- [ ] Test every page for visual regressions
- [ ] Check sidebar collapsed state
- [ ] Check mobile responsive behavior
- [ ] Check dark mode (if applicable)
- [ ] Check all modals open/close correctly
- [ ] Check all dropdowns work
- [ ] Check all tooltips/popovers render
- [ ] Check form validation styling
- [ ] Check DataTables integration
- [ ] Check print layout
- [ ] Check PHP-generated HTML (AJAX responses, email templates, etc.)
