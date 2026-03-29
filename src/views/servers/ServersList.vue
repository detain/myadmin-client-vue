<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const { t } = useI18n();

const module = 'servers';
const siteStore = useSiteStore();
watchEffect(() => {
    siteStore.setPageHeading(t('servers.list.title'));
    siteStore.setTitle(t('servers.list.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('common.menu.servers')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'server_id', label: t('common.labels.id') },
    { key: 'account_lid', label: t('common.labels.client') },
    { key: 'server_hostname', label: t('common.labels.hostname'), link: true },
    { key: 'server_status', label: t('common.labels.status') },
];

const data = ref<Record<string, any>[]>([]);
const loading = ref(true);

const loadData = async () => {
    loading.value = true;
    try {
        const response = await fetchWrapper.get(`${baseUrl}/servers`);
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
        id-field="server_id"
        status-field="server_status"
        :loading="loading"
        :order-title="t('servers.list.orderTitle')"
    />
</template>
