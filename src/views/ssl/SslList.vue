<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
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
const data = ref([]);
const table = ref();

const columns = [
  { data: 'ssl_id' },
  { data: 'ssl_hostname' },
  { data: 'ssl_expire_date' },
  { data: 'cost' },
  { data: 'ssl_status' },
  { name: 'link', data: 'link', sortable: false },
];

const options = {
  responsive: true,
};

const filteredData = computed(() => {
    if (limitStatus.value === 'all') {
      return data.value;
    } else {
      return data.value.filter(item => limitStatusMap[limitStatus.value].includes(item.ssl_status));
    }
})

onMounted(function () {
  dt = table.value.dt;
});

const loadSsl = async (data) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/ssl_certs_list');
        console.log('api success');
        console.log(response);
        data.value = response;
    } catch (error) {
        console.log('api failed');
        console.log(error);
    }
};

loadSsl(data)
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
              <router-link class='btn btn-primary btn-sm printer-hidden' to='order_ssl' data-toggle="tooltip" title="Order Ssl Registrations"><i class='fa fa-shopping-cart'></i> Order</router-link>
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
              <a class='btn btn-info btn-sm' :class="{ 'active': limitStatus === 'active' }" @click.prevent="limitStatus = 'active'">Active</a>
              <a class='btn btn-info btn-sm' :class="{ 'active': limitStatus === 'pending' }" @click.prevent="limitStatus = 'pending'">Pending</a>
              <a class='btn btn-info btn-sm' :class="{ 'active': limitStatus === 'expired' }" @click.prevent="limitStatus = 'expired'">Expired</a>
              <a class='btn btn-info btn-sm' :class="{ 'active': limitStatus === 'all' }" @click.prevent="limitStatus = 'all'">All</a>
            </div>
          </div>
        </div>
      </div>
      <!-- /.card-header -->
      <div class="card-body">
        <div id="crud" class="crud">
          <div class="row">
            <div class="col-md-12">
                <table
                  :options="options"
                              :columns="columns"
                  class="display nowrap crud-table table table-bordred table-striped table-hover table-sm"
                  width="100%"
                  ref="table"
                  id="crud-table"
                >
                  <thead>
                    <tr>
                      <th>Service ID</th>
                      <th>Ssl Name</th>
                      <th>Ssl Expiration Date</th>
                      <th>Cost</th>
                      <th>Billing Status</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in filteredData" :key="rowIndex">
                        <td>{{ row.ssl_id }}</td>
                        <td><router-link :to="'ssl/' + row.ssl_id">{{ row.ssl_hostname }}</router-link></td>
                        <td>{{ row.ssl_expire_date }}</td>
                        <td>{{ row.cost }}</td>
                        <td>{{ row.ssl_status }}</td>
                        <td><router-link :to="'ssl/' + row.ssl_id" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link></td>
                    </tr>
                  </tbody>
                </table>
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
