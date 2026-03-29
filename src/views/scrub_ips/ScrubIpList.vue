<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const { t } = useI18n();

const module = 'scrub_ips';
const siteStore = useSiteStore();
watchEffect(() => {
    siteStore.setPageHeading(t('scrub_ips.list.title'));
    siteStore.setTitle(t('scrub_ips.list.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('common.menu.scrubIps')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'scrub_ip_id', label: t('common.labels.id') },
    { key: 'repeat_invoices_cost', label: t('common.labels.cost') },
    { key: 'scrub_ip_ip', label: t('common.labels.username'), link: true },
    { key: 'scrub_ip_status', label: t('common.labels.status') },
    { key: 'services_name', label: t('common.labels.package') },
];

const data = ref<Record<string, any>[]>([]);
const loading = ref(true);

const loadData = async () => {
    loading.value = true;
    try {
        const response = await fetchWrapper.get(`${baseUrl}/scrub_ips`);
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
        id-field="scrub_ip_id"
        status-field="scrub_ip_status"
        :loading="loading"
        order-title="Order Scrub IPs"
    />
</template>
