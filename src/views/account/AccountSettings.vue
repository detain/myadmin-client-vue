<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { useAccountStore, useAuthStore, useLayoutStore } from "@/stores";
const layoutStore = useLayoutStore();
const accountStore = useAccountStore();
const { breadcrums, page_heading } = storeToRefs(layoutStore);
layoutStore.setPageHeading('Account Settings');
layoutStore.setBreadcrums({'/home': 'Home', '': 'Account Settings'});

const { loading, error, custid, ima, csrf_token, link, data, ip, oauthproviders, oauthconfig, oauthadapters, limits } = storeToRefs(accountStore);

const newLimit = ref({
    start: "",
    end: ""
});

async function updateFeatures() {

}

async function update2fa() {

}

async function updateSshPublicKey() {
    console.log(data.value.ssh_key);
}

async function generateApiKey() {

}

async function submitAddRange(values) {
    try {
        let message;
        console.log(newLimit.value.start);
        console.log(newLimit.value.end);
        /*const response = await fetchWrapper.post('https://mystage.interserver.net/apiv2/account_settings', {
        });
        console.log(response);
        */
    } catch (error) {
        console.log(error);
        //alertStore.error(error);
    }
}

accountStore.load();
</script>

<template>
<div class="row">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <div class="p-1">
                    <h3 class="card-title py-2" title="This Provides a way to limit the IP Addresses your account can login to from adding additional security to your account.">Session IP Security Limits</h3>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fa fas fa-minus" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="alert alert-info">
                    Your Remote IP: <b>{{ip}}</b><br>
                    Enabling IP limits will prevent anyone that is not listed below from logging in. Make sure your IP address is static and will not change in the future.
                </div>
                <form @submit.prevent="submitAddRange" enctype="multipart/form-data">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Start IP</th>
                                <th>End IP</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(limit, idx) in limits" :key="'row' + idx">
                                <td>{{limit.start}}</td>
                                <td>{{limit.end}}</td>
                                <td>
                                    <a v-if="custid" :href="`${link}&csrf_token=${csrf_token}&action=remove&custid=${custid}&start=${limit.start}&end=${limit.end}`" class="btn btn-sm btn-danger"><span class="fa fa-trash"></span> Remove</a>
                                    <a v-else :href="`${link}&csrf_token=${csrf_token}&action=remove&start=${limit.start}&end=${limit.end}`" class="btn btn-sm btn-danger"><span class="fa fa-trash"></span> Remove</a>
                                </td>
                            </tr>
                            <tr>
                                <td><input type="text" name="start" v-model="newLimit.start"></td>
                                <td><input type="text" name="end" v-model="newLimit.end"></td>
                                <td><button type="submit" class="btn btn-custom btn-sm" name="submit">Add Range</button></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    </div>
    <div class="col-md-6">
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
                            <button type="submit" class="btn btn-sm btn-green py-2 px-3">{{ data.api_key ? 'Generate a new API Key replacing the old one' : 'Generate an API Key' }}</button>
                            <br>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <div class="p-1">
                    <h3 class="card-title py-2" v-bind:title="'This SSH Key will automatically get added to some services such as VPS orders providing an alternative means of authentication with your services.'">SSH Keys</h3>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fa fas fa-minus" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <form method="post" @submit.prevent="updateSshPublicKey" enctype="multipart/form-data" action="account_settings">
                    <div class="row">
                        <textarea class="form-control" rows="6" id="ssh_key" name="ssh_key" placeholder="No SSH Key Setup Yet" v-model="data.ssh_key"></textarea>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <template v-if="data.ssh_key">
                                <input type="submit" class="btn btn-sm btn-green py-2 px-3" name="submit" value="Update SSH Public Key">
                            </template>
                            <template v-else>
                                <input type="submit" class="btn btn-sm btn-green py-2 px-3" name="submit" value="Set SSH Public Key">
                            </template>
                            <br>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="col-md-6">
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
                                    (<a :href="`?choice=none.account_settings&unlink=${name}&csrf_token=${csrf_token}`">Unlink</a>)
                                    <span v-if="oauthadapters[name]">(<a :href="`${oauthconfig.callback}?logout=${name}`">Log Out</a>)</span>
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
    </div>
</div>
<div class="row">
    <div class="col-md-6">
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
                    <input type="hidden" name="csrf_token" :value="csrf_token">
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
    </div>
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <div class="p-1">
                    <h3 class="card-title py-2" title="">Account Features</h3>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fa fas fa-minus" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <form method="post" enctype="multipart/form-data" action="account_settings" @submit.prevent="updateFeatures">
                    <div class="row pl-5 ml-5">
                        <div class="icheck-success d-inline">
                            <input type="checkbox" name="disable_reinstall" value="1" id="disreins" v-model="data.disable_reinstall">
                            <label for="disreins">Disable Reinstalls<div style="font-weight: normal;">Note: To disable reinstall create new ticket, our support team will help</div></label>
                        </div>
                    </div>
                    <div class="row pl-5 ml-5">
                        <div class="icheck-success d-inline">
                            <input type="checkbox" name="disable_reset" value="1" id="disreset" v-model="data.disable_reset">
                            <label for="disreset">Disable (Forgot your Password) Password Resets.</label>
                        </div>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <input type="submit" class="btn btn-green py-2 px-3 btn-sm" value="Update Account Features Settings"><br>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>