<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import Swal from 'sweetalert2';

const props = defineProps<{
    id: number;
    module: string;
    curHostname: string;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const module_name = ref('');
const backup = ref('');
const confirm = ref(false);
const note_text = ref('');
const backupsArr = ref<VpsBackup[]>([]);
const loading = ref(true);
const id = computed(() => props.id);
const module = computed(() => props.module);
const curHostname = computed(() => {
    return props.curHostname;
});

export interface VpsBackup {
    service: number;
    type: string;
    name: string;
    size: number;
    date: number;
}

function submitForm() {
    // Process the form submission or make an API request here
    // Handle form submission
    fetchWrapper
        .get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/backup`)
        .then((response: any) => {
            console.log('api success');
            console.log(response);
            Swal.fire({
                icon: 'success',
                html: response.message,
            });
        })
        .catch((error: any) => {
            console.log('api failed');
            console.log(error);
            Swal.fire({
                icon: 'error',
                html: `Got error ${error.message}`,
            });
        });
}

const loadBackupsList = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/backups`);
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
    <div>
        <div class="callout callout-info">
            <h5 class="text-red"><i class="fa fa-exclamation"></i> Important Note</h5>
            <p class="text-md">Backups will only work with default partitioning.</p>
        </div>
        <div class="row justify-content-center">
            <div class="col-6">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="material-icons pr-2" style="vertical-align: middle">backup</i>{{ module_name }} Backup</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                    <div class="card-body mb-0">
                        <form @submit.prevent="submitForm">
                            <input type="hidden" name="link" value="queue" />
                            <input type="hidden" name="action" value="backup" />
                            <input type="hidden" name="backup" :value="backup" />
                            <div class="form-group mb-0">
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="cur-hostname">Server</label>
                                    <div class="col-sm-6 input-group">
                                        <input id="cur-hostname" type="text" class="form-control form-control-sm" :value="curHostname" disabled />
                                    </div>
                                </div>
                                <div class="text-center">
                                    <div class="icheck-success d-inline">
                                        <input id="confirm_yes" v-model="confirm" type="checkbox" class="form-check-input" name="confirm" value="yes" />
                                        <label class="more-info" for="confirm_yes">Do you really want to take backup?</label>
                                    </div>
                                </div>
                                <hr />
                                <div class="row justify-content-center">
                                    <div class="controls">
                                        <input type="submit" name="submit" value="Continue" class="btn btn-order px-4 py-2 text-sm" :disabled="!confirm" />
                                    </div>
                                </div>
                            </div>
                        </form>
                        <hr />
                        <p class="text-muted text-xs"><b>Note: </b>{{ note_text }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="material-icons pr-2" style="vertical-align: middle">backup</i>Current Backups</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <template v-if="loading">
                            <td colspan="10">Loading...</td>
                        </template>
                        <template v-else-if="backupsArr.length > 0">
                            <table class="table-sm table">
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Type</th>
                                        <th>Name</th>
                                        <th>Size</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(backupRow, backupIdx) in backupsArr" :key="backupIdx">
                                        <td>{{ backupRow.service }}</td>
                                        <td>{{ backupRow.type }}</td>
                                        <td>{{ backupRow.name }}</td>
                                        <td>{{ backupRow.size }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                        <template v-else> No backup currently exists </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
