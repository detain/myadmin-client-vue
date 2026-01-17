<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    name: string;
}>();
const name = computed(() => props.name);
</script>

<template>
    <div>
        <h1>Hello {{ name }}!</h1>
    </div>
</template>
