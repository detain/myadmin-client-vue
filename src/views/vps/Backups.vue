<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { moduleLink } from '@/helpers/moduleLink.ts';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store.ts';

const props = defineProps(['id', 'module', 'settings', 'backupsTable']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const settings = computed(() => {
    return props.settings;
});
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});
const backupsTable = computed(() => {
    return props.backupsTable;
});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-10">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="material-icons pr-2" style="vertical-align: middle">backup</i>Manage VPS Backups</h3>
                    <div class="card-tools text-right">
                        <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                    </div>
                </div>
                <div class="card-body mb-0">
                    {{ backupsTable }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
