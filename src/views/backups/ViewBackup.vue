<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { RouterLink, useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import { useBackupStore, useSiteStore } from '@/stores';
import $ from 'jquery';

const siteStore = useSiteStore();
const route = useRoute();
const id = route.params.id;
const link = computed(() => {
    return route.params.link;
});
siteStore.setPageHeading('View Backup');
siteStore.setTitle('View Backup');
siteStore.setBreadcrums({ '/home': 'Home', '/backups': 'Storage' });
siteStore.addBreadcrum('/backups/' + id, 'View Backup ' + id);

const backupStore = useBackupStore();
const { loading, error, pkg, link_display, settings, serviceInfo, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceMaster, serviceExtra, extraInfoTables, csrf } = storeToRefs(backupStore);

backupStore.getById(id);

const titleField = ref(settings.value.TITLE_FIELD);
const billingStatus = computed(() => {
    const status = serviceInfo[`${settings.value.PREFIX}_status`];
    if (status === 'active') return 'Active';
    if (status === 'pending') return 'Pending';
    if (status === 'expired' || status === 'canceled') return 'Expired/Canceled';
    return '';
});
const billingStatusClass = computed(() => {
    const status = serviceInfo[`${settings.value.PREFIX}_status`];
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
                    {{ serviceInfo[titleField] }}
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
        <div class="col">{{ link_display }}</div>
    </div>
    <div v-else-if="!link_display || (link && ['cancel', 'welcome_email'].includes(link))" class="row justify-content-center">
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
                    <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/backups/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
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

<style scoped></style>
