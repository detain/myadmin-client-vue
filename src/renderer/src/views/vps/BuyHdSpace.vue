<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import { VpsInfo } from '../../types/vps';
import { QsInfo } from '../../types/qs';
import Swal from "sweetalert2";

interface Props {
    gbCost?: number
    currencySymbol: string
    module: string
    id: string | number
    additionalHd?: number
    serviceInfo: VpsInfo | QsInfo
}

const props = defineProps<Props>()
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const slider = ref<number>(props.additionalHd ?? 1)
const gbCost = computed<number>(() => (props.gbCost ?? 0.1));
const sizeLabel = computed<string>(() => `${slider.value} GB`)
const perTen = computed<string>(() => (gbCost.value * 10).toFixed(2))
const amount = computed<string>(() => (slider.value * gbCost.value).toFixed(2))
const id = computed(() => props.id);
const module = computed(() => props.module);

function submitForm() {
    let postData = {
        amount: slider.value,
    };
    fetchWrapper
        .post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/buy_hd_space`, postData)
        .then((response: any) => {
            console.log('api success');
            console.log(response);
            Swal.fire({
                icon: 'success',
                html: response.message,
            });
        })
        .catch((error: any) => {
            console.log('api failed');
            console.log(error);
            Swal.fire({
                icon: 'error',
                html: `Got error ${error.message}`,
            });
        });
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-server"></i>&nbsp;Additional VPS Drive Space
                        </h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i> Back</router-link>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <form method="POST">
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label class="col-form-label">Cost Per Month ({{ currencySymbol }})</label>
                                </div>
                                <div class="col-md-9">
                                    <input type="text" class="form-control form-control-sm" :value="amount" readonly />
                                    <span class="text-muted text-sm">{{ currencySymbol }}{{ perTen }} per 10GB per Month</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label class="col-form-label">Additional Space</label>
                                </div>
                                <div class="col-md-9">
                                    <input name="size" type="text" class="form-control form-control-sm" :value="sizeLabel" readonly />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label class="col-form-label">Select Space</label>
                                </div>
                                <div class="col-md-9">
                                    <input v-model.number="slider" type="range" class="form-range form-control form-control-sm" min="1" max="100" step="1" name="slices" />
                                    <span class="text-muted text-sm">Minimum 1 upto 100GB Additional HD Space can be purchased</span>
                                </div>
                            </div>
                        </div>

                        <div class="row justify-content-center">
                            <div class="controls">
                                <button type="submit" class="btn btn-sm btn-order px-3 py-2" @click.prevent="submitForm">Confirm Order</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
