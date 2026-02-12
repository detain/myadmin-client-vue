<script setup lang="ts">
import { ref, reactive, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePrePayStore } from '@/stores/prepay.store';
import { useSiteStore } from '@/stores/site.store';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const prepayStore = usePrePayStore();
const router = useRouter();
const { loading, error, custid, ima, modules, prepays, total_pages, total_records, limit, page, curr_page_records, allInfo } = storeToRefs(prepayStore);
siteStore.setPageHeading('PrePaid Funds');
siteStore.setTitle('PrePaid Funds');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'PrePays'],
]);
/* =====================
   STATE (replace with API)
===================== */
const expandedHistory = reactive<Record<number, boolean>>({});
const newPrepay = reactive({
    module: 'default',
    amount: 100,
    automatic_use: '1',
});

/* =====================
   TYPES
===================== */
interface Prepay {
    prepay_id: string;
    prepay_module: string | null;
    prepay_remaining_disp: string;
    prepay_automatic_use: string;
}

interface PrepayHistory {
    history_id: string;
    history_timestamp_disp: string;
    desc: string;
    amt_used: string;
}

interface PrepayItem {
    prepay: Prepay;
    history: PrepayHistory[];
}

function addPrepayUpdates(event: Event) {
    const module = (event.target as HTMLInputElement).value;
    if (module === 'default') {
        $('.servicerow').hide();
        $('.typerow').hide();
    } else {
        let service_options = '<option value="0">All</option>';
        for (let key in allInfo.value[module]['services']) {
            service_options += `<option value="${key}">${allInfo.value[module]['services'][key]}</option>`;
        }
        $('#service-select').html(service_options).trigger('render');
        let types_option = '<option value="0">All</option>';
        for (let key in allInfo.value[module].services) {
            types_option += `<option value="${key}">${allInfo.value[module].services[key]['services_name' as any]}</option>`;
        }
        $('#type-select').html(types_option).trigger('render');
        $('.servicerow').show();
        $('.typerow').show();
    }
}

function add_amount(prepay_id: string | number, module: string) {
    $('#prepay_hiddenid').val(prepay_id);
    $('#prep_id').val(prepay_id);
    $('#p_module').val(module);
}
function delete_prepay(prepay_id: string | number) {
    $('#p_id').val(prepay_id);
    Swal.fire({
        icon: 'error',
        title: '<h3>Delete Prepay</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Delete it.',
        html: `<p>Are you sure want to delete your <strong>prepay #${prepay_id}</strong> and its related history ?</p>`,
        preConfirm: () => {
            $('#deleteForm').submit();
        },
    });
}

prepayStore.load();

/* =====================
   METHODS
===================== */
function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function toggleHistory(id: number) {
    expandedHistory[id] = !expandedHistory[id];
}

function goToPage(p: number) {
    if (p < 1 || p > total_pages.value) return;
    if (p !== page.value) {
        page.value = p;
        // fetchPrepays()
        prepayStore.load(page.value);
    }
}

function updateModuleOptions() {
    // placeholder for service/type logic
}

