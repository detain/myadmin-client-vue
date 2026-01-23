<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { useSiteStore } from '../../stores/site.store';
import { VpsInfo } from '../../types/vps';
import { QsInfo } from '../../types/qs';
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

const props = defineProps<{
    id: number;
    module: string;
    serviceInfo: VpsInfo | QsInfo;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const loading = ref(true);
const trafficData = ref<any>([]);
const id = computed(() => props.id);
const module = computed(() => props.module);

Chart.register(...registerables);

const metric = ref<'bits' | 'bytes'>('bits');

const todayCanvas = ref<HTMLCanvasElement | null>(null);
const hourCanvas = ref<HTMLCanvasElement | null>(null);
const dayCanvas = ref<HTMLCanvasElement | null>(null);

let charts: Chart[] = [];
let intervalId: number;

const loadTraffic = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${module.value}/${id.value}/traffic_usage?metric=${metric.value}`);
        trafficData.value = response;
        loading.value = false;
        renderCharts();
    } catch (e) {
        console.error(e);
    }
};

const formatData = (value: number, perSecond = false) => {
    const isBytes = metric.value === 'bytes';
    const multiplier = isBytes ? 1 : 8;
    const unit = isBytes ? 'Bytes' : 'Bits';
    let result: string;
    if (value > 1073741824) {
        result = `${((value / 1073741824) * multiplier).toFixed(2)} G${unit}`;
    } else if (value > 1048576) {
        result = `${((value / 1048576) * multiplier).toFixed(2)} M${unit}`;
    } else if (value > 1024) {
        result = `${((value / 1024) * multiplier).toFixed(2)} K${unit}`;
    } else {
        result = `${(value * multiplier).toFixed(2)} ${unit}`;
    }
    return perSecond ? `${result}/s` : result;
};

const destroyCharts = () => {
    charts.forEach((c) => c.destroy());
    charts = [];
};

const renderCharts = () => {
    if (!trafficData.value) return;
    destroyCharts();
    const today = trafficData.value.data;
    const hour = trafficData.value.history.hour.data;
    const day = trafficData.value.history.day.data;
    charts.push(
        new Chart(todayCanvas.value!, {
            type: 'line',
            data: {
                labels: today[0].data.map((d: any) => d[0]),
                datasets: [
                    {
                        label: today[0].name,
                        data: today[0].data.map((d: any) => d[1]),
                        borderColor: 'rgba(54,162,235,1)',
                    },
                    {
                        label: today[1].name,
                        data: today[1].data.map((d: any) => d[1]),
                        borderColor: 'rgba(255,206,86,1)',
                    },
                ],
            },
        }),
        new Chart(hourCanvas.value!, {
            type: 'line',
            data: {
                labels: hour.map((d: any) => d[0]),
                datasets: [
                    {
                        label: 'Hourly Usage',
                        data: hour.map((d: any) => d[1]),
                        borderColor: 'rgba(75,192,192,1)',
                    },
                ],
            },
        }),
        new Chart(dayCanvas.value!, {
            type: 'line',
            data: {
                labels: day.map((d: any) => d[0]),
                datasets: [
                    {
                        label: 'Daily Usage',
                        data: day.map((d: any) => d[1]),
                        borderColor: 'rgba(153,102,255,1)',
                    },
                ],
            },
        })
    );
};

const historyRows = computed(() => {
    const t = trafficData.value?.totals || {};
    return [
        { key: 'today', label: 'Today', in: formatData(t.day?.in || 0), out: formatData(t.day?.out || 0) },
        { key: 'month', label: 'This Month', in: formatData(t.month?.in || 0), out: formatData(t.month?.out || 0) },
        { key: 'year', label: 'This Year', in: formatData(t.year?.in || 0), out: formatData(t.year?.out || 0) },
        { key: 'all', label: 'All', in: formatData(t.all?.in || 0), out: formatData(t.all?.out || 0) },
    ];
});

const usageRows = computed(() => {
    const u = trafficData.value?.usage || {};
    return [
        { key: 'current', label: 'Current', in: formatData(u.current?.in || 0, true), out: formatData(u.current?.out || 0, true), bold: true },
        { key: 'average', label: 'Average', in: formatData(u.average?.in?.value || 0, true), out: formatData(u.average?.out?.value || 0, true) },
        { key: 'peak', label: 'Peak', in: formatData(u.peak?.in || 0, true), out: formatData(u.peak?.out || 0, true) },
    ];
});

watch(metric, loadTraffic);

onMounted(() => {
    loadTraffic();
    intervalId = window.setInterval(loadTraffic, 1000 * 60 * 5);
});

onBeforeUnmount(() => {
    destroyCharts();
    clearInterval(intervalId);
});
</script>

<template>
    <div class="card shadow-none">
        <div class="card-header">
            <div class="p-1 d-flex justify-content-between align-items-center flex-wrap">
                <div class="d-flex align-items-center">
                    <h3 class="card-title py-2 mb-0"><i class="fa fa-tachometer-alt"></i>&nbsp;Bandwidth / Traffic Usage</h3>
                    <div class="metric-toggle-container ml-4">
                        <span class="toggle-label mr-2">Display in:</span>
                        <div class="metric-toggle">
                            <input id="bits-metric" v-model="metric" type="radio" value="bits" />
                            <label for="bits-metric">bits</label>
                            <input id="bytes-metric" v-model="metric" type="radio" value="bytes" />
                            <label for="bytes-metric">bytes</label>
                        </div>
                    </div>
                </div>
                <div class="card-tools">
                    <router-link :to="'/' + moduleLink(module) + '/' + id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"> <i class="fa fa-arrow-left"></i>&nbsp;Back </router-link>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="alert alert-info">
                <strong><i class="fa fa-warning"></i>&nbsp;Note:</strong>
                This is not used for billing calculations and is an estimate only based on your virtual network cards.
            </div>
            <div class="row">
                <div class="col">
                    <h5>Today Usage</h5>
                    <canvas ref="todayCanvas"></canvas>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col">
                    <h5>Hourly Usage</h5>
                    <canvas ref="hourCanvas"></canvas>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col">
                    <h5>Daily Usage</h5>
                    <canvas ref="dayCanvas"></canvas>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="card-title text-bold"><i class="fa fa-bar-chart"></i>&nbsp;Statistics</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>History</th>
                                        <th class="text-success">In</th>
                                        <th class="text-danger">Out</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in historyRows" :key="row.key">
                                        <td>{{ row.label }}</td>
                                        <td class="text-success">{{ row.in }}</td>
                                        <td class="text-danger">{{ row.out }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Usage</th>
                                        <th class="text-success">In</th>
                                        <th class="text-danger">Out</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in usageRows" :key="row.key">
                                        <td>
                                            <strong v-if="row.bold">{{ row.label }}</strong
                                            ><span v-else>{{ row.label }}</span>
                                        </td>
                                        <td class="text-success">{{ row.in }}</td>
                                        <td class="text-danger">{{ row.out }}</td>
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
.metric-toggle-container {
    display: flex;
    align-items: center;
    gap: 12px;
}

.toggle-label {
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
    transition: color 0.3s ease;
}

.metric-toggle {
    display: inline-flex;
    background: #e9ecef;
    border-radius: 8px;
    padding: 4px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease;
}

.metric-toggle input[type='radio'] {
    display: none;
}

.metric-toggle label {
    padding: 8px 20px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6c757d;
    user-select: none;
    margin: 0;
}

.metric-toggle label:hover {
    color: #2c3e50;
}

.metric-toggle input[type='radio']:checked + label {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}
body.dark-mode .toggle-label {
    color: #bdc3c7;
}

body.dark-mode .metric-toggle {
    background: #1a252f;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

body.dark-mode .metric-toggle label {
    color: #95a5a6;
}

body.dark-mode .metric-toggle label:hover {
    color: #ecf0f1;
}

body.dark-mode .metric-toggle input[type='radio']:checked + label {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
}
.pill-toggle {
    display: inline-flex;
    background: #e9ecef;
    border-radius: 50px;
    padding: 3px;
    border: 2px solid #dee2e6;
    transition: all 0.3s ease;
}

.pill-toggle input[type='radio'] {
    display: none;
}

.pill-toggle label {
    padding: 6px 18px;
    cursor: pointer;
    border-radius: 50px;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6c757d;
    user-select: none;
    margin: 0;
}

.pill-toggle label:hover {
    color: #2c3e50;
}

.pill-toggle input[type='radio']:checked + label {
    background: #3498db;
    color: white;
    box-shadow: 0 2px 6px rgba(52, 152, 219, 0.3);
}
body.dark-mode .pill-toggle {
    background: #1a252f;
    border-color: #2c3e50;
}

body.dark-mode .pill-toggle label {
    color: #95a5a6;
}

body.dark-mode .pill-toggle label:hover {
    color: #ecf0f1;
}

body.dark-mode .pill-toggle input[type='radio']:checked + label {
    background: #3498db;
    color: white;
    box-shadow: 0 2px 6px rgba(52, 152, 219, 0.3);
}
.badge-toggle {
    display: inline-flex;
    gap: 8px;
}

.badge-toggle input[type='radio'] {
    display: none;
}

.badge-toggle label {
    padding: 8px 18px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    font-weight: 600;
    color: #6c757d;
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    user-select: none;
    margin: 0;
}

.badge-toggle label:hover {
    border-color: #3498db;
    color: #2c3e50;
}

.badge-toggle input[type='radio']:checked + label {
    background: #3498db;
    color: white;
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

body.dark-mode .badge-toggle label {
    color: #95a5a6;
    background: #1a252f;
    border-color: #2c3e50;
}

body.dark-mode .badge-toggle label:hover {
    border-color: #3498db;
    color: #ecf0f1;
}

body.dark-mode .badge-toggle input[type='radio']:checked + label {
    background: #3498db;
    color: white;
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
}
</style>
