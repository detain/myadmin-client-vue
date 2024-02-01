<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { moduleLink } from '@/helpers/moduleLink.ts';

import { useSiteStore } from '@/stores/site.store.ts';

import { useRoute, useRouter, RouterLink } from 'vue-router';
const route = useRoute();
const router = useRouter();
const module: string = 'quickservers';
const siteStore = useSiteStore();
siteStore.setPageHeading('Order Rapid Deploy Server');
siteStore.setTitle('Order Rapid Deploy Server');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/' + moduleLink(module), 'Rapid Deploy Servers List'],
    ['/' + moduleLink(module) + '/order', 'Order Rapid Deploy Server'],
]);
const baseUrl = siteStore.getBaseUrl();

const step = ref('orderform');
const currency = ref('USD');
const currencySymbol = ref('$');
const custid = ref(2773);
const ima = ref('client');
const qsId = ref(0);
const serverDetails = ref<ServerDetails>({});
const osVersion = ref('');
const osDistro = ref('Ubuntu');
const version = ref({});
const rootpass = ref('');
const hostname = ref('');
const tos = ref(false);
const osTemplates = ref<Templates>({});
const osVersionSelect = ref({});
watch([osTemplates, osDistro, osVersion], ([newTemplates, newDistro, newVersion], [oldTemplates, oldDistro, oldVersion]) => {
    let entries, lastEntry, lastKey, lastValue;
    entries = Object.entries(newTemplates[newDistro]);
    console.log(entries);
    if (entries.length == 0) {
        osVersionSelect.value = {};
    }
    if (typeof newTemplates[newDistro][Number(newVersion)] == 'undefined') {
        console.log(newTemplates[newVersion]);
        lastEntry = entries[entries.length - 1];
        console.log(lastEntry);
        [lastKey, lastValue] = lastEntry;
        console.log([lastKey, lastValue]);
        newVersion = lastKey;
        osVersion.value = lastKey;
    }
    osVersionSelect.value = newTemplates[newDistro];
});
/*
const osVersionSelect = computed(() => {
    let entries, lastEntry, lastKey, lastValue;
    console.log(osTemplates.value);
    console.log(osDistro.value);
    if (Object.entries(osTemplates.value).length === 0 || typeof osTemplates.value[osDistro.value] == 'undefined' || Object.entries(osTemplates.value[osDistro.value]).length === 0 || osTemplates.value[osDistro.value][64].length === 0) {
        return {};
    }
    const templates = osTemplates.value[osDistro.value][64].reduce((acc, [value, key]) => {
            acc[key] = value;
            return acc;
        }, {});
    if (typeof templates[osVersion.value] == 'undefined') {
        console.log(templates);
        entries = Object.entries(templates);
        console.log(entries);
        lastEntry = entries[entries.length - 1];
        console.log(lastEntry);
        osVersion.value = lastEntry[0];
    }
    return templates;
});
*/

async function editForm() {
    step.value = 'orderform';
}

async function onSubmit() {
    step.value = 'order_confirm';
}

