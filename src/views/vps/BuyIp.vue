<script setup lang="ts">
import fetchWrapper from '@/helpers/fetchWrapper.ts';
import moduleLink from '@/helpers/moduleLink.ts';

import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import useSiteStore from '@/stores/site.store.ts';

const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const ipsDetails = ref<IpDetails[]>([]);
const buyForm = ref(null);
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});
const ip_currency = ref('USD');
const ip_cost = ref(0);
function getLink() {
    if (module.value === 'vps') {
        return `view_${module.value}?id=${id.value}`;
    } else {
        return 'view_qs';
    }
}
function submitForm() {
    const formData = {
        link: 'buy_ip',
    };
    // Process the form submission or make an API request here
}

interface BuyIpResponse {
    ipsDetails: IpDetails[];
    ips: number;
    maxIps: number;
    ipCost: number;
}

interface IpDetails {
    invoices_id: string;
    invoices_description: string;
    invoices_amount: string;
    invoices_custid: string;
    invoices_type: string;
    invoices_date: string;
    invoices_group: string;
    invoices_extra: string;
    invoices_paid: string;
    invoices_module: string;
    invoices_due_date: string;
    invoices_service: string;
    invoices_deleted: string;
    invoices_currency: string;
    repeat_invoices_id: string;
    repeat_invoices_description: string;
    repeat_invoices_type: string;
    repeat_invoices_cost: string;
    repeat_invoices_custid: string;
    repeat_invoices_frequency: string;
    repeat_invoices_date: string;
    repeat_invoices_group: string;
    repeat_invoices_module: string;
    repeat_invoices_service: string;
    repeat_invoices_last_date: string;
    repeat_invoices_next_date: string;
    repeat_invoices_deleted: string;
    repeat_invoices_currency: string;
    cancel_link: string;
    ip: string;
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-map-marker-alt"></i> Additional IP Addon for your VPS</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm"><i class="fa fa-arrow-left"></i> Back</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <template v-if="ipsDetails.length > 0">
                        <h4>Existing Addon IPs</h4>
                        <table class="table-sm table">
                            <tr v-for="vpsDetail in ipsDetails" :key="vpsDetail.ip">
                                <td>Additional IP</td>
                                <td v-if="vpsDetail.ip">{{ vpsDetail.ip }}</td>
                                <td v-else>-</td>
                                <td><a v-bind:href="vpsDetail.cancel_link">Cancel</a></td>
                            </tr>
                        </table>
                    </template>
                    <template v-if="buyForm">
                        <form v-on:submit.prevent="submitForm">
                            <input type="hidden" name="link" value="buy_ip" />
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="amount" class="col-form-label">Immediate Cost ({{ ip_currency }})</label>
                                    </div>
                                    <div class="col-md-9">
                                        <input type="hidden" id="amount" class="form-control" value="1" />
                                        <input class="form-control form-control-sm" name="now_cost" type="text" disabled :value="ip_cost" />
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div class="row justify-content-center">
                                <div class="controls">
                                    <input type="submit" name="place_order" value="Place Order" class="btn btn-order px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </form>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
