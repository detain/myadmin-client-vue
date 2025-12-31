<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInvoicesStore } from '../../stores/invoices.store';
import { useSiteStore } from '../../stores/site.store';

import { ref, computed, onMounted } from 'vue';
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
                                                <option v-for="(text, val) in years_arr" :key="val" :value="val" :selected="year === Number(val)">{{ text }}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <button type="submit" name="Submit" value="export_excel" class="btn btn-primary btn-sm mb-2">Export Excel</button>
                                        <button type="submit" name="Submit" value="export_pdf" class="btn btn-primary btn-sm mb-2">Export PDF</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <hr />
                    <table id="invoices_table" class="table-sm display compact table">
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
                            <tr v-if="loading">
                                <td colspan="10">Loading...</td>
                            </tr>
                            <tr v-else v-for="(row, index) in rows" :key="index">
                                <td>
                                    <a :href="'pdf.php?choice=view_invoice&module=' + row.module + '&id=' + row.id">{{ row.id }}</a>
                                </td>
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

<style scoped>
</style>
