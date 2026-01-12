<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { useSiteStore } from '../../stores/site.store';
import { VpsInfo } from '../../types/vps';
import { QsInfo } from '../../types/qs';
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import {
    Chart,
    LineController,
    BarController,
    LineElement,
    BarElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(
    LineController,
    BarController,
    LineElement,
    BarElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
    Filler
);

const todayGraph = ref<HTMLCanvasElement | null>(null);
const hourGraph = ref<HTMLCanvasElement | null>(null);
const monthGraph = ref<HTMLCanvasElement | null>(null);

let todayChart: Chart | null = null;
let hourChart: Chart | null = null;
let monthChart: Chart | null = null;

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

const metric = ref<'bits' | 'bytes'>('bits');

function formatTotal(val: number, metricType = metric.value) {
    const unit = metricType === 'bits' ? 'b' : 'B';

    if (val > 1073741824) return `${Math.ceil(val / 1073741824)} G${unit}`;
    if (val > 1048576)    return `${Math.ceil(val / 1048576)} M${unit}`;
    if (val > 1024)       return `${Math.ceil(val / 1024)} K${unit}`;

    return `${val} ${unit}`;
}

function formatBandwidth(val: number, metricType = metric.value) {
    return `${formatTotal(val, metricType)}/s`;
}

const currentIn = computed(() => formatBandwidth(trafficData.value.usage.current.in, metric.value));
const currentOut = computed(() => formatBandwidth(trafficData.value.usage.current.out, metric.value));
const peakIn = computed(() => formatBandwidth(trafficData.value.usage.peak.in, metric.value));
const peakOut = computed(() => formatBandwidth(trafficData.value.usage.peak.out, metric.value));
const avgIn = computed(() => formatBandwidth(trafficData.value.usage.average.in.value, metric.value));
const avgOut = computed(() => formatBandwidth(trafficData.value.usage.average.out.value, metric.value));

const dayIn = computed(() => formatTotal(trafficData.value.totals.day.in, metric.value));
const dayOut = computed(() => formatTotal(trafficData.value.totals.day.out, metric.value));
const monthIn = computed(() => formatTotal(trafficData.value.totals.month.in, metric.value));
const monthOut = computed(() => formatTotal(trafficData.value.totals.month.out, metric.value));
const yearIn = computed(() => formatTotal(trafficData.value.totals.year.in, metric.value));
const yearOut = computed(() => formatTotal(trafficData.value.totals.year.out, metric.value));
const allIn = computed(() => formatTotal(trafficData.value.totals.all.in, metric.value));
const allOut = computed(() => formatTotal(trafficData.value.totals.all.out, metric.value));

onMounted(async () => {
    await loadTraffic();

    buildTodayChart();
    buildHourChart();
    buildDayChart();

    pollTimer = window.setInterval(
        pollTraffic,
        trafficData.value.interval * 1000
    );
});

onBeforeUnmount(() => {
    if (pollTimer) clearInterval(pollTimer);
    todayChart?.destroy();
    hourChart?.destroy();
    monthChart?.destroy();
});

let pollTimer: number | null = null;

async function pollTraffic() {
    if (!trafficData.value) return;

    const lastTs = trafficData.value.last;

    const json = await fetchWrapper.get(
        `${baseUrl}/${module.value}/${id.value}/traffic_usage?ts=${lastTs}`
    );

    trafficData.value.last = json.last;

    // current
    trafficData.value.usage.current = json.usage.current;

    // peak
    if (
        json.usage.peak.in + json.usage.peak.out >
        trafficData.value.usage.peak.in + trafficData.value.usage.peak.out
    ) {
        trafficData.value.usage.peak = json.usage.peak;
    }

    // averages
    for (const dir of ['in', 'out'] as const) {
        const avg = trafficData.value.usage.average[dir];
        avg.total += json.usage.average[dir].total;
        avg.count += json.usage.average[dir].count;
        avg.value = Math.ceil(avg.total / avg.count);
    }

    // append chart data
    if (json.data?.length && todayChart) {
        json.data.forEach((s: any, idx: number) => {
            todayChart!.data.datasets[idx].data.push(
                ...s.data.map((p: any) => ({ x: p[0], y: p[1] }))
            );
        });

        todayChart.update('none');
    }
}

function buildTodayChart() {
    if (!todayGraph.value || !trafficData.value?.data) return;

    todayChart?.destroy();

    todayChart = new Chart(todayGraph.value, {
        type: 'line',
        data: {
            datasets: trafficData.value.data.map((s: any) => ({
                label: s.name,
                data: s.data.map((p: any) => ({ x: p[0], y: p[1] })),
                fill: true,
                tension: 0.4
            }))
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => formatBandwidth(ctx.parsed.y)
                    }
                }
            },
            scales: {
                x: { type: 'time' },
                y: {
                    ticks: {
                        callback: v => formatBandwidth(Number(v))
                    }
                }
            }
        }
    });
}

function buildHourChart() {
    if (!hourGraph.value || !trafficData.value?.history?.hour) return;

    hourChart?.destroy();

    hourChart = new Chart(hourGraph.value, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'Bandwidth Used',
                data: trafficData.value.history.hour.data.map((p: any) => ({
                    x: p[0],
                    y: p[1]
                }))
            }]
        },
        options: {
            scales: {
                x: { type: 'time' },
                y: {
                    ticks: {
                        callback: v => formatTotal(Number(v))
                    }
                }
            }
        }
    });
}

function buildDayChart() {
    if (!monthGraph.value || !trafficData.value?.history?.day) return;

    monthChart?.destroy();

    monthChart = new Chart(monthGraph.value, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'Bandwidth Used',
                data: trafficData.value.history.day.data.map((p: any) => ({
                    x: p[0],
                    y: p[1]
                }))
            }]
        },
        options: {
            scales: {
                x: { type: 'time' },
                y: {
                    ticks: {
                        callback: v => formatTotal(Number(v))
                    }
                }
            }
        }
    });
}


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
                                            <div class="day_in">{{ dayIn }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="day_out">{{ dayOut }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>This Month</td>
                                        <td class="text-success">
                                            <div class="month_in">{{ monthIn }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="month_out">{{ monthOut }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>This Year</td>
                                        <td class="text-success">
                                            <div class="year_in">{{ yearIn }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="year_out">{{ yearOut }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>All</td>
                                        <td class="text-success">
                                            <div class="all_in">{{ allIn }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="all_out">{{ allOut }}</div>
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
                                                <div class="current_in">{{ currentIn }}</div>
                                            </strong>
                                        </td>
                                        <td class="text-danger">
                                            <strong>
                                                <div class="current_out">{{ currentOut }}</div>
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Average</td>
                                        <td class="text-success">
                                            <div class="average_in">{{ avgIn }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="average_out">{{ avgOut }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Peak</td>
                                        <td class="text-success">
                                            <div class="peak_in">{{ peakIn }}</div>
                                        </td>
                                        <td class="text-danger">
                                            <div class="peak_out">{{ peakOut }}</div>
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
