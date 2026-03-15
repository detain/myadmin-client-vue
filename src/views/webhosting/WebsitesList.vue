<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const module = 'webhosting';
const siteStore = useSiteStore();
siteStore.setPageHeading('Web Hosting List');
siteStore.setTitle('Web Hosting List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Webhosting'],
]);
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'website_id', label: 'ID' },
    { key: 'website_hostname', label: 'Hostname', link: true },
    { key: 'repeat_invoices_cost', label: 'Cost' },
    { key: 'website_status', label: 'Status' },
    { key: 'services_name', label: 'Package' },
    { key: 'website_comment', label: 'Comments' },
];

const data = ref<Record<string, any>[]>([]);

const loadData = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}`);
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
        id-field="website_id"
        status-field="website_status"
        order-title="Order Website Registrations"
    />
</template>
