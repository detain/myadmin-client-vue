<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { ref, computed, onMounted } from 'vue';
/*
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs4/js/buttons.bootstrap4';
import 'datatables.net-responsive';
*/
import { useRoute } from 'vue-router';
import { useSiteStore } from '@/stores';
import Swal from 'sweetalert2';
const route = useRoute();
const id = route.params.id;
const siteStore = useSiteStore();
siteStore.setPageHeading('DNS Editor');
siteStore.setTitle('DNS Editor');
siteStore.setBreadcrums({ '/home': 'Home', '/dns': 'DNS Manager' });
siteStore.addBreadcrum('/dns/' + id, 'DNS Editor');
const baseUrl = siteStore.getBaseUrl();
const showingAddRecord = ref(false);
/*DataTable.use(DataTablesCore);*/
const name = ref('');
const type = ref('');
const content = ref('');
const prio = ref('');
const ttl = ref('');

let dt;
const limitStatus = ref('active');
const limitStatusMap = {
    active: ['active'],
    pending: ['pending', 'pending-setup', 'pend-approval'],
    expired: ['expired', 'canceled'],
    all: ['active', 'pending', 'pending-setup', 'pend-approval', 'expired', 'canceled'],
};
const data = ref([]);
const table = ref();

const columns = [{ data: 'id' }, { data: 'name' }, { data: 'content' }, { name: 'link', data: 'link', sortable: false }];

const options = {
    responsive: true,
};

const recordTypes = ref(['A', 'A6', 'AAAA', 'AFSDB', 'ALIAS', 'CAA', 'CDNSKEY', 'CDS', 'CERT', 'CNAME', 'DHCID', 'DLV', 'DNSKEY', 'DNAME', 'DS', 'EUI48', 'EUI64', 'HINFO', 'IPSECKEY', 'KEY', 'KX', 'LOC', 'MAILA', 'MAILB', 'MINFO', 'MR', 'MX', 'NAPTR', 'NS', 'NSEC', 'NSEC3', 'NSEC3PARAM', 'OPENPGPKEY', 'OPT', 'PTR', 'RKEY', 'RP', 'RRSIG', 'SIG', 'SOA', 'SPF', 'SRV', 'SSHFP', 'TLSA', 'TKEY', 'TSIG', 'TXT', 'WKS', 'URI']);

const filteredData = computed(() => {
    if (limitStatus.value === 'all') {
        return data.value;
    } else {
        return data.value.filter((item) => limitStatusMap[limitStatus.value].includes(item.backup_status));
    }
});

const recordId = ref(0);
const recordRow = ref({});

async function cancelEditRecord(event) {
    recordId.value = 0;
}

async function cancelAddRecord(event) {
    showingAddRecord.value = false;
}

async function showAddDnsRecord(event) {
    showingAddRecord.value = true;
}

async function editDnsRecord(event) {
    let response;
    try {
        fetchWrapper.post(baseUrl + '/dns/' + id, recordRow.value).then((response) => {
            console.log('api success');
            console.log(response);
            loadDns(data, {});
            Swal.fire({
                icon: 'success',
                html: response.message,
            });
        });
    } catch (error) {
        console.log('api failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: 'Got error ' + error.message,
        });
    }
}

async function addDnsRecord(event) {
    let response;
    try {
        fetchWrapper
            .post(baseUrl + '/dns/' + id, {
                name: name.value,
                type: type.value,
                content: content.value,
                prio: prio.value,
                ttl: ttl.value,
            })
            .then((response) => {
                console.log('api success');
                console.log(response);
                loadDns(data, {});
                Swal.fire({
                    icon: 'success',
                    html: response.message,
                });
            });
    } catch (error) {
        console.log('api failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: 'Got error ' + error.message,
        });
    }
}

async function showEditRecord(event) {
    recordId.value = event.target.getAttribute('data-id');
  let row, rowIdx;
  for (rowIdx in data.value) {
        row = data.value[rowIdx];
        if (row.id == recordId.value) {
            recordRow.value = row;
        }
    }
}

async function deleteRecord(event) {
  const record = event.target.getAttribute('data-id');
  console.log(record);
    Swal.fire({
        icon: 'error',
        title: '<h3>Delete Domain</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Delete it.',
        html: '<p>Are you sure want to delete this record?</p>',
        preConfirm: () => {
            console.log('got to this place from deleteRecord preConfirm');
            try {
                fetchWrapper.delete(baseUrl + '/dns/' + id.value, {}).then((response) => {
                    console.log('api success');
                    console.log(response);
                    loadDns(data, {});
                    Swal.fire({
                        icon: 'success',
                        html: response.message,
                    });
                });
            } catch (error) {
                console.log('api failed');
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    html: 'Got error ' + error.message,
                });
            }
        },
    });
}

onMounted(function () {
    dt = table.value.dt;
});

const loadDns = async (id, data) => {
    try {
        const response = await fetchWrapper.get(baseUrl + '/dns/' + id);
        console.log('api success');
        console.log(response);
        data.value = response;
    } catch (error) {
        console.log('api failed');
        console.log(error);
    }
};

loadDns(id, data);
</script>

