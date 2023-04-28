<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useAuthStore, useAlertStore, useLayoutStore } from '@/stores';

const link_display = ref(false);
const pkg = ref('');
const layoutStore = useLayoutStore();
const route = useRoute();
const id = route.params.id;
layoutStore.setPageHeading('View License');
layoutStore.setBreadcrums({'home': 'Home', 'Licenses': 'Licenses'})
layoutStore.addBreadcrum('license/'+id, 'View License '+id);

const serviceOverviewExtra = ref({});
const settings = ref({
    SERVICE_ID_OFFSET: 10000,
    USE_REPEAT_INVOICE: true,
    USE_PACKAGES: true,
    BILLING_DAYS_OFFSET: 45,
    IMGNAME: "license.png",
    REPEAT_BILLING_METHOD: 2,
    DELETE_PENDING_DAYS: 45,
    SUSPEND_DAYS: 14,
    SUSPEND_WARNING_DAYS: 7,
    TITLE: "License Registrations",
    MENUNAME: "Licenses",
    EMAIL_FROM: "support@interserver.net",
    TBLNAME: "Licenses",
    TABLE: "Licenses",
    TITLE_FIELD: "license_hostname",
    PREFIX: "license"
});
const serviceInfo = ref({
    license_id: "592337",
    license_hostname: "detain.dev",
    license_username: "detaindev",
    license_password: "12315688fgfasghs",
    license_type: "10673",
    license_currency: "USD",
    license_expire_date: "2023-08-14 00:59:38",
    license_order_date: "2022-08-13 20:58:58",
    license_custid: "2773",
    license_status: "active",
    license_invoice: "19917286",
    license_coupon: "0",
    license_firstname: "Real",
    license_lastname: "Person",
    license_email: "realperson@mylicense.com",
    license_address: "91 Mullberry St.",
    license_address2: "",
    license_address3: "",
    license_city: "Area 51",
    license_state: "PA",
    license_zip: "00001",
    license_country: "US",
    license_phone: "8675309",
    license_fax: "",
    license_company: "InterServer Secaucus",
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
    services_name: ".dev License Name Registration",
    services_cost: "18.00",
    services_category: "100",
    services_ourcost: "15.00",
    services_buyable: "1",
    services_type: "100",
    services_field1: ".dev",
    services_field2: "",
    services_module: "Licenses"
});
const errors = ref(false);

const loadLicense = async (id, serviceType, settings, serviceInfo) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/license/' + id);
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

loadLicense(id, serviceType, settings, serviceInfo)
</script>

<template>
    <div class="row mt-2">
        <div :class="`col-md-${serviceOverviewExtra ? '3' : '4'}`">
            <div class="small-box bg-secondary">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Package</h3>
                    <p class="py-1 my-2">{{ pkg }}</p>
                    <p class="m-0">
                        Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="small-box-footer">
                    <b>{{ serviceInfo[settings.TITLE_FIELD] }}</b>
                </div>
            </div>
        </div>
        <div class="col-md-{{ serviceOverviewExtra ? '3' : '4' }}">
            <div :class="[
        'small-box',
        serviceInfo[`${settings.PREFIX}_status`] === 'active' ? 'bg-success' : '',
        serviceInfo[`${settings.PREFIX}_status`] === 'pending' ? 'bg-orange' : '',
        serviceInfo[`${settings.PREFIX}_status`] === 'expired' || serviceInfo[`${settings.PREFIX}_status`] === 'canceled' ? 'bg-red' : ''
      ]">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Billing</h3>
                    <p class="py-3 my-2">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed: <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="small-box-footer">
                    Status is: <b>{{ serviceInfo.license_status }}</b>
                </div>
            </div>
        </div>
        <div class="col-md-{{ serviceOverviewExtra ? '3' : '4' }}">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>License Info</h3>
                    <template v-if="serviceInfo.license_hostname">
                        <p class="{{ serviceOverviewExtra ? 'mt-0' : 'py-3 my-2' }}">
                            Hostname is:<br />
                            <b>{{ serviceInfo.license_hostname }}</b>
                        </p>
                    </template>
                    <template v-if="serviceExtra && serviceType.services_category === '507'">
                        <p>
                            Activation Key: <b>{{ serviceExtra[1] }}</b>
                        </p>
                    </template>
                </div>
                <div class="icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="small-box-footer">
                    Key is: <b>{{ serviceInfo.license_key }}</b>
                </div>
            </div>
        </div>
        <template v-if="serviceOverviewExtra">
            <div class="col-md-3">
                <div class="small-box bg-orange">
                    <div class="inner pt-3 pb-1 px-3 text-white">
                        <h3>cPanel Info</h3>
                        <template v-if="serviceOverviewExtra.cPanel_Accounts">
                            <p class="py-3 my-2">
                                Total Accounts are: <b>{{ serviceOverviewExtra.cPanel_Accounts }}</b>
                            </p>
                        </template>
                    </div>
                    <div class="icon">
                        <i class="fab fa-cpanel"></i>
                    </div>
                    <div class="small-box-footer text-white">
                        Status is: <b>{{ serviceOverviewExtra.cPanel_Status }}</b>
                    </div>
                </div>
            </div>
        </template>
    </div>
    <div v-if="link_display" class="row shadow-none">
        <div class="col">{{ link_display }}</div>
    </div>
    <div v-else-if="!link_display || (link_function && link_function.includes('cancel'))" class="row row-flex">
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
                            <tbody>
                                <tr v-for="itemvalue in extraInfoTables.ip_info.rows" :key="itemvalue">
                                    <td>{{ itemvalue.desc }}</td>
                                    <td class="text-success">{{ itemvalue.value }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Links</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                <i class="fas fa-minus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body text-center">
                    <template v-for="client_link in clientLinks">
                    <a :key="client_link.label" class="btn btn-app mb-3" :title="client_link.help_text" data-toggle="tooltip" :href="client_link.link" v-if="client_link.other_attr" :other_attr="client_link.other_attr">
                        {{ client_link.image }}{{ client_link.label }}
                    </a>
                    <a v-else :title="client_link.help_text" data-toggle="tooltip" :href="client_link.link" class="btn btn-app mb-3">
                        {{ client_link.image }}{{ client_link.label }}
                    </a>
                    </template>
                </div>
            </div>
        </div>
        <template v-if="extraInfoTables.cpanel">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-book">&nbsp;</i>
                                {{ extraInfoTables.cpanel.title }}
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
                            <tr v-for="(value, key) in extraInfoTables.cpanel.rows" :key="key">
                                <td>{{ value.desc }}</td>
                                <td class="text-success">{{ value.value }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="extraInfoTables.note">
            <div class="col-md-5">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-info-circle">&nbsp;</i>
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
                        <table class="table table-bordered">
                            <tr>
                                <td>{{ extraInfoTables.note.rows[0].value }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
</style>