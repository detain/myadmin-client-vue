<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const module = 'floating_ips';
const siteStore = useSiteStore();
siteStore.setPageHeading('Floating IPs Services List');
siteStore.setTitle('Floating IPs Services List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Floating IPs'],
]);
const baseUrl = siteStore.getBaseUrl();

interface FloatingIpRow {
    floating_ip_id: number;
    repeat_invoices_cost: number;
    floating_ip_username: string;
    floating_ip_status: string;
    services_name: string;
}

const columns: ServiceListColumn[] = [
    { key: 'floating_ip_id', label: 'ID' },
    { key: 'repeat_invoices_cost', label: 'Cost' },
    { key: 'floating_ip_username', label: 'Username', link: true },
    { key: 'floating_ip_status', label: 'Status' },
    { key: 'services_name', label: 'Package' },
];

const data = ref<FloatingIpRow[]>([]);

const loadFloatingIps = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/floating_ips`);
        data.value = response;
    } catch (error: any) {
        console.log('api failed', error);
    }
};
loadFloatingIps();
</script>

<template>
    <ServiceListTable
        :module="module"
        :data="data"
        :columns="columns"
        id-field="floating_ip_id"
        status-field="floating_ip_status"
        order-title="Order Floating IPs Registrations"
    />
</template>
