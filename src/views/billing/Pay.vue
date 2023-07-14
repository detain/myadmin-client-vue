<script setup>
import { ref } from 'vue';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useAccountStore, useSiteStore } from '@/stores';
import $ from 'jquery';
import Swal from 'sweetalert2';
const siteStore = useSiteStore();
const accountStore = useAccountStore();
siteStore.setPageHeading('Cart');
siteStore.setTitle('Cart');
siteStore.setBreadcrums({ '/home': 'Home', '': 'Cart' });
const baseUrl = siteStore.getBaseUrl();
const { loading, error, custid, ima, link, data, ip } = storeToRefs(accountStore);
const pymt_method = ref('paypal');

try {
    fetchWrapper.get(baseUrl + '/pay').then((response) => {
        console.log(response);
    });
} catch (error) {
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
