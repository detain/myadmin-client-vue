<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface domainsRow {
    screenshot?: string;
    domain_id: number;
    domain_hostname: string;
    domain_expire_date: string;
    cost: number;
    domain_status: string;
    link?: number | string;
    hostname?: string;
}

const router = useRouter();
const route = useRoute();
let dt;
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

const columns = [{ data: 'domain_id' }, { data: 'hostname' }, { data: 'domain_expire_date' }, { data: 'cost' }, { data: 'domain_status' }, { name: 'Link', data: 'link', sortable: false }];

const options = {
    responsive: true,
};

origData.value = [
    { domain_id: 376503, domain_hostname: 'hostingenuity.com', domain_expire_date: '2022-02-09 16:20:25', cost: 12.0, domain_status: 'active' },
    { domain_id: 592337, domain_hostname: 'detain.dev', domain_expire_date: '2023-08-14 00:59:38', cost: 18.0, domain_status: 'active' },
];

const filteredData = computed(() => {
    const activeDomains: domainsRow[] = [];
    origData.value.forEach((row) => {
        row.link = `<router-link to="'view_domain?id=${row.domain_id}'" class="btn btn-primary btn-xs printer-hidden"><i class="fas fa-fw fa-cog"></i></router-link>`;
        row.link = row.domain_id;
        row.hostname = `<router-link to="'view_domain?id=${row.domain_id}'">${row.domain_hostname}</router-link>`;
        if (limitStatus.value === 'all' || limitStatusMap[limitStatus.value].includes(row.domain_status)) {
            activeDomains.push(row);
        }
    });
    return activeDomains;
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
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header text-end">
                    <div class="row float-end">
                        <div id="header_btns" class="col-md-auto printer-hidden ps-2 text-end">
                            <div class="btn-group">
                                <a class="btn btn-primary btn-sm printer-hidden" href="domains/order" :title="t('domains.list.orderTitle')"><i class="fas fa-shopping-cart"></i> {{ t('common.buttons.order') }}</a>
                            </div>
                        </div>
                        <div id="print_expo_btns" class="col-md-auto export printer-hidden float-end ps-2">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-secondary" type="button" :title="t('common.buttons.print')" @click="crud_print()"><i class="fas fa-print crud-icon"></i>{{ t('common.buttons.print') }}</button>
                                <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" :title="t('domains.list.exportData')" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-download crud-icon"></i>{{ t('common.export.order') }} <span class="caret"></span><span class="visually-hidden">{{ t('domains.list.toggleDropdown') }}</span></button>
                                <ul class="dropdown-menu" role="menu">
                                    <li role="presentation" data-type="xlsx">
                                        <a href="#" data-container="body" :title="t('common.export.xlsx')" @click.prevent="crud_export('xlsx')"><img src="../../assets/images/crud/xlsx.png" alt="" /> {{ t('common.export.xlsxShort') }}</a>
                                    </li>
                                    <li role="presentation" data-type="xls">
                                        <a href="#" data-container="body" :title="t('common.export.xls')" @click.prevent="crud_export('xls')"><img src="../../assets/images/crud/xls.png" alt="" /> {{ t('common.export.xlsShort') }}</a>
                                    </li>
                                    <li role="presentation" data-type="ods">
                                        <a href="#" data-container="body" :title="t('common.export.ods')" @click.prevent="crud_export('ods')"><img src="../../assets/images/crud/ods.png" alt="" /> {{ t('common.export.odsShort') }}</a>
                                    </li>
                                    <li role="presentation" data-type="pdf">
                                        <a href="#" data-container="body" :title="t('common.export.pdf')" @click.prevent="crud_export('pdf')"><img src="../../assets/images/crud/pdf.png" alt="" /> {{ t('common.export.pdfShort') }}</a>
                                    </li>
                                    <li role="presentation" data-type="xml">
                                        <a href="#" data-container="body" :title="t('common.export.xml')" @click.prevent="crud_export('xml')"><img src="../../assets/images/crud/xml.png" alt="" /> {{ t('common.export.xmlShort') }}</a>
                                    </li>
                                    <li role="presentation" data-type="php">
                                        <a href="#" data-container="body" :title="t('common.export.php')" @click.prevent="crud_export('php')"><img src="../../assets/images/crud/php.png" alt="" /> {{ t('common.export.phpShort') }}</a>
                                    </li>
                                    <li role="presentation" data-type="csv">
                                        <a href="#" data-container="body" :title="t('common.export.csv')" @click.prevent="crud_export('csv')"><img src="../../assets/images/crud/csv.png" alt="" /> {{ t('common.export.csvShort') }}</a>
                                    </li>
                                    <li role="presentation" data-type="json">
                                        <a href="#" data-container="body" :title="t('common.export.json')" @click.prevent="crud_export('json')"><img src="../../assets/images/crud/json.png" alt="" /> {{ t('common.export.json') }}</a>
                                    </li>
                                    <li role="presentation" data-type="bbcode">
                                        <a href="#" data-container="body" title="BBcode" @click.prevent="crud_export('bbcode')"><img src="../../assets/images/crud/bbcode.png" alt="" /> BBCODE</a>
                                    </li>
                                    <li role="presentation" data-type="wiki">
                                        <a href="#" data-container="body" title="WikiCode" @click.prevent="crud_export('wiki')"><img src="../../assets/images/crud/wiki.png" alt="" /> WIKI</a>
                                    </li>
                                    <li role="presentation" data-type="markdown">
                                        <a href="#" data-container="body" title="Markdown" @click.prevent="crud_export('markdown')"><img src="../../assets/images/crud/markdown.png" alt="" /> MARKDOWN</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="title_btns" class="col-md-auto printer-hidden ps-2">
                            <div id="limitStatusGroup" class="btn-group">
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'active' }" status="active" @click.prevent="setStatusLimit">{{ t('domains.list.active') }}</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'pending' }" status="pending" @click.prevent="setStatusLimit">{{ t('domains.list.pending') }}</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'expired' }" status="expired" @click.prevent="setStatusLimit">{{ t('domains.list.expired') }}</a>
                                <a class="btn btn-info btn-sm" :class="{ active: limitStatus === 'all' }" status="all" @click.prevent="setStatusLimit">{{ t('domains.list.all') }}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                    <div id="crud" class="crud">
                        <div class="row">
                            <div class="col-md-12">
                                <DataTable id="crud-table" ref="table" :options="options" :data="filteredData" :columns="columns" class="display nowrap crud-table table-bordred table-striped table-hover table-sm table" width="100%">
                                    <template #link="{ value }">
                                        <router-link :to="value" class="btn btn-primary btn-xs printer-hidden">{{ value }}<i class="fas fa-fw fa-cog"></i></router-link>
                                    </template>
                                    <thead>
                                        <tr>
                                            <th>{{ t('common.table.serviceId') }}</th>
                                            <th>{{ t('domains.list.domainName') }}</th>
                                            <th>{{ t('domains.list.domainExpirationDate') }}</th>
                                            <th>{{ t('common.labels.cost') }}</th>
                                            <th>{{ t('common.labels.billingStatus') }}</th>
                                            <th>{{ t('domains.list.link') }}</th>
                                        </tr>
                                    </thead>
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
