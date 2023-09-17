<script setup lang="ts">
import { ref } from 'vue';
import { Confirm } from '@/components/alerts';

const display = ref('yes');
const action = ref('eppcode');
const actions = ref([
    'confirm',
]);
</script>

<template>
    <div v-if="display == 'yes'">
        <Confirm v-if="action == 'confirm'" data="{ url: 'example.com', html: '<p>Confirmation message</p>' }" />
    </div>
</template>

<style scoped></style>
