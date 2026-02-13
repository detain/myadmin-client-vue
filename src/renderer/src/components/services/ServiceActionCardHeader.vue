<script setup lang="ts">
import { RouterLink } from 'vue-router';

withDefaults(
    defineProps<{
        title: string;
        backTo: string;
        iconClass?: string;
        materialIcon?: string;
    }>(),
    {
        iconClass: '',
        materialIcon: '',
    }
);
</script>

<template>
    <div class="card-header">
        <div class="p-1">
            <h3 class="card-title py-2">
                <i v-if="materialIcon" class="material-icons pr-1" style="vertical-align: bottom">{{ materialIcon }}</i>
                <i v-else-if="iconClass" :class="iconClass">&nbsp;</i>
                {{ title }}
            </h3>
            <div class="card-tools text-right">
                <router-link :to="backTo" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"> <i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp; </router-link>
            </div>
        </div>
    </div>
</template>
