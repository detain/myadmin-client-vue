<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper, ucwords } from '@/helpers';
import { RouterLink, useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import { useServerStore, useSiteStore } from '@/stores';
import $ from 'jquery';
import { BandwidthGraph, IpmiLive, ReverseDns } from '@/views/servers';

const module = 'servers';
const siteStore = useSiteStore();
const route = useRoute();
const id = route.params.id;
const link = computed(() => { return route.params.link; });
const { modules } = storeToRefs(siteStore);
const settings = computed(() => { return modules.value[module]; });
const serverStore = useServerStore();
const { loading, error, pkg, link_display, ipmiAuth, ipmiLease, serviceInfo, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, networkInfo, locations } = storeToRefs(serverStore);

function loadLink(newLink: string) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums({ '/home': 'Home', '/servers': 'Servers' });
    siteStore.addBreadcrum('/servers/' + id, 'View Server ' + id);
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading('View Server ' + id);
        siteStore.setTitle('View Server ' + id);
    } else {
        siteStore.setPageHeading('Server ' + id + ' ' + ucwords(newLink.replace('_', ' ')));
        siteStore.setTitle('Server ' + id + ' ' + ucwords(newLink.replace('_', ' ')));
        siteStore.addBreadcrum('/servers/' + id + '/' + newLink, ucwords(newLink.replace('_', ' ')));
        if (newLink == 'login') {
		// do something here
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

serverStore.getById(id);

const hasAssetVlanSwitchport = computed(() => {
    let ret = false;
    if (networkInfo.value.assets) {
        for (let assetId in networkInfo.value.assets) {
            let asset = networkInfo.value.assets[assetId];
            if (asset.vlans && (Object.keys(asset.vlans).length > 0 || Object.keys(asset.switchports).length > 0)) {
                ret = true;
            }
        }
    }
    return ret;
});

const assets = computed(() => {
    return networkInfo.value.assets ? networkInfo.value.assets : {};
});

const vlans = computed(() => {
    return networkInfo.value.vlans ? networkInfo.value.vlans : {};
});

const switchports = computed(() => {
    return networkInfo.value.switchports ? networkInfo.value.switchports : {};
});

function nl2br(text) {
    return text.replace(/\n/g, '<br>');
}

function locationName(assetId) {
    return locations.value[networkInfo.value.assets[assetId].datacenter].location_name;
}

const ipv6VlansNetworks = computed(() => {
    if (!networkInfo.vlans6 || networkInfo.vlans6.length === 0) {
        return '<i>Null</i>';
    }

    return networkInfo.vlans6.map((ipv6) => ipv6.vlans6Networks).join(',');
});
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Package</h3>
                    <p class="m-0">{{ pkg.value || 'Dedicated Server' }}</p>
                    <p>
                        Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date || 'Un-billed' }}</b>
                    </p>
                </div>
                <div class="icon"><i class="fas fa-briefcase"></i></div>
                <div class="small-box-footer text-bold">{{ serviceInfo[settings.TITLE_FIELD] }}</div>
            </div>
        </div>
        <div class="col-md-4">
            <div :class="`small-box bg-${serviceInfo.server_status === 'active' ? 'success' : serviceInfo.server_status === 'pending' ? 'orange' : serviceInfo.server_status === 'expired' || serviceInfo.server_status === 'canceled' ? 'red' : ''}`">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Billing</h3>
                    <p class="my-2 py-3">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b> billed: <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                </div>
                <div class="icon"><i class="fas fa-dollar-sign"></i></div>
                <span class="small-box-footer"
                    >Status is: <b>{{ serviceInfo.server_status }}</b></span
                >
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Order Info</h3>
                    <p class="my-2 py-3">
                        Order ID: <b>{{ serviceInfo.server_id }}</b>
                    </p>
                </div>
                <div class="icon"><i class="fa fa-cart-plus"></i></div>
                <div class="small-box-footer">
                    Ordered on: <b>{{ new Date(serviceInfo.server_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) }}</b>
                </div>
            </div>
        </div>
    </div>
    <div v-if="link" class="row shadow-none">
        <div v-if="link == 'bandwidth_graph'" class="col">
            <BandwidthGraph :id="id"></BandwidthGraph>
        </div>
        <div v-else-if="link == 'ipmi_live'" class="col">
            <IpmiLive :id="id"></IpmiLive>
        </div>
        <div v-else-if="link == 'reverse_dns'" class="col">
            <ReverseDns :id="id"></ReverseDns>
        </div>
        <div v-else class="col">{{ link_display }}</div>
    </div>
    <div v-if="!link_display || (link && link.includes('cancel'))" class="row justify-content-center">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-server">&nbsp;</i>&nbsp;Server Information</h3>
                        <div class="card-tools float-right pl-3 pt-1">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="height: 270px">
                    <div class="row">
                        <template v-if="ipmiLease && ipmiLease !== false && ipmiLease.authenticated == true">
                            <div class="col-md-12">
                                <h5 class="text-md m-0 p-2 text-center">
                                    Power Status is: <span class="text-bold text-capitalize text-bold" :class="{ 'text-success': ipmiLease.power == true, 'text-danger': ipmiLease.power == false }">{{ ipmiLease.power ? 'On' : 'Off' }}</span>
                                </h5>
                            </div>
                        </template>
                        <div class="col-md-12 mr-3 pr-4 pt-2 text-center"></div>
                        <div class="row">
                            <div class="col-md-12 py-2">
                                <span class="info-box-text">
                                    <hr />
                                    <h5 class="mt-5 text-center">
                                        Comment: {{ serviceInfo.vps_comment ? serviceInfo.vps_comment : 'none' }}
                                        <span data-toggle="modal" data-target="#commentForm" title="Edit Comment" style="cursor: pointer"><i class="fa fa-pencil my-2 text-sm"></i></span>
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
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body text-center">
                    <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/servers/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
                        <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                        >{{ clientLink.label }}
                    </router-link>
                </div>
            </div>
        </div>
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-server">&nbsp;</i>Server Information</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                </div>

                <div class="card-body" style="overflow: scroll">
                    <table class="table-sm table-bordered table" v-if="assets">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Hostname</th>
                                <th>Primary IP</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Rack</th>
                                <th v-if="ipmiAuth">Power</th>
                                <th>More Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(asset, asset_id, index) in assets" :key="index">
                                <td>{{ asset.id }}</td>
                                <td>{{ asset.hostname }}</td>
                                <td>{{ asset.primary_ipv4 }}</td>
                                <td>{{ serviceInfo.server_status }}</td>
                                <td>{{ locationName(asset_id) }}</td>
                                <td>{{ asset.rack_name }}</td>
                                <td v-if="ipmiAuth">
                                    <template v-if="asset.lease && asset.lease.authenticated">
                                        {{ asset.lease.power ? 'On' : 'Off' }}
                                        <br />
                                        <div class="btn-group">
                                            <button type="button" :class="asset.lease.power ? 'btn-success' : 'btn-danger'">Select Action</button>
                                            <button type="button" class="btn dropdown-toggle dropdown-hover dropdown-icon" :class="asset.lease.power ? 'btn-success' : 'btn-danger'" data-toggle="dropdown"><span class="sr-only">Toggle Dropdown</span></button>
                                            <div class="dropdown-menu" role="menu">
                                                <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + asset_id + '&link=ipmi_power&action=cycle'">Cycle</a>
                                                <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + asset_id + '&link=ipmi_power&action=reset'">Reset</a>
                                                <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + asset_id + '&link=ipmi_power&action=on'">On</a>
                                                <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + asset_id + '&link=ipmi_power&action=off'">Off</a>
                                                <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + asset_id + '&link=ipmi_power&action=soft'">Soft Reboot</a>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else> Unknown </template>
                                    <template v-if="!asset.lease"> No Lease </template>
                                </td>
                                <td v-html="nl2br(asset.description)"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="hasAssetVlanSwitchport" class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-sitemap">&nbsp;</i>Network Information</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="overflow: scroll">
                    <table class="table-sm table-bordered table text-center">
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
                            <template v-for="(switchport, switchport_id, switchport_index) in switchports" :key="switchport_id">
                                <tr v-for="vlan_id in switchport.vlans" :key="vlan_id">
                                    <td>{{ vlans[vlan_id].network }}</td>
                                    <td>{{ vlans[vlan_id].first_usable }}</td>
                                    <template v-if="switchport_index === 0">
                                        <td :rowspan="switchport.vlans.length" v-bind:class="{ 'vertical-align': switchport.vlans.length > 1 }">
                                            <template v-if="networkInfo.vlans6 && networkInfo.vlans6.length > 0">
                                                <template v-for="(ipv6, ipv6_index) in networkInfo.vlans6" :key="ipv6_index">
                                                    {{ ipv6.vlans6_networks }}
                                                </template>
                                            </template>
                                            <template v-else>
                                                <i>Null</i>
                                            </template>
                                        </td>
                                    </template>
                                    <td>{{ vlans[vlan_id].netmask }}</td>
                                    <td>{{ vlans[vlan_id].gateway }}</td>
                                    <td>{{ vlans[vlan_id].hostmax }}</td>
                                    <td>{{ switchport.switch }}</td>
                                    <td>{{ switchport.port }}</td>
                                    <td>{{ vlans[vlan_id].primary ? 'Yes' : 'No' }}</td>
                                    <td>
                                        <div class="btn-group">
                                            <a :href="`/view_server?id=${serviceInfo.server_id}&link=bandwidth_graph&graph_id=${switchport.graph_id}`" class="btn link mx-3" title="View Bandwidth Graphs" data-toggle="tooltip"><i class="fa fa-line-chart"></i></a>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
