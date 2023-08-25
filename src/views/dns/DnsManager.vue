<script setup>
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
import Swal from 'sweetalert2';
import { useSiteStore } from '@/stores';
const siteStore = useSiteStore();
siteStore.setPageHeading('DNS Manager');
siteStore.setTitle('DNS Manager');
siteStore.setBreadcrums({ '/home': 'Home', '': 'DNS Manager' });
const baseUrl = siteStore.getBaseUrl();

/*DataTable.use(DataTablesCore);*/

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

const filteredData = computed(() => {
    if (limitStatus.value === 'all') {
        return data.value;
    } else {
        return data.value.filter((item) => limitStatusMap[limitStatus.value].includes(item.backup_status));
    }
});

const domainId = ref(0);
const domain = ref('');
const ip = ref('');

async function addDomain(event) {
    let response;
    try {
        fetchWrapper
            .post(baseUrl + '/dns', {
                domain: domain.value,
                ip: ip.value,
            })
            .then((response) => {
                console.log('api success');
                console.log(response);
                loadDns(data);
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

async function deleteDomain(event) {
    domainId.value = event.target.getAttribute('data-id');
    console.log(domainId.value);
    Swal.fire({
        icon: 'error',
        title: '<h3>Delete Domain</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Delete it.',
        html: '<p>Are you sure want to delete your domain?</p>',
        preConfirm: () => {
            console.log('got to this plce fro deleteDomain preConfirm');
            try {
                fetchWrapper.delete(baseUrl + '/dns/' + domainId.value).then((response) => {
                    console.log('api success');
                    console.log(response);
                    loadDns(data);
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

function crud_print(): void {

}

function crud_export(event) {
    const exportType = event.currentTarget.parentElement.getAttribute('data-type');
    console.log(exportType);

}

const loadDns = async (data) => {
    try {
        const response = await fetchWrapper.get(baseUrl + '/dns');
        console.log('api success');
        console.log(response);
        data.value = response;
    } catch (error) {
        console.log('api failed');
        console.log(error);
    }
};

loadDns(data);
</script>

<template>
    <link rel="stylesheet" href="/node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css" />
    <link rel="stylesheet" href="/css/crud_table5.css" />
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header text-right">
                    <div class="row float-right">
                        <div id="header_btns" class="col-md-auto printer-hidden pl-2 text-right">
                            <div class="btn-group"></div>
                        </div>
                        <div id="print_expo_btns" class="col-md-auto export printer-hidden float-right pl-2">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-secondary" type="button" title="Print" @click="crud_print()"><i class="fa fa-print crud-icon"></i>Print</button>
                                <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" title="Export data" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-download crud-icon"></i>Export <span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>
                                <ul class="dropdown-menu" role="menu">
                                    <li role="presentation" data-type="xlsx">
                                        <a href="#" data-container="body" title="Excel 2007+" @click.prevent="crud_export($event)"><img src="/images/crud/xlsx.png" alt="" /> XLSX</a>
                                    </li>
                                    <li role="presentation" data-type="xls">
                                        <a href="#" data-container="body" title="Excel 2003/BIFF" @click.prevent="crud_export($event)"><img src="/images/crud/xls.png" alt="" /> XLS</a>
                                    </li>
                                    <li role="presentation" data-type="ods">
                                        <a href="#" data-container="body" title="OpenDocument SpreadSheet" @click.prevent="crud_export($event)"><img src="/images/crud/ods.png" alt="" /> ODS</a>
                                    </li>
                                    <li role="presentation" data-type="pdf">
                                        <a href="#" data-container="body" title="Adobe Portable Document Format" @click.prevent="crud_export($event)"><img src="/images/crud/pdf.png" alt="" /> PDF</a>
                                    </li>
                                    <li role="presentation" data-type="xml">
                                        <a href="#" data-container="body" title="Extensible Markup Language" @click.prevent="crud_export($event)"><img src="/images/crud/xml.png" alt="" /> XML</a>
                                    </li>
                                    <li role="presentation" data-type="php">
                                        <a href="#" data-container="body" title="PHP Array" @click.prevent="crud_export($event)"><img src="/images/crud/php.png" alt="" /> PHP</a>
                                    </li>
                                    <li role="presentation" data-type="csv">
                                        <a href="#" data-container="body" title="Comma-Seperated Values" @click.prevent="crud_export($event)"><img src="/images/crud/csv.png" alt="" /> CSV</a>
                                    </li>
                                    <li role="presentation" data-type="json">
                                        <a href="#" data-container="body" title="JSON" @click.prevent="crud_export($event)"><img src="/images/crud/json.png" alt="" /> JSON</a>
                                    </li>
                                    <li role="presentation" data-type="bbcode">
                                        <a href="#" data-container="body" title="BBcode" @click.prevent="crud_export($event)"><img src="/images/crud/bbcode.png" alt="" /> BBCODE</a>
                                    </li>
                                    <li role="presentation" data-type="wiki">
                                        <a href="#" data-container="body" title="WikiCode" @click.prevent="crud_export($event)"><img src="/images/crud/wiki.png" alt="" /> WIKI</a>
                                    </li>
                                    <li role="presentation" data-type="markdown">
                                        <a href="#" data-container="body" title="MarkDown" @click.prevent="crud_export($event)"><img src="/images/crud/markdown.png" alt="" /> MARKDOWN</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                    <div id="crud" class="crud">
                        <form action="dns/new">
                            <input type="hidden" name="new" value="1" />
                            <div class="row mb-4">
                                <div class="col-md-2 col-md-offset-2 text-right">
                                    <div class="printer-hidden" style="vertical-align: middle">
                                        <label style="margin-top: 5px">Add Domain to DNS</label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="printer-hidden">
                                        <div class="input-group">
                                            <input class="form-control form-control-sm" aria-label="Domain Name" placeholder="Domain like mycoolsite.com" v-model="domain" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="printer-hidden">
                                        <div class="input-group">
                                            <input class="form-control form-control-sm" aria-label="IP Address" placeholder="IP Address like 0.0.0.0" v-model="ip" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="printer-hidden">
                                        <input class="form-control form-control-sm btn btn-secondary btn-sm" type="submit" value="Add DNS Entry" @click.prevent="addDomain" />
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="row">
                            <div class="col-md-12">
                                <table :options="options" :columns="columns" class="display nowrap crud-table table-bordred table-striped table-hover table-sm table" ref="table" id="crud-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Domain Name</th>
                                            <th>IP Address</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, rowIndex) in data" :key="rowIndex" style="text-align: center">
                                            <td>{{ row.id }}</td>
                                            <td>{{ row.name }}</td>
                                            <td>{{ row.content }}</td>
                                            <td>
                                                <router-link :to="'dns/' + row.id" class="btn btn-primary btn-xs printer-hidden" title="Edit DNS Records for this Domain"><i class="fa fa-fw fa-cog"></i></router-link>
                                                <a href="#" @click.prevent="deleteDomain" :data-id="row.id" class="btn btn-primary btn-xs printer-hidden" title="Delete this Domain and its Records from DNS"><i class="fa fa-fw fa-trash" :data-id="row.id"></i></a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <form accept-charset="UTF-8" role="form" id="paginationForm" class="" action="ajax.php?choice=crud&crud=dns_manager&action=list" autocomplete="on" method="GET" style="display: inline-flex"></form>
                            </div>
                            <div class="col-md-6 float-right"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br /><br /><br />
    <form method="post" action="index.php">
        <input type="hidden" name="choice" value="dns_manager" />
        <table class="table-bordered table-striped dataTable table">
            <thead class="ui-widget-header">
                <tr>
                    <td style="text-align: center" colspan="5">DNS Servers</td>
                </tr>
            </thead>
            <tbody class="ui-widget-content">
                <tr>
                    <td colspan="1" style="text-align: center"><span>Primary DNS</span></td>
                    <td colspan="1" style="text-align: center"><span>&nbsp;</span></td>
                    <td colspan="1" style="text-align: center"><span>cdns1.interserver.net</span></td>
                    <td colspan="1" style="text-align: center"><span>&nbsp;</span></td>
                    <td colspan="1" style="text-align: center"><span>216.158.228.164</span></td>
                </tr>
                <tr>
                    <td colspan="1" style="text-align: center"><span>Secondary DNS</span></td>
                    <td colspan="1" style="text-align: center"><span>&nbsp;</span></td>
                    <td colspan="1" style="text-align: center"><span>cdns2.interserver.net</span></td>
                    <td colspan="1" style="text-align: center"><span>&nbsp;</span></td>
                    <td colspan="1" style="text-align: center"><span>216.158.234.243</span></td>
                </tr>
                <tr>
                    <td colspan="1" style="text-align: center"><span>Tertiary DNS</span></td>
                    <td colspan="1" style="text-align: center"><span>&nbsp;</span></td>
                    <td colspan="1" style="text-align: center"><span>cdns3.interserver.net</span></td>
                    <td colspan="1" style="text-align: center"><span>&nbsp;</span></td>
                    <td colspan="1" style="text-align: center"><span>199.231.191.75</span></td>
                </tr>
            </tbody>
        </table>
    </form>
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
