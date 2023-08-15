<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper, ucwords } from '@/helpers';
import { RouterLink, useRoute } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { useVpsStore, useSiteStore } from '@/stores';
import { Backup, Backups, BuyHdSpace, BuyIp, ChangeHostname, ChangeRootPassword, ChangeTimezone, ChangeWebuzoPassword, InsertCd, ReinstallOs, ResetPassword, ReverseDns, Slices, TrafficUsage, Vnc } from '@/views/vps';
import $ from 'jquery';
import Swal from 'sweetalert2';
const vpsStore = useVpsStore();
const { responseText, queueId, loading, error, pkg, linkDisplay, osTemplate, serviceMaster, serviceInfo, serviceAddons, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, serviceType, service_disk_used, service_disk_total, daLink, srLink, cpLink, ppLink, srData, cpData, daData, plesk12Data, token, errors, vps_logs, cpuGraphData, disk_percentage, memory, hdd } = storeToRefs(vpsStore);
const module = 'vps';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const route = useRoute();
const id = route.params.id;
const link = computed(() => { return route.params.link; });
const { modules } = storeToRefs(siteStore);
const settings = computed(() => { return modules.value[module]; });
const webuzoTableExists = computed(() => {
    return typeof extraInfoTables.value.webuzo != 'undefined' && !isEmpty(extraInfoTables.value.webuzo);
});
const addonsTableExists = computed(() => {
    return typeof extraInfoTables.value.addons != 'undefined' && !isEmpty(extraInfoTables.value.addons);
});
const noForm = ['eject_cd', 'disable_cd', 'enable_quota', 'disable_quota', 'stop', 'start', 'restart', 'block_smtp'];

function loadLink(newLink) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums({ '/home': 'Home', '/vps': 'VPS' });
    siteStore.addBreadcrum('/vps/' + id, 'View VPS ' + id);
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading('View VPS ' + id);
        siteStore.setTitle('View VPS ' + id);
    } else {
        siteStore.setPageHeading('VPS ' + id + ' ' + ucwords(newLink.replace('_', ' ')));
        siteStore.setTitle('VPS ' + id + ' ' + ucwords(newLink.replace('_', ' ')));
        siteStore.addBreadcrum('/vps/' + id + '/' + newLink, ucwords(newLink.replace('_', ' ')));
        if (noForm.includes(newLink)) {
            if (vpsStore.queue(id, newLink)) {
                Swal.fire({
                    icon: 'success',
                    html: responseText.value,
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    html: responseText.value,
                });
            }
        }
        if (newLink == 'login') {
            try {
                fetchWrapper
                    .get(`${baseUrl}/vps/${id}/login`)
                    .then((response) => {
                        console.log('login success');
                        console.log(response);
                    });
            } catch (error) {
                console.log('login failed');
                console.log(error);
            }
        }
    }
}

watch(
    () => route.params.link,
    (newLink) => {
        loadLink(newLink);
    }
);

loadLink(route.params.link);
vpsStore.getById(id);


function openCommentForm() {
    $('#commentForm').modal('show');
}

