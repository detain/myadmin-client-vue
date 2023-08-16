<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted } from 'vue';
//import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore } from '@/stores';
import { useRoute } from 'vue-router';
const route = useRoute();
const sessionId = route.params.sessionid;
const authStore = useAuthStore();

authStore.sudo(sessionId);
</script>

<template>
    </template>

<style scoped>
</style>
