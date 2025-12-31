<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '../../../stores/site.store';

import Chart from 'chart.js/auto';
const siteStore = useSiteStore();
siteStore.setPageHeading('Affiliate - SalesGraph');
siteStore.setTitle('Affiliate - SalesGraph');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/affiliate', 'Affiliate'],
    ['', 'SalesGraph'],
]);

const selectedPeriod = ref(30);

function updatePeriod() {}

onMounted(() => {
    const canvas = document.getElementById('canvasGraph') as unknown as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Affiliate Sales',
                    data: [0, 10, 5, 2, 20, 30, 45],
                    borderColor: 'blue',
                    fill: false,
                },
            ],
        },
        options: {},
    });
});
</script>

<template>
    <div class="row justify-content-center mt-4">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-line-chart" aria-hidden="true">&nbsp;</i>Affiliate Status Graph</h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form>
                        <div class="form-group row justify-content-center mb-4">
                            <label class="col-sm-2 col-form-label text-right">Select<span class="text-danger"> *</span></label>
                            <div class="col-sm-7 input-group">
                                <select v-model="selectedPeriod" class="form-control form-control-sm select2" @change="updatePeriod()">
                                    <option value="30">Last 30 Days</option>
                                    <option value="90">Last 3 months</option>
                                    <option value="180">Last 6 months</option>
                                    <option value="270">Last 9 months</option>
                                    <option value="365">Last 1 year</option>
                                </select>
                            </div>
                        </div>
                    </form>
                    <div>
                        <canvas id="canvasGraph" ref="canvas" width="400" height="100"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