function submitNewPrepay() {
    // API call here
    console.log('Submitting prepay', newPrepay);
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper.post(`${baseUrl}/prepays`, newPrepay).then((response) => {
            Swal.close();
            console.log('Response:');
            console.log(response);
            if (response['success'] == true) {
                router.push(`/cart/${response.iids.join(',')}`);
            }
        });
    } catch (error: any) {
        Swal.close();
        console.log('caught error:');
        console.log(error);
    }
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-12 text-md">
            <div class="text-center mb-5">
                <button class="btn btn-custom" data-toggle="modal" data-target="#add-prepay"><i class="fa fa-plus" /> Add New Prepay</button>
            </div>
            <div v-if="loading" class="text-center">Loading…</div>
            <template v-if="Object.keys(prepays).length">
                <div v-for="p in prepays" :key="p.prepay.prepay_id" class="card mb-3">
                    <div class="card-body">
                        <div class="row">
                            <!-- LEFT COLUMN -->
                            <div class="col-md-3">
                                <p>Prepay ID : {{ p.prepay.prepay_id }}</p>
                                <p>
                                    Module:
                                    <span v-if="!p.prepay.prepay_module">All</span>
                                    <span v-else>{{ capitalize(p.prepay.prepay_module) }}</span>
                                </p>
                                <p>Balance: {{ p.prepay.prepay_remaining_disp }}</p>
                                <p>
                                    Automatically use on Invoices:
                                    {{ p.prepay.prepay_automatic_use == '1' ? 'Yes' : 'No' }}
                                </p>
                            </div>

                            <!-- ACTION COLUMN -->
                            <div class="col-md-3"></div>

                            <!-- HISTORY COLUMN -->
                            <div class="col-md-6">
                                <template v-if="p.history?.length">
                                    <div class="card card-secondary collapsed-card">
                                        <div class="card-header">
                                            <h3 class="card-title">History Log</h3>
                                            <div class="card-tools">
                                                <button class="btn btn-tool" data-card-widget="collapse" @click="toggleHistory(p.prepay.prepay_id)">
                                                    <i class="fas fa-plus" />
                                                </button>
                                            </div>
                                        </div>

                                        <div v-show="expandedHistory[p.prepay.prepay_id]" class="card-body">
                                            <table class="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Description</th>
                                                        <th class="text-end">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="h in p.history" :key="h.history_id">
                                                        <td>{{ h.history_timestamp_disp }}</td>
                                                        <td>{{ h.desc }}</td>
                                                        <td class="text-end">{{ h.amt_used }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </template>
                                <span v-else class="text-danger">No History found!</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PAGINATION -->
                <div class="row py-3">
                    <div class="col text-left">
                        <h6 class="pl-3">
                            <small> Showing page {{ page }} of {{ total_pages }} and {{ curr_page_records }} records out of {{ total_records }} </small>
                        </h6>
                    </div>

                    <div class="col">
                        <nav>
                            <ul class="pagination justify-content-end">
                                <li class="page-item" :class="{ disabled: page === 1 }">
                                    <button class="page-link" @click="goToPage(page - 1)">Previous</button>
                                </li>

                                <li v-for="i in total_pages" :key="i" class="page-item" :class="{ active: page === i }">
                                    <button class="page-link" @click="goToPage(i)">
                                        {{ i }}
                                    </button>
                                </li>

                                <li class="page-item" :class="{ disabled: page === total_pages }">
                                    <button class="page-link" @click="goToPage(page + 1)">Next</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </template>

            <template v-else>
                <hr />
                <div class="text-danger text-center">No Prepaid funds available</div>
            </template>
        </div>
    </div>

    <!-- ADD PREPAY MODAL -->
    <div id="add-prepay" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>Add New Prepay</h4>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="submitNewPrepay">
                        <div class="form-group row">
                            <label class="col-md-6 col-form-label"> Select Module </label>
                            <div class="col-sm-6">
                                <select v-model="newPrepay.module" class="form-control" @change="updateModuleOptions">
                                    <option v-for="(name, key) in modules" :key="key" :value="key">
                                        {{ name }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-6 col-form-label"> Amount in USD </label>
                            <div class="col-sm-6">
                                <input v-model.number="newPrepay.amount" type="number" class="form-control form-control-sm" />
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-6 col-form-label"> Automatically use on new invoices </label>
                            <div class="col-sm-6">
                                <label>
                                    <input v-model="newPrepay.automatic_use" type="radio" value="1" />
                                    Yes
                                </label>
                                <label class="ms-2">
                                    <input v-model="newPrepay.automatic_use" type="radio" value="0" />
                                    No
                                </label>
                            </div>
                        </div>

                        <div class="text-center">
                            <button class="btn btn-primary btn-sm me-2">Submit</button>
                            <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.select2-container {
    width: 100% !important;
}
</style>
