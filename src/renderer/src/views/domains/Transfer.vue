<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import { moduleLink } from '@/helpers/moduleLink.ts';
import Swal from 'sweetalert2';
const props = defineProps<{
    id: number;
}>();
const id = computed(() => props.id);
const module: string = 'domains';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();

</script>

<template>
    <div />
</template>

<style scoped>

</style>
