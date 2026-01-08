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
const loading = ref(true);
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
        const response = await fetchWrapper.get(`${baseUrl}/${module.value}/${id.value}/backups?all=1`);
        loading.value = false;
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
                    <table class="table-sm display compact table">
                        <thead>
                        <tr>
                            <th>VPS</th>
                            <th>Type</th>
                            <th>Backup Name</th>
                            <th>Size</th>
                            <th colspan="2">Options</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="loading">
                            <td colspan="10">Loading...</td>
                        </tr>
                        <tr v-for="(row, index) in backupsArr" v-else :key="index">
                            <td>
                                <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="">{{ row.service }}</router-link>
                            </td>
                            <td>{{ row.type }}</td>
                            <td>{{ row.name }}</td>
                            <td>{{ row.size }}</td>
                            <td><router-link :to="'/' + moduleLink(module) + '/' + props.id + '/backups/' + row.name + '/delete'" class="">Delete</router-link></td>
                            <td><router-link :to="'/' + moduleLink(module) + '/' + props.id + '/backups/' + row.name + '/download'" class="">Download</router-link></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
