<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useSiteStore } from '../../stores/site.store';
import imageFloppy from '../../assets/images/icons/floppy_disk_48.png';
const props = defineProps<{
    id: number;
}>();
const module: string = 'webhosting';
const siteStore = useSiteStore();
const authStore = useAuthStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => props.id);
const { sessionId } = storeToRefs(authStore);
const backups = ref<BackupRow[]>([]);

const isEmpty = (rows: any) => {
    return rows.length === 0;
};

interface BackupRow {
    name: string;
    size?: number;
}

const loadBackups = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/backups`);
        console.log('api success');
        console.log(response);
        backups.value = response;
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadBackups();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i style="vertical-align: middle; margin-top: -5px" class="material-icons">cloud_download</i>&nbsp;Download Backups</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table-sm table-bordered table">
                        <thead>
                            <tr>
                                <th>Backup</th>
                                <th>Size</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="!isEmpty(backups)">
                                <tr v-for="(row, index) in backups" :key="index">
                                    <td>{{ row.name }}</td>
                                    <td>{{ row.size }}</td>
                                    <td>
                                        <a :href="`https://my.interserver.net/ajax.php?swift_download&module=webhosting&download=${id}:${row.name}&use_variable_sessionid=true&sessionid=${sessionId}`" title="Download" download>
                                            <img :src="imageFloppy" width="16" height="16" border="0" alt="Download" />
                                        </a>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
