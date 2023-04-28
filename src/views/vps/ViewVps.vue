<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useAuthStore, useAlertStore, useLayoutStore } from '@/stores';
import $ from 'jquery';

const pkg = ref('');
const link_display = ref(false);
const layoutStore = useLayoutStore();
const route = useRoute();
const id = route.params.id;
layoutStore.setPageHeading('View VPS');
layoutStore.setBreadcrums({'home': 'Home', 'domains': 'VPS'})
layoutStore.addBreadcrum('vps/'+id, 'View VPS '+id);

const serviceMaster = ref({});
const settings = ref({
    SERVICE_ID_OFFSET: 10000,
    USE_REPEAT_INVOICE: true,
    USE_PACKAGES: true,
    BILLING_DAYS_OFFSET: 45,
    IMGNAME: "domain.png",
    REPEAT_BILLING_METHOD: 2,
    DELETE_PENDING_DAYS: 45,
    SUSPEND_DAYS: 14,
    SUSPEND_WARNING_DAYS: 7,
    TITLE: "Domain Registrations",
    MENUNAME: "Domains",
    EMAIL_FROM: "support@interserver.net",
    TBLNAME: "Domains",
    TABLE: "domains",
    TITLE_FIELD: "vps_hostname",
    PREFIX: "domain"
});
const serviceInfo = ref({
    vps_id: "592337",
    vps_hostname: "detain.dev",
    vps_username: "detaindev",
    vps_password: "12315688fgfasghs",
    vps_type: "10673",
    vps_currency: "USD",
    vps_expire_date: "2023-08-14 00:59:38",
    vps_order_date: "2022-08-13 20:58:58",
    vps_custid: "2773",
    vps_status: "active",
    vps_invoice: "19917286",
    vps_coupon: "0",
    vps_firstname: "Real",
    vps_lastname: "Person",
    vps_email: "realperson@mydomain.com",
    vps_address: "91 Mullberry St.",
    vps_address2: "",
    vps_address3: "",
    vps_city: "Area 51",
    vps_state: "PA",
    vps_zip: "00001",
    vps_country: "US",
    vps_phone: "8675309",
    vps_fax: "",
    vps_company: "InterServer Secaucus",
});
const clientLinks = ref([
    {
        label: "Invoices",
        link: "view_domain?id=592337&link=invoices",
        image: '<i class="fas fa-file-invoice-dollar fa-w-12"></i>',
        help_text: "Invoice History"
    },
    {
        label: "Cancel Domains",
        link: "view_domain?id=592337&link=cancel",
        image: '<i class="fas fa-times"></i>',
        help_text: "Cancel Domains"
    },
    {
        label: "Renew",
        link: "view_domain?id=592337&link=renew",
        image: '<i class="fa fa-hourglass"></i>',
        help_text: "Renew Domain"
    },
    {
        label: "DNSSEC",
        link: "view_domain?id=592337&link=dnssec",
        image: '<i class="fa fa-lock"></i>',
        help_text: "DNS Security Details"
    },
    {
        label: "Email EPP Code",
        link: "view_domain?id=592337&link=authepp",
        image: '<i class="fa fa-envelope"></i>',
        help_text: "Email Auth/EPP Code"
    },
    {
        label: "Lock / Unlock",
        link: "view_domain?id=592337&link=lock",
        image: '<i class="fa fa-lock"></i>',
        help_text: "Lock / Unlock Domain"
    }
]);
const billingDetails = ref({
    service_last_invoice_date: "August 13, 2022",
    service_payment_status: "Paid",
    service_frequency: "Yearly",
    next_date: "2023-08-14 00:59:38",
    service_next_invoice_date: "August 14, 2023",
    service_currency: "USD",
    service_currency_symbol: "$",
    service_cost_info: "18.00",
    service_extra: {
        order: {
            _OPS_version: "0.9",
            protocol: "XCP",
            is_success: "1",
            action: "REPLY",
            attributes: { id: "311873405", admin_email: "realperson@mydomain.com" },
            response_text: "Order created",
            object: "DOMAIN",
            response_code: "200"
        },
        order_id: "311873405",
        vps_id: "65006148",
        provProcessPending: {
            _OPS_version: "0.9",
            response_text: "Domain registration successfully completed.",
            protocol: "XCP",
            response_code: "200",
            action: "REPLY",
            object: "DOMAIN",
            is_success: "1",
            attributes: {
                id: "65006148",
                order_id: "311873405",
                "registration expiration date": "2023-08-14 00:59:38",
                f_auto_renew: "N"
            }
        },
        email: "realperson@mydomain.com",
        firstname: "Real",
        lastname: "Person",
        company: "InterServer Secaucus",
        address: "91 Mullberry St.",
        address2: "",
        address3: "",
        city: "Area 51",
        state: "PA",
        zip: "00001",
        country: "US",
        phone: "8675309",
        fax: ""
    }
});
const custCurrency = ref("USD");
const custCurrencySymbol = ref("$");
const serviceExtra = ref({});
const extraInfoTables = ref([]);
const serviceType = ref({
    services_id: "10673",
    services_name: ".dev Domain Name Registration",
    services_cost: "18.00",
    services_category: "100",
    services_ourcost: "15.00",
    services_buyable: "1",
    services_type: "100",
    services_field1: ".dev",
    services_field2: "",
    services_module: "domains"
});
const errors = ref(false);
const vps_logs = ref([]);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDiskClass() {
  if (this.disk_percentage <= 80) {
    return 'bg-gradient-blue';
  } else if (80 > this.disk_percentage && this.disk_percentage <= 90) {
    return 'bg-gradient-yellow';
  } else {
    return 'bg-gradient-red';
  }
}

