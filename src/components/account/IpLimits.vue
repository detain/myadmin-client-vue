<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from '@/stores/account.store';
import { useSiteStore } from '@/stores/site.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import type { AccountData, AccountLimit } from '@/types/account';

const { t } = useI18n();
const props = defineProps<{
    data: AccountData;
    limits: AccountLimit[];
    ip: string;
}>();
const limits = computed(() => props.limits);
const ip = computed(() => props.ip);
const siteStore = useSiteStore();
const accountStore = useAccountStore();
siteStore.setPageHeading('Account Settings');
siteStore.setTitle('Account Settings');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Account Settings'],
]);
const baseUrl = siteStore.getBaseUrl();
const newLimit = ref({
    start: '',
    end: '',
    restrict: 'Web & API',
});

async function deleteRange(start: string, end: string) {
    try {
        fetchWrapper
            .patch(`${baseUrl}/account/iplimits`, {
                start: start,
                end: end,
            })
            .then((response) => {
                console.log('delete range success', response);
                accountStore.load();
            });
    } catch (error: any) {
        console.log('delete range failed', error);
    }
}

async function addRangeSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/account/iplimits`, {
                start: newLimit.value.start,
                end: newLimit.value.end,
                restrict: newLimit.value.restrict,
            })
            .then((response) => {
                console.log('add range success', response);
                accountStore.load();
            });
    } catch (error: any) {
        console.log('add range failed', error);
    }
}
</script>

<script lang="ts">
export default {
    name: 'IpLimits',
};
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2" :title="t('common.account.sessionIpLimitsDescription')">{{ t('common.account.sessionIpLimits') }}</h3>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fa fas fa-minus" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="alert alert-info">
                {{ t('common.account.yourRemoteIp') }} <b>{{ ip }}</b>
                <br />
                {{ t('common.account.ipLimitsWarning') }}
            </div>
            <form enctype="multipart/form-data" @submit.prevent="addRangeSubmit">
                <table class="table-sm table">
                    <thead>
                        <tr>
                            <th>{{ t('common.labels.startIp') }}</th>
                            <th>{{ t('common.labels.endIp') }}</th>
                            <th>{{ t('common.labels.restrict') }}</th>
                            <th>{{ t('common.labels.options') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(limit, idx) in limits" :key="'row' + idx">
                            <td>{{ limit.start }}</td>
                            <td>{{ limit.end }}</td>
                            <td>{{ limit?.restrict == 'Only API' ? t('common.account.onlyApi') : t('common.account.webAndApi') }}</td>
                            <td>
                                <a class="btn btn-sm btn-danger" @click.prevent="deleteRange(limit.start, limit.end)"><span class="fas fa-trash"></span> {{ t('common.buttons.remove') }}</a>
                            </td>
                        </tr>
                        <tr>
                            <td><input v-model="newLimit.start" type="text" name="start" placeholder="192.168.1.0" /></td>
                            <td><input v-model="newLimit.end" type="text" name="end" placeholder="192.168.1.255" /></td>
                            <td>
                                <select v-model="newLimit.restrict" name="restrict">
                                    <option value="Web & API">{{ t('common.account.webAndApi') }}</option>
                                    <option value="Only API">{{ t('common.account.onlyApi') }}</option>
                                </select>
                            </td>
                            <td><button type="submit" class="btn btn-custom btn-sm" name="submit">{{ t('common.buttons.addRange') }}</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    </div>
</template>
