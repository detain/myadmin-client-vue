<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const { t } = useI18n();

const module = 'backups';
const siteStore = useSiteStore();
watchEffect(() => {
    siteStore.setPageHeading(t('backups.list.title'));
    siteStore.setTitle(t('backups.list.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('common.menu.storage')],
    ]);
});
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
    { key: 'backup_id', label: t('common.labels.id') },
    { key: 'backup_name', label: t('common.labels.server') },
    { key: 'backup_cost', label: t('common.labels.cost') },
    { key: 'backup_username', label: t('common.labels.username'), link: true },
    { key: 'backup_status', label: t('common.labels.status') },
    { key: 'services_name', label: t('common.labels.package') },
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
        :order-title="t('backups.list.orderTitle')"
    />
</template>
