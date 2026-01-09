<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import Swal from 'sweetalert2';

const module: string = 'webhosting';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();

const props = defineProps<{
    id: number;
    ipsDetails: IpDetails[];
    buyForm: boolean;
    ipCurrency: string;
    imCost: string;
    ipCost: string;
}>();
const id = computed(() => {
    return props.id;
});
const ipsDetailsExist = computed(() => props.ipsDetails.length > 0);
const buyForm = computed(() => props.buyForm);

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
        fetchWrapper.post(`${baseUrl}/${moduleLink(module)}/${id.value}/buy_ip`, {}).then((response) => {
            Swal.close();
            console.log('webhosting buy ip');
            console.log(response);
            Swal.fire({
                icon: 'success',
                html: `Success${response.text}`,
            });
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
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-map-marker-alt">&nbsp;</i>
                            <template v-if="ipsDetailsExist">Existing Addon IPs</template>
                            <template v-else-if="buyForm">Buy Additional IP Addon</template>
                        </h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <template v-if="ipsDetailsExist">
                        <table class="table-sm table-bordered table">
                            <tr v-for="websiteDetail in ipsDetails" :key="websiteDetail.ip">
                                <td>Additional IP</td>
                                <td>
                                    <template v-if="websiteDetail.ip && typeof websiteDetail.ip !== 'undefined'">
                                        {{ websiteDetail.ip }}
                                    </template>
                                    <template v-else> - </template>
                                </td>
                                <td><a :href="websiteDetail.cancel_link">Cancel</a></td>
                            </tr>
                        </table>
                        <hr />
                    </template>
                    <template v-if="buyForm">
                        <form method="POST" @submit.prevent="submitForm">
                            <input type="hidden" name="link" value="buy_ip" />
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="amount" class="col-form-label">Immediate Cost ({{ ipCurrency }})</label>
                                    </div>
                                    <div class="col-md-9">
                                        <input id="amount" type="hidden" class="form-control" value="1" />
                                        <input class="form-control form-control-sm" name="now_cost" type="text" disabled :value="imCost" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="amount" class="col-form-label">Renewal Cost</label>
                                    </div>
                                    <div class="col-md-9">
                                        <input id="amount" type="hidden" class="form-control" value="1" />
                                        <input class="form-control form-control-sm" name="now_cost" type="text" disabled :value="ipCost" />
                                        <small class="form-text text-muted">Cost ({{ ipCurrency }}) every month as your website invoiced</small>
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
