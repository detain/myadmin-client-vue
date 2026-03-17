<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import { useDomainStore } from '@/stores/domain.store';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2';

const { t } = useI18n();
const props = defineProps<{
    id: number;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const router = useRouter();
const module: string = 'domains';
const domainStore = useDomainStore();
const { serviceInfo, whoisPrivacy: storeWhoisPrivacy } = storeToRefs(domainStore);

const renewCost = ref(0);
const whoisCost = ref(0);
const selectedWhoisPrivacy = ref('disable');
const currencySymbol = ref('$');
const currency = ref('USD');
const expiryDate = ref('');
const whoisAvailable = ref(false);
const alreadyInvoiced = ref(false);
const invoicePaid = ref(false);
const loadingDone = ref(false);

const renewCostFormatted = computed(() => {
    return renewCost.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});
const whoisCostFormatted = computed(() => {
    return whoisCost.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});
const totalCost = computed(() => {
    let total = renewCost.value;
    if (whoisAvailable.value && selectedWhoisPrivacy.value === 'enable') {
        total += whoisCost.value;
    }
    return total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

function loadRenew() {
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.renew.loadingRenewalInfo')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .get(`${baseUrl}/${moduleLink(module)}/${props.id}/renew`)
        .then((response) => {
            Swal.close();
            loadingDone.value = true;
            renewCost.value = response.renewCost;
            whoisCost.value = response.whoisCost;
            whoisAvailable.value = response.whoisAvailable;
            currency.value = response.currency;
            currencySymbol.value = response.currencySymbol;
            expiryDate.value = response.expiryDate || '';
            alreadyInvoiced.value = response.alreadyInvoiced;
            invoicePaid.value = response.invoicePaid;
            if (storeWhoisPrivacy.value === 'enabled') {
                selectedWhoisPrivacy.value = 'enable';
            }
        })
        .catch((error: any) => {
            Swal.fire({
                icon: 'error',
                html: error?.text || error?.error || 'Failed to load renewal information.',
            });
            loadingDone.value = true;
        });
}

function placeOrder() {
    Swal.fire({
        title: t('domains.renew.confirmRenewal'),
        html: `<p>${t('domains.renew.confirmRenewalMessage', { cost: `<b>${currencySymbol.value}${totalCost.value}</b>` })}</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: t('domains.order.placeOrder'),
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.renew.placingRenewalOrder')}`,
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            fetchWrapper
                .post(`${baseUrl}/${moduleLink(module)}/${props.id}/renew`, {
                    whois_privacy: selectedWhoisPrivacy.value,
                })
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: t('domains.renew.renewalOrderPlaced'),
                        html: response.text || t('domains.renew.renewalOrderSuccess'),
                        confirmButtonText: t('domains.renew.goToPayment'),
                    }).then(() => {
                        if (response.payUrl) {
                            window.location.href = response.payUrl;
                        } else {
                            router.push(`/${moduleLink(module)}/${props.id}`);
                        }
                    });
                })
                .catch((error: any) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        html: error?.text || error?.error || 'Failed to place renewal order.',
                    });
                });
        }
    });
}

function renewCalculate() {
    // Total cost is computed reactively via totalCost
}

