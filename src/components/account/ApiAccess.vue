<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from '@/stores/account.store';
import { useSiteStore } from '@/stores/site.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import type { AccountData } from '@/types/account';

const { t } = useI18n();

const props = defineProps<{
    data: AccountData;
}>();
const data = computed(() => props.data);
const siteStore = useSiteStore();
const accountStore = useAccountStore();
siteStore.setPageHeading('Account Settings');
siteStore.setTitle('Account Settings');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Account Settings'],
]);
const baseUrl = siteStore.getBaseUrl();

async function generateApiKey() {
    try {
        fetchWrapper.post(`${baseUrl}/account/apikey`, {}).then((response) => {
            console.log('generateApiKey success', response);
            accountStore.data.api_key = response;
        });
    } catch (error: any) {
        console.log('generateApiKey failed', error);
    }
}
</script>

<script lang="ts">
export default {
    name: 'ApiAccess',
};
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2" :title="t('common.account.apiAccessDescription')">{{ t('common.account.apiAccess') }}</h3>
                <div class="card-tools float-end">
                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fa fas fa-minus" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <form enctype="multipart/form-data" action="account_settings" @submit.prevent="generateApiKey">
                <div class="row">
                    <textarea id="api_key" v-model="data.api_key" rows="8" class="form-control" :readonly="!!data.api_key" :placeholder="data.api_key ? '' : t('common.labels.noApiKey')"></textarea>
                </div>
                <hr />
                <div class="row">
                    <div class="col-md-12 text-center">
                        <button type="submit" class="btn btn-sm btn-green px-3 py-2">{{ data.api_key ? t('common.buttons.generateNewApiKey') : t('common.buttons.generateApiKey') }}</button>
                        <br />
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
