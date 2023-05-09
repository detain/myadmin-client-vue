<script setup>
import { useAuthStore } from '@/stores';
import { router } from '@/router';

// redirect home if already logged in
const authStore = useAuthStore();
//if (authStore.user) {
//    router.push('/');
//}
</script>

<template>
    <router-view />
</template>
