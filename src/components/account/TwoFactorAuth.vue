<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { useAccountStore, useAuthStore, useSiteStore } from "@/stores";
const props = defineProps(['data']);
const data = computed(() => { return props.data; });
const siteStore = useSiteStore();
const accountStore = useAccountStore();
siteStore.setPageHeading('Account Settings');
siteStore.setTitle('Account Settings');
siteStore.setBreadcrums({'/home': 'Home', '': 'Account Settings'});
const baseUrl = import.meta.env.VITE_API_URL;


async function update2fa() {
    try {
        fetchWrapper.post(`${baseUrl}/account/2fa`, {
            enableGoogle2fa: data.value['2fa_google_enabled'],
        }).then(response => {
            console.log('update2fa success');
            console.log(response);
        });
    } catch (error) {
        console.log('update2fa failed');
        console.log(error);
    }

}
</script>

<template>
        <div class="card">
            <div class="card-header">
                <div class="p-1">
                    <h3 id="2fa" class="card-title py-2" title="Dual authentication for your account for security">Two Factor Authentication</h3>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fa fas fa-minus" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <form @submit.prevent="update2fa">
                    <div class="row justify-content-center">
                        <div class="icheck-success d-inline">
                            <input type="checkbox" id="giChkSqr" value="1" name="2fa_google" v-model="data['2fa_google_enabled']">
                            <label for="giChkSqr">Enable Google Two Factor Authentication</label>
                        </div>
                    </div>
                    <hr />
                    <div v-if="data['2fa_google_enabled']">
                        <p class="text-success text-center mt-4">
                            <strong><i class="fa fa-check-square" style="">&nbsp;</i>Two Factor Authentication Enabled</strong>
                        </p>
                    </div>
                    <div v-else id="2fa_google" class="row">
                        <blockquote class="mt-0 mb-2 mx-0 px-3 py-2" style="background: lightcyan;">
                            <p>Install and Register the <a target="_blank" class="link" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"><i class="fa fa-cloud-download"></i> Google Authenticator</a> by entering the code below or scanning the QR image</p>
                        </blockquote>
                        <div class="col-md-8 mt-3">
                            <h3 class="py-3"><span class="badge badge-primary">{{ data['2fa_google_split'] }}</span></h3>
                            <div class="alert alert-warning mt-2" role="alert">
                                <i class="fa fas fa-file-export">&nbsp;</i>
                                You should backup this code for recovery.
                            </div>
                            <input v-if="!data['2fa_google_enabled']" v-model="data['2fa_google_key']" type="text" class="form-control mt-4" name="2fa_google_code" id="2fa_google_code" placeholder="Enter Code from Authenticator">
                        </div>
                        <div class="col-md-3 text-center">
                            <img :src="data['2fa_google_qr']" alt="Google QR Code">
                        </div>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <button type="submit" class="btn btn-green py-2 px-3 btn-sm">Update Two Factor Authentication</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
</template>
