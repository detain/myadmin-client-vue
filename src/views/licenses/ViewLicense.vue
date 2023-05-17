<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useLicenseStore, useAuthStore, useAlertStore, useLayoutStore } from '@/stores';
import $ from 'jquery';

const layoutStore = useLayoutStore();
const route = useRoute();
const id = route.params.id;
layoutStore.setPageHeading('View License');
layoutStore.setTitle('View License');
layoutStore.setBreadcrums({'/home': 'Home', '/licenses': 'Licenses'})
layoutStore.addBreadcrum('/licenses/'+id, 'View License '+id);

const licenseStore = useLicenseStore();
const { loading, error, pkg, link_display, settings, serviceInfo, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, serviceOverviewExtra, serviceType } = storeToRefs(licenseStore);

licenseStore.getById(id)

</script>

<template>
    <div class="row mt-2">
        <div :class="`col-md-${serviceOverviewExtra ? '3' : '4'}`">
            <div class="small-box bg-secondary">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Package</h3>
                    <p class="py-1 my-2">{{ pkg }}</p>
                    <p class="m-0">
                        Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="small-box-footer">
                    <b>{{ serviceInfo[settings.TITLE_FIELD] }}</b>
                </div>
            </div>
        </div>
        <div class="col-md-{{ serviceOverviewExtra ? '3' : '4' }}">
            <div :class="[
        'small-box',
        serviceInfo[`${settings.PREFIX}_status`] === 'active' ? 'bg-success' : '',
        serviceInfo[`${settings.PREFIX}_status`] === 'pending' ? 'bg-orange' : '',
        serviceInfo[`${settings.PREFIX}_status`] === 'expired' || serviceInfo[`${settings.PREFIX}_status`] === 'canceled' ? 'bg-red' : ''
      ]">
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
                <div class="small-box-footer">
                    Status is: <b>{{ serviceInfo.license_status }}</b>
                </div>
            </div>
        </div>
        <div class="col-md-{{ serviceOverviewExtra ? '3' : '4' }}">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>License Info</h3>
                    <template v-if="serviceInfo.license_hostname">
                        <p class="{{ serviceOverviewExtra ? 'mt-0' : 'py-3 my-2' }}">
                            Hostname is:<br />
                            <b>{{ serviceInfo.license_hostname }}</b>
                        </p>
                    </template>
                    <template v-if="serviceExtra && serviceType.services_category === '507'">
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
                    <div class="inner pt-3 pb-1 px-3 text-white">
                        <h3>cPanel Info</h3>
                        <template v-if="serviceOverviewExtra.cPanel_Accounts">
                            <p class="py-3 my-2">
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
    <div v-if="link_display" class="row shadow-none">
        <div class="col">{{ link_display }}</div>
    </div>
    <div v-else-if="!link_display || (link_function && link_function.includes('cancel'))" class="row row-flex">
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
                        <table class="table table-bordered">
                            <tbody>
                                <tr v-for="itemvalue in extraInfoTables.ip_info.rows" :key="itemvalue">
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
                    <template v-for="clientLink in clientLinks">
                    <a :key="clientLink.label" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip" :href="clientLink.link" v-if="clientLink.other_attr" :other_attr="clientLink.other_attr">
                        <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i>{{ clientLink.label }}
                    </a>
                    <a v-else :title="clientLink.help_text" data-toggle="tooltip" :href="clientLink.link" class="btn btn-app mb-3">
                        <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i>{{ clientLink.label }}
                    </a>
                    </template>
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
                        <table class="table table-bordered">
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
                        <table class="table table-bordered">
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

<style scoped>
</style>