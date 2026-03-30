<script setup lang="ts">
import { moduleLink } from '@/helpers/moduleLink';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
    loading?: boolean;
    orderTitle?: string;
    orderRoute?: string;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
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

const limitStatusLabel = computed(() => {
    const labels: Record<string, string> = {
        active: t('common.labels.active'),
        pending: t('common.labels.pending'),
        expired: t('common.labels.expired'),
        all: t('common.labels.all'),
    };
    return labels[limitStatus.value] || limitStatus.value;
});

const computedOrderRoute = computed(() => {
    if (props.orderRoute) return props.orderRoute;
    return `/${moduleLink(props.module)}/order`;
});

const exportFormats = computed(() => [
    { type: 'xlsx', title: t('common.export.xlsx'), label: t('common.export.xlsxShort'), img: xlsxImg },
    { type: 'xls', title: t('common.export.xls'), label: t('common.export.xlsShort'), img: xlsImg },
    { type: 'ods', title: t('common.export.ods'), label: t('common.export.odsShort'), img: odsImg },
    { type: 'pdf', title: t('common.export.pdf'), label: t('common.export.pdfShort'), img: pdfImg },
    { type: 'xml', title: t('common.export.xml'), label: t('common.export.xmlShort'), img: xmlImg },
    { type: 'php', title: t('common.export.php'), label: t('common.export.phpShort'), img: phpImg },
    { type: 'csv', title: t('common.export.csv'), label: t('common.export.csvShort'), img: csvImg },
    { type: 'json', title: t('common.export.json'), label: t('common.export.json'), img: jsonImg },
    { type: 'bbcode', title: t('common.export.bbcode'), label: t('common.export.bbcodeShort'), img: bbcodeImg },
    { type: 'wiki', title: t('common.export.wiki'), label: t('common.export.wikiShort'), img: wikiImg },
    { type: 'markdown', title: t('common.export.markdown'), label: t('common.export.markdownShort'), img: markdownImg },
]);

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
                <div class="card-header text-end">
                    <div class="row float-end">
                        <div id="header_btns" class="col-md-auto printer-hidden ps-2 text-end">
                            <div class="btn-group">
                                <router-link class="btn btn-primary btn-sm printer-hidden" :to="computedOrderRoute" :title="orderTitle"><i class="fas fa-shopping-cart"></i> {{ t('common.buttons.order') }}</router-link>
                            </div>
                        </div>
                        <div id="print_expo_btns" class="col-md-auto export printer-hidden float-end ps-2">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-secondary" type="button" :title="t('common.buttons.print')" @click="crud_print()"><i class="fas fa-print crud-icon"></i>{{ t('common.buttons.print') }}</button>
                                <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" :title="t('common.buttons.exportData')" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-download crud-icon"></i>Export <span class="caret"></span><span class="visually-hidden">Toggle Dropdown</span></button>
                                <ul class="dropdown-menu" role="menu">
                                    <li v-for="fmt in exportFormats" :key="fmt.type" role="presentation" :data-type="fmt.type">
                                        <a href="#" data-container="body" :title="fmt.title" @click.prevent="crud_export(fmt.type)"><img :src="fmt.img" alt="" /> {{ fmt.label }}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="title_btns" class="col-md-auto printer-hidden ps-2">
                            <div id="limitStatusGroup" class="btn-group">
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'active' }" @click.prevent="limitStatus = 'active'">{{ t('common.labels.active') }}</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'pending' }" @click.prevent="limitStatus = 'pending'">{{ t('common.labels.pending') }}</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'expired' }" @click.prevent="limitStatus = 'expired'">{{ t('common.labels.expired') }}</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'all' }" @click.prevent="limitStatus = 'all'">{{ t('common.labels.all') }}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                    <div id="crud" class="crud">
                        <div class="row">
                            <div class="col-md-12">
                                <table id="crud-table" class="display crud-table table-bordred table-striped table-hover table-sm table" style="width: 100%">
                                    <thead>
                                        <tr>
                                            <th v-for="col in columns" :key="col.key" :class="{ sortable: col.sortable !== false }" style="cursor: pointer; user-select: none;" @click="toggleSort(col)">
                                                {{ col.label }}
                                                <i v-if="col.sortable !== false && sortField === col.key" class="fa" :class="sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'" style="margin-left: 4px;"></i>
                                                <i v-else-if="col.sortable !== false" class="fas fa-sort" style="margin-left: 4px; opacity: 0.3;"></i>
                                            </th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="loading">
                                        <tr>
                                            <td :colspan="columns.length + 1" class="text-center">{{ t('common.labels.loading') }}</td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else-if="filteredData.length === 0">
                                        <tr>
                                            <td :colspan="columns.length + 1" class="text-center">{{ t('common.labels.noServicesMatchingFilter', { filter: limitStatusLabel }) }}</td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <tr v-for="(row, rowIndex) in filteredData" :key="rowIndex" style="text-align: center">
                                            <td v-for="col in columns" :key="col.key">
                                                <router-link v-if="col.link" :to="'/' + moduleLink(module) + '/' + row[idField]">{{ row[col.key] }}</router-link>
                                                <template v-else>{{ row[col.key] }}</template>
                                            </td>
                                            <td>
                                                <router-link :to="'/' + moduleLink(module) + '/' + row[idField]" class="btn btn-primary btn-xs printer-hidden"><i class="fas fa-fw fa-cog"></i></router-link>
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
