<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAccountStore, useAuthStore, useSiteStore } from '@/stores';
import { fetchWrapper } from '@/helpers';
const props = defineProps(['data', 'oauthproviders', 'oauthconfig', 'oauthadapters']);
const data = computed(() => {
    return props.data;
});
const oauthproviders = computed(() => {
    return props.oauthproviders;
});
const oauthconfig = computed(() => {
    return props.oauthconfig;
});
const oauthadapters = computed(() => {
    return props.oauthadapters;
});
const siteStore = useSiteStore();
const accountStore = useAccountStore();
siteStore.setPageHeading('Account Settings');
siteStore.setTitle('Account Settings');
siteStore.setBreadcrums({ '/home': 'Home', '': 'Account Settings' });
const baseUrl = siteStore.getBaseUrl();

async function logOutOauth(type) {
    try {
        fetchWrapper
            .get(`${baseUrl}/account/oauth/logout`, {
                type: type,
            })
            .then((response) => {
                console.log('unlinkOauth success');
                console.log(response);
            });
    } catch (error) {
        console.log('unlinkOauth failed');
        console.log(error);
    }
}

async function unlinkOauth(type) {
    try {
        fetchWrapper
            .delete(`${baseUrl}/account/oauth`, {
                type: type,
            })
            .then((response) => {
                console.log('unlinkOauth success');
                console.log(response);
            });
    } catch (error) {
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
                    <tr v-for="(provider, name) in oauthconfig.providers" :key="name">
                        <td>{{ name }}</td>
                        <td>
                            <span v-if="provider.linked">Linked</span>
                            <span v-else>Not linked</span>
                        </td>
                        <td>
                            <span v-if="provider.url">
                                <a :href="provider.url" target="_blank">{{ provider.url }}</a>
                                (<a @click.prevent="unlinkOauth(name)">Unlink</a>)
                                <span v-if="oauthadapters[name]">(<a @click.prevent="logOutOauth(name)">Log Out</a>)</span>
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
