<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { ref, computed, onMounted } from "vue";
import { useAuthStore, useAlertStore, useLayoutStore } from '@/stores';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id;
const pkg = ref('');
const link_display = ref(false);
const layoutStore = useLayoutStore();
layoutStore.setPageHeading('View Backup');
layoutStore.setBreadcrums({'home': 'Home', 'Storage': 'Storage'})
layoutStore.addBreadcrum('backup/'+id, 'View Backup '+id);

const serviceMaster = ref({});
const settings = ref({
    SERVICE_ID_OFFSET: 10000,
    USE_REPEAT_INVOICE: true,
    USE_PACKAGES: true,
    BILLING_DAYS_OFFSET: 45,
    IMGNAME: "backup.png",
    REPEAT_BILLING_METHOD: 2,
    DELETE_PENDING_DAYS: 45,
    SUSPEND_DAYS: 14,
    SUSPEND_WARNING_DAYS: 7,
    TITLE: "Backup Registrations",
    MENUNAME: "Storage",
    EMAIL_FROM: "support@interserver.net",
    TBLNAME: "Storage",
    TABLE: "Storage",
    TITLE_FIELD: "backup_hostname",
    PREFIX: "backup"
});
const serviceInfo = ref({
    backup_id: "592337",
    backup_hostname: "detain.dev",
    backup_username: "detaindev",
    backup_password: "12315688fgfasghs",
    backup_type: "10673",
    backup_currency: "USD",
    backup_expire_date: "2023-08-14 00:59:38",
    backup_order_date: "2022-08-13 20:58:58",
    backup_custid: "2773",
    backup_status: "active",
    backup_invoice: "19917286",
    backup_coupon: "0",
    backup_firstname: "Real",
    backup_lastname: "Person",
    backup_email: "realperson@mybackup.com",
    backup_address: "91 Mullberry St.",
    backup_address2: "",
    backup_address3: "",
    backup_city: "Area 51",
    backup_state: "PA",
    backup_zip: "00001",
    backup_country: "US",
    backup_phone: "8675309",
    backup_fax: "",
    backup_company: "InterServer Secaucus",
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
    services_name: ".dev Backup Name Registration",
    services_cost: "18.00",
    services_category: "100",
    services_ourcost: "15.00",
    services_buyable: "1",
    services_type: "100",
    services_field1: ".dev",
    services_field2: "",
    services_module: "Storage"
});
const errors = ref(false);

const loadBackup = async (id, serviceType, settings, serviceInfo) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/backup/' + id);
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

loadBackup(id, serviceType, settings, serviceInfo)

const titleField = ref(settings.TITLE_FIELD);
const billingStatus = computed(() => {
  const status = serviceInfo[`${settings.PREFIX}_status`];
  if (status === 'active') return 'Active';
  if (status === 'pending') return 'Pending';
  if (status === 'expired' || status === 'canceled') return 'Expired/Canceled';
  return '';
});
const billingStatusClass = computed(() => {
  const status = serviceInfo[`${settings.PREFIX}_status`];
  if (status === 'active') return 'bg-green';
  if (status === 'pending') return 'bg-orange';
  if (status === 'expired' || status === 'canceled') return 'bg-red';
  return '';
});
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
                <span class="small-box-footer text-bold">
                    {{ serviceInfo[titleField] }}
                </span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box" :class="billingStatusClass">
                <div class="inner text-white pt-3 pb-2 px-3">
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
                    <b>{{ billingStatus }}</b>
                </span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-2 px-3">
                    <h3>Host Server</h3>
                    <p class="py-3 my-3">
                        IP is:
                        <b v-if="serviceInfo.backup_ip">{{ serviceInfo.backup_ip }}</b>
                        <b v-else>Not set yet</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <span class="small-box-footer">
                    Server: <b v-if="serviceMaster.backup_name">{{ serviceMaster.backup_name }}</b>
                </span>
            </div>
        </div>
    </div>
    <div v-if="linkDisplay" class="row shadow-none">
        <div class="col">{{ linkDisplay }}</div>
    </div>
    <div v-else-if="!linkDisplay || (linkFunction && ['cancel', 'welcome_email'].includes(linkFunction))" class="row justify-content-center">
        <div class="col-md-8">
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
                    <a v-for="clientLink in clientLinks" :key="clientLink.label" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip" :href="clientLink.link" :attr="clientLink.other_attr">
                        <span v-if="clientLink.image">{{ clientLink.image }}</span>
                        {{ clientLink.label }}
                    </a>
                </div>
            </div>
        </div>
        <div v-if="extraInfoTables.ip_info" class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-map-marker-alt">&nbsp;</i>IP Information
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
                        <tr v-for="itemValue in extraInfoTables.ip_info.rows" :key="itemValue.desc">
                            <td>{{ itemValue.desc }}</td>
                            <td>{{ itemValue.value }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>