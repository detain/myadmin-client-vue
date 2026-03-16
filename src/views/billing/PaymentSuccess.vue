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
                <h4><font-awesome-icon :icon="['fas', 'check-circle']" class="text-success" /> {{ t('billing.paymentSuccess.successful') }}</h4>
                <p class="text-md">{{ t('billing.paymentSuccess.thankYou') }}</p>
                <p v-if="invoices" class="text-muted text-sm">{{ t('billing.paymentSuccess.invoiceLabel', { invoices }) }}</p>
                <div class="mt-3">
                    <router-link to="/cart" class="btn btn-custom mr-2"><font-awesome-icon :icon="['fas', 'shopping-cart']" /> {{ t('billing.paymentSuccess.backToCart') }}</router-link>
                    <router-link to="/home" class="btn btn-outline-custom"><font-awesome-icon :icon="['fas', 'home']" /> {{ t('billing.paymentSuccess.goToDashboard') }}</router-link>
                </div>
            </div>
        </div>
    </div>
</template>
