<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';

import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';

import $ from 'jquery';
const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});

siteStore.setTitle('');
siteStore.setPageHeading('');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module.value)}`, module.value],
]);
siteStore.addBreadcrum(`/${moduleLink(module.value)}/${id.value}`, `View ${module.value} ${id.value}`);
siteStore.addBreadcrum(`/${moduleLink(module.value)}/${id.value}/invoices`, `${module.value} Invoices`);

type InvoiceRow = [string, string, string, string, string, string, string, string, string, string, string, string, string];
type ChargeInvoiceRow = [...InvoiceRow, InvoiceRow[]];
type InvoiceRows = ChargeInvoiceRow[];
type ChargeInvoiceRows = InvoiceRow[];
type Prefixes = Record<string, string>;
interface PaymentType {
    type: string;
    image: string;
    text: string;
}
type PaymentTypes = Record<string, PaymentType>;

const dataSets = ref<InvoiceRows>([]);
const eDataSet = ref<ChargeInvoiceRows>([]);
const prefixes = ref<Prefixes>({});
const invoicesId = ref(0);
const invoicesDescription = ref('');

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
        paid_content = '<table id="paid_content" class="display table table-striped table-sm table-hover" style="width:100%">' + '<thead>' + '<tr>' + '<th>&nbsp;</th>' + '<th>ID</th>' + '<th>Paid On</th>' + '<th>Description</th>' + '<th>Amount</th>' + '<th>Paid By</th>' + '<th>Links</th>' + '</tr>' + '</thead>' + '<tbody>';
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
            paid_content = `${paid_content}<tr>` + `<td class="details-control-refund sorting_disabled" style="width: 40px;">&nbsp;</td>` + `<td>${d[13][i][0]}</td>` + `<td>${d[13][i][1]}</td>` + `<td>${trnx_col}</td>` + `<td>${d[13][i][12]}${d[13][i][5]}</td>` + `<td>${payment_type}</td>` + `<td>${plinks}</td>` + `</tr>`;
            //console.log(paid_content);
            if (typeof d[13][i][13] == 'undefined' || d[13][i][13].length == 0) {
                console.log('not sure what this is for');
            } else {
                refund_content = '<tr><td colspan="7"><table id="refund_rows" class="display table table-striped table-sm table-hover" style="width:100%">' + '<thead>' + '<tr>' + '<th></th>' + '<th>ID</th>' + '<th>Refunded On</th>' + '<th>Description</th>' + '<th>Amount</th>' + '<th>Links</th>' + '</tr>' + '</thead>' + '<tbody>';
                for (let j = 0; j < d[13][i][13].length; j++) {
                    links = get_links(d[13][i][13][j]);
                    refund_content = `${refund_content}<tr>` + `<td style="width: 40px;">&nbsp;</td>` + `<td>${d[13][i][13][j][0]}</td>` + `<td>${d[13][i][13][j][1]}</td>` + `<td>${trnx_col}</td>` + `<td>${d[13][i][13][j][12]}${d[13][i][13][j][5]}</td>` + `<td>${links}</td>` + `</tr>`;
                }
                refund_content = `${refund_content}</tbody></table></td></tr>`;
                paid_content = paid_content + refund_content;
            }
            //console.log(paid_content);
        }
        paid_content = `${paid_content}</tbody>` + `</table>`;
    }
    //console.log(paid_content);
    return paid_content;
}

function get_links(row: string[]) {
    let out = '';
    if (Number(row[4]) >= 10) {
        out = `${out}<a href="view_${prefixes.value[row[9]]}&id=${row[2]}&link=invoices&resend_payment_confirmation=${row[0]}" data-toggle="tooltip" title="E-Mail Payment Confirmation"><i class="icon-new-message"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-new-message"></use></svg></i></a>`;
    } else {
        out = `${out}<a href="view_${prefixes.value[row[9]]}&id=${row[2]}&link=invoices&resend_invoice=${row[0]}" data-toggle="tooltip" title="E-Mail the Invoice"><i class="icon-new-message"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-new-message"></use></svg></i></a>`;
    }
    if (row[4] == '1') {
        if (Number(row[6]) == 0) {
            out = `${out}<a href="view_balance&module=${row[9]}&invoice=${row[0]}" data-toggle="tooltip" title="Pay Invoice"><i class="icon-cash-register"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-cash-register"></use></svg></i></a>`;
        }
        out = `${out}<a href="view_invoice&id=${row[0]}&module=${row[9]}" data-toggle="tooltip" title="View Invoice" title="View Invoice" ><i class="icon-analyze"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-analyze"></use></svg></i></a>`;
        out = `${out}<a href="pdf.php?choice=view_invoice&id=${row[0]}&module=${row[9]}" data-toggle="tooltip" title="View Invoice as PDF"><i class="icon-pdf"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-pdf"></use></svg></i></a>`;
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

$(document).ready(function () {});

try {
    fetchWrapper.get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/invoices`).then((response) => {
        console.log(`${module.value} invoices success`);
        console.log(response);
        dataSets.value = response.invoices;
        eDataSet.value = response.one_array;
        prefixes.value = response.prefixes;
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
                            out = out+'<a href="view_'+prefixes.value[row[9]]+'&id='+row[2]+'&link=invoices&resend_payment_confirmation='+row[0]+'" data-toggle="tooltip" title="E-Mail Payment Confirmation"><i class="icon-new-message"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-new-message"></use></svg></i></a>';
                        } else {
                            out = out+'<a href="view_'+prefixes.value[row[9]]+'&id='+row[2]+'&link=invoices&resend_invoice='+row[0]+'" data-toggle="tooltip" title="E-Mail the Invoice"><i class="icon-new-message"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-new-message"></use></svg></i></a>';
                        }
                        if (row[4] == '1') {
                            if (Number(row[6]) == 0) {
                                out = out+'<a href="view_balance&module='+row[9]+'&invoice='+row[0]+'" data-toggle="tooltip" title="Pay Invoice"><i class="icon-cash-register"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-cash-register"></use></svg></i></a>';
                            }
                            out = out+'<a target="_blank"  href="view_invoice&id='+row[0]+'&module='+row[9]+'" data-toggle="tooltip" title="View Invoice" title="View Invoice" ><i class="icon-analyze"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-analyze"></use></svg></i></a>';
                            out = out+'<a href="pdf.php?choice=view_invoice&id='+row[0]+'&module='+row[9]+'" data-toggle="tooltip" title="View Invoice as PDF"><i class="icon-pdf"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-pdf"></use></svg></i></a>';
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
                console.log(row);
                console.log(row.child());
                console.log(format(row.data()));
            }
        });
        */
    });
} catch (error: any) {
    console.log(`${module.value} invoices failed`);
    console.log(error);
}
</script>

<template>
    <div class="row justify-content-center mt-4">
        <div class="col-md-12">
            <div class="card shadow-none">
                <div class="card-header">
                    <h3 class="card-title"><i class="fa fa-file-invoice-dollar">&nbsp;</i>Invoices</h3>
                    <div class="card-tools">
                        <button class="btn-custom text-sm" data-toggle="tooltip" title="Go Back" @click="previous"><i class="fas fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</button>
                    </div>
                </div>
                <div class="card-body row justify-content-center">
                    <table id="invoice_table" class="table-bordered mt-2 table">
                        <thead>
                            <tr>
                                <th>More Details</th>
                                <th>ID</th>
                                <th>Invoice Date</th>
                                <th>Due Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Paid</th>
                                <th>Links</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
