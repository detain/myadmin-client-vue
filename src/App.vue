<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia';
import { MainMenu, Nav, Alert } from '@/components';
import { useAuthStore, useLayoutStore } from '@/stores';

const authStore = useAuthStore();
const layoutStore = useLayoutStore();
const { user } = storeToRefs(authStore);
const { breadcrums, page_heading, gravatar } = storeToRefs(layoutStore);
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
                    <a class="nav-link" href="cart" title="Cart"><i class="fa fa-shopping-cart "></i></a>
                </li>
                <li class="nav-item dropdown">
                    <button @click="authStore.logout()" class="btn btn-link nav-item nav-link"><i class="fa fa-power-off"></i></button>
                    <!-- <a class="nav-link" href="index.php?choice=none.logout" title="Logout"><i class="fa fa-power-off"></i></a> -->
                </li>
            </ul>
        </nav><!-- /.navbar -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4"><!-- Main Sidebar Container -->
            <router-link to="/" class="brand-link"><!-- Brand Logo -->
                <img src="//mystage.interserver.net/images/logos/interserver_short.png" alt="Logo" class="brand-image rounded-circle" style="opacity: .8">
                <span class="brand-text font-weight-light">InterServer</span>
            </router-link>
            <div class="sidebar"><!-- Sidebar -->
                <div class="user-panel mt-3 pb-3 mb-3 d-flex"><!-- Sidebar user panel (optional) -->
                    <div class="image"><img :src="user.gravatar" class="rounded-circle elevation-2" style="width: 3rem;" alt="DP"></div>
                    <div class="info">
                        <router-link to="contact_info" title="Edit Personal Info" class="d-block">{{ user.name }}&nbsp;<i class="fa fa-pencil text-xs text-bold"></i></router-link>
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
                                <li v-for="(bName, bUrl, index) in breadcrums" :key="index" :class="{ 'active': index === breadcrums.length - 1 }">
                                    <template v-if="index === breadcrums.length - 1">{{ bName }}</template>
                                    <template v-else><a :href="bUrl">{{ bName }}</a></template>
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


<style scoped>
@import '@/assets/base.css';

header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        font-size: 1rem;
    }
}
</style>
