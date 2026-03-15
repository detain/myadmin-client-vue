<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const module = 'scrub_ips';
const siteStore = useSiteStore();
siteStore.setPageHeading('Scrub IPs Services List');
siteStore.setTitle('Scrub IPs Services List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Scrub IPs'],
]);
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'scrub_ip_id', label: 'ID' },
    { key: 'repeat_invoices_cost', label: 'Cost' },
    { key: 'scrub_ip_ip', label: 'Username', link: true },
    { key: 'scrub_ip_status', label: 'Status' },
    { key: 'services_name', label: 'Package' },
];

const data = ref<Record<string, any>[]>([]);

const loadData = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/scrub_ips`);
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
        id-field="scrub_ip_id"
        status-field="scrub_ip_status"
        order-title="Order Scrub IPs"
    />
</template>
