<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { moduleLink } from '@/helpers/moduleLink.ts';

import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores/site.store.ts';

const module: string = 'scrub_ips';
const siteStore = useSiteStore();
siteStore.setPageHeading('Scrub IPs Services List');
siteStore.setTitle('Scrub IPs Services List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Scrub IPs'],
]);
const baseUrl = siteStore.getBaseUrl();
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
const data = ref<ScrubIpRow[]>([]);
const table = ref();

const columns = [{ data: 'scrub_ip_id' }, { data: 'repeat_invoices_cost' }, { data: 'scrub_ip_ip' }, { data: 'scrub_ip_status' }, { data: 'services_name' }, { name: 'link', data: 'link', sortable: false }];

const options = {
    responsive: true,
};

const filteredData = computed(() => {
    if (limitStatus.value === 'all') {
        return data.value;
    } else {
        return data.value.filter((item) => limitStatusMap[limitStatus.value].includes(item.scrub_ip_status));
    }
});

function crud_print(): void {}

function crud_export(exportType: string): void {
    console.log(exportType);
}

interface ScrubIpRow {
    scrub_ip_id: number;
    repeat_invoices_cost: number;
    scrub_ip_ip: string;
    scrub_ip_status: string;
    services_name: string;
    link: string;
    sortable: boolean;
}

const loadScrubIp = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/scrub_ips`);
        console.log('api success');
        console.log(response);
        data.value = response;
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadScrubIp();
</script>
<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header text-right">
                    <div class="row float-right">
                        <div id="header_btns" class="col-md-auto printer-hidden pl-2 text-right">
                            <div class="btn-group">
                                <router-link class="btn btn-primary btn-sm printer-hidden" to="/scrub_ips/order" title="Order Scrub IPs"><i class="fa fa-shopping-cart"></i> Order</router-link>
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
                                        <th>ID</th>
                                        <th>Cost</th>
                                        <th>Username</th>
                                        <th>Status</th>
                                        <th>Package</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(row, rowIndex) in filteredData" :key="rowIndex" style="text-align: center">
                                        <td>{{ row.scrub_ip_id }}</td>
                                        <td>{{ row.repeat_invoices_cost }}</td>
                                        <td>
                                            <router-link :to="'/' + moduleLink(module) + '/' + row.scrub_ip_id">{{ row.scrub_ip_ip }}</router-link>
                                        </td>
                                        <td>{{ row.scrub_ip_status }}</td>
                                        <td>{{ row.services_name }}</td>
                                        <td>
                                            <router-link :to="'/' + moduleLink(module) + '/' + row.scrub_ip_id" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link>
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
