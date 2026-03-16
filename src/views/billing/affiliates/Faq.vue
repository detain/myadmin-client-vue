<script setup lang="ts">
import { watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';

const { t } = useI18n();
const siteStore = useSiteStore();

watchEffect(() => {
    siteStore.setPageHeading(`${t('affiliate.title')} - ${t('affiliate.faqPage.title')}`);
    siteStore.setTitle(`${t('affiliate.title')} - ${t('affiliate.faqPage.title')}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['/affiliate', t('affiliate.breadcrumb')],
        ['', t('affiliate.faqPage.title')],
    ]);
});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><font-awesome-icon :icon="['fas', 'question']" />&nbsp;{{ t('affiliate.frequentlyAskedQuestions') }}</h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" :title="t('common.buttons.goBack')"><font-awesome-icon :icon="['fas', 'arrow-left']" />&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div id="faq" class="accordion">
                        <div class="card m-0">
                            <div id="qs1" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#q1" aria-expanded="true" aria-controls="q1">{{ t('affiliate.faqPage.q1') }}</button>
                                </h2>
                            </div>
                            <div id="q1" class="show collapse" aria-labelledby="qs1" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a1') }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs2" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q2" aria-expanded="false" aria-controls="q2">{{ t('affiliate.faqPage.q2') }}</button>
                                </h2>
                            </div>
                            <div id="q2" class="collapse" aria-labelledby="qs2" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a2') }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs3" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q3" aria-expanded="false" aria-controls="q3">{{ t('affiliate.faqPage.q3') }}</button>
                                </h2>
                            </div>
                            <div id="q3" class="collapse" aria-labelledby="qs3" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a3_step1') }}</li>
                                        <li>{{ t('affiliate.faqPage.a3_step2') }}</li>
                                        <li>{{ t('affiliate.faqPage.a3_step3') }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs4" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q4" aria-expanded="false" aria-controls="q4">{{ t('affiliate.faqPage.q4') }}</button>
                                </h2>
                            </div>
                            <div id="q4" class="collapse" aria-labelledby="qs4" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a4_step1') }}</li>
                                        <li>{{ t('affiliate.faqPage.a4_step2') }}</li>
                                        <li>{{ t('affiliate.faqPage.a4_step3') }}</li>
                                        <li>{{ t('affiliate.faqPage.a4_step4') }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs5" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q5" aria-expanded="false" aria-controls="q5">{{ t('affiliate.faqPage.q5') }}</button>
                                </h2>
                            </div>
                            <div id="q5" class="collapse" aria-labelledby="qs5" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a5_step1') }}</li>
                                        <li>{{ t('affiliate.faqPage.a5_step2') }}</li>
                                        <li>{{ t('affiliate.faqPage.a5_step3') }}</li>
                                        <li>{{ t('affiliate.faqPage.a5_step4') }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs6" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q6" aria-expanded="false" aria-controls="q6">{{ t('affiliate.faqPage.q6') }}</button>
                                </h2>
                            </div>
                            <div id="q6" class="collapse" aria-labelledby="qs6" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a6_line1') }}</li>
                                        <li>{{ t('affiliate.faqPage.a6_line2') }}</li>
                                        <li>{{ t('affiliate.faqPage.a6_line3') }}</li>
                                        <li>{{ t('affiliate.faqPage.a6_line4') }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs7" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q7" aria-expanded="false" aria-controls="q7">{{ t('affiliate.faqPage.q7') }}</button>
                                </h2>
                            </div>
                            <div id="q7" class="collapse" aria-labelledby="qs7" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a7_line1') }}</li>
                                        <li>{{ t('affiliate.faqPage.a7_line2') }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs8" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q8" aria-expanded="false" aria-controls="q8">{{ t('affiliate.faqPage.q8') }}</button>
                                </h2>
                            </div>
                            <div id="q8" class="collapse" aria-labelledby="qs8" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a8_line1') }}</li>
                                        <li>{{ t('affiliate.faqPage.a8_line2') }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs9" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q9" aria-expanded="false" aria-controls="q9">{{ t('affiliate.faqPage.q9') }}</button>
                                </h2>
                            </div>
                            <div id="q9" class="collapse" aria-labelledby="qs9" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a9') }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs10" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q10" aria-expanded="false" aria-controls="q10">{{ t('affiliate.faqPage.q10') }}</button>
                                </h2>
                            </div>
                            <div id="q10" class="collapse" aria-labelledby="qs10" data-parent="#faq">
                                <div class="card-body mr-4">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a10') }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs11" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q11" aria-expanded="false" aria-controls="q11">{{ t('affiliate.faqPage.q11') }}</button>
                                </h2>
                            </div>
                            <div id="q11" class="collapse" aria-labelledby="qs11" data-parent="#faq">
                                <div class="card-body px-5">
                                    <p>{{ t('affiliate.faqPage.a11_intro') }}</p>
                                    <p>{{ t('affiliate.faqPage.a11_reasons') }}</p>
                                    <ul style="padding-left: 25px">
                                        <li>{{ t('affiliate.faqPage.a11_reason1') }}</li>
                                        <li>{{ t('affiliate.faqPage.a11_reason2') }}</li>
                                        <li>{{ t('affiliate.faqPage.a11_reason3') }}</li>
                                    </ul>
                                    <p>{{ t('affiliate.faqPage.a11_policy') }}</p>
                                    <p>
                                        {{ t('affiliate.faqPage.a11_reviewTos') }}
                                        <a class="link" target="_blank" href="https://my.interserver.net/index.php?choice=none.affiliate_tos"> {{ t('affiliate.termsOfService') }} </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs12" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q12" aria-expanded="false" aria-controls="q12">{{ t('affiliate.faqPage.q12') }}</button>
                                </h2>
                            </div>
                            <div id="q12" class="collapse" aria-labelledby="qs12" data-parent="#faq">
                                <div class="card-body">
                                    <ul>
                                        <li>{{ t('affiliate.faqPage.a12_line1') }}</li>
                                        <li>{{ t('affiliate.faqPage.a12_line2') }}</li>
                                        <li>
                                            {{ t('affiliate.faqPage.a12_line3') }}
                                            <a href="https://www.interserver.net/webhosting/reseller-hosting.html" class="link" target="__blank">{{ t('affiliate.faqPage.a12_clickHere') }}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card m-0">
                            <div id="qs13" class="card-header">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#q13" aria-expanded="false" aria-controls="q13">{{ t('affiliate.faqPage.q13') }}</button>
                                </h2>
                            </div>
                            <div id="q13" class="collapse" aria-labelledby="qs13" data-parent="#faq">
                                <div class="card-body">
                                    <ul>
                                        <li>
                                            {{ t('affiliate.faqPage.a13') }}
                                            <a href="https://my.interserver.net/index.php?choice=none.affiliate_payment_setup" class="link" target="_blank">{{ t('affiliate.faqPage.a13_clickHere') }}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
