<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';
import MainMenu from '@/components/MainMenu.vue';
import Alert from '@/components/Alert.vue';

import { useAuthStore } from '@/stores/auth.store.ts';
import { useSiteStore } from '@/stores/site.store.ts';

import $ from 'jquery';
//import 'jquery-ui';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'admin-lte/dist/js/adminlte.js';
import Swal from 'sweetalert2';
//import 'https://kit.fontawesome.com/2c66c1d1b5.js';
onMounted(function () {});

const authStore = useAuthStore();
const siteStore = useSiteStore();
const { user } = storeToRefs(authStore);
const { breadcrums, page_heading } = storeToRefs(siteStore);

siteStore.checkInfoLoaded();
$(document).ready(function () {
    /*
    $(".pr-password").passwordRequirements({});
    $('.select2').select2();
    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4',
        closeOnSelect: true
    });
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();
    */
    //Onhover add shaddow
    $('.shadow-hover').hover(
        function () {
            $(this).removeClass('shadow-sm');
            $(this).addClass('shadow').css('cursor', 'pointer');
        },
        function () {
            $(this).addClass('shadow-sm');
            $(this).removeClass('shadow');
        }
    );
});
let AdminLTESidebarTweak = {
    options: {
        EnableRemember: true,
        NoTransitionAfterReload: false,
        //Removes the transition after page reload.
    },
};
$('.collapse_menu').on('click', function () {
    if (AdminLTESidebarTweak.options.EnableRemember) {
        let toggleState = 'closed';
        if ($('body').hasClass('sidebar-collapse')) {
            toggleState = 'opened';
        }
        document.cookie = 'toggleState=' + toggleState;
    }
});
if (AdminLTESidebarTweak.options.EnableRemember) {
    const re = new RegExp('toggleState' + '=([^;]+)');
    const value = re.exec(document.cookie);
    let toggleState = value != null ? unescape(value[1]) : null;
    if (toggleState == 'closed') {
        if (AdminLTESidebarTweak.options.NoTransitionAfterReload) {
            $('body')
                .addClass('sidebar-collapse hold-transition')
                .delay(100)
                .queue(function () {
                    $(this).removeClass('hold-transition');
                });
        } else {
            $('body').addClass('sidebar-collapse');
        }
    }
}
if (window.location.href.indexOf('view_domains_list') > -1) {
    $('#crud-table th:nth-child(1)').css('display', 'none');
    $('#crud-table tbody td:nth-child(1)').css('display', 'none');
}
</script>

<template>
    <Alert />
    <div v-if="!!authStore.sessionId || !!authStore.apiKey" class="app-container bg-light">
        <!-- <Nav /> -->
        <nav class="main-header navbar navbar-expand navbar-dark">
            <!-- Navbar -->
            <ul class="navbar-nav menu-collapse">
                <!-- Left navbar links -->
                <li class="nav-item">
                    <a class="nav-link collapse_menu" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <!-- Right navbar links -->
                <li class="nav-item dropdown">
                    <router-link to="/cart" class="nav-link" title="Cart"><i class="fa fa-shopping-cart"></i></router-link>
                </li>
                <li class="nav-item dropdown">
                    <button @click="authStore.logout()" class="btn btn-link nav-item nav-link"><i class="fa fa-power-off"></i></button>
                </li>
            </ul>
        </nav>
        <!-- /.navbar -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <!-- Main Sidebar Container -->
            <router-link to="/" class="brand-link">
                <!-- Brand Logo -->
                <img src="/images/logos/interserver_short.png" alt="Logo" class="brand-image rounded-circle" style="opacity: 0.8" />
                <span class="brand-text font-weight-light">InterServer</span>
            </router-link>
            <div class="sidebar">
                <!-- Sidebar -->
                <div class="user-panel d-flex mb-3 mt-3 pb-3">
                    <!-- Sidebar user panel (optional) -->
                    <div class="image"><img :src="user?.gravatar" class="rounded-circle elevation-2" style="width: 3rem" alt="DP" /></div>
                    <div class="info">
                        <router-link to="/account/info" title="Edit Personal Info" class="d-block">{{ user?.name }}&nbsp;<i class="fa fa-pencil text-bold text-xs"></i></router-link>
                        <span style="color: #c2c7d0">
                            <b>{{ user?.account_lid }}</b></span
                        >
                    </div>
                </div>
                <nav class="mt-2">
                    <MainMenu></MainMenu>
                </nav>
            </div>
            <!-- /.sidebar -->
        </aside>
        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <div class="content-header">
                <!-- Content Header (Page header) -->
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-12">
                            <h1 class="text-dark m-0">{{ page_heading }}</h1>
                        </div>
                        <div class="col-sm-12">
                            <ol class="breadcrumb">
                                <li v-for="(bData, index) in breadcrums" :key="index" class="breadcrumb-item" :class="{ active: index === breadcrums.length - 1 }">
                                    <template v-if="index === breadcrums.length - 1">{{ bData[1] }}</template>
                                    <template v-else
                                        ><router-link :to="bData[0]">{{ bData[1] }}</router-link></template
                                    >
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-sm-12">
                            <router-view />
                        </div>
                    </div>
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- /.content-header -->
        </div>
        <footer class="main-footer text-center">
            <strong>Copyright &copy; {{ new Date().getFullYear() }} <a href="https://interserver.net">InterServer Inc</a>.</strong> All rights reserved.
        </footer>
    </div>
    <div v-else>
        <div class="container-fluid" style="padding-left: 0; padding-right: 0;">
            <router-view />
        </div>
    </div>
</template>

<style>
@import '/css/fontawesome-kit.min.css';	
/* '/node_modules/jquery-ui/dist/themes/smoothness/jquery-ui.min.css'; */
/* '/css/misha-theme/jquery-ui.css'; */
@import '/css/jquery.custom.css';
@import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
@import '/templates/menu/dark/menu.css';
@import '/css/hide_printed_links.css';
@import '/images/myadmin/css/styles.css';
@import '/node_modules/icheck-bootstrap/icheck-bootstrap.min.css';
@import '/node_modules/select2/dist/css/select2.min.css';
@import '/node_modules/select2-bootstrap-theme/dist/select2-bootstrap.min.css';
@import '/node_modules/jqvmap-novulnerability/dist/jqvmap.min.css';
@import '/node_modules/overlayscrollbars/css/OverlayScrollbars.min.css';
@import '/node_modules/@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css';
/* '/templates/adminlte/jquery.passwordRequirements.css'; */
@import '/templates/adminlte/custom_styles.css';
@import '/node_modules/admin-lte/dist/css/adminlte.min.css';
@import '/templates/my/style.css';
@import '/templates/my/style2.css';
@import '/node_modules/@material-design-icons/font/filled.css';
</style>
