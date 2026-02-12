<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';

import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSiteStore } from '@/stores/site.store';

import Swal from 'sweetalert2';
const route = useRoute();
const id = Number(route.params.id);
const siteStore = useSiteStore();
siteStore.setPageHeading('DNS Editor');
siteStore.setTitle('DNS Editor');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/dns', 'DNS Manager'],
]);
siteStore.addBreadcrum(`/dns/${id}`, 'DNS Editor');
const baseUrl = siteStore.getBaseUrl();
const showingAddRecord = ref(false);
/*DataTable.use(DataTablesCore);*/
const name = ref('');
const type = ref('');
const content = ref('');
const prio = ref('');
const ttl = ref('');
const limitStatus = ref('active');

interface DnsRecordRow {
    id: number;
    name: string;
    type: string;
    content: string;
    prio: string;
    ttl: string;
}

interface LimitStatusMap {
    [key: string]: string[];
}

const limitStatusMap: LimitStatusMap = {
    active: ['active'],
    pending: ['pending', 'pending-setup', 'pend-approval'],
    expired: ['expired', 'canceled'],
    all: ['active', 'pending', 'pending-setup', 'pend-approval', 'expired', 'canceled'],
};
const data = ref<DnsRecordRow[]>([]);
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
        return data.value.filter((item) => limitStatusMap[limitStatus.value].includes(item.content));
    }
});

const recordId = ref(0);
const recordRow = ref({});

async function cancelEditRecord(event: Event) {
    recordId.value = 0;
}

async function cancelAddRecord(event: Event) {
    showingAddRecord.value = false;
}

async function showAddDnsRecord(event: Event) {
    showingAddRecord.value = true;
}

async function editDnsRecord(event: Event) {
    let response;
    try {
        fetchWrapper.post(`${baseUrl}/dns/${id}/${recordId.value}`, recordRow.value).then((response) => {
            console.log('api success');
            console.log(response);
            loadDns();
            Swal.fire({
                icon: 'success',
                html: response.message,
            });
        });
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.message}`,
        });
    }
}

async function addDnsRecord(event: Event) {
    let response;
    try {
        fetchWrapper
            .post(`${baseUrl}/dns/${id}`, {
                name: name.value,
                type: type.value,
                content: content.value,
                prio: prio.value,
                ttl: ttl.value,
            })
            .then((response) => {
                console.log('api success');
                console.log(response);
                loadDns();
                Swal.fire({
                    icon: 'success',
                    html: response.message,
                });
            });
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.message}`,
        });
    }
}

async function showEditRecord(event: Event) {
    recordId.value = Number((event.target as HTMLElement).getAttribute('data-id'));
    let row, rowIdx;
    for (rowIdx in data.value) {
        row = data.value[rowIdx];
        if (row.id == recordId.value) {
            recordRow.value = row;
        }
    }
}

async function deleteRecord(event: Event) {
    const record = Number((event.target as HTMLElement).getAttribute('data-id'));
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
                fetchWrapper.delete(`${baseUrl}/dns/${id}/${record}`).then((response) => {
                    console.log('api success');
                    console.log(response);
                    loadDns();
                    Swal.fire({
                        icon: 'success',
                        html: response.message,
                    });
                });
            } catch (error: any) {
                console.log('api failed');
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    html: `Got error ${error.message}`,
                });
            }
        },
    });
}