function numberFormat(value, decimals = 2, separator = '.') {
    if (!value) return '0.00';
    const number = parseFloat(value);
    const sign = number < 0 ? '-' : '';
    const strNumber = Math.abs(number).toFixed(decimals);
    const parts = strNumber.split('.');
    const integerPart = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`);
    const decimalPart = parts.length > 1 ? separator + parts[1] : '';
    return `${sign}${integerPart}${decimalPart}`;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDiskClass() {
    if (disk_percentage <= 80) {
        return 'bg-gradient-blue';
    } else if (80 > disk_percentage && disk_percentage <= 90) {
        return 'bg-gradient-yellow';
    } else {
        return 'bg-gradient-red';
    }
}

function isEmpty(table) {
    return table === null || table === undefined || table.rows.length === 0;
}

function docReady() {
    $('[data-toggle="tooltip"]').tooltip();
    const service_id = serviceInfo.value.vps_id;
    $('.img-a').on('click', function () {
        const cp = $(this).attr('data-cp');
        if (cp === 'cp') {
            $('#cp-order-link').attr('href', `view_vps?link=add_control_panel&id=${service_id}&cp=cp`);
            $('#cp-name').text($(this).attr('data-name'));
            $('#cp-cost').text($(this).attr('data-cur-sym') + parseFloat($(this).attr('data-cost') ? $(this).attr('data-cost') : 0).toFixed(2) + ' /mo');
        } else if (cp === 'da') {
            const lic_cost_type = $(this).attr('data-ser');
            $('#cp-order-link').attr('href', `view_vps?link=add_control_panel&id=${service_id}&cp=da&tt=${lic_cost_type}`);
            $('#cp-name').text($(this).attr('data-name'));
            $('#cp-cost').text($(this).attr('data-cur-sym') + parseFloat($(this).attr('data-cost') ? $(this).attr('data-cost') : 0).toFixed(2) + ' /mo');
        } else if (cp === 'pp') {
            $('#cp-order-link').attr('href', `view_vps?link=add_control_panel&id=${service_id}&cp=pp&l_type=${$(this).attr('data-l-type')}`);
            $('#cp-name').text($(this).attr('data-name'));
            $('#cp-cost').text($(this).attr('data-cur-sym') + parseFloat($(this).attr('data-cost') ? $(this).attr('data-cost') : 0).toFixed(2) + ' /mo');
        } else if (cp === 'rs') {
            $('#cp-order-link').attr('href', `view_vps?link=add_control_panel&id=${service_id}&cp=sr`);
            $('#cp-name').text($(this).attr('data-name'));
            $('#cp-cost').text($(this).attr('data-cur-sym') + parseFloat($(this).attr('data-cost') ? $(this).attr('data-cost') : 0).toFixed(2) + ' /mo');
        }
    });
}

function toggleFunc(cp) {
    if (cp === 'cp') {
        $('#warning-text').html('cPanel is not supported by your operating system. To use this control panel you should reinstall <b>"CentOS 7 Cpanel" or "CentOS"</b> operating system.');
    } else if (cp === 'da') {
        $('#warning-text').html('Direct Admin does not support your VPS operating system. To use this control panel you should reinstall <b>"Linux"</b> operating system.');
    } else if (cp === 'pp') {
        $('#warning-text').html('Plesk is not support your VPS operating system. To use this control panel you should reinstall <b>"Windows"</b> operating system.');
    }
    $('.toggleTr').show();
}
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Package</h3>
                    <p class="m-0 py-2">{{ pkg }}</p>
                    <template v-if="billingDetails.service_next_invoice_date">
                        <p>
                            Next Invoice Date:<b>{{ billingDetails.service_next_invoice_date }}</b>
                        </p>
                    </template>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <span class="small-box-footer text-bold">{{ serviceInfo.vps_hostname }}</span>
            </div>
        </div>
        <div class="col-md-4">
            <div
                :class="{
                    'small-box': true,
                    'bg-success': serviceInfo.vps_status === 'active',
                    'bg-warning text-white': serviceInfo.vps_status === 'pending',
                    'bg-danger': serviceInfo.vps_status !== 'active' && serviceInfo.vps_status !== 'pending',
                }">
                <div class="inner px-3 pb-2 pt-3">
                    <h3>Billing</h3>
                    <p class="my-3 py-3">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed
                        <b>{{ billingDetails.service_frequency }}</b>
                        <br />
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <span class="small-box-footer"
                    >VPS Status is: <b>{{ serviceInfo.vps_status }}</b></span
                >
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner px-3 pb-2 pt-3">
                    <h3>
                        Host Server: <b>{{ serviceMaster.vps_name }}</b>
                    </h3>
                    <p class="my-3 py-3">
                        IP is: <b>{{ serviceInfo.vps_ip }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <span class="small-box-footer">
                    Vzid: <b>{{ serviceInfo.vps_vzid }}</b>
                </span>
            </div>
        </div>
    </div>
    <div v-if="link" class="row">
        <div v-if="link == 'backup'" class="col">
            <Backup :id="id" :module="module"></Backup>
        </div>
        <div v-else-if="link == 'backups'" class="col">
            <Backups :id="id" :module="module" :settings="settings"></Backups>
        </div>
        <div v-else-if="link == 'buy_hd_space'" class="col">
            <BuyHdSpace :id="id" :module="module"></BuyHdSpace>
        </div>
        <div v-else-if="link == 'buy_ip'" class="col">
            <BuyIp :id="id" :module="module"></BuyIp>
        </div>
        <div v-else-if="link == 'change_hostname'" class="col">
            <ChangeHostname :id="id" :module="module"></ChangeHostname>
        </div>
        <div v-else-if="link == 'change_root_password'" class="col">
            <ChangeRootPassword :id="id" :module="module"></ChangeRootPassword>
        </div>
        <div v-else-if="link == 'change_timezone'" class="col">
            <ChangeTimezone :id="id" :module="module"></ChangeTimezone>
        </div>
        <div v-else-if="link == 'change_webuzo_password'" class="col">
            <ChangeWebuzoPassword :id="id" :module="module"></ChangeWebuzoPassword>
        </div>
        <div v-else-if="link == 'insert_cd'" class="col">
            <InsertCd :id="id" :module="module"></InsertCd>
        </div>
        <div v-else-if="link == 'reinstall_os'" class="col">
            <ReinstallOs :id="id" :module="module" :settings="settings" :serviceInfo="serviceInfo" :serviceMaster="serviceMaster"></ReinstallOs>
        </div>
        <div v-else-if="link == 'reset_password'" class="col">
            <ResetPassword :id="id" :module="module"></ResetPassword>
        </div>
        <div v-else-if="link == 'reverse_dns'" class="col">
            <ReverseDns :id="id" :module="module"></ReverseDns>
        </div>
        <div v-else-if="link == 'slices'" class="col">
            <Slices :id="id" :module="module"></Slices>
        </div>
        <div v-else-if="link == 'traffic_usage'" class="col">
            <TrafficUsage :id="id" :module="module"></TrafficUsage>
        </div>
        <div v-else-if="link == 'setup_vnc'" class="col">
            <Vnc :id="id" :module="module"></Vnc>
        </div>
        <div v-else class="col" v-html="linkDisplay"></div>
    </div>
    <template v-else>
        <div class="row">
            <div v-if="!linkDisplay || (link && ['cancel', 'welcome_email', 'vnc'].includes(link))" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-server">&nbsp;</i>&nbsp;VPS Information</h3>
                            <div class="card-tools float-right pl-3 pt-1">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="height: 270px">
                        <div class="row">
                            <div class="col-md-12">
                                <h5 class="text-md m-0 p-2 text-center">
                                    Power Status is:
                                    <span
                                        :class="{
                                            'text-success': serviceInfo.vps_server_status === 'running',
                                            'text-warning': serviceInfo.vps_server_status === 'Paused' || serviceInfo.vps_server_status === 'suspended',
                                            'text-danger': serviceInfo.vps_server_status === 'stopped' || serviceInfo.vps_server_status === 'deleted' || serviceInfo.vps_server_status === 'shut',
                                            'text-info': !(serviceInfo.vps_server_status === 'running' || serviceInfo.vps_server_status === 'Paused' || serviceInfo.vps_server_status === 'suspended' || serviceInfo.vps_server_status === 'stopped' || serviceInfo.vps_server_status === 'deleted' || serviceInfo.vps_server_status === 'shut'),
                                        }"
                                        >{{ serviceInfo.vps_server_status }}</span
                                    >
                                </h5>
                            </div>
                            <div class="col-md-12 mr-3 pr-4 pt-2 text-center">
                                <div class="btn-group">
                                    <button
                                        type="button"
                                        :class="{
                                            'btn-success': serviceInfo.vps_server_status === 'running',
                                            'btn-warning': serviceInfo.vps_server_status === 'Paused' || serviceInfo.vps_server_status === 'suspended',
                                            'btn-danger': serviceInfo.vps_server_status === 'stopped' || serviceInfo.vps_server_status === 'deleted' || serviceInfo.vps_server_status === 'shut',
                                            'btn-info': !(serviceInfo.vps_server_status === 'running' || serviceInfo.vps_server_status === 'Paused' || serviceInfo.vps_server_status === 'suspended' || serviceInfo.vps_server_status === 'stopped' || serviceInfo.vps_server_status === 'deleted' || serviceInfo.vps_server_status === 'shut'),
                                        }">
                                        Select Action
                                    </button>
                                    <button
                                        type="button"
                                        :class="{
                                            'btn-success': serviceInfo.vps_server_status === 'running',
                                            'btn-warning': serviceInfo.vps_server_status === 'Paused' || serviceInfo.vps_server_status === 'suspended',
                                            'btn-danger': serviceInfo.vps_server_status === 'stopped' || serviceInfo.vps_server_status === 'deleted' || serviceInfo.vps_server_status === 'shut',
                                            'btn-info': !(serviceInfo.vps_server_status === 'running' || serviceInfo.vps_server_status === 'Paused' || serviceInfo.vps_server_status === 'suspended' || serviceInfo.vps_server_status === 'stopped' || serviceInfo.vps_server_status === 'deleted' || serviceInfo.vps_server_status === 'shut'),
                                        }"
                                        class="dropdown-toggle dropdown-hover dropdown-icon"
                                        data-toggle="dropdown"
                                        aria-expanded="false">
                                        <span class="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <div class="dropdown-menu" role="menu">
                                        <router-link :to="'/vps/' + serviceInfo.vps_id + '/start'" class="dropdown-item">Start</router-link>
                                        <router-link :to="'/vps/' + serviceInfo.vps_id + '/restart'" class="dropdown-item">Restart</router-link>
                                        <router-link :to="'/vps/' + serviceInfo.vps_id + '/stop'" class="dropdown-item">Stop</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 py-2">
                                <span class="info-box-text">
                                    <hr />
                                    <h5 class="mt-5 text-center">
                                        Comment: {{ serviceInfo.vps_comment ? serviceInfo.vps_comment : 'none' }} <span @click="openCommentForm()" title="Edit Comment" style="cursor: pointer"><i class="fa fa-pencil my-2 text-sm"></i></span>
                                    </h5>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="service_disk_total" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-hdd">&nbsp;</i>&nbsp;Disk</h3>
                            <div class="card-tools float-right pl-3 pt-1">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body pt-0" style="height: 270px">
                        <div class="row">
                            <div class="col-md-12 mb-1 py-3">
                                <table class="table-bordered my-3 table">
                                    <tr>
                                        <td class="text-muted text-bold">Total Space:</td>
                                        <td class="text-bold text-capitalize">{{ service_disk_total }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted text-bold">Used Space:</td>
                                        <td class="text-bold text-capitalize">{{ service_disk_used }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted text-bold">Remaining Space:</td>
                                        <td class="text-bold text-capitalize">{{ parseFloat(service_disk_total) - parseFloat(service_disk_used) }} GB</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 75%">
                                            <div id="info-progress-lg" class="progress progress-sm mt-2">
                                                <div class="progress-bar" :class="[getDiskClass()]" :style="{ width: disk_percentage + '%' }"></div>
                                            </div>
                                        </td>
                                        <td class="text-bold text-capitalize text-md" style="vertical-align: middle">{{ disk_percentage }}%</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="osTemplate" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-microchip">&nbsp;</i>&nbsp;System Information</h3>
                            <div class="card-tools float-right pl-3 pt-1">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body pt-0" style="height: 270px">
                        <div class="row">
                            <div class="col-md-12 mb-1 py-3">
                                <table class="table-bordered my-3 table">
                                    <tr class="col">
                                        <td class="text-muted text-bold">Memory:</td>
                                        <td class="text-bold text-capitalize">{{ memory }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted text-bold">Disk Drive:</td>
                                        <td class="text-bold text-capitalize">{{ hdd }}</td>
                                    </tr>
                                    <tr class="col">
                                        <td class="text-muted text-bold">CPU Cores:</td>
                                        <td class="text-bold text-capitalize">{{ serviceInfo.vps_slices }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted text-bold">OS:</td>
                                        <td class="text-bold text-capitalize">{{ osTemplate }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i> Links</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <template v-for="(clientLink, index) in clientLinks">
                            <template v-if="clientLink.label != 'View Desktop'">
                                <router-link :key="index" :to="'/vps/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
                                    <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                                    >{{ clientLink.label }}
                                </router-link>
                            </template>
                        </template>
                        <template v-for="(clientLink, index) in clientLinks">
                            <template v-if="clientLink.label == 'View Desktop'">
                                <button :key="index" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip" @click="openPopUp">
                                    <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                                    >{{ clientLink.label }}
                                </button>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <template v-if="cpLink || daLink || srLink || ppLink">
            <div class="col-md-12 px-0">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-dashboard"></i> &nbsp;Control Panel Add-on</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row toggleTr">
                            <div class="col-md-12">
                                <div class="alert alert-danger">
                                    <strong>Note:</strong>
                                    <span id="warning-text"></span><br />
                                    You can reinstall from left menu
                                    <b>Maintanance -> Re-Install Operating System</b>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col mr-1">
                                <a v-if="cpLink" class="img-a" href="javascript:void(0);" @click="showCPModal">
                                    <div class="row b-radius cp_bg justify-content-center py-1" style="border: 1px solid #ccc">
                                        <div class="col-md-12 mb-1 py-3">
                                            <span class="text-center">
                                                <h5 aria-hidden="true" class="text-bold">cPanel</h5>
                                                <span class="text-sm"
                                                    >Starting From: <b>{{ custCurrencySymbol }}{{ cpData.cost.toFixed(2) }}/mo</b></span
                                                >
                                            </span>
                                        </div>
                                    </div>
                                </a>
                                <a v-else href="javascript:void(0);" class="img-a" @click="toggleCP">
                                    <div class="row b-radius cp_bg justify-content-center py-1" style="border: 1px solid #ccc">
                                        <div class="col-md-12 py-2">
                                            <span class="text-center">
                                                <h5 aria-hidden="true" class="text-bold">cPanel</h5>
                                                <span class="text-sm"
                                                    >Starting From:<b>{{ custCurrencySymbol }}{{ cpData.cost.toFixed(2) }}/mo</b></span
                                                >
                                                <p class="m-0 text-sm"><span style="font-size: 12px" class="text-red text-center">( Not Supported )</span></p>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <template v-if="daLink">
                                <div v-for="(daDetails, index) in daData" :key="index" class="col mr-1">
                                    <a class="img-a" @click="openModal('da', daDetails.cost, daDetails.name, index)" href="javascript:void(0);" data-toggle="modal" data-target="#cpModal">
                                        <div class="row b-radius cp_bg justify-content-center py-1" style="border: 1px solid #ccc">
                                            <div class="col-md-12 pb-2 pt-2">
                                                <span class="text-center">
                                                    <h5 aria-hidden="true" class="text-bold m-0">DirectAdmin</h5>
                                                    <p class="my-1 text-sm">
                                                        ( <span class="font-italic text-center">{{ daDetails.sub_name }}</span
                                                        >)
                                                    </p>
                                                    <span class="text-sm"
                                                        >Starting From:<b>{{ custCurrencySymbol }}{{ daDetails.cost.toFixed(2) }}/mo</b></span
                                                    >
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </template>
                            <template v-else>
                                <div v-for="(daDetails, index) in daData" :key="index" class="col mr-1">
                                    <a class="img-a toggleClass" href="javascript:void(0);" @click="toggleFunc('da')">
                                        <div class="row b-radius cp_bg justify-content-center py-1" style="border: 1px solid #ccc">
                                            <div class="col-md-12 pt-1">
                                                <span class="text-center">
                                                    <h5 aria-hidden="true" class="text-bold m-0">DirectAdmin</h5>
                                                    <p class="m-0 text-sm">
                                                        ( <span class="font-italic text-center">{{ daDetails.sub_name }}</span
                                                        >)
                                                    </p>
                                                    <span class="text-sm"
                                                        >Starting From:<b>{{ custCurrencySymbol }}{{ daDetails.cost.toFixed(2) }}/mo</b></span
                                                    >
                                                    <p class="m-0 text-sm"><span style="font-size: 12px" class="text-red text-center">( Not Supported )</span></p>
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </template>
                            <template v-if="srData">
                                <template v-if="srLink">
                                    <div v-for="(rs_details, index) in srData" :key="index" class="col mr-1">
                                        <a class="img-a" data-cp="rs" :data-cur-sym="custCurrencySymbol" :data-cost="rs_details.cost" :data-name="rs_details.name" :data-ser="index" href="javascript:void(0);" data-toggle="modal" data-target="#cpModal">
                                            <div class="row b-radius cp_bg justify-content-center py-1" style="border: 1px solid #ccc">
                                                <div class="col-md-12 mb-1 py-3">
                                                    <span class="text-center">
                                                        <h5 aria-hidden="true" class="text-bold">Softaculous</h5>
                                                        <span class="text-sm"
                                                            >Starting From:<b>{{ custCurrencySymbol }}{{ rs_details.cost }}/mo</b></span
                                                        >
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </template>
                                <template v-else>
                                    <div v-for="(rs_details, index) in srData" :key="index" class="col mr-1">
                                        <a class="img-a toggleClass" href="javascript:void(0);" @click="toggleFunc('sr')">
                                            <div class="row b-radius cp_bg justify-content-center py-1" style="border: 1px solid #ccc">
                                                <div class="col-md-12 py-2">
                                                    <span class="text-center">
                                                        <h5 aria-hidden="true" class="text-bold">Softaculous</h5>
                                                        <span class="text-sm"
                                                            >Starting From:<b>{{ custCurrencySymbol }}{{ rs_details.cost }}/mo</b></span
                                                        >
                                                        <p class="m-0 text-sm"><span style="font-size: 12px" class="text-red text-center">( Not Supported )</span></p>
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </template>
                            </template>
                            <template v-if="ppLink">
                                <div v-for="(details, type) in plesk12Data" :key="type" class="col mr-1">
                                    <a class="img-a" @click="showModal('pp', custCurrencySymbol, details.cost, details.name, details.id)" href="javascript:void(0);">
                                        <div class="row b-radius cp_bg justify-content-center py-1" style="border: 1px solid #ccc">
                                            <div class="col-md-12 mb-1 py-3">
                                                <span class="text-center">
                                                    <h5 aria-hidden="true" class="text-bold">PLESK {{ details.sub_name }}</h5>
                                                    <span class="text-sm"
                                                        >Starting From:<b>{{ custCurrencySymbol }}{{ details.cost }}/mo</b></span
                                                    >
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </template>
                            <template v-else>
                                <div v-for="(details, type) in plesk12Data" :key="type" class="col mr-1">
                                    <a class="img-a toggleClass" href="javascript:void(0);" @click="toggleFunc('pp')">
                                        <div class="row b-radius cp_bg justify-content-center py-1" style="border: 1px solid #ccc">
                                            <div class="col-md-12 py-2">
                                                <span class="text-center">
                                                    <h5 aria-hidden="true" class="text-bold">PLESK {{ details.sub_name }}</h5>
                                                    <span class="text-sm"
                                                        >Starting From:<b>{{ custCurrencySymbol }}{{ details.cost }}/mo</b></span
                                                    >
                                                    <p class="m-0 text-sm"><span style="font-size: 12px" class="text-red text-center">( Not Supported )</span></p>
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="cpModal" role="dialog">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Order Confirmation</h4>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="$emit('close')">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-offset-2 col-md-4 text-right">
                                    <h5>Package</h5>
                                </div>
                                <div class="col text-left">
                                    <strong>
                                        <h4 id="cp-name">cPanel Autoscale (Internal)</h4>
                                    </strong>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-offset-2 col-md-4 text-right">
                                    <h5>Cost</h5>
                                </div>
                                <div class="col text-left">
                                    <strong>
                                        <h4 id="cp-cost">{{ custCurrencySymbol }}{{ cpData.cost }}/mo</h4>
                                    </strong>
                                </div>
                            </div>
                            <div class="alert alert-warning"><strong>Note:</strong> Control panel needs to be installed on a clean OS install with no modifications. If there is any data it will be lost.</div>
                            <br />
                            <div class="row">
                                <div class="col">
                                    <router-link :to="'/vps/' + serviceInfo.vps_id + '/add/cp'" id="cp-order-link" class="btn btn-primary btn-block">Place Order</router-link>
                                </div>
                            </div>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div v-if="cpuGraphData" class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-chart-bar">&nbsp;</i>CPU Usage</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool" @click="collapsed = !collapsed">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <canvas id="myChart" width="400" height="100"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div v-if="extraInfoTables.cp && extraInfoTables.cp.rows[2].value !== 'canceled'" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h3 v-if="extraInfoTables.cp.rows[0].value === 'cPanel Autoscale Cloud (Internal)'" class="card-title py-1">
                            <i class="fab fa-cpanel text-orange pl-2 text-xl" style="border-radius: 50%; border: 2px solid #ccc">&nbsp;</i>
                            <span style="position: relative; top: -5px">&nbsp;{{ extraInfoTables.cp.title }}</span>
                        </h3>
                        <h3 v-else-if="extraInfoTables.cp.rows[0].value === 'Free DirectAdmin for CentOS 8 64-bit VPS' || extraInfoTables.cp.rows[0].value === 'DirectAdmin for Debian 8.0 64-bit'" class="card-title mt-1 py-2">
                            <b class="text-md px-2 py-1 text-black" style="border-radius: 50%; border: 1px solid #ccc">D A</b>
                            <span>&nbsp;{{ extraInfoTables.cp.title }}</span>
                        </h3>
                        <h3 v-else-if="extraInfoTables.cp.rows[0].value === 'Softaculous Remote'" class="card-title mt-1 py-2">
                            <b class="text-blue text-md font-italic px-3 py-1" style="border-radius: 50%; border: 1px solid #ccc">Soft</b>
                            <span>&nbsp;{{ extraInfoTables.cp.title }}</span>
                        </h3>
                        <h3 v-else class="card-title mt-1 py-2">
                            <b class="text-dark text-md font-italic px-3 py-1" style="border-radius: 50%; border: 1px solid #ccc">Plesk</b>
                            <span>&nbsp;{{ extraInfoTables.cp.title }}</span>
                        </h3>
                        <div class="card-tools float-right pl-3 pt-1">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                <i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body" style="height: 370px">
                        <table class="table-bordered table">
                            <tr v-for="itemvalue in extraInfoTables.cp.rows" :key="itemvalue.desc">
                                <td class="text-muted text-bold text-capitalize">{{ itemvalue.desc }}</td>
                                <td class="text-bold text-capitalize">{{ itemvalue.value }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <template v-if="webuzoTableExists">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fa fa-tachometer-alt">&nbsp;</i>&nbsp;{{ extraInfoTables.webuzo.title }}</h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table-bordered table">
                                <tbody>
                                    <tr v-for="row in extraInfoTables.webuzo.rows" :key="row.desc">
                                        <td class="text-muted text-bold" style="width: 50%">Tickets {{ row.desc }}</td>
                                        <td class="text-muted text-xs">{{ row.value }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="addonsTableExists">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fa fa-plus">&nbsp;</i>{{ extraInfoTables.addons.title }}</h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body" style="height: 370px">
                            <table class="table-bordered table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in extraInfoTables.addons.rows" :key="row.desc">
                                        <td class="text-muted text-bold">{{ row.desc }}</td>
                                        <td class="text-success">{{ row.value }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
            <div v-if="extraInfoTables.note && extraInfoTables.note.rows.length">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fa fa-info-circle text-red">&nbsp;</i>Attention</h3>
                                <div class="card-tools float-right pl-3 pt-1">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body" style="height: 370px">
                            <table class="table-bordered table">
                                <tr>
                                    <td>{{ extraInfoTables.note.rows[0].value }}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="commentForm" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <form class="inline" method="post" @submit.prevent="onSubmit" action="#">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">Update Comment</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="hideModal"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" name="id" :value="serviceInfo.vps_id" />
                            <input type="hidden" name="link" value="update_comment" />
                                <input type="hidden" name="edit_comment" value="2" />
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Comment:</label>
                                <textarea class="form-control" id="message-text" rows="5" name="vps_comment" v-model="serviceInfo.vps_comment"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="hideModal">Close</button>
                            <button type="submit" class="btn btn-primary">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped></style>
