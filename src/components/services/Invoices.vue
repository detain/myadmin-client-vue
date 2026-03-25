<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';

const { t } = useI18n();
import $ from 'jquery';
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
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store.ts';
const props = defineProps<{
    id: number;
    module: string;
}>();
const invoices = ref<ChargeInvoiceRow[]>([]);
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => props.id);
const module = computed(() => props.module);
const authStore = useAuthStore();
const { sessionId } = storeToRefs(authStore);
const loading = ref(true);

type InvoicesResponse = {
    success: boolean;
    invoices: ChargeInvoiceRows;
};

type ChargeInvoiceRows = {
    [key: string]: ChargeInvoiceRow;
};

type PaymentInvoiceRows = {
    [key: string]: PaymentInvoiceRow;
};

type RefundInvoiceRows = {
    [key: string]: RefundInvoiceRow;
};

type ChargeInvoiceRow = {
    invoices_id: number;
    invoices_description: string;
    invoices_amount: number;
    invoices_date: string;
    invoices_type: number;
    invoices_paid: boolean;
    invoices_due_date: string;
    invoices_currency: string;
    currency_symbol: string;
    invoices_date_formatted: string;
    paid_invoices?: PaymentInvoiceRows;
};

type PaymentInvoiceRow = {
    invoices_id: number;
    invoices_description: string;
    invoices_amount: number;
    invoices_date: string;
    invoices_type: number;
    invoices_currency: string;
    currency_symbol: string;
    invoices_date_formatted: string;
    payment_type: string;
    refund_invoices?: RefundInvoiceRows;
};

type RefundInvoiceRow = {
    invoices_id: number;
    invoices_description: string;
    invoices_amount: number;
    invoices_date: string;
    invoices_currency: string;
    currency_symbol: string;
    invoices_date_formatted: string;
};

type Prefixes = Record<string, string>;
interface PaymentType {
    type: string;
    image: string;
    text: string;
}
type PaymentTypes = Record<string, PaymentType>;

const prefixes = ref<Prefixes>({});

const searchText = ref('');
const pageSize = ref(50);
const currentPage = ref(1);
const sortKey = ref<keyof ChargeInvoiceRow>('invoices_id');
const sortDir = ref<'asc' | 'desc'>('desc');
const showDetails = ref<Record<string, boolean>>({});

function toggleDetails(id: number) {
    const row = invoices.value.find((r) => r.invoices_id === id);
    if (row) {
        showDetails.value[id] = !showDetails.value[id];
    }
}

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

function paidImage(paid: boolean): string {
    return paid ? iconCheckmark : iconDelete;
}

function paymentImage(typeId: number): string {
    return getImage(typeId);
}

/* ------------------ sorting ------------------ */
function setSort(key: keyof ChargeInvoiceRow) {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortDir.value = 'asc';
    }
}

function sortArrow(key: keyof ChargeInvoiceRow): string {
    if (sortKey.value !== key) return '';
    return sortDir.value === 'asc' ? '▲' : '▼';
}

