<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useAuthStore, useAlertStore, useLayoutStore } from '@/stores';

const pkg = ref('');
const link_display = ref(false);
const layoutStore = useLayoutStore();
const route = useRoute();
const id = route.params.id;
layoutStore.setPageHeading('View Qs');
layoutStore.setBreadcrums({'home': 'Home', 'Rapid Deploy Servers': 'Rapid Deploy Servers'})
layoutStore.addBreadcrum('qs/'+id, 'View Qs '+id);

const serviceMaster = ref({});
const serviceOverviewExtra = ref({});
const settings = ref({
    SERVICE_ID_OFFSET: 10000,
    USE_REPEAT_INVOICE: true,
    USE_PACKAGES: true,
    BILLING_DAYS_OFFSET: 45,
    IMGNAME: "qs.png",
    REPEAT_BILLING_METHOD: 2,
    DELETE_PENDING_DAYS: 45,
    SUSPEND_DAYS: 14,
    SUSPEND_WARNING_DAYS: 7,
    TITLE: "Qs Registrations",
    MENUNAME: "Rapid Deploy Servers",
    EMAIL_FROM: "support@interserver.net",
    TBLNAME: "Rapid Deploy Servers",
    TABLE: "Rapid Deploy Servers",
    TITLE_FIELD: "qs_hostname",
    PREFIX: "qs"
});
const serviceInfo = ref({
    qs_id: "592337",
    qs_hostname: "detain.dev",
    qs_username: "detaindev",
    qs_password: "12315688fgfasghs",
    qs_type: "10673",
    qs_currency: "USD",
    qs_expire_date: "2023-08-14 00:59:38",
    qs_order_date: "2022-08-13 20:58:58",
    qs_custid: "2773",
    qs_status: "active",
    qs_invoice: "19917286",
    qs_coupon: "0",
    qs_firstname: "Real",
    qs_lastname: "Person",
    qs_email: "realperson@myqs.com",
    qs_address: "91 Mullberry St.",
    qs_address2: "",
    qs_address3: "",
    qs_city: "Area 51",
    qs_state: "PA",
    qs_zip: "00001",
    qs_country: "US",
    qs_phone: "8675309",
    qs_fax: "",
    qs_company: "InterServer Secaucus",
});
const clientLinks = ref([]);
const billingDetails = ref({
    service_last_invoice_date: "August 13, 2022",
    service_payment_status: "Paid",
    service_frequency: "Yearly",
    next_date: "2023-08-14 00:59:38",
    service_next_invoice_date: "August 14, 2023",
    service_currency: "USD",
    service_currency_symbol: "$",
    service_cost_info: "18.00",
    service_extra: {}
});
const custCurrency = ref("USD");
const custCurrencySymbol = ref("$");
const serviceExtra = ref({});
const extraInfoTables = ref([]);
const serviceType = ref({
    services_id: "10673",
    services_name: ".dev Qs Name Registration",
    services_cost: "18.00",
    services_category: "100",
    services_ourcost: "15.00",
    services_buyable: "1",
    services_type: "100",
    services_field1: ".dev",
    services_field2: "",
    services_module: "Rapid Deploy Servers"
});
const errors = ref(false);

const loadQs = async (id, serviceType, settings, serviceInfo) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/qs/' + id);
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

loadQs(id, serviceType, settings, serviceInfo)

const isCollapsed = ref(false);

