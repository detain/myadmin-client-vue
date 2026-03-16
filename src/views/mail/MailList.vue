<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import { loadLocaleMessages } from '@/i18n';
import ServiceListTable from '@/components/ServiceListTable.vue';
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

await loadLocaleMessages('en', 'mail');
const { t } = useI18n();

const module = 'mail';
const siteStore = useSiteStore();
watchEffect(() => {
    siteStore.setPageHeading(t('mail.list.title'));
    siteStore.setTitle(t('mail.list.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('common.menu.mail')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();

interface mailRow {
    mail_id: number;
    repeat_invoices_cost: number;
    mail_username: string;
    mail_status: string;
    services_name: string;
}

const columns: ServiceListColumn[] = [
    { key: 'mail_id', label: t('common.labels.id') },
    { key: 'repeat_invoices_cost', label: t('common.labels.cost') },
    { key: 'mail_username', label: t('common.labels.username'), link: true },
    { key: 'mail_status', label: t('common.labels.status') },
    { key: 'services_name', label: t('common.labels.package') },
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
        :order-title="t('mail.list.orderTitle')"
    />
</template>
