# Bootstrap 4 / AdminLTE 3 → Bootstrap 5 / AdminLTE 4 Migration Guide

This document details every change made during the BS4→BS5 and AdminLTE 3→4 migration of this Vue 3 + TypeScript SPA (126 files changed, ~8,900 insertions / ~8,500 deletions across 28 commits). Use it as a checklist when applying the same upgrade to a similar codebase.

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
16. [View-Specific Large Restructurings](#16-view-specific-large-restructurings)
17. [Files Changed Summary](#17-files-changed-summary)
18. [Change Scale Reference](#18-change-scale-reference)

---

## 1. Dependency Changes

### package.json

| Old (BS4) | New (BS5) |
|-----------|-----------|
| `bootstrap: ^4.6` | `bootstrap: ^5.3` |
| `admin-lte: ^3.0.1` | `admin-lte: ColorlibHQ/AdminLTE#master` (v4) |
| `@sweetalert2/theme-bootstrap-4` | *(removed)* |
| `@ttskch/select2-bootstrap4-theme` | *(removed)* |
| `select2-bootstrap-theme: ^0.1.0-beta.10` | `select2-bootstrap-5-theme: ^1.3.0` |
| `tempusdominus-bootstrap-4` | `@eonasdan/tempus-dominus: ^6.9` |
| *(none)* | `@popperjs/core: ^2.11` (BS5 peer dep) |

### Import Changes

```js
// Old
import 'bootstrap';
// New — explicit namespace import for tree-shaking and API access
import * as bootstrap from 'bootstrap';
```

```css
/* Old */
@import '@fortawesome/fontawesome-free/css/all.min.css';
/* New — add v4 shims for API-returned FA4 class names */
@import '@fortawesome/fontawesome-free/css/all.min.css';
@import '@fortawesome/fontawesome-free/css/v4-shims.min.css';
```

---

## 2. HTML Attribute Renames

BS5 namespaces all data attributes under `data-bs-*`.

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

**Search regex:** `data-toggle=` → replace with `data-bs-toggle=`, etc.

**Scale:** ~197 data attribute renames across all Vue templates.

---

## 3. CSS Class Renames

### Spacing and Alignment (~370 instances)

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

**Note:** Be careful with word boundaries — `ml-auto` → `ms-auto`, but don't accidentally match `html-*` or similar. Use regex with word boundaries: `\bml-(\d|auto)` → `ms-$1`.

### Typography and Utilities (~130 instances)

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

**Badge detail:** In BS4, `badge badge-success` was one class. In BS5, keep the `badge` class and change the contextual class: `badge bg-success`. The badge class provides the shape; `bg-*` provides the color.

**btn-block example:**

```html
<!-- BS4 -->
<button class="btn btn-primary btn-block">Submit</button>

<!-- BS5 option A: d-grid wrapper -->
<div class="d-grid">
    <button class="btn btn-primary">Submit</button>
</div>

<!-- BS5 option B: w-100 directly -->
<button class="btn btn-primary w-100">Submit</button>
```

### Forms (~400+ instances — the single most frequent change category)

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

**Note:** `form-group` → `mb-3` was the single most frequent change across the entire migration (~291 removals, ~343 additions including new instances).

### Close Button (~14 instances)

BS5 replaces the close button class AND removes the inner `×` character. The new `btn-close` uses a CSS background-image for the X icon:

```html
<!-- BS4 -->
<button type="button" class="close" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>

<!-- BS5 -->
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
```

**Key difference:** The `<span>&times;</span>` inside the button must be removed entirely. The `btn-close` class renders the X via CSS.

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

BS5 provides `opacity-25`, `opacity-50`, `opacity-75`, `opacity-100` utility classes. Use them when close enough to the desired value.

---

## 4. AdminLTE 3 → 4 Layout Changes

AdminLTE 4 renames the major layout wrapper classes:

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
<!-- BS4 / AdminLTE 3 -->
<nav class="main-header navbar navbar-expand navbar-dark">
    <ul class="navbar-nav">...</ul>
    <ul class="navbar-nav ml-auto">...</ul>
</nav>

<!-- BS5 / AdminLTE 4 -->
<nav class="app-header navbar navbar-expand bg-dark" data-bs-theme="dark">
    <div class="container-fluid">
        <ul class="navbar-nav">...</ul>
        <ul class="navbar-nav ms-auto">...</ul>
    </div>
</nav>
```

### Sidebar Brand

```html
<!-- BS4 / AdminLTE 3 -->
<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <a href="/" class="brand-link">
        <img src="logo.png" class="brand-image" />
        <span class="brand-text">App Name</span>
    </a>
    <div class="sidebar">...</div>
</aside>

<!-- BS5 / AdminLTE 4 -->
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
<!-- Change h1 to h3 for proper sizing -->
<div class="app-content-header pb-0">
    <div class="container-fluid">
        <div class="row mb-0">
            <div class="col-sm-6"><h3>{{ pageTitle }}</h3></div>
            <div class="col-sm-6"><!-- breadcrumbs --></div>
        </div>
    </div>
</div>
```

### Treeview (Sidebar Submenu Toggle)

AdminLTE 4's treeview JS may not fire on Vue-rendered content (runs on `DOMContentLoaded` before Vue mounts). Add manual toggle handler in `onMounted`:

```js
document.querySelectorAll('[data-lte-toggle="treeview"]').forEach((el) => {
    el.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const navItem = target.closest('.nav-item');
        const treeviewMenu = navItem?.querySelector('.nav-treeview');
        if (!treeviewMenu || !navItem) return;
        if (target.getAttribute('href') === '#') event.preventDefault();
        const isOpen = navItem.classList.contains('menu-open');
        // Accordion: close siblings
        navItem.parentElement?.querySelectorAll(':scope > .nav-item.menu-open').forEach((sib) => {
            if (sib !== navItem) {
                sib.classList.remove('menu-open');
                sib.querySelector('.nav-treeview').style.display = 'none';
            }
        });
        if (isOpen) {
            navItem.classList.remove('menu-open');
            treeviewMenu.style.display = 'none';
        } else {
            navItem.classList.add('menu-open');
            treeviewMenu.style.display = 'block';
        }
    });
});
```

### Sidebar Collapse Logic Rewrite

AdminLTE 3's `data-widget="pushmenu"` handled both mobile and desktop sidebar toggling automatically. AdminLTE 4 requires manual handling. Rewrite the collapse function to handle both cases:

```js
function collapseMenu() {
    const body = document.body;
    const isMobile = window.innerWidth <= 992;
    if (isMobile) {
        body.classList.toggle('sidebar-open');
        body.classList.remove('sidebar-collapse');
    } else {
        body.classList.toggle('sidebar-collapse');
    }
    // Persist state in cookie
    const toggleState = body.classList.contains('sidebar-collapse') ? 'closed' : 'opened';
    document.cookie = `toggleState=${toggleState}; path=/`;
}
```

---

## 5. JavaScript / Bootstrap API Changes

### Tooltips and Popovers

BS5 requires explicit initialization (no more jQuery auto-init):

```js
// BS4
$('[data-toggle="popover"]').popover();
$('[data-toggle="tooltip"]').tooltip();

// BS5
import * as bootstrap from 'bootstrap';
document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
```

### Select2 Theme

```js
// BS4
$('.select2bs4').select2({ theme: 'bootstrap4' });

// BS5
$('.select2bs4').select2({ theme: 'bootstrap-5' });
```

### Body Classes

```js
// BS4
document.body.classList.add('hold-transition', 'sidebar-mini', 'layout-fixed');

// BS5 / AdminLTE 4
document.body.classList.add('hold-transition', 'sidebar-mini', 'layout-fixed', 'sidebar-expand-lg', 'bg-body-tertiary');
```

### Bootstrap Component API (Modals, Collapse, etc.)

BS4 used jQuery methods (`$('#myModal').modal('show')`). BS5 uses vanilla JS constructors. ~22 instances were updated across Vue components:

```js
// BS4 (jQuery)
$('#myModal').modal('show');
$('#myModal').modal('hide');
$('#myCollapse').collapse('toggle');

// BS5 (vanilla JS)
import * as bootstrap from 'bootstrap';
const modal = new bootstrap.Modal(document.getElementById('myModal'));
modal.show();
modal.hide();
const collapse = new bootstrap.Collapse(document.getElementById('myCollapse'));
collapse.toggle();
```

**Common BS5 component constructors used:**
- `new bootstrap.Modal(element)` — `.show()`, `.hide()`, `.toggle()`
- `new bootstrap.Collapse(element)` — `.show()`, `.hide()`, `.toggle()`
- `new bootstrap.Tooltip(element)` — `.show()`, `.hide()`, `.dispose()`
- `new bootstrap.Popover(element)` — `.show()`, `.hide()`, `.dispose()`
- `new bootstrap.Dropdown(element)` — `.show()`, `.hide()`, `.toggle()`

### jQuery Plugin Initialization (`src/plugins/jquery.ts`)

BS4's jQuery-based tooltip/popover plugins were imported via `import 'bootstrap'` which auto-registered them as jQuery plugins. BS5 does not register jQuery plugins. Remove any jQuery-specific Bootstrap imports and switch to the vanilla API above.

---

## 6. Tailwind CSS Conflicts

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

If your backend API returns FA4 class names (e.g., `fa fa-file-text-o`), import the v4 shims:

```css
@import '@fortawesome/fontawesome-free/css/v4-shims.min.css';
```

### Common Manual Renames

| FA4 | FA5 |
|-----|-----|
| `fa fa-file-text-o` | `far fa-file-alt` |
| `fa fa-trash-o` | `fas fa-trash` |
| `fa fa-money` | `fas fa-money-bill` |
| `fa fa-bar-chart` | `fas fa-chart-bar` |
| `fa fa-area-chart` | `fas fa-chart-area` |
| `fa fa-ticket` | `fas fa-ticket-alt` |
| `fa fa-file-text` | `fas fa-file-alt` |

### Prefix Issues: `far` vs `fas`

Some icons exist only in the `fas` (solid) set, not `far` (regular). Common fixes:

| Broken | Fix |
|--------|-----|
| `far fa-chart-line` | `fas fa-chart-line` |
| `far fa-ticket-alt` | `fas fa-ticket-alt` |
| `far fa-tachometer-alt` | `fas fa-tachometer-alt` |

### Dynamic Icon Bindings

If a function returns an icon object for use as a Vue class binding, ensure you destructure it properly:

```js
// Function returning icon data
function statusIcon(status) {
    return { icon: ['far', 'envelope-open'], class: 'text-success' };
}

// WRONG — binds [object Object] as a class string
<i :class="statusIcon(status)" />

// CORRECT — destructure into FA class array
<i :class="[statusIcon(status).icon[0], 'fa-' + statusIcon(status).icon[1], statusIcon(status).class]" />
```

---

## 8. Removed BS4 Components

### `card-columns`

BS5 removed the `card-columns` class. Replace with responsive grid:

```html
<!-- BS4 -->
<div class="card-columns">
    <div class="card">...</div>
</div>

<!-- BS5 -->
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
    <div class="col">
        <div class="card">...</div>
    </div>
</div>
```

### `input-group-append` / `input-group-prepend`

These wrappers are removed. Place buttons/spans directly inside `.input-group`:

```html
<!-- BS4 -->
<div class="input-group">
    <input class="form-control" />
    <div class="input-group-append">
        <button class="btn btn-primary">Go</button>
    </div>
</div>

<!-- BS5 -->
<div class="input-group">
    <input class="form-control" />
    <button class="btn btn-primary">Go</button>
</div>
```

---

## 9. Color and Contrast Fixes

### Colored Backgrounds No Longer Auto-Set White Text

In BS4, `.bg-success`, `.bg-warning`, etc., automatically set `color: #fff`. BS5 does not. Add explicit white text:

```html
<!-- Option A: Add text-white class -->
<div class="bg-success text-white">...</div>

<!-- Option B: Global CSS rule for a component -->
```

```css
/* Global fix for small-box info cards */
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
<!-- BS4 -->
<select class="form-control">

<!-- BS5 -->
<select class="form-select">
```

### Scoping Width Rules

If you had global width rules on `.form-control` for DataTables length selectors, re-scope them to `.form-select`:

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

AdminLTE 3 used the iCheck plugin with classes like `icheck-success`, `icheck-primary`, `icheck-danger`, etc. for styled checkboxes and radios. BS5 has native styled form controls that replace this entirely. ~61 instances were migrated.

**All iCheck variants to replace:**
- `icheck-success` → `form-check`
- `icheck-primary` → `form-check`
- `icheck-danger` → `form-check`
- `icheck-info` → `form-check`
- `icheck-warning` → `form-check`

```html
<!-- BS4 / iCheck -->
<div class="icheck-success">
    <input type="checkbox" id="cb" />
    <label for="cb">Label</label>
</div>

<!-- BS5 -->
<div class="form-check">
    <input type="checkbox" id="cb" class="form-check-input" />
    <label for="cb" class="form-check-label">Label</label>
</div>
```

**For radio buttons:**

```html
<!-- BS4 / iCheck -->
<div class="icheck-primary">
    <input type="radio" id="r1" name="group" value="1" />
    <label for="r1">Option 1</label>
</div>

<!-- BS5 -->
<div class="form-check">
    <input type="radio" id="r1" name="group" value="1" class="form-check-input" />
    <label for="r1" class="form-check-label">Option 1</label>
</div>
```

**For switches:**

```html
<!-- BS4 -->
<div class="custom-control custom-switch">
    <input type="checkbox" class="custom-control-input" id="sw" />
    <label class="custom-control-label" for="sw">Toggle</label>
</div>

<!-- BS5 -->
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

**Also remove:** Any iCheck CSS imports and the ~26 lines of iCheck override rules that existed in custom stylesheets.

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
<!-- Remove nowrap from table class and th styles -->
<table class="table table-striped">  <!-- removed 'nowrap' -->
    <th style="cursor: pointer;">     <!-- removed 'white-space: nowrap' -->
```

---

## 12. Sidebar Fixes

### Profile Image Size

AdminLTE 4 may render the profile image smaller. Set explicit dimensions:

```html
<img style="width: 42px; height: 42px; margin-left: 0.2rem; flex-shrink: 0" />
```

### Hide User Info When Collapsed

When sidebar is collapsed, long text causes overflow. Use CSS or `overflow: hidden` on the panel:

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
<!-- BS4 -->
<ul class="nav nav-tabs">
    <li class="nav-item"><a class="nav-link">Active</a></li>
</ul>

<!-- BS5 -->
<div id="title_btns" class="btn-group">
    <a class="btn btn-info btn-sm" :class="{ active: status === 'active' }">Active</a>
</div>
```

### `text-bold` → `fw-bold`

AdminLTE 3 used `.text-bold`. BS5 uses `.fw-bold`:

**Search:** `text-bold` → **Replace:** `fw-bold`

---

## 14. Global CSS Rules Added

These rules were added to `custom_styles.css` to fix widespread issues with a single rule rather than editing dozens of template files:

```css
/* 1. Restore heading styles (Tailwind preflight conflict) */
h1 { font-size: 2.5rem; font-weight: 500; }
h2 { font-size: 2rem; font-weight: 500; }
h3 { font-size: 1.75rem; font-weight: 500; }
h4 { font-size: 1.5rem; font-weight: 500; }
h5 { font-size: 1.25rem; font-weight: 500; }
h6 { font-size: 1rem; font-weight: 500; }

/* 2. Card title icon spacing */
.card-title > i { margin-right: 0.35rem; }

/* 3. Uniform small-box height */
.small-box .inner { min-height: 120px; }

/* 4. White text on colored small-boxes */
.small-box[class*="bg-"] { color: #fff; }
.small-box[class*="bg-"] a,
.small-box[class*="bg-"] .small-box-footer { color: rgba(255, 255, 255, 0.85); }

/* 5. Sort icons inline with header text */
th > i.fa, th > i.fas, th > i.far { display: inline; }

/* 6. btn-app recreation (AdminLTE 4 removed it) */
.btn-app { /* ... see section 13 ... */ }

/* 7. Checkbox accent color */
.form-check-input:checked {
    background-color: #136bdd !important;
    border-color: #136bdd !important;
}
```

---

## 15. Print Stylesheet Updates

Print stylesheets (`hide_printed_links.css` and similar) reference layout wrapper selectors that change with AdminLTE 4. Update all selectors:

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

Also update any dark mode CSS (`admin_darkmode.css`) that targets the old class names.

---

## 16. View-Specific Large Restructurings

Some views required substantial restructuring beyond mechanical class renames. Document these for reference:

### Login.vue (~2,344 lines changed)
The login page had a complete template overhaul — form layouts, card structures, and validation patterns were all updated for BS5 form classes.

### Invoices.vue (~1,258 lines changed)
Large table and form migration with DataTables integration. Required careful handling of `form-select` width scoping and `input-group` restructuring.

### OrderDomain.vue (~1,228 lines changed)
Domain order forms with complex multi-step layouts, radio groups (iCheck → form-check), and conditional sections.

### ViewTicket.vue (~1,186 lines changed)
Ticket view with modal markup restructured for BS5 modal API, search input/button layout fixes, status icon binding fixes (object → class array destructuring), and font size adjustments.

### NewTicket.vue (~568 lines changed)
File upload input-group restructuring, form layout updates.

### Affiliate.vue (~740 lines changed)
Major layout restructuring — status buttons (nav-tabs → btn-group), search/pagesize layout (inline with d-flex), btn-app icon fixes, DataTables integration.

### OrderLicense.vue (~1,002 lines changed)
Replaced `card-columns` with `row-cols` grid, form control migrations, radio group updates.

### Login/Register pages
Complete form restructuring with BS5 form-check, form-select, and validation classes.

---

## 17. Files Changed Summary

### Core Infrastructure
- `package.json` — dependency swaps
- `yarn.lock` — regenerated
- `src/main.ts` — removed BS4-specific import
- `src/plugins/jquery.ts` — updated jQuery plugin init

### Layout Shell
- `src/App.vue` — full AdminLTE 3→4 layout rewrite (navbar, sidebar, content wrapper)
- `src/views/Home.vue` — duplicate layout shell, same changes

### Global Stylesheets
- `src/assets/templates/adminlte/custom_styles.css` — heading restoration, btn-app, small-box, sort icons, card-title spacing
- `src/assets/templates/my/style.css` — scoped form-select width rule
- `src/assets/css/admin_darkmode.css` — minor selector update
- `src/assets/css/hide_printed_links.css` — class rename
- `src/assets/css/home_new.css` — class rename
- `src/assets/css/view_admin_ticket.css` — minor fixes
- `src/assets/templates/menu/dark/menu.css` — class rename

### Components (shared)
- `src/components/ServiceListTable.vue` — removed nowrap, BS5 class updates
- `src/components/MainMenu.vue` — AdminLTE 4 menu attributes
- `src/components/Dialog.vue` — BS5 data attributes
- `src/components/services/Cancel.vue` — form class updates
- `src/components/services/Invoices.vue` — large form/table migration
- `src/components/services/ServiceActionCardHeader.vue` — class renames
- `src/components/services/view_service/ClientLinks.vue` — icon fixes
- `src/components/services/view_service/InfoBox.vue` — class update
- `src/components/account/*.vue` — form-check migration, class renames

### Views (100+ files)
Every view file under `src/views/` was updated. The most common changes per file:
1. `data-toggle` → `data-bs-toggle`
2. `ml-*`/`mr-*` → `ms-*`/`me-*`
3. `float-left`/`float-right` → `float-start`/`float-end`
4. `text-left`/`text-right` → `text-start`/`text-end`
5. `font-weight-bold` → `fw-bold`
6. `form-group` → `mb-3`
7. `custom-control` → `form-check`
8. `form-control` on selects → `form-select`
9. `sr-only` → `visually-hidden`
10. `badge-*` → `bg-*` on badges
11. FA4 icon names → FA5 equivalents
12. `close` button → `btn-close`
13. `input-group-append`/`prepend` wrappers removed

---

## 18. Change Scale Reference

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

Use this as a step-by-step checklist:

### Phase 1: Dependencies and Imports
- [ ] Update `package.json` dependencies (BS5, AdminLTE 4, select2-bs5-theme, popperjs, tempus-dominus)
- [ ] Remove BS4-specific packages (`@sweetalert2/theme-bootstrap-4`, `select2-bootstrap-theme`, `tempusdominus-bootstrap-4`)
- [ ] Run `yarn install` to regenerate lock file
- [ ] Update `import 'bootstrap'` → `import * as bootstrap from 'bootstrap'`
- [ ] Add FA4 v4-shims CSS import if backend returns FA4 class names
- [ ] Remove iCheck CSS/JS imports

### Phase 2: Global Find-Replace (mechanical, can be scripted)
- [ ] `data-toggle=` → `data-bs-toggle=`
- [ ] `data-target=` → `data-bs-target=`
- [ ] `data-dismiss=` → `data-bs-dismiss=`
- [ ] `data-content=` → `data-bs-content=`
- [ ] `data-placement=` → `data-bs-placement=`
- [ ] `ml-` → `ms-`, `mr-` → `me-`, `pl-` → `ps-`, `pr-` → `pe-` (use word boundaries!)
- [ ] `text-left` → `text-start`, `text-right` → `text-end`
- [ ] `float-left` → `float-start`, `float-right` → `float-end`
- [ ] `font-weight-bold` → `fw-bold`, `font-weight-light` → `fw-light`, `font-weight-normal` → `fw-normal`
- [ ] `text-bold` (AdminLTE) → `fw-bold`
- [ ] `sr-only` → `visually-hidden`
- [ ] `badge-success`/`badge-danger`/etc. → `bg-success`/`bg-danger`/etc. (keep `badge` class)
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

### Phase 4: AdminLTE Layout (manual, app shell)
- [ ] Update layout wrapper classes: `wrapper`→`app-wrapper`, `main-header`→`app-header`, `main-sidebar`→`app-sidebar`, `main-footer`→`app-footer`, `content-wrapper`→`app-main`
- [ ] Add `container-fluid` wrapper inside navbar
- [ ] Wrap `brand-link` in `sidebar-brand` div
- [ ] Replace `.sidebar` with `.sidebar-wrapper`
- [ ] Replace `sidebar-dark-primary` with `bg-body-secondary` + `data-bs-theme="dark"`
- [ ] Replace `navbar-dark` with `bg-dark` + `data-bs-theme="dark"`
- [ ] Replace `elevation-*` with `shadow`/`shadow-sm`
- [ ] Add `sidebar-expand-lg` and `bg-body-tertiary` to body classes
- [ ] Rewrite sidebar collapse logic for mobile/desktop
- [ ] Add treeview JS handler in `onMounted` (AdminLTE 4 DOMContentLoaded fires before Vue)
- [ ] Replace `data-widget="pushmenu"` → `data-lte-toggle="sidebar"`

### Phase 5: JavaScript API (manual)
- [ ] Replace jQuery tooltip/popover init with `new bootstrap.Tooltip()` / `new bootstrap.Popover()`
- [ ] Replace jQuery modal calls with `new bootstrap.Modal()` API
- [ ] Replace jQuery collapse calls with `new bootstrap.Collapse()` API
- [ ] Update Select2 theme: `'bootstrap4'` → `'bootstrap-5'`

### Phase 6: Component-Specific (manual)
- [ ] Replace `card-columns` with `row row-cols-*` grid
- [ ] Fix FA4→FA5 icon names (see Section 7 table)
- [ ] Fix `far` → `fas` prefix for solid-only icons
- [ ] Fix dynamic icon class bindings (destructure objects properly)

### Phase 7: CSS Fixes (global stylesheet)
- [ ] Add Tailwind heading restoration CSS (if using Tailwind)
- [ ] Add btn-app recreation CSS (if using AdminLTE btn-app)
- [ ] Add card-title icon spacing rule
- [ ] Add small-box white text rules
- [ ] Add sort icon inline display rules
- [ ] Add checkbox accent color rules
- [ ] Scope any global form-select width rules to DataTables only
- [ ] Update print stylesheet selectors for AdminLTE 4 class names
- [ ] Update dark mode CSS selectors for AdminLTE 4 class names

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
