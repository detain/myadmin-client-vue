<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted } from "vue";
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs4/js/buttons.bootstrap4';
import 'datatables.net-responsive';

DataTable.use(DataTablesCore);

let dt;
const limitStatus = ref('active');
const limitStatusMap = {
    active: ['active'],
    pending: ['pending', 'pending-setup', 'pend-approval'],
    expired: ['expired', 'canceled'],
    all: ['active', 'pending', 'pending-setup', 'pend-approval', 'expired', 'canceled']
};
const origData = ref([]);
const data = ref([]);
const table = ref();

const columns = [
  { data: 'domain_id' },
  { data: 'domain_hostname' },
  { data: 'domain_expire_date' },
  { data: 'cost' },
  { data: 'domain_status' },
  { name: 'link', data: 'link', sortable: false },
];

const options = {
  responsive: true,
};

origData.value = [
    {screenshot: "<a href=\"index.php?choice=none.view_domain&id=376503\"><img src=\"https://shot.sh?w=300&h=100&img=hostingenuity.com\"></a>", domain_id: "376503", domain_hostname: "hostingenuity.com", domain_expire_date: "2022-02-09 16:20:25", cost: "12.00", domain_status: "active", link: "hi"},
    {screenshot: "<a href=\"index.php?choice=none.view_domain&id=592337\"><img src=\"https://shot.sh?w=300&h=100&img=detain.dev\"></a>", domain_id: "592337", domain_hostname: "detain.dev", domain_expire_date: "2023-08-14 00:59:38", cost: "18.00", domain_status: "active", link: "hi"},
    {screenshot: "<a href=\"index.php?choice=none.view_domain&id=418295\"><img src=\"https://shot.sh?w=300&h=100&img=unixsrv10.com\"></a>", domain_id: "418295", domain_hostname: "unixsrv10.com", domain_expire_date: "", cost: "11.00", domain_status: "canceled", link: "hi"},
    {screenshot: "<a href=\"index.php?choice=none.view_domain&id=408615\"><img src=\"https://shot.sh?w=300&h=100&img=kirais.art\"></a>", domain_id: "408615", domain_hostname: "kirais.art", domain_expire_date: "", cost: "47.00", domain_status: "pending", link: "hi"},
    {screenshot: "<a href=\"index.php?choice=none.view_domain&id=408918\"><img src=\"https://shot.sh?w=300&h=100&img=kiraart.bet\"></a>", domain_id: "408918", domain_hostname: "kiraart.bet", domain_expire_date: "", cost: "18.00", domain_status: "pending", link: "hi"}
];
const filteredData = computed(() => {
    if (limitStatus.value === 'all') {
      return origData.value;
    } else {
      return origData.value.filter(item => limitStatusMap[limitStatus.value].includes(item.domain_status));
    }
})


onMounted(function () {
//  dt = table.value.dt;
});

</script>

