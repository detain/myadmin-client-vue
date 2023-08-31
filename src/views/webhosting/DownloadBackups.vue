<script setup lang="ts">
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, PropType } from 'vue';
import { useSiteStore } from '@/stores';
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    rows: {
        type: Array as PropType<BackupRow[]>,
        default: () => [],
    },
});
const isEmpty = (rows: any) => {
    return rows.length === 0;
};

interface BackupRow {
    backup_name: string;
    website: string;
    size: number;
    download_link: string;
}

</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i style="vertical-align: middle; margin-top: -5px" class="material-icons">cloud_download</i>&nbsp;Download Backups</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/websites/' + id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table-sm table-bordered table">
                        <tr>
                            <th>Website</th>
                            <th>Backup</th>
                            <th>Size</th>
                            <th>Options</th>
                        </tr>
                        <template v-if="!isEmpty(rows)">
                            <tr v-for="row in rows" :key="row.backup_name">
                                <td>{{ row.website }}</td>
                                <td>{{ row.backup_name }}</td>
                                <td>{{ row.size }}</td>
                                <td>{{ row.download_link }}</td>
                            </tr>
                        </template>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
