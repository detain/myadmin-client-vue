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
layoutStore.setPageHeading('View Website');
layoutStore.setBreadcrums({'home': 'Home', 'Websites': 'Websites'})
layoutStore.addBreadcrum('website/'+id, 'View Website '+id);

const serviceMaster = ref({});
const settings = ref({
    SERVICE_ID_OFFSET: 10000,
    USE_REPEAT_INVOICE: true,
    USE_PACKAGES: true,
    BILLING_DAYS_OFFSET: 45,
    IMGNAME: "website.png",
    REPEAT_BILLING_METHOD: 2,
    DELETE_PENDING_DAYS: 45,
    SUSPEND_DAYS: 14,
    SUSPEND_WARNING_DAYS: 7,
    TITLE: "Website Registrations",
    MENUNAME: "Websites",
    EMAIL_FROM: "support@interserver.net",
    TBLNAME: "Websites",
    TABLE: "Websites",
    TITLE_FIELD: "website_hostname",
    PREFIX: "website"
});
const serviceInfo = ref({
    website_id: "592337",
    website_hostname: "detain.dev",
    website_username: "detaindev",
    website_password: "12315688fgfasghs",
    website_type: "10673",
    website_currency: "USD",
    website_expire_date: "2023-08-14 00:59:38",
    website_order_date: "2022-08-13 20:58:58",
    website_custid: "2773",
    website_status: "active",
    website_invoice: "19917286",
    website_coupon: "0",
    website_firstname: "Real",
    website_lastname: "Person",
    website_email: "realperson@mywebsite.com",
    website_address: "91 Mullberry St.",
    website_address2: "",
    website_address3: "",
    website_city: "Area 51",
    website_state: "PA",
    website_zip: "00001",
    website_country: "US",
    website_phone: "8675309",
    website_fax: "",
    website_company: "InterServer Secaucus",
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
    services_name: ".dev Website Name Registration",
    services_cost: "18.00",
    services_category: "100",
    services_ourcost: "15.00",
    services_buyable: "1",
    services_type: "100",
    services_field1: ".dev",
    services_field2: "",
    services_module: "Websites"
});
const errors = ref(false);

function isEmpty(table) {
  return table === null || table === undefined || table.length === 0;
}

const loadWebsite = async (id, serviceType, settings, serviceInfo) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/website/' + id);
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

loadWebsite(id, serviceType, settings, serviceInfo)
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Package</h3>
                    <p class="py-2 m-0">{{ pkg }}</p>
                    <p>Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b></p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <span class="small-box-footer text-bold">{{ serviceInfo.website_hostname }}</span>
            </div>
        </div>
        <div class="col-md-4">
            <div :class="{
          'small-box': true,
          'bg-success': serviceInfo.website_status === 'running' || serviceInfo.website_status === 'active',
          'bg-orange': serviceInfo.website_status === 'paused' || serviceInfo.website_status === 'suspended',
          'bg-danger': serviceInfo.website_status === 'stopped' || serviceInfo.website_status === 'deleted' || serviceInfo.website_status === 'canceled',
          'bg-info': !(serviceInfo.website_status === 'running' || serviceInfo.website_status === 'active' || serviceInfo.website_status === 'paused' || serviceInfo.website_status === 'suspended' || serviceInfo.website_status === 'stopped' || serviceInfo.website_status === 'deleted' || serviceInfo.website_status === 'canceled')
        }">
                <div class="inner pt-3 pb-2 px-3">
                    <h3>Billing</h3>
                    <p class="py-3 my-3">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <span class="small-box-footer">
                    Billing Status is:
                    <b>{{ serviceInfo.website_status }}</b>
                </span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Host Info</h3>
                    <p class="py-2 m-0">
                        Username:
                        <b>
                            <template v-if="!isEmpty(serviceInfo.website_username)">{{ serviceInfo.website_username }}</template>
                            <template v-else>Not set yet</template>
                        </b>
                    </p>
                    <p>
                        IP:
                        <b>
                            <template v-if="!isEmpty(serviceInfo.website_ip)">{{ serviceInfo.website_ip }}</template>
                            <template v-else>Not set yet</template>
                        </b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <span class="small-box-footer">
                    Server:
                    <b>
                        <template v-if="!isEmpty(serviceMaster.website_name)">{{ serviceMaster.website_name }}</template>
                        <template v-else>Not set yet</template>
                    </b>
                </span>
            </div>
        </div>
    </div>
    <div v-if="link_display" class="row shadow-none">
        <div class="col">
            {{ link_display }}
        </div>
    </div>
    <div v-else-if="!link_display || (link_function && ['cancel', 'welcome_email'].includes(link_function))" class="row mt-2">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-sign-in" aria-hidden="true">&nbsp;</i>&nbsp;{{ pkg }} Login</h3>
                        <div class="card-tools float-right">
                            <button class="btn btn-tool mt-0" type="button" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="height: 270px;">
                    <div class="row">
                        <div class="col-md-12">
                            <table class="table table-bordered">
                                <tr>
                                    <th>Types:</th>
                                    <th>Links:</th>
                                </tr>
                                <template v-if="extraInfoTables.links && extraInfoTables.links.rows[0] && extraInfoTables.links.rows[0].value">
                                    <tr>
                                        <td>Manual Login</td>
                                        <td><a :href="extraInfoTables.links.rows[0].value" target="__blank" class="link">Click Here</a></td>
                                    </tr>
                                </template>
                                <tr v-if="clientLinks[3]">
                                    <td>Automatic Login</td>
                                    <td><a :href="clientLinks[3].link" target="__blank" class="link">Click Here</a></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fas fa-globe">&nbsp;</i>Default Nameservers
                        </h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                <i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="height: 270px;">
                    <table class="table table-bordered">
                        <tr>
                            <th>Nameservers:</th>
                        </tr>
                        <template v-if="extraInfoTables.dns && extraInfoTables.dns.rows">
                            <tr v-for="nameserver in extraInfoTables.dns.rows">
                                <td>{{ nameserver.desc }}</td>
                            </tr>
                        </template>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="extraInfoTables.links" class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-link" aria-hidden="true">&nbsp;</i>External Links
                        </h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                <i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="height: 270px;">
                    <table class="table table-bordered">
                        <tr>
                            <th>Names:</th>
                            <th>Links:</th>
                        </tr>
                        <tr v-for="link in extraInfoTables.links.rows" :key="link.value" v-if="link.desc !== 'CPanel' && link.desc !== 'Plesk Panel' && link.desc !== 'DirectAdmin Panel'">
                            <td>{{ link.desc }}</td>
                            <td><a :href="link.value" target="__blank" class="link">Click Here</a></td>
                        </tr>
                        <tr>
                            <td>Website Preview</td>
                            <td><a :href="extraInfoTables.preview.rows[0].value" target="__blank" class="link">Click Here</a></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="!link_display || (link_function && ['cancel', 'welcome_email'].includes(link_function))" class="row row-flex">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Links</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body text-center">
                    <a v-for="clientLink in clientLinks" :key="clientLink.id" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip" :href="clientLink.link" :other-attr="clientLink.other_attr">{{ clientLink.image }}{{ clientLink.label }}</a>
                </div>
            </div>
        </div>
        <div v-if="extraInfoTables.addons" class="col-md-3">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-plus">&nbsp;</i>{{ extraInfoTables.addons.title }}</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-bordered">
                        <tr v-for="addon in extraInfoTables.addons.rows" :key="addon.id">
                            <td>{{ addon.desc }}</td>
                            <td>{{ addon.value }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>