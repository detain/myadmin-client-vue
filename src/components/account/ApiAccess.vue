<script setup lang="ts">
import { computed } from 'vue';
import { useAccountStore } from '@/stores/account.store.ts';
import { useSiteStore } from '@/stores/site.store.ts';

import { fetchWrapper } from '@/helpers/fetchWrapper.ts';

const props = defineProps(['data']);
const data = computed(() => {
    return props.data;
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

async function generateApiKey() {
    try {
        fetchWrapper.post(`${baseUrl}/account/apikey`, {}).then((response) => {
            console.log('generateApiKey success');
            console.log(response);
            accountStore.data.api_key = response;
        });
    } catch (error: any) {
        console.log('generateApiKey failed');
        console.log(error);
    }
}
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2" title="This Provides an alternative way to authenticate with the API. You can use the API Key in place of the account password for API Authentication.">API Access</h3>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fa fas fa-minus" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <form @submit.prevent="generateApiKey" enctype="multipart/form-data" action="account_settings">
                <div class="row">
                    <textarea rows="8" id="api_key" class="form-control" :readonly="!!data.api_key" :placeholder="data.api_key ? '' : 'No API Key Setup Yet'" v-model="data.api_key"></textarea>
                </div>
                <hr />
                <div class="row">
                    <div class="col-md-12 text-center">
                        <button type="submit" class="btn btn-sm btn-green px-3 py-2">{{ data.api_key ? 'Generate a new API Key replacing the old one' : 'Generate an API Key' }}</button>
                        <br />
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
