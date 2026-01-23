7
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInvoicesStore } from '../../stores/invoices.store';
import { useSiteStore } from '../../stores/site.store';
import { ref, computed, watch } from 'vue';
import iconCheckmark from '../../assets/images/myadmin/checkmark.png';
import iconDelete from '../../assets/images/myadmin/delete.png';
import iconCashflow from '../../assets/images/myadmin/cashflow.png';
import iconBudget from '../../assets/images/myadmin/budget.png';
import iconPaypal from '../../assets/images/myadmin/paypal.png';
import iconCreditCard from '../../assets/images/myadmin/credit-card.png';
import iconMerchantAccount from '../../assets/images/myadmin/merchant-account.png';
import iconGooglePlus from '../../assets/images/myadmin/google-plus.png';
import iconCardPayment from '../../assets/images/myadmin/card-payment.png';
import iconPriceTag from '../../assets/images/myadmin/price-tag.png';
import iconBilling from '../../assets/images/myadmin/billing.png';
import iconBouncedCheck from '../../assets/images/myadmin/bounced-check.png';
import iconPayssion from '../../assets/images/payssion.png';
import iconPdf from '../../assets/images/myadmin/pdf.png';
import iconViewDetails from '../../assets/images/myadmin/view-details.png';
const siteStore = useSiteStore();
siteStore.setPageHeading('Invoice List');
siteStore.setTitle('Invoice List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Invoices'],
]);

const invoicesStore = useInvoicesStore();
const { custid, month, year, months_arr, years_arr, rows, loading, error } = storeToRefs(invoicesStore);

invoicesStore.getAll();

interface InvoiceRow {
    id: number;
    module: string;
    date_raw: string;
    date: string;
    service: string;
    description: string;
    amount: string;
    paid: string;
    payment_type: string;
    payment_description: string;
    paid_on: string;
}

/* ------------------ state ------------------ */
const selectedMonth = ref('');
const selectedYear = ref('');
const searchText = ref('');
const pageSize = ref(50);
const currentPage = ref(1);
const sortKey = ref<keyof InvoiceRow>('id');
const sortDir = ref<'asc' | 'desc'>('desc');

/* ------------------ data load ------------------ */
function getImage(type: number): string {
    const map: Record<number, string> = {
        1: iconCashflow,
        2: iconBudget,
        10: iconPaypal,
        11: iconCreditCard,
        12: iconMerchantAccount,
        13: iconGooglePlus,
        14: iconCardPayment,
        15: iconPriceTag,
        16: iconBilling,
        17: iconBouncedCheck,
        18: iconPayssion,
    };
    return map[type] ?? iconCardPayment;
}

function paidImage(paid: string): string {
    return paid == 'Yes' ? iconCheckmark : iconDelete;
}

function paymentImage(typeId: number): string {
    return getImage(typeId);
}

/* ------------------ sorting ------------------ */
function setSort(key: keyof InvoiceRow) {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortDir.value = 'asc';
    }
}

function sortArrow(key: keyof InvoiceRow): string {
    if (sortKey.value !== key) return '';
    return sortDir.value === 'asc' ? '▲' : '▼';
}

function getYear(dateRaw: string): number {
    return Number(dateRaw.substring(0, 4));
}

function getMonth(dateRaw: string): number {
    return Number(dateRaw.substring(5, 7)); // 1–12
}

/* ------------------ computed ------------------ */
const filteredRows = computed(() => {
    let result = rows.value;
    if (selectedYear.value) {
        const y = Number(selectedYear.value);
        result = result.filter((r) => getYear(r.date_raw) === y);
    }
    if (selectedMonth.value) {
        const m = Number(selectedMonth.value);
        result = result.filter((r) => getMonth(r.date_raw) === m);
    }
    if (searchText.value) {
        const s = searchText.value.toLowerCase();
        result = result.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(s)));
    }
    return result;
});

