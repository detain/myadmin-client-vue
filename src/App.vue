<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import * as bootstrap from 'bootstrap';
import MainMenu from '@/components/MainMenu.vue';
import Alert from '@/components/Alert.vue';
import Searchbox from '@/components/Searchbox.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useSiteStore } from '@/stores/site.store';
import { useDarkMode } from '@/helpers/useDarkMode';
import { warmFrequentlyUsedRoutes, warmRouteByLocation } from '@/router';

const { t } = useI18n();

function warmSidebarRouteFromEvent(event: Event) {
    const target = event.target as HTMLElement | null;
    const link = target?.closest('a[href]');
    const href = link?.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) {
        return;
    }
    warmRouteByLocation(href);
}

function closeMobileSidebarOnOutsideClick(event: MouseEvent) {
    const body = document.body;
    const isMobileViewport = window.innerWidth <= 992;
    const target = event.target as HTMLElement | null;
    if (!isMobileViewport || !body.classList.contains('sidebar-open') || !target) {
        return;
    }
    if (target.closest('.app-sidebar, [data-lte-toggle="sidebar"]')) {
        return;
    }
    body.classList.remove('sidebar-open');
    collapseMenu();
}

onMounted(function () {
    document.body.classList.add('hold-transition', 'sidebar-mini', 'layout-fixed', 'sidebar-expand-lg', 'bg-body-tertiary');
    restoreSidebarState();
    $('.pr-password').passwordRequirements({});
    /* $('.select2').select2();
    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap-5',
        closeOnSelect: true,
    }); */
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => new bootstrap.Popover(el));
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
    document.querySelectorAll<HTMLElement>('.shadow-hover').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            el.classList.remove('shadow-sm');
            el.classList.add('shadow');
            el.style.cursor = 'pointer';
        });
        el.addEventListener('mouseleave', () => {
            el.classList.add('shadow-sm');
            el.classList.remove('shadow');
        });
    });
    document.addEventListener('click', closeMobileSidebarOnOutsideClick);
    // AdminLTE 4 treeview: bind click handlers for sidebar submenu toggle
    // (AdminLTE's DOMContentLoaded handler runs before Vue renders)
    document.querySelectorAll('[data-lte-toggle="treeview"]').forEach((treeviewEl) => {
        treeviewEl.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;
            const navItem = target.closest('.nav-item');
            const navLink = target.closest('.nav-link');
            const treeviewMenu = navItem?.querySelector<HTMLElement>('.nav-treeview');
            if (!treeviewMenu || !navItem) return;
            if (target.getAttribute('href') === '#' || navLink?.getAttribute('href') === '#') {
                event.preventDefault();
            }
            const isOpen = navItem.classList.contains('menu-open');
            // Accordion: close siblings
            const parent = navItem.parentElement;
            parent?.querySelectorAll(':scope > .nav-item.menu-open').forEach((sibling) => {
                if (sibling !== navItem) {
                    sibling.classList.remove('menu-open');
                    const sub = sibling.querySelector<HTMLElement>('.nav-treeview');
                    if (sub) sub.style.display = 'none';
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
    const idleWarmup = () => {
        warmFrequentlyUsedRoutes();
    };
    const requestIdleCallbackFn = window.requestIdleCallback?.bind(window);
    if (requestIdleCallbackFn) {
        requestIdleCallbackFn(idleWarmup, { timeout: 1200 });
    } else {
        window.setTimeout(idleWarmup, 400);
    }
    const sidebar = document.querySelector('.app-sidebar');
    // eslint-disable-next-line no-undef
    sidebar?.addEventListener('mouseover', warmSidebarRouteFromEvent as EventListener);
    // eslint-disable-next-line no-undef
    sidebar?.addEventListener('focusin', warmSidebarRouteFromEvent as EventListener);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', closeMobileSidebarOnOutsideClick);
    const sidebar = document.querySelector('.app-sidebar');
    // eslint-disable-next-line no-undef
    sidebar?.removeEventListener('mouseover', warmSidebarRouteFromEvent as EventListener);
    // eslint-disable-next-line no-undef
    sidebar?.removeEventListener('focusin', warmSidebarRouteFromEvent as EventListener);
});

const authStore = useAuthStore();
const siteStore = useSiteStore();
const { user } = storeToRefs(authStore);
const { breadcrums, page_heading } = storeToRefs(siteStore);

siteStore.checkInfoLoaded();

interface SidebarTweakOptions {
    EnableRemember: boolean;
    NoTransitionAfterReload: boolean;
}

const AdminLTESidebarTweak = {
    options: {
        EnableRemember: true,
        NoTransitionAfterReload: false,
    } as SidebarTweakOptions,
};

// Toggle sidebar collapse and remember state
function collapseMenu() {
    const body = document.body;
    const isMobile = window.innerWidth <= 992;
    if (isMobile) {
        body.classList.toggle('sidebar-open');
        body.classList.remove('sidebar-collapse');
    } else {
        body.classList.toggle('sidebar-collapse');
    }
    if (AdminLTESidebarTweak.options.EnableRemember) {
        const toggleState = body.classList.contains('sidebar-collapse') ? 'closed' : 'opened';
        document.cookie = `toggleState=${toggleState}; path=/`;
    }
}

function restoreSidebarState() {
    if (!AdminLTESidebarTweak.options.EnableRemember) return;
    const match = document.cookie.match(/(?:^|;\s*)toggleState=([^;]+)/);
    const toggleState = match ? decodeURIComponent(match[1]) : null;
    if (toggleState === 'closed') {
        const body = document.body;
        if (AdminLTESidebarTweak.options.NoTransitionAfterReload) {
            body.classList.add('sidebar-collapse', 'hold-transition');
            setTimeout(() => {
                body.classList.remove('hold-transition');
            }, 100);
        } else {
            body.classList.add('sidebar-collapse');
        }
    }
}

watch(
    () => authStore.user,
    (user) => {
        if (user?.account_lid && window.OpenReplay) {
            window.OpenReplay.setUserID(user.account_lid);
        }
    },
    { immediate: true }
);

useDarkMode();
</script>

<template>
    <Alert />
    <div v-if="!!authStore.sessionId || !!authStore.apiKey" class="app-wrapper">
        <!-- <Nav /> -->
        <nav class="app-header navbar navbar-expand bg-dark" data-bs-theme="dark">
            <!-- Navbar -->
            <div class="container-fluid">
                <ul class="navbar-nav menu-collapse">
                    <!-- Left navbar links -->
                    <li class="nav-item">
                        <a class="nav-link collapse_menu" data-lte-toggle="sidebar" href="#" role="button" @click.prevent="collapseMenu"><i class="fas fa-bars"></i></a>
                    </li>
                </ul>
                <Searchbox />
                <ul class="navbar-nav ms-auto">
                    <!-- Right navbar links -->
                    <li class="nav-item dropdown">
                        <router-link to="/cart" class="nav-link" :title="t('common.menu.cart')"><i class="fas fa-shopping-cart"></i></router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <button class="btn btn-link nav-item nav-link" @click="authStore.logout()"><i class="fas fa-power-off"></i></button>
                    </li>
                </ul>
            </div>
        </nav>
        <!-- /.navbar -->
        <aside class="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
            <!-- Main Sidebar Container -->
            <div class="sidebar-brand">
                <router-link to="/" class="brand-link">
                    <!-- Brand Logo -->
                    <img src="./assets/images/logos/interserver_short.png" alt="Logo" class="brand-image rounded-circle opacity-75" />
                    <span class="brand-text fw-light">InterServer</span>
                </router-link>
            </div>
            <div class="sidebar-wrapper">
                <!-- Sidebar -->
                <div class="user-panel d-flex align-items-center mb-3 mt-3 pb-3" style="font-size: 1em; overflow: hidden">
                    <!-- Sidebar user panel (optional) -->
                    <img :src="user?.gravatar" class="rounded-circle shadow-sm" style="width: 2rem; height: 2rem; margin-left: 0.6rem; flex-shrink: 0" :alt="t('common.profile.profileImage')" />
                    <div class="info brand-text" style="padding: 0px; margin-left: 0.5rem">
                        <router-link to="/account/info" :title="t('common.profile.editPersonalInfo')" class="d-block">{{ user?.name }}&nbsp;<i class="fas fa-pencil-alt text-bold text-xs"></i></router-link>
                        <span style="color: #c2c7d0">
                            <b>{{ user?.account_lid }}</b>
                        </span>
                    </div>
                </div>
                <nav class="mt-2">
                    <MainMenu></MainMenu>
                </nav>
            </div>
            <!-- /.sidebar -->
        </aside>
        <!-- Content Wrapper. Contains page content -->
        <main class="app-main">
            <div class="app-content-header">
                <!-- Content Header (Page header) -->
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-12">
                            <h1 class="m-0">{{ page_heading }}</h1>
                        </div>
                        <div class="col-sm-12">
                            <ol class="breadcrumb">
                                <li v-for="(bData, index) in breadcrums" :key="index" class="breadcrumb-item" :class="{ active: index === breadcrums.length - 1 }">
                                    <template v-if="index === breadcrums.length - 1">{{ bData[1] }}</template>
                                    <template v-else>
                                        <router-link :to="bData[0]">{{ bData[1] }}</router-link>
                                    </template>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- /.content-header -->
            <div class="app-content">
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-12">
                            <router-view />
                        </div>
                    </div>
                </div>
                <!-- /.container-fluid -->
            </div>
        </main>
        <footer class="app-footer text-center">
            <strong>{{ t('common.footer.copyright', { year: new Date().getFullYear() }) }}</strong> {{ t('common.footer.allRightsReserved') }}
        </footer>
    </div>
    <div v-else>
        <div class="container-fluid" style="padding-left: 0; padding-right: 0">
            <router-view />
        </div>
    </div>
</template>

<style>
@import '@fortawesome/fontawesome-free/css/all.min.css';
/* @import 'font-awesome/css/font-awesome.min.css'; */
@import './assets/css/misha-theme/jquery-ui.css';
@import './assets/css/jquery.custom.css';
@import 'bootstrap/dist/css/bootstrap.min.css';
@import './assets/templates/menu/dark/menu.css';
@import './assets/css/hide_printed_links.css';
@import './assets/images/myadmin/css/styles.css';
@import 'select2/dist/css/select2.min.css';
@import 'select2-bootstrap-5-theme/dist/select2-bootstrap-5-theme.min.css';
@import 'jqvmap-novulnerability/dist/jqvmap.min.css';
@import 'overlayscrollbars/css/OverlayScrollbars.min.css';
@import './assets/templates/adminlte/jquery.passwordRequirements.css';
@import 'admin-lte/dist/css/adminlte.min.css';
@import './assets/templates/my/style.css';
@import './assets/templates/my/style2.css';
@import '@material-design-icons/font/filled.css';
@import './assets/templates/adminlte/custom_styles.css';

.app-header {
    position: relative;
    z-index: 1050;
}

.app-header.navbar {
    padding-top: 0;
    padding-bottom: 0;
    min-height: 0;
}

/* BS5 dark theme: ensure navbar icons/links use light color */
.app-header .nav-link,
.app-header .btn-link {
    color: rgba(255, 255, 255, 0.65) !important;
}

.app-header .nav-link:hover,
.app-header .nav-link:focus,
.app-header .btn-link:hover,
.app-header .btn-link:focus {
    color: rgba(255, 255, 255, 0.85) !important;
}

/* AdminLTE 4 sidebar: set default nav-link color from sidebar CSS vars */
.app-sidebar .sidebar-menu .nav-link {
    color: var(--lte-sidebar-color);
    text-decoration: none;
}

.app-sidebar .sidebar-menu .nav-link:hover {
    text-decoration: none;
}

.app-sidebar .sidebar-menu .nav-link .nav-icon {
    color: var(--lte-sidebar-color);
}

/* Sidebar user panel link color */
.app-sidebar .user-panel a {
    color: #c2c7d0;
    text-decoration: none;
}

.app-sidebar .user-panel a:hover {
    color: #fff;
    text-decoration: none;
}

/* Sidebar collapsed: reduce user panel spacing */
.sidebar-collapse .user-panel {
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
    padding-bottom: 0.5rem !important;
}

/* Search input in dark navbar: white bg, black text */
.app-header .new-search {
    background-color: #fff;
    color: #212529;
    border: 1px solid #ced4da;
}

/* Fix BS5: input-group/form-control width:100% overrides col-* widths when on same element */
@media (min-width: 576px) {
    .row > .col-sm-9.input-group,
    .row > .col-sm-9.form-control { width: 75%; }
}
@media (min-width: 768px) {
    .row > .col-md-7.input-group { width: 58.333333%; }
    .row > .col-md-8.input-group { width: 66.666667%; }
    .row > .col-md-9.input-group { width: 75%; }
    .row > .col-md-12.input-group { width: 100%; }
}
</style>
