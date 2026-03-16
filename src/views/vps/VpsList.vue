<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const { t } = useI18n();

const module = 'vps';
const siteStore = useSiteStore();
watchEffect(() => {
    siteStore.setPageHeading(t('vps.list.title'));
    siteStore.setTitle(t('vps.list.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('vps.list.title')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'vps_id', label: t('common.labels.id') },
    { key: 'vps_name', label: t('common.labels.server') },
    { key: 'repeat_invoices_cost', label: t('common.labels.cost') },
    { key: 'vps_hostname', label: t('common.labels.hostname'), link: true },
    { key: 'vps_ip', label: t('common.labels.ip') },
    { key: 'vps_status', label: t('common.labels.status') },
    { key: 'services_name', label: t('common.labels.package') },
    { key: 'vps_comment', label: t('common.labels.comments') },
];

const data = ref<Record<string, any>[]>([]);

const loadData = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/vps`);
        data.value = response;
    } catch (error: any) {
        console.log('api failed', error);
    }
};
loadData();
</script>

<template>
    <ServiceListTable
        :module="module"
        :data="data"
        :columns="columns"
        id-field="vps_id"
        status-field="vps_status"
        :order-title="t('vps.list.orderVps')"
    />
</template>
