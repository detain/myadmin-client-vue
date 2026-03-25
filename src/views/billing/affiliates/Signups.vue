<script setup lang="ts">
import { watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';

const { t } = useI18n();
const siteStore = useSiteStore();

watchEffect(() => {
    siteStore.setPageHeading(`${t('affiliate.title')} - ${t('affiliate.signups.title')}`);
    siteStore.setTitle(`${t('affiliate.title')} - ${t('affiliate.signups.title')}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['/affiliate', t('affiliate.breadcrumb')],
        ['', t('affiliate.signups.title')],
    ]);
});
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-user-plus" aria-hidden="true"></i>&nbsp;{{ t('affiliate.signups.title') }}</h3>
                        <div class="card-tools float-end">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-bs-toggle="tooltip" :title="t('common.buttons.goBack')"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <span class="text-md">{{ t('affiliate.signups.exportAllRecords') }} </span>
                            <router-link id="ex_xlsx_all" to="/affiliate/download/xlsx/all" :title="t('common.export.xlsx')" class="btn btn-sm btn-custom export">{{ t('common.export.xlsxShort') }}</router-link>
                            <router-link id="ex_xls_all" to="/affiliate/download/xls/all" :title="t('common.export.xls')" class="btn btn-sm btn-custom export">{{ t('common.export.xlsShort') }}</router-link>
                            <router-link id="ex_csv_all" to="/affiliate/download/csv/all" class="btn btn-sm btn-custom export">{{ t('common.export.csvShort') }}</router-link>
                            <router-link id="ex_pdf_all" to="/affiliate/download/pdf/all" class="btn btn-sm btn-custom export">{{ t('common.export.pdfShort') }}</router-link>
                        </div>
                        <div class="col-md-4 mb-3">
                            <span class="text-md text-center">{{ t('affiliate.signups.affiliateStatus') }} </span>
                            <div id="title_btns" class="nav nav-tabs">
                                <a class="active btn btn-info btn-sm" data-bs-toggle="tab" href="#tab-default">{{ t('affiliate.signups.default') }}</a>
                                <a class="btn btn-info btn-sm" data-bs-toggle="tab" href="#tab-pending">{{ t('affiliate.signups.pending') }}</a>
                                <a class="btn btn-info btn-sm" data-bs-toggle="tab" href="#tab-paid">{{ t('affiliate.signups.paid') }}</a>
                                <a class="btn btn-info" data-bs-toggle="tab" href="#tab-failed">{{ t('affiliate.signups.failed') }}</a>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3 text-end">
                            <span class="text-md">{{ t('affiliate.signups.exportOnStatus') }} </span>
                            <router-link id="ex_xlsx" to="/affiliate/download/xlsx/default" :title="t('common.export.xlsx')" class="btn btn-sm btn-custom export">{{ t('common.export.xlsxShort') }}</router-link>
                            <router-link id="ex_xls" to="/affiliate/download/xls/default" :title="t('common.export.xls')" class="btn btn-sm btn-custom export">{{ t('common.export.xlsShort') }}</router-link>
                            <router-link id="ex_csv" to="/affiliate/download/csv/default" class="btn btn-sm btn-custom export">{{ t('common.export.csvShort') }}</router-link>
                            <router-link id="ex_pdf" to="/affiliate/download/pdf/default" class="btn btn-sm btn-custom export">{{ t('common.export.pdfShort') }}</router-link>
                        </div>
                    </div>
                    <div class="tab-content">
                        <div id="tab-default" class="tab-pane active">
                            <div class="table-responsive">
                                <table id="table_default" class="table-sm w-100 table">
                                    <thead>
                                        <tr>
                                            <td>{{ t('affiliate.signups.columns.id') }}</td>
                                            <td>{{ t('affiliate.signups.columns.sid') }}</td>
                                            <td>{{ t('affiliate.signups.columns.service') }}</td>
                                            <td>{{ t('affiliate.signups.columns.signupDate') }}</td>
                                            <td>{{ t('affiliate.signups.columns.activationDate') }}</td>
                                            <td>{{ t('affiliate.signups.columns.daysActive') }}</td>
                                            <td>{{ t('affiliate.signups.columns.status') }}</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div id="tab-pending" class="tab-pane">
                            <div class="table-responsive">
                                <table id="table_pending" class="table-sm w-100 table">
                                    <thead>
                                        <tr>
                                            <td>{{ t('affiliate.signups.columns.id') }}</td>
                                            <td>{{ t('affiliate.signups.columns.sid') }}</td>
                                            <td>{{ t('affiliate.signups.columns.service') }}</td>
                                            <td>{{ t('affiliate.signups.columns.signupDate') }}</td>
                                            <td>{{ t('affiliate.signups.columns.activationDate') }}</td>
                                            <td>{{ t('affiliate.signups.columns.daysActive') }}</td>
                                            <td>{{ t('affiliate.signups.columns.status') }}</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div id="tab-failed" class="tab-pane">
                            <div class="table-responsive">
                                <table id="table_failed" class="table-sm w-100 table">
                                    <thead>
                                        <tr>
                                            <td>{{ t('affiliate.signups.columns.id') }}</td>
                                            <td>{{ t('affiliate.signups.columns.sid') }}</td>
                                            <td>{{ t('affiliate.signups.columns.service') }}</td>
                                            <td>{{ t('affiliate.signups.columns.signupDate') }}</td>
                                            <td>{{ t('affiliate.signups.columns.activationDate') }}</td>
                                            <td>{{ t('affiliate.signups.columns.status') }}</td>
                                            <td>{{ t('affiliate.signups.columns.reason') }}</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div id="tab-paid" class="tab-pane">
                            <div class="table-responsive">
                                <table id="table_paid" class="table-sm w-100 table">
                                    <thead>
                                        <tr>
                                            <td>{{ t('affiliate.signups.columns.id') }}</td>
                                            <td>{{ t('affiliate.signups.columns.sid') }}</td>
                                            <td>{{ t('affiliate.signups.columns.service') }}</td>
                                            <td>{{ t('affiliate.signups.columns.signupDate') }}</td>
                                            <td>{{ t('affiliate.signups.columns.activationDate') }}</td>
                                            <td>{{ t('affiliate.signups.columns.paidAmount') }}</td>
                                            <td>{{ t('affiliate.signups.columns.paidDate') }}</td>
                                            <td>{{ t('affiliate.signups.columns.daysActive') }}</td>
                                            <td>{{ t('affiliate.signups.columns.status') }}</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
