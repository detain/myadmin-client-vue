<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ucwords } from '@/helpers/ucwords';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useServerStore } from '@/stores/server.store';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';
import { useServiceLoading } from '@/helpers/useServiceLoading';

const { t } = useI18n();
import Cancel from '@/components/services/Cancel.vue';
import Invoices from '@/components/services/Invoices.vue';
import BandwidthGraph from '@/views/servers/BandwidthGraph.vue';
import IpmiLive from '@/views/servers/IpmiLive.vue';
import ReverseDns from '@/views/servers/ReverseDns.vue';
import { AssetRow } from '@/types/servers';

const module = 'servers';
const siteStore = useSiteStore();
const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const link = computed(() => route.params.link);
const { modules } = storeToRefs(siteStore);
const settings = computed(() => modules.value[module]);
const serverStore = useServerStore();
const { loading, error, pkg, linkDisplay, ipmiAuth, ipmiLease, serviceInfo, titleField, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, networkInfo, locations } = storeToRefs(serverStore);
useServiceLoading(loading);

const orderedOn = computed(() => new Date(serviceInfo.value.server_date * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }));

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

const assets = computed(() => (networkInfo.value.assets ? networkInfo.value.assets : {}));

const firstAsset = computed<AssetRow | null>(() => {
    const assets = networkInfo.value.assets;
    if (!assets || Object.keys(assets).length === 0) {
        return null;
    }
    return assets[Object.keys(assets)[0]];
});

const vlans = computed(() => (networkInfo.value.vlans ? networkInfo.value.vlans : {}));

const switchports = computed(() => (networkInfo.value.switchports ? networkInfo.value.switchports : {}));

function loadLink(newLink: string) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('common.menu.servers')],
    ]);
    siteStore.addBreadcrum(`/${moduleLink(module)}/${id}`, t('servers.view.title', { id }));
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading(t('servers.view.title', { id }));
        siteStore.setTitle(t('servers.view.title', { id }));
    } else {
        siteStore.setPageHeading(`${t('common.menu.servers')} ${id} ${ucwords(newLink.replace('_', ' '))}`);
        siteStore.setTitle(`${t('common.menu.servers')} ${id} ${ucwords(newLink.replace('_', ' '))}`);
        siteStore.addBreadcrum(`/${moduleLink(module)}/${id}/${newLink}`, ucwords(newLink.replace('_', ' ')));
        if (newLink == 'welcome_email') {
            Swal.fire({
                icon: 'question',
                title: `<h3>${t('common.confirm.title')}</h3> `,
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonText: t('common.confirm.yes'),
                html: t('servers.view.welcomeEmailConfirm'),
                preConfirm: () => {
                    try {
                        Swal.close();
                        fetchWrapper.get(`/${moduleLink(module)}/${id}/welcome_email`).then(() => {
                            Swal.fire({
                                icon: 'success',
                                title: `<h3>${t('servers.view.emailSent')}</h3> `,
                                showCancelButton: false,
                                showLoaderOnConfirm: true,
                                confirmButtonText: t('common.confirm.yes'),
                                html: t('servers.view.emailSentMessage'),
                                preConfirm: () => {
                                    router.push(`/${moduleLink(module)}/${id}`);
                                },
                            });
                        });
                    } catch (error: any) {
                        console.log('error', error);
                    }
                },
            });
        } else if (newLink == 'login') {
            // do something here
        }
    }
}

function nl2br(text: string) {
    return text.replace(/\n/g, '<br>');
}

function locationName(assetId: number | string) {
    return locations.value[networkInfo.value.assets[assetId].datacenter].location_name;
}

watch(
    () => route.params.link,
    (newLink) => {
        loadLink(newLink as string);
    }
);

loadLink(route.params.link as string);

