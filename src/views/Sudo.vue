<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted } from 'vue';
//import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore } from '@/stores/auth.store';

import { useRoute } from 'vue-router';
const route = useRoute();
const sessionId = route.params.sessionid as string;
const authStore = useAuthStore();

authStore.sudo(sessionId);
</script>

<template>Logged in as a client, redirecting to home.</template>

<style scoped></style>
