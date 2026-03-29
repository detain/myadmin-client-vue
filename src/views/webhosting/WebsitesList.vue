<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const { t } = useI18n();

const module = 'webhosting';
const siteStore = useSiteStore();
watchEffect(() => {
    siteStore.setPageHeading(t('webhosting.list.title'));
    siteStore.setTitle(t('webhosting.list.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('common.menu.webhosting')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'website_id', label: t('common.labels.id') },
    { key: 'website_hostname', label: t('common.labels.hostname'), link: true },
    { key: 'repeat_invoices_cost', label: t('common.labels.cost') },
    { key: 'website_status', label: t('common.labels.status') },
    { key: 'services_name', label: t('common.labels.package') },
    { key: 'website_comment', label: t('common.labels.comments') },
];

const data = ref<Record<string, any>[]>([]);
const loading = ref(true);

const loadData = async () => {
    loading.value = true;
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}`);
        data.value = response;
    } catch (error: any) {
        console.log('api failed', error);
    } finally {
        loading.value = false;
    }
};
loadData();
</script>

<template>
    <ServiceListTable
        :module="module"
        :data="data"
        :columns="columns"
        id-field="website_id"
        status-field="website_status"
        :loading="loading"
        :order-title="t('webhosting.list.orderTitle')"
    />
</template>
