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
layoutStore.setPageHeading('View Server');
layoutStore.setBreadcrums({'home': 'Home', 'Servers': 'Servers'})
layoutStore.addBreadcrum('server/'+id, 'View Server '+id);

const ipmiLease = ref({});
const asset = ref({});
const assets = ref({});
const settings = ref({
    SERVICE_ID_OFFSET: 10000,
    USE_REPEAT_INVOICE: true,
    USE_PACKAGES: true,
    BILLING_DAYS_OFFSET: 45,
    IMGNAME: "server.png",
    REPEAT_BILLING_METHOD: 2,
    DELETE_PENDING_DAYS: 45,
    SUSPEND_DAYS: 14,
    SUSPEND_WARNING_DAYS: 7,
    TITLE: "Server Registrations",
    MENUNAME: "Servers",
    EMAIL_FROM: "support@interserver.net",
    TBLNAME: "Servers",
    TABLE: "Servers",
    TITLE_FIELD: "server_hostname",
    PREFIX: "server"
});
const serviceInfo = ref({
    server_id: "592337",
    server_hostname: "detain.dev",
    server_username: "detaindev",
    server_password: "12315688fgfasghs",
    server_type: "10673",
    server_currency: "USD",
    server_expire_date: "2023-08-14 00:59:38",
    server_order_date: "2022-08-13 20:58:58",
    server_custid: "2773",
    server_status: "active",
    server_invoice: "19917286",
    server_coupon: "0",
    server_firstname: "Real",
    server_lastname: "Person",
    server_email: "realperson@myserver.com",
    server_address: "91 Mullberry St.",
    server_address2: "",
    server_address3: "",
    server_city: "Area 51",
    server_state: "PA",
    server_zip: "00001",
    server_country: "US",
    server_phone: "8675309",
    server_fax: "",
    server_company: "InterServer Secaucus",
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
    services_name: ".dev Server Name Registration",
    services_cost: "18.00",
    services_category: "100",
    services_ourcost: "15.00",
    services_buyable: "1",
    services_type: "100",
    services_field1: ".dev",
    services_field2: "",
    services_module: "Servers"
});
const errors = ref(false);

const loadServer = async (id, serviceType, settings, serviceInfo) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/server/' + id);
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

loadServer(id, serviceType, settings, serviceInfo)

const filteredSwitchports = computed(() => {
  if (
    !networkInfo ||
    !networkInfo.switchports ||
    networkInfo.switchports.length === 0
  ) {
    return [];
  }

  return networkInfo.switchports.filter(
    (switchport) => switchport.assetId === assetId && switchport.vlanId in asset.value.vlans
  );
});

const vlans = computed(() => networkInfo.vlans || {});

