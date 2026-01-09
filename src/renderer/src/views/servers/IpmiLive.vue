<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';

const props = defineProps<{
    id: number;
}>();
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const id = computed(() => {
    return props.id;
});
const module: string = 'servers';
const siteStore = useSiteStore();
const aId = ref('');
const assetInfo = ref<AssetRow>({
    id: 0,
    order_id: 0,
    hostname: '',
    status: '',
    primary_ipv4: '',
    primary_ipv6: '',
    mac: '',
    datacenter: 0,
    type_id: 0,
    asset_tag: '',
    rack: '',
    row: '',
    col: '',
    unit_start: '',
    unit_end: '',
    unit_sub: 0,
    ipmi_mac: '',
    ipmi_ip: '',
    ipmi_admin_username: '',
    ipmi_admin_password: '',
    ipmi_client_username: '',
    ipmi_client_password: '',
    ipmi_updated: '',
    ipmi_working: 0,
    company: '',
    comments: '',
    make: '',
    model: '',
    description: '',
    customer_id: '',
    external_id: 0,
    billing_status: '',
    overdue: 0,
    create_timestamp: '',
    update_timestamp: '',
});
const clientIP = ref('');
const success = ref('');
const info = ref('');
const error = ref('');
const emailIPMILink = computed(() => {
    // Replace with the computed property logic to generate the link
    return `view_server?id=${id.value}&link=ipmi_live&a_id=${aId.value}&email_ipmi_cred=1`;
});
function submitForm() {
    // Add the form submission logic here
}
function removeCard() {
    // Add the remove card logic here
}

interface AssetRow {
    id: number;
    order_id: number;
    hostname: string;
    status: string;
    primary_ipv4: string;
    primary_ipv6: string;
    mac: string;
    datacenter: number;
    type_id: number;
    asset_tag: string;
    rack: string;
    row: string;
    col: string;
    unit_start: string;
    unit_end: string;
    unit_sub: number;
    ipmi_mac: string;
    ipmi_ip: string;
    ipmi_admin_username: string;
    ipmi_admin_password: string;
    ipmi_client_username: string;
    ipmi_client_password: string;
    ipmi_updated: string;
    ipmi_working: number;
    company: string;
    comments: string;
    make: string;
    model: string;
    description: string;
    customer_id: string;
    external_id: number;
    billing_status: string;
    overdue: number;
    create_timestamp: string;
    update_timestamp: string;
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="card w-100 mb-4 bg-white p-2 shadow-none" style="border-left: 4px solid #17a2b8; display: block ruby">
            <p class="text-md m-0">
                <i class="fas fa-info-circle text-info" aria-hidden="true">&nbsp;</i>
                <b class="text-info">What this does?</b>
                Give live IP to IPMI controller restricted to your IP and limited to 24 hours of use.
            </p>
            <div class="card-tools float-right">
                <button type="button" class="btn btn-tool" data-card-widget="remove" @click="removeCard"><i class="fas fa-times" aria-hidden="true"></i></button>
            </div>
            <p></p>
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-connectdevelop">&nbsp;</i>IPMI IP</h3>
                        <div class="card-tools float-right">
                            <a class="btn btn-custom mr-3" :href="emailIPMILink"><i class="fa fa-paper-plane" aria-hidden="true">&nbsp;</i>Email IPMI Credentials</a>
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="success">
                        <div class="alert alert-success">{{ success }}</div>
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
                                <input id="asset_id" type="text" class="form-control form-control-sm" name="asset_id" :value="aId" disabled />
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
                                <input id="ip" v-model="clientIP" type="text" class="form-control form-control-sm" placeholder="1.2.3.4" name="ip" />
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
