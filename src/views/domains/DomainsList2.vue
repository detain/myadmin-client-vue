<script setup>
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs4/js/buttons.bootstrap4';
import 'datatables.net-responsive';

DataTable.use(DataTablesCore);

const router = useRouter()
const route = useRoute()
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
  { data: 'hostname' },
  { data: 'domain_expire_date' },
  { data: 'cost' },
  { data: 'domain_status' },
  { name: 'Link', 'data': 'link', sortable: false },
];

const options = {
  responsive: true,
};

origData.value = [
    {domain_id: "376503", domain_hostname: "hostingenuity.com", domain_expire_date: "2022-02-09 16:20:25", cost: "12.00", domain_status: "active"},
    {domain_id: "592337", domain_hostname: "detain.dev", domain_expire_date: "2023-08-14 00:59:38", cost: "18.00", domain_status: "active"},
    {domain_id: "418295", domain_hostname: "unixsrv10.com", domain_expire_date: "", cost: "11.00", domain_status: "canceled"},
    {domain_id: "408615", domain_hostname: "kirais.art", domain_expire_date: "", cost: "47.00", domain_status: "pending"},
    {domain_id: "408918", domain_hostname: "kiraart.bet", domain_expire_date: "", cost: "18.00", domain_status: "pending"}
];

const filteredData = computed(() => {
  const activeDomains = [];
  origData.value.forEach(row => {
      row.link = '<router-link to="\'view_domain?id=' + row.domain_id + '\'" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link>';
      row.link = row.domain_id;
      row.hostname = '<router-link to="\'view_domain?id=' + row.domain_id + '\'">' + row.domain_hostname + '</router-link>';
      if (limitStatus.value == 'all' || limitStatusMap[limitStatus.value].includes(row.domain_status)) {
        activeDomains.push(row);
      }
  });
  return activeDomains;
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
                  :data="filteredData"
                  :columns="columns"
                  class="display nowrap crud-table table table-bordred table-striped table-hover table-sm"
                  width="100%"
                  ref="table"
                  id="crud-table"
                >
                  <template v-slot:link="{ value }">
                    <router-link :to="value" class="btn btn-primary btn-xs printer-hidden">{{ value }}<i class="fa fa-fw fa-cog"></i></router-link>
                  </template>
                  <thead>
                    <tr>
                      <th>Service ID</th>
                      <th>Domain Name</th>
                      <th>Domain Expiration Date</th>
                      <th>Cost</th>
                      <th>Billing Status</th>
                      <th>Link</th>
                    </tr>
                  </thead>
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