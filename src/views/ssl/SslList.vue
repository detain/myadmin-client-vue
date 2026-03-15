<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const module = 'ssl';
const siteStore = useSiteStore();
siteStore.setPageHeading('SSL Certificates List');
siteStore.setTitle('SSL Certificates List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'SSL'],
]);
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'ssl_id', label: 'Service ID' },
    { key: 'ssl_hostname', label: 'Ssl Name', link: true },
    { key: 'ssl_company', label: 'Company' },
    { key: 'services_name', label: 'Package' },
    { key: 'ssl_status', label: 'Billing Status' },
];

const data = ref<Record<string, any>[]>([]);

const loadData = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/ssl`);
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
        id-field="ssl_id"
        status-field="ssl_status"
        order-title="Order Ssl Registrations"
        order-route="/ssl/order"
    />
</template>
