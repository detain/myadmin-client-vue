<script setup lang="ts">
import { moduleLink } from '@/helpers/moduleLink';
import { ref, computed } from 'vue';

import xlsxImg from '@/assets/images/crud/xlsx.png';
import xlsImg from '@/assets/images/crud/xls.png';
import odsImg from '@/assets/images/crud/ods.png';
import pdfImg from '@/assets/images/crud/pdf.png';
import xmlImg from '@/assets/images/crud/xml.png';
import phpImg from '@/assets/images/crud/php.png';
import csvImg from '@/assets/images/crud/csv.png';
import jsonImg from '@/assets/images/crud/json.png';
import bbcodeImg from '@/assets/images/crud/bbcode.png';
import wikiImg from '@/assets/images/crud/wiki.png';
import markdownImg from '@/assets/images/crud/markdown.png';

export interface ServiceListColumn {
    key: string;
    label: string;
    link?: boolean;
    sortable?: boolean;
}

interface Props {
    module: string;
    data: Record<string, any>[];
    columns: ServiceListColumn[];
    idField: string;
    statusField: string;
    orderTitle?: string;
    orderRoute?: string;
}

const props = withDefaults(defineProps<Props>(), {
    orderTitle: 'Order',
    orderRoute: '',
});

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

const sortField = ref(props.idField);
const sortDirection = ref<'asc' | 'desc'>('desc');

function toggleSort(column: ServiceListColumn) {
    if (column.sortable === false) return;
    if (sortField.value === column.key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortField.value = column.key;
        sortDirection.value = 'asc';
    }
}

const filteredData = computed(() => {
    let filtered: Record<string, any>[];
    if (limitStatus.value === 'all') {
        filtered = props.data;
    } else {
        filtered = props.data.filter((item) => limitStatusMap[limitStatus.value].includes(item[props.statusField]));
    }
    const field = sortField.value;
    const dir = sortDirection.value === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return dir;
        if (bVal == null) return -dir;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return (aVal - bVal) * dir;
        }
        return String(aVal).localeCompare(String(bVal)) * dir;
    });
});

const computedOrderRoute = computed(() => {
    if (props.orderRoute) return props.orderRoute;
    return `/${moduleLink(props.module)}/order`;
});

const exportFormats = [
    { type: 'xlsx', title: 'Excel 2007+', label: 'XLSX', img: xlsxImg },
    { type: 'xls', title: 'Excel 2003/BIFF', label: 'XLS', img: xlsImg },
    { type: 'ods', title: 'OpenDocument SpreadSheet', label: 'ODS', img: odsImg },
    { type: 'pdf', title: 'Adobe Portable Document Format', label: 'PDF', img: pdfImg },
    { type: 'xml', title: 'Extensible Markup Language', label: 'XML', img: xmlImg },
    { type: 'php', title: 'PHP Array', label: 'PHP', img: phpImg },
    { type: 'csv', title: 'Comma-Separated Values', label: 'CSV', img: csvImg },
    { type: 'json', title: 'JSON', label: 'JSON', img: jsonImg },
    { type: 'bbcode', title: 'BBcode', label: 'BBCODE', img: bbcodeImg },
    { type: 'wiki', title: 'WikiCode', label: 'WIKI', img: wikiImg },
    { type: 'markdown', title: 'MarkDown', label: 'MARKDOWN', img: markdownImg },
];

function crud_print(): void {
    window.print();
}

function crud_export(exportType: string): void {
    console.log(exportType);
}
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header text-right">
                    <div class="row float-right">
                        <div id="header_btns" class="col-md-auto printer-hidden pl-2 text-right">
                            <div class="btn-group">
                                <router-link class="btn btn-primary btn-sm printer-hidden" :to="computedOrderRoute" :title="orderTitle"><i class="fa fa-shopping-cart"></i> Order</router-link>
                            </div>
                        </div>
                        <div id="print_expo_btns" class="col-md-auto export printer-hidden float-right pl-2">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-secondary" type="button" title="Print" @click="crud_print()"><i class="fa fa-print crud-icon"></i>Print</button>
                                <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" title="Export data" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-download crud-icon"></i>Export <span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>
                                <ul class="dropdown-menu" role="menu">
                                    <li v-for="fmt in exportFormats" :key="fmt.type" role="presentation" :data-type="fmt.type">
                                        <a href="#" data-container="body" :title="fmt.title" @click.prevent="crud_export(fmt.type)"><img :src="fmt.img" alt="" /> {{ fmt.label }}</a>
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
                                <table id="crud-table" class="display nowrap crud-table table-bordred table-striped table-hover table-sm table" style="width: 100%">
                                    <thead>
                                        <tr>
                                            <th v-for="col in columns" :key="col.key" :class="{ sortable: col.sortable !== false }" style="cursor: pointer; user-select: none;" @click="toggleSort(col)">
                                                {{ col.label }}
                                                <i v-if="col.sortable !== false && sortField === col.key" class="fa" :class="sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'" style="margin-left: 4px;"></i>
                                                <i v-else-if="col.sortable !== false" class="fa fa-sort" style="margin-left: 4px; opacity: 0.3;"></i>
                                            </th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, rowIndex) in filteredData" :key="rowIndex" style="text-align: center">
                                            <td v-for="col in columns" :key="col.key">
                                                <router-link v-if="col.link" :to="'/' + moduleLink(module) + '/' + row[idField]">{{ row[col.key] }}</router-link>
                                                <template v-else>{{ row[col.key] }}</template>
                                            </td>
                                            <td>
                                                <router-link :to="'/' + moduleLink(module) + '/' + row[idField]" class="btn btn-primary btn-xs printer-hidden"><i class="fa fa-fw fa-cog"></i></router-link>
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
@import '@/assets/css/crud_table5.css';
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

th.sortable:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
</style>
