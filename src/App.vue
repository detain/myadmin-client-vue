<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia';
import { MainMenu, Nav, Alert } from '@/components';
import { useAuthStore, useLayoutStore } from '@/stores';

onMounted(function () {
});

const authStore = useAuthStore();
const layoutStore = useLayoutStore();
const { user } = storeToRefs(authStore);
const { breadcrums, page_heading } = storeToRefs(layoutStore);
</script>

<template>
    <Alert />
    <div v-if="user" class="app-container" :class="authStore.user && 'bg-light'">
        <!-- <Nav /> -->
        <nav class="main-header navbar navbar-expand navbar-dark"><!-- Navbar -->
            <ul class="navbar-nav menu-collapse"><!-- Left navbar links -->
                <li class="nav-item"><a class="nav-link collapse_menu" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a></li>
            </ul>
            <template v-if="user.ima == 'admin'">
                <form class="form-inline" action="index.php" style="width: 30%">
                    <input type="hidden" name="choice" value="none.search">
                    <div class="input-group input-group-sm" style="width: 100%">
                        <input class="form-control form-control-navbar" name="search" type="search" placeholder="Search" aria-label="Search" value="">
                        <div class="input-group-append"><button class="btn btn-navbar" type="submit"><i class="fas fa-search"></i></button></div>
                    </div>
                </form>
            </template>
            <ul class="navbar-nav ml-auto"><!-- Right navbar links -->
                <li class="nav-item dropdown">
                    <router-link to="/cart" class="nav-link" title="Cart"><i class="fa fa-shopping-cart "></i></router-link>
                </li>
                <li class="nav-item dropdown">
                    <button @click="authStore.logout()" class="btn btn-link nav-item nav-link"><i class="fa fa-power-off"></i></button>
                </li>
            </ul>
        </nav><!-- /.navbar -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4"><!-- Main Sidebar Container -->
            <router-link to="/" class="brand-link"><!-- Brand Logo -->
                <img src="/images/logos/interserver_short.png" alt="Logo" class="brand-image rounded-circle" style="opacity: .8">
                <span class="brand-text font-weight-light">InterServer</span>
            </router-link>
            <div class="sidebar"><!-- Sidebar -->
                <div class="user-panel mt-3 pb-3 mb-3 d-flex"><!-- Sidebar user panel (optional) -->
                    <div class="image"><img :src="user.gravatar" class="rounded-circle elevation-2" style="width: 3rem;" alt="DP"></div>
                    <div class="info">
                        <router-link to="/account/info" title="Edit Personal Info" class="d-block">{{ user.name }}&nbsp;<i class="fa fa-pencil text-xs text-bold"></i></router-link>
                        <span style="color: #c2c7d0;"><b>{{ user.account_lid }}</b></span>
                    </div>
                </div>
                <nav class="mt-2">
                    <MainMenu></MainMenu>
                </nav>
            </div><!-- /.sidebar -->
        </aside><!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <div class="content-header"><!-- Content Header (Page header) -->
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-12">
                            <h1 class="m-0 text-dark">{{ page_heading }}</h1>
                        </div>
                        <div class="col-sm-12">
                            <ol class="breadcrumb">
                                <li v-for="(bName, bUrl, index) in breadcrums" :key="index" class="breadcrumb-item" :class="{ 'active': index === Object.keys(breadcrums).length - 1 }">
                                    <template v-if="index === Object.keys(breadcrums).length - 1">{{ bName }}</template>
                                    <template v-else><router-link :to="bUrl">{{ bName }}</router-link></template>
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
            <strong>Copyright &copy;
                {{ new Date().getFullYear() }} <a href="https://interserver.net">InterServer Inc</a>.</strong> All rights reserved.
        </footer>
    </div>
    <div v-else>
        <div class="container-fluid">
            <router-view />
        </div>
    </div>
</template>

<style>
/*
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';
@import 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700';
@import 'jquery-ui/dist/themes/smoothness/jquery-ui.min.css';
@import '/css/misha-theme/jquery-ui.css';
//@import 'jquery-simple-pass-meter/simplePassMeter.css';
@import '/css/jquery.custom.css';
@import '/css/home_new.css?20180104';
@import '/css/home.css';
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'jqvmap-novulnerability/dist/jqvmap.min.css';
@import 'admin-lte/dist/css/adminlte.min.css';
@import '/templates/menu/dark/menu.css';
@import '/css/hide_printed_links.css';
@import '/images/myadmin/css/styles.css?20180101';
//@import 'tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css';
@import 'icheck-bootstrap/icheck-bootstrap.min.css';
@import 'select2/dist/css/select2.min.css';
@import 'select2-bootstrap-theme/dist/select2-bootstrap.min.css';
@import 'overlayscrollbars/css/OverlayScrollbars.min.css';
//@import 'daterangepicker/daterangepicker.css';
//@import 'summernote/dist/summernote-bs4.min.css';
@import '@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css';
@import '/templates/adminlte/custom_styles.css';
@import '/templates/adminlte/jquery.passwordRequirements.css';
@import '/templates/my/style.css?202211190107';
@import '/templates/my/style2.css';
@import '/css/view_service.css';
//@import 'tablesorter/dist/css/theme.jui.min.css';
//@import 'tablesorter/dist/css/theme.blue.min.css';
//@import 'tablesorter/dist/css/jquery.tablesorter.pager.min.css';
@import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';*/
/*@import '@/assets/base.css';*/
</style>
