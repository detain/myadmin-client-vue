<script setup lang="ts">
import { ref, computed } from 'vue';
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import Swal from 'sweetalert2';
import { useSiteStore } from '@/stores';
const siteStore = useSiteStore();
siteStore.setPageHeading('Order Server');
siteStore.setTitle('Order Server');
siteStore.setBreadcrums({ '/home': 'Home', '/servers': 'Servers List', '/servers/order': 'Order Server' });
const baseUrl = siteStore.getBaseUrl();

const currency = ref('USD');
const currencySymbol = ref('$');
const custid = ref('2773');
const ima = ref('client');
const step = ref('order_form');
const cpu = ref(34);
const cpuLi = ref({});
const configIds = ref({});
const formValues = ref({});
const configLi = ref({
    cpuLi: {},
    memory_li: {},
    hd_li: {},
    bandwidth_li: {},
    ips_li: {},
    os_li: {},
    cp_li: {},
    raid_li: [],
});
const cpuCores = ref({});
const fieldLabel = ref({
    bandwidth: {
        name: 'Bandwidth',
        active: 1,
    },
    ips: {
        name: 'IPs',
        active: 0,
    },
    os: {
        name: 'Operating System',
        active: 1,
    },
    cp: {
        name: 'Control Panel',
        active: 0,
    },
    raid: {
        name: 'Raid',
    },
    memory: {
        name: 'Memory',
    },
    hd: {
        name: 'Hard Drives',
    },
});

function addDrive() {

}

async function onSubmitCpu() {
    serverOrderRequest(true);
}

async function serverOrderRequest(addCpu) {
    let loading = Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper.get(addCpu ? baseUrl + '/servers/order?cpu=' + cpu.value : baseUrl + '/servers/order').then((response) => {
        loading.close();
        console.log('Response:');
        console.log(response);
        configIds.value = response.config_ids;
        configLi.value = response.config_li;
        cpuLi.value = response.cpu_li;
        fieldLabel.value = response.field_label;
        cpuCores.value = response.cpu_cores;
        formValues.value = response.form_values;
        cpu.value = response.cpu;
        if (addCpu) {
            step.value = 'step2';
        }
    });
}

serverOrderRequest(false);
</script>

