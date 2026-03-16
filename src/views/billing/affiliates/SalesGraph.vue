<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ref, onMounted, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';

const { t } = useI18n();
const siteStore = useSiteStore();

watchEffect(() => {
    siteStore.setPageHeading(`${t('affiliate.title')} - ${t('affiliate.salesGraphPage.title')}`);
    siteStore.setTitle(`${t('affiliate.title')} - ${t('affiliate.salesGraphPage.title')}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['/affiliate', t('affiliate.breadcrumb')],
        ['', t('affiliate.salesGraphPage.title')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();
const selectedPeriod = ref(365);
const chartInstance = ref<Chart | null>(null);
const colors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'];

type StatusMonthlyBreakdown = Record<'default' | 'failed' | 'rejected' | 'pending' | 'locked' | 'paid', Record<string, number>>;
type Status = keyof StatusMonthlyBreakdown;

const chartData = ref<StatusMonthlyBreakdown>({
    default: {},
    failed: {},
    rejected: {},
    pending: {},
    locked: {},
    paid: {},
});

async function updatePeriod() {
    try {
        chartData.value = await fetchWrapper.get(`${baseUrl}/affiliate/sales_graph?days=${selectedPeriod.value}`);
        const datasets: any[] = [];
        let i = 0;
        for (const label in chartData.value) {
            const status = label as Status;
            datasets.push({
                label,
                data: Object.values(chartData.value[status]),
                borderColor: colors[i % colors.length],
                fill: false,
                tension: 0.3,
            });
            i++;
        }
        const canvas = document.getElementById('canvasGraph') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        // Destroy previous chart before creating a new one
        if (chartInstance.value) {
            chartInstance.value.destroy();
        }
        chartInstance.value = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(chartData.value.default),
                datasets,
            },
            options: {
                responsive: true,
            },
        });
    } catch (error: any) {
        console.error(error);
        await Swal.fire({
            icon: 'error',
            html: `Got error ${error?.message ?? 'Unknown error'}`,
        });
    }
}

onMounted(() => {
    updatePeriod(); // initial load
});
</script>

<template>
    <div class="row justify-content-center mt-4">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><font-awesome-icon :icon="['fas', 'chart-line']" />&nbsp;{{ t('affiliate.salesGraphPage.affiliateStatusGraph') }}</h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" :title="t('common.buttons.goBack')"><font-awesome-icon :icon="['fas', 'arrow-left']" />&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form>
                        <div class="form-group row justify-content-center mb-4">
                            <label class="col-sm-2 col-form-label text-right">{{ t('affiliate.salesGraphPage.select') }}<span class="text-danger"> *</span></label>
                            <div class="col-sm-7 input-group">
                                <select v-model="selectedPeriod" class="form-control form-control-sm select2" @change="updatePeriod()">
                                    <option value="30">{{ t('affiliate.salesGraphPage.last30Days') }}</option>
                                    <option value="90">{{ t('affiliate.salesGraphPage.last3Months') }}</option>
                                    <option value="180">{{ t('affiliate.salesGraphPage.last6Months') }}</option>
                                    <option value="270">{{ t('affiliate.salesGraphPage.last9Months') }}</option>
                                    <option value="365">{{ t('affiliate.salesGraphPage.last1Year') }}</option>
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
