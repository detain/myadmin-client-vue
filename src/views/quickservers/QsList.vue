<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const module = 'quickservers';
const siteStore = useSiteStore();
siteStore.setPageHeading('Rapid Deploy Servers List');
siteStore.setTitle('Rapid Deploy Servers List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Quickservers'],
]);
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'qs_id', label: 'Service ID' },
    { key: 'qs_name', label: 'Server Name' },
    { key: 'cost', label: 'Cost' },
    { key: 'qs_hostname', label: 'Hostname', link: true },
    { key: 'qs_status', label: 'Billing Status' },
    { key: 'qs_comment', label: 'Comments' },
];

const data = ref<Record<string, any>[]>([]);
const loading = ref(true);

const loadData = async () => {
    loading.value = true;
    try {
        const response = await fetchWrapper.get(`${baseUrl}/qs`);
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
        id-field="qs_id"
        status-field="qs_status"
        :loading="loading"
        order-title="Order Qs Registrations"
    />
</template>
