<script setup lang="ts">
import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';

const { t } = useI18n();
const siteStore = useSiteStore();

watchEffect(() => {
    siteStore.setPageHeading(`${t('affiliate.title')} - ${t('affiliate.status.title')}`);
    siteStore.setTitle(`${t('affiliate.title')} - ${t('affiliate.status.title')}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['/affiliate', t('affiliate.breadcrumb')],
        ['', t('affiliate.status.title')],
    ]);
});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card card-outline card-secondary">
                <div class="card-body text-lg"><strong>{{ t('affiliate.signups.default') }} -</strong> {{ t('affiliate.status.defaultDesc') }}</div>
            </div>
            <div class="card card-outline card-info">
                <div class="card-body text-lg"><strong>{{ t('affiliate.signups.pending') }} -</strong> {{ t('affiliate.status.pendingDesc') }}</div>
            </div>
            <div class="card card-outline card-danger">
                <div class="card-body text-lg"><strong>{{ t('affiliate.signups.failed') }} -</strong> {{ t('affiliate.status.failedDesc') }}</div>
            </div>
            <div class="card card-outline card-danger">
                <div class="card-body text-lg"><strong>{{ t('affiliate.signups.locked') }} -</strong> {{ t('affiliate.status.lockedDesc') }}</div>
            </div>
            <div class="card card-outline card-danger">
                <div class="card-body text-lg"><strong>{{ t('affiliate.signups.rejected') }} -</strong> {{ t('affiliate.status.rejectedDesc') }}</div>
            </div>
            <div class="card card-outline card-success">
                <div class="card-body text-lg"><strong>{{ t('affiliate.signups.paid') }} -</strong> {{ t('affiliate.status.paidDesc') }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
