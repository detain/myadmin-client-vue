<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useSiteStore } from '@/stores/site.store';

const siteStore = useSiteStore();
const route = useRoute();
const invoices = route.query.invoices ? String(route.query.invoices) : '';

siteStore.setPageHeading('Payment Success');
siteStore.setTitle('Payment Success');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/cart', 'Cart'],
    ['', 'Payment Success'],
]);
</script>

<template>
    <div class="row justify-content-center mt-4">
        <div class="col-md-8">
            <div class="callout callout-success">
                <h4><i class="fas fa-check-circle text-success"></i> Payment Successful!</h4>
                <p class="text-md">Thank you for your payment. Your transaction has been completed successfully.</p>
                <p v-if="invoices" class="text-muted text-sm">Invoice(s): {{ invoices }}</p>
                <div class="mt-3">
                    <router-link to="/cart" class="btn btn-custom mr-2"><i class="fas fa-shopping-cart"></i> Back to Cart</router-link>
                    <router-link to="/home" class="btn btn-outline-custom"><i class="fas fa-home"></i> Go to Dashboard</router-link>
                </div>
            </div>
        </div>
    </div>
</template>
