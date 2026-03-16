<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import { loadLocaleMessages } from '@/i18n';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

await loadLocaleMessages('en', 'licenses');
const { t } = useI18n();

const module = 'licenses';
const siteStore = useSiteStore();
watchEffect(() => {
    siteStore.setPageHeading(t('licenses.list.title'));
    siteStore.setTitle(t('licenses.list.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('common.menu.licenses')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();

const columns: ServiceListColumn[] = [
    { key: 'license_id', label: 'Service ID' },
    { key: 'license_hostname', label: 'Hostname tied to License', link: true },
    { key: 'license_ip', label: 'IP Address tied to License', link: true },
    { key: 'services_name', label: 'Name of the Package' },
    { key: 'cost', label: 'Cost' },
    { key: 'license_status', label: 'Billing Status' },
    { key: 'invoices_paid', label: 'Whether or not the Invoice was paid (if applicable)' },
    { key: 'invoices_date', label: 'Date the Invoice was Created' },
];

const data = ref<Record<string, any>[]>([]);

const loadData = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/licenses`);
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
        id-field="license_id"
        status-field="license_status"
        :order-title="t('licenses.list.orderTitle')"
    />
</template>
