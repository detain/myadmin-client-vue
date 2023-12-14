<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper, moduleLink, ucwords } from '@/helpers';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { useBackupStore, useSiteStore } from '@/stores';
import Cancel from '@/components/services/Cancel.vue';
import Invoices from '@/components/services/Invoices.vue';
import $ from 'jquery';
import Swal from 'sweetalert2';

const module = 'backups';
const siteStore = useSiteStore();
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const link = computed(() => {
    return route.params.link;
});
const { modules } = storeToRefs(siteStore);
const baseUrl = siteStore.getBaseUrl();
const settings = computed(() => {
    return modules.value[module];
});
siteStore.setPageHeading('View Backup');
siteStore.setTitle('View Backup');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/' + moduleLink(module), 'Storage'],
]);
siteStore.addBreadcrum('/' + moduleLink(module) + '/' + id, 'View Backup ' + id);

const backupStore = useBackupStore();
const { loading, error, pkg, linkDisplay, serviceInfo, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceMaster, serviceExtra, extraInfoTables } = storeToRefs(backupStore);
backupStore.getById(id as string);

const billingStatus = computed(() => {
    const status = serviceInfo.value.backup_status;
    if (status === 'active') return 'Active';
    if (status === 'pending') return 'Pending';
    if (status === 'expired' || status === 'canceled') return 'Expired/Canceled';
    return '';
});
const billingStatusClass = computed(() => {
    const status = serviceInfo.value.backup_status;
    if (status === 'active') return 'bg-green';
    if (status === 'pending') return 'bg-orange';
    if (status === 'expired' || status === 'canceled') return 'bg-red';
    return '';
});

function loadLink(newLink: string) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums([
        ['/home', 'Home'],
        ['/' + moduleLink(module), 'Backup'],
    ]);
    siteStore.addBreadcrum('/' + moduleLink(module) + '/' + id, 'View Backup ' + id);
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading('View Backup ' + id);
        siteStore.setTitle('View Backup ' + id);
    } else {
        siteStore.setPageHeading('Backup ' + id + ' ' + ucwords(newLink.replace('_', ' ')));
        siteStore.setTitle('Backup ' + id + ' ' + ucwords(newLink.replace('_', ' ')));
        siteStore.addBreadcrum('/' + moduleLink(module) + '/' + id + '/' + newLink, ucwords(newLink.replace('_', ' ')));
        if (newLink == 'welcome_email') {
            Swal.fire({
                icon: "question",
                title: '<h3>Are you sure?</h3> ',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes',
                html: "Are you sure want to resend welcome email?",
                preConfirm: () => {
                    try {
                        Swal.close();
                        fetchWrapper.get('/' + moduleLink(module) + '/' + id + '/welcome_email').then((response) => {
                            Swal.fire({
                                icon: "success",
                                title: '<h3>Email Sent</h3> ',
                                showCancelButton: false,
                                showLoaderOnConfirm: true,
                                confirmButtonText: 'Yes',
                                html: "The welcome email has been resent.  Check your inbox.",
                                preConfirm: () => {
                                    router.push('/' + moduleLink(module) + '/' + id);
                                }
                            });
                        });
                    } catch (error: any) {
                        console.log('error');
                        console.log(error);
                    }
                }
            });
        } else if (newLink == 'login') {
            try {
                fetchWrapper.get(baseUrl + '/' + moduleLink(module) + '/' + id + '/login').then((response) => {
                    console.log('response:');
                    console.log(response);
                    if (typeof response.location != 'undefined') {
                        window.location = response.location;
                    }
                });
            } catch (error: any) {
                console.log('error:');
                console.log(error);
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
                <span class="small-box-footer text-bold">
                    {{ serviceInfo.backup_ip }}
                </span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box" :class="billingStatusClass">
                <div class="inner px-3 pb-2 pt-3 text-white">
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
                    <b>{{ billingStatus }}</b>
                </span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner px-3 pb-2 pt-3">
                    <h3>Host Server</h3>
                    <p class="my-3 py-3">
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
    <div v-if="link" class="row shadow-none">
        <div v-if="link == 'invoices'" class="col">
            <Invoices :id="id" :module="module"></Invoices>
        </div>
        <div v-else class="col" v-html="linkDisplay">
        </div>
    </div>
    <div v-else-if="!linkDisplay || (link && ['cancel', 'welcome_email'].includes(link))" class="row justify-content-center">
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
                    <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/' + moduleLink(module) + '/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
                        <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                        >{{ clientLink.label }}
                    </router-link>
                </div>
            </div>
        </div>
        <div v-if="extraInfoTables.ip_info" class="col-md-4">
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

<style>
@import '/css/view_service.css';
</style>
