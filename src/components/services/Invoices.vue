<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores';
const props = defineProps(['id']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
siteStore.setTitle('');
siteStore.setPageHeading('');
siteStore.setBreadcrums({ '/home': 'Home', '/vps': 'VPS' });
siteStore.addBreadcrum('/vps/' + props.id, 'View VPS ' + props.id);
siteStore.addBreadcrum('/vps/' + props.id + '/', '');

const dataSets = ref({});
const eDataSet = ref({});
const prefixes = ref({});
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
</script>

<template>
    <div class="row justify-content-center mt-4">
        <div class="col-md-12">
            <div class="card shadow-none">
                <div class="card-header">
                    <h3 class="card-title"><i class="fa fa-file-invoice-dollar">&nbsp;</i>Invoices</h3>
                    <div class="card-tools">
                        <button class="btn-custom text-sm" @click="previous" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</button>
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
