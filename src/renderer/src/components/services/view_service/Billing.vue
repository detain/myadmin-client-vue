<template>
    <div class="col-md-4">
        <div :class="statusClass">
            <div class="inner px-3 pb-2 pt-3">
                <h3>Billing</h3>
                <p class="my-3 py-3">
                    <b>{{ currencySymbol }}{{ cost }}</b> billed: <b>{{ frequency }}</b>
                </p>
            </div>
            <div class="icon"><i class="fas fa-dollar-sign"></i></div>
            <span class="small-box-footer"
                >Status is: <b>{{ ucwords(serviceStatus) }}</b></span
            >
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { ucwords } from '../../../helpers/ucwords';
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
