<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useServerStore, useAuthStore, useAlertStore, useLayoutStore } from '@/stores';
import $ from 'jquery';

const layoutStore = useLayoutStore();
const route = useRoute();
const id = route.params.id;
layoutStore.setPageHeading('View Server');
layoutStore.setBreadcrums({'/home': 'Home', '/servers': 'Servers'})
layoutStore.addBreadcrum('/servers/'+id, 'View Server '+id);

const serverStore = useServerStore();
const { loading, error, pkg, link_display, ipmiAuth, ipmiLease, settings, serviceInfo, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, networkInfo, locations } = storeToRefs(serverStore);

serverStore.getById(id)



const filteredSwitchports = computed(() => {
  if (
    !networkInfo ||
    !networkInfo.switchports ||
    networkInfo.switchports.length === 0
  ) {
    return [];
  }

  return networkInfo.switchports.filter(
    (switchport) => switchport.asset_id === assetId && switchport.vlan_id in asset.value.vlans
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
                            <template v-if="ipmiLease && ipmiLease !== false && ipmiLease.authenticated == true">
                                <div class="col-md-12">
                                    <h5 class="text-md m-0 p-2 text-center">Power Status is: <span class="text-bold text-capitalize text-bold" :class="{ 'text-success': ipmiLease.power == true, 'text-danger': ipmiLease.power == false }">{{ ipmiLease.power ? 'On' : 'Off' }}</span></h5>
                                </div>
                            </template>
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
        <div :class="`${ipmiLease && ipmiLease !== false && ipmiLease.authenticated == true ? 'col-md-8' : 'col-md-4'}`">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Links</h3>
                        <div class="card-tools float-right"><button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div>
                    </div>
                </div>
                <div class="card-body text-center">
                    <template v-for="(clientLink, index) in clientLinks" :key="index">
                        <a class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip" :href="clientLink.link" v-if="clientLink.icon">
                            <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i>
                            {{ clientLink.label }}
                        </a>
                        <a class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip" :href="clientLink.link" v-else>
                            {{ clientLink.label }}
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
                    <template v-if="networkInfo.assets && networkInfo.assets.length">
                        <template v-for="(asset, index) in networkInfo.assets" :key="asset.id">
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
        <div v-if="networkInfo.assets[Object.keys(networkInfo.assets)[0]].vlans && networkInfo.assets[Object.keys(networkInfo.assets)[0]].vlans.length && networkInfo.assets[Object.keys(networkInfo.assets)[0]].switchports && networkInfo.assets[Object.keys(networkInfo.assets)[0]].switchports.length" class="col-md-12">
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
                        <tbody v-if="networkInfo && networkInfo.switchports.length > 0">
                            <template v-for="(switchport, switchport_id) in networkInfo.switchports">
                                <template v-if="switchport.asset_id == asset_id">
                                    <template v-if="switchport.vlans && switchport.vlans.length > 0">
                                        <template v-for="(vlan_id, index) in switchport.vlans">
                                            <template v-if="networkInfo.assets[Object.keys(networkInfo.assets)[0]].vlans.includes(vlan_id)">
                                                <tr :key="vlan_id">
                                                    <td>{{ networkInfo.vlans[vlan_id].network }}</td>
                                                    <td>{{ networkInfo.vlans[vlan_id].first_usable }}</td>
                                                    <template v-if="index === 0">
                                                        <td :rowspan="switchport.vlans.length" v-bind:class="{'vertical-align': switchport.vlans.length > 1}">
                                                            <template v-if="networkInfo.vlans6 && networkInfo.vlans6.length > 0">
                                                                <template v-for="(ipv6, ipv6_index) in networkInfo.vlans6">
                                                                    {{ ipv6.vlans6_networks }}
                                                                </template>
                                                            </template>
                                                            <template v-else>
                                                                <i>Null</i>
                                                            </template>
                                                        </td>
                                                    </template>
                                                    <td>{{ networkInfo.vlans[vlan_id].netmask }}</td>
                                                    <td>{{ networkInfo.vlans[vlan_id].gateway }}</td>
                                                    <td>{{ networkInfo.vlans[vlan_id].hostmax }}</td>
                                                    <td>{{ switchport.switch }}</td>
                                                    <td>{{ switchport.port }}</td>
                                                    <td>{{ networkInfo.vlans[vlan_id].primary ? 'Yes' : 'No' }}</td>
                                                    <td>
                                                        <div class="btn-group">
                                                            <a :href="`/view_server?id=${serviceInfo.server_id}&link=bandwidth_graph&graph_id=${switchport.graph_id}`" class="btn link mx-3" title="View Bandwidth Graphs" data-toggle="tooltip"><i class="fa fa-line-chart"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{{ switchport.switch }}</td>
                                            <td>{{ switchport.port }}</td>
                                            <td>{{ (vlan_id && networkInfo.vlans[vlan_id] && networkInfo.vlans[vlan_id].primary) ? 'Yes' : 'No' }}
                                            </td>
                                        </tr>
                                    </template>
                                </template>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>