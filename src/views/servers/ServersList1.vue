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
  { data: 'server_id' },
  { data: 'server_hostname' },
  { data: 'server_expire_date' },
  { data: 'cost' },
  { data: 'server_status' },
  { name: 'link', data: 'link', sortable: false },
];

const options = {
  responsive: true,
};

origData.value = [
    {screenshot: "<a href=\"index.php?choice=none.view_server&id=376503\"><img src=\"https://shot.sh?w=300&h=100&img=hostingenuity.com\"></a>", server_id: "376503", server_hostname: "hostingenuity.com", server_expire_date: "2022-02-09 16:20:25", cost: "12.00", server_status: "active", link: "hi"},
    {screenshot: "<a href=\"index.php?choice=none.view_server&id=592337\"><img src=\"https://shot.sh?w=300&h=100&img=detain.dev\"></a>", server_id: "592337", server_hostname: "detain.dev", server_expire_date: "2023-08-14 00:59:38", cost: "18.00", server_status: "active", link: "hi"},
    {screenshot: "<a href=\"index.php?choice=none.view_server&id=418295\"><img src=\"https://shot.sh?w=300&h=100&img=unixsrv10.com\"></a>", server_id: "418295", server_hostname: "unixsrv10.com", server_expire_date: "", cost: "11.00", server_status: "canceled", link: "hi"},
    {screenshot: "<a href=\"index.php?choice=none.view_server&id=408615\"><img src=\"https://shot.sh?w=300&h=100&img=kirais.art\"></a>", server_id: "408615", server_hostname: "kirais.art", server_expire_date: "", cost: "47.00", server_status: "pending", link: "hi"},
    {screenshot: "<a href=\"index.php?choice=none.view_server&id=408918\"><img src=\"https://shot.sh?w=300&h=100&img=kiraart.bet\"></a>", server_id: "408918", server_hostname: "kiraart.bet", server_expire_date: "", cost: "18.00", server_status: "pending", link: "hi"}
];
const filteredData = computed(() => {
    if (limitStatus.value === 'all') {
      return origData.value;
    } else {
      return origData.value.filter(item => limitStatusMap[limitStatus.value].includes(item.server_status));
    }
})


onMounted(function () {
  dt = table.value.dt;
});

function setStatusLimit(event) {
    limitStatus.value = event.target.getAttribute('status');
}


</script>

<template>
<link rel="stylesheet" href="https://mystage.interserver.net/lib/datatables.net-bs4/css/dataTables.bootstrap4.min.css">
<link rel="stylesheet" href="https://mystage.interserver.net/css/crud_table5.css">
<div class="row">
  <div class="col-md-12">
    <div class="card">
      <div class="card-header text-right">
        <div class="row float-right">
          <div id="header_btns" class="col-md-auto printer-hidden text-right pl-2">
            <div class="btn-group">
              <a class='btn btn-primary btn-sm printer-hidden' href='server_order' data-toggle="tooltip" title="Order Server Registrations"><i class='fa fa-shopping-cart'></i> Order</a>
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
            <div class="btn-group" id="limitStatusGroup">
              <a class='btn btn-info btn-sm' :class="{ 'active': limitStatus === 'active' }" status="active" @click.prevent="setStatusLimit">Active</a>
              <a class='btn btn-info btn-sm' :class="{ 'active': limitStatus === 'pending' }" status="pending" @click.prevent="setStatusLimit">Pending</a>
              <a class='btn btn-info btn-sm' :class="{ 'active': limitStatus === 'expired' }" status="expired" @click.prevent="setStatusLimit">Expired</a>
              <a class='btn btn-info btn-sm' :class="{ 'active': limitStatus === 'all' }" status="all" @click.prevent="setStatusLimit">All</a>
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
                  :options="options"
                  :columns="columns"
                  :data="filteredData"
                  class="display nowrap crud-table table table-bordred table-striped table-hover table-sm"
                  width="100%"
                  ref="table"
                  id="crud-table"
                >
                  <template v-slot:link="{ value }">
                    <router-link :to="'view_server?id=' + value" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link>
                  </template>
                  <thead>
                    <tr>
                      <th>Service ID</th>
                      <th>Server Name</th>
                      <th>Server Expiration Date</th>
                      <th>Cost</th>
                      <th>Billing Status</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in filteredData" :key="rowIndex">
                        <td>{{ row.server_id }}</td>
                        <td><router-link :to="'view_server?id=' + row.server_id">{{ row.server_hostname }}</router-link></td>
                        <td>{{ row.server_expire_date }}</td>
                        <td>{{ row.cost }}</td>
                        <td>{{ row.server_status }}</td>
                        <td><router-link :to="'view_server?id=' + row.server_id" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link></td>
                    </tr>
                  </tbody>
                </DataTable>
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
