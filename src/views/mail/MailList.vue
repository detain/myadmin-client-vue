<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const module = 'mail';
const siteStore = useSiteStore();
siteStore.setPageHeading('Mail Services List');
siteStore.setTitle('Mail Services List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Mail'],
]);
const baseUrl = siteStore.getBaseUrl();

interface mailRow {
    mail_id: number;
    repeat_invoices_cost: number;
    mail_username: string;
    mail_status: string;
    services_name: string;
}

const columns: ServiceListColumn[] = [
    { key: 'mail_id', label: 'ID' },
    { key: 'repeat_invoices_cost', label: 'Cost' },
    { key: 'mail_username', label: 'Username', link: true },
    { key: 'mail_status', label: 'Status' },
    { key: 'services_name', label: 'Package' },
];

const data = ref<mailRow[]>([]);

const loadMail = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/mail`);
        data.value = response;
    } catch (error: any) {
        console.log('api failed', error);
    }
};
loadMail();
</script>

<template>
    <ServiceListTable
        :module="module"
        :data="data"
        :columns="columns"
        id-field="mail_id"
        status-field="mail_status"
        order-title="Order Mail Registrations"
    />
</template>