const sortedRows = computed(() => {
    return [...filteredRows.value].sort((a, b) => {
        const av = a[sortKey.value];
        const bv = b[sortKey.value];

        if (av === bv) return 0;
        if (sortDir.value === 'asc') {
            return av > bv ? 1 : -1;
        }
        return av < bv ? 1 : -1;
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
function exportExcel() {
}

function exportPdf() {
}
</script>

<template>
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Invoices List</h3>
        </div>
        <div class="card-body">
            <!-- filters -->
            <div class="row mb-3 align-items-end">
                <div class="col-md-2">
                    <label>Month</label>
                    <select v-model="selectedMonth" class="form-control form-control-sm">
                        <option value="">All</option>
                        <option v-for="(text, val) in months_arr" :key="val" :value="val">
                            {{ text }}
                        </option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label>Year</label>
                    <select v-model="selectedYear" class="form-control form-control-sm">
                        <option value="">All</option>
                        <option v-for="(text, val) in years_arr" :key="val" :value="val">
                            {{ text }}
                        </option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label>Search</label>
                    <input v-model="searchText" type="text" class="form-control form-control-sm" placeholder="Search…" />
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
                <div class="col-md-4 text-end">
                    <button class="btn btn-primary btn-sm me-2" @click="exportExcel">Export Excel</button>
                    <button class="btn btn-primary btn-sm" @click="exportPdf">Export PDF</button>
                </div>
            </div>

            <!-- table -->
            <table class="table table-sm table-striped">
                <thead>
                    <tr>
                        <th class="sortable" @click="setSort('id')">
                            ID <span class="sort-arrow">{{ sortArrow('id') }}</span>
                        </th>
                        <th @click="setSort('date')">
                            Date <span class="sort-arrow">{{ sortArrow('date') }}</span>
                        </th>
                        <th @click="setSort('service')">
                            Service <span class="sort-arrow">{{ sortArrow('service') }}</span>
                        </th>
                        <th @click="setSort('description')">
                            Description <span class="sort-arrow">{{ sortArrow('description') }}</span>
                        </th>
                        <th class="text-end" @click="setSort('amount')">
                            Amount <span class="sort-arrow">{{ sortArrow('amount') }}</span>
                        </th>
                        <th @click="setSort('paid')">
                            Paid <span class="sort-arrow">{{ sortArrow('paid') }}</span>
                        </th>
                        <th @click="setSort('payment_type')">
                            Payment <span class="sort-arrow">{{ sortArrow('payment_type') }}</span>
                        </th>
                        <th @click="setSort('payment_description')">
                            Payment Description <span class="sort-arrow">{{ sortArrow('payment_description') }}</span>
                        </th>
                        <th @click="setSort('paid_on')">
                            Paid On <span class="sort-arrow">{{ sortArrow('paid_on') }}</span>
                        </th>
                        <th>Links</th>
                    </tr>
                </thead>
                <tbody v-if="!loading">
                    <tr v-for="row in pagedRows" :key="row.id">
                        <td>
                            <a :href="`pdf.php?choice=view_invoice&module=${row.module}&id=${row.id}`">{{ row.id }}</a>
                        </td>
                        <td>{{ row.date }}</td>
                        <td v-html="row.service"></td>
                        <td>{{ row.description }}</td>
                        <td class="text-end">{{ row.amount }}</td>
                        <td><img :src="paidImage(row.paid)" border="0" :alt="row.paid" style="width: 24px" /></td>
                        <td><img :src="paymentImage(row.payment_type_id)" border="0" :alt="row.payment_type" style="width: 24px" /></td>
                        <td>{{ row.payment_description }}</td>
                        <td>{{ row.paid_on }}</td>
                        <td>
                            <a :href="`pdf.php?choice=view_invoice&module=${row.module}&id=${row.id}`" title="PDF" class="me-2"><img :src="iconPdf" border="0" alt="PDF" style="width: 1em; height: 1em; display: inline-block" /></a>
                            <a :href="`index.php?choice=view_invoice&module=${row.module}&id=${row.id}`" title="View Invoice"><img :src="iconViewDetails" border="0" alt="View Invoice" style="width: 1em; height: 1em; display: inline-block" /></a>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="10" class="text-center">Loading…</td>
                    </tr>
                </tbody>
            </table>
            <!-- pagination -->
            <div class="d-flex justify-content-between align-items-center">
                <div>Page {{ currentPage }} of {{ totalPages }}</div>
                <div>
                    <button class="btn btn-sm btn-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">Prev</button>
                    <button class="btn btn-sm btn-secondary" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
th {
    cursor: pointer;
    user-select: none;
}

.sort-arrow {
    margin-left: 4px;
    font-size: 0.75em;
    opacity: 0.7;
}
</style>
