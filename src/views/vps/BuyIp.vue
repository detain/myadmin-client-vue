<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { useRouter, RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import { VpsInfo } from '@/types/vps';
import { QsInfo } from '@/types/qs';
import Swal from 'sweetalert2';
const props = defineProps<{
    id: number;
    module: string;
    currencySymbol: string;
    serviceInfo: VpsInfo | QsInfo;
}>();
const siteStore = useSiteStore();
const router = useRouter();
const baseUrl = siteStore.getBaseUrl();
const ipsDetails = ref<IpDetails[]>([]);
const buyForm = ref(false);
const id = computed(() => props.id);
const module = computed(() => props.module);
const maxIps = ref(1);
const ipCount = ref(0);
const loading = ref(true);
const ipCurrency = ref('USD');
const ipCurrencySymbol = ref('$');
const ipCost = ref(0);

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

function submitForm() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper.post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/buy_ip`, {}).then((response) => {
            Swal.close();
            console.log('webhosting buy ip');
            console.log(response);
            Swal.fire({
                icon: 'success',
                html: `Success${response.text}`,
            });
            router.push(`/cart/${response.invoice}`);
        });
    } catch (error: any) {
        Swal.close();
        console.log('webhosting buy ip');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

const loadBuyIp = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${module.value}/${id.value}/buy_ip`);
        loading.value = false;
        console.log('api success');
        console.log(response);
        ipsDetails.value = response.ipsDetails;
        ipCost.value = response.ipCost;
        maxIps.value = response.maxIps;
        ipCount.value = response.ipCount;
        if (ipCount.value < maxIps.value) {
            buyForm.value = true;
        }
        ipCurrency.value = response.currency;
        ipCurrencySymbol.value = response.currencySymbol;
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadBuyIp();
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
                                <td><a :href="vpsDetail.cancel_link">Cancel</a></td>
                            </tr>
                        </table>
                    </template>
                    <template v-if="buyForm">
                        <form @submit.prevent="submitForm">
                            <input type="hidden" name="link" value="buy_ip" />
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="amount" class="col-form-label">Immediate Cost ({{ ipCurrency }})</label>
                                    </div>
                                    <div class="col-md-9">
                                        <input id="amount" type="hidden" class="form-control" value="1" />
                                        <input class="form-control form-control-sm" name="now_cost" type="text" disabled :value="ipCost" />
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
