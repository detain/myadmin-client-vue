<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { ref, computed, onMounted } from 'vue';
/*import $ from 'jquery';
import 'jquery';
import jQuery from 'jquery';
import 'jquery-ui/dist/jquery-ui.js';
import Popper from 'popper.js';
import 'bootstrap';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs4/js/buttons.bootstrap4';
import 'datatables.net-responsive';*/
import 'datatables.net';
import 'datatables.net-bs4';
import DataTable from 'datatables.net-dt';

import { useSiteStore } from '@/stores';
const siteStore = useSiteStore();
siteStore.setPageHeading('VPS List');
siteStore.setTitle('VPS List');
siteStore.setBreadcrums({ '/home': 'Home', '': 'VPS List' });
const baseUrl = siteStore.getBaseUrl();

/*DataTable.use(DataTablesCore);*/

const limitStatus = ref('active');
const limitStatusMap = {
    active: ['active'],
    pending: ['pending', 'pending-setup', 'pend-approval'],
    expired: ['expired', 'canceled'],
    all: ['active', 'pending', 'pending-setup', 'pend-approval', 'expired', 'canceled'],
};
const data = ref([]);
const table = ref();
const dt = ref(null);

const columns = [{ data: 'vps_id' }, { data: 'vps_name' }, { data: 'repeat_invoices_cost' }, { data: 'vps_hostname' }, { data: 'vps_ip' }, { data: 'vps_status' }, { data: 'services_name' }, { data: 'vps_comment' }, { name: 'link', data: 'link', sortable: false }];

const options = {
    responsive: true,
};

const filteredData = computed(() => {
    if (limitStatus.value === 'all') {
        return data.value;
    } else {
        return data.value.filter((item) => limitStatusMap[limitStatus.value].includes(item.vps_status));
    }
});

onMounted(function () {});

const loadVpsList = async (data) => {
    try {
        const useDT = false;
        const response = await fetchWrapper.get(baseUrl + '/vps');
        console.log('api success');
        console.log(response);
        if (useDT === false) {
            data.value = response;
        } else {
            dt.value = new DataTable('#crud-table', {
                data: response,
                columns: [
                    { data: 'vps_id' },
                    { data: 'vps_name' },
                    { data: 'repeat_invoices_cost' },
                    {
                        data: null,
                        render: (data, type, row, meta) => {
                            return '<a href="" @click.prevent="router.push(`/vps/${row.vps_id}`);">' + row.vps_hostname + '</a>';
                        },
                    },
                    { data: 'vps_ip' },
                    { data: 'vps_status' },
                    { data: 'services_name' },
                    { data: 'vps_comment' },
                    {
                        name: 'link',
                        data: null,
                        sortable: false,
                        render: (data, type, row, meta) => {
                            return '<router-link :to="\'vps/' + row.vps_id + '\'" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link>';
                        },
                    },
                ],
            });
        }
    } catch (error) {
        console.log('api failed');
        console.log(error);
    }
};

loadVpsList(data);
</script>

