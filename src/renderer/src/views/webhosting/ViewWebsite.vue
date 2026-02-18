<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ucwords } from '@/helpers/ucwords';
import { moduleLink } from '@/helpers/moduleLink';

import { RouterLink, useRoute, useRouter } from 'vue-router';
import { computed, watch } from 'vue';
import { useWebsiteStore } from '@/stores/website.store';
import { useSiteStore } from '@/stores/site.store';

import $ from 'jquery';
import Cancel from '@/components/services/Cancel.vue';
import Invoices from '@/components/services/Invoices.vue';
import BuyIp from '@/views/webhosting/BuyIp.vue';
import DownloadBackups from '@/views/webhosting/DownloadBackups.vue';
import Migration from '@/views/webhosting/Migration.vue';
import ReverseDns from '@/views/webhosting/ReverseDns.vue';

import Swal from 'sweetalert2';

const module = 'webhosting';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const link = computed(() => route.params.link as string);
console.log(link.value);
const { modules } = storeToRefs(siteStore);
const settings = computed(() => modules.value[module]);
const websiteStore = useWebsiteStore();
const { loading, error, pkg, linkDisplay, serviceInfo, titleField, titleField2, titleField3, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceMaster, serviceExtra, extraInfoTables } = storeToRefs(websiteStore);
function isEmpty(table: any) {
    return table === null || table === undefined || table.length === 0;
}

