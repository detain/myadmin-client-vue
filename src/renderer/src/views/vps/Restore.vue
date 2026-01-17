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
const backupsArr = ref<VpsBackup[]>([]);
const loading = ref(true);
const password = ref('');
const id = computed(() => props.id);
const module = computed(() => props.module);
const curHostname = computed(() => props.curHostname);

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
        .post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/restore`, {
            backup: backup.value,
            password: password.value,
        })
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
        const response: VpsBackup[] = await fetchWrapper.get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/backups?all=1`);
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
        <div class="row justify-content-center">
            <div class="col-10">
                <div class="callout callout-info">
                    <h5 class="text-red"><i class="fa fa-exclamation"></i> Important Note</h5>
                    <p class="text-md">Your server will be offline while it replaces all your current files with those on the backup. Please contact support with any questions.</p>
                </div>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-10">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="material-icons pr-2" style="vertical-align: middle">backup</i>{{ module_name }} Backup</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                    <div class="card-body mb-0">
                        <form @submit.prevent="submitForm">
                            <div class="form-group mb-0">
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="cur-hostname">Server</label>
                                    <div class="col-sm-6 input-group">
                                        <input id="cur-hostname" type="text" class="form-control form-control-sm" :value="curHostname" disabled />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="backup">Restore this backup</label>
                                    <div class="col-sm-9 input-group">
                                        <select id="backup" v-model="backup">
                                            <option disabled value="">Select a backup</option>
                                            <option v-for="(backupRow, backupIdx) in backupsArr" :key="backupIdx" :value="backupRow.name">{{ backupRow.type }}: {{ backupRow.service }} - {{ backupRow.name }} {{ backupRow.date }} ({{ backupRow.size }})</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="password">Enter Login Password to Validate Restore.</label>
                                    <div class="col-sm-9 input-group">
                                        <input id="password" v-model="password" type="text" class="form-control form-control-sm" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="more-info col-sm-3" for="confirm_yes">Do you really want to restore this backup?</label>
                                    <input id="confirm_yes" v-model="confirm" type="checkbox" class="form-check-input col-sm-9" name="confirm" value="yes" />
                                </div>
                                <hr />
                                <div class="row justify-content-center">
                                    <div class="controls">
                                        <input type="submit" name="submit" value="Continue" class="btn btn-order px-4 py-2 text-sm" :disabled="!confirm || backup == ''" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