const ipv6VlansNetworks = computed(() => {
  if (!networkInfo.vlans6 || networkInfo.vlans6.length === 0) {
    return '<i>Null</i>';
  }

  return networkInfo.vlans6
    .map((ipv6) => ipv6.vlans6Networks)
    .join(',');
});
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Package</h3>
                    <p class="m-0">
                        {{ pkg.value || 'Dedicated Server' }}
                    </p>
                    <p>
                        Next Invoice Date: <b>
                            {{ billingDetails.service_next_invoice_date || 'Un-billed' }}
                        </b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="small-box-footer text-bold">
                    {{ serviceInfo[settings.TITLE_FIELD] }}
                </div>
            </div>
        </div>
        <div class="col-md-4">
            {{ status = `${settings.PREFIX}_status` }}
            <div :class="`small-box bg-${serviceInfo[status] === 'active' ? 'success' : serviceInfo[status] === 'pending' ? 'orange' : (serviceInfo[status] === 'expired' || serviceInfo[status] === 'canceled') ? 'red' : ''}`">
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
                <span class="small-box-footer">
                    Status is: <b>{{ serviceInfo[status] }}</b>
                </span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Order Info</h3>
                    <p class="py-3 my-2">
                        Order ID: <b>{{ serviceInfo.server_id }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fa fa-cart-plus"></i>
                </div>
                <div class="small-box-footer">
                    Ordered on: <b>{{ new Date(serviceInfo.server_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) }}</b>
                </div>
            </div>
        </div>
    </div>
    <div v-if="link_display" class="row shadow-none">
        <div class="col">{{ link_display }}</div>
    </div>
    <div v-if="!link_display || (link_function && link_function.includes('cancel'))" class="row justify-content-center">
        <template v-if="ipmiLease && ipmiLease !== false && ipmiLease.authenticated == true">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-server">&nbsp;</i>&nbsp;Server Information</h3>
                            <div class="card-tools float-right pt-1 pl-3">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="height: 270px;">
                        <div class="row">
                            <div class="col-md-12">
                                <h5 class="text-md m-0 p-2 text-center">Power Status is: <span class="text-bold text-capitalize text-bold" :class="{ 'text-success': ipmiLease.power == true, 'text-danger': ipmiLease.power == false }">{{ ipmiLease.power ? 'On' : 'Off' }}</span></h5>
                            </div>
                            <div class="col-md-12 text-center pt-2 pr-4 mr-3">
                            </div>
                            <div class="row">
                                <div class="col-md-12 py-2">
                                    <span class="info-box-text">
                                        <hr>
                                        <h5 class="text-center mt-5">
                                            Comment: {{ serviceInfo.vps_comment ? serviceInfo.vps_comment : '<span>none</span>' }}
                                            <span data-toggle="modal" data-target="#commentForm" title="Edit Comment" style="cursor: pointer;"><i class="fa fa-pencil text-sm my-2"></i></span>
                                        </h5>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div :class="`${ipmiLease && ipmiLease !== false && ipmiLease.authenticated == true ? 'col-md-8' : 'col-md-4'}`">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Links</h3>
                        <div class="card-tools float-right"><button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div>
                    </div>
                </div>
                <div class="card-body text-center">
                    <template v-for="(client_link, index) in clientLinks" :key="index">
                        <a class="btn btn-app mb-3" :title="client_link.help_text" data-toggle="tooltip" :href="client_link.link" v-if="client_link.image">
                            <img :src="client_link.image" alt="Link image">
                            {{ client_link.label }}
                        </a>
                        <a class="btn btn-app mb-3" :title="client_link.help_text" data-toggle="tooltip" :href="client_link.link" v-else>
                            {{ client_link.label }}
                        </a>
                    </template>
                </div>
            </div>
        </div>
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-server">&nbsp;</i>Server Information</h3>
                        <div class="card-tools float-right"><button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div>
                    </div>
                </div>
                <div class="card-body" style="overflow: scroll;">
                    <template v-if="assets && assets.length">
                        <template v-for="(asset, index) in assets" :key="asset.id">
                            <table class="table table-sm table-bordered">
                                <tr>
                                    <th>ID</th>
                                    <th>Hostname</th>
                                    <th>Primary IP</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                    <th>Rack</th>
                                    <template v-if="ipmiAuth">
                                        <th>Power</th>
                                    </template>
                                    <th>More Info</th>
                                </tr>
                                <tr>
                                    <td>{{ asset.id }}</td>
                                    <td>{{ asset.hostname }}</td>
                                    <td>{{ asset.primary_ipv4 }}</td>
                                    <td>{{ serviceInfo.server_status.toUpperCase() }}</td>
                                    <td>{{ locations[asset.datacenter].location_name }}</td>
                                    <td>{{ asset.rack_name }}</td>
                                    <template v-if="ipmiAuth">
                                        <template v-if="asset.lease">
                                            <template v-if="asset.lease.authenticated">
                                                <td>
                                                    {{ asset.lease.power ? 'On' : 'Off' }}<br>
                                                    <div class="btn-group">
                                                        <button type="button" :class="asset.lease.power ? 'btn-success' : 'btn-danger'">Select Action</button>
                                                        <button type="button" :class="asset.lease.power ? 'btn-success' : 'btn-danger' + ' dropdown-toggle dropdown-hover dropdown-icon'" data-toggle="dropdown"><span class="sr-only">Toggle Dropdown</span></button>
                                                        <div class="dropdown-menu" role="menu">
                                                            <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + index + '&link=ipmi_power&action=cycle'">Cycle</a>
                                                            <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + index + '&link=ipmi_power&action=reset'">Reset</a>
                                                            <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + index + '&link=ipmi_power&action=on'">On</a>
                                                            <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + index + '&link=ipmi_power&action=off'">Off</a>
                                                            <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + index + '&link=ipmi_power&action=soft'">Soft Reboot</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </template>
                                            <template v-else>
                                                <td>Unknown</td>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <td>No Lease</td>
                                        </template>
                                    </template>
                                    <td>{{ asset.description.replace(/\n/g, '<br>') }}</td>
                                </tr>
                            </table>
                        </template>
                    </template>
                </div>
            </div>
        </div>
        <div v-if="asset.vlans && asset.vlans.length && asset.switchports && asset.switchports.length" class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-sitemap">&nbsp;</i>Network Information
                        </h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="overflow: scroll;">
                    <table class="table table-sm table-bordered text-center">
                        <thead>
                            <tr>
                                <th class="text-3xl font-bold underline">Network</th>
                                <th>Primary IP</th>
                                <th>IPv6</th>
                                <th>Netmask</th>
                                <th>Gateway</th>
                                <th>Hostmax</th>
                                <th>Switch</th>
                                <th>Port</th>
                                <th>Is Primary?</th>
                                <th>Bandwidth Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="switchport in filteredSwitchports" :key="switchport.id">
                                <td>{{ vlans[switchport.vlanId].network }}</td>
                                <td>{{ vlans[switchport.vlanId].firstUsable }}</td>
                                <td v-if="switchport.vlanId === filteredSwitchports[0].vlanId" :rowspan="filteredSwitchports.length" :style="{ verticalAlign: filteredSwitchports.length > 1 ? 'middle' : 'inherit' }">
                                    {{ ipv6VlansNetworks }}
                                </td>
                                <td>{{ vlans[switchport.vlanId].netmask }}</td>
                                <td>{{ vlans[switchport.vlanId].gateway }}</td>
                                <td>{{ vlans[switchport.vlanId].hostmax }}</td>
                                <td>{{ switchport.switch }}</td>
                                <td>{{ switchport.port }}</td>
                                <td>{{ vlans[switchport.vlanId].primary ? 'Yes' : 'No' }}</td>
                                <td>
                                    <div class="btn-group">
                                        <a :href="'/view_server?id=' + serviceInfo.serverId + '&link=bandwidth_graph&graph_id=' + switchport.graphId" class="btn link mx-3" title="View Bandwidth Graphs" data-toggle="tooltip">
                                            <i class="fa fa-line-chart"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>