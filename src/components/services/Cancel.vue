<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';

import Swal from 'sweetalert2';

const { t } = useI18n();
const props = defineProps<{
    id: number;
    module: string;
    package: string | number;
    titleField: string;
    titleField2?: string;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const { modules } = storeToRefs(siteStore);
const id = computed(() => props.id);
const module = computed(() => props.module);
const pkg = computed(() => props.package);
const titleField = computed(() => props['titleField']);
const titleField2 = computed(() => props['titleField2']);
const settings = computed(() => modules.value[module.value]);

siteStore.setTitle('');
siteStore.setPageHeading('');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module.value)}`, 'VPS'],
]);
siteStore.addBreadcrum(`/${moduleLink(module.value)}/${id.value}`, `View ${module.value} ${id.value}`);
siteStore.addBreadcrum(`/${moduleLink(module.value)}/${id.value}/cancel`, `Cancel ${module.value}`);

onMounted(() => {});

function onSubmit() {
    Swal.fire({
        icon: 'error',
        title: `<h3>${t('common.confirm.cancelTitle', { module: module.value })}</h3> `,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: t('common.confirm.yesCancelIt'),
        html: `<p>${t('common.confirm.cancelConfirm', { module: module.value, id: id.value })}</p>`,
        preConfirm: () => {
            try {
                fetchWrapper.get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/cancel`).then((response) => {
                    console.log(`${module.value} cancel success`, response);
                });
            } catch (error: any) {
                console.log(`${module.value} cancel failed`, error);
            }
        },
    });
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12 my-5">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title m-0 text-start">{{ t('common.services.cancelService', { title: settings?.TITLE }) }}</h4>
                    </div>
                    <div class="card-body">
                        <form id="cancelForm" class="form-horizontal text-start" role="form" method="POST" @submit.prevent="onSubmit">
                            <div class="mb-3 row">
                                <label class="col-sm-5 col-form-label">{{ t('common.services.idLabel', { tableName: settings?.TBLNAME }) }}</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">{{ id }}</div>
                            </div>
                            <div class="mb-3 row">
                                <label class="col-sm-5 col-form-label">{{ t('common.labels.type') }}:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">{{ pkg }}</div>
                            </div>
                            <div class="mb-3 row">
                                <label class="col-sm-5 col-form-label">{{ t('common.labels.hostname') }}:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">{{ titleField }}</div>
                            </div>
                            <div class="mb-3 row">
                                <label class="col-sm-5 col-form-label">{{ t('common.labels.username') }}:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">{{ titleField2 }}</div>
                            </div>
                            <div class="mb-3 row">
                                <label class="col-sm-5 col-form-label" for="confirm">{{ t('common.confirm.areYouSureCancelQuestion') }}</label>
                                <div class="col-sm-7" style="text-align: left">
                                    <div class="ui-select">
                                        <select id="confirm" name="confirm" class="form-control">
                                            <option value="no">{{ t('common.confirm.no') }}</option>
                                            <option value="yes">{{ t('common.confirm.yesCancelOrder', { tableName: settings?.TBLNAME }) }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label class="col-sm-5 col-form-label" for="comment" style="font-weight: normal">{{ t('common.services.reasonForCancellation') }}</label>
                                <div class="col-sm-7" style="text-align: left">
                                    <textarea id="comment" class="form-control" rows="2"></textarea>
                                </div>
                            </div>
                            <div class="card-footer">
                                <div class="mb-3 row m-0">
                                    <div class="col-sm-12 text-center">
                                        <button class="btn btn-md btn-success" type="submit">{{ t('common.buttons.continue') }}</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
