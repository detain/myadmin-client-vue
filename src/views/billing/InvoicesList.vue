<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInvoicesStore } from '@/stores/invoices.store';
import { useSiteStore } from '@/stores/site.store';
import { useAuthStore } from '@/stores/auth.store';
import { ref, computed, watch, watchEffect } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import iconCheckmark from '@/assets/images/myadmin/checkmark.png';
import iconDelete from '@/assets/images/myadmin/delete.png';
import iconCashflow from '@/assets/images/myadmin/cashflow.png';
import iconBudget from '@/assets/images/myadmin/budget.png';
import iconPaypal from '@/assets/images/myadmin/paypal.png';
import iconCreditCard from '@/assets/images/myadmin/credit-card.png';
import iconMerchantAccount from '@/assets/images/myadmin/merchant-account.png';
import iconGooglePlus from '@/assets/images/myadmin/google-plus.png';
import iconCardPayment from '@/assets/images/myadmin/card-payment.png';
import iconPriceTag from '@/assets/images/myadmin/price-tag.png';
import iconBilling from '@/assets/images/myadmin/billing.png';
import iconBouncedCheck from '@/assets/images/myadmin/bounced-check.png';
import iconPayssion from '@/assets/images/payssion.png';
import iconPdf from '@/assets/images/myadmin/pdf.png';
import iconViewDetails from '@/assets/images/myadmin/view-details.png';
import { moduleLink } from '@/helpers/moduleLink';
const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const siteStore = useSiteStore();
const invoicesStore = useInvoicesStore();
const { sessionId } = storeToRefs(authStore);
const { months_arr, years_arr, rows, loading } = storeToRefs(invoicesStore);
const invoiceHtml = ref<string | null>(null);

const id = computed<number | null>(() => {
    const v = route.params.id;
    return v ? Number(v) : null;
});
watchEffect(() => {
    siteStore.setPageHeading(t('billing.invoices.title'));
    siteStore.setTitle(t('billing.invoices.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('common.labels.invoices')],
    ]);
});

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

watch(
    id,
    async (id) => {
        invoiceHtml.value = null;
        if (!id) {
            return;
        }
        loading.value = true;
        try {
            invoiceHtml.value = await invoicesStore.getInvoice(id);
        } catch (err) {
            console.error('Failed to load invoice', err);
        } finally {
            loading.value = false;
        }
    },
    { immediate: true }
);

/* ------------------ export ------------------ */
function exportExcel() {}
</script>

