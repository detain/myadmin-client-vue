<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { snakeToCamel } from '@/helpers/snakeToCamel.ts';

import { storeToRefs } from 'pinia';
import { RouterLink, useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/account.store.ts';
import { useSiteStore } from '@/stores/site.store.ts';

import $ from 'jquery';
import Swal from 'sweetalert2';

const siteStore = useSiteStore();
const accountStore = useAccountStore();
siteStore.setPageHeading('Cart');
siteStore.setTitle('Cart');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Cart'],
]);
const baseUrl = siteStore.getBaseUrl();
const { loading, error, custid, ima, data, ip } = storeToRefs(accountStore);
const route = useRoute();
const method = computed(() => {
    return route.params.method;
});
const invoices = computed(() => {
    return route.params.invoices;
});

try {
    fetchWrapper.get(baseUrl + '/pay/' + method.value + '/' + invoices.value + '?redirectUrl=' + encodeURIComponent('https://' + window.location.hostname + '/pay/' + method.value + '/' + invoices.value) + '?cancelUrl=' + encodeURIComponent('https://' + window.location.hostname + '/pay/' + method.value + '/' + invoices.value)).then((response) => {
        console.log(response);
    });
} catch (error: any) {
    console.log('error:');
    console.log(error);
}
</script>

<template>
    <div class="row justify-content-center mt-2">
        <div class="col-md-12">
            <div class="callout callout-success">
                <h5>Creating Payment Request...</h5>
                <p class="text-md">You will be automatically redirected.</p>
            </div>
        </div>
    </div>
</template>
