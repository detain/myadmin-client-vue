<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
const { breadcrums, page_heading } = storeToRefs(layoutStore);
layoutStore.setPageHeading('Affiliate - WebTraffic');
layoutStore.setBreadcrums({'home': 'Home', 'affiliate': 'Affiliate', '': 'WebTraffic'});


onMounted(() => {
})
</script>

<template>

</template>

<style scoped>
</style>
