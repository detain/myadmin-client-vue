<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { moduleLink } from '@/helpers/moduleLink.ts';

import { ref, computed, onMounted } from 'vue';

interface domainsRow {
    screenshot: string;
    domain_id: number;
    domain_hostname: string;
    domain_expire_date: string;
    cost: number;
    domain_status: string;
    link: string;
}
const module = 'domains';
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
const origData = ref<domainsRow[]>([]);
const data = ref<domainsRow[]>([]);
const table = ref();

const columns = [{ data: 'domain_id' }, { data: 'domain_hostname' }, { data: 'domain_expire_date' }, { data: 'cost' }, { data: 'domain_status' }, { name: 'link', data: 'link', sortable: false }];

const options = {
    responsive: true,
};

origData.value = [
    { screenshot: '<a href="index.php?choice=none.view_domain&id=376503"><img src="https://shot.sh?w=300&h=100&img=hostingenuity.com"></a>', domain_id: 376503, domain_hostname: 'hostingenuity.com', domain_expire_date: '2022-02-09 16:20:25', cost: 12.0, domain_status: 'active', link: 'hi' },
    { screenshot: '<a href="index.php?choice=none.view_domain&id=592337"><img src="https://shot.sh?w=300&h=100&img=detain.dev"></a>', domain_id: 592337, domain_hostname: 'detain.dev', domain_expire_date: '2023-08-14 00:59:38', cost: 18.0, domain_status: 'active', link: 'hi' },
];
const filteredData = computed(() => {
    if (limitStatus.value === 'all') {
        return origData.value;
    } else {
        return origData.value.filter((item) => limitStatusMap[limitStatus.value].includes(item.domain_status));
    }
});

function crud_print(): void {}

function crud_export(exportType: string): void {
    console.log(exportType);
}
function setStatusLimit(event: Event) {
    limitStatus.value = (event.target as HTMLElement).getAttribute('status') as string;
}
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
                                <a class="btn btn-primary btn-sm printer-hidden" href="domains/order" title="Order Domain Registrations"><i class="fa fa-shopping-cart"></i> Order</a>
                            </div>
                        </div>
                        <div id="print_expo_btns" class="col-md-auto export printer-hidden float-right pl-2">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-secondary" type="button" title="Print" @click="crud_print()"><i class="fa fa-print crud-icon"></i>Print</button>
                                <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" title="Export data" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-download crud-icon"></i>Export <span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>
                                <ul class="dropdown-menu" role="menu">
                                    <li role="presentation" data-type="xlsx">
                                        <a href="#" data-container="body" title="Excel 2007+" @click.prevent="crud_export('xlsx')"><img src="/images/crud/xlsx.png" alt="" /> XLSX</a>
                                    </li>
                                    <li role="presentation" data-type="xls">
                                        <a href="#" data-container="body" title="Excel 2003/BIFF" @click.prevent="crud_export('xls')"><img src="/images/crud/xls.png" alt="" /> XLS</a>
                                    </li>
                                    <li role="presentation" data-type="ods">
                                        <a href="#" data-container="body" title="OpenDocument SpreadSheet" @click.prevent="crud_export('ods')"><img src="/images/crud/ods.png" alt="" /> ODS</a>
                                    </li>
                                    <li role="presentation" data-type="pdf">
                                        <a href="#" data-container="body" title="Adobe Portable Document Format" @click.prevent="crud_export('pdf')"><img src="/images/crud/pdf.png" alt="" /> PDF</a>
                                    </li>
                                    <li role="presentation" data-type="xml">
                                        <a href="#" data-container="body" title="Extensible Markup Language" @click.prevent="crud_export('xml')"><img src="/images/crud/xml.png" alt="" /> XML</a>
                                    </li>
                                    <li role="presentation" data-type="php">
                                        <a href="#" data-container="body" title="PHP Array" @click.prevent="crud_export('php')"><img src="/images/crud/php.png" alt="" /> PHP</a>
                                    </li>
                                    <li role="presentation" data-type="csv">
                                        <a href="#" data-container="body" title="Comma-Seperated Values" @click.prevent="crud_export('csv')"><img src="/images/crud/csv.png" alt="" /> CSV</a>
                                    </li>
                                    <li role="presentation" data-type="json">
                                        <a href="#" data-container="body" title="JSON" @click.prevent="crud_export('json')"><img src="/images/crud/json.png" alt="" /> JSON</a>
                                    </li>
                                    <li role="presentation" data-type="bbcode">
                                        <a href="#" data-container="body" title="BBcode" @click.prevent="crud_export('bbcode')"><img src="/images/crud/bbcode.png" alt="" /> BBCODE</a>
                                    </li>
                                    <li role="presentation" data-type="wiki">
                                        <a href="#" data-container="body" title="WikiCode" @click.prevent="crud_export('wiki')"><img src="/images/crud/wiki.png" alt="" /> WIKI</a>
                                    </li>
                                    <li role="presentation" data-type="markdown">
                                        <a href="#" data-container="body" title="MarkDown" @click.prevent="crud_export('markdown')"><img src="/images/crud/markdown.png" alt="" /> MARKDOWN</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="title_btns" class="col-md-auto printer-hidden pl-2">
                            <div class="btn-group" id="limitStatusGroup">
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'active' }" status="active" @click.prevent="setStatusLimit">Active</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'pending' }" status="pending" @click.prevent="setStatusLimit">Pending</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'expired' }" status="expired" @click.prevent="setStatusLimit">Expired</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'all' }" status="all" @click.prevent="setStatusLimit">All</a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                    <div id="crud" class="crud">
                        <div class="row">
                            <div class="col-md-12">
                                <DataTable :options="options" :columns="columns" :data="filteredData" class="display nowrap crud-table table-bordred table-striped table-hover table-sm table" width="100%" ref="table" id="crud-table">
                                    <template v-slot:link="{ value }">
                                        <router-link :to="'view_domain?id=' + value" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link>
                                    </template>
                                    <thead>
                                        <tr>
                                            <th>Service ID</th>
                                            <th>Domain Name</th>
                                            <th>Domain Expiration Date</th>
                                            <th>Cost</th>
                                            <th>Billing Status</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, rowIndex) in filteredData" :key="rowIndex" style="text-align: center">
                                            <td>{{ row.domain_id }}</td>
                                            <td>
                                                <router-link :to="'/' + moduleLink(module) + '/' + row.domain_id">{{ row.domain_hostname }}</router-link>
                                            </td>
                                            <td>{{ row.domain_expire_date }}</td>
                                            <td>{{ row.cost }}</td>
                                            <td>{{ row.domain_status }}</td>
                                            <td>
                                                <router-link :to="'/' + moduleLink(module) + '/' + row.domain_id" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link>
                                            </td>
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
