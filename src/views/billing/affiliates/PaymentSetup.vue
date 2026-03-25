<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ref, onMounted, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from '@/stores/account.store';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';

const { t } = useI18n();
const siteStore = useSiteStore();
const accountStore = useAccountStore();
const baseUrl = siteStore.getBaseUrl();

watchEffect(() => {
    siteStore.setPageHeading(`${t('affiliate.title')} - ${t('affiliate.paymentSetup.title')}`);
    siteStore.setTitle(`${t('affiliate.title')} - ${t('affiliate.paymentSetup.title')}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['/affiliate', t('affiliate.breadcrumb')],
        ['', t('affiliate.paymentSetup.title')],
    ]);
});
const { data } = storeToRefs(accountStore);
const payment_method = ref(data.value.affiliate_payment_method || 'not set');
const affiliate_paypal = ref(data.value.affiliate_paypal || '');
onMounted(() => {});

function submitForm() {
    Swal.fire({
        title: '',
        html: '<i class="fas fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/affiliate/payment_setup`, {
                affiliate_payment_method: payment_method.value,
                affiliate_paypal: affiliate_paypal.value,
            })
            .then((response) => {
                Swal.close();
                console.log('affiliate payment method setup success', response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('affiliate payment method setup failed', error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}
accountStore.loadOnce();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title" style="position: relative; top: 5px"><i class="fas fa-money-bill"></i>&nbsp;{{ t('affiliate.paymentSetup.choosePayment') }}</h3>
                        <div class="card-tools float-end">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-bs-toggle="tooltip" :title="t('common.buttons.goBack')"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form id="" method="post" @submit.prevent="submitForm">
                        <div class="mb-3 row">
                            <label class="col-sm-3 col-form-label text-end"> {{ t('affiliate.paymentSetup.selectPaymentMethod') }}<span class="text-danger"> *</span> </label>
                            <div class="col-sm-9 input-group">
                                <div class="mb-3 w-100">
                                    <div class="form-check d-inline">
                                        <input id="payment_method_paypal" v-model="payment_method" type="radio" class="form-check-input" name="affiliate_payment_method" value="paypal" />
                                        <label class="form-label form-check-label more-info fw-normal" for="payment_method_paypal">{{ t('affiliate.paymentSetup.sendToPaypal') }}</label>
                                    </div>
                                </div>
                                <div class="mb-3 w-100">
                                    <div class="d-inline">
                                        <label class="form-label " for="paypal_email">{{ t('affiliate.paymentSetup.paypalEmail') }}</label>
                                        <input id="paypal_email" v-model="affiliate_paypal" type="text" class="form-control form-control-sm" name="affiliate_paypal" />
                                    </div>
                                </div>
                                <div class="mb-3 w-100">
                                    <div class="form-check d-inline">
                                        <input id="payment_method_inv" v-model="payment_method" type="radio" class="form-check-input" name="affiliate_payment_method" value="prepay" />
                                        <label class="form-label form-check-label more-info fw-normal" for="payment_method_inv">{{ t('affiliate.paymentSetup.createPrepay') }}</label>
                                    </div>
                                </div>
                                <div class="mb-3 w-100">
                                    <div class="form-check d-inline">
                                        <input id="no_payment_method" v-model="payment_method" type="radio" class="form-check-input" name="affiliate_payment_method" value="not set" />
                                        <label class="form-label form-check-label more-info fw-normal" for="no_payment_method">{{ t('affiliate.paymentSetup.notSet') }}</label>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="controls col-md-12 text-center">
                                        <input type="submit" name="Submit" :value="t('common.buttons.submit')" class="btn btn-order btn-sm px-3 py-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
