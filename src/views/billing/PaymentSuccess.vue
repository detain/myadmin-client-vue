<script setup lang="ts">
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';

const { t } = useI18n();
const siteStore = useSiteStore();
const route = useRoute();
const invoices = route.query.invoices ? String(route.query.invoices) : '';

watchEffect(() => {
    siteStore.setPageHeading(t('billing.paymentSuccess.title'));
    siteStore.setTitle(t('billing.paymentSuccess.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['/cart', t('billing.cart.title')],
        ['', t('billing.paymentSuccess.title')],
    ]);
});
</script>

<template>
    <div class="row justify-content-center mt-4">
        <div class="col-md-8">
            <div class="callout callout-success">
                <h4><i class="fas fa-check-circle text-success"></i> {{ t('billing.paymentSuccess.successful') }}</h4>
                <p class="text-md">{{ t('billing.paymentSuccess.thankYou') }}</p>
                <p v-if="invoices" class="text-muted text-sm">{{ t('billing.paymentSuccess.invoiceLabel', { invoices }) }}</p>
                <div class="mt-3">
                    <router-link to="/cart" class="btn btn-custom mr-2"><i class="fas fa-shopping-cart"></i> {{ t('billing.paymentSuccess.backToCart') }}</router-link>
                    <router-link to="/home" class="btn btn-outline-custom"><i class="fas fa-home"></i> {{ t('billing.paymentSuccess.goToDashboard') }}</router-link>
                </div>
            </div>
        </div>
    </div>
</template>
