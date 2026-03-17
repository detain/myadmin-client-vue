<template>
    <div class="col-md-4">
        <div :class="statusClass">
            <div class="inner px-3 pb-2 pt-3">
                <h3>{{ t('common.labels.billing') }}</h3>
                <p class="my-3 py-3">
                    <b>{{ currencySymbol }}{{ cost }}</b> {{ t('common.labels.billed') }} <b>{{ frequency }}</b>
                </p>
            </div>
            <div class="icon"><i class="fas fa-dollar-sign"></i></div>
            <span class="small-box-footer"
                >{{ t('common.labels.statusIs') }} <b>{{ ucwords(serviceStatus) }}</b></span
            >
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ucwords } from '@/helpers/ucwords';

const { t } = useI18n();
const { serviceStatus, currencySymbol, cost, frequency } = defineProps<{
    frequency: string;
    currencySymbol: string;
    cost: string;
    serviceStatus: string;
}>();
const statusClass = computed(() => {
    if (serviceStatus === 'active') return 'small-box b-radius bg-success';
    if (serviceStatus === 'pending') return 'small-box b-radius bg-orange';
    if (serviceStatus === 'expired' || serviceStatus === 'canceled') return 'small-box b-radius bg-red';
    return '';
});
</script>