function loadLink(newLink: string) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums([
        ['/home', 'Home'],
        [`/${moduleLink(module)}`, 'Website'],
    ]);
    siteStore.addBreadcrum(`/${moduleLink(module)}/${id}`, `View Website ${id}`);
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading(`View Website ${id}`);
        siteStore.setTitle(`View Website ${id}`);
    } else {
        siteStore.setPageHeading(`Website ${id} ${ucwords(newLink.replace('_', ' '))}`);
        siteStore.setTitle(`Website ${id} ${ucwords(newLink.replace('_', ' '))}`);
        siteStore.addBreadcrum(`/${moduleLink(module)}/${id}/${newLink}`, ucwords(newLink.replace('_', ' ')));
        if (newLink == 'welcome_email') {
            Swal.fire({
                icon: 'question',
                title: '<h3>Are you sure?</h3> ',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes',
                html: 'Are you sure want to resend welcome email?',
                preConfirm: () => {
                    try {
                        Swal.close();
                        fetchWrapper.get(`/${moduleLink(module)}/${id}/welcome_email`).then((response) => {
                            Swal.fire({
                                icon: 'success',
                                title: '<h3>Email Sent</h3> ',
                                showCancelButton: false,
                                showLoaderOnConfirm: true,
                                confirmButtonText: 'Yes',
                                html: 'The welcome email has been resent.  Check your inbox.',
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
            try {
                fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id}/login`).then((response) => {
                    console.log('response:', response);
                    if (typeof response.location != 'undefined') {
                        window.location.href = response.location;
                    }
                });
            } catch (error: any) {
                console.log('error:', error);
            }
        }
    }
}

watch(
    () => route.params.link,
    (newLink) => {
        loadLink(newLink as string);
    }
);

websiteStore.getById(id);
loadLink(route.params.link as string);
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Package</h3>
                    <p class="m-0 py-2">{{ pkg }}</p>
                    <p>
                        Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <span class="small-box-footer text-bold">{{ serviceInfo.website_hostname }}</span>
            </div>
        </div>
        <div class="col-md-4">
            <div
                :class="{
                    'small-box': true,
                    'bg-success': serviceInfo.website_status === 'running' || serviceInfo.website_status === 'active',
                    'bg-orange': serviceInfo.website_status === 'paused' || serviceInfo.website_status === 'suspended',
                    'bg-danger': serviceInfo.website_status === 'stopped' || serviceInfo.website_status === 'deleted' || serviceInfo.website_status === 'canceled',
                    'bg-info': !(serviceInfo.website_status === 'running' || serviceInfo.website_status === 'active' || serviceInfo.website_status === 'paused' || serviceInfo.website_status === 'suspended' || serviceInfo.website_status === 'stopped' || serviceInfo.website_status === 'deleted' || serviceInfo.website_status === 'canceled'),
                }">
                <div class="inner px-3 pb-2 pt-3">
                    <h3>Billing</h3>
                    <p class="my-3 py-3">
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
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Host Info</h3>
                    <p class="m-0 py-2">
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
    <div v-if="link" class="row shadow-none">
        <div v-if="link == 'buy_ip'" class="col">
            <BuyIp :id="id"></BuyIp>
        </div>
        <div v-else-if="link == 'download_backups'" class="col">
            <DownloadBackups :id="id"></DownloadBackups>
        </div>
        <div v-else-if="link == 'cancel'" class="col">
            <Cancel :id="id" :module="module" :package="pkg" :title-field="titleField" :title-field2="titleField2" :title-field3="titleField3"></Cancel>
        </div>
        <div v-else-if="link == 'invoices'" class="col">
            <Invoices :id="id" :module="module"></Invoices>
        </div>
        <div v-else-if="link == 'migration'" class="col">
            <Migration :id="id"></Migration>
        </div>
        <div v-else-if="link == 'reverse_dns'" class="col">
            <ReverseDns :id="id"></ReverseDns>
        </div>
        <div v-else class="col" v-html="linkDisplay"></div>
    </div>
    <div v-else-if="!linkDisplay || (link && ['cancel', 'welcome_email'].includes(link))" class="row mt-2">
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
                <div class="card-body" style="height: 270px">
                    <div class="row">
                        <div class="col-md-12">
                            <table class="table-bordered table">
                                <thead>
                                    <tr>
                                        <th>Types:</th>
                                        <th>Links:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-if="extraInfoTables.links && extraInfoTables.links.rows.length > 0 && extraInfoTables.links.rows[0].value">
                                        <tr>
                                            <td>Manual Login</td>
                                            <td><a :href="extraInfoTables.links.rows[0].value" target="__blank" class="link">Click Here</a></td>
                                        </tr>
                                    </template>
                                    <tr v-if="clientLinks[3]">
                                        <td>Automatic Login</td>
                                        <td><router-link :to="'/' + moduleLink(module) + '/' + id + '/login'" target="__blank" class="link">Click Here</router-link></td>
                                    </tr>
                                </tbody>
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
                        <h3 class="card-title py-2"><i class="fas fa-globe">&nbsp;</i>Default Nameservers</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                <i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="height: 270px">
                    <table class="table-bordered table">
                        <thead>
                            <tr>
                                <th>Nameservers:</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="extraInfoTables.dns && extraInfoTables.dns.rows">
                                <tr v-for="(nameserver, idx) in extraInfoTables.dns.rows" :key="idx">
                                    <td>{{ nameserver.desc }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="extraInfoTables.links" class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-link" aria-hidden="true">&nbsp;</i>External Links</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                <i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="height: 270px">
                    <table class="table-bordered table">
                        <thead>
                            <tr>
                                <th>Names:</th>
                                <th>Links:</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(linkRow, index) in extraInfoTables.links.rows">
                                <tr v-if="linkRow.desc !== 'CPanel' && linkRow.desc !== 'Plesk Panel' && linkRow.desc !== 'DirectAdmin Panel'" :key="index">
                                    <td>{{ linkRow.desc }}</td>
                                    <td><a :href="linkRow.value" target="__blank" class="link">Click Here</a></td>
                                </tr>
                            </template>
                            <tr>
                                <td>Website Preview</td>
                                <td><a :href="extraInfoTables.preview.rows[0]?.value" target="__blank" class="link">Click Here</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div v-if="!linkDisplay || (link && ['cancel', 'welcome_email'].includes(link))" class="row row-flex">
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
                    <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/' + moduleLink(module) + '/' + id + '/' + (clientLink.link != null ? clientLink.link : 'login')" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
                        <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                        >{{ clientLink.label }}
                    </router-link>
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
                    <table class="table-bordered table">
                        <tbody>
                            <tr v-for="addon in extraInfoTables.addons.rows" :key="addon.id">
                                <td>{{ addon.desc }}</td>
                                <td>{{ addon.value }}</td>
                            </tr>
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