loadRenew();
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card w-100 mb-2 bg-white p-2 shadow-none" :style="{ 'border-left': '4px solid greenyellow', display: 'block ruby' }">
                <div class="text-md m-0">
                    <i class="fas fa-lightbulb" style="color: greenyellow"></i>&nbsp;<b>Tip #1:</b>&nbsp;{{ t('domains.renew.tip1') }}
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
            <div class="card w-100 mb-2 bg-white p-2 shadow-none" :style="{ 'border-left': '4px solid greenyellow', display: 'block ruby' }">
                <div class="text-md m-0">
                    <i class="fas fa-lightbulb" style="color: greenyellow"></i>&nbsp;<b>Tip #2:</b>&nbsp;{{ t('domains.renew.tip2') }}
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
            <template v-if="whoisAvailable">
                <div class="card w-100 mb-2 bg-white p-2 shadow-none" :style="{ 'border-left': '4px solid greenyellow', display: 'block ruby' }">
                    <div class="text-md m-0">
                        <i class="fas fa-lightbulb" style="color: greenyellow"></i>&nbsp;<b>Tip #3:</b>&nbsp;{{ t('domains.renew.tip3') }}
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <div class="row justify-content-center mt-3">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title text-lg"><i class="fas fa-address-card"></i>&nbsp;{{ t('domains.renew.title') }}</h3>
                    <div class="card-tools m-0">
                        <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn-outline-custom px-2 py-1" data-toggle="tooltip" :title="t('domains.order.goBack')"><i class="fas fa-arrow-left text-sm"></i>&nbsp;{{ t('common.buttons.back') }}</router-link>
                    </div>
                </div>
                <div class="card-body">
                    <template v-if="alreadyInvoiced && invoicePaid">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle"></i>&nbsp; {{ t('domains.renew.alreadyRenewed') }}
                        </div>
                    </template>
                    <template v-else-if="alreadyInvoiced && !invoicePaid">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle"></i>&nbsp; {{ t('domains.renew.payExistingInvoice') }}
                        </div>
                    </template>
                    <form v-else @submit.prevent="placeOrder">
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label" for="domain">{{ t('domains.renew.domain') }}</label>
                            <div class="col-sm-9 input-group">
                                <input id="hostname" type="text" class="form-control form-control-sm" name="domain" :value="serviceInfo.domain_hostname" disabled />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label" for="expiry_date">{{ t('domains.renew.expiryDate') }}</label>
                            <div class="col-sm-9 input-group">
                                <input id="expiry_date" type="text" class="form-control form-control-sm" name="expiry_date" :value="expiryDate" disabled />
                            </div>
                        </div>
                        <template v-if="whoisAvailable">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="whois_privacy">{{ t('domains.view.whoisPrivacy') }}</label>
                                <div class="col-sm-9 input-group">
                                    <select id="whois_privacy" v-model="selectedWhoisPrivacy" name="whois_privacy" class="form-control form-control-sm select2bs4" dir="rtl">
                                        <option value="enable">{{ t('common.buttons.enable') }}</option>
                                        <option value="disable">{{ t('common.buttons.disable') }}</option>
                                    </select>
                                </div>
                            </div>
                        </template>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label" for="renew_cost">{{ t('domains.renew.renewCost') }}</label>
                            <div class="col-sm-9 input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">{{ currencySymbol }}</span>
                                </div>
                                <input id="renew_cost" type="text" class="form-control form-control-sm" name="renew_cost" :value="renewCostFormatted" disabled />
                            </div>
                        </div>
                        <div v-if="whoisAvailable" id="whois_row" class="form-group row">
                            <label class="col-md-3 col-form-label" for="whois_cost">{{ t('domains.renew.whoisCost') }}</label>
                            <div class="col-sm-9 input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">{{ currencySymbol }}</span>
                                </div>
                                <input id="whois_cost" type="text" class="form-control form-control-sm" name="whois_cost" :value="selectedWhoisPrivacy === 'enable' ? whoisCostFormatted : '0.00'" disabled />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label" for="total_cost">{{ t('domains.renew.totalCost') }}</label>
                            <div class="col-sm-9 input-group input-group-sm">
                                <div class="input-group-prepend">
                                    <span class="input-group-text font-weight-bold">{{ currencySymbol }}</span>
                                </div>
                                <input id="total_cost" type="text" class="form-control" name="total_cost" :value="totalCost" disabled />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label" for="submit"></label>
                            <div class="col-sm-9 input-group input-group-sm">
                                <input type="submit" name="Submit" :value="t('domains.order.placeOrder')" class="btn btn-custom btn-sm py-2" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
