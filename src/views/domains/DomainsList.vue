<script setup>
import { storeToRefs } from 'pinia';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs4/js/buttons.bootstrap4';
import 'datatables.net-responsive';

DataTable.use(DataTablesCore);

const columns = [
  { data: 'name' },
  { data: 'position' },
  { data: 'office' },
  { data: 'extn' },
  { data: 'start_date' },
  { data: 'salary' },
];

const options = {
  responsive: true,
};
</script>

<template>
<link rel="stylesheet" href="/lib/datatables.net-bs4/css/dataTables.bootstrap4.min.css">
<link rel="stylesheet" href="/css/crud_table5.css">
<div class="row">
  <div class="col-md-12">
    <div class="card">
      <div class="card-header text-right">
        <div class="row float-right">
          <div id="header_btns" class="col-md-auto printer-hidden text-right pl-2">
            <div class="btn-group">
              <a class='btn btn-primary btn-sm printer-hidden' href='domain_order' data-toggle="tooltip" title="Order Domain Registrations"><i class='fa fa-shopping-cart'></i> Order</a>
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
              <a class='btn btn-info active btn-sm' onclick='crud_search(this, [["domain_status","=","active"]]);'>Active</a>
              <a class='btn btn-info btn-sm' onclick='crud_search(this, [["domain_status","in",["pending","pending-setup","pend-approval"]]]);'>Pending</a>
              <a class='btn btn-info btn-sm' onclick='crud_search(this, [["domain_status","in",["canceled","expired"]]]);'>Expired</a>
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
                <DataTable
                  :columns="columns"
                  :options="options"
                  ajax="/data.json"
                  class="display nowrap"
                  width="100%"
                >
                  <thead>
                    <tr>
                      <th>Screenshot</th>
                      <th>Service ID</th>
                      <th>Domain Name</th>
                      <th>Domain Expiration Date</th>
                      <th>Cost</th>
                      <th>Billing Status</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                </DataTable>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="refresh-container"><i class="refresh-spinner fa fa-spinner fa-spin fa-2x"></i></div>
              <div class="table">
                <table id="crud-table" class="crud-table table table-bordred table-striped table-hover table-sm">
                  <thead class="">
                    <tr id="itemrowheader">
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="screenshot" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Screenshot<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="domain_id" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Service ID<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="domain_hostname" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Domain Name<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="domain_expire_date" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Domain Expire Date<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="cost" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Cost<i class="sort-arrow fa fa-sort" style="padding-left: 5px; opacity: 0.3; position: absolute;"></i>
                        </span>
                      </th>
                      <th colspan="1" bgcolor="" style="text-align:center;" data-order-dir="asc" data-order-by="domain_status" class="">
                        <span role="button" class="header_link" onClick="crud_update_sort(this);">
                          Billing Status<i class="sort-arrow fa fa-sort-asc" style="padding-left: 5px; opacity: 1; position: absolute;"></i>
                        </span>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr id="itemrowempty" style="display: none;">
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %screenshot%
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %domain_id%
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=%domain_id%" data-container="body" data-toggle="tooltip" title="View Domain Registrations">%domain_hostname%</a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %domain_expire_date%
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %cost%
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        %domain_status%
                      </td>
                      <td>
                        <button type="button" alt="View Domain Registrations" class="btn btn-primary btn-xs printer-hidden" onclick="window.location='index.php?choice=none.view_domain&id='+get_crud_row_id(this);" title="View Domain Registrations" data-toggle="tooltip" tooltip="View Domain Registrations"><i class="fa fa-fw fa-cog"></i></button>
                      </td>
                    </tr>
                    <tr id="itemrow0">
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=376503"><img src="https://shot.sh?w=300&h=100&img=hostingenuity.com"></a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        376503
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=376503" data-container="body" data-toggle="tooltip" title="View Domain Registrations">hostingenuity.com</a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        2022-02-09 16:20:25
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        12.00
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        active
                      </td>
                      <td>
                        <button type="button" alt="View Domain Registrations" class="btn btn-primary btn-xs printer-hidden" onclick="window.location='index.php?choice=none.view_domain&id='+get_crud_row_id(this);" title="View Domain Registrations" data-toggle="tooltip" tooltip="View Domain Registrations"><i class="fa fa-fw fa-cog"></i></button>
                      </td>
                    </tr>
                    <tr id="itemrow1">
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=592337"><img src="https://shot.sh?w=300&h=100&img=detain.dev"></a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        592337
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=592337" data-container="body" data-toggle="tooltip" title="View Domain Registrations">detain.dev</a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        2023-08-14 00:59:38
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        18.00
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        active
                      </td>
                      <td>
                        <button type="button" alt="View Domain Registrations" class="btn btn-primary btn-xs printer-hidden" onclick="window.location='index.php?choice=none.view_domain&id='+get_crud_row_id(this);" title="View Domain Registrations" data-toggle="tooltip" tooltip="View Domain Registrations"><i class="fa fa-fw fa-cog"></i></button>
                      </td>
                    </tr>
                    <tr id="itemrow2">
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=418295"><img src="https://shot.sh?w=300&h=100&img=unixsrv10.com"></a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        418295
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=418295" data-container="body" data-toggle="tooltip" title="View Domain Registrations">unixsrv10.com</a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        &nbsp;
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        11.00
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        canceled
                      </td>
                      <td>
                        <button type="button" alt="View Domain Registrations" class="btn btn-primary btn-xs printer-hidden" onclick="window.location='index.php?choice=none.view_domain&id='+get_crud_row_id(this);" title="View Domain Registrations" data-toggle="tooltip" tooltip="View Domain Registrations"><i class="fa fa-fw fa-cog"></i></button>
                      </td>
                    </tr>
                    <tr id="itemrow3">
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=408615"><img src="https://shot.sh?w=300&h=100&img=kirais.art"></a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        408615
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=408615" data-container="body" data-toggle="tooltip" title="View Domain Registrations">kirais.art</a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        &nbsp;
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        47.00
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        pending
                      </td>
                      <td>
                        <button type="button" alt="View Domain Registrations" class="btn btn-primary btn-xs printer-hidden" onclick="window.location='index.php?choice=none.view_domain&id='+get_crud_row_id(this);" title="View Domain Registrations" data-toggle="tooltip" tooltip="View Domain Registrations"><i class="fa fa-fw fa-cog"></i></button>
                      </td>
                    </tr>
                    <tr id="itemrow4">
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=408918"><img src="https://shot.sh?w=300&h=100&img=kiraart.bet"></a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        408918
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        <a href="index.php?choice=none.view_domain&id=408918" data-container="body" data-toggle="tooltip" title="View Domain Registrations">kiraart.bet</a>
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        &nbsp;
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        18.00
                      </td>
                      <td colspan="1" bgcolor="" style="text-align:center;">
                        pending
                      </td>
                      <td>
                        <button type="button" alt="View Domain Registrations" class="btn btn-primary btn-xs printer-hidden" onclick="window.location='index.php?choice=none.view_domain&id='+get_crud_row_id(this);" title="View Domain Registrations" data-toggle="tooltip" tooltip="View Domain Registrations"><i class="fa fa-fw fa-cog"></i></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <form accept-charset="UTF-8" role="form" id="paginationForm" class="" action="ajax.php?choice=crud&crud=view_domains_list&action=list" autocomplete="on" method="GET" style="display:inline-flex;">
              </form>
            </div>
            <div class="col-md-6 float-right">
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
