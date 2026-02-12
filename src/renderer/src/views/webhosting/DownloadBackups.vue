<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useSiteStore } from '@/stores/site.store';
import imageFloppy from '@/assets/images/icons/floppy_disk_48.png';

const props = defineProps<{
    id: number;
}>();

const module: string = 'webhosting';
const siteStore = useSiteStore();
const authStore = useAuthStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => props.id);
const { sessionId } = storeToRefs(authStore);

interface BackupRow {
    name: string;
    size?: number;
}

interface DownloadResponse {
    name: string;
    size: number;
    file: string; // base64
}

const backups = ref<BackupRow[]>([]);

const isEmpty = (rows: any[]) => rows.length === 0;

const loadBackups = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/backups`);
        backups.value = response;
    } catch (error) {
        console.error('Failed to load backups', error);
    }
};

const downloadBackup = async (backup: BackupRow) => {
    try {
        const response: DownloadResponse = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/backups?download=${encodeURIComponent(backup.name)}`);
        // Decode base64
        const byteCharacters = atob(response.file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/x-tar' });
        // Create download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.name;
        document.body.appendChild(link);
        link.click();
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Backup download failed', error);
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
                                        <button type="button" class="btn btn-link p-0" title="Download" @click="downloadBackup(row)">
                                            <img :src="imageFloppy" width="16" height="16" alt="Download" />
                                        </button>
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
