<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';

const module: string = 'webhosting';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const router = useRouter();

const props = defineProps<{
    id: number;
}>();
const id = computed(() => props.id);

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

const ipsDetails = ref<IpDetails[]>([]);
const ipCount = ref(0);
const ipCost = ref('0.00');
const ipCurrencySymbol = ref('$');
const ipCurrency = ref('USD');
const loadingDone = ref(false);

const ipsDetailsExist = computed(() => ipsDetails.value.length > 0);
const ipCostFormatted = computed(() => parseFloat(ipCost.value).toFixed(2));

function loadBuyIp() {
    Swal.fire({
        title: '',
        html: '<i class="fas fa-spinner fa-pulse"></i> Loading IP information...',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .get(`${baseUrl}/${moduleLink(module)}/${id.value}/buy_ip`)
        .then((response) => {
            Swal.close();
            loadingDone.value = true;
            ipsDetails.value = response.ipsDetails || [];
            ipCount.value = response.ipCount || 0;
            ipCost.value = String(response.ipCost || 0);
            ipCurrency.value = response.currency || 'USD';
            ipCurrencySymbol.value = response.currencySymbol || '$';
        })
        .catch((error: any) => {
            Swal.fire({
                icon: 'error',
                html: error?.text || error?.error || 'Failed to load IP information.',
            });
            loadingDone.value = true;
        });
}

function submitForm() {
    Swal.fire({
        title: 'Confirm Purchase',
        html: `<p>Additional IP cost: <b>${ipCurrencySymbol.value}${ipCostFormatted.value}</b>/month</p><p>Are you sure you want to order an additional IP?</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Place Order',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: '<i class="fas fa-spinner fa-pulse"></i> Ordering additional IP...',
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            fetchWrapper
                .post(`${baseUrl}/${moduleLink(module)}/${id.value}/buy_ip`, { action: 'buy_ip' })
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Order Placed',
                        html: response.text || 'Additional IP ordered successfully!',
                    }).then(() => {
                        loadBuyIp();
                    });
                })
                .catch((error: any) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        html: error?.text || error?.error || 'Failed to order additional IP.',
                    });
                });
        }
    });
}

loadBuyIp();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fas fa-map-marker-alt"></i>&nbsp;
                            Buy Additional IP Addon
                        </h3>
                        <div class="card-tools float-end">
                            <router-link :to="'/' + moduleLink(module) + '/' + id" class="btn btn-custom btn-sm" data-bs-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left"></i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <template v-if="ipsDetailsExist">
                        <h5 class="mb-3"><i class="fas fa-list"></i>&nbsp; Existing Addon IPs</h5>
                        <table class="table-sm table-bordered table">
                            <tr v-for="websiteDetail in ipsDetails" :key="websiteDetail.ip">
                                <td>Additional IP</td>
                                <td>
                                    <template v-if="websiteDetail.ip && typeof websiteDetail.ip !== 'undefined'">
                                        {{ websiteDetail.ip }}
                                    </template>
                                    <template v-else> - </template>
                                </td>
                                <td><a :href="websiteDetail.cancel_link" class="text-danger">Cancel</a></td>
                            </tr>
                        </table>
                        <hr />
                    </template>
                    <template v-if="loadingDone">
                        <form method="POST" @submit.prevent="submitForm">
                            <div class="mb-3">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label class="col-form-label">Monthly Cost ({{ ipCurrencySymbol }})</label>
                                    </div>
                                    <div class="col-md-9">
                                        <input class="form-control form-control-sm" type="text" disabled :value="ipCostFormatted" />
                                        <small class="form-text text-muted">Cost ({{ ipCurrencySymbol }}) every month as your website is invoiced</small>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div class="row">
                                <div class="controls col-md-12" style="text-align: center">
                                    <input type="submit" name="place_order" value="Place Order" class="btn btn-sm btn-order px-3 py-2" />
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