const diskPercentage = Math.round((serviceMaster.value.qs_hdfree / serviceMaster.value.qs_hdsize) * 100);
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner pt-2 pb-1 px-3">
                    <h3>Package</h3>
                    <p class="py-1 m-0">{{ pkg }}</p>
                    <p class="m-0">Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b></p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="small-box-footer">
                    <b>{{ serviceInfo.qs_hostname }}</b>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div :class="{
        'small-box': true,
        'bg-success': serviceInfo.vps_status === 'active',
        'bg-warning text-white': serviceInfo.vps_status === 'pending',
        'bg-danger': serviceInfo.vps_status !== 'active' && serviceInfo.vps_status !== 'pending'
      }">
                <div class="inner pt-2 pb-1 px-3">
                    <h3>Billing</h3>
                    <p class="py-1 m-0">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed: <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                    <p class="m-0">Payment Status: <b>{{ billingDetails.service_payment_status }}</b></p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="small-box-footer">
                    Status is: <b>{{ serviceInfo.qs_status }}</b>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Host Server: <b>{{ serviceMaster.qs_name }}</b></h3>
                    <p class="my-2 py-2">IP is: <b>{{ serviceInfo.qs_ip }}</b></p>
                </div>
                <div class="icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="small-box-footer">
                    Vzid: <b>{{ serviceInfo.qs_vzid }}</b>
                </div>
            </div>
        </div>
    </div>
    <template v-if="!link_display || (link_function && ['cancel', 'welcome_email'].includes(link_function))" class="row my-2">
        <div class="row my-2">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-server">&nbsp;</i>&nbsp;QuickServer Information</h3>
                            <div class="card-tools float-right pt-1 pl-3">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="height: 270px;">
                        <div class="row">
                            <div class="col-md-12">
                                <h5 class="text-md m-0 p-2 text-center">
                                    Power Status is:
                                    <span :class="{
                  'text-success': serviceInfo.qs_server_status === 'running',
                  'text-warning': ['Paused', 'suspended'].includes(serviceInfo.qs_server_status),
                  'text-danger': ['stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status),
                  'text-info': !['running', 'Paused', 'suspended', 'stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status)
                }">
                                        {{ serviceInfo.qs_server_status }}
                                    </span>
                                </h5>
                            </div>
                            <div class="col-md-12 text-center pt-2 pr-4 mr-3">
                                <div class="btn-group">
                                    <button type="button" :class="{
                  'btn-success': serviceInfo.qs_server_status === 'running',
                  'btn-warning': ['Paused', 'suspended'].includes(serviceInfo.qs_server_status),
                  'btn-danger': ['stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status),
                  'btn-info': !['running', 'Paused', 'suspended', 'stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status)
                }">Select Action</button>
                                    <button type="button" :class="{
                  'btn-success': serviceInfo.qs_server_status === 'running',
                  'btn-warning': ['Paused', 'suspended'].includes(serviceInfo.qs_server_status),
                  'btn-danger': ['stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status),
                  'btn-info': !['running', 'Paused', 'suspended', 'stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status)
                }" class="dropdown-toggle dropdown-hover dropdown-icon" data-toggle="dropdown">
                                        <span class="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <div class="dropdown-menu" role="menu">
                                        <a class="dropdown-item" :href="`view_qs?id=${serviceInfo.qs_id}&link=queue&action=start`">Start</a>
                                        <a class="dropdown-item" :href="`view_qs?id=${serviceInfo.qs_id}&link=queue&action=restart`">Restart</a>
                                        <a class="dropdown-item" :href="`view_qs?id=${serviceInfo.qs_id}&link=queue&action=stop`">Stop</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 py-2">
                                <span class="info-box-text">
                                    <hr>
                                    <h5 class="text-center mt-5">
                                        Comment:
                                        <span v-if="serviceInfo.qs_comment">{{ serviceInfo.qs_comment }}</span>
                                        <span v-else>none</span>
                                        <span @click="openCommentForm" title="Edit Comment" style="cursor: pointer;"><i class="fa fa-pencil text-sm my-2"></i></span>
                                    </h5>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="serviceDiskTotal" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-hdd">&nbsp;</i>Disk</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" @click="isCollapsed = !isCollapsed">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body pt-0" :style="{ height: '270px' }">
                        <div class="row">
                            <div class="col-md-12 py-3 mb-1">
                                <table class="table table-bordered my-3">
                                    <tr>
                                        <td class="text-muted text-bold">Total Space:</td>
                                        <td class="text-bold text-capitalize">{{ serviceMaster.qs_hdsize }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted text-bold">Free Space:</td>
                                        <td class="text-bold text-capitalize">{{ serviceMaster.qs_hdfree }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted text-bold">Remaining Space:</td>
                                        <td class="text-bold text-capitalize">{{ serviceMaster.qs_hdsize - serviceMaster.qs_hdfree }} GB</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 75%;">
                                            <div id="info-progress-lg" class="progress progress-sm mt-2">
                                                <div class="progress-bar" :class="[
                        { 'bg-gradient-blue': diskPercentage <= 80 },
                        { 'bg-gradient-yellow': 80 > diskPercentage && diskPercentage <= 90 },
                        { 'bg-gradient-red': diskPercentage > 90 },
                      ]" :style="{ width: diskPercentage + '%' }"></div>
                                            </div>
                                        </td>
                                        <td class="text-bold text-capitalize text-md" style="vertical-align: middle;">{{ diskPercentage }}%</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="serviceOverviewExtra" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Connections</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="height: 270px;">
                        <table class="table table-bordered">
                            <tr>
                                <td><b>VNC Info</b></td>
                                <td>
                                    <template v-if="serviceOverviewExtra.vnc_information">
                                        <b class="text-muted">{{ serviceOverviewExtra.vnc_information }}</b>
                                    </template>
                                    <template v-else>
                                        <b class="text-muted font-italic">No data to show</b>
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Spice Info</b></td>
                                <td>
                                    <template v-if="serviceOverviewExtra.spice_information">
                                        <b class="text-muted">{{ serviceOverviewExtra.spice_information }}</b>
                                    </template>
                                    <template v-else>
                                        <b class="text-muted font-italic">No data to show</b>
                                    </template>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="osTemplate" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-microchip">&nbsp;</i>System Information
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="height:270px;">
                        <table class="table table-bordered">
                            <tr>
                                <td><b>OS</b></td>
                                <td><b class="text-muted">{{ osTemplate }}</b></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fas fa-link">&nbsp;</i>Links
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <template v-for="client_link in clientLinks">
                        <a :key="client_link.label" class="btn btn-app mb-3" :title="client_link.help_text" data-toggle="tooltip" :href="client_link.link" v-if="client_link.label">
                            <img :src="client_link.image" alt="">
                            {{ client_link.label }}
                        </a>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <template v-if="extraInfoTables.ip_info">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fa fa-map-marker-alt">&nbsp;</i>IP Information</h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table table-bordered">
                                <template v-for="itemvalue in extraInfoTables.ip_info.rows">
                                    <tr>
                                        <td><b>{{ itemvalue.desc }}</b></td>
                                        <td><b class="text-muted">{{ itemvalue.value }}</b></td>
                                    </tr>
                                </template>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="extraInfoTables.cp">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fa fa-tachometer-alt">&nbsp;</i>{{ extraInfoTables.cp.title }}</h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table table-bordered">
                                <template v-for="itemvalue in extraInfoTables.cp.rows">
                                    <tr>
                                        <td><b>{{ itemvalue.desc }}</b></td>
                                        <td><b class="text-muted">{{ itemvalue.value }}</b></td>
                                    </tr>
                                </template>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
            <div v-if="extraInfoTables.addons" class="col-md-3">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-plus">&nbsp;</i>
                                {{ extraInfoTables.addons.title }}
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered">
                            <tr v-for="itemvalue in extraInfoTables.addons.rows">
                                <td><b>{{ itemvalue.desc }}</b></td>
                                <td><b class="text-muted">{{ itemvalue.value }}</b></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="extraInfoTables.note" class="col-md-5">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-exclamation">&nbsp;</i>
                                {{ extraInfoTables.note.title }}
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered">{{ extraInfoTables.note.rows[0].value }}</table>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="commentForm" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <form class="inline" @submit.prevent="submitComment">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">Update Comment</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" name="id" :value="serviceInfo.qs_id">
                            <input type="hidden" name="link" value="update_comment">
                            <input type="hidden" name="csrf_token" :value="csrf">
                            <input type="hidden" name="edit_comment" value="2">
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Comment:</label>
                                <textarea class="form-control" id="message-text" rows="5" name="comment" v-model="comment"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeModal">Close</button>
                            <button type="submit" class="btn btn-primary">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped>
</style>