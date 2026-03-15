<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

const module = 'domains';
const siteStore = useSiteStore();
siteStore.setPageHeading('Domain Registrations List');
siteStore.setTitle('Domain Registrations List');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Domains'],
]);
const baseUrl = siteStore.getBaseUrl();

interface domainsRow {
    domain_id: number;
    domain_hostname: string;
    domain_expire_date: string;
    cost: number;
    domain_status: string;
}

const columns: ServiceListColumn[] = [
    { key: 'domain_id', label: 'Service ID' },
    { key: 'domain_hostname', label: 'Domain Name', link: true },
    { key: 'domain_expire_date', label: 'Domain Expiration Date' },
    { key: 'cost', label: 'Cost' },
    { key: 'domain_status', label: 'Billing Status' },
];

const data = ref<domainsRow[]>([]);

const loadDomains = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/domains`);
        data.value = response;
    } catch (error: any) {
        console.log('api failed', error);
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
        order-title="Order Domain Registrations"
    />
</template>
