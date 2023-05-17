<script setup>
import { storeToRefs } from 'pinia';
import { useInvoicesStore, useLayoutStore } from '@/stores';
import { ref, computed, onMounted } from "vue";
const layoutStore = useLayoutStore();
const { breadcrums, page_heading } = storeToRefs(layoutStore);
layoutStore.setPageHeading('Invoice List');
layoutStore.setTitle('Invoice List');
layoutStore.setBreadcrums({'/home': 'Home', '': 'Invoices'});

const invoicesStore = useInvoicesStore();
const { custid, month, year, months_arr, years_arr, rows, loading, error } = storeToRefs(invoicesStore);

const submitForm = () => {
    console.log(`Selected month: ${month.value}`);
    console.log(`Selected year: ${year.value}`);
};
const invoicesTable = ref(null);

invoicesStore.getAll();
onMounted(() => {
    $(invoicesTable.value).DataTable({
        createdRow(row, data, index) {
            const invoiceId = $(row).find("td").eq(0).text();
            const hrefUrl = $(row).find("td:first a").attr("href");
            $(row).find("td").eq(9).html(`<a href="${hrefUrl}" title="Download Invoice PDF"><i class="icon-pdf"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-pdf"></use></svg></i></a> <a href="${hrefUrl.replace(/pdf\.php/g,"index.php")}" title="View Invoice"><i class="icon-view-details"><svg><use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-view-details"></use></svg></i></a>`);
        },
        order: [[0, "desc"]],
        pageLength: 50,
        lengthMenu: [
            [10, 25, 50, 100, 500, -1],
            [10, 25, 50, 100, 500, "All"]
        ],
        ajax: {
            url: "api/invoices",
            dataSrc: "data"
        },
        columns: [
            { data: "id" },
            { data: "date" },
            { data: "service" },
            { data: "description" },
            { data: "amount" },
            { data: "paid" },
            { data: "payment_type" },
            { data: "payment_description" },
            { data: "paid_on" },
            { data: null, defaultContent: "" }
        ]
    });
});

</script>

<template>
<div class="row justify-content-center">
    <div class="col-md-12">
        <div class="card shadow-none">
            <div class="card-header">
                <h3 class="card-title"><i class="fa fa-money"></i> Invoices List</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col">
                        <form class="form-inline d-inline w-100" method="post">
                            <div class="row">
                                <div class="col-md-2">
                                    <div class="input-group">
                                        <label class="mx-2">Filter </label>
                                        <select v-model="month" class="form-control form-control-sm select2" @change="submitForm">
                                            <option value="">All</option>
                                            <option v-for="(text, val) in months_arr" :key="val" :value="val" :selected="month === val">{{ text }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="input-group">
                                        <select v-model="year" class="select2 form-control form-control-sm" @change="submitForm">
                                            <option value="">All</option>
                                            <option v-for="(text, val) in years_arr" :key="val" :value="val" :selected="year === val">{{ text }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <button type="submit" name="Submit" value="export_excel" class="btn btn-primary mb-2 btn-sm">Export Excel</button>
                                    <button type="submit" name="Submit" value="export_pdf" class="btn btn-primary mb-2 btn-sm">Export PDF</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <hr>
                <table id="invoices_table" class="table table-sm display compact">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Service</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Paid</th>
                            <th>Payment</th>
                            <th>Payment Description</th>
                            <th>Paid On</th>
                            <th>Links</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading"><td colspan="10">Loading...</td></tr>
                        <tr v-else v-for="(row, index) in rows" :key="index">
                            <td><a :href="'pdf.php?choice=view_invoice&module=' + row.module + '&id=' + row.id">{{ row.id }}</a></td>
                            <td>{{ row.date }}</td>
                            <td>{{ row.service }}</td>
                            <td>{{ row.description }}</td>
                            <td class="text-right">{{ row.amount }}</td>
                            <td>{{ row.paid }}</td>
                            <td>{{ row.payment_type }}</td>
                            <td>{{ row.payment_description }}</td>
                            <td>{{ row.paid_on }}</td>
                            <td></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Service</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Paid</th>
                            <th>Payment Type</th>
                            <th>Payment Description</th>
                            <th>Paid On</th>
                            <th>Links</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</div>
</template>