<template>
    <div class="card">
        <div class="card-header">
            <h3 class="card-title"><i class="fas fa-money-bill"></i>{{ t('billing.invoices.invoicesList') }}</h3>
            <div v-if="id" class="card-tools me-4 mt-2">
                <router-link to="/invoices" class="btn btn-custom btn-sm" data-bs-toggle="tooltip" :title="t('billing.invoices.goBack')"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
            </div>
        </div>
        <div class="card-body">
            <!-- invoice detail -->
            <template v-if="id">
                <div v-if="loading" class="text-center">{{ t('common.labels.loading') }}</div>
                <div v-else v-html="invoiceHtml" />
            </template>
            <!-- LIST MODE -->
            <template v-else>
                <!-- filters -->
                <div class="row mb-3 align-items-end">
                    <div class="col-md-2">
                        <label class="form-label">{{ t('billing.invoices.month') }}</label>
                        <select v-model="selectedMonth" class="form-select form-select-sm">
                            <option value="">{{ t('billing.invoices.all') }}</option>
                            <option v-for="(text, val) in months_arr" :key="val" :value="val">
                                {{ text }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">{{ t('billing.invoices.year') }}</label>
                        <select v-model="selectedYear" class="form-select form-select-sm">
                            <option value="">{{ t('billing.invoices.all') }}</option>
                            <option v-for="(text, val) in years_arr" :key="val" :value="val">
                                {{ text }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">{{ t('common.buttons.search') }}</label>
                        <input v-model="searchText" type="text" class="form-control form-control-sm" :placeholder="t('common.search.placeholder')" />
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">{{ t('billing.invoices.pageSize') }}</label>
                        <select v-model.number="pageSize" class="form-select form-select-sm">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
                            <option :value="500">500</option>
                        </select>
                    </div>
                    <div class="col-md-4 text-end">
                        <button class="btn btn-primary btn-sm me-2" @click="exportExcel">{{ t('billing.invoices.exportExcel') }}</button>
                        <a :href="`https://my.interserver.net/pdf.php?choice=view_invoices&use_variable_sessionid=true&sessionid=${sessionId}`" class="btn btn-primary btn-sm">{{ t('billing.invoices.exportPdf') }}</a>
                    </div>
                </div>

                <!-- table -->
                <table class="table table-sm table-striped">
                    <thead>
                        <tr>
                            <th class="sortable" @click="setSort('id')">
                                {{ t('billing.invoices.id') }} <span class="sort-arrow">{{ sortArrow('id') }}</span>
                            </th>
                            <th @click="setSort('date')">
                                {{ t('billing.invoices.date') }} <span class="sort-arrow">{{ sortArrow('date') }}</span>
                            </th>
                            <th @click="setSort('service')">
                                {{ t('billing.invoices.service') }} <span class="sort-arrow">{{ sortArrow('service') }}</span>
                            </th>
                            <th @click="setSort('description')">
                                {{ t('billing.invoices.description') }} <span class="sort-arrow">{{ sortArrow('description') }}</span>
                            </th>
                            <th class="text-end" @click="setSort('amount')">
                                {{ t('billing.invoices.amount') }} <span class="sort-arrow">{{ sortArrow('amount') }}</span>
                            </th>
                            <th @click="setSort('paid')">
                                {{ t('billing.invoices.paid') }} <span class="sort-arrow">{{ sortArrow('paid') }}</span>
                            </th>
                            <th @click="setSort('payment_type')">
                                {{ t('billing.invoices.payment') }} <span class="sort-arrow">{{ sortArrow('payment_type') }}</span>
                            </th>
                            <th @click="setSort('payment_description')">
                                {{ t('billing.invoices.paymentDescription') }} <span class="sort-arrow">{{ sortArrow('payment_description') }}</span>
                            </th>
                            <th @click="setSort('paid_on')">
                                {{ t('billing.invoices.paidOn') }} <span class="sort-arrow">{{ sortArrow('paid_on') }}</span>
                            </th>
                            <th>{{ t('billing.invoices.links') }}</th>
                        </tr>
                    </thead>
                    <tbody v-if="!loading">
                        <tr v-for="row in pagedRows" :key="row.id">
                            <td>
                                <a :href="`pdf.php?choice=view_invoice&module=${row.module}&id=${row.id}`">{{ row.id }}</a>
                            </td>
                            <td>{{ row.date }}</td>
                            <td>
                                <router-link :to="'/' + moduleLink(row.module) + '/' + row.service_id">{{ row.service }}</router-link>
                            </td>
                            <td>{{ row.description }}</td>
                            <td class="text-end">{{ row.amount }}</td>
                            <td><img :src="paidImage(row.paid)" border="0" :alt="row.paid" style="width: 24px" /></td>
                            <td><img :src="paymentImage(row.payment_type_id)" border="0" :alt="row.payment_type" style="width: 24px" /></td>
                            <td>{{ row.payment_description }}</td>
                            <td>{{ row.paid_on }}</td>
                            <td>
                                <a :href="`https://my.interserver.net/pdf.php?choice=view_invoice&module=${row.module}&id=${row.id}&use_variable_sessionid=true&sessionid=${sessionId}`" :title="t('billing.invoices.pdf')" class="me-2"><img :src="iconPdf" border="0" :alt="t('billing.invoices.pdf')" style="width: 1em; height: 1em; display: inline-block" /></a>
                                <router-link :to="'/invoices/' + row.id" :title="t('billing.invoices.viewInvoice')"><img :src="iconViewDetails" border="0" :alt="t('billing.invoices.viewInvoice')" style="width: 1em; height: 1em; display: inline-block" /></router-link>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="10" class="text-center">{{ t('common.labels.loading') }}</td>
                        </tr>
                    </tbody>
                </table>
                <!-- pagination -->
                <div class="d-flex justify-content-between align-items-center">
                    <div>{{ t('billing.invoices.page', { current: currentPage, total: totalPages }) }}</div>
                    <div>
                        <button class="btn btn-sm btn-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">{{ t('billing.invoices.prev') }}</button>
                        <button class="btn btn-sm btn-secondary" :disabled="currentPage === totalPages" @click="currentPage++">{{ t('billing.invoices.next') }}</button>
                    </div>
                </div>
            </template>
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
