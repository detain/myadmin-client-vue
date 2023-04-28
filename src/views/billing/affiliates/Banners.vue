<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
const { breadcrums, page_heading } = storeToRefs(layoutStore);
layoutStore.setPageHeading('Affiliate - Banners');
layoutStore.setBreadcrums({'home': 'Home', 'affiliate': 'Affiliate', '': 'Banners'});


onMounted(() => {
})
</script>

<template>

</template>

<style scoped>
</style>
