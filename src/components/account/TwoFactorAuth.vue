<script setup lang="ts">
import { ref, computed } from 'vue';
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
const googleKey = ref('');
const googleSplit = ref('');
const googleCode = ref('');

async function update2fa() {
    try {
        fetchWrapper.post(`${baseUrl}/account/2fa`, { '2fa_google_code': googleCode.value }).then((response) => {
            console.log('update2fa success', response);
        });
    } catch (error: any) {
        console.log('update2fa failed', error);
    }
}

async function delete2fa() {
    try {
        fetchWrapper.delete(`${baseUrl}/account/2fa`).then((response) => {
            console.log('delete2fa success', response);
        });
    } catch (error: any) {
        console.log('delete2fa failed', error);
    }
}

async function get2faKey() {
    try {
        fetchWrapper.get(`${baseUrl}/account/2fa`).then((response) => {
            console.log('get2faKey success', response);
            googleKey.value = response['2fa_google_key'];
            googleSplit.value = response['2fa_google_split'];
        });
    } catch (error: any) {
        console.log('get2faKey failed', error);
    }
}
</script>

<script lang="ts">
export default {
    name: 'TwoFactorAuth',
};
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div class="p-1">
                <h3 id="2fa" class="card-title py-2" :title="t('common.account.twoFactorAuthDescription')">{{ t('common.account.twoFactorAuth') }}</h3>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><font-awesome-icon :icon="['fas', 'minus']" aria-hidden="true" /></button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <form @submit.prevent="update2fa">
                <div class="row justify-content-center">
                    <div class="icheck-success d-inline">
                        <input id="giChkSqr" v-model="data['2fa_google_enabled']" type="checkbox" value="1" name="2fa_google" />
                        <label for="giChkSqr">{{ t('common.account.enableGoogle2fa') }}</label>
                    </div>
                </div>
                <hr />
                <div v-if="data['2fa_google_enabled']">
                    <p class="text-success mt-4 text-center">
                        <strong><font-awesome-icon :icon="['far', 'check-square']" />&nbsp;{{ t('common.account.twoFactorEnabled') }}</strong>
                    </p>
                </div>
                <div v-else id="2fa_google" class="row">
                    <blockquote class="mx-0 mb-2 mt-0 px-3 py-2" style="background: lightcyan">
                        <p>
                            Install and Register the <a target="_blank" class="link" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"><font-awesome-icon :icon="['fas', 'cloud-download-alt']" /> {{ t('common.account.googleAuthenticator') }}</a> by entering the code below or scanning the QR image
                        </p>
                    </blockquote>
                    <div class="col-md-8 mt-3">
                        <h3 class="py-3">
                            <span class="badge badge-primary">{{ data['2fa_google_split'] }}</span>
                        </h3>
                        <div class="alert alert-warning mt-2" role="alert">
                            <font-awesome-icon :icon="['fas', 'file-export']" />&nbsp;
                            {{ t('common.account.backupCode') }}
                        </div>
                        <input v-if="!data['2fa_google_enabled']" id="2fa_google_code" v-model="googleCode" type="text" class="form-control mt-4" name="2fa_google_code" :placeholder="t('common.account.enterAuthCode')" />
                    </div>
                    <div class="col-md-3 text-center">
                        <img :src="data['2fa_google_qr']" alt="Google QR Code" />
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-md-12 text-center">
                        <button type="submit" class="btn btn-green btn-sm px-3 py-2">{{ t('common.buttons.update2fa') }}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
