<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { ref, computed, onMounted } from "vue";
/*
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs4/js/buttons.bootstrap4';
import 'datatables.net-responsive';
*/
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id;

/*DataTable.use(DataTablesCore);*/

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
  { data: 'id' },
  { data: 'name' },
  { data: 'content' },
  { name: 'link', data: 'link', sortable: false },
];

const options = {
  responsive: true,
};

const filteredData = computed(() => {
    if (limitStatus.value === 'all') {
      return data.value;
    } else {
      return data.value.filter(item => limitStatusMap[limitStatus.value].includes(item.backup_status));
    }
})

onMounted(function () {
  dt = table.value.dt;
});

const loadDns = async (id, data) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/dns/'+id);
        console.log('api success');
        console.log(response);
        data.value = response;
    } catch (error) {
        console.log('api failed');
        console.log(error);
    }
};

loadDns(id, data)
</script>

<template>
<link rel="stylesheet" href="/node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css">
<link rel="stylesheet" href="/css/crud_table5.css">
<div id="records" class="card">
    <div class="card-header">
        <div class="p-1">
            <h3 class="card-title py-2">
                <i class="fa fa-table"></i>&nbsp;DNS Records
            </h3>
            <div class="card-tools float-right">
                <button type="button" class="btn btn-primary btn-sm" title="Add Record" onclick="addDNSRecord();">
                    <i class="fa fa-plus-circle"></i>&nbsp;&nbsp;Add Record&nbsp;&nbsp;
                </button>
            </div>
        </div>
    </div>
    <div class="card-body">
        <form method="post">
            <input type="hidden" name="id" id="domain_id" value="35626">
            <input type="hidden" name="csrf_token" value="56019e5cb028b2d7c1201120debd53393809cf510b384d2a7a0fefd07c95ffc7cef92bf0f3bbaf46029f0bdecd91a6431b746fc22d34ecc9a76f82da941d05a9">
        </form>
        <table :options="options" :columns="columns" class="display nowrap crud-table table table-bordered table-striped table-hover table-sm" width="100%" ref="table" id="crud-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>
                        <form class="form-inline">
                            <div class="form-group name">
                                Name:&nbsp;&nbsp;
                                <input type="text" class="form-control no-shadow" id="searchName" placeholder="Search" autocomplete="off">
                            </div>
                        </form>
                    </th>
                    <th>Type</th>
                    <th>
                    <form class="form-inline">
                        <div class="form-group content">
                            Content:&nbsp;&nbsp;
                            <input type="text" class="form-control no-shadow" id="searchContent" placeholder="Search" autocomplete="off">
                        </div>
                    </form>
                    </th>
                    <th>Priority</th>
                    <th>TTL</th>
                    <th>Actopms</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="p-0"></td>
                </tr>
                <tr id="add_record" style="display: none;">
                    <td>New</td>
                    <td>
                        <div class="input-group">
                            <input id="addName" type="text" class="form-control form-control-sm" data-regex="^([^.]+\.)*[^.]*$">
                            <input id="add-domain-name" class="form-control form-control-sm" type="text" readonly disabled />
                        </div>
                    </td>
                    <td>
                        <select id="addType" class="form-control"></select>
                    </td>
                    <td><input id="addContent" type="text" class="form-control form-control-sm" data-regex="^.+$">
                    </td>
                    <td><input id="addPrio" type="text" class="form-control form-control-sm" placeholder="0" size="1" data-regex="^[0-9]*$"></td>
                    <td><input id="addTtl" type="text" class="form-control form-control-sm" placeholder="86400" size="3" data-regex="^[0-9]*$"></td>
                    <td colspan="3" class="text-center">
                        <button id="addButton" class="btn btn-success btn-sm">&nbsp;Add&nbsp;</button>
                    </td>
                </tr>
                <tr v-for="(row, rowIndex) in data" :key="rowIndex">
                    <td>{{ row.id }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.type }}</td>
                    <td>{{ row.content }}</td>
                    <td>{{ row.prio }}</td>
                    <td>{{ row.ttl }}</td>
                    <td>
                        <router-link :to="'dns_editor?id=' + row.id" class="btn btn-primary btn-xs printer-hidden" title="Edit DNS Records for this Domain"><i class="fa fa-fw fa-cog"></i></router-link>
                        <router-link :to="'dns_delete?id=' + row.id" class="btn btn-primary btn-xs printer-hidden" title="Delete this Domain and its Records from DNS"><i class="fa fa-fw fa-trash"></i></router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<style scoped>
/*
@import 'datatables.net-bs4';
@import 'datatables.net-buttons-bs4';
@import 'datatables.net-responsive-bs4';
*/
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
