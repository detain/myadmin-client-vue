<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores';
import Chart from 'chart.js';
const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const todayGraph = ref(null);
const hourGraph = ref(null);
const monthGraph = ref(null);
const id = ref(props.id);
const module = ref(props.module);

const goBackLink = computed(() => {
    return module.value === 'vps' ? `view_${module.value}` : 'view_qs';
});
onMounted(() => {
    // Initialize and configure the charts
    const todayChart = new Chart(todayGraph.value.getContext('2d'), {
        /* Chart configuration */
    });
    const hourChart = new Chart(hourGraph.value.getContext('2d'), {
        /* Chart configuration */
    });
    const monthChart = new Chart(monthGraph.value.getContext('2d'), {
        /* Chart configuration */
    });

    // Rest of the chart setup code
    // ...

    // Remember to import any required libraries before using them in the setup

    // Example:
    // import Chart from 'chart.js';
});
</script>

<template>
    <div class="card shadow-none">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2"><i class="fa fa-tachometer-alt"></i> &nbsp;Bandwidth / Traffic Usage</h3>
                <div class="card-tools text-right">
                    <router-link :to="'/vps/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col">
                    <h5 class="text-md">Today Usage</h5>
                    <canvas ref="todayGraph" width="400" height="100"></canvas>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col">
                    <h5 class="text-md">Hourly Usage</h5>
                    <canvas ref="hourGraph" width="400" height="100"></canvas>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col">
                    <h5 class="text-md">Daily Usage</h5>
                    <canvas ref="monthGraph" width="400" height="100"></canvas>
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
                                <tbody>
                                    <tr>
                                        <td>Today</td>
                                        <td class="text-success">
                                            <div class="day_in"></div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="day_out"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>This Month</td>
                                        <td class="text-success">
                                            <div class="month_in"></div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="month_out"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>This Year</td>
                                        <td class="text-success">
                                            <div class="year_in"></div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="year_out"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>All</td>
                                        <td class="text-success">
                                            <div class="all_in"></div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="all_out"></div>
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
                                <tbody>
                                    <tr>
                                        <td><strong>Current</strong></td>
                                        <td class="text-success">
                                            <strong>
                                                <div class="current_in"></div>
                                            </strong>
                                        </td>
                                        <td class="text-danger">
                                            <strong>
                                                <div class="current_out"></div>
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Average</td>
                                        <td class="text-success">
                                            <div class="average_in"></div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="average_out"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Peak</td>
                                        <td class="text-success">
                                            <div class="peak_in"></div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="peak_out"></div>
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

<style scoped>
@import url('/node_modules/chart.js/dist/Chart.min.css');
</style>