async function onSubmitConfirmation() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/qs/order`, {
                template: osVersion.value,
                hostname: hostname.value,
                password: rootpass.value,
                server: qsId.value,
                tos: tos.value,
            })
            .then((response) => {
                Swal.close();
                console.log('qs order placed');
                console.log(response);
                if (response['success'] == true) {
                    router.push('/cart/' + response.iids.join(','));
                }
            });
    } catch (error: any) {
        Swal.close();
        console.log('qs order place failed');
        console.log(error);
    }
}

interface ServerDetails {
    [key: number]: {
        cpu: string;
        ram: string;
        hd: string;
        cores: number;
        cost: string;
    };
}

interface Templates {
    [key: string]: {
        [key: number]: [string, string][];
    };
}

interface Version {
    [key: string]: string;
}

interface DistroSel {
    [key: string]: string;
}

interface QsOrderResponse {
    qs_id: number;
    server_details: ServerDetails;
    templates: Templates;
    version: Version;
    distro_sel: DistroSel;
}

Swal.fire({
    title: '',
    html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
    allowOutsideClick: false,
    showConfirmButton: false,
});
fetchWrapper.get(baseUrl + '/qs/order').then((response: QsOrderResponse) => {
    Swal.close();
    console.log('Response:');
    console.log(response);
    serverDetails.value = response.server_details;
    qsId.value = response.qs_id;
    osTemplates.value = response.templates;
});
</script>

<template>
    <template v-if="!step || step === 'orderform'">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-server" aria-hidden="true">&nbsp;</i>Order Rapid Deploy Server</h3>
                            <div class="card-tools float-right">
                                <router-link to="/qs" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="quickserver_form" method="post" class="quickserver_form_init" @submit.prevent="onSubmit">
                            <input type="hidden" name="rootpass" v-model="rootpass" />
                            <div class="form-group row">
                                <div class="col-md-12">
                                    <table v-if="Object.keys(serverDetails).length > 0" class="table-sm table text-center">
                                        <tbody>
                                            <tr>
                                                <th>Select Server</th>
                                                <th>QS NO.</th>
                                                <th>QUICKSERVER</th>
                                                <th>RAM</th>
                                                <th>HDD</th>
                                                <th>CORES</th>
                                            </tr>
                                            <tr v-for="(details, value) in serverDetails" :key="value">
                                                <td>
                                                    <div class="icheck-success d-inline">
                                                        <input :id="'qs-' + value" type="radio" class="form-check-input" name="quickserver" v-model="qsId" :value="value" />
                                                        <label class="text-bold my-1" :for="'qs-' + value">&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td>{{ value }}</td>
                                                <td>{{ details.cpu }}</td>
                                                <td>{{ details.ram }}</td>
                                                <td>{{ details.hd }}</td>
                                                <td>{{ details.cores }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div v-else>
                                        <input type="text" class="form-control form-control-sm text-bold text-xs" value="Currently sold out!" disabled />
                                        <small class="text-muted text-xs">
                                            <a class="link" target="__blank" href="https://www.interserver.net/dedicated/rapid-deploy.html"> Please contact our sales department. </a>
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">OS Distribution<span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select class="form-control select2" v-model="osDistro">
                                        <option v-for="(templateData, templateDistro, index) in osTemplates" :key="index" :value="templateDistro">{{ templateDistro }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">OS Version<span class="text-danger"> *</span></label>
                                <div class="input-group col-md-9">
                                    <select class="form-control select2" v-model="osVersion">
                                        <option v-for="(templateVersion, templateName, index) in osVersionSelect" :key="index" :value="templateName">{{ templateVersion }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label">Root Password</label>
                                <input type="password" class="form-control form-control-sm col-md-9" name="rootpass" id="mypassword" placeholder="Root Password" v-model="rootpass" />
                                <small class="form-text text-muted">Note: Password must contain atleast 8 characters, one lowercase letter, one uppercase letter, one number, a special character.</small>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12 text-center"><input type="submit" name="Submit" value="Continue" class="btn btn-sm btn-order px-3 py-2" /></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <!-- Order Summary -->
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div id="package_name" class="col-md-8">Rapid Deploy Server</div>
                            <div id="package_period" class="col text-bold text-right">1 Month(s)</div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-8">Package Cost</div>
                            <div class="col text-bold package_cost text-right">{{ serverDetails[qsId] ? serverDetails[qsId].cost : '' }}</div>
                        </div>
                        <hr />
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalcost" class="col text-bold total_cost text-right text-lg">{{ serverDetails[qsId] ? serverDetails[qsId].cost : '' }}</div>
                        </div>
                    </div>
                </div>
                <!-- End Order Summary -->
            </div>
        </div>
    </template>
    <template v-else-if="step === 'order_confirm'">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form method="post" class="quickserver_form_confirm" @submit.prevent="onSubmitConfirmation">
                            <table class="table-sm table-bordered table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="text-bold float-left" style="position: relative; top: 5px">Server Name</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" @click="step = 'orderform'" data-toggle="tooltip" title="Edit details"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div class="text-bold">{{ serverDetails[qsId].cpu }}</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="text-sm">QuickServer ID</div>
                                        </td>
                                        <td>
                                            <div class="text-bold">{{ qsId }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-sm">Operating System</div>
                                        </td>
                                        <td>
                                            <div class="text-bold">{{ osDistro }} {{ osTemplates[osDistro][Number(osVersion)] }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-sm">RAM</div>
                                        </td>
                                        <td>
                                            <div class="text-bold">{{ serverDetails[qsId].ram }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-sm">HDD</div>
                                        </td>
                                        <td>
                                            <div class="text-bold">{{ serverDetails[qsId].hd }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-sm">CORES</div>
                                        </td>
                                        <td>
                                            <div class="text-bold">{{ serverDetails[qsId].cores }}</div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>
                                            <div class="text-lg">Total</div>
                                        </th>
                                        <th>
                                            <div class="text-bold total_cost text-lg" id="totalprice"></div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <hr />
                            <div class="p-1">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">The subscription will automatically renew after <b>every month at</b> <span id="totalprice" class="total_cost text-bold"></span> until canceled.</p>
                                <p class="text-muted text-xs">By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <br /><b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.</p>
                                <div class="icheck-success text-bold text-center">
                                    <input type="checkbox" name="tos" id="tos" style="margin: 0 5px; display: inline" value="yes" v-model="tos" />
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center"><input type="submit" name="Submit" value="Place Order" class="btn btn-sm btn-green px-3 py-2" /></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
<style scoped></style>
