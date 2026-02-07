<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import { moduleLink } from '@/helpers/moduleLink';

const props = defineProps<{
    id: number;
}>();

interface DeliverabilityResponse {
    id: number;
    col1: string;
    header: string;
    percent: number;
    stat: {
        bounced: number;
        delivered: number;
    };
    table_data: [string, string, string, string][];
}

const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const module = 'mail';

const route = useRoute();
const router = useRouter();

const deliverabilityData = ref<DeliverabilityResponse>({
    id: 0,
    col1: '',
    header: '',
    percent: 0,
    stat: { bounced: 0, delivered: 0 },
    table_data: [],
});

/* ---------------------------
   Filtering / Pagination
---------------------------- */

const pageSize = ref<number>(50);
const currentPage = ref<number>(1);

const filterDomain = computed(() => route.query.filter_domain === '1');

const sortedRows = computed(() => {
    return [...deliverabilityData.value.table_data].sort(
        (a, b) => Number(b[1]) - Number(a[1]) // sort by Bounces DESC
    );
});

const paginatedRows = computed(() => {
    if (pageSize.value === -1) return sortedRows.value;

    const start = (currentPage.value - 1) * pageSize.value;
    return sortedRows.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => {
    if (pageSize.value === -1) return 1;
    return Math.ceil(sortedRows.value.length / pageSize.value);
});

/* ---------------------------
   API Load
---------------------------- */

const loadDeliverability = async () => {
    try {
        const query = filterDomain.value ? '?filter_domain=1' : '';
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${props.id}/deliverability${query}`);
        deliverabilityData.value = response;
        currentPage.value = 1;
    } catch (error) {
        console.error('Deliverability API failed', error);
    }
};

watch(() => route.query.filter_domain, loadDeliverability, { immediate: true });

/* ---------------------------
   Navigation Helpers
---------------------------- */

const toggleFilter = () => {
    router.push({
        query: filterDomain.value ? {} : { filter_domain: '1' },
    });
};
</script>

<template>
    <!-- OVERALL COUNT -->
    <div class="card">
        <div class="card-header">
            <h5 class="card-title">Overall Count</h5>
            <div class="card-tools">
                <RouterLink :to="`/view_mail?id=${id}`" class="btn btn-custom btn-sm" title="Go Back"> <i class="fas fa-arrow-left"></i>&nbsp;Back </RouterLink>
            </div>
        </div>

        <div class="card-body">
            <div class="row mb-2 justify-content-center">
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="info-box shadow mb-3">
                        <span class="info-box-icon bg-info elevation-1 text-white">
                            <i class="fa fa-send-o"></i>
                        </span>
                        <div class="info-box-content">
                            <span class="info-box-text">Total Delivered</span>
                            <span class="info-box-number">
                                {{ deliverabilityData.stat.delivered.toLocaleString() }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                    <div class="info-box shadow mb-3">
                        <span class="info-box-icon bg-danger elevation-1 text-white">
                            <i class="fa fa-send-o"></i>
                        </span>
                        <div class="info-box-content">
                            <span class="info-box-text">Total Bounced</span>
                            <span class="info-box-number">
                                {{ deliverabilityData.stat.bounced.toLocaleString() }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                    <div class="info-box shadow mb-3">
                        <span class="info-box-icon bg-warning elevation-1 text-white">
                            <i class="fa fa-bullhorn"></i>
                        </span>
                        <div class="info-box-content">
                            <span class="info-box-text">Total Bounce Percent</span>
                            <span class="info-box-number"> {{ deliverabilityData.percent.toFixed(2) }}% </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- DETAIL TABLE -->
    <div class="card">
        <div class="card-header">
            <h5 class="card-title">{{ deliverabilityData.header }}</h5>
            <div class="card-tools">
                <button class="btn btn-sm btn-info" @click="toggleFilter">
                    {{ filterDomain ? 'Deliverability by Sender' : 'Deliverability by Domain' }}
                </button>
            </div>
        </div>

        <div class="card-body">
            <!-- Page Size -->
            <div class="mb-2">
                <select v-model="pageSize" class="form-control form-control-sm w-auto d-inline">
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                    <option :value="200">200</option>
                    <option :value="500">500</option>
                    <option :value="-1">All</option>
                </select>
            </div>

            <table class="table table-sm table-striped">
                <thead>
                    <tr>
                        <th>{{ deliverabilityData.col1 }}</th>
                        <th>Bounces</th>
                        <th>Delivered</th>
                        <th>Bounce%</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in paginatedRows" :key="index">
                        <td>{{ row[0] }}</td>
                        <td>{{ row[1] }}</td>
                        <td>{{ row[2] }}</td>
                        <td>{{ row[3] }}%</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div v-if="pageSize !== -1" class="mt-2">
                <button class="btn btn-sm btn-secondary mr-1" :disabled="currentPage === 1" @click="currentPage--">Prev</button>

                <span>Page {{ currentPage }} of {{ totalPages }}</span>

                <button class="btn btn-sm btn-secondary ml-1" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.info-box {
    cursor: default;
}
</style>
