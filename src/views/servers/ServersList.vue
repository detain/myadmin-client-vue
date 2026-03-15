<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const module = 'servers';
const siteStore = useSiteStore();
siteStore.setPageHeading('Dedicated Servers List');
siteStore.setTitle('Dedicated Servers List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Servers'],
]);
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'server_id', label: 'ID' },
    { key: 'account_lid', label: 'Client' },
    { key: 'server_hostname', label: 'Server Name', link: true },
    { key: 'server_status', label: 'Status' },
];

const data = ref<Record<string, any>[]>([]);

const loadData = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/servers`);
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
        id-field="server_id"
        status-field="server_status"
        order-title="Order Server Registrations"
    />
</template>
