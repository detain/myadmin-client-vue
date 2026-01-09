<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import { VpsInfo } from '../../types/vps';
import { QsInfo } from '../../types/qs';

import Chart from 'chart.js/auto';
const props = defineProps<{
    id: number;
    module: string;
    serviceInfo: VpsInfo | QsInfo;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const loading = ref(true);
const trafficData = ref<any>([]);
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});

onMounted(() => {
/*    const todayGraph = document.getElementById('todayGraph') as unknown as HTMLCanvasElement;
    const hourGraph = document.getElementById('hourGraph') as unknown as HTMLCanvasElement;
    const monthGraph = document.getElementById('monthGraph') as unknown as HTMLCanvasElement;
    // Initialize and configure the charts
    const todayChart = new Chart(todayGraph.getContext('2d') as CanvasRenderingContext2D, {
        type: 'line',
        data: {
            labels: [],
            datasets: [],
        },
    });
    const hourChart = new Chart(hourGraph.getContext('2d') as CanvasRenderingContext2D, {
        type: 'line',
        data: {
            labels: [],
            datasets: [],
        },
    });
    const monthChart = new Chart(monthGraph.getContext('2d') as CanvasRenderingContext2D, {
        type: 'line',
        data: {
            labels: [],
            datasets: [],
        },
    });
*/
    // Rest of the chart setup code
    // ...

    // Remember to import any required libraries before using them in the setup

    // Example:
    // import Chart from 'chart.js';
});

const loadTraffic = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${module.value}/${id.value}/traffic_usage`);
        loading.value = false;
        console.log('api success');
        console.log(response);
        trafficData.value = response;
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadTraffic();
</script>

<template>
    <div class="card shadow-none">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2"><i class="fa fa-tachometer-alt"></i> &nbsp;Bandwidth / Traffic Usage</h3>
                <div class="card-tools text-right">
                    <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col">
                    <h5 class="text-md">Today Usage</h5>
                    <canvas id="todayGraph" ref="todayGraph" width="400" height="100"></canvas>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col">
                    <h5 class="text-md">Hourly Usage</h5>
                    <canvas id="hourGraph" ref="hourGraph" width="400" height="100"></canvas>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col">
                    <h5 class="text-md">Daily Usage</h5>
                    <canvas id="monthGraph" ref="monthGraph" width="400" height="100"></canvas>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h5 class="card-title text-bold py-2"><i class="fa fa-bar-chart">&nbsp;</i>&nbsp;Statistics</h5>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <table class="table-bordered table">
                                <thead>
                                    <tr>
                                        <th>History</th>
                                        <th class="text-success">In</th>
                                        <th class="text-danger">Out</th>
                                    </tr>
                                </thead>
                                <tbody v-if="trafficData.totals">
                                    <tr>
                                        <td>Today</td>
                                        <td class="text-success">
                                            <div class="day_in">{{ trafficData.totals.day.in }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="day_out">{{ trafficData.totals.day.out }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>This Month</td>
                                        <td class="text-success">
                                            <div class="month_in">{{ trafficData.totals.month.in }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="month_out">{{ trafficData.totals.month.out }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>This Year</td>
                                        <td class="text-success">
                                            <div class="year_in">{{ trafficData.totals.year.in }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="year_out">{{ trafficData.totals.year.out }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>All</td>
                                        <td class="text-success">
                                            <div class="all_in">{{ trafficData.totals.all.in }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="all_out">{{ trafficData.totals.all.out }}</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col">
                            <table class="table-bordered table">
                                <thead>
                                    <tr>
                                        <th>Usage</th>
                                        <th class="text-success">In</th>
                                        <th class="text-danger">Out</th>
                                    </tr>
                                </thead>
                                <tbody v-if="trafficData.usage">
                                    <tr>
                                        <td><strong>Current</strong></td>
                                        <td class="text-success">
                                            <strong>
                                                <div class="current_in">{{ trafficData.usage.current.in }}</div>
                                            </strong>
                                        </td>
                                        <td class="text-danger">
                                            <strong>
                                                <div class="current_out">{{ trafficData.usage.current.in }}</div>
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Average</td>
                                        <td class="text-success">
                                            <div class="average_in">{{ trafficData.usage.average.in.value }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="average_out">{{ trafficData.usage.average.out.value }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Peak</td>
                                        <td class="text-success">
                                            <div class="peak_in">{{ trafficData.usage.peak.in }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="peak_out">{{ trafficData.usage.peak.out }}</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
