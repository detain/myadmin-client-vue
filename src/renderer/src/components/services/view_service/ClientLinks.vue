<template>
    <div class="card">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Links</h3>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                </div>
            </div>
        </div>
        <div class="card-body my-3">
            <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/' + moduleLink(module) + '/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
                <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i>
                {{ clientLink.label }}
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { moduleLink } from '@/helpers/moduleLink';
const { clientLinks, module, id } = defineProps<{
    clientLinks: Array<{
        link: string;
        label: string;
        icon: string;
        icon_text: string;
        help_text: string;
    }>;
    module: string;
    id: number;
}>();
</script>
<style scoped>
a.btn.btn-app {
    margin: 0px 6px 28px 0px !important;
}
</style>
