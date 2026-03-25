<script setup lang="ts">
import MainMenu from '@/components/MainMenu.vue';

import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { useAuthStore } from '@/stores/auth.store';
import { useSiteStore } from '@/stores/site.store';

import ClientHome from '@/views/ClientHome.vue';

const { t } = useI18n();

const authStore = useAuthStore();
const siteStore = useSiteStore();
const { user } = storeToRefs(authStore);
const { breadcrums, page_heading } = storeToRefs(siteStore);
</script>

<template>
    <div v-if="user">
        <nav class="app-header navbar navbar-expand bg-dark" data-bs-theme="dark">
            <!-- Navbar -->
            <div class="container-fluid">
                <ul class="navbar-nav menu-collapse">
                    <!-- Left navbar links -->
                    <li class="nav-item">
                        <a class="nav-link collapse_menu" data-lte-toggle="sidebar" href="#" role="button"><i class="fas fa-bars"></i></a>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto">
                    <!-- Right navbar links -->
                    <li class="nav-item dropdown">
                        <router-link to="cart" :title="t('login.home.cart')" class="nav-link"><i class="fas fa-shopping-cart"></i></router-link>
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
                <a :href="typeof user.ima != 'undefined' && user.ima === 'client' ? '/' : '/admin'" class="brand-link">
                    <!-- Brand Logo -->
                    <img src="../assets/images/logos/interserver_short.png" alt="Logo" class="brand-image rounded-circle opacity-75" />
                    <span class="brand-text fw-light">InterServer</span>
                </a>
            </div>
            <div class="sidebar-wrapper">
                <!-- Sidebar -->
                <div class="user-panel d-flex align-items-center mb-3 mt-3 pb-3" style="overflow: hidden">
                    <!-- Sidebar user panel (optional) -->
                    <img :src="user.gravatar" class="rounded-circle shadow-sm" style="width: 2rem; height: 2rem; margin-left: 0.6rem; flex-shrink: 0" alt="DP" />
                    <div class="info brand-text" style="margin-left: 0.5rem">
                        <router-link to="/account/info" :title="t('login.home.editPersonalInfo')" class="d-block">{{ user.name }}&nbsp;<i class="fas fa-pencil-alt text-bold text-xs"></i></router-link>
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
        </main>
        <footer class="app-footer text-center">
            <strong>{{ t('login.home.copyright', { year: new Date().getFullYear() }) }}</strong> {{ t('login.home.allRightsReserved') }}
        </footer>
    </div>
</template>