<template>
    <template v-if="!step || step == 'order_form'">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-server" aria-hidden="true">&nbsp;</i>Order Dedicated Server</h3>
                            <div class="card-tools float-right">
                                <router-link :to="'/servers'" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="dserver_form" method="post" class="dserver_form_init" action="order_server" @submit.prevent="onSubmitCpu">
                            <div class="form-group row">
                                <label class="col-md-1 px-0">CPU<span class="text-danger"> *</span></label>
                                <div class="input-group col-md-11">
                                    <div v-for="(cpu_details, id) in cpuLi" :key="id" class="icheck-success d-inline w-100">
                                        <input :id="'ds-' + id" type="radio" class="form-check-input" name="cpu" :value="id" v-model="cpu" />
                                        <label class="font-weight-normal w-100" :for="'ds-' + id">
                                            <div class="row mb-2">
                                                <div class="col-md-3">
                                                    <img alt=""  class="pr-2" :src="'/images/v2-images/' + cpu_details.img" style="max-width: 100px" />
                                                </div>
                                                <div class="col-md-5">
                                                    <div class="text-bold text-sm">{{ cpu_details.short_desc }}</div>
                                                    <div class="text-bold text-sm">{{ cpu_details.num_cores }} Cores</div>
                                                </div>
                                                <div class="col-md-4 text-right">
                                                    <span class="text-md text-bold text-green pl-2">{{ cpu_details.monthly_price_display }}</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12 text-center">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-order btn-sm px-3 py-2" />
                                </div>
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
                            <h4 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div id="package_name" class="col-md-8">Dedicated Server</div>
                            <div id="package_period" class="col text-right">1 Month(s)</div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-8 cpu_name">{{ cpuLi[cpu] ? cpuLi[cpu].monthly_price_display : 'CPU' }}</div>
                            <div class="col cpu_cost text-right text-lg">{{ cpuLi[cpu] ? cpuLi[cpu].monthly_price_display : '' }}</div>
                        </div>
                        <hr />
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalcost" class="col total_cost text-right text-lg">{{ cpuLi[cpu] ? cpuLi[cpu].monthly_price_display : '' }}</div>
                        </div>
                    </div>
                </div>
                <!-- End Order Summary -->
                <!-- Server Recommendations -->
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2"><i class="fa fa-hand-o-right">&nbsp;</i>Recommendations</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <template v-for="(cpu_det, core) in cpuCores" :key="core">
                            <a href="javascript:void(0);" :id="'core-' + core" data-toggle="modal" :data-target="'#coreM-' + core" class="btn btn-sm btn-secondary m-2" style="min-width: 100px">{{ core }}-Cores</a>
                            <div :id="'coreM-' + core" class="modal fade">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header border-0 p-4">
                                            <h4>{{ core }}-Cores Servers</h4>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <div v-for="cpu_details in cpu_det" :key="cpu_details.id">
                                                <div class="row">
                                                    <div class="col"><img alt="" :src="'/images/v2-images/' + cpu_details.img" style="max-width: 100px" /></div>
                                                    <div class="col">
                                                        <div class="font-weight-light text-lg">{{ cpu_details.short_desc }}</div>
                                                        <div class="text-green text-sm">{{ cpu_details.monthly_price_display }}</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="text-lg">{{ cpu_details.memory_det.short_desc }}</div>
                                                        <div class="text-sm">RAM</div>
                                                        <div class="text-green text-sm text-sm">{{ cpu_details.memory_det.monthly_price_display }}</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="text-lg" v-if="cpu_details.hd_det">{{ cpu_details.hd_det.short_desc }}</div>
                                                        <div class="text-sm">HDD</div>
                                                        <div class="text-green text-sm text-sm" v-if="cpu_details.hd_det">{{ cpu_details.hd_det.monthly_price_display }}</div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="text-green text-lg">{{ cpu_details.monthly_fee }}</div>
                                                        <div class="text-sm">Total Cost per month</div>
                                                    </div>
                                                    <div class="col">
                                                        <a :href="'/order_server?cpu=' + cpu_details.id" class="btn btn-green btn-sm mt-2 px-4 py-2">Order</a>
                                                    </div>
                                                </div>
                                                <hr class="w-100" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <!-- End Server Recommendations -->
            </div>
        </div>
    </template>
    <template v-else-if="step == 'step2'">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-server" aria-hidden="true">&nbsp;</i>Order Dedicated Server</h3>
                            <div class="card-tools float-right">
                                <a href="order_server" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back"> <i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp; </a>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="dserver_form" method="post" class="dserver_form_init" action="order_server">
                            <input id="cpu" type="hidden" name="cpu" :value="formValues.cpu" />
                            <input id="step_n" type="hidden" name="step_n" value="confirm_order" />
                            <template v-for="(inputDetails, inputName) in configLi" :key="inputName">
                                <template v-if="inputName !== 'cpuLi'">
                                    <template v-if="['memory_li', 'hd_li'].includes(inputName)">
                                        <div class="form-group row">
                                            <label class="col-md-3 col-form-label text-right">
                                                {{ fieldLabel[inputName.replace('_li', '')].name }}
                                                <span class="text-danger"> *</span>
                                            </label>
                                            <div class="input-group col-md-9">
                                                <template v-for="(details, id) in inputDetails[cpu]" :key="id">
                                                    <div class="icheck-success d-inline w-100">
                                                        <input v-if="inputName === 'memory_li'" :id="'ds-' + inputName.replace('_li', '') + '-' + id" class="form-check-input" type="radio" :name="inputName.replace('_li', '')" :value="id" :checked="formValues[inputName.replace('_li', '')] === id" @change="updatePrice()" />
                                                        <label v-if="details.index === 0 && inputName === 'hd_li'" class="font-weight-normal w-100">
                                                            <div class="row mb-2">
                                                                <div class="col-md-12">
                                                                    <table class="table-sm table-bordered table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Drive Type</th>
                                                                                <th>LFF</th>
                                                                                <th>SFF</th>
                                                                                <th>NVE</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>Max Drives</td>
                                                                                <td id="drives-lff">0/4</td>
                                                                                <td id="drives-sff">0/4</td>
                                                                                <td id="drives-nve">0/2</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </label>
                                                        <label v-if="details.index !== 0 || inputName !== 'hd_li'" :for="'ds-' + inputName.replace('_li', '') + '-' + id" :class="'font-weight-normal w-100' + (inputName === 'hd_li' ? ' drive-row-' + details.drive_type : '')">
                                                            <div class="row mb-2">
                                                                <div class="col-md-8">
                                                                    <div class="text-md font-weight-light">
                                                                        <template v-if="inputName === 'hd_li'">
                                                                            <button type="button" :id="'drive-remove-' + id" class="remove-button btn btn-xs btn-secondary pb-0" @click="removeDrive(id, details.drive_type)">
                                                                                <i class="fa fa-minus"></i>
                                                                            </button>
                                                                            <b>/</b>
                                                                            <button type="button" :id="'drive-add-' + id" class="add-button btn btn-success btn-xs pb-0" @click="addDrive(id, details.drive_type, details.short_desc, details.monthly_price)">
                                                                                <i class="fa fa-plus"></i>
                                                                            </button>
                                                                        </template>
                                                                        <span class="text-bold ml-2 text-sm">{{ details.short_desc }}</span>
                                                                        <template v-if="inputName === 'hd_li'">
                                                                            <span class="badge bg-info ml-2">{{ details.drive_type }}</span>
                                                                        </template>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-4 text-right">
                                                                    <span class="text-md text-bold text-green pl-2">{{ details.monthly_price_display }}</span>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </template>
                                    <div v-else-if="fieldLabel[inputName.replace('_li', '')]" class="form-group row">
                                        <label class="col-md-3 col-form-label text-right">
                                            {{ fieldLabel[inputName.replace('_li', '')]?.name }}
                                            <span class="text-danger"> *</span>
                                        </label>
                                        <div class="input-group col-md-9" :class="inputName + '-row'">
                                            <div v-for="(details, id) in inputDetails" :key="id" class="icheck-success d-inline w-100">
                                                <input :id="'ds-' + inputName.replace('_li', '') + '-' + id" type="radio" class="form-check-input" :name="inputName.replace('_li', '')" :value="id" :checked="formValues[inputName.replace('_li', '')] == id" @change="updatePrice()" />
                                                <label :for="'ds-' + inputName.replace('_li', '') + '-' + id" class="font-weight-normal w-100">
                                                    <div class="row mb-2">
                                                        <div class="col-md-8">
                                                            <div class="text-bold text-sm">{{ details.short_desc }}</div>
                                                        </div>
                                                        <div class="col-md-4 text-right">
                                                            <span class="text-md text-bold text-green pl-2">{{ details.monthly_price_display }}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-order btn-sm px-3 py-2" />
                                </div>
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
                            <h4 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div id="package_name" class="col-md-8">Dedicated Server</div>
                            <div id="package_period" class="col text-bold text-right">1 Month(s)</div>
                        </div>
                        <div class="row cpu-row mb-3">
                            <div class="col-md-8">
                                <span class="cpu_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">CPU</span>
                            </div>
                            <div class="col text-md text-bold cpu_cost text-right"></div>
                        </div>
                        <div class="row d-none memory-row mb-3">
                            <div class="col-md-8">
                                <span class="memory_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">RAM</span>
                            </div>
                            <div class="col text-md text-bold memory_cost text-right"></div>
                        </div>
                        <div id="hd-row" class="d-none"></div>
                        <div class="row d-none bandwidth-row mb-3">
                            <div class="col-md-8">
                                <span class="bandwidth_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">Bandwidth</span>
                            </div>
                            <div class="col text-md text-bold bandwidth_cost text-right"></div>
                        </div>
                        <div class="row d-none ips-row mb-3">
                            <div class="col-md-8">
                                <span class="ips_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">IP</span>
                            </div>
                            <div class="col text-md text-bold ips_cost text-right"></div>
                        </div>
                        <div class="row d-none os-row mb-3">
                            <div class="col-md-8">
                                <span class="os_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">OS</span>
                            </div>
                            <div class="col text-md text-bold os_cost text-right"></div>
                        </div>
                        <div class="row d-none cp-row mb-3">
                            <div class="col-md-8">
                                <span class="cp_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">Control Panel</span>
                            </div>
                            <div class="col text-md text-bold cp_cost text-right"></div>
                        </div>
                        <div class="row d-none raid-row mb-3">
                            <div class="col-md-8">
                                <span class="raid_name"></span>
                                <span class="badge badge-pill badge-warning ml-2">RAID</span>
                            </div>
                            <div class="col text-md text-bold raid_cost text-right"></div>
                        </div>
                        <hr />
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalcost" class="col text-bold total_cost text-right text-lg"></div>
                        </div>
                    </div>
                </div>
                <!-- End Order Summary -->
            </div>
        </div>
    </template>
    <template v-else-if="step == 'confirm_order'">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card shadow-none">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="edit_order_form" method="post" action="order_server">
                            <template v-for="(field_value, field) in formValues">
                                <input :key="field" type="hidden" :id="field" :name="field" :value="field_value" v-if="field !== 'hd'" />
                            </template>
                            <input v-for="(hd_val, indexx) in hd_values" :key="indexx" class="input-hd" type="hidden" name="hd[]" :value="hd_val" />
                            <input type="hidden" name="Submit" />
                        </form>
                        <form method="post" class="dserver_form_confirm" action="order_server">
                            <template v-for="(field_value, field) in formValues">
                                <input :key="field" type="hidden" :id="field" :name="field" :value="field_value" v-if="field !== 'hd'" />
                            </template>
                            <input v-for="(hd_val, indexx) in hd_values" :key="indexx" type="hidden" name="hd[]" :value="hd_val" />
                            <input id="step_n" type="hidden" name="step_n" value="confirm_order" />
                            <div class="form-group row">
                                <label class="col-sm-4 col-form-label text-right">Server Hostname<span class="text-danger"> *</span></label>
                                <div class="input-group col-md-8">
                                    <input type="text" class="form-control form-control-sm" name="servername" :value="servername" placeholder="server.hostname.com" required />
                                    <small class="form-text text-muted">
                                        <b>Example: server.hostname.com</b><br />
                                        Use the hostname to identify the server. The domain does not need to be valid or registered. One period is required in the hostname. Other examples: database.local, web.server or your.name.
                                    </small>
                                </div>
                            </div>
                            <div id="rootpassrownew" class="form-group row">
                                <label class="col-sm-4 col-form-label text-right">Root Password<span class="text-danger"> *</span></label>
                                <div class="form-group input-group col-md-8">
                                    <input placeholder="Enter Password" v-model="rootpass" class="form-control form-control-sm" required />
                                    <small class="form-text text-muted">Note: Password must contain atleast 8 characters,one lowercase letter, one uppercase letter, one number, a special character.</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-4 col-form-label text-right">Comments</label>
                                <div class="form-group input-group col-md-8">
                                    <textarea placeholder="Enter Comment" rows="5" v-model="comment" class="form-control form-control-sm" id="comment"></textarea>
                                </div>
                            </div>
                            <hr />
                            <table class="table-sm table-bordered table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div id="package_name" class="float-left" style="position: relative; top: 5px">Dedicated Server</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" onclick="edit_form()" data-toggle="tooltip" title="Edit details"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div id="package_period" class="text-bold">1 Month(s)</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <span class="cpu_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">CPU</span>
                                        </td>
                                        <td>
                                            <div class="text-bold cpu_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="memory_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">RAM</span>
                                        </td>
                                        <td>
                                            <div class="text-bold memory_cost"></div>
                                        </td>
                                    </tr>
                                    <tr v-for="(hd_value, index) in hdValues" :key="index">
                                        <td>
                                            <span class="hd_name">{{ configLi['hd_li'][cpu][hdValue]['drive_type'].toUpperCase() }} - {{ configLi['hd_li'][cpu][hdValue]['short_desc'] }}</span>
                                            <span class="badge badge-pill badge-warning ml-2">HDD</span>
                                        </td>
                                        <td>
                                            <div class="text-bold hd_cost">{{ configLi['hd_li'][cpu][hdValue]['monthly_price_display'] }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="bandwidth_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">Bandwidth</span>
                                        </td>
                                        <td>
                                            <div class="text-bold bandwidth_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="ips_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">IP</span>
                                        </td>
                                        <td>
                                            <div class="text-bold ips_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="os_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">OS</span>
                                        </td>
                                        <td>
                                            <div class="text-bold os_cost"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="cp_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">Control Panel</span>
                                        </td>
                                        <td>
                                            <div class="text-bold cp_cost"></div>
                                        </td>
                                    </tr>
                                    <tr class="d-none raid-row">
                                        <td>
                                            <span class="raid_name"></span>
                                            <span class="badge badge-pill badge-warning ml-2">RAID</span>
                                        </td>
                                        <td class="text-bold raid_cost"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>
                                            <div class="col-md-10 text-lg">Total</div>
                                        </th>
                                        <th>
                                            <div class="text-bold total_cost text-lg"></div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <div class="pb-1 pt-3">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">The subscription will automatically renew after <b>every month at</b> <span class="package_cost text-bold"></span> until canceled.</p>
                                <p class="text-muted text-xs">By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <br /><b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.</p>
                                <p class="icheck-success text-bold text-center">
                                    <input type="checkbox" name="tos" id="tos" style="margin: 0 5px; display: inline" value="yes" />
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </p>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center">
                                    <input type="submit" name="Submit" value="Place Order" class="btn btn-sm btn-green px-3 py-2" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped></style>
