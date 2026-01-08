<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';

const props = defineProps<{
    id: number;
    module: string;
    settings: any;
}>()
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const settings = computed(() => {
    return props.settings;
});
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});
const backupsArr = ref([]);

const loadBackupsList = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${module.value}/${id.value}/backups`);
        console.log('api success');
        console.log(response);
        backupsArr.value = response;
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadBackupsList();

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
                    {{ backupsArr }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
