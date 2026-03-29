<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const { t } = useI18n();
const module = 'domains';
const siteStore = useSiteStore();

watchEffect(() => {
    siteStore.setPageHeading(t('domains.list.pageTitle'));
    siteStore.setTitle(t('domains.list.pageTitle'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('common.menu.domains')],
    ]);
});

const baseUrl = siteStore.getBaseUrl();

interface domainsRow {
    domain_id: number;
    domain_hostname: string;
    domain_expire_date: string;
    cost: number;
    domain_status: string;
}

const columns: ServiceListColumn[] = [
    { key: 'domain_id', label: t('common.table.serviceId') },
    { key: 'domain_hostname', label: t('domains.list.domainName'), link: true },
    { key: 'domain_expire_date', label: t('domains.list.domainExpirationDate') },
    { key: 'cost', label: t('common.labels.cost') },
    { key: 'domain_status', label: t('common.labels.billingStatus') },
];

const data = ref<domainsRow[]>([]);
const loading = ref(true);

const loadDomains = async () => {
    loading.value = true;
    try {
        const response = await fetchWrapper.get(`${baseUrl}/domains`);
        data.value = response;
    } catch (error: any) {
        console.log('api failed', error);
    } finally {
        loading.value = false;
    }
};
loadDomains();
</script>

<template>
    <ServiceListTable
        :module="module"
        :data="data"
        :columns="columns"
        id-field="domain_id"
        status-field="domain_status"
        :loading="loading"
        :order-title="t('domains.list.orderTitle')"
    />
</template>
