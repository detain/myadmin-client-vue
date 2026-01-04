<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';

import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '../../stores/site.store';

const module: string = 'licenses';
const siteStore = useSiteStore();
siteStore.setPageHeading('Licensing List');
siteStore.setTitle('Licensing List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Licenses'],
]);
const baseUrl = siteStore.getBaseUrl();

interface licensesRow {
    license_id: number;
    license_hostname: string;
    license_ip: string;
    services_name: string;
    cost: number;
    license_status: string;
    invoices_paid: boolean;
    invoices_date: string;
}
const limitStatus = ref('active');
interface LimitStatusMap {
    [key: string]: string[];
}

const limitStatusMap: LimitStatusMap = {
    active: ['active'],
    pending: ['pending', 'pending-setup', 'pend-approval'],
    expired: ['expired', 'canceled'],
    all: ['active', 'pending', 'pending-setup', 'pend-approval', 'expired', 'canceled'],
};
const data = ref<licensesRow[]>([]);
const table = ref();

const columns = [{ data: 'license_id' }, { data: 'license_hostname' }, { data: 'license_ip' }, { data: 'services_name' }, { data: 'cost' }, { data: 'license_status' }, { data: 'invoices_paid' }, { data: 'invoices_date' }, { name: 'link', data: 'link', sortable: false }];

const options = {
    responsive: true,
};

const filteredData = computed(() => {
    if (limitStatus.value === 'all') {
        return data.value;
    } else {
        return data.value.filter((item) => limitStatusMap[limitStatus.value].includes(item.license_status));
    }
});

function crud_print(): void {}

function crud_export(exportType: string): void {
    console.log(exportType);
}
const loadLicenses = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/licenses`);
        console.log('api success');
        console.log(response);
        data.value = response;
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadLicenses();
</script>

<template>
    <link rel="stylesheet" href="/css/crud_table5.css" />
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header text-right">
                    <div class="row float-right">
                        <div id="header_btns" class="col-md-auto printer-hidden pl-2 text-right">
                            <div class="btn-group">
                                <router-link class="btn btn-primary btn-sm printer-hidden" :to="'/' + moduleLink(module) + '/order'" title="Order License Registrations"><i class="fa fa-shopping-cart"></i> Order</router-link>
                            </div>
                        </div>
                        <div id="print_expo_btns" class="col-md-auto export printer-hidden float-right pl-2">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-secondary" type="button" title="Print" @click="crud_print()"><i class="fa fa-print crud-icon"></i>Print</button>
                                <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" title="Export data" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-download crud-icon"></i>Export <span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>
                                <ul class="dropdown-menu" role="menu">
                                    <li role="presentation" data-type="xlsx">
                                        <a href="#" data-container="body" title="Excel 2007+" @click.prevent="crud_export('xlsx')"><img src="../../assets/images/crud/xlsx.png" alt="" /> XLSX</a>
                                    </li>
                                    <li role="presentation" data-type="xls">
                                        <a href="#" data-container="body" title="Excel 2003/BIFF" @click.prevent="crud_export('xls')"><img src="../../assets/images/crud/xls.png" alt="" /> XLS</a>
                                    </li>
                                    <li role="presentation" data-type="ods">
                                        <a href="#" data-container="body" title="OpenDocument SpreadSheet" @click.prevent="crud_export('ods')"><img src="../../assets/images/crud/ods.png" alt="" /> ODS</a>
                                    </li>
                                    <li role="presentation" data-type="pdf">
                                        <a href="#" data-container="body" title="Adobe Portable Document Format" @click.prevent="crud_export('pdf')"><img src="../../assets/images/crud/pdf.png" alt="" /> PDF</a>
                                    </li>
                                    <li role="presentation" data-type="xml">
                                        <a href="#" data-container="body" title="Extensible Markup Language" @click.prevent="crud_export('xml')"><img src="../../assets/images/crud/xml.png" alt="" /> XML</a>
                                    </li>
                                    <li role="presentation" data-type="php">
                                        <a href="#" data-container="body" title="PHP Array" @click.prevent="crud_export('php')"><img src="../../assets/images/crud/php.png" alt="" /> PHP</a>
                                    </li>
                                    <li role="presentation" data-type="csv">
                                        <a href="#" data-container="body" title="Comma-Seperated Values" @click.prevent="crud_export('csv')"><img src="../../assets/images/crud/csv.png" alt="" /> CSV</a>
                                    </li>
                                    <li role="presentation" data-type="json">
                                        <a href="#" data-container="body" title="JSON" @click.prevent="crud_export('json')"><img src="../../assets/images/crud/json.png" alt="" /> JSON</a>
                                    </li>
                                    <li role="presentation" data-type="bbcode">
                                        <a href="#" data-container="body" title="BBcode" @click.prevent="crud_export('bbcode')"><img src="../../assets/images/crud/bbcode.png" alt="" /> BBCODE</a>
                                    </li>
                                    <li role="presentation" data-type="wiki">
                                        <a href="#" data-container="body" title="WikiCode" @click.prevent="crud_export('wiki')"><img src="../../assets/images/crud/wiki.png" alt="" /> WIKI</a>
                                    </li>
                                    <li role="presentation" data-type="markdown">
                                        <a href="#" data-container="body" title="MarkDown" @click.prevent="crud_export('markdown')"><img src="../../assets/images/crud/markdown.png" alt="" /> MARKDOWN</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="title_btns" class="col-md-auto printer-hidden pl-2">
                            <div id="limitStatusGroup" class="btn-group">
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
                                <table id="crud-table" ref="table" :options="options" :columns="columns" class="display nowrap crud-table table-bordred table-striped table-hover table-sm table" width="100%">
                                    <thead>
                                        <tr>
                                            <th>Service ID</th>
                                            <th>Hostname tied to License</th>
                                            <th>IP Address tied to License</th>
                                            <th>Name of the Package</th>
                                            <th>Cost</th>
                                            <th>Billing Status</th>
                                            <th>Whether or not the Invoice was paid (if applicable)</th>
                                            <th>Date the Invoice was Created</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, rowIndex) in filteredData" :key="rowIndex" style="text-align: center">
                                            <td>{{ row.license_id }}</td>
                                            <td>
                                                <router-link :to="'/' + moduleLink(module) + '/' + row.license_id">{{ row.license_hostname }}</router-link>
                                            </td>
                                            <td>
                                                <router-link :to="'/' + moduleLink(module) + '/' + row.license_id">{{ row.license_ip }}</router-link>
                                            </td>
                                            <td>{{ row.services_name }}</td>
                                            <td>{{ row.cost }}</td>
                                            <td>{{ row.license_status }}</td>
                                            <td>{{ row.invoices_paid }}</td>
                                            <td>{{ row.invoices_date }}</td>
                                            <td>
                                                <router-link :to="'/' + moduleLink(module) + '/' + row.license_id" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link>
                                            </td>
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
