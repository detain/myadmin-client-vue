<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import Swal from 'sweetalert2';

const props = defineProps<{
    module: string;
    id: number;
    currencySymbol: string;
    memory?: string;
    hdd?: string;
}>();
const id = computed(() => props.id);
const currencySymbol = computed(() => {
    return props.currencySymbol;
});
const memory = computed(() => {
    return props.memory;
});
const hdd = computed(() => {
    return props.hdd;
});
const module = computed(() => props.module);

const siteStore = useSiteStore();
const confirm = ref(false);
const baseUrl = siteStore.getBaseUrl();
const slices = ref(0);
const nowCost = computed(() => {
    // Calculate and return the now_cost value based on the slices value
    // Replace the placeholders with the actual calculation logic
    const baseCost = 0; // Replace with the actual base cost
    const slicesMultiplier = 1; // Replace with the actual slices multiplier
    return (baseCost * slicesMultiplier).toFixed(2);
});
const diffCost = computed(() => {
    // Calculate and return the diff_cost value based on the slices value
    // Replace the placeholders with the actual calculation logic
    const baseCost = 0; // Replace with the actual base cost
    const slicesMultiplier = 1; // Replace with the actual slices multiplier
    return (baseCost * slicesMultiplier).toFixed(2);
});
const repeatCost = computed(() => {
    // Calculate and return the repeat_cost value based on the slices value
    // Replace the placeholders with the actual calculation logic
    const baseCost = 0; // Replace with the actual base cost
    const slicesMultiplier = 1; // Replace with the actual slices multiplier
    return (baseCost * slicesMultiplier).toFixed(2);
});
function submitForm() {
    let postData = {
        slices: slices.value,
    };
    fetchWrapper
        .post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/slices`, postData)
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
        <div class="col-md-7">
            <div class="card my-3">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-upload"></i>&nbsp;Upgrade / Downgrade Slices</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="slices" />

                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3">
                                    <label class="col-form-label">Upgrade / Downgrade</label>
                                </div>
                                <div class="col-md-9 b-radius form-control-sm text-muted px-4" style="background: #e7ebef; border: 1px solid #ced4da">
                                    <div class="row m-0 p-0">
                                        <div class="col-md-4 text-left">
                                            <span>CPU Cores: </span>
                                            <span id="slices_disp" class="text-bold">{{ slices }}</span>
                                        </div>
                                        <div class="col-md-4 text-center">
                                            <span>Memory: </span>
                                            <span id="ram_disp" class="text-bold">{{ memory }}</span>
                                        </div>
                                        <div class="col-md-4 text-right">
                                            <span>Disk: </span>
                                            <span id="hdd_disp" class="text-bold">{{ hdd }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3">
                                    <label for="slices" class="col-form-label">Slices ( Count )</label>
                                </div>
                                <div class="col-md-9">
                                    <input id="slices" v-model="slices" type="range" class="form-range form-control form-control-sm text-bold" min="1" max="16" step="1" />
                                    <span class="text-muted text-sm">Up to 16 Slices can be attached to a VPS.</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3">
                                    <label for="amount" class="col-form-label">Immediate Cost ( {{ currencySymbol }} )</label>
                                </div>
                                <div class="col-md-9">
                                    <input id="amount" type="hidden" class="form-control" value="1" />
                                    <input id="now_cost" class="price lead form-control form-control-sm text-bold" name="now_cost" type="text" disabled :value="nowCost" />
                                    <span class="text-muted text-sm">Prorated amount to be paid now.</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3">
                                    <label for="amount" class="col-form-label">Additional Fees ( {{ currencySymbol }} )</label>
                                </div>
                                <div class="col-md-9">
                                    <input id="diff_cost" class="price lead form-control form-control-sm text-bold" name="diff_cost" type="text" disabled :value="diffCost" />
                                    <span class="text-muted text-sm">Recurring Bill will change by this much</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3">
                                    <label for="amount" class="col-form-label">Updated VPS Cost ( {{ currencySymbol }} )</label>
                                </div>
                                <div class="col-md-9">
                                    <input id="repeat_cost" class="price lead form-control form-control-sm text-bold" name="repeat_cost" type="text" disabled :value="repeatCost" />
                                    <span class="text-muted text-sm">New invoices will cost this much</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3">
                                    <label for="confirmation">Yes I want to do this.</label>
                                </div>
                                <div class="col-md-9">
                                    <input id="confirmation" v-model="confirm" type="checkbox" name="confirm" value="yes" required />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div class="form-group">
                            <div class="row justify-content-center">
                                <button type="submit" class="btn btn-order px-3 py-2 text-sm" :disabled="!confirm">Confirm</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
