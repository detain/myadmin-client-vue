<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useBackupStore, useAuthStore, useAlertStore, useLayoutStore } from '@/stores';
import $ from 'jquery';

const layoutStore = useLayoutStore();
const route = useRoute();
const id = route.params.id;
layoutStore.setPageHeading('View Backup');
layoutStore.setTitle('View Backup');
layoutStore.setBreadcrums({'/home': 'Home', '/backups': 'Storage'})
layoutStore.addBreadcrum('/backups/'+id, 'View Backup '+id);

const backupStore = useBackupStore();
const { loading, error, pkg, link_display, settings, serviceInfo, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceMaster, serviceExtra, extraInfoTables, csrf } = storeToRefs(backupStore);

backupStore.getById(id)


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
    <div v-if="link_display" class="row shadow-none">
        <div class="col">{{ link_display }}</div>
    </div>
    <div v-else-if="!link_display || (link_function && ['cancel', 'welcome_email'].includes(link_function))" class="row justify-content-center">
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
                        <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i>
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