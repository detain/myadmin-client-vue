<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const { t } = useI18n();

const module = 'floating_ips';
const siteStore = useSiteStore();
watchEffect(() => {
    siteStore.setPageHeading(t('floating_ips.list.title'));
    siteStore.setTitle(t('floating_ips.list.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('common.menu.floatingIps')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();

interface FloatingIpRow {
    floating_ip_id: number;
    repeat_invoices_cost: number;
    floating_ip_username: string;
    floating_ip_status: string;
    services_name: string;
}

const columns: ServiceListColumn[] = [
    { key: 'floating_ip_id', label: t('common.labels.id') },
    { key: 'repeat_invoices_cost', label: t('common.labels.cost') },
    { key: 'floating_ip_username', label: t('common.labels.username'), link: true },
    { key: 'floating_ip_status', label: t('common.labels.status') },
    { key: 'services_name', label: t('common.labels.package') },
];

const data = ref<FloatingIpRow[]>([]);
const loading = ref(true);

const loadFloatingIps = async () => {
    loading.value = true;
    try {
        const response = await fetchWrapper.get(`${baseUrl}/floating_ips`);
        data.value = response;
    } catch (error: any) {
        console.log('api failed', error);
    } finally {
        loading.value = false;
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
        :loading="loading"
        :order-title="t('floating_ips.list.orderTitle')"
    />
</template>
