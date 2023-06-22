<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '@/stores';
const siteStore = useSiteStore();
siteStore.setPageHeading('Affiliate - Signups');
siteStore.setTitle('Affiliate - Signups');
siteStore.setBreadcrums({'/home': 'Home', '/affiliate': 'Affiliate', '': 'Signups'});


onMounted(() => {
})
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-user-plus" aria-hidden="true">&nbsp;</i>Affiliate Signups
                        </h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class=" btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <span class="text-md">Export All Records: </span>
                            <router-link to="/affiliate/download/xlsx/all" id="ex_xlsx_all" title="Excel 2007+" class="btn btn-sm btn-custom export">Xlsx</router-link>
                            <router-link to="/affiliate/download/xls/all" id="ex_xls_all" title="Excel 2003/BIF" class="btn btn-sm btn-custom export">Xls</router-link>
                            <router-link to="/affiliate/download/csv/all" id="ex_csv_all" class="btn btn-sm btn-custom export">CSV</router-link>
                            <router-link to="/affiliate/download/pdf/all" id="ex_pdf_all" class="btn btn-sm btn-custom export">PDF</router-link>
                        </div>
                        <div class="col-md-4 mb-3">
                            <span class="text-md text-center">Affiliate Status: </span>
                            <div id="title_btns" class="nav nav-tabs">
                                <a class="active btn btn-info btn-sm" data-toggle="tab" href="#tab-default">Default</a>
                                <a class="btn btn-info btn-sm" data-toggle="tab" href="#tab-pending">Pending</a>
                                <a class="btn btn-info btn-sm" data-toggle="tab" href="#tab-paid">Paid</a>
                                <a class="btn btn-info" data-toggle="tab" href="#tab-failed">Failed</a>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3 text-right">
                            <span class="text-md">Export on Status: </span>
                            <!-- <div class="btn-group btn-sm"> -->
                            <router-link to="/affiliate/download/xlsx/default" id="ex_xlsx" title="Excel 2007+" class="btn btn-sm btn-custom export">Xlsx</router-link>
                            <router-link to="/affiliate/download/xls/default" id="ex_xls" title="Excel 2003/BIF" class="btn btn-sm btn-custom export">Xls</router-link>
                            <router-link to="/affiliate/download/csv/default" id="ex_csv" class="btn btn-sm btn-custom export">CSV</router-link>
                            <router-link to="/affiliate/download/pdf/default" id="ex_pdf" class="btn btn-sm btn-custom export">PDF</router-link>
                            <!-- </div> -->
                        </div>
                    </div>
                    <div class="tab-content">
                        <div class="tab-pane active" id="tab-default">
                            <div class="table-responsive">
                                <table id="table_default" class="table table-sm w-100">
                                    <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>SID</td>
                                            <td>Service</td>
                                            <td>Signup Date</td>
                                            <td>Activation Date</td>
                                            <!-- <td>Paid Amount</td>
                                                <td>Paid Date</td> -->
                                            <td>Days Active</td>
                                            <td>Status</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="tab-pane" id="tab-pending">
                            <div class="table-responsive">
                                <table id="table_pending" class="table table-sm w-100">
                                    <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>SID</td>
                                            <td>Service</td>
                                            <td>Signup Date</td>
                                            <td>Activation Date</td>
                                            <!-- <td>Paid Amount</td>
                                                <td>Paid Date</td> -->
                                            <td>Days Active</td>
                                            <td>Status</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="tab-pane" id="tab-failed">
                            <div class="table-responsive">
                                <table id="table_failed" class="table table-sm w-100">
                                    <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>SID</td>
                                            <td>Service</td>
                                            <td>Signup Date</td>
                                            <td>Activation Date</td>
                                            <td>Status</td>
                                            <td>Reason</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="tab-pane" id="tab-paid">
                            <div class="table-responsive">
                                <table id="table_paid" class="table table-sm w-100">
                                    <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>SID</td>
                                            <td>Service</td>
                                            <td>Signup Date</td>
                                            <td>Activation Date</td>
                                            <td>Paid Amount</td>
                                            <td>Paid Date</td>
                                            <td>Days Active</td>
                                            <td>Status</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {if isset($admin_disp)}
            {foreach from=$admin_disp key=panel_name item=displ}
            <div class="card">
                <div class="card-header">
                    <h4>{$panel_name}</h4>
                </div>
                <div class="card-body">{$displ}</div>
            </div>
            {/foreach}
            {/if}
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-user-plus" aria-hidden="true">&nbsp;</i>Affiliate Signups
                        </h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class=" btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <span class="text-md">Export All Records: </span>
                            <router-link to="/affiliate/download/xlsx/all" id="ex_xlsx_all" title="Excel 2007+" class="btn btn-sm btn-custom export">Xlsx</router-link>
                            <router-link to="/affiliate/download/xls/all" id="ex_xls_all" title="Excel 2003/BIF" class="btn btn-sm btn-custom export">Xls</router-link>
                            <router-link to="/affiliate/download/csv/all" id="ex_csv_all" class="btn btn-sm btn-custom export">CSV</router-link>
                            <router-link to="/affiliate/download/pdf/all" id="ex_pdf_all" class="btn btn-sm btn-custom export">PDF</router-link>
                        </div>
                        <div class="col-md-4 mb-3">
                            <span class="text-md text-center">Affiliate Status: </span>
                            <div id="title_btns" class="nav nav-tabs">
                                <a class="active btn btn-info btn-sm" data-toggle="tab" href="#tab-default">Default</a>
                                <a class="btn btn-info btn-sm" data-toggle="tab" href="#tab-pending">Pending</a>
                                <a class="btn btn-info btn-sm" data-toggle="tab" href="#tab-paid">Paid</a>
                                <a class="btn btn-info" data-toggle="tab" href="#tab-failed">Failed</a>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3 text-right">
                            <span class="text-md">Export on Status: </span>
                            <!-- <div class="btn-group btn-sm"> -->
                            <router-link to="/affiliate/download/xlsx/default" id="ex_xlsx" title="Excel 2007+" class="btn btn-sm btn-custom export">Xlsx</router-link>
                            <router-link to="/affiliate/download/xls/default" id="ex_xls" title="Excel 2003/BIF" class="btn btn-sm btn-custom export">Xls</router-link>
                            <router-link to="/affiliate/download/csv/default" id="ex_csv" class="btn btn-sm btn-custom export">CSV</router-link>
                            <router-link to="/affiliate/download/pdf/default" id="ex_pdf" class="btn btn-sm btn-custom export">PDF</router-link>
                            <!-- </div> -->
                        </div>
                    </div>
                    <div class="tab-content">
                        <div class="tab-pane active" id="tab-default">
                            <div class="table-responsive">
                                <table id="table_default" class="table table-sm w-100">
                                    <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>SID</td>
                                            <td>Service</td>
                                            <td>Signup Date</td>
                                            <td>Activation Date</td>
                                            <!-- <td>Paid Amount</td>
                                                <td>Paid Date</td> -->
                                            <td>Days Active</td>
                                            <td>Status</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="tab-pane" id="tab-pending">
                            <div class="table-responsive">
                                <table id="table_pending" class="table table-sm w-100">
                                    <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>SID</td>
                                            <td>Service</td>
                                            <td>Signup Date</td>
                                            <td>Activation Date</td>
                                            <!-- <td>Paid Amount</td>
                                                <td>Paid Date</td> -->
                                            <td>Days Active</td>
                                            <td>Status</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="tab-pane" id="tab-failed">
                            <div class="table-responsive">
                                <table id="table_failed" class="table table-sm w-100">
                                    <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>SID</td>
                                            <td>Service</td>
                                            <td>Signup Date</td>
                                            <td>Activation Date</td>
                                            <td>Status</td>
                                            <td>Reason</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="tab-pane" id="tab-paid">
                            <div class="table-responsive">
                                <table id="table_paid" class="table table-sm w-100">
                                    <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>SID</td>
                                            <td>Service</td>
                                            <td>Signup Date</td>
                                            <td>Activation Date</td>
                                            <td>Paid Amount</td>
                                            <td>Paid Date</td>
                                            <td>Days Active</td>
                                            <td>Status</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template v-if="adminDisp">
                <div v-for="(displ, panelName) in adminDisp" :key="panelName" class="card">
                    <div class="card-header">
                        <h4>{{ panelName }}</h4>
                    </div>
                    <div class="card-body">{{ displ }}</div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
</style>
