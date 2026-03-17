<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from '@/stores/account.store';
import { useSiteStore } from '@/stores/site.store';

import { fetchWrapper } from '@/helpers/fetchWrapper';
import type { AccountData, oAuthProviders as oAuthProvidersType, oAuthConfig as oAuthConfigType, oAuthAdapters as oAuthAdaptersType } from '@/types/account';

const { t } = useI18n();

const props = defineProps<{
    data: AccountData;
    oAuthProviders: oAuthProvidersType;
    oAuthConfig: oAuthConfigType;
    oAuthAdapters: oAuthAdaptersType;
}>();
const data = computed(() => props.data);
const oAuthProviders = computed(() => props.oAuthProviders);
const oAuthConfig = computed(() => props.oAuthConfig);
const oAuthAdapters = computed(() => props.oAuthAdapters);
const siteStore = useSiteStore();
const accountStore = useAccountStore();
siteStore.setPageHeading('Account Settings');
siteStore.setTitle('Account Settings');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Account Settings'],
]);
const baseUrl = siteStore.getBaseUrl();

async function logOutOauth(type: string) {
    try {
        fetchWrapper.get(`${baseUrl}/account/oauth/${type}/logout`).then((response) => {
            console.log('unlinkOauth success', response);
        });
    } catch (error: any) {
        console.log('unlinkOauth failed', error);
    }
}

async function unlinkOauth(type: string) {
    try {
        fetchWrapper.delete(`${baseUrl}/account/oauth/${type}`).then((response) => {
            console.log('unlinkOauth success', response);
        });
    } catch (error: any) {
        console.log('unlinkOauth failed', error);
    }
}
</script>

<script lang="ts">
export default {
    name: 'LinkedAccounts',
};
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2" :title="t('common.account.linkedAccountsDescription')">{{ t('common.account.linkedAccounts') }}</h3>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                        <i class="fa fas fa-minus" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <table class="table">
                <thead>
                    <tr>
                        <th>{{ t('common.labels.accounts') }}</th>
                        <th>{{ t('common.labels.status') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(provider, name) in oAuthConfig.providers" :key="name">
                        <th>{{ name }}</th>
                        <td>
                            <span v-if="provider.linked">{{ t('common.labels.linked') }}</span>
                            <span v-else>{{ t('common.labels.notLinked') }}</span>
                        </td>
                        <td>
                            <span v-if="provider.linked">
                                <a v-if="provider.url" :href="provider.url" class="px-1" target="_blank">{{ provider.url }}</a>
                                <span v-else>{{ provider.account }}</span>
                                <span class="px-1">(<a href="" @click.prevent="unlinkOauth(name.toString())">{{ t('common.buttons.unlink') }}</a>)</span>
                                <span v-if="oAuthAdapters[name]" class="px-1">(<a @click.prevent="logOutOauth(name.toString())">{{ t('common.buttons.logOut') }}</a>)</span>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