/* ------------------ computed ------------------ */
const filteredRows = computed(() => {
    let result = invoices.value;
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
        if (av == null && bv == null) return 0;
        if (av == null) return 1; // push undefined to bottom
        if (bv == null) return -1;
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

function exportExcel() {}

function previous() {
    // Handle previous button click
}
function closeModal() {
    // Handle modal close button click
}
function submitForm() {
    // Handle form submission
}

function format(d: any) {
    let paid_content: string = '';
    let refund_content: string = '';
    if (typeof d[13] == 'undefined' || d[13].length == 0) {
        paid_content = '<div class="text-danger text-center">No Paid Invoices Available</div>';
    } else {
        paid_content = '<table id="paid_content" class="display table table-striped table-sm table-hover" style="width:100%"><thead><tr><th>&nbsp;</th><th>ID</th><th>Paid On</th><th>Description</th><th>Amount</th><th>Paid By</th><th>Links</th></tr></thead><tbody>';
        console.log(d[13]);
        //console.log(d[13].length);
        let payment_type: string = '',
            trnx_col: string = '',
            plinks: string = '',
            links: string = '';
        for (let i: number = 0; i < d[13].length; i++) {
            payment_type = `<i class="icon-${get_payment_type_image(d[13][i][4])}" title="${get_payment_type(d[13][i][4])}"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-${get_payment_type_image(d[13][i][4])}"></use></svg></i>`;
            trnx_col = d[13][i][3];
            plinks = get_links(d[13][i]);
            paid_content = `${paid_content}<tr><td class="details-control-refund sorting_disabled" style="width: 40px;">&nbsp;</td><td>${d[13][i][0]}</td><td>${d[13][i][1]}</td><td>${trnx_col}</td><td>${d[13][i][12]}${d[13][i][5]}</td><td>${payment_type}</td><td>${plinks}</td></tr>`;
            //console.log(paid_content);
            if (typeof d[13][i][13] == 'undefined' || d[13][i][13].length == 0) {
                console.log('not sure what this is for');
            } else {
                refund_content = '<tr><td colspan="7"><table id="refund_rows" class="display table table-striped table-sm table-hover" style="width:100%"><thead><tr><th></th><th>ID</th><th>Refunded On</th><th>Description</th><th>Amount</th><th>Links</th></tr></thead><tbody>';
                for (let j = 0; j < d[13][i][13].length; j++) {
                    links = get_links(d[13][i][13][j]);
                    refund_content = `${refund_content}<tr><td style="width: 40px;">&nbsp;</td><td>${d[13][i][13][j][0]}</td><td>${d[13][i][13][j][1]}</td><td>${trnx_col}</td><td>${d[13][i][13][j][12]}${d[13][i][13][j][5]}</td><td>${links}</td></tr>`;
                }
                refund_content = `${refund_content}</tbody></table></td></tr>`;
                paid_content = paid_content + refund_content;
            }
            //console.log(paid_content);
        }
        paid_content = `${paid_content}</tbody></table>`;
    }
    //console.log(paid_content);
    return paid_content;
}

function get_links(row: string[]) {
    let out = '';
    if (Number(row[4]) >= 10) {
        out = `${out}<a href="view_${prefixes.value[row[9]]}&id=${row[2]}&link=invoices&resend_payment_confirmation=${row[0]}" data-bs-toggle="tooltip" title="E-Mail Payment Confirmation"><i class="icon-new-message"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-new-message"></use></svg></i></a>`;
    } else {
        out = `${out}<a href="view_${prefixes.value[row[9]]}&id=${row[2]}&link=invoices&resend_invoice=${row[0]}" data-bs-toggle="tooltip" title="E-Mail the Invoice"><i class="icon-new-message"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-new-message"></use></svg></i></a>`;
    }
    if (row[4] == '1') {
        if (Number(row[6]) == 0) {
            out = `${out}<a href="view_balance&module=${row[9]}&invoice=${row[0]}" data-bs-toggle="tooltip" title="Pay Invoice"><i class="icon-cash-register"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-cash-register"></use></svg></i></a>`;
        }
        out = `${out}<a href="view_invoice&id=${row[0]}&module=${row[9]}" data-bs-toggle="tooltip" title="View Invoice" title="View Invoice" ><i class="icon-analyze"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-analyze"></use></svg></i></a>`;
        out = `${out}<a href="pdf.php?choice=view_invoice&id=${row[0]}&module=${row[9]}" data-bs-toggle="tooltip" title="View Invoice as PDF"><i class="icon-pdf"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-pdf"></use></svg></i></a>`;
    }
    return out;
}

function get_payment_types(): PaymentTypes {
    return {
        '1': {
            type: 'Invoice',
            image: 'cashflow',
            text: 'Invoice',
        },
        '2': {
            type: 'Refund',
            image: 'budget',
            text: 'Refund',
        },
        '10': {
            type: 'Payment',
            image: 'paypal',
            text: 'PayPal Payment',
        },
        '11': {
            type: 'Payment',
            image: 'credit-card',
            text: 'Credit Card Payment',
        },
        '12': {
            type: 'Payment',
            image: 'merchant-account',
            text: 'PrePay Payment',
        },
        '13': {
            type: 'Payment',
            image: 'google-plus',
            text: 'Google Payment',
        },
        '14': {
            type: 'Payment',
            image: 'card-payment',
            text: 'Payza Payment',
        },
        '15': {
            type: 'Payment',
            image: 'price-tag',
            text: 'Free Invoice',
        },
        '16': {
            type: 'Payment',
            image: 'billing',
            text: 'BitCoin Payment',
        },
        '17': {
            type: 'Payment',
            image: 'bounced-check',
            text: 'Check Payment',
        },
        '18': {
            type: 'Payment',
            image: 'merchant-account',
            text: 'Payssion Payment',
        },
        '19': {
            type: 'Payment',
            image: 'merchant-account',
            text: 'Coinbase Payment',
        },
        '20': {
            type: 'Payment',
            image: 'merchant-account',
            text: 'Cashfree Payment',
        },
        '21': {
            type: 'Payment',
            image: 'merchant-account',
            text: 'CC Avenue Payment',
        },
        '22': {
            type: 'Payment',
            image: 'merchant-account',
            text: 'PayU Payment',
        },
    };
}

function get_payment_type(type: string) {
    let types = get_payment_types();
    return types[type]['type'];
}

function get_payment_type_image(type: string) {
    let types = get_payment_types();
    return types[type]['image'];
}

function get_payment_method_text(type: string) {
    let types = get_payment_types();
    return types[type]['text'];
}

function loadInvoices() {
    loading.value = true;
    try {
        fetchWrapper.get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/invoices`).then((resp: InvoicesResponse) => {
            loading.value = false;
            console.log(`${module.value} ${id.value} invoices success`, resp);
            invoices.value = Object.values(resp.invoices);
            /*let table = $('#invoice_table').DataTable({
                "data": dataSets.value,
                "columnDefs": [{
                        targets: 2,
                        //render: $.fn.dataTable.render.moment('YYYY-MM-DD HH:mm:ss', 'Do MMM YYYY')
                    },
                    {
                        targets: 3,
                        //render: $.fn.dataTable.render.moment('YYYY-MM-DD HH:mm:ss', 'Do MMM YYYY')
                    },
                    {
                        "targets": 4,
                        "data": 3,
                        "render": function(data: any, type: any, row: string[], meta: any) {
                            if (row[4] == '1') {
                                data = data.replace('(Repeat Invoice: '+row[8]+') ', '');
                            }
                            return data;
                        }
                    },
                    {
                        "targets": 5,
                        "data": 4,
                        "render": function(data: any, type: any, row: string[], meta: any) {
                            data = row[12] + row[5];
                            return data;
                        }
                    },
                    {
                        "targets": 6,
                        "data": 6,
                        "render": function(data: any, type: any, row: string[], meta: any) {
                            if (row[6] == '1') {
                                if (data == 1) {
                                    return '<i class="icon-checkmark"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-checkmark"></use></svg></i>';
                                } else {
                                    return '<i class="icon-delete"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-delete"></use></svg></i>';
                                }
                            } else {
                                return '<i class="icon-delete"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-delete"></use></svg></i>';
                            }
                        }
                    },
                    {
                        "targets": 7,
                        "data": null,
                        "width": "150px",
                        "render": function(data: any, type: any, row: string[], meta: any) {
                            let out = '';
                            if (Number(row[4]) >= 10) {
                                out = out+'<a href="view_'+prefixes.value[row[9]]+'&id='+row[2]+'&link=invoices&resend_payment_confirmation='+row[0]+'" data-bs-toggle="tooltip" title="E-Mail Payment Confirmation"><i class="icon-new-message"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-new-message"></use></svg></i></a>';
                            } else {
                                out = out+'<a href="view_'+prefixes.value[row[9]]+'&id='+row[2]+'&link=invoices&resend_invoice='+row[0]+'" data-bs-toggle="tooltip" title="E-Mail the Invoice"><i class="icon-new-message"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-new-message"></use></svg></i></a>';
                            }
                            if (row[4] == '1') {
                                if (Number(row[6]) == 0) {
                                    out = out+'<a href="view_balance&module='+row[9]+'&invoice='+row[0]+'" data-bs-toggle="tooltip" title="Pay Invoice"><i class="icon-cash-register"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-cash-register"></use></svg></i></a>';
                                }
                                out = out+'<a target="_blank"  href="view_invoice&id='+row[0]+'&module='+row[9]+'" data-bs-toggle="tooltip" title="View Invoice" title="View Invoice" ><i class="icon-analyze"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-analyze"></use></svg></i></a>';
                                out = out+'<a href="pdf.php?choice=view_invoice&id='+row[0]+'&module='+row[9]+'" data-bs-toggle="tooltip" title="View Invoice as PDF"><i class="icon-pdf"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-pdf"></use></svg></i></a>';
                            }
                            return out;
                        }
                    }
                ],
                "columns": [{
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    },
                    { "data": 0 },
                    { "data": 1 },
                    { "data": 10 },
                    { "data": 3 },
                    { "data": 5 },
                    { "data": 6 },
                    { "data": 7 }
                ],
                "order": [
                    [0, "desc"]
                ],
                "autoWidth": false
            });

            $('#invoice_table tbody').on('click', 'td.details-control', function() {
                let tr = $(this).closest('tr');
                let row = table.row(tr);
                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                    console.log(row, row.child());
                    console.log(format(row.data()));
                }
            });
            */
        });
    } catch (error: any) {
        loading.value = false;
        console.log(`${module.value} ${id.value} invoices failed`, error);
    }
}

siteStore.setTitle('');
siteStore.setPageHeading('');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module.value)}`, module.value],
]);
siteStore.addBreadcrum(`/${moduleLink(module.value)}/${id.value}`, `View ${module.value} ${id.value}`);
siteStore.addBreadcrum(`/${moduleLink(module.value)}/${id.value}/invoices`, `${module.value} Invoices`);

watch([pageSize, filteredRows], () => {
    currentPage.value = 1;
});

loadInvoices();
</script>

<template>
    <div class="row justify-content-center mt-4">
        <div class="col-md-12">
            <div class="card shadow-none">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-file-invoice-dollar"></i>&nbsp;{{ t('common.labels.invoices') }}</h3>
                    <div class="card-tools">
                        <button class="btn-custom text-sm" data-bs-toggle="tooltip" :title="t('common.buttons.goBack')" @click="previous"><i class="fas fa-arrow-left"></i>&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</button>
                    </div>
                </div>
                <div class="card-body justify-content-center">
                    <!-- filters -->
                    <div class="row mb-3 align-items-end">
                        <div class="col-md-3">
                            <label class="form-label">{{ t('common.buttons.search') }}</label>
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
                        <div class="col-md-4 text-end">
                            <button class="btn btn-primary btn-sm me-2" @click="exportExcel">{{ t('common.buttons.exportExcel') }}</button>
                            <a :href="`https://my.interserver.net/pdf.php?choice=view_invoices&use_variable_sessionid=true&sessionid=${sessionId}`" class="btn btn-primary btn-sm">{{ t('common.buttons.exportPdf') }}</a>
                        </div>
                    </div>
                    <!-- table -->
                    <table class="table-bordered mt-2 table">
                        <thead>
                            <tr>
                                <th>{{ t('common.labels.moreDetails') }}</th>
                                <th class="sortable" @click="setSort('invoices_id')">
                                    {{ t('common.labels.id') }} <span class="sort-arrow">{{ sortArrow('invoices_id') }}</span>
                                </th>
                                <th @click="setSort('invoices_date')">
                                    {{ t('common.labels.invoiceDate') }} <span class="sort-arrow">{{ sortArrow('invoices_date') }}</span>
                                </th>
                                <th @click="setSort('invoices_due_date')">
                                    {{ t('common.labels.dueDate') }} <span class="sort-arrow">{{ sortArrow('invoices_due_date') }}</span>
                                </th>
                                <th @click="setSort('invoices_description')">
                                    {{ t('common.labels.description') }} <span class="sort-arrow">{{ sortArrow('invoices_description') }}</span>
                                </th>
                                <th class="text-end" @click="setSort('invoices_amount')">
                                    {{ t('common.labels.amount') }} <span class="sort-arrow">{{ sortArrow('invoices_amount') }}</span>
                                </th>
                                <th @click="setSort('invoices_paid')">
                                    {{ t('common.labels.paid') }} <span class="sort-arrow">{{ sortArrow('invoices_paid') }}</span>
                                </th>
                                <th>{{ t('common.labels.links') }}</th>
                            </tr>
                        </thead>
                        <tbody v-if="!loading">
                            <template v-for="row in pagedRows" :key="row.invoices_id">
                                <tr>
                                    <td>
                                        <a @click.prevent="toggleDetails(row.invoices_id)"><i class="fas" :class="{ 'fa-plus': typeof showDetails[row.invoices_id] == 'undefined' || !showDetails[row.invoices_id], 'fa-minus': showDetails[row.invoices_id] }"></i></a>
                                    </td>
                                    <td>
                                        <a :href="`pdf.php?choice=view_invoice&module=${module}&id=${row.invoices_id}`">{{ row.invoices_id }}</a>
                                    </td>
                                    <td>{{ row.invoices_date }}</td>
                                    <td>{{ row.invoices_due_date }}</td>
                                    <td>{{ row.invoices_description }}</td>
                                    <td class="text-end">{{ row.invoices_amount }}</td>
                                    <td><img :src="paidImage(row.invoices_paid)" border="0" :alt="row.invoices_paid ? 'Yes' : 'No'" style="width: 24px" /></td>
                                    <td>
                                        <a :href="`https://my.interserver.net/pdf.php?choice=view_invoice&module=${module}&id=${row.invoices_id}&use_variable_sessionid=true&sessionid=${sessionId}`" title="PDF" class="me-2">
                                            <img :src="iconPdf" border="0" alt="PDF" style="width: 1em; height: 1em; display: inline-block" />
                                        </a>
                                        <router-link :to="'/invoices/' + row.invoices_id" title="View Invoice"><img :src="iconViewDetails" border="0" alt="View Invoice" style="width: 1em; height: 1em; display: inline-block" /></router-link>
                                    </td>
                                </tr>
                                <template v-if="row.paid_invoices && Object.values(row.paid_invoices).length > 0">
                                    <tr v-show="showDetails[row.invoices_id]">
                                        <td colspan="7">
                                            <table class="table table-sm table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>{{ t('common.labels.id') }}</th>
                                                        <th>{{ t('common.labels.paidOn') }}</th>
                                                        <th>{{ t('common.labels.description') }}</th>
                                                        <th>{{ t('common.labels.amount') }}</th>
                                                        <th>{{ t('common.labels.paidBy') }}</th>
                                                        <th>{{ t('common.labels.links') }}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="paid in row.paid_invoices" :key="paid.invoices_id">
                                                        <td></td>
                                                        <td>
                                                            <a :href="`pdf.php?choice=view_invoice&module=${module}&id=${paid.invoices_id}`">{{ paid.invoices_id }}</a>
                                                        </td>
                                                        <td>{{ paid.invoices_date }}</td>
                                                        <td>{{ paid.invoices_description }}</td>
                                                        <td class="text-end">{{ paid.invoices_amount }}</td>
                                                        <td><img :src="paymentImage(paid.invoices_type)" border="0" :alt="paid.payment_type" style="width: 24px" /></td>
                                                        <td>
                                                            <a :href="`https://my.interserver.net/pdf.php?choice=view_invoice&module=${module}&id=${paid.invoices_id}&use_variable_sessionid=true&sessionid=${sessionId}`" title="PDF" class="me-2"> <img :src="iconPdf" border="0" alt="PDF" style="width: 1em; height: 1em; display: inline-block" /></a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </template>
                            </template>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="10" class="text-center">{{ t('common.labels.loading') }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- pagination -->
                    <div class="d-flex justify-content-between align-items-center">
                        <div>{{ t('common.labels.page') }} {{ currentPage }} {{ t('common.labels.of') }} {{ totalPages }}</div>
                        <div>
                            <button class="btn btn-sm btn-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">{{ t('common.buttons.prev') }}</button>
                            <button class="btn btn-sm btn-secondary" :disabled="currentPage === totalPages" @click="currentPage++">{{ t('common.buttons.next') }}</button>
                        </div>
                    </div>
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
