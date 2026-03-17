<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';

const { t } = useI18n();
const props = defineProps<{
    id: number;
    hostname: string;
}>();
const id = computed(() => props.id);
const hostname = computed(() => props.hostname);
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const router = useRouter();
const module: string = 'domains';
const currencySymbol = ref('$');
const available = ref(true);
const whoisCost = ref(0);
const whoisPrivacy = ref('disabled');
const loadingDone = ref(false);

function placeOrder() {
    Swal.fire({
        title: t('domains.whois.confirmOrderTitle'),
        html: `<p>${t('domains.whois.confirmOrderMessage', { cost: `<b>${currencySymbol.value}${whoisCost.value.toFixed(2)}</b>` })}</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: t('domains.order.placeOrder'),
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.whois.placingOrder')}`,
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            fetchWrapper
                .post(`${baseUrl}/${moduleLink(module)}/${id.value}/whois`, { action: 'order' })
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: t('domains.whois.orderPlaced'),
                        html: response.text || t('domains.whois.orderSuccess'),
                        confirmButtonText: 'OK',
                    }).then(() => {
                        if (response.payUrl) {
                            window.location.href = response.payUrl;
                        } else {
                            router.push(`/${moduleLink(module)}/${id.value}`);
                        }
                    });
                })
                .catch((error: any) => {
                    Swal.fire({
                        icon: 'error',
                        title: t('common.confirm.title'),
                        html: error?.text || error?.error || 'Failed to place order.',
                    });
                });
        }
    });
}

function enableWhois() {
    Swal.fire({
        title: t('domains.whois.enableTitle'),
        html: `<p>${t('domains.whois.enableMessage', { hostname: hostname.value })}</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: t('domains.whois.enableTitle'),
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.whois.enablingWhois')}`,
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            fetchWrapper
                .post(`${baseUrl}/${moduleLink(module)}/${id.value}/whois`, { action: 'enable' })
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: t('common.buttons.enable'),
                        html: response.text || t('domains.whois.whoisEnabled'),
                    }).then(() => {
                        router.push(`/${moduleLink(module)}/${id.value}`);
                    });
                })
                .catch((error: any) => {
                    Swal.fire({
                        icon: 'error',
                        title: t('common.confirm.title'),
                        html: error?.text || error?.error || 'Failed to enable whois privacy.',
                    });
                });
        }
    });
}

function disableWhois() {
    Swal.fire({
        title: t('domains.whois.disableTitle'),
        html: `<p>${t('domains.whois.disableMessage', { hostname: hostname.value })}</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('domains.whois.disableAndCancel'),
        confirmButtonColor: '#d33',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.whois.disablingWhois')}`,
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            fetchWrapper
                .post(`${baseUrl}/${moduleLink(module)}/${id.value}/whois`, { action: 'disableCancel' })
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: t('common.buttons.disable'),
                        html: response.text || t('domains.whois.whoisDisabled'),
                    }).then(() => {
                        router.push(`/${moduleLink(module)}/${id.value}`);
                    });
                })
                .catch((error: any) => {
                    Swal.fire({
                        icon: 'error',
                        title: t('common.confirm.title'),
                        html: error?.text || error?.error || 'Failed to disable whois privacy.',
                    });
                });
        }
    });
}

function loadWhois() {
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.contact.pleaseWait')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .get(`${baseUrl}/${moduleLink(module)}/${id.value}/whois`)
        .then((response) => {
            Swal.close();
            available.value = response.available;
            whoisCost.value = response.cost;
            currencySymbol.value = response.currencySymbol || '$';
            whoisPrivacy.value = response.whoisPrivacy || 'disabled';
            loadingDone.value = true;
        })
        .catch((error: any) => {
            Swal.fire({
                icon: 'error',
                html: error?.text || error?.error || 'Failed to load whois privacy info.',
            });
            loadingDone.value = true;
        });
}

loadWhois();
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <div class="w-100 b-radius mb-4 bg-white p-3" :style="{ 'border-left': '4px solid greenyellow' }">
                <p class="text-md m-0">
                    <i class="fas fa-lightbulb" style="color: greenyellow"></i>&nbsp; <b>Note:</b> &nbsp;{{ t('domains.whois.renewalNote', { cost: `<b>${currencySymbol}${whoisCost.toFixed(2)}</b>` }) }}
                </p>
            </div>
        </div>
    </div>
    <template v-if="!available && loadingDone">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>&nbsp; {{ t('domains.whois.notAvailable') }}
                </div>
            </div>
        </div>
    </template>
    <template v-else-if="whoisPrivacy === 'enabled' && loadingDone">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card b-radius">
                    <div class="card-header">
                        <h3 class="card-title text-lg"><i class="fas fa-user-secret"></i>&nbsp;{{ t('domains.whois.title') }}</h3>
                        <div class="card-tools m-0">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn-outline-custom px-2 py-1" data-toggle="tooltip" :title="t('domains.order.goBack')"><i class="fas fa-arrow-left text-sm"></i>&nbsp;{{ t('common.buttons.back') }}</router-link>
                        </div>
                    </div>
                    <div class="card-body text-center">
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i>&nbsp; {{ t('domains.whois.currentlyEnabled', { hostname }) }}
                        </div>
                        <button class="btn btn-danger mt-3" @click="disableWhois">
                            <i class="fas fa-times-circle"></i>&nbsp; {{ t('domains.whois.disableAndCancel') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else-if="loadingDone">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card b-radius">
                    <div class="card-header">
                        <h3 class="card-title text-lg"><i class="fas fa-address-card"></i>&nbsp;{{ t('domains.whois.title') }}</h3>
                        <div class="card-tools m-0">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn-outline-custom px-2 py-1" data-toggle="tooltip" :title="t('domains.order.goBack')"><i class="fas fa-arrow-left text-sm"></i>&nbsp;{{ t('common.buttons.back') }}</router-link>
                        </div>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="placeOrder">
                            <div class="form-group row">
                                <label class="col-md-2 col-form-label" for="hostname">{{ t('domains.whois.domain') }}</label>
                                <div class="col-sm-10 input-group"><input id="hostname" type="text" class="form-control form-control-sm" :value="hostname" disabled /></div>
                            </div>
                            <div id="whois_row" class="form-group row">
                                <label class="col-md-2 col-form-label" for="whois_cost">{{ t('domains.whois.whoisCost') }}</label>
                                <div class="col-sm-10 input-group input-group-sm">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text font-weight-bold">{{ currencySymbol }}</span>
                                    </div>
                                    <input id="whois_cost" type="text" class="form-control form-control-sm" :value="whoisCost.toFixed(2)" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-2 col-form-label" for="submit"></label>
                                <div class="col-sm-10 input-group input-group-sm">
                                    <input id="button-id-signup" type="submit" name="Submit" :value="t('domains.order.placeOrder')" class="btn btn-custom btn-sm px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title text-lg"><i class="fas fa-user-secret"></i>&nbsp;{{ t('domains.whois.contactPrivacy') }}</h4>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                    <div class="card-body">
                        <p>{{ t('domains.whois.contactPrivacyDescription1') }}</p>
                        <p>{{ t('domains.whois.contactPrivacyDescription2') }}</p>
                        <p>{{ t('domains.whois.contactPrivacyDescription3') }}</p>
                        <p>
                            {{ t('domains.whois.contactPrivacyAvailable', { cost: '' }) }} <span class="text-md text-green text-md">{{ currencySymbol }}{{ whoisCost.toFixed(2) }}</span>
                        </p>
                        <p>{{ t('domains.whois.enableNow') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped></style>
