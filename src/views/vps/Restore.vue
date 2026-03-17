<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';

const { t } = useI18n();

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
            console.log('api success', response);
            Swal.fire({
                icon: 'success',
                html: response.message,
            });
        })
        .catch((error: any) => {
            console.log('api failed', error);
            Swal.fire({
                icon: 'error',
                html: t('vps.common.gotError', { error: error.message }),
            });
        });
}

const loadBackupsList = async () => {
    try {
        const response: VpsBackup[] = await fetchWrapper.get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/backups?all=1`);
        loading.value = false;
        console.log('api success', response);
        backupsArr.value = response;
    } catch (error: any) {
        console.log('api failed', error);
    }
};

loadBackupsList();
</script>

<template>
    <div>
        <div class="row justify-content-center">
            <div class="col-10">
                <div class="callout callout-info">
                    <h5 class="text-red"><i class="fas fa-exclamation"></i> {{ t('vps.restore.importantNote') }}</h5>
                    <p class="text-md">{{ t('vps.restore.offlineNote') }}</p>
                </div>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-10">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="material-icons pr-2" style="vertical-align: middle">backup</i>{{ t('vps.restore.backupTitle', { name: module_name }) }}</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" :title="t('vps.common.goBack')"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                    <div class="card-body mb-0">
                        <form @submit.prevent="submitForm">
                            <div class="form-group mb-0">
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="cur-hostname">{{ t('vps.restore.server') }}</label>
                                    <div class="col-sm-6 input-group">
                                        <input id="cur-hostname" type="text" class="form-control form-control-sm" :value="curHostname" disabled />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="backup">{{ t('vps.restore.restoreThisBackup') }}</label>
                                    <div class="col-sm-9 input-group">
                                        <select id="backup" v-model="backup">
                                            <option disabled value="">{{ t('vps.restore.selectBackup') }}</option>
                                            <option v-for="(backupRow, backupIdx) in backupsArr" :key="backupIdx" :value="backupRow.name">{{ backupRow.type }}: {{ backupRow.service }} - {{ backupRow.name }} {{ backupRow.date }} ({{ backupRow.size }})</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="password">{{ t('vps.restore.loginPasswordLabel') }}</label>
                                    <div class="col-sm-9 input-group">
                                        <input id="password" v-model="password" type="text" class="form-control form-control-sm" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="more-info col-sm-3" for="confirm_yes">{{ t('vps.restore.confirmRestore') }}</label>
                                    <input id="confirm_yes" v-model="confirm" type="checkbox" class="form-check-input col-sm-9" name="confirm" value="yes" />
                                </div>
                                <hr />
                                <div class="row justify-content-center">
                                    <div class="controls">
                                        <input type="submit" name="submit" :value="t('vps.insertCd.continueButton')" class="btn btn-order px-4 py-2 text-sm" :disabled="!confirm || backup == ''" />
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
