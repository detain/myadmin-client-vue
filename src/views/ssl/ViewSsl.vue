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
layoutStore.setPageHeading('View Ssl');
layoutStore.setBreadcrums({'/home': 'Home', '/ssl': 'SSL'})
layoutStore.addBreadcrum('/ssl/'+id, 'View Ssl '+id);

const settings = ref({
    SERVICE_ID_OFFSET: 10000,
    USE_REPEAT_INVOICE: true,
    USE_PACKAGES: true,
    BILLING_DAYS_OFFSET: 45,
    IMGNAME: "ssl.png",
    REPEAT_BILLING_METHOD: 2,
    DELETE_PENDING_DAYS: 45,
    SUSPEND_DAYS: 14,
    SUSPEND_WARNING_DAYS: 7,
    TITLE: "Ssl Registrations",
    MENUNAME: "SSL",
    EMAIL_FROM: "support@interserver.net",
    TBLNAME: "SSL",
    TABLE: "SSL",
    TITLE_FIELD: "ssl_hostname",
    PREFIX: "ssl"
});
const serviceInfo = ref({
    ssl_id: "592337",
    ssl_hostname: "detain.dev",
    ssl_username: "detaindev",
    ssl_password: "12315688fgfasghs",
    ssl_type: "10673",
    ssl_currency: "USD",
    ssl_expire_date: "2023-08-14 00:59:38",
    ssl_order_date: "2022-08-13 20:58:58",
    ssl_custid: "2773",
    ssl_status: "active",
    ssl_invoice: "19917286",
    ssl_coupon: "0",
    ssl_firstname: "Real",
    ssl_lastname: "Person",
    ssl_email: "realperson@myssl.com",
    ssl_address: "91 Mullberry St.",
    ssl_address2: "",
    ssl_address3: "",
    ssl_city: "Area 51",
    ssl_state: "PA",
    ssl_zip: "00001",
    ssl_country: "US",
    ssl_phone: "8675309",
    ssl_fax: "",
    ssl_company: "InterServer Secaucus",
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
    services_name: ".dev Ssl Name Registration",
    services_cost: "18.00",
    services_category: "100",
    services_ourcost: "15.00",
    services_buyable: "1",
    services_type: "100",
    services_field1: ".dev",
    services_field2: "",
    services_module: "SSL"
});
const errors = ref(false);

const loadSsl = async (id, serviceType, settings, serviceInfo) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/ssl/' + id);
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

loadSsl(id, serviceType, settings, serviceInfo)
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-3">
            <div class="small-box bg-secondary">
                <div class="inner pt-2 pb-1 px-3">
                    <h3>Package</h3>
                    <p class="py-1 m-0 text-bold">{{ pkg }}</p>
                    <p class="m-0">Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b></p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="small-box-footer">{{ serviceInfo.ssl_hostname }}</div>
            </div>
        </div>
        <div class="col-md-3">
            <div :class="'small-box bg-' + serviceStatusColor">
                <div class="inner pt-2 pb-1 px-3">
                    <h3>Billing</h3>
                    <p class="py-1 m-0"><b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed: <b>{{ billingDetails.service_frequency }}</b></p>
                    <p class="m-0">
                        Payment Status:
                        <b>
                            {{ billingDetails.service_payment_status ? billingDetails.service_payment_status : 'Un-Paid' }}
                        </b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <span class="small-box-footer">Status is: <b>{{ serviceStatus }}</b></span>
            </div>
        </div>
        <div class="col-md-3">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Order Info</h3>
                    <p class="py-2 my-2">Order ID: <b>{{ orderId }}</b></p>
                </div>
                <div class="icon">
                    <i class="material-icons" style="user-select:none;">policy</i>
                </div>
                <span class="small-box-footer">Order Status: <b>{{ orderStatus }}</b></span>
            </div>
        </div>
        <div class="col-md-3">
            <div class="small-box bg-purple">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Cert Info</h3>
                    <p class="py-2 my-2">Cert ID: </p>
                </div>
                <div class="icon">
                    <i class="material-icons" style="user-select:none;">admin_panel_settings</i>
                </div>
                <span class="small-box-footer">Cert Status: <b>{{ certStatus }}</b></span>
            </div>
        </div>
    </div>
    <div v-if="link_display" class="row shadow-none">
        <div class="col">{{ link_display }}</div>
    </div>
    <div v-else-if="!link_display || (link_function && ['cancel', 'resend_approver_email', 'reissue_cert'].includes(link_function))" class="row row-flex">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fas fa-link">&nbsp;</i>Links
                        </h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" @click="isCollapsed = !isCollapsed">
                                <i :class="isCollapsed ? 'fas fa-plus' : 'fas fa-minus'"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body" v-show="!isCollapsed">
                    <a v-for="client_link in clientLinks" :key="client_link.link" class="btn btn-app mb-3" :title="client_link.help_text" data-toggle="tooltip" :href="client_link.link" :other_attr="client_link.other_attr">{{ client_link.image }}{{ client_link.label }}</a>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card card-primary-outline">
                <div class="card-header card-primary-outline">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-certificate">&nbsp;</i>SSL Certificates
                        </h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" @click="isCollapsed = !isCollapsed">
                                <i :class="isCollapsed ? 'fas fa-plus' : 'fas fa-minus'"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body" v-show="!isCollapsed">
                    <table class="table table-bordered">
                        <tr>
                            <td>
                                <b>For Certificate Installation Instructions</b>
                            </td>
                            <td>
                                <a href="https://support.globalsign.com/#category_SSL_Installation" target="__blank" class="link">Click Here</a>
                            </td>
                        </tr>
                    </table>
                    <hr>
                    <h3 class="text-muted text-center text-bold">CSR</h3>
                    <blockquote class="quote-secondary h-30">
                        <code style="max-height: 130px;display: inline-block;overflow: scroll;user-select:all;"></code>
                    </blockquote>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>