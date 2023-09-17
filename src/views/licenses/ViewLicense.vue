<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper, ucwords, moduleLink } from '@/helpers';
import { RouterLink, useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import { useLicenseStore, useSiteStore } from '@/stores';
import $ from 'jquery';
import { Cancel, Invoices } from '@/components/services';
import { ChangeIp, ChangeOs } from '@/views/licenses';

const module = 'licenses';
const siteStore = useSiteStore();
const route = useRoute();
const id = route.params.id;
const link = computed(() => {
    return route.params.link;
});
const { modules } = storeToRefs(siteStore);
const settings = computed(() => {
    return modules.value[module];
});
const licenseStore = useLicenseStore();
const { loading, error, pkg, linkDisplay, serviceInfo, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, serviceOverviewExtra, serviceType } = storeToRefs(licenseStore);

function loadLink(newLink: string) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums([
        ['/home', 'Home'],
        ['/' + moduleLink(module) + moduleLink(module), 'License'],
    ]);
    siteStore.addBreadcrum('/' + moduleLink(module) + '/' + id, 'View License ' + id);
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading('View License ' + id);
        siteStore.setTitle('View License ' + id);
    } else {
        siteStore.setPageHeading('License ' + id + ' ' + ucwords(newLink.replace('_', ' ')));
        siteStore.setTitle('License ' + id + ' ' + ucwords(newLink.replace('_', ' ')));
        siteStore.addBreadcrum('/' + moduleLink(module) + '/' + id + '/' + newLink, ucwords(newLink.replace('_', ' ')));
        if (newLink == 'login') {
            // do something here
        }
    }
}

watch(
    () => route.params.link,
    (newLink) => {
        loadLink(newLink as string);
    }
);

loadLink(route.params.link as string);

licenseStore.getById(id as string);
</script>

<template>
    <div class="row mt-2">
        <div :class="`col-md-${serviceOverviewExtra ? '3' : '4'}`">
            <div class="small-box bg-secondary">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Package</h3>
                    <p class="my-2 py-1">{{ pkg }}</p>
                    <p class="m-0">
                        Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="small-box-footer">
                    <b>{{ serviceInfo.license_ip }}</b>
                </div>
            </div>
        </div>
        <div :class="`col-md-${serviceOverviewExtra ? '3' : '4'}`">
            <div :class="['small-box', serviceInfo.license_status === 'active' ? 'bg-success' : '', serviceInfo.license_status === 'pending' ? 'bg-orange' : '', serviceInfo.license_status === 'expired' || serviceInfo.license_status === 'canceled' ? 'bg-red' : '']">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Billing</h3>
                    <p class="my-2 py-3">
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
        <div :class="`col-md-${serviceOverviewExtra ? '3' : '4'}`">
            <div class="small-box bg-info">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>License Info</h3>
                    <template v-if="serviceInfo.license_hostname">
                        <p :class="serviceOverviewExtra ? 'mt-0' : 'my-2 py-3'">
                            Hostname is:<br />
                            <b>{{ serviceInfo.license_hostname }}</b>
                        </p>
                    </template>
                    <template v-if="serviceExtra && serviceType.services_category === 507">
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
                    <div class="inner px-3 pb-1 pt-3 text-white">
                        <h3>cPanel Info</h3>
                        <template v-if="serviceOverviewExtra.cPanel_Accounts">
                            <p class="my-2 py-3">
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
    <div v-if="link" class="row shadow-none">
        <div v-if="link == 'change_ip'" class="col">
            <ChangeIp :id="id"></ChangeIp>
        </div>
        <div v-else-if="link == 'change_os'" class="col">
            <ChangeOs :id="id"></ChangeOs>
        </div>
        <div v-else-if="link == 'invoices'" class="col">
            <Invoices :id="id" :module="module"></Invoices>
        </div>
        <div v-else class="col" v-html="linkDisplay">
        </div>
    </div>
    <div v-else-if="!linkDisplay || (link && link.includes('cancel'))" class="row row-flex">
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
                        <table class="table-bordered table">
                            <tbody>
                                <tr v-for="(itemvalue, index) in extraInfoTables.ip_info.rows" :key="index">
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
                    <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/' + moduleLink(module) + '/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
                        <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                        >{{ clientLink.label }}
                    </router-link>
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
                        <table class="table-bordered table">
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
                        <table class="table-bordered table">
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

<style>
@import '/css/view_service.css';
</style>
