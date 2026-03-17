<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ref, onMounted, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';

const { t } = useI18n();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();

watchEffect(() => {
    siteStore.setPageHeading(`${t('affiliate.title')} - ${t('affiliate.richReportPage.title')}`);
    siteStore.setTitle(`${t('affiliate.title')} - ${t('affiliate.richReportPage.title')}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['/affiliate', t('affiliate.breadcrumb')],
        ['', t('affiliate.richReportPage.title')],
    ]);
});
const table = ref('');
onMounted(() => {});
try {
    Swal.fire({
        title: '',
        html: '<i class="fas fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper.get(`${baseUrl}/affiliate/rich_report`).then((response) => {
        Swal.close();
        console.log('rich report success', response);
        table.value = response.text;
    });
} catch (error: any) {
    Swal.close();
    console.log('vps setup vnc failed', error);
    Swal.fire({
        icon: 'error',
        html: `Got error ${error.text}`,
    });
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="far fa-file-text-o"></i>&nbsp;{{ t('affiliate.richReportPage.title') }}</h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" :title="t('common.buttons.goBack')"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body" v-html="table"></div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
