<script setup lang="ts">
import { ref, computed, watch, onMounted, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import { useAccountStore } from '@/stores/account.store';
import { useAuthStore } from '@/stores/auth.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import Swal from 'sweetalert2';

const { t } = useI18n();
const accountStore = useAccountStore();
const siteStore = useSiteStore();
const authStore = useAuthStore();
const baseUrl = siteStore.getBaseUrl();

watchEffect(() => {
    siteStore.setPageHeading(t('affiliate.title'));
    siteStore.setTitle(t('affiliate.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('affiliate.breadcrumb')],
    ]);
});

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
        if (!response.ok) {
            throw new Error(`Download failed: ${response.status}`);
        }
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
        await Swal.fire({ icon: 'error', title: t('affiliate.exportFailed'), text: t('affiliate.exportFailedText') });
    }
}

/* ------------------ copy URL ------------------ */
function copyUrl() {
    const input = document.getElementById('affiliateinput') as HTMLInputElement;
    if (input) {
        input.select();
        navigator.clipboard
            .writeText(input.value)
            .then(() => {
                Swal.fire({ icon: 'success', title: t('affiliate.copiedToClipboard') });
            })
            .catch(() => {
                document.execCommand('copy');
                Swal.fire({ icon: 'success', title: t('affiliate.copiedToClipboard') });
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
                <p class="text-md m-0">
                    <i class="fas fa-info-circle text-red" style="color: red" aria-hidden="true"></i>&nbsp;<b class="text-red">Attention:</b>&nbsp;{{ t('affiliate.attention', { faqLink: '' }) }}<router-link class="link" :to="'/affiliate/faq'">{{ t('affiliate.faqLinkText') }}</router-link>
                </p>
                <div class="card-tools float-end">
                    <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times" aria-hidden="true"></i></button>
                </div>
                <p></p>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fas fa-money-bill" aria-hidden="true"></i>&nbsp; {{ t('affiliate.earnPerSale', { amount: '$' + affiliate_amount }) }}</h3>
                                <div class="card-tools float-end">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <p>
                                {{ t('affiliate.earnDescription', { amount: '' }) }}<b class="text-success">{{ '$' + affiliate_amount }}</b> <a href="https://www.interserver.net/affiliate.html" target="__blank" class="link">{{ t('affiliate.knowMore') }}</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fas fa-external-link-alt" aria-hidden="true"></i>&nbsp;{{ t('affiliate.affiliateUrl') }}</h3>
                                <div class="card-tools float-end">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body mb-2 pb-4 text-center">
                            <form class="row row-cols-auto g-3 align-items-center" @submit.prevent="copyUrl">
                                <div class="mb-3 w-50 me-2">
                                    <input id="affiliateinput" type="text" class="form-control form-control-sm w-100" placeholder="Affiliate URL" :value="'https://www.interserver.net/r/' + custid" readonly />
                                    <span class="text-muted text-xs">{{ t('affiliate.shareUrl') }}</span>
                                </div>
                                <button type="submit" class="btn btn-custom btn-sm mb-3">{{ t('common.buttons.copyToClipboard') }}</button>
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
                                <h3 class="card-title py-2"><i class="fas fa-link" aria-hidden="true"></i>&nbsp;{{ t('affiliate.links') }}</h3>
                                <div class="card-tools float-end">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/sales_graph'" :title="t('affiliate.salesGraph')"><i class="fas fa-chart-line" aria-hidden="true"></i>{{ t('affiliate.salesGraph') }}</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/traffic_graph'" :title="t('affiliate.webTrafficGraph')"><i class="fas fa-chart-line" aria-hidden="true"></i>{{ t('affiliate.webTrafficGraph') }}</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/banners'" :title="t('affiliate.viewBannersLinks')"><i class="fas fa-image" aria-hidden="true"></i>{{ t('affiliate.viewBannersLinks') }}</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/landing_pg'" :title="t('affiliate.setupLandingPage')"><i class="fas fa-ticket-alt" aria-hidden="true"></i>{{ t('affiliate.setupLandingPage') }}</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/payment_setup'" :title="t('affiliate.setupPaymentMethod')"><i class="fas fa-money-bill" aria-hidden="true"></i>{{ t('affiliate.setupPaymentMethod') }}</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/rich_report'" :title="t('affiliate.richReport')"><i class="fas fa-file-text-o" aria-hidden="true"></i>{{ t('affiliate.richReport') }}</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/web_traffic'" :title="t('affiliate.latestWebTraffic')"><i class="fas fa-globe" aria-hidden="true"></i>{{ t('affiliate.latestWebTraffic') }}</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/status_legend'" :title="t('affiliate.statusLegend')"><i class="fas fa-closed-captioning" aria-hidden="true"></i>{{ t('affiliate.statusLegend') }}</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/faq'" :title="t('affiliate.frequentlyAskedQuestions')"><i class="fas fa-question" aria-hidden="true"></i>{{ t('affiliate.frequentlyAskedQuestions') }}</router-link>
                            <router-link class="btn btn-app mb-3" :to="'/affiliate/tos'" :title="t('affiliate.termsOfService')"><i class="fas fa-file-text" aria-hidden="true"></i>{{ t('affiliate.termsOfService') }}</router-link>
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
                                <h3 class="card-title py-2"><i class="fas fa-user-plus" aria-hidden="true"></i>&nbsp;{{ t('affiliate.signups.title') }}</h3>
                                <div class="card-tools float-end">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <!-- Export & Status Tabs -->
                            <div class="row mb-3">
                                <div class="col-md-4 mb-3">
                                    <span class="text-md">{{ t('affiliate.signups.exportAllRecords') }} </span>
                                    <button class="btn btn-sm btn-custom" title="Excel 2007+" @click="exportFile('xlsx', 'all')">Xlsx</button>
                                    <button class="btn btn-sm btn-custom" title="Excel 2003/BIF" @click="exportFile('xls', 'all')">Xls</button>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('csv', 'all')">CSV</button>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('pdf', 'all')">PDF</button>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <span class="text-md text-center">{{ t('affiliate.signups.affiliateStatus') }} </span>
                                    <div class="nav nav-tabs d-inline-flex">
                                        <button :class="['btn btn-info btn-sm', { active: activeTab === 'default' }]" @click="switchTab('default')">{{ t('affiliate.signups.default') }}</button>
                                        <button :class="['btn btn-info btn-sm', { active: activeTab === 'pending' }]" @click="switchTab('pending')">{{ t('affiliate.signups.pending') }}</button>
                                        <button :class="['btn btn-info btn-sm', { active: activeTab === 'paid' }]" @click="switchTab('paid')">{{ t('affiliate.signups.paid') }}</button>
                                        <button :class="['btn btn-info btn-sm', { active: activeTab === 'failed' }]" @click="switchTab('failed')">{{ t('affiliate.signups.failed') }}</button>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3 text-end">
                                    <span class="text-md">{{ t('affiliate.signups.exportOnStatus') }} </span>
                                    <button class="btn btn-sm btn-custom" title="Excel 2007+" @click="exportFile('xlsx', activeTab)">Xlsx</button>
                                    <button class="btn btn-sm btn-custom" title="Excel 2003/BIF" @click="exportFile('xls', activeTab)">Xls</button>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('csv', activeTab)">CSV</button>
                                    <button class="btn btn-sm btn-custom" @click="exportFile('pdf', activeTab)">PDF</button>
                                </div>
                            </div>
                            <!-- Search & Page Size -->
                            <div class="row mb-3 align-items-end">
                                <div class="col-md-3">
                                    <label class="form-label">{{ t('common.search.placeholder') }}</label>
                                    <input v-model="searchText" type="text" class="form-control form-control-sm" :placeholder="t('common.search.placeholder')" />
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label">{{ t('common.labels.pageSize') }}</label>
                                    <select v-model.number="pageSize" class="form-control form-control-sm">
                                        <option :value="10">10</option>
                                        <option :value="25">25</option>
                                        <option :value="50">50</option>
                                        <option :value="100">100</option>
                                        <option :value="500">500</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <span class="text-muted">{{ t('affiliate.signups.recordsFound', { count: filteredRows.length }) }}</span>
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
                                            <td :colspan="columns.length" class="text-center">{{ t('common.labels.loading') }}</td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else-if="pagedRows.length === 0">
                                        <tr>
                                            <td :colspan="columns.length" class="text-center">{{ t('affiliate.signups.noRecords') }}</td>
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
                                <div>{{ t('affiliate.signups.page', { current: currentPage, total: totalPages }) }}</div>
                                <div>
                                    <button class="btn btn-sm btn-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">{{ t('affiliate.signups.prev') }}</button>
                                    <button class="btn btn-sm btn-secondary" :disabled="currentPage >= totalPages" @click="currentPage++">{{ t('affiliate.signups.next') }}</button>
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