<template>
    <link rel="stylesheet" href="/node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css" />
    <link rel="stylesheet" href="/css/crud_table5.css" />
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header text-right">
                    <div class="row float-right">
                        <div id="search_btns" class="col-md-auto printer-hidden pl-2 text-right">
                            <form accept-charset="UTF-8" role="form" id="paginationForm" class="" action="ajax.php?choice=crud&crud=view_vps_list&action=list" autocomplete="on" method="GET">
                                <a id="crud-search" class="btn btn-sm btn-primary" href="" title="Search" data-tile="Search"> <span class="fa fa-search fa-fw"></span> Search </a>
                                <span id="crud-search-more" class="crud-search form-inline float-right" style="display: none">
                                    <input class="crud-searchdata crud-search-active form-control form-control-sm mr-1" name="search" data-type="text" type="text" value="" />
                                    <select class="crud-daterange crud-searchdata form-control form-control-sm selectpicker mr-1" name="range" data-fieldtype="date" style="display: none">
                                        <option value="">- choose range -</option>
                                        <option value="next_year" data-from="" data-to="">Next Year</option>
                                        <option value="next_month" data-from="" data-to="">Next Month</option>
                                        <option value="today" data-from="" data-to="">Today</option>
                                        <option value="this_week_today" data-from="" data-to="">This Week up to today</option>
                                        <option value="this_week_full" data-from="" data-to="">This full Week</option>
                                        <option value="last_week" data-from="" data-to="">Last Week</option>
                                        <option value="last_2weeks" data-from="" data-to="">Last two Weeks</option>
                                        <option value="this_month" data-from="" data-to="">This Month</option>
                                        <option value="last_month" data-from="" data-to="">Last Month</option>
                                        <option value="last_3months" data-from="" data-to="">Last 3 Months</option>
                                        <option value="last_6months" data-from="" data-to="">Last 6 Months</option>
                                        <option value="this_year" data-from="" data-to="">This Year</option>
                                        <option value="last_year" data-from="" data-to="">Last Year</option>
                                    </select>
                                    <input class="crud-searchdata crud-datepicker-from form-control form-control-sm mr-1" name="date_from" style="display: none" data-type="datetime" data-fieldtype="date" type="text" value="" />
                                    <input class="crud-searchdata crud-datepicker-to form-control form-control-sm mr-1" name="date_to" style="display: none" data-type="datetime" data-fieldtype="date" type="text" value="" />
                                    <select class="crud-data crud-columns-select form-control form-control-sm mr-1" name="column" id="crud_search_column">
                                        <option value="">All fields</option>
                                        <option value="vps_id" data-type="int">ID</option>
                                        <option value="vps_ip" data-type="int">IP</option>
                                        <option value="vps_status" data-type="int">Status</option>
                                        <option value="vps_hostname" data-type="int">Hostname</option>
                                        <option value="vps_comment" data-type="int">Comments</option>
                                        <option value="repeat_invoices_cost" data-type="int">Cost</option>
                                        <option value="vps_name" data-type="int">Server</option>
                                        <option value="services_name" data-type="int">Package</option>
                                    </select>
                                    <span class="btn-group">
                                        <a class="btn btn-sm btn-primary" href="" data-search="1" id="crud_search_button">Go</a>
                                    </span>
                                </span>
                            </form>
                        </div>
                        <div id="header_btns" class="col-md-auto printer-hidden pl-2 text-right">
                            <div class="btn-group">
                                <router-link to="vps/order" class="btn btn-primary btn-sm printer-hidden" title="Order VPS"><i class="fa fa-shopping-cart"></i> Order</router-link>
                            </div>
                        </div>
                        <div id="print_expo_btns" class="col-md-auto export printer-hidden float-right pl-2">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-secondary" type="button" title="Print" @click="crud_print()"><i class="fa fa-print crud-icon"></i>Print</button>
                                <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" title="Export data" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-download crud-icon"></i>Export <span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>
                                <ul class="dropdown-menu" role="menu">
                                    <li role="presentation" data-type="xlsx">
                                        <a href="#" data-container="body" title="Excel 2007+" @click.prevent="crud_export(this)"><img src="/images/crud/xlsx.png" alt="" /> XLSX</a>
                                    </li>
                                    <li role="presentation" data-type="xls">
                                        <a href="#" data-container="body" title="Excel 2003/BIFF" @click.prevent="crud_export(this)"><img src="/images/crud/xls.png" alt="" /> XLS</a>
                                    </li>
                                    <li role="presentation" data-type="ods">
                                        <a href="#" data-container="body" title="OpenDocument SpreadSheet" @click.prevent="crud_export(this)"><img src="/images/crud/ods.png" alt="" /> ODS</a>
                                    </li>
                                    <li role="presentation" data-type="pdf">
                                        <a href="#" data-container="body" title="Adobe Portable Document Format" @click.prevent="crud_export(this)"><img src="/images/crud/pdf.png" alt="" /> PDF</a>
                                    </li>
                                    <li role="presentation" data-type="xml">
                                        <a href="#" data-container="body" title="Extensible Markup Language" @click.prevent="crud_export(this)"><img src="/images/crud/xml.png" alt="" /> XML</a>
                                    </li>
                                    <li role="presentation" data-type="php">
                                        <a href="#" data-container="body" title="PHP Array" @click.prevent="crud_export(this)"><img src="/images/crud/php.png" alt="" /> PHP</a>
                                    </li>
                                    <li role="presentation" data-type="csv">
                                        <a href="#" data-container="body" title="Comma-Seperated Values" @click.prevent="crud_export(this)"><img src="/images/crud/csv.png" alt="" /> CSV</a>
                                    </li>
                                    <li role="presentation" data-type="json">
                                        <a href="#" data-container="body" title="JSON" @click.prevent="crud_export(this)"><img src="/images/crud/json.png" alt="" /> JSON</a>
                                    </li>
                                    <li role="presentation" data-type="bbcode">
                                        <a href="#" data-container="body" title="BBcode" @click.prevent="crud_export(this)"><img src="/images/crud/bbcode.png" alt="" /> BBCODE</a>
                                    </li>
                                    <li role="presentation" data-type="wiki">
                                        <a href="#" data-container="body" title="WikiCode" @click.prevent="crud_export(this)"><img src="/images/crud/wiki.png" alt="" /> WIKI</a>
                                    </li>
                                    <li role="presentation" data-type="markdown">
                                        <a href="#" data-container="body" title="MarkDown" @click.prevent="crud_export(this)"><img src="/images/crud/markdown.png" alt="" /> MARKDOWN</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="title_btns" class="col-md-auto printer-hidden pl-2">
                            <div class="btn-group" id="limitStatusGroup">
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'active' }" @click.prevent="limitStatus = 'active'">Active</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'pending' }" @click.prevent="limitStatus = 'pending'">Pending</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'expired' }" @click.prevent="limitStatus = 'expired'">Expired</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'all' }" @click.prevent="limitStatus = 'all'">All</a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                    <div id="crud" class="crud">
                        <div class="row">
                            <div class="col-md-12">
                                <table :options="options" :columns="columns" class="display nowrap crud-table table-bordred table-striped table-hover table-sm table" width="100%" ref="table" id="crud-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Server</th>
                                            <th>Cost</th>
                                            <th>Hostname</th>
                                            <th>IP</th>
                                            <th>Status</th>
                                            <th>Package</th>
                                            <th>Comments</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, rowIndex) in filteredData" :key="rowIndex" style="text-align: center">
                                            <td>{{ row.vps_id }}</td>
                                            <td>{{ row.vps_name }}</td>
                                            <td>{{ row.repeat_invoices_cost }}</td>
                                            <td>
                                                <router-link :to="'vps/' + row.vps_id">{{ row.vps_hostname }}</router-link>
                                            </td>
                                            <td>{{ row.vps_ip }}</td>
                                            <td>{{ row.vps_status }}</td>
                                            <td>{{ row.services_name }}</td>
                                            <td>{{ row.vps_comment }}</td>
                                            <td>
                                                <router-link :to="'vps/' + row.vps_id" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <form accept-charset="UTF-8" role="form" id="paginationForm" class="" action="ajax.php?choice=crud&crud=view_vps_list&action=list" autocomplete="on" method="GET" style="display: inline-flex">
                                    <div class="btn-group row-counts" role="group" aria-label="Rows Per Page">
                                        <button type="button" class="btn btn-secondary btn-sm" data-limit="10">10</button>
                                        <button type="button" class="btn btn-secondary btn-sm" data-limit="25">25</button>
                                        <button type="button" class="btn btn-secondary btn-sm" data-limit="50">50</button>
                                        <button type="button" class="btn btn-secondary btn-sm active" data-limit="100">100</button>
                                        <button type="button" class="btn btn-secondary btn-sm" data-limit="-1">All</button>
                                    </div>

                                    <span class="btn-group nav-rows">
                                        <a class="btn btn-sm btn-info refresh" href="" title="Refresh Table" data-title="Refresh Table">
                                            <span class="fas fa-sync fa-fw"></span>
                                        </a>
                                    </span>
                                </form>
                            </div>
                            <div class="col-md-6 float-right">
                                <nav aria-label="Page navigation float-right" class="crud">
                                    <ul class="pagination justify-content-end">
                                        <li id="crud-pager-prev" class="page-item disabled">
                                            <a class="page-link" href="javascript:void(0);" aria-label="Previous">
                                                <span aria-hidden="true">&laquo;</span>
                                                <span class="sr-only">Previous</span>
                                            </a>
                                        </li>
                                        <li class="page-item crud-page active"><a class="page-link" href="" data-offset="0">1</a></li>
                                        <li class="page-item crud-page"><a class="page-link" href="" data-offset="100">2</a></li>
                                        <li id="crud-pager-next" class="page-item">
                                            <a class="page-link" href="#" aria-label="Next">
                                                <span aria-hidden="true">&raquo;</span>
                                                <span class="sr-only">Next</span>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import 'datatables.net-bs4';
/*@import 'datatables.net-buttons-bs4';
@import 'datatables.net-responsive-bs4';*/
a.btn-info:link,
a.btn-info:active,
a.btn-info:visited,
a.btn-info:hover {
    font-size: inherit;
}

div.dataTables_length label,
div.dataTables_filter label {
    text-align: left;
    white-space: nowrap;
}

div.dataTables_filter {
    text-align: right;
}
</style>