<template>
    <link rel="stylesheet" href="/node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css" />
    <link rel="stylesheet" href="/css/crud_table5.css" />
    <div id="records" class="card">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2"><i class="fa fa-table"></i>&nbsp;DNS Records</h3>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-primary btn-sm" title="Add Record" @click="showAddDnsRecord"><i class="fa fa-plus-circle"></i>&nbsp;&nbsp;Add Record&nbsp;&nbsp;</button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <form method="post">
                <input type="hidden" name="id" id="domain_id" value="35626" />
            </form>
            <table :options="options" :columns="columns" class="display nowrap crud-table table-bordered table-striped table-hover table-sm table" width="100%" ref="table" id="crud-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>
                            <form class="form-inline">
                                <div class="form-group name">
                                    Name:&nbsp;&nbsp;
                                    <input type="text" class="form-control no-shadow" id="searchName" placeholder="Search" autocomplete="off" />
                                </div>
                            </form>
                        </th>
                        <th>Type</th>
                        <th>
                            <form class="form-inline">
                                <div class="form-group content">
                                    Content:&nbsp;&nbsp;
                                    <input type="text" class="form-control no-shadow" id="searchContent" placeholder="Search" autocomplete="off" />
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
                    <tr id="add_record" style="display: none" v-show="showingAddRecord">
                        <td>New</td>
                        <td>
                            <div class="input-group">
                                <input id="addName" type="text" class="form-control form-control-sm" data-regex="^([^.]+\.)*[^.]*$" v-model="name" />
                                <input id="add-domain-name" class="form-control form-control-sm" type="text" readonly disabled />
                            </div>
                        </td>
                        <td>
                            <select id="addType" class="form-control" v-model="type">
                                <option v-for="(type, index) in recordTypes" :key="index" :value="type">{{ type }}</option>
                            </select>
                        </td>
                        <td><input id="addContent" type="text" class="form-control form-control-sm" data-regex="^.+$" v-model="content" /></td>
                        <td><input id="addPrio" type="text" class="form-control form-control-sm" placeholder="0" size="1" data-regex="^[0-9]*$" v-model="prio" /></td>
                        <td><input id="addTtl" type="text" class="form-control form-control-sm" placeholder="86400" size="3" data-regex="^[0-9]*$" v-model="ttl" /></td>
                        <td colspan="3" class="text-center">
                            <button @click.prevent="addDnsRecord" class="btn btn-success btn-sm">&nbsp;Add&nbsp;</button>
                            <button @click.prevent="cancelAddRecord" class="btn btn-danger btn-xs printer-hidden" title="Cancel Add"><i class="fa fa-fw fa-times"></i></button>
                        </td>
                    </tr>
                    <tr v-for="(row, rowIndex) in data" :key="rowIndex">
                        <template v-if="recordId == row.id">
                            <td>{{ recordRow.id }}</td>
                            <td>
                                <div class="input-group">
                                    <input type="text" class="form-control form-control-sm" data-regex="^([^.]+.)*[^.]*$" v-model="recordRow.name" />
                                    <input class="form-control form-control-sm" value="" disabled="" readonly="" />
                                </div>
                            </td>
                            <td>
                                <select class="form-control" style="width: 100% !important" v-model="recordRow.type">
                                    <option v-for="(type, typeIndex) in recordTypes" :key="typeIndex" :value="type">{{ type }}</option>
                                </select>
                            </td>
                            <td><input type="text" class="form-control form-control-sm" data-regex="^.+$" v-model="recordRow.content" /></td>
                            <td><input type="text" class="form-control form-control-sm" size="1" data-regex="^[0-9]+$" v-model="recordRow.prio" /></td>
                            <td><input type="text" class="form-control form-control-sm" size="3" data-regex="^[0-9]+$" v-model="recordRow.ttl" /></td>
                            <td>
                                <a href="#" @click.prevent="editDnsRecord" :data-id="row.id" class="btn btn-primary btn-xs printer-hidden" title="Update Record"><i class="fa fa-fw fa-check" :data-id="row.id"></i></a>
                                <a href="#" @click.prevent="cancelEditRecord" :data-id="row.id" class="btn btn-primary btn-xs printer-hidden" title="Cancel Edit"><i class="fa fa-fw fa-times" :data-id="row.id"></i></a>
                            </td>
                        </template>
                        <template v-else>
                            <td>{{ row.id }}</td>
                            <td>{{ row.name }}</td>
                            <td>{{ row.type }}</td>
                            <td>{{ row.content }}</td>
                            <td>{{ row.prio }}</td>
                            <td>{{ row.ttl }}</td>
                            <td>
                                <a href="#" @click.prevent="showEditRecord" :data-id="row.id" class="btn btn-primary btn-xs printer-hidden" title="Edit DNS Records for this Domain"><i class="fa fa-fw fa-cog" :data-id="row.id"></i></a>
                                <a href="#" @click.prevent="deleteRecord" :data-id="row.id" class="btn btn-primary btn-xs printer-hidden" title="Delete this Domain and its Records from DNS"><i class="fa fa-fw fa-trash" :data-id="row.id"></i></a>
                            </td>
                        </template>
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
