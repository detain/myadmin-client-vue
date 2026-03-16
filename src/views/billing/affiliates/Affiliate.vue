<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '@/stores/site.store';
import { useAccountStore } from '@/stores/account.store';
import { useAuthStore } from '@/stores/auth.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import Swal from 'sweetalert2';

const accountStore = useAccountStore();
const siteStore = useSiteStore();
const authStore = useAuthStore();
const baseUrl = siteStore.getBaseUrl();

siteStore.setPageHeading('Affiliate System');
siteStore.setTitle('Affiliate System');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Affiliate'],
]);

const { custid, data } = storeToRefs(accountStore);
const affiliate_amount = ref(data.value.affiliate_amount || 100);

/* ------------------ signups state ------------------ */
const activeTab = ref<'default' | 'pending' | 'paid' | 'failed'>('default');
const signupsData = ref<any[][]>([]);
const signupsLoading = ref(false);
const searchText = ref('');
const pageSize = ref(25);
const currentPage = ref(1);
const sortCol = ref(3); // default sort by Signup Date column
const sortDir = ref<'asc' | 'desc'>('desc');

/* ------------------ columns per tab ------------------ */
const tabColumns: Record<string, string[]> = {
    default: ['ID', 'SID', 'Service', 'Signup Date', 'Activation Date', 'Days Active', 'Status'],
    pending: ['ID', 'SID', 'Service', 'Signup Date', 'Activation Date', 'Days Active', 'Status'],
    paid: ['ID', 'SID', 'Service', 'Signup Date', 'Activation Date', 'Paid Amount', 'Paid Date', 'Days Active', 'Status'],
    failed: ['ID', 'SID', 'Service', 'Signup Date', 'Activation Date', 'Status', 'Reason'],
};

const columns = computed(() => tabColumns[activeTab.value]);

/* ------------------ fetch signups ------------------ */
async function loadSignups(status: string) {
    signupsLoading.value = true;
    try {
        const response = await fetchWrapper.get(`${baseUrl}/affiliate/signups?st=${status}`);
        signupsData.value = response.data || [];
    } catch (err) {
        console.error('Failed to load signups', err);
        signupsData.value = [];
    } finally {
        signupsLoading.value = false;
    }
}

function switchTab(tab: 'default' | 'pending' | 'paid' | 'failed') {
    activeTab.value = tab;
    searchText.value = '';
    currentPage.value = 1;
    sortCol.value = 3;
    sortDir.value = 'desc';
    loadSignups(tab);
}

/* ------------------ sorting ------------------ */
function setSort(colIndex: number) {
    if (sortCol.value === colIndex) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortCol.value = colIndex;
        sortDir.value = 'asc';
    }
}

function sortArrow(colIndex: number): string {
    if (sortCol.value !== colIndex) return '';
    return sortDir.value === 'asc' ? '▲' : '▼';
}

/* ------------------ computed pipeline ------------------ */
const filteredRows = computed(() => {
    let result = signupsData.value;
    if (searchText.value) {
        const s = searchText.value.toLowerCase();
        result = result.filter((row) => row.some((cell: any) => String(cell).toLowerCase().includes(s)));
    }
    return result;
});

const sortedRows = computed(() => {
    return [...filteredRows.value].sort((a, b) => {
        const av = String(a[sortCol.value] ?? '');
        const bv = String(b[sortCol.value] ?? '');
        const cmp = av.localeCompare(bv, undefined, { numeric: true });
        return sortDir.value === 'asc' ? cmp : -cmp;
    });
});

const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value)));

const pagedRows = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return sortedRows.value.slice(start, start + pageSize.value);
});

watch([pageSize, filteredRows], () => {
    currentPage.value = 1;
});

