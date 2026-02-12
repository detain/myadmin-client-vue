<script setup lang="ts">
import MainMenu from '@/components/MainMenu.vue';

import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';

import { useAuthStore } from '@/stores/auth.store';
import { useSiteStore } from '@/stores/site.store';

import ClientHome from '@/views/ClientHome.vue';

const authStore = useAuthStore();
const siteStore = useSiteStore();
const { user } = storeToRefs(authStore);
const { breadcrums, page_heading } = storeToRefs(siteStore);
</script>

<template>
    <div v-if="user">
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
                    <router-link to="cart" title="Cart" class="nav-link"><i class="fa fa-shopping-cart"></i></router-link>
                </li>
                <li class="nav-item dropdown">
                    <button class="btn btn-link nav-item nav-link" @click="authStore.logout()"><i class="fa fa-power-off"></i></button>
                    <!-- <a class="nav-link" href="index.php?choice=none.logout" title="Logout"><i class="fa fa-power-off"></i></a> -->
                </li>
            </ul>
        </nav>
        <!-- /.navbar -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <!-- Main Sidebar Container -->
            <a :href="typeof user.ima != 'undefined' && user.ima === 'client' ? '/' : '/admin'" class="brand-link">
                <!-- Brand Logo -->
                <img src="../assets/images/logos/interserver_short.png" alt="Logo" class="brand-image rounded-circle" style="opacity: 0.8" />
                <span class="brand-text font-weight-light">InterServer</span>
            </a>
            <div class="sidebar">
                <!-- Sidebar -->
                <div class="user-panel d-flex mb-3 mt-3 pb-3">
                    <!-- Sidebar user panel (optional) -->
                    <div class="image"><img :src="user.gravatar" class="rounded-circle elevation-2" style="width: 3rem" alt="DP" /></div>
                    <div class="info">
                        <router-link to="/account/info" title="Edit Personal Info" class="d-block">{{ user.name }}&nbsp;<i class="fa fa-pencil text-bold text-xs"></i></router-link>
                        <span style="color: #c2c7d0">
                            <b>{{ user.account_lid }}</b></span
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
                                <li v-for="(bData, index) in breadcrums" :key="index" :class="{ active: breadcrums.length - 1 === index }">
                                    <template v-if="index === breadcrums.length - 1">{{ bData[1] }}</template>
                                    <template v-else
                                        ><a :href="bData[0]">{{ bData[1] }}</a></template
                                    >
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-sm-12">
                            <ClientHome></ClientHome>
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
</template>
