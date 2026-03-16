<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.store';

const { t } = useI18n();
const authStore = useAuthStore();
</script>

<template>
    <nav v-show="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
        <div class="navbar-nav">
            <router-link to="/" class="nav-item nav-link">{{ t('common.nav.home') }}</router-link>
            <router-link to="/bugs" class="nav-item nav-link">{{ t('common.nav.bugsSuck') }}</router-link>
            <router-link to="/users" class="nav-item nav-link">{{ t('common.nav.users') }}</router-link>
            <button class="btn btn-link nav-item nav-link" @click="authStore.logout()">{{ t('common.nav.logout') }}</button>
        </div>
    </nav>
</template>
