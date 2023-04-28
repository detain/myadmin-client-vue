<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
const { breadcrums, page_heading } = storeToRefs(layoutStore);
layoutStore.setPageHeading('Affiliate - Dock Setup');
layoutStore.setBreadcrums({'home': 'Home', 'affiliate': 'Affiliate', '': 'Dock Setup'});


onMounted(() => {
})
</script>

<template>

</template>

<style scoped>
</style>
