<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const module = 'vps';
const siteStore = useSiteStore();
siteStore.setPageHeading('VPS List');
siteStore.setTitle('VPS List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'VPS List'],
]);
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'vps_id', label: 'ID' },
    { key: 'vps_name', label: 'Server' },
    { key: 'repeat_invoices_cost', label: 'Cost' },
    { key: 'vps_hostname', label: 'Hostname', link: true },
    { key: 'vps_ip', label: 'IP' },
    { key: 'vps_status', label: 'Status' },
    { key: 'services_name', label: 'Package' },
    { key: 'vps_comment', label: 'Comments' },
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
        order-title="Order VPS"
    />
</template>