/* ------------------ export ------------------ */
async function exportFile(format: string, status: string) {
    const { sessionId, apiKey } = authStore;
    const url = `${baseUrl}/affiliate/download?st=${status}&ex=${format}`;
    try {
        const headers: Record<string, string> = {};
        if (sessionId) {
            headers['sessionid'] = sessionId;
        } else if (apiKey) {
            headers['X-API-KEY'] = apiKey;
        }
        const response = await fetch(url, { method: 'GET', headers });
        if (!response.ok) throw new Error('Download failed');
        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `Interserver_Affiliates.${format}`;
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
            if (match) filename = match[1];
        }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    } catch (err) {
        console.error('Export failed', err);
        Swal.fire({ icon: 'error', title: 'Export failed', text: 'Could not download the file.' });
    }
}

/* ------------------ copy URL ------------------ */
function copyUrl() {
    const input = document.getElementById('affiliateinput') as HTMLInputElement;
    if (input) {
        input.select();
        navigator.clipboard.writeText(input.value).then(() => {
            Swal.fire({ icon: 'success', title: 'Copied to clipboard.' });
        }).catch(() => {
            document.execCommand('copy');
            Swal.fire({ icon: 'success', title: 'Copied to clipboard.' });
        });
    }
}

/* ------------------ init ------------------ */
accountStore.loadOnce();
onMounted(() => {
    loadSignups('default');
});
</script>

