<template>
    <div class="row mt-2">
        <Package :pkg :inv-next-date="billingDetails.service_next_invoice_date" :host="serviceInfo.scrub_ip_ip" />
        <Billing :service-status="serviceInfo.scrub_ip_status" :currency-symbol="billingDetails.service_currency_symbol" :cost="cost" :frequency="billingDetails.service_frequency" />
        <InfoBox :heading="'Current IP'" :key1="'IP Address'" :val1="serviceInfo.scrub_ip_ip" :icon-class="'fas fa-info-circle'" :icon-name="' '" :footer-key="'IP from service'" :footer-val="footer_val ? footer_val : 'N/A'" :bg-class="'bg-info'" />
    </div>
    <div class="row row-flex py-4">
        <div class="col-md-6">
            <ClientLinks :id="Number(id)" :client-links="clientLinks" :module="module" />
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-plug">&nbsp;</i> {{ extraInfoTables[module]?.title }}</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                <i class="fas fa-minus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body my-3">
                    <table class="table table-bordered">
                        <tbody>
                            <tr v-for="row in extraInfoTables[module]?.rows" :key="row.id">
                                <td>{{ row.desc }}</td>
                                <td class="text-success">{{ row.value }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <GeoFirewallRules :id="Number(id)" :geo-firewall-rules="geoFirewallRules" />
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <FirewallRules :id="Number(id)" :firewall-rules="firewallRules" />
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <Filters :id="Number(id)" :filters="filterRules" :filter_types="filterTypes" :base_url="siteStore.getBaseUrl()" :ip="serviceInfo.scrub_ip_ip" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useSiteStore } from '@/stores/site.store';
import { useScrubIpStore } from '@/stores/scrub_ips.store';
import { moduleLink } from '@/helpers/moduleLink';
import { ucwords } from '@/helpers/ucwords';
import Package from '@/components/services/view_service/Package.vue';
import Billing from '@/components/services/view_service/Billing.vue';
import InfoBox from '@/components/services/view_service/InfoBox.vue';
import ClientLinks from '@/components/services/view_service/ClientLinks.vue';
import Filters from '@/views/scrub_ips/Filters.vue';
import FirewallRules from '@/views/scrub_ips/FirewallRules.vue';
import GeoFirewallRules from '@/views/scrub_ips/GeoFirewallRules.vue';

const scrubIpStore = useScrubIpStore();
const module = 'scrub_ips';
const siteStore = useSiteStore();
const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const link = computed(() => route.params.link);
const { modules } = storeToRefs(siteStore);
const settings = computed(() => modules.value[module]);
const scrubStore = scrubIpStore.getByID(id);
siteStore.setPageHeading('View Scrub IPs');
siteStore.setTitle('View Scrub IPs');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Scrub IPs'],
]);
siteStore.addBreadcrum(`/${moduleLink(module)}/${id}`, `View Scrub IPs`);

const { loading, error, serviceInfo, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, 
    extraInfoTables, serviceType, pkg, linkDisplay, firewallRules, geoFirewallRules, filterRules, filterTypes } = storeToRefs(scrubIpStore);

const footer_val = computed(() => {
    let val = '';
    if (serviceInfo.value.scrub_ip_service_module) {
        val = ucwords(serviceInfo.value.scrub_ip_service_module.replace('_', ' '));
    }
    if (serviceInfo.value.scrub_ip_service_id) {
        val += ` - ${serviceInfo.value.scrub_ip_service_id}`;
    }
    return val;
});
const cost = computed(() => Number(billingDetails.value.service_cost_info).toFixed(2));
</script>
