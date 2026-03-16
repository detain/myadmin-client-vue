<script setup lang="ts">
import { reactive, ref, computed, watch, watchEffect } from 'vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from '@/stores/account.store';
import { useSiteStore } from '@/stores/site.store';
import $ from 'jquery';
import Swal from 'sweetalert2';
const form = reactive({
    action: '',
    method: 'POST',
    items: {},
});
const { t } = useI18n();
const siteStore = useSiteStore();
const accountStore = useAccountStore();
const router = useRouter();
const baseUrl = siteStore.getBaseUrl();
const { loading, error, custid, ima, data, ip } = storeToRefs(accountStore);
const route = useRoute();
const method = computed(() => route.params.method);
const invoices = computed(() => route.params.invoices);
const isDone = computed(() => route.params.done == 'done');

watchEffect(() => {
    siteStore.setPageHeading(t('billing.cart.title'));
    siteStore.setTitle(t('billing.cart.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/cart/${invoices.value}`, t('billing.cart.title')],
        ['', t('billing.pay.title')],
    ]);
});

interface GetPayRedirectResponse {
    type: 'redirect';
    redirect: string;
    text: string;
}

interface GetPaySingleResponse {
    type: 'single';
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

type GetPayResponse = GetPaySubmitResponse | GetPayRedirectResponse | GetPaySingleResponse;

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
            } else if (response.type == 'single') {
                router.push(`/pay/${method.value}/${invoices.value}/done`);
            }
            console.log(response);
        });
    } catch (error: any) {
        console.log('error:', error);
    }
}
</script>

<template>
    <div v-if="!isDone" class="row justify-content-center mt-2">
        <div class="col-md-12">
            <div class="callout callout-success">
                <h5>{{ t('billing.pay.creatingPaymentRequest') }}</h5>
                <p class="text-md">{{ t('billing.pay.autoRedirect') }}</p>
            </div>
        </div>
    </div>
    <div v-else>{{ t('billing.pay.returnedFromPayment') }}</div>
    <form v-if="form.action" id="submitForm" :action="form.action">
        <input v-for="(value, key) in form.items" :key="key" type="hidden" :name="key" :value="value" />
        <input type="submit" :value="t('common.buttons.submit')" />
    </form>
</template>
