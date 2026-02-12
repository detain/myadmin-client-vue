<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/stores/site.store';
import { moduleLink } from '@/helpers/moduleLink';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps<{ id: number }>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const module = 'mail';

type TimeKey = 'all' | 'billing' | 'month' | '7d' | '24h' | 'day' | '1h';

const times: Record<TimeKey, string> = {
    all: 'All Time',
    billing: 'Billing Cycle',
    month: 'This Month',
    '7d': '7 Days',
    '24h': '24 Hours',
    day: 'Today',
    '1h': '1 Hour',
};

const selectedTime = ref<TimeKey>('1h');

interface StatsData {
    usage: number;
    currencySymbol: string;
    cost: number;
    received: number;
    sent: number;
    volume: {
        to: Record<string, number>;
        from: Record<string, number>;
        ip: Record<string, number>;
    };
}

const statsData = ref<StatsData>({
    usage: 0,
    currencySymbol: '$',
    cost: 0,
    received: 0,
    sent: 0,
    volume: { to: {}, from: {}, ip: {} },
});

/* ---------------- Charts ---------------- */

const charts: Record<'to' | 'from' | 'ip', Chart | null> = {
    to: null,
    from: null,
    ip: null,
};

const CHART_COLORS = [
    '#008FFB', // blue
    '#00E396', // green
    '#FEB019', // orange
    '#FF4560', // red
    '#775DD0', // purple
    '#3F51B5', // indigo
    '#546E7A', // gray
    '#D4526E', // pink
    '#8D5B4C', // brown
    '#F86624', // other
];

const buildPieData = (data: Record<string, number>) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

    const labels: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];

    entries.forEach(([key, count], idx) => {
        const colorIndex = Math.min(idx, CHART_COLORS.length - 1);

        if (idx < 9) {
            labels.push(key ? key.substring(0, 35) : 'unknown');
            values.push(count);
            colors.push(CHART_COLORS[colorIndex]);
        } else {
            values[9] = (values[9] ?? 0) + count;
            labels[9] = 'Other';
            colors[9] = CHART_COLORS[9];
        }
    });

    return { labels, values, colors };
};

const renderChart = async (field: 'to' | 'from' | 'ip') => {
    await nextTick();

    charts[field]?.destroy();

    const canvas = document.getElementById(`piegraph-${field}`) as HTMLCanvasElement | null;

    if (!canvas) return;

    const { labels, values, colors } = buildPieData(statsData.value.volume[field]);

    charts[field] = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: colors, // ✅ COLORIZED
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        generateLabels(chart) {
                            const dataset = chart.data.datasets[0];
                            const bgColors = dataset.backgroundColor as string[];
                            return chart.data.labels!.map((label, i) => ({
                                text: `${label} - ${dataset.data[i]}`,
                                fillStyle: bgColors[i],
                                strokeStyle: '#fff',
                                index: i,
                            }));
                        },
                    },
                },
            },
        },
    });
};

const renderAllCharts = () => {
    renderChart('to');
    renderChart('from');
    renderChart('ip');
};

/* ---------------- Load ---------------- */

const loadStats = async () => {
    statsData.value = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${props.id}/stats?time=${selectedTime.value}`);

    renderAllCharts();
};

watch(selectedTime, loadStats, { immediate: true });

onBeforeUnmount(() => {
    Object.values(charts).forEach((c) => c?.destroy());
});
</script>

<template>
    <div class="container-fluid">
        <h3>Statistics for Mail Order ID {{ props.id }}</h3>

        <!-- CURRENT USAGE -->
        <div class="row">
            <div class="col-sm-12">
                <div class="card m-1">
                    <div class="card-header">Current Usage</div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-sm-4">
                                <strong>Billing Cycle</strong><br />
                                {{ times[selectedTime] }}
                            </div>
                            <div class="col-sm-4">
                                <strong>Current Usage</strong><br />
                                {{ statsData.usage }}
                            </div>
                            <div class="col-sm-4">
                                <strong>Current Cost</strong><br />
                                {{ statsData.currencySymbol }}{{ statsData.cost }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- DELIVERABILITY -->
        <div class="row">
            <div class="col-sm-12">
                <div class="card m-1">
                    <div class="card-header d-flex justify-content-between">
                        <span>Deliverability</span>
                        <div>
                            <button v-for="(label, key) in times" :key="key" class="btn btn-sm btn-primary ml-1" :class="{ active: selectedTime === key }" @click="selectedTime = key">
                                {{ label }}
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-sm-6">
                                <strong>You Sent</strong><br />
                                {{ statsData.received }}
                            </div>
                            <div class="col-sm-6">
                                <strong>We Delivered</strong><br />
                                {{ statsData.sent }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- VOLUME + TABLES -->
        <div class="row">
            <div v-for="(label, field) in { to: 'To', from: 'From', ip: 'IP' }" :key="field" class="col-sm-4">
                <div class="card m-1">
                    <div class="card-header">Volume by {{ label }} Address</div>

                    <div class="card-body">
                        <canvas :id="`piegraph-${field}`" width="400" height="400" />
                    </div>

                    <table class="table table-striped table-sm table-hover">
                        <thead>
                            <tr>
                                <th>{{ label }}</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(count, value) in statsData.volume[field]" :key="value">
                                <td class="text-overflow">
                                    <a :href="`/mail/view_mail_log?id=${props.id}&${field}=${encodeURIComponent(value)}`">
                                        {{ value || 'unknown' }}
                                    </a>
                                </td>
                                <td>{{ count }}</td>
                            </tr>

                            <tr v-if="!Object.keys(statsData.volume[field]).length">
                                <td colspan="2">There is no mail recorded yet within this timeframe.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-header {
    text-align: left;
}
.text-overflow {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
