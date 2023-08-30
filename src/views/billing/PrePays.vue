<script setup lang="ts">
import { ref, reactive, defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { usePrePayStore, useSiteStore } from '@/stores';
import $ from 'jquery';
import Swal from 'sweetalert2';
const siteStore = useSiteStore();
const prepayStore = usePrePayStore();
const { loading, error, custid, ima, modules, prepays, total_pages, total_records, limit, page, curr_page_records, allInfo } = storeToRefs(prepayStore);
siteStore.setPageHeading('PrePaid Funds');
siteStore.setTitle('PrePaid Funds');
siteStore.setBreadcrums({ '/home': 'Home', '': 'PrePays' });

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
        for (let key in allInfo.value[module]['service_types']) {
            types_option += `<option value="${key}">${allInfo.value[module]['service_types'][key]['services_name']}</option>`;
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
        html: '<p>Are you sure want to delete your <strong>prepay #' + prepay_id + '</strong> and its related history ?</p>',
        preConfirm: () => {
            $('#deleteForm').submit();
        },
    });
}

prepayStore.load();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-12 text-md">
            <div class="mb-5 text-center">
                <a href="javascript:void(0);" class="btn btn-custom" data-toggle="modal" data-target="#add-prepay"><i class="fa fa-plus" aria-hidden="true"></i> Add New Prepay</a>
            </div>

            <template v-if="prepays">
                <div v-for="(p_details, p_id) in prepays" :key="p_id" class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <p>Prepay ID : {{ p_details.prepay.prepay_id }}</p>
                                <p>Module: {{ p_details.prepay.prepay_module ? p_details.prepay.prepay_module : 'All' }}</p>
                                <p>Balance: {{ p_details.prepay.prepay_remaining_disp }}</p>
                                <p>Automatically use on Invoices: {{ p_details.prepay.prepay_automatic_use === '1' ? 'Yes' : 'No' }}</p>
                            </div>
                            <div class="col-md-3">
                                <!--
              <a class="btn btn-custom" href="javascript:void(0);" data-toggle="modal" data-target="#add-funds" title="Add Fund" @click="addAmount(p_details.prepay.prepay_id, p_details.prepay.prepay_module)">
                <i class="fa fa-plus"></i> Add Funds
              </a>
              <a v-if="p_details.prepay.prepay_remaining === 0" class="btn btn-custom ml-2" href="javascript:void(0);" @click="deletePrepay(p_details.prepay.prepay_id)">
                <i class="fa fa-trash"></i> Delete
              </a>
              -->
                            </div>
                            <div class="col-md-6">
                                <div v-if="typeof p_details.history != 'undefined' && Array.isArray(p_details.history) && p_details.history.length > 0" class="card card-secondary collapsed-card">
                                    <div class="card-header">
                                        <h3 class="card-title">History Log</h3>
                                        <div class="card-tools">
                                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-plus"></i></button>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <table class="table-sm table">
                                            <thead>
                                                <tr>
                                                    <!-- <th>ID</th> -->
                                                    <th>Date</th>
                                                    <th>Description</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="p_history in p_details.history" :key="p_history.history_id">
                                                    <!-- <td>{{ p_history.history_id }}</td> -->
                                                    <td>{{ p_history.history_timestamp_disp }}</td>
                                                    <td>{{ p_history.desc }}</td>
                                                    <td class="text-right">{{ p_history.amt_used }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <span v-else class="text-red">No History found!</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row py-3" v-if="prepays.length > 0">
                    <div class="col text-left">
                        <h6 class="pl-3">
                            <small>Showing page {{ page }} of {{ total_pages }} and {{ curr_page_records }} records out of {{ total_records }}</small>
                        </h6>
                    </div>
                    <div class="col">
                        <nav aria-label="Page navigation example">
                            <ul class="pagination justify-content-end">
                                <li class="page-item" :class="{ disabled: page === 1 }">
                                    <a class="page-link" :href="`prepays?page=${page - 1}`" tabindex="-1">Previous</a>
                                </li>
                                <li class="page-item" :class="{ active: page === i }" v-for="i in total_pages" :key="i">
                                    <a class="page-link" :href="`prepays?page=${i}`">{{ i }}</a>
                                </li>
                                <li class="page-item" :class="{ disabled: page === total_pages }">
                                    <a class="page-link" :href="`prepays?page=${page + 1}`">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </template>
            <template v-else>
                <hr />
                <div class="text-red text-center">No Prepaid funds available</div>
            </template>
        </div>
    </div>
    <div class="modal fade" id="add-funds" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">Add Funds</h4>
                </div>
                <div class="modal-body">
                    <form action="prepays" method="post" class="">
                        <input type="hidden" name="action" value="addfunds" />
                        <input id="prepay_hiddenid" type="hidden" name="prepay_id" value="" />
                        <input type="hidden" id="p_module" name="prepay_module" value="" />
                        <div class="form-group row">
                            <label class="col-md-4 col-form-label text-right" for="prep_id">Prepay ID</label>
                            <div class="col-sm-6 input-group">
                                <input type="text" class="form-control form-control-sm" id="prep_id" name="prep_id" value="" disabled />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-4 col-form-label text-right" for="amount">Amount in USD</label>
                            <div class="col-sm-6 input-group">
                                <input type="text" class="form-control form-control-sm" id="amount" name="amount" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-sm-12 text-center">
                                <button class="btn btn-primary btn-sm mr-2" type="submit">Add Funds</button>
                                <button class="btn btn-danger btn-sm" type="button" data-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="add-prepay" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Add New Prepay</h4>
                </div>
                <div class="modal-body">
                    <form action="prepays" method="post" class="">
                        <input type="hidden" name="action" value="addnewprepay" />
                        <div class="form-group row">
                            <label class="col-md-6 col-form-label" for="module-select">Select Module to use this prepay for</label>
                            <div class="col-sm-6 input-group">
                                <select id="module-select" name="module" class="form-control select2" @change="addPrepayUpdates($event)">
                                    <option v-for="(module_name, module) in modules" :value="module" :key="module">{{ module_name }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-6 col-form-label" for="amount">Amount in USD</label>
                            <div class="col-sm-6 input-group">
                                <input type="text" class="form-control form-control-sm" id="amount" name="amount" value="100" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-6 col-form-label" for="auto-use">Automatically use on new invoices</label>
                            <div class="col-sm-6 input-group">
                                <div class="icheck-success d-inline">
                                    <input class="form-check-input" type="radio" name="automatic_use" id="a-inlineRadio1" value="1" checked />
                                    <label class="form-check-label" for="a-inlineRadio1">Yes</label>
                                </div>
                                <div class="icheck-success d-inline pl-2">
                                    <input class="form-check-input" type="radio" name="automatic_use" id="a-inlineRadio2" value="0" />
                                    <label class="form-check-label" for="a-inlineRadio2">No</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-sm-12 text-center">
                                <button class="btn btn-primary btn-sm mr-2" type="submit">Submit</button>
                                <button class="btn btn-danger btn-sm" type="button" data-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <form id="deleteForm" action="prepays" method="POST">
        <input type="hidden" name="p_id" value="" id="p_id" />
        <input type="hidden" name="action" value="delete" />
    </form>
</template>

<style scoped>
.select2-container {
    width: 100% !important;
}
</style>
