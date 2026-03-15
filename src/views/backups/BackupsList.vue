<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const module = 'backups';
const siteStore = useSiteStore();
siteStore.setPageHeading('Storage / Backup List');
siteStore.setTitle('Storage / Backup List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Storage'],
]);
const baseUrl = siteStore.getBaseUrl();

interface backupsRow {
    backup_id: number;
    backup_name: string;
    backup_cost: number;
    backup_username: string;
    backup_status: string;
    services_name: string;
}

const columns: ServiceListColumn[] = [
    { key: 'backup_id', label: 'ID' },
    { key: 'backup_name', label: 'Server' },
    { key: 'backup_cost', label: 'Cost' },
    { key: 'backup_username', label: 'Username', link: true },
    { key: 'backup_status', label: 'Status' },
    { key: 'services_name', label: 'Package' },
];

const data = ref<backupsRow[]>([]);

const loadBackups = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/backups`);
        data.value = response;
    } catch (error: any) {
        console.log('api failed', error);
    }
};
loadBackups();
</script>

<template>
    <ServiceListTable
        :module="module"
        :data="data"
        :columns="columns"
        id-field="backup_id"
        status-field="backup_status"
        order-title="Order Backup Registrations"
    />
</template>