const loadDns = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/dns/${id}`);
        console.log('api success');
        console.log(response);
        data.value = response;
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadDns();
</script>

<template>
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
                <input id="domain_id" type="hidden" name="id" value="35626" />
            </form>
            <table id="crud-table" ref="table" :options="options" :columns="columns" class="display nowrap crud-table table-bordered table-striped table-hover table-sm table" style="width: 100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>
                            <form class="form-inline">
                                <div class="form-group name">
                                    Name:&nbsp;&nbsp;
                                    <input id="searchName" type="text" class="form-control no-shadow" placeholder="Search" autocomplete="off" />
                                </div>
                            </form>
                        </th>
                        <th>Type</th>
                        <th>
                            <form class="form-inline">
                                <div class="form-group content">
                                    Content:&nbsp;&nbsp;
                                    <input id="searchContent" type="text" class="form-control no-shadow" placeholder="Search" autocomplete="off" />
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
                    <tr v-show="showingAddRecord" id="add_record" style="display: none">
                        <td>New</td>
                        <td>
                            <div class="input-group">
                                <input id="addName" v-model="name" type="text" class="form-control form-control-sm" data-regex="^([^.]+\.)*[^.]*$" />
                                <input id="add-domain-name" class="form-control form-control-sm" type="text" readonly disabled />
                            </div>
                        </td>
                        <td>
                            <select id="addType" v-model="type" class="form-control">
                                <option v-for="(recordType, index) in recordTypes" :key="index" :value="recordType">{{ recordType }}</option>
                            </select>
                        </td>
                        <td><input id="addContent" v-model="content" type="text" class="form-control form-control-sm" data-regex="^.+$" /></td>
                        <td><input id="addPrio" v-model="prio" type="text" class="form-control form-control-sm" placeholder="0" size="1" data-regex="^[0-9]*$" /></td>
                        <td><input id="addTtl" v-model="ttl" type="text" class="form-control form-control-sm" placeholder="86400" size="3" data-regex="^[0-9]*$" /></td>
                        <td colspan="3" class="text-center">
                            <button class="btn btn-success btn-sm" @click.prevent="addDnsRecord">&nbsp;Add&nbsp;</button>
                            <button class="btn btn-danger btn-xs printer-hidden" title="Cancel Add" @click.prevent="cancelAddRecord"><i class="fa fa-fw fa-times"></i></button>
                        </td>
                    </tr>
                    <tr v-for="(row, rowIndex) in data" :key="rowIndex">
                        <template v-if="recordId == row.id">
                            <td>{{ row.id }}</td>
                            <td>
                                <div class="input-group">
                                    <input v-model="row.name" type="text" class="form-control form-control-sm" data-regex="^([^.]+.)*[^.]*$" />
                                    <input class="form-control form-control-sm" value="" disabled readonly />
                                </div>
                            </td>
                            <td>
                                <select v-model="row.type" class="form-control" style="width: 100% !important">
                                    <option v-for="(recordType, typeIndex) in recordTypes" :key="typeIndex" :value="recordType">{{ recordType }}</option>
                                </select>
                            </td>
                            <td><input v-model="row.content" type="text" class="form-control form-control-sm" data-regex="^.+$" /></td>
                            <td><input v-model="row.prio" type="text" class="form-control form-control-sm" size="1" data-regex="^[0-9]+$" /></td>
                            <td><input v-model="row.ttl" type="text" class="form-control form-control-sm" size="3" data-regex="^[0-9]+$" /></td>
                            <td>
                                <a href="#" :data-id="row.id" class="btn btn-primary btn-xs printer-hidden" title="Update Record" @click.prevent="editDnsRecord"><i class="fa fa-fw fa-check" :data-id="row.id"></i></a>
                                <a href="#" :data-id="row.id" class="btn btn-primary btn-xs printer-hidden" title="Cancel Edit" @click.prevent="cancelEditRecord"><i class="fa fa-fw fa-times" :data-id="row.id"></i></a>
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
                                <a href="#" :data-id="row.id" class="btn btn-primary btn-xs printer-hidden" title="Edit DNS Records for this Domain" @click.prevent="showEditRecord"><i class="fa fa-fw fa-cog" :data-id="row.id"></i></a>
                                <a href="#" :data-id="row.id" class="btn btn-primary btn-xs printer-hidden" title="Delete this Domain and its Records from DNS" @click.prevent="deleteRecord"><i class="fa fa-fw fa-trash" :data-id="row.id"></i></a>
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
@import '../../assets/css/crud_table5.css';
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
