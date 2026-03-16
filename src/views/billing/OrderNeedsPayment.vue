<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Cart from '@/views/billing/Cart.vue';

const { t } = useI18n();
</script>

<template>
    <div class="row justify-content-center mt-2">
        <div class="col-md-12">
            <div class="callout callout-success">
                <h5>{{ t('billing.cart.thankYouForOrder') }}</h5>
                <p class="text-md">{{ t('billing.cart.paymentActivationPrompt') }}</p>
            </div>
        </div>
    </div>
    <Cart></Cart>
</template>

<style scoped></style>
