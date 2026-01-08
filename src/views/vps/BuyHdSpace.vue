<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import { VpsInfo } from '../../types/vps';
import { QsInfo } from '../../types/qs';

const props = defineProps<{
    id: number;
    module: string;
    serviceInfo: VpsInfo | QsInfo;
}>()
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();

const additional_hd = ref('');
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});
const currency_symbol = ref('');
const gbCost = ref(0);
const selectedSpace = ref(0);
function getLink() {
    if (module.value === 'vps') {
        return `view_${module.value}?id=${id.value}`;
    } else {
        return `view_qs?id=${id.value}`;
    }
}
function getAmount() {
    return (selectedSpace.value * gbCost.value).toFixed(2);
}
function submitForm() {
    // Process the form submission or make an API request here
}
onMounted(() => {
    selectedSpace.value = 1;
});
/*
  watch: {
    selectedSpace() {
      const sizeInput = document.getElementById("size");
      sizeInput.value = `${selectedSpace} GB`;
      const amountInput = document.getElementById("hdamount");
      amountInput.value = (selectedSpace * gbCost).toFixed(2);
    },
  },
  */
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-server"></i> Additional VPS Drive Space</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i> Back</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="buy_hd_space" />
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label for="slices" class="col-form-label">Cost Per Month ({{ currency_symbol }})</label>
                                </div>
                                <div class="col-md-9">
                                    <input id="hdamount" type="text" class="form-control form-control-sm" readonly :value="getAmount()" />
                                    <span class="text-muted text-sm">{{ currency_symbol }}<span id="per_ten">{{ gbCost * 10 }}</span> per 10GB per Month</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label for="slices" class="col-form-label">Additional Space</label>
                                </div>
                                <div class="col-md-9">
                                    <input id="size" name="size" type="text" class="form-control form-control-sm" readonly :value="additional_hd ? additional_hd : ''" />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label for="amount" class="col-form-label">Select Space</label>
                                </div>
                                <div class="col-md-9">
                                    <input id="hdslider" v-model="selectedSpace" type="range" class="form-range form-control form-control-sm" min="1" max="100" step="1" name="slices" />
                                    <span class="text-muted text-sm">Minimum 1 upto 100GB Additional HD Space can be purchased</span>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="controls">
                                <button name="buy_space" type="submit" class="btn btn-sm btn-order px-3 py-2">Confirm Order</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
