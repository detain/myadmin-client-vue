<script setup lang="ts">
import { computed } from 'vue';
import { useAccountStore } from '../../stores/account.store';
import { useSiteStore } from '../../stores/site.store';

import { fetchWrapper } from '../../helpers/fetchWrapper';
import type { AccountData, oAuthProviders as oAuthProvidersType, oAuthConfig as oAuthConfigType, oAuthAdapters as oAuthAdaptersType } from '../../types/account.ts';

const props = defineProps<{
    data: AccountData;
    oAuthProviders: oAuthProvidersType;
    oAuthConfig: oAuthConfigType;
    oAuthAdapters: oAuthAdaptersType;
}>();
const data = computed(() => {
    return props.data;
});
const oAuthProviders = computed(() => {
    return props.oAuthProviders;
});
const oAuthConfig = computed(() => {
    return props.oAuthConfig;
});
const oAuthAdapters = computed(() => {
    return props.oAuthAdapters;
});
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
            console.log('unlinkOauth success');
            console.log(response);
        });
    } catch (error: any) {
        console.log('unlinkOauth failed');
        console.log(error);
    }
}

async function unlinkOauth(type: string) {
    try {
        fetchWrapper.delete(`${baseUrl}/account/oauth/${type}`).then((response) => {
            console.log('unlinkOauth success');
            console.log(response);
        });
    } catch (error: any) {
        console.log('unlinkOauth failed');
        console.log(error);
    }
}
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2" title="Social accounts linked to be able to login using it.">Linked Accounts</h3>
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
                        <th>Accounts</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(provider, name) in oAuthConfig.providers" :key="name">
                        <td>{{ name }}</td>
                        <td>
                            <span v-if="provider.linked">Linked</span>
                            <span v-else>Not linked</span>
                        </td>
                        <td>
                            <span v-if="provider.url">
                                <a :href="provider.url" target="_blank">{{ provider.url }}</a>
                                (<a href="" @click.prevent="unlinkOauth(name.toString())">Unlink</a>)
                                <span v-if="oAuthAdapters[name]">(<a @click.prevent="logOutOauth(name.toString())">Log Out</a>)</span>
                            </span>
                            <span v-else>
                                {{ provider.account || '' }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
