<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute } from 'vue-router';
import { useAccountStore } from '../../stores/account.store';
import { useSiteStore } from '../../stores/site.store';
import $ from 'jquery';
import Swal from 'sweetalert2';
const form = reactive({
    action: '',
    method: 'POST',
    items: {},
});
const siteStore = useSiteStore();
const accountStore = useAccountStore();
const baseUrl = siteStore.getBaseUrl();
const { loading, error, custid, ima, data, ip } = storeToRefs(accountStore);
const route = useRoute();
const method = computed(() => route.params.method);
const invoices = computed(() => route.params.invoices);
const isDone = computed(() => route.params.done == 'done');

siteStore.setPageHeading('Cart');
siteStore.setTitle('Cart');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/cart/${invoices.value}`, 'Cart'],
    ['', 'Pay Invoices'],
]);

interface GetPayRedirectResponse {
    type: 'redirect';
    redirect: string;
    text: string;
}

interface GetPaySubmitResponse {
    type: 'submit';
    text: string;
    action: string;
    method: 'GET' | 'POST';
    items: {
        [key: string]: string;
    };
}

type GetPayResponse = GetPaySubmitResponse | GetPayRedirectResponse;

if (!isDone.value) {
    try {
        fetchWrapper.get(`${baseUrl}/pay/${method.value}/${invoices.value}?redirectUrl=${encodeURIComponent(`${window.location.origin}/pay/${method.value}/${invoices.value}/done`)}`).then((response: GetPayResponse) => {
            console.log('Response:', response);
            if (response.type == 'redirect') {
                window.location.href = response.redirect;
            } else if (response.type == 'submit') {
                form.action = response.action;
                form.method = response.method;
                form.items = response.items;
                const submit = document.getElementById('submitForm') as HTMLFormElement;
                submit.submit();
            }
            console.log(response);
        });
    } catch (error: any) {
        console.log('error:');
        console.log(error);
    }
}
</script>

<template>
    <div v-if="!isDone" class="row justify-content-center mt-2">
        <div class="col-md-12">
            <div class="callout callout-success">
                <h5>Creating Payment Request...</h5>
                <p class="text-md">You will be automatically redirected.</p>
            </div>
        </div>
    </div>
    <div v-else>
        Returned from payment.
    </div>
    <form v-if="form.action" id="submitForm" :action="form.action">
        <input v-for="(value, key) in form.items" :key="key" type="hidden" :name="key" :value="value" />
        <input type="submit" value="Submit" />
    </form>
</template>