<template>
<link rel="stylesheet" href="https://mystage.detain.dev/lib/datatables.net-bs4/css/dataTables.bootstrap4.min.css">
<link rel="stylesheet" href="https://mystage.interserver.net/css/crud_table5.css">
<div class="row">
  <div class="col-md-12">
    <div class="card">
      <div class="card-header text-right">
        <div class="row float-right">
          <div id="search_btns" class="col-md-auto printer-hidden text-right pl-2">
            <form accept-charset="UTF-8" role="form" id="paginationForm" class="" action="ajax.php?choice=crud&crud=view_vps_list&action=list" autocomplete="on" method="GET">
              <a id="crud-search" class="btn btn-sm btn-primary" href="" title="Search" data-tile="Search">
                <span class="fa fa-search fa-fw"></span> Search </a>
              <span id="crud-search-more" class="crud-search form-inline float-right" style="display: none;">
                <input class="crud-searchdata crud-search-active form-control form-control-sm mr-1" name="search" data-type="text" type="text" value="">
                <select class="crud-daterange crud-searchdata form-control form-control-sm selectpicker mr-1" name="range" data-fieldtype="date" style="display:none; ">
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
                <input class="crud-searchdata crud-datepicker-from form-control form-control-sm mr-1" name="date_from" style="display:none; " data-type="datetime" data-fieldtype="date" type="text" value="">
                <input class="crud-searchdata crud-datepicker-to form-control form-control-sm mr-1" name="date_to" style="display:none; " data-type="datetime" data-fieldtype="date" type="text" value="">
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
          <div id="header_btns" class="col-md-auto printer-hidden text-right pl-2">
            <div class="btn-group">
              <router-link to="order_vps" class='btn btn-primary btn-sm printer-hidden' data-toggle="tooltip" title="Order VPS"><i class='fa fa-shopping-cart'></i> Order</router-link>
            </div>
          </div>
          <div id="print_expo_btns" class="col-md-auto export float-right printer-hidden pl-2">
            <div class="btn-group">
              <button class="btn btn-sm btn-secondary" type="button" title="Print" onClick="crud_print();"><i class="fa fa-print crud-icon"></i>Print </button>
              <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" title="Export data" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-download crud-icon"></i>Export <span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>
              <ul class="dropdown-menu" role="menu">
                <li role="presentation" data-type="xlsx"><a href="#" data-container="body" data-toggle="tooltip" title="Excel 2007+" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/xlsx.png" alt=""> XLSX</a></li>
                <li role="presentation" data-type="xls"><a href="#" data-container="body" data-toggle="tooltip" title="Excel 2003/BIFF" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/xls.png" alt=""> XLS</a></li>
                <li role="presentation" data-type="ods"><a href="#" data-container="body" data-toggle="tooltip" title="OpenDocument SpreadSheet" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/ods.png" alt=""> ODS</a></li>
                <li role="presentation" data-type="pdf"><a href="#" data-container="body" data-toggle="tooltip" title="Adobe Portable Document Format" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/pdf.png" alt=""> PDF</a></li>
                <li role="presentation" data-type="xml"><a href="#" data-container="body" data-toggle="tooltip" title="Extensible Markup Language" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/xml.png" alt=""> XML</a></li>
                <li role="presentation" data-type="php"><a href="#" data-container="body" data-toggle="tooltip" title="PHP Array" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/php.png" alt=""> PHP</a></li>
                <li role="presentation" data-type="csv"><a href="#" data-container="body" data-toggle="tooltip" title="Comma-Seperated Values" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/csv.png" alt=""> CSV</a></li>
                <li role="presentation" data-type="json"><a href="#" data-container="body" data-toggle="tooltip" title="JSON" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/json.png" alt=""> JSON</a></li>
                <li role="presentation" data-type="bbcode"><a href="#" data-container="body" data-toggle="tooltip" title="BBcode" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/bbcode.png" alt=""> BBCODE</a></li>
                <li role="presentation" data-type="wiki"><a href="#" data-container="body" data-toggle="tooltip" title="WikiCode" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/wiki.png" alt=""> WIKI</a></li>
                <li role="presentation" data-type="markdown"><a href="#" data-container="body" data-toggle="tooltip" title="MarkDown" onClick="crud_export(this); this.preventDefault();"><img src="https://mystage.interserver.net/images/crud/markdown.png" alt=""> MARKDOWN</a></li>
              </ul>
            </div>
          </div>
          <div id="title_btns" class="col-md-auto printer-hidden pl-2">
            <div class="btn-group">
              <a class='btn btn-info active btn-sm' onclick='crud_search(this, [["vps_status","=","active"]]);'>Active</a>
              <a class='btn btn-info btn-sm' onclick='crud_search(this, [["vps_status","in",["pending","pending-setup","pend-approval"]]]);'>Pending</a>
              <a class='btn btn-info btn-sm' onclick='crud_search(this, [["vps_status","in",["canceled","expired"]]]);'>Expired</a>
              <a class='btn btn-info btn-sm' onclick='crud_search(this, []);'>All</a>
            </div>
          </div>
        </div>
      </div>
      <!-- /.card-header -->
      <div class="card-body">
        <div id="crud" class="crud">
          <div class="row">
            <div class="col-md-12">
              <div class="refresh-container"><i class="refresh-spinner fa fa-spinner fa-spin fa-2x"></i></div>
              <div class="table">
                <table id="crud-table" class="crud-table table table-bordred table-striped table-hover table-sm">
                  <thead class="">
                    <tr id="itemrowheader">
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="vps_id" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          ID<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="vps_name" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Server<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="repeat_invoices_cost" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Cost<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="vps_hostname" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Hostname<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="vps_ip" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          IP<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="vps_status" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Status<i class="sort-arrow fa fa-sort-asc" style="padding-left: 5px; opacity: 1; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="services_name" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Package<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="vps_comment" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Comments<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr id="itemrowempty" style="display: none;">
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %vps_id%
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %vps_name%
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %repeat_invoices_cost%
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_vps&id=%vps_id%" data-container="body" data-toggle="tooltip" title="View VPS">%vps_hostname%</a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %vps_ip%
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %vps_status%
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %services_name%
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %vps_comment%
                      </td>
                      <td>
                        <button type="button" alt="View VPS" class="btn btn-primary btn-xs printer-hidden" onclick="window.location='index.php?choice=none.view_vps&id='+get_crud_row_id(this);" title="View VPS" data-toggle="tooltip" tooltip="View VPS"><i class="fa fa-fw fa-cog"></i></button>
                      </td>
                    </tr>
                    <tr id="itemrow97">
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        246242
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        KVM201
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        10.00
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_vps&id=246242" data-container="body" data-toggle="tooltip" title="View VPS">vps246242</a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        209.159.153.39
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        expired
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        KVM Windows VPS Slice
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        &nbsp;
                      </td>
                      <td>
                        <button type="button" alt="View VPS" class="btn btn-primary btn-xs printer-hidden" onclick="window.location='index.php?choice=none.view_vps&id='+get_crud_row_id(this);" title="View VPS" data-toggle="tooltip" tooltip="View VPS"><i class="fa fa-fw fa-cog"></i></button>
                      </td>
                    </tr>
                    <tr id="itemrow98">
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        269124
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        OpenVZ62
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        6.00
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_vps&id=269124" data-container="body" data-toggle="tooltip" title="View VPS">server.test.com</a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        64.20.50.11
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        expired
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        Virtuozzo VPS Slice
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        &nbsp;
                      </td>
                      <td>
                        <button type="button" alt="View VPS" class="btn btn-primary btn-xs printer-hidden" onclick="window.location='index.php?choice=none.view_vps&id='+get_crud_row_id(this);" title="View VPS" data-toggle="tooltip" tooltip="View VPS"><i class="fa fa-fw fa-cog"></i></button>
                      </td>
                    </tr>
                    <tr id="itemrow99">
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        2156542
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        OpenVZ1005
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        450.00
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_vps&id=2156542" data-container="body" data-toggle="tooltip" title="View VPS">server.test.com</a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        &nbsp;
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        expired
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        Virtuozzo VPS Slice
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        &nbsp;
                      </td>
                      <td>
                        <button type="button" alt="View VPS" class="btn btn-primary btn-xs printer-hidden" onclick="window.location='index.php?choice=none.view_vps&id='+get_crud_row_id(this);" title="View VPS" data-toggle="tooltip" tooltip="View VPS"><i class="fa fa-fw fa-cog"></i></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <form accept-charset="UTF-8" role="form" id="paginationForm" class="" action="ajax.php?choice=crud&crud=view_vps_list&action=list" autocomplete="on" method="GET" style="display:inline-flex;">

                <div class="btn-group row-counts" role="group" aria-label="Rows Per Page">
                  <button type="button" class="btn btn-secondary btn-sm " data-limit="10">10</button>
                  <button type="button" class="btn btn-secondary btn-sm " data-limit="25">25</button>
                  <button type="button" class="btn btn-secondary btn-sm " data-limit="50">50</button>
                  <button type="button" class="btn btn-secondary btn-sm active" data-limit="100">100</button>
                  <button type="button" class="btn btn-secondary btn-sm " data-limit="-1">All</button>
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
                  <li class="page-item crud-page "><a class="page-link" href="" data-offset="100">2</a></li>
                  <li id="crud-pager-next" class="page-item ">
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
@import 'datatables.net-buttons-bs4';
@import 'datatables.net-responsive-bs4';
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
