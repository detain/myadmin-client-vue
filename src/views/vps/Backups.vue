<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';

const { t } = useI18n();

const props = defineProps<{
    id: number;
    module: string;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const loading = ref(true);
const id = computed(() => props.id);
const module = computed(() => props.module);
const backupsArr = ref<VpsBackup[]>([]);

export interface VpsBackup {
    service: number;
    type: string;
    name: string;
    size: number;
    date: number;
}

const loadBackupsList = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${module.value}/${id.value}/backups?all=1`);
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
    <div class="row justify-content-center">
        <div class="col-10">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="material-icons pr-2" style="vertical-align: middle">backup</i>{{ t('vps.backups.title') }}</h3>
                    <div class="card-tools text-right">
                        <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" :title="t('vps.common.goBack')"><font-awesome-icon :icon="['fas', 'arrow-left']" />&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                    </div>
                </div>
                <div class="card-body mb-0">
                    <table class="table-sm display compact table">
                        <thead>
                            <tr>
                                <th>{{ t('vps.backups.vps') }}</th>
                                <th>{{ t('vps.backups.type') }}</th>
                                <th>{{ t('vps.backups.backupName') }}</th>
                                <th>{{ t('vps.backups.size') }}</th>
                                <th colspan="2">{{ t('vps.backups.options') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="10">{{ t('common.labels.loading') }}</td>
                            </tr>
                            <tr v-for="(row, index) in backupsArr" v-else :key="index">
                                <td>
                                    <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="">{{ row.service }}</router-link>
                                </td>
                                <td>{{ row.type }}</td>
                                <td>{{ row.name }}</td>
                                <td>{{ row.size }}</td>
                                <td><router-link :to="'/' + moduleLink(module) + '/' + props.id + '/backups/' + row.name + '/delete'" class="">{{ t('common.buttons.delete') }}</router-link></td>
                                <td><router-link :to="'/' + moduleLink(module) + '/' + props.id + '/backups/' + row.name + '/download'" class="">{{ t('common.buttons.download') }}</router-link></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