serverStore.getById(id);
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>{{ t('servers.view.package') }}</h3>
                    <p class="m-0">{{ t('servers.view.dedicatedServer') }}</p>
                    <p>
                        {{ t('servers.view.nextInvoiceDate') }} <b>{{ billingDetails.service_next_invoice_date || t('servers.view.unBilled') }}</b>
                    </p>
                </div>
                <div class="icon"><i class="fas fa-briefcase"></i></div>
                <div class="small-box-footer text-bold">{{ serviceInfo.server_hostname }}</div>
            </div>
        </div>
        <div class="col-md-4">
            <div :class="`small-box bg-${serviceInfo.server_status === 'active' ? 'success' : serviceInfo.server_status === 'pending' ? 'orange' : serviceInfo.server_status === 'expired' || serviceInfo.server_status === 'canceled' ? 'red' : ''}`">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>{{ t('servers.view.billing') }}</h3>
                    <p class="my-2 py-3">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b> {{ t('common.labels.billed') }} <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                </div>
                <div class="icon"><i class="fas fa-briefcase"></i></div>
                <span class="small-box-footer"
                    >{{ t('common.labels.statusIs') }} <b>{{ serviceInfo.server_status }}</b></span
                >
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>{{ t('servers.view.orderInfo') }}</h3>
                    <p class="my-2 py-3">
                        {{ t('servers.view.orderId') }} <b>{{ serviceInfo.server_id }}</b>
                    </p>
                </div>
                <div class="icon"><i class="fas fa-briefcase"></i></div>
                <div class="small-box-footer">
                    {{ t('servers.view.orderedOn') }} <b>{{ orderedOn }}</b>
                </div>
            </div>
        </div>
    </div>
    <div v-if="link" class="row shadow-none">
        <div v-if="link == 'bandwidth_graph'" class="col">
            <BandwidthGraph :id="id"></BandwidthGraph>
        </div>
        <div v-else-if="link == 'cancel'" class="col">
            <Cancel :id="id" :module="module" :package="pkg" :title-field="titleField"></Cancel>
        </div>
        <div v-else-if="link == 'ipmi_live'" class="col">
            <IpmiLive v-if="firstAsset" :id="id" :asset-info="firstAsset"></IpmiLive>
        </div>
        <div v-else-if="link == 'reverse_dns'" class="col">
            <ReverseDns :id="id"></ReverseDns>
        </div>
        <div v-else-if="link == 'invoices'" class="col">
            <Invoices :id="id" :module="module"></Invoices>
        </div>
        <div v-else class="col" v-html="linkDisplay"></div>
    </div>
    <div v-else class="row justify-content-center">
        <div :class="`${ipmiLease && ipmiLease !== false && ipmiLease.authenticated == true ? 'col-md-8' : 'col-md-4'}`">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-link"></i>{{ t('common.labels.links') }}</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body text-center">
                    <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/' + moduleLink(module) + '/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
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
                        <h3 class="card-title py-2"><i class="fas fa-link"></i>{{ t('servers.view.serverInformation') }}</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                </div>

                <div class="card-body" style="overflow: scroll">
                    <table v-if="assets" class="table-sm table-bordered table">
                        <thead>
                            <tr>
                                <th>{{ t('common.labels.id') }}</th>
                                <th>{{ t('common.labels.hostname') }}</th>
                                <th>{{ t('common.labels.ip') }}</th>
                                <th>{{ t('common.labels.status') }}</th>
                                <th>{{ t('common.labels.server') }}</th>
                                <th>Rack</th>
                                <th v-if="ipmiAuth">{{ t('servers.view.power') }}</th>
                                <th>{{ t('servers.view.moreInfo') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(asset, asset_id) in assets" :key="asset_id">
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
                                            <button type="button" :class="asset.lease.power ? 'btn-success' : 'btn-danger'">{{ t('servers.view.selectAction') }}</button>
                                            <button type="button" class="btn dropdown-toggle dropdown-hover dropdown-icon" :class="asset.lease.power ? 'btn-success' : 'btn-danger'" data-toggle="dropdown"><span class="sr-only">Toggle Dropdown</span></button>
                                            <div class="dropdown-menu" role="menu">
                                                <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + asset_id + '&link=ipmi_power&action=cycle'">{{ t('servers.view.cycle') }}</a>
                                                <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + asset_id + '&link=ipmi_power&action=reset'">{{ t('servers.view.reset') }}</a>
                                                <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + asset_id + '&link=ipmi_power&action=on'">{{ t('servers.view.on') }}</a>
                                                <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + asset_id + '&link=ipmi_power&action=off'">{{ t('servers.view.off') }}</a>
                                                <a class="dropdown-item" :href="'view_server?id=' + serviceInfo.server_id + '&asset=' + asset_id + '&link=ipmi_power&action=soft'">{{ t('servers.view.softReboot') }}</a>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else> {{ t('servers.view.unknown') }} </template>
                                    <template v-if="!asset.lease"> {{ t('servers.view.noLease') }} </template>
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
                        <h3 class="card-title py-2"><i class="fas fa-link"></i>{{ t('servers.view.networkInformation') }}</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="overflow: scroll">
                    <table class="table-sm table-bordered table text-center">
                        <thead>
                            <tr>
                                <th>Network</th>
                                <th>Primary IP</th>
                                <th>IPv6</th>
                                <th>Netmask</th>
                                <th>Gateway</th>
                                <th>HostMax</th>
                                <th>Switch</th>
                                <th>Port</th>
                                <th>Is Primary?</th>
                                <th>Bandwidth Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(switchport, switchport_id) in switchports" :key="switchport_id">
                                <tr v-for="(vlan_id, vlan_index) in switchport.vlans" :key="vlan_id">
                                    <td>{{ vlans[vlan_id].network }}</td>
                                    <td>{{ vlans[vlan_id].first_usable }}</td>
                                    <template v-if="vlan_index === 0">
                                        <td :rowspan="switchport.vlans.length" :class="{ 'vertical-align': switchport.vlans.length > 1 }">
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
                                            <router-link :to="'/' + moduleLink(module) + '/' + id + '/bandwidth_graph?port=' + switchport_id" class="btn link mx-3" title="View Bandwidth Graphs" data-toggle="tooltip"><i class="far fa-chart-line"></i></router-link>
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

<style>
@import '../../assets/css/view_service.css';
</style>