const openCommentForm = () => {
    $('#commentForm').modal('show');
};

const numberFormat = (value, decimals = 2, separator = '.') => {
  if (!value) return '0.00';
  const number = parseFloat(value);
  const sign = number < 0 ? '-' : '';
  const strNumber = Math.abs(number).toFixed(decimals);
  const parts = strNumber.split('.');
  const integerPart = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`);
  const decimalPart = parts.length > 1 ? separator + parts[1] : '';
  return `${sign}${integerPart}${decimalPart}`;
};

const webuzoTableExists = computed(() => {
  return (
    extraInfoTables.hasOwnProperty('webuzo') &&
    !isEmpty(extraInfoTables.webuzo)
  );
});

const addonsTableExists = computed(() => {
  return (
    extraInfoTables.hasOwnProperty('addons') &&
    !isEmpty(extraInfoTables.addons)
  );
});

function isEmpty(table) {
  return table === null || table === undefined || table.rows.length === 0;
}

function docReady() {
  $('[data-toggle="tooltip"]').tooltip();
  const service_id = serviceInfo.value.vps_id;
  $('.img-a').on('click', function () {
    const cp = $(this).attr('data-cp');
    if (cp === 'cp') {
      $("#cp-order-link").attr('href', `view_vps?link=add_control_panel&id=${service_id}&cp=cp`);
      $("#cp-name").text($(this).attr('data-name'));
      $("#cp-cost").text($(this).attr('data-cur-sym') + parseFloat($(this).attr('data-cost')).toFixed(2) + ' /mo');
    } else if (cp === 'da') {
      const lic_cost_type = $(this).attr('data-ser');
      $("#cp-order-link").attr('href', `view_vps?link=add_control_panel&id=${service_id}&cp=da&tt=${lic_cost_type}`);
      $("#cp-name").text($(this).attr('data-name'));
      $("#cp-cost").text($(this).attr('data-cur-sym') + parseFloat($(this).attr('data-cost')).toFixed(2) + ' /mo');
    } else if (cp === 'pp') {
      $("#cp-order-link").attr('href', `view_vps?link=add_control_panel&id=${service_id}&cp=pp&l_type=${$(this).attr('data-l-type')}`);
      $("#cp-name").text($(this).attr('data-name'));
      $("#cp-cost").text($(this).attr('data-cur-sym') + parseFloat($(this).attr('data-cost')).toFixed(2) + ' /mo');
    } else if (cp === 'rs') {
      $("#cp-order-link").attr('href', `view_vps?link=add_control_panel&id=${service_id}&cp=sr`);
      $("#cp-name").text($(this).attr('data-name'));
      $("#cp-cost").text($(this).attr('data-cur-sym') + parseFloat($(this).attr('data-cost')).toFixed(2) + ' /mo');
    }
  });
}

function toggleFunc(cp) {
  if (cp === 'cp') {
    $("#warning-text").html("cPanel is not supported by your operating system. To use this control panel you should reinstall <b>\"CentOS 7 Cpanel\" or \"CentOS\"</b> operating system.");
  } else if (cp === 'da') {
    $("#warning-text").html("Direct Admin does not support your VPS operating system. To use this control panel you should reinstall <b>\"Linux\"</b> operating system.");
  } else if (cp === 'pp') {
    $("#warning-text").html("Plesk is not support your VPS operating system. To use this control panel you should reinstall <b>\"Windows\"</b> operating system.");
  }
  $(".toggleTr").show();
}

const loadVps = async (id, serviceType, settings, serviceInfo) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/vps/' + id);
        console.log('api success');
        console.log(response);
        serviceType.value = response.serviceType;
        serviceInfo.value = response.serviceInfo;
        settings.value = response.settings;
    } catch (error) {
        console.log('api failed');
        console.log(error);
    }
};

loadVps(id, serviceType, settings, serviceInfo)
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Package</h3>
                    <p class="py-2 m-0">{{ pkg }}</p>
                    <template v-if="billingDetails.service_next_invoice_date">
                        <p>Next Invoice Date:
                            <b>{{ billingDetails.service_next_invoice_date }}</b>
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
            <div :class="{
        'small-box': true,
        'bg-success': serviceInfo.vps_status === 'active',
        'bg-warning text-white': serviceInfo.vps_status === 'pending',
        'bg-danger': serviceInfo.vps_status !== 'active' && serviceInfo.vps_status !== 'pending'
      }">
                <div class="inner pt-3 pb-2 px-3">
                    <h3>Billing</h3>
                    <p class="py-3 my-3">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed
                        <b>{{ billingDetails.service_frequency }}</b><br>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <span class="small-box-footer">VPS Status is:
                    <b>{{ serviceInfo.vps_status }}</b></span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-2 px-3">
                    <h3>Host Server: <b>{{ serviceMaster.vps_name }}</b></h3>
                    <p class="py-3 my-3">
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
    <div v-if="link_display" class="row">
        <div class="col">
            {{ link_display }}
        </div>
    </div>
    <template v-else>
        <div class="row">
            <div v-if="!link_display || (link_function && ['cancel', 'welcome_email', 'vnc'].includes(link_function))" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-server">&nbsp;</i>&nbsp;VPS Information</h3>
                            <div class="card-tools float-right pt-1 pl-3">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="height: 270px;">
                        <div class="row">
                            <div class="col-md-12">
                                <h5 class="text-md m-0 p-2 text-center">
                                    Power Status is:
                                    <span :class="{
              'text-success': serviceInfo.vps_server_status === 'running',
              'text-warning':
                serviceInfo.vps_server_status === 'Paused' ||
                serviceInfo.vps_server_status === 'suspended',
              'text-danger':
                serviceInfo.vps_server_status === 'stopped' ||
                serviceInfo.vps_server_status === 'deleted' ||
                serviceInfo.vps_server_status === 'shut',
              'text-info': !(
                serviceInfo.vps_server_status === 'running' ||
                serviceInfo.vps_server_status === 'Paused' ||
                serviceInfo.vps_server_status === 'suspended' ||
                serviceInfo.vps_server_status === 'stopped' ||
                serviceInfo.vps_server_status === 'deleted' ||
                serviceInfo.vps_server_status === 'shut'
              )
            }">{{ serviceInfo.vps_server_status }}</span>
                                </h5>
                            </div>
                            <div class="col-md-12 text-center pt-2 pr-4 mr-3">
                                <div class="btn-group">
                                    <button type="button" :class="{
              'btn-success': serviceInfo.vps_server_status === 'running',
              'btn-warning':
                serviceInfo.vps_server_status === 'Paused' ||
                serviceInfo.vps_server_status === 'suspended',
              'btn-danger':
                serviceInfo.vps_server_status === 'stopped' ||
                serviceInfo.vps_server_status === 'deleted' ||
                serviceInfo.vps_server_status === 'shut',
              'btn-info': !(
                serviceInfo.vps_server_status === 'running' ||
                serviceInfo.vps_server_status === 'Paused' ||
                serviceInfo.vps_server_status === 'suspended' ||
                serviceInfo.vps_server_status === 'stopped' ||
                serviceInfo.vps_server_status === 'deleted' ||
                serviceInfo.vps_server_status === 'shut'
              )
            }">Select Action</button>
                                    <button type="button" :class="{
              'btn-success': serviceInfo.vps_server_status === 'running',
              'btn-warning':
                serviceInfo.vps_server_status === 'Paused' ||
                serviceInfo.vps_server_status === 'suspended',
              'btn-danger':
                serviceInfo.vps_server_status === 'stopped' ||
                serviceInfo.vps_server_status === 'deleted' ||
                serviceInfo.vps_server_status === 'shut',
              'btn-info': !(
                serviceInfo.vps_server_status === 'running' ||
                serviceInfo.vps_server_status === 'Paused' ||
                serviceInfo.vps_server_status === 'suspended' ||
                serviceInfo.vps_server_status === 'stopped' ||
                serviceInfo.vps_server_status === 'deleted' ||
                serviceInfo.vps_server_status === 'shut'
              )
            }" class="dropdown-toggle dropdown-hover dropdown-icon" data-toggle="dropdown">
                                        <span class="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <div class="dropdown-menu" role="menu">
                                        <a class="dropdown-item" :href="'view_vps?id=' + serviceInfo.vps_id + '&link=queue&action=start'">Start</a>
                                        <a class="dropdown-item" :href="'view_vps?id=' + serviceInfo.vps_id + '&link=queue&action=restart'">Restart</a>
                                        <a class="dropdown-item" :href="'view_vps?id=' + serviceInfo.vps_id + '&link=queue&action=stop'">Stop</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 py-2">
                                <span class="info-box-text">
                                    <hr>
                                    <h5 class="text-center mt-5">Comment: {{ serviceInfo.vps_comment ? serviceInfo.vps_comment : 'none' }} <span @click="openCommentForm()" title="Edit Comment" style="cursor: pointer;"><i class="fa fa-pencil text-sm my-2"></i></span></h5>
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
                            <div class="card-tools float-right pt-1 pl-3">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body pt-0" style="height: 270px;">
                        <div class="row">
                            <div class="col-md-12 py-3 mb-1">
                                <table class="table table-bordered my-3">
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
                                        <td class="text-bold text-capitalize">
                                            {{ parseFloat(service_disk_total) - parseFloat(service_disk_used) }} GB
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width: 75%;">
                                            <div id="info-progress-lg" class="progress progress-sm mt-2">
                                                <div class="progress-bar" :class="[getDiskClass()]" :style="{ width: disk_percentage + '%' }"></div>
                                            </div>
                                        </td>
                                        <td class="text-bold text-capitalize text-md" style="vertical-align: middle;">
                                            {{ disk_percentage }}%
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="osTemplate">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-microchip">&nbsp;</i>&nbsp;System Information</h3>
                            <div class="card-tools float-right pt-1 pl-3">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body pt-0" style="height: 270px;">
                        <div class="row">
                            <div class="col-md-12 py-3 mb-1">
                                <table class="table table-bordered my-3">
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
                        <div v-for="client_link in clientLinks" :key="client_link.link">
                            <template v-if="client_link.label != 'View Desktop'">
                                <a class="btn btn-app mb-3" :title="client_link.help_text" data-toggle="tooltip" :href="client_link.link" v-bind="client_link.other_attr">{{ client_link.image }}{{ client_link.label }}</a>
                            </template>
                            <template v-else>
                                <button class="btn btn-app mb-3" :title="client_link.help_text" data-toggle="tooltip" v-bind="client_link.other_attr" @click="openPopUp">{{ client_link.image }}{{ client_link.label }}</button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

    <template v-if="!link_display || (link_function && ['cancel', 'welcome_email', 'vnc'].includes(link_function))">
        <template v-if="cp_link || da_link || sr_link || pp_link">
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
                                    <span id="warning-text"></span><br>
                                    You can reinstall from left menu
                                    <b>Maintanance -> Re-Install Operating System</b>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col mr-1">
                                <a v-if="cp_link" class="img-a" href="javascript:void(0);" @click="showCPModal">
                                    <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                                        <div class="col-md-12 py-3 mb-1">
                                            <span class="text-center">
                                                <h5 aria-hidden="true" class="text-bold">cPanel</h5>
                                                <span class="text-sm">Starting From: <b>{{ custCurrencySymbol }}{{ cp_data.cost.toFixed(2) }}/mo</b></span>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                                <a v-else href="javascript:void(0);" class="img-a" @click="toggleCP">
                                    <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                                        <div class="col-md-12 py-2">
                                            <span class="text-center">
                                                <h5 aria-hidden="true" class="text-bold">cPanel</h5>
                                                <span class="text-sm">Starting From:<b>{{ custCurrencySymbol }}{{ cp_data.cost.toFixed(2) }}/mo</b></span>
                                                <p class="text-sm m-0"><span style="font-size: 12px;" class="text-red text-center">( Not Supported )</span></p>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <template v-if="daLink">
                                <div v-for="(daDetails, index) in daData" :key="index" class="col mr-1">
                                    <a class="img-a" @click="openModal('da', daDetails.cost, daDetails.name, index)" href="javascript:void(0);" data-toggle="modal" data-target="#cpModal">
                                        <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                                            <div class="col-md-12 pb-2 pt-2">
                                                <span class="text-center">
                                                    <h5 aria-hidden="true" class="text-bold m-0">DirectAdmin</h5>
                                                    <p class="text-sm my-1">( <span class="text-center font-italic">{{ daDetails.sub_name }}</span>)</p>
                                                    <span class="text-sm">Starting From:<b>{{ custCurrencySymbol }}{{ daDetails.cost.toFixed(2) }}/mo</b></span>
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </template>
                            <template v-else>
                                <div v-for="(daDetails, index) in daData" :key="index" class="col mr-1">
                                    <a class="img-a toggleClass" href="javascript:void(0);" @click="toggleFunc('da')">
                                        <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                                            <div class="col-md-12 pt-1">
                                                <span class="text-center">
                                                    <h5 aria-hidden="true" class="text-bold m-0">DirectAdmin</h5>
                                                    <p class="text-sm m-0">( <span class="text-center font-italic">{{ daDetails.sub_name }}</span>)</p>
                                                    <span class="text-sm">Starting From:<b>{{ custCurrencySymbol }}{{ daDetails.cost.toFixed(2) }}/mo</b></span>
                                                    <p class="text-sm m-0"><span style="font-size: 12px;" class="text-red text-center">( Not Supported )</span></p>
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </template>
                            <template v-if="sr_data">
                                <template v-if="sr_link">
                                    <div v-for="(rs_details, index) in sr_data" :key="index" class="col mr-1">
                                        <a class="img-a" data-cp="rs" :data-cur-sym="custCurrencySymbol" :data-cost="rs_details.cost" :data-name="rs_details.name" :data-ser="index" href="javascript:void(0);" data-toggle="modal" data-target="#cpModal">
                                            <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                                                <div class="col-md-12 py-3 mb-1">
                                                    <span class="text-center">
                                                        <h5 aria-hidden="true" class="text-bold">Softaculous</h5>
                                                        <span class="text-sm">Starting From:<b>{{ custCurrencySymbol }}{{ rs_details.cost }}/mo</b></span>
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </template>
                                <template v-else>
                                    <div v-for="(rs_details, index) in sr_data" :key="index" class="col mr-1">
                                        <a class="img-a toggleClass" href="javascript:void(0);" @click="toggleFunc('sr')">
                                            <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                                                <div class="col-md-12 py-2">
                                                    <span class="text-center">
                                                        <h5 aria-hidden="true" class="text-bold">Softaculous</h5>
                                                        <span class="text-sm">Starting From:<b>{{ custCurrencySymbol }}{{ rs_details.cost }}/mo</b></span>
                                                        <p class="text-sm m-0"><span style="font-size: 12px;" class="text-red text-center">( Not Supported )</span></p>
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
                                        <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                                            <div class="col-md-12 py-3 mb-1">
                                                <span class="text-center">
                                                    <h5 aria-hidden="true" class="text-bold">PLESK {{ details.sub_name }}</h5>
                                                    <span class="text-sm">Starting From:<b>{{ custCurrencySymbol }}{{ details.cost | numberFormat(2) }}/mo</b></span>
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </template>
                            <template v-else>
                                <div v-for="(details, type) in plesk12Data" :key="type" class="col mr-1">
                                    <a class="img-a toggleClass" href="javascript:void(0);" @click="toggleFunc('pp');">
                                        <div class="row b-radius cp_bg py-1 justify-content-center" style="border: 1px solid #ccc;">
                                            <div class="col-md-12 py-2">
                                                <span class="text-center">
                                                    <h5 aria-hidden="true" class="text-bold">PLESK {{ details.sub_name }}</h5>
                                                    <span class="text-sm">Starting From:<b>{{ custCurrencySymbol }}{{ details.cost | numberFormat(2) }}/mo</b></span>
                                                    <p class="text-sm m-0"><span style="font-size: 12px;" class="text-red text-center">( Not Supported )</span></p>
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
                                <div class="col text-left"><strong>
                                        <h4 id="cp-name">{{ packageName }}</h4>
                                    </strong></div>
                            </div>
                            <div class="row">
                                <div class="col-md-offset-2 col-md-4 text-right">
                                    <h5>Cost</h5>
                                </div>
                                <div class="col text-left"><strong>
                                        <h4 id="cp-cost">{{ formattedCost }}/mo</h4>
                                    </strong></div>
                            </div>
                            <div class="alert alert-warning">
                                <strong>Note:</strong> Control panel needs to be installed on a clean OS install with no modifications. If there is any data it will be lost.
                            </div>
                            <br>
                            <div class="row">
                                <div class="col">
                                    <a id="cp-order-link" class="btn btn-primary btn-block" :href="orderLink">Place Order</a>
                                </div>
                            </div>
                            <br>
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
                            <i class="fab fa-cpanel text-orange pl-2 text-xl" style="border-radius: 50%;border: 2px solid #ccc;">&nbsp;</i>
                            <span style="position: relative;top: -5px;">&nbsp;{{extraInfoTables.cp.title}}</span>
                        </h3>
                        <h3 v-else-if="extraInfoTables.cp.rows[0].value === 'Free DirectAdmin for CentOS 8 64-bit VPS' || extraInfoTables.cp.rows[0].value === 'DirectAdmin for Debian 8.0 64-bit'" class="card-title py-2 mt-1">
                            <b class="text-black text-md px-2 py-1" style="border-radius: 50%;border: 1px solid #ccc;">D A</b>
                            <span>&nbsp;{{extraInfoTables.cp.title}}</span>
                        </h3>
                        <h3 v-else-if="extraInfoTables.cp.rows[0].value === 'Softaculous Remote'" class="card-title py-2 mt-1">
                            <b class="text-blue text-md px-3 py-1 font-italic" style="border-radius: 50%;border: 1px solid #ccc;">Soft</b>
                            <span>&nbsp;{{extraInfoTables.cp.title}}</span>
                        </h3>
                        <h3 v-else class="card-title py-2 mt-1">
                            <b class="text-dark text-md px-3 py-1 font-italic" style="border-radius: 50%;border: 1px solid #ccc;">Plesk</b>
                            <span>&nbsp;{{extraInfoTables.cp.title}}</span>
                        </h3>
                        <div class="card-tools float-right pt-1 pl-3">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                <i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body" style="height: 370px;">
                        <table class="table table-bordered">
                            <tr v-for="itemvalue in extraInfoTables.cp.rows" :key="itemvalue.desc">
                                <td class="text-muted text-bold text-capitalize">{{itemvalue.desc}}</td>
                                <td class="text-bold text-capitalize">{{itemvalue.value}}</td>
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
                                <h3 class="card-title py-2">
                                    <i class="fa fa-tachometer-alt">&nbsp;</i>&nbsp;{{extraInfoTables.webuzo.title}}
                                </h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table table-bordered">
                                <tbody>
                                    <tr v-for="row in extraInfoTables.webuzo.rows" :key="row.desc">
                                        <td class="text-muted text-bold" style="width: 50%;">Tickets {{row.desc}}</td>
                                        <td class="text-muted text-xs">{{row.value}}</td>
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
                                <h3 class="card-title py-2">
                                    <i class="fa fa-plus">&nbsp;</i>{{extraInfoTables.addons.title}}
                                </h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body" style="height: 370px;">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in extraInfoTables.addons.rows" :key="row.desc">
                                        <td class="text-muted text-bold">{{row.desc}}</td>
                                        <td class="text-success">{{row.value}}</td>
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
                                <div class="card-tools float-right pt-1 pl-3">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body" style="height: 370px;">
                            <table class="table table-bordered">
                                <tr>
                                    <td>{{extraInfoTables.note.rows[0].value}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </template>
    <div class="modal fade" id="commentForm" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <form class="inline" method="post" @submit.prevent="onSubmit" action="#">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalCenterTitle">Update Comment</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="hideModal"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="id" :value="serviceInfo.vps_id">
                        <input type="hidden" name="link" value="update_comment">
                        <input type="hidden" name="csrf_token" :value="csrf">
                        <input type="hidden" name="edit_comment" value="2">
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

<style scoped>
</style>