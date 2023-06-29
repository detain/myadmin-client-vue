<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores';
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    ips_details: {
        type: Array,
        default: () => [],
    },
    buy_form: {
        type: Boolean,
        default: false,
    },
    csrf: {
        type: String,
        required: true,
    },
    ip_currency: {
        type: String,
        required: true,
    },
    im_cost: {
        type: String,
        required: true,
    },
    ip_cost: {
        type: String,
        required: true,
    },
});
const ipsDetailsExist = computed(() => props.ips_details.length > 0);
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
                            <router-link :to="'/websites/' + id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
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
                        <form method="POST" :action="`view_website?id=${id}&link=buy_ip`">
                            <input type="hidden" name="link" value="buy_ip" />
                            <input type="hidden" name="csrf_token" :value="csrf" />
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="amount" class="col-form-label">Immediate Cost ({{ ip_currency }})</label>
                                    </div>
                                    <div class="col-md-9">
                                        <input type="hidden" id="amount" class="form-control" value="1" />
                                        <input class="form-control form-control-sm" name="now_cost" type="text" disabled="disabled" :value="im_cost" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="amount" class="col-form-label">Renewal Cost</label>
                                    </div>
                                    <div class="col-md-9">
                                        <input type="hidden" id="amount" class="form-control" value="1" />
                                        <input class="form-control form-control-sm" name="now_cost" type="text" disabled="disabled" :value="ip_cost" />
                                        <small class="form-text text-muted">Cost ({{ ip_currency }}) every month as your website invoiced</small>
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
