<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '@/stores';
const siteStore = useSiteStore();
siteStore.setPageHeading('Affiliate - PaymentSetup');
siteStore.setTitle('Affiliate - PaymentSetup');
siteStore.setBreadcrums({ '/home': 'Home', '/affiliate': 'Affiliate', '': 'PaymentSetup' });

onMounted(() => {});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title" style="position: relative; top: 5px"><i class="fa fa-money">&nbsp;</i>Choose what you want done with your affiliate payments</h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form method="post" id="" action="/affiliate?link=payment_method">
                        <input type="hidden" name="csrf_token" :value="csrf" />
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label text-right"> Select Payment Method<span class="text-danger"> *</span> </label>
                            <div class="col-sm-9 input-group">
                                <div class="form-group w-100">
                                    <div class="icheck-success d-inline">
                                        <input id="payment_method_paypal" type="radio" class="form-check-input" name="affiliate_payment_method" value="paypal" :checked="payment_method === 'paypal'" />
                                        <label class="more-info font-weight-normal" for="payment_method_paypal">Send Payments to Paypal</label>
                                    </div>
                                </div>
                                <div class="form-group w-100">
                                    <div class="d-inline">
                                        <span class="" for="paypal_email">Paypal Email</span>
                                        <input id="paypal_email" type="text" class="form-control form-control-sm" name="affiliate_paypal" :value="affiliate_paypal" />
                                    </div>
                                </div>
                                <div class="form-group w-100">
                                    <div class="icheck-success d-inline">
                                        <input id="payment_method_inv" type="radio" class="form-check-input" name="affiliate_payment_method" value="prepay" :checked="payment_method === 'prepay'" />
                                        <label class="more-info font-weight-normal" for="payment_method_inv">Create a PrePay with the amount to automatically use on my invoices.</label>
                                    </div>
                                </div>
                                <div class="form-group w-100">
                                    <div class="icheck-success d-inline">
                                        <input id="no_payment_method" type="radio" class="form-check-input" name="affiliate_payment_method" value="not set" :checked="payment_method === 'not set'" />
                                        <label class="more-info font-weight-normal" for="no_payment_method">Not Set.</label>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="controls col-md-12 text-center">
                                        <input type="submit" name="Submit" value="Submit" class="btn btn-order btn-sm px-3 py-2" />
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