<template>
    <div class="row justify-content-center mt-2">
        <div class="col">
            <div class="card w-100 mb-4 bg-white p-2 shadow-none" style="border-left: 4px solid red; display: block ruby">
                <p class="text-md m-0"><i class="fas fa-info-circle text-red" style="color: red" aria-hidden="true"></i>&nbsp;<b class="text-red">Attention:</b>&nbsp;This affiliate program is not intended for referral of "family members" or "clients" please read <router-link class="link" :to="'/affiliate/faq'">FAQ</router-link> before proceeding.</p>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times" aria-hidden="true"></i></button>
                </div>
                <p></p>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2">
                                    <i class="far fa-money-bill" aria-hidden="true">&nbsp;</i> Earn <b>{{ '$' + affiliate_amount }}</b> per new customer sale!
                                </h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <p>
                                By adding a link to Interserver on your website you will get <b class="text-success">{{ '$' + affiliate_amount }}</b> commission on each new sale we get that results from clicking the link on your website. <a href="https://www.interserver.net/affiliate.html" target="__blank" class="link">Know More</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="far fa-external-link-alt" aria-hidden="true">&nbsp;</i>Affiliate URL</h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body mb-2 pb-4 text-center">
                            <form class="form-inline" @submit.prevent="copyUrl">
                                <div class="form-group w-50 mr-2">
                                    <input id="affiliateinput" type="text" class="form-control form-control-sm w-100" placeholder="Affiliate URL" :value="'https://www.interserver.net/r/' + custid" readonly />
                                    <span class="text-muted text-xs">Share your unique affiliate URL with friends</span>
                                </div>
                                <button type="submit" class="btn btn-custom btn-sm mb-3">Copy to Clipboard</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fas fa-link" aria-hidden="true">&nbsp;</i>Links</h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/sales_graph'" title="Sales Graph"><i class="far fa-chart-line" aria-hidden="true"></i>Sales Graph</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/traffic_graph'" title="Web Traffic Graph"><i class="far fa-chart-line" aria-hidden="true"></i>Web Traffic Graph</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/banners'" title="View Banners & Links"><i class="far fa-image" aria-hidden="true"></i>View Banners & Links</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/landing_pg'" title="Setup Landing page & Coupons"><i class="far fa-ticket-alt" aria-hidden="true"></i>Setup Landing page & Coupons</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/payment_setup'" title="Setup Payment Method"><i class="far fa-money-bill" aria-hidden="true"></i>Setup Payment Method</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/rich_report'" title="Rich Report"><i class="far fa-file-text-o" aria-hidden="true"></i>Rich Report</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/web_traffic'" title="Latest Web Traffic"><i class="fas fa-globe" aria-hidden="true"></i>Latest Web Traffic</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/status_legend'" title="Status Legend"><i class="far fa-closed-captioning" aria-hidden="true"></i>Status Legend</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/faq'" title="Frequently Asked Questions"><i class="fas fa-question" aria-hidden="true"></i>Frequently Asked Questions</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/tos'" title="Terms Of Service"><i class="far fa-file-text" aria-hidden="true"></i>Terms Of Service</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Signups Section -->
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fas fa-user-plus" aria-hidden="true">&nbsp;</i>Affiliate Signups</h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <!-- Export & Status Tabs -->
                            <div class="row mb-3">
                                <div class="col-md-4 mb-3">
                                    <span class="text-md">Export All Records: </span>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('xlsx', 'all')" title="Excel 2007+">Xlsx</button>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('xls', 'all')" title="Excel 2003/BIF">Xls</button>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('csv', 'all')">CSV</button>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('pdf', 'all')">PDF</button>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <span class="text-md text-center">Affiliate Status: </span>
                                    <div class="nav nav-tabs d-inline-flex">
                                        <button :class="['btn btn-info btn-sm', { active: activeTab === 'default' }]" @click="switchTab('default')">Default</button>
                                        <button :class="['btn btn-info btn-sm', { active: activeTab === 'pending' }]" @click="switchTab('pending')">Pending</button>
                                        <button :class="['btn btn-info btn-sm', { active: activeTab === 'paid' }]" @click="switchTab('paid')">Paid</button>
                                        <button :class="['btn btn-info btn-sm', { active: activeTab === 'failed' }]" @click="switchTab('failed')">Failed</button>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3 text-right">
                                    <span class="text-md">Export on Status: </span>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('xlsx', activeTab)" title="Excel 2007+">Xlsx</button>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('xls', activeTab)" title="Excel 2003/BIF">Xls</button>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('csv', activeTab)">CSV</button>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('pdf', activeTab)">PDF</button>
                                </div>
                            </div>
                            <!-- Search & Page Size -->
                            <div class="row mb-3 align-items-end">
                                <div class="col-md-3">
                                    <label>Search</label>
                                    <input v-model="searchText" type="text" class="form-control form-control-sm" placeholder="Search..." />
                                </div>
                                <div class="col-md-2">
                                    <label>Page Size</label>
                                    <select v-model.number="pageSize" class="form-control form-control-sm">
                                        <option :value="10">10</option>
                                        <option :value="25">25</option>
                                        <option :value="50">50</option>
                                        <option :value="100">100</option>
                                        <option :value="500">500</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <span class="text-muted">{{ filteredRows.length }} record(s) found</span>
                                </div>
                            </div>
                            <!-- Signups Table -->
                            <div class="table-responsive">
                                <table class="table table-sm table-striped w-100">
                                    <thead>
                                        <tr>
                                            <th v-for="(col, idx) in columns" :key="idx" class="sortable" @click="setSort(idx)">
                                                {{ col }} <span class="sort-arrow">{{ sortArrow(idx) }}</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="signupsLoading">
                                        <tr>
                                            <td :colspan="columns.length" class="text-center">Loading...</td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else-if="pagedRows.length === 0">
                                        <tr>
                                            <td :colspan="columns.length" class="text-center">No records found</td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <tr v-for="(row, rIdx) in pagedRows" :key="rIdx">
                                            <td v-for="(cell, cIdx) in row" :key="cIdx" v-html="cell"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- Pagination -->
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <div>Page {{ currentPage }} of {{ totalPages }}</div>
                                <div>
                                    <button class="btn btn-sm btn-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">Prev</button>
                                    <button class="btn btn-sm btn-secondary" :disabled="currentPage >= totalPages" @click="currentPage++">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
th.sortable {
    cursor: pointer;
    user-select: none;
}

.sort-arrow {
    margin-left: 4px;
    font-size: 0.75em;
    opacity: 0.7;
}

.nav-tabs .btn.active {
    font-weight: bold;
    border-bottom: 2px solid #fff;
}
</style>
