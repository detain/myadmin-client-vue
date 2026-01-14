<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import { useAccountStore } from '../../stores/account.store';
import Swal from 'sweetalert2';
import { storeToRefs } from 'pinia';
import { AssetRow } from '../../types/servers';

const props = defineProps<{
    id: number;
    assetInfo: AssetRow;
}>();
const id = computed(() => props.id);
const module: string = 'servers';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const accountStore = useAccountStore();
const { ip } = storeToRefs(accountStore);
const assetInfo = computed(() => props.assetInfo);
const success = ref('');
const info = ref('');
const error = ref('');
const clientIp = ref(ip.value);

function emailIpmiLink() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/${moduleLink(module)}/${id.value}/ipmi_live`, {
                ip: clientIp.value,
            })
            .then((response) => {
                Swal.close();
                console.log('ipmi live setup vnc success');
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('ipmi live setup vnc failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

function submitForm() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/${moduleLink(module)}/${id.value}/ipmi_live`, {
                ip: clientIp.value,
            })
            .then((response) => {
                Swal.close();
                if (typeof response.public_ip != 'undefined') {
                    success.value = response.text;
                } else {
                    error.value = response.text;
                }
                console.log('ipmi live setup vnc success');
                console.log(response);
            });
    } catch (err: any) {
        Swal.close();
        error.value = err.text;
        console.log('ipmi live setup vnc failed');
        console.log(error);
    }
}

try {
    fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/ipmi_live`).then((response) => {
        console.log(response);
        if (typeof response.public_ip != 'undefined') {
            success.value = response.text;
        }
    });
} catch (error: any) {
    console.log(error);
}

accountStore.loadOnce();
</script>

<template>
    <div class="row justify-content-center">
        <div class="card w-100 mb-4 bg-white p-2 shadow-none" style="border-left: 4px solid #17a2b8; display: block ruby">
            <p class="text-md m-0">
                <i class="fas fa-info-circle text-info" aria-hidden="true">&nbsp;</i>
                <b class="text-info">What this does?</b>
                Give live IP to IPMI controller restricted to your IP and limited to 24 hours of use.
            </p>
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-connectdevelop">&nbsp;</i>IPMI IP</h3>
                        <div class="card-tools float-right">
                            <a class="btn btn-custom mr-3" @click.prevent="emailIpmiLink"><i class="fa fa-paper-plane" aria-hidden="true">&nbsp;</i>Email IPMI Credentials</a>
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="success">
                        <div class="alert alert-success" v-html="success"></div>
                    </div>
                    <div v-else-if="info">
                        <div class="alert alert-info">{{ info }}</div>
                    </div>
                    <div v-else-if="error">
                        <div class="alert alert-danger">{{ error }}</div>
                    </div>
                    <form v-if="!error" @submit.prevent="submitForm">
                        <input type="hidden" name="choice" value="none.view_dedicated_server" />
                        <input type="hidden" name="link" value="ipmi_live" />
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label text-right">Asset ID</label>
                            <div class="col-sm-9 input-group">
                                <input id="asset_id" type="text" class="form-control form-control-sm" name="asset_id" :value="assetInfo.id" disabled />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label text-right">Server ID</label>
                            <div class="col-sm-9 input-group">
                                <input id="server_id" type="text" class="form-control form-control-sm" name="server_id" :value="assetInfo.order_id" disabled />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label text-right">Hostname</label>
                            <div class="col-sm-9 input-group">
                                <input id="hostname" type="text" class="form-control form-control-sm" name="hostname" :value="assetInfo.hostname" disabled />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label text-right">Server IP</label>
                            <div class="col-sm-9 input-group">
                                <input id="primary_ipv4" type="text" class="form-control form-control-sm" name="primary_ipv4" :value="assetInfo.primary_ipv4" disabled />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label text-right">Server IPMI</label>
                            <div class="col-sm-9 input-group">
                                <input id="ipmi" type="text" class="form-control form-control-sm" name="ipmi" :value="assetInfo.ipmi_ip" disabled />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label text-right">Your IP Address</label>
                            <div class="col-sm-9 input-group">
                                <input id="ip" v-model="clientIp" type="text" class="form-control form-control-sm" placeholder="1.2.3.4" name="ip" />
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <div class="controls col-md-12 text-center">
                                <input type="submit" name="Submit" value="Submit" class="btn btn-sm btn-order px-3 py-2" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
