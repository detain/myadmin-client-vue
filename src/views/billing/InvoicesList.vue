<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInvoicesStore } from '../../stores/invoices.store';
import { useSiteStore } from '../../stores/site.store';
import { ref, computed, onMounted, watch } from 'vue';
const siteStore = useSiteStore();
siteStore.setPageHeading('Invoice List');
siteStore.setTitle('Invoice List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Invoices'],
]);

const invoicesStore = useInvoicesStore();
const { custid, month, year, months_arr, years_arr, rows, loading, error } = storeToRefs(invoicesStore);

const submitForm = () => {
    console.log(`Selected month: ${month.value}`);
    console.log(`Selected year: ${year.value}`);
};
const invoicesTable = ref(null);

invoicesStore.getAll();

interface InvoiceRow {
    id: number;
    module: string;
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

async function loadInvoices(exportType?: 'excel' | 'pdf') {
    /*loading.value = true;
    try {
        /*const res = await axios.post('/api/invoices', {
            inv_month: selectedMonth.value,
            inv_year: selectedYear.value,
            export: exportType ?? null,
        });

        if (exportType && res.data?.redirect) {
            window.location.href = res.data.redirect;
            return;
        }

        months_arr.value = res.data.months_arr;
        years_arr.value = res.data.years_arr;
        rows.value = res.data.rows;
        currentPage.value = 1;
    } finally {
        loading.value = false;
    }*/
}

onMounted(loadInvoices);

watch([selectedMonth, selectedYear], () => {
    //    loadInvoices();
});

/* ------------------ sorting ------------------ */

function setSort(key: keyof InvoiceRow) {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortDir.value = 'asc';
    }
}

/* ------------------ computed ------------------ */

const filteredRows = computed(() => {
    if (!searchText.value) return rows.value;

    const s = searchText.value.toLowerCase();
    return rows.value.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(s)));
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
    loadInvoices('excel');
}

function exportPdf() {
    loadInvoices('pdf');
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
                        <th @click="setSort('id')">ID</th>
                        <th @click="setSort('date')">Date</th>
                        <th @click="setSort('service')">Service</th>
                        <th @click="setSort('description')">Description</th>
                        <th class="text-end" @click="setSort('amount')">Amount</th>
                        <th @click="setSort('paid')">Paid</th>
                        <th @click="setSort('payment_type')">Payment</th>
                        <th @click="setSort('payment_description')">Payment Description</th>
                        <th @click="setSort('paid_on')">Paid On</th>
                        <th>Links</th>
                    </tr>
                </thead>

                <tbody v-if="!loading">
                    <tr v-for="row in pagedRows" :key="row.id">
                        <td>
                            <a :href="`pdf.php?choice=view_invoice&module=${row.module}&id=${row.id}`">
                                {{ row.id }}
                            </a>
                        </td>
                        <td>{{ row.date }}</td>
                        <td v-html="row.service"></td>
                        <td>{{ row.description }}</td>
                        <td class="text-end">{{ row.amount }}</td>
                        <td>{{ row.paid }}</td>
                        <td>{{ row.payment_type_id }}</td>
                        <td>{{ row.payment_description }}</td>
                        <td>{{ row.paid_on }}</td>
                        <td>
                            <a :href="`pdf.php?choice=view_invoice&module=${row.module}&id=${row.id}`" title="PDF" class="me-2">PDF</a>
                            <a :href="`index.php?choice=view_invoice&module=${row.module}&id=${row.id}`" title="View">View</a>
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

<style scoped></style>
