<script setup lang="ts">
import { ref, computed, watch, onMounted, watchEffect } from 'vue';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { useSiteStore } from '@/stores/site.store';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ServiceType, ServiceTypes } from '@/types/view-service-common';
import { SearchDomainResult, DomainResult, Lookups, Suggestions, DomainFieldsResponse, DomainFields } from '@/types/domains';

const { t, n } = useI18n();
const module = 'domains';
const siteStore = useSiteStore();

watchEffect(() => {
    siteStore.setPageHeading(t('domains.order.pageTitle'));
    siteStore.setTitle(t('domains.order.pageTitle'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('domains.order.domainsList')],
        [`/${moduleLink(module)}/order`, t('domains.order.pageTitle')],
    ]);
});

const baseUrl = siteStore.getBaseUrl();
const route = useRoute();
const router = useRouter();
const hostname = ref('');
const whoisPrivacyCost = ref(0);
const whoisEnabled = ref<boolean>(false);
const domainResult = ref<DomainResult | null>(null);
const domainType = ref('register');
const lookups = ref<Lookups>({ items: {} });
const suggestions = ref<Suggestions>({ items: [] });
const packageInfo = ref<ServiceType | null>(null);
const errors = ref<string[]>([]);
const searchResponse = ref<SearchDomainResult | null>(null);
const services = ref<ServiceTypes>({});
const tldServices = ref({});
const domainFields = ref<DomainFields>({});
const termsAgreed = ref(false);
const domainInput = ref<HTMLInputElement | null>(null);
const domain = computed(() => route.params.domain as string);
const regType = computed(() => route.params.regType as string);
const display = ref('step1');
const currency = ref('USD');
const currencySymbol = ref('$');

const domainCost = computed<number>(() => {
    if (!domainResult.value) return 0;
    return Number(domainResult.value.status === 'taken' ? domainResult.value.raw.transfer : domainResult.value.raw.new);
});

const totalCost = computed<number>(() => {
    return whoisEnabled.value === true ? domainCost.value + whoisPrivacyCost.value : domainCost.value;
});

function formatCost(cost: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.value,
    }).format(cost);
}

function clearInput(): void {
    const input = domainInput.value;
    if (!input) return;
    const length = input.value.length;
    input.setSelectionRange(length, length);
}

// Delay helper
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Add something to given element placeholder
async function addToPlaceholder(toAdd: string, el: HTMLInputElement): Promise<void> {
    el.placeholder = (el.placeholder ?? '') + toAdd;
    // Delay between symbols "typing"
    await delay(200);
}

// Clear placeholder attribute in given element
function clearPlaceholder(el: HTMLInputElement): void {
    el.placeholder = '';
}

// Print one phrase
async function printPhrase(phrase: string, el: HTMLInputElement): Promise<void> {
    // Clear placeholder before typing next phrase
    clearPlaceholder(el);
    const letters: string[] = phrase.split('');
    for (let i = 0; i < letters.length; i++) {
        await addToPlaceholder(letters[i], el);
    }
    // Delay before starting next phrase "typing"
    await delay(2000);
}

// Print given phrases to element (sequentially)
async function printPhrases(phrases: string[], el: HTMLInputElement): Promise<void> {
    for (const phrase of phrases) {
        await printPhrase(phrase, el);
    }
}

// Start typing
async function runPhrases(): Promise<void> {
    const phrases: string[] = ['mydomain.com', 'techsupport.online', 'usdomain.us', 'networking.net', 'allcountrydomains.com.au', 'bizdomain.biz', 'giftdomain.gift', 'sarahclothes.fashion', 'grocery.shop', 'mydomain.com', 'techsupport.online', 'uscitizens.us', 'networking.net', 'allcountrydomains.com.au', 'yourbizdomain.biz', 'giftdomain.gift', 'sarahclothes.fashion', 'grocery.shop', 'mydomain.com', 'techsupport.online', 'usdomain.us', 'networking.net', 'allcountrydomains.com.au', 'yourbizdomain.biz', 'giftdomain.gift', 'sarah.fashion', 'grocery.shop', 'mydomain.com'];
    if (domainInput.value) {
        await printPhrases(phrases, domainInput.value);
    }
}

function getFormFields() {
    const formFields: Record<string, any> = {};
    for (const key in domainFields.value) {
        if (Object.prototype.hasOwnProperty.call(domainFields.value, key)) {
            formFields[key] = domainFields.value[key].value;
        }
    }
    formFields.hostname = domain.value;
    formFields.type = regType.value;
    return formFields;
}

function updateStep() {
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        [`/${moduleLink(module)}`, t('domains.order.domainsList')],
        [`/${moduleLink(module)}/order`, t('domains.order.pageTitle')],
    ]);
    if (typeof domain.value == 'undefined') {
        display.value = 'step1';
    } else {
        hostname.value = domain.value;
        if (searchResponse.value?.domain !== hostname.value) {
            console.log(`currently hostname is ${searchResponse.value?.domain}`, searchResponse.value?.domain);
            console.log(`new domain is ${hostname.value}`);
            searchDomain();
        }
        if (typeof regType.value == 'undefined') {
            display.value = 'step1b';
        }
        domainType.value = regType.value;
        siteStore.addBreadcrum(`/domains/order/${domain.value}/${regType.value}`, t('common.labels.details'));
        getDomainFields();
        display.value = 'step2';
    }
}

function goDetails() {
    display.value = 'step2';
}

function searchDomain() {
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.order.searchingDomain')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .post(`${baseUrl}/domains/search/${hostname.value}`)
        .then((response: SearchDomainResult) => {
            Swal.close();
            searchResponse.value = response;
            console.log('SEARCH Response:', response);
            domainResult.value = response.domain_result;
            suggestions.value = response.suggestions;
            lookups.value = response.lookups;
            errors.value = response.errors;
            domainType.value = response.domain_type;
            packageInfo.value = response.package_info;
            if (searchResponse.value.continue === false) {
                Swal.fire({
                    icon: 'error',
                    html: searchResponse.value.errors.join('<br>'),
                });
            }
        })
        .catch((error) => {
            Swal.close();
            console.log(error);
            let message = `${t('domains.order.gotError')} `;
            for (let idx = 0; idx < error.message.length; idx++) {
                message += `<br>${error.message[idx].text}`;
            }
            Swal.fire({
                icon: 'error',
                html: message,
            });
        });
}

function getDomainFields() {
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.order.loadingDomainFields')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .put(`${baseUrl}/domains/order`, {
            hostname: hostname.value,
            type: domainType.value,
        })
        .then((response: DomainFieldsResponse) => {
            Swal.close();
            console.log('PUT Response:', response);
            domainFields.value = response.domainFields;
        });
}

function goConfirm() {
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.order.searchingDomain')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });

    fetchWrapper
        .patch(`${baseUrl}/domains/order`, getFormFields())
        .then((response) => {
            Swal.close();
            console.log(response);
            display.value = 'step3';
        })
        .catch((error) => {
            Swal.close();
            console.log(error);
            let message = `${t('domains.order.gotError')} `;
            for (let idx = 0; idx < error.message.length; idx++) {
                message += `<br>${error.message[idx].text}`;
            }
            Swal.fire({
                icon: 'error',
                html: message,
            });
        });
}

function placeOrder() {
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.order.searchingDomain')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    console.log(getFormFields());
    fetchWrapper
        .post(`${baseUrl}/domains/order`, getFormFields())
        .then((response) => {
            Swal.close();
            console.log(response);
            router.push(`/cart/${response.iids.join(',')}`);
        })
        .catch((error) => {
            Swal.close();
            console.log(error);
            let message = `${t('domains.order.gotError')} `;
            for (let idx = 0; idx < error.message.length; idx++) {
                message += `<br>${error.message[idx].text}`;
            }
            Swal.fire({
                icon: 'error',
                html: message,
            });
        });
}

watch(
    () => [route.params.domain, route.params.regType],
    ([domainNew, regTypeNew], [domainOld, regTypeOld]) => {
        console.log(`domain old ${domainOld} new ${domainNew} regType old ${regTypeOld} new ${regTypeNew}`);
        updateStep();
    }
);

fetchWrapper.get(`${baseUrl}/domains/order`).then((response) => {
    console.log('GET Response:', response);
    whoisPrivacyCost.value = Number(response.whoisPrivacyCost);
    services.value = response.services;
    tldServices.value = response.tldServices;
});

onMounted(() => {
    domainInput.value?.focus();
    runPhrases();
    updateStep();
});
</script>

<template>
    <div v-if="!display || display === 'step1' || display == 'step1b'" class="row justify-content-center" :class="{ 'mt-5': !domainResult }">
        <div class="col-md-10 text-center">
            <h3 class="text-capitalize pb-2">{{ t('domains.order.findDomain') }}</h3>
            <form class="search-domain" @submit.prevent="searchDomain">
                <div class="form-group row justify-content-center">
                    <div class="col-md-5 input-group pb-2">
                        <input ref="domainInput" v-model="hostname" type="text" class="form-control" autofocus autocomplete="off" style="border-radius: 5px" @focus="clearInput" />
                    </div>
                </div>
                <div class="form-group row">
                    <div class="controls col-md-12" style="text-align: center">
                        <button type="submit" class="btn btn-custom mr-2 px-4 py-2 text-sm">{{ t('common.buttons.search') }}</button>
                        <a target="_blank" href="https://interserver.net/domains" class="btn btn-order px-3 py-2 text-sm">{{ t('domains.order.checkPrices') }}</a>
                    </div>
                </div>
            </form>
            <template v-if="domainResult">
                <div class="row my-4">
                    <template v-if="domainResult?.premium === 'yes'">
                        <template v-if="domainResult?.status === 'available'">
                            <div class="info-success-box b-radius mx-2">
                                <div class="text-md ml-2" style="position: relative; top: 4px">
                                    <span class="text-warning text-bold">{{ t('domains.order.premiumAvailable', { domain: domainResult?.domain, email: 'sales@interserver.net', cost: domainResult?.cost }) }}</span>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="info-danger-box b-radius mx-2">
                                <div class="text-md ml-2" style="position: relative; top: 4px">
                                    <span class="text-red text-bold">{{ t('domains.order.premiumTaken', { domain: domainResult?.domain, email: 'sales@interserver.net', cost: domainResult?.cost }) }}</span>
                                </div>
                            </div>
                        </template>
                    </template>
                    <template v-else>
                        <template v-if="domainResult?.status === 'available'">
                            <div class="info-success-box b-radius mx-2">
                                <div class="text-md ml-2" style="position: relative; top: 4px">
                                    <span class="text-green text-bold">{{ t('domains.order.available', { domain: domainResult?.domain, cost: domainResult?.new, renewal: domainResult?.renewal }) }}</span>
                                </div>
                                <router-link :to="'/domains/order/' + domainResult?.domain + '/register'" class="btn btn-green ml-2 px-4 py-2 text-sm">{{ t('domains.order.register') }}</router-link>
                            </div>
                        </template>
                        <template v-else-if="domainResult?.status === 'taken'">
                            <div class="info-danger-box b-radius mx-2">
                                <div class="text-md ml-2" style="position: relative; top: 4px">
                                    <span class="text-red text-bold">{{ t('domains.order.taken', { domain: domainResult?.domain, cost: domainResult?.transfer, renewal: domainResult?.renewal }) }}</span>
                                </div>
                                <router-link :to="'/domains/order/' + domainResult?.domain + '/transfer'" class="btn btn-yellow ml-2 px-4 py-2 text-sm">{{ t('domains.order.transfer') }}</router-link>
                            </div>
                        </template>
                    </template>
                </div>
            </template>

            <div v-if="(suggestions && suggestions.items && suggestions.items.length > 0) || (lookups && lookups.items && Object.keys(lookups.items).length > 0)" class="row">
                <div class="col-md-6">
                    <div class="card card-outline card-secondary shadow-none">
                        <div class="card-body">
                            <table class="table">
                                <tr v-for="(suggestion, k) in suggestions.items" :key="k">
                                    <td v-if="suggestion.premium === 'yes'" class="position-relative">
                                        <div class="ribbon-wrapper">
                                            <div class="ribbon bg-success text-xs">{{ t('domains.order.premium') }}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="text-lg">{{ suggestion.domain }}</span>
                                        <div v-if="suggestion.renewal">({{ t('domains.order.renewAt', { cost: suggestion.renewal }) }})</div>
                                    </td>
                                    <td>{{ suggestion.cost }}</td>
                                    <td>
                                        <template v-if="suggestion.premium === 'yes'">
                                            <a href="mailto:sales@interserver.net" class="btn btn-primary btn-sm">{{ t('domains.order.contactSales') }}</a>
                                        </template>
                                        <template v-else>
                                            <template v-if="suggestion.status === 'available'">
                                                <router-link :to="'/domains/order/' + suggestion.domain + '/register'" class="btn btn-green px-3 py-2 text-sm">{{ t('domains.order.register') }}</router-link>
                                            </template>
                                            <template v-else-if="suggestion.status === 'taken'">
                                                <router-link :to="'/domains/order/' + suggestion.domain + '/transfer'" class="btn btn-yellow px-3 py-2 text-sm">{{ t('domains.order.transfer') }}</router-link>
                                            </template>
                                            <template v-else>
                                                <router-link :to="'/domains/order/' + suggestion.domain + '/undefined'" class="btn btn-green px-3 py-2 text-sm">{{ suggestion.status }}</router-link>
                                            </template>
                                        </template>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card card-outline card-secondary shadow-none">
                        <div class="card-body">
                            <table class="table">
                                <tr v-for="lookup in lookups.items" :key="lookup.domain">
                                    <td :class="{ 'position-relative': lookup.premium === 'yes' }">
                                        <div v-if="lookup.premium === 'yes'" class="ribbon-wrapper">
                                            <div class="ribbon bg-success text-xs">{{ t('domains.order.premium') }}</div>
                                        </div>
                                        <span class="text-lg">{{ lookup.domain }}</span>
                                        <div v-if="lookup.renewal">({{ t('domains.order.renewAt', { cost: lookup.renewal }) }})</div>
                                    </td>
                                    <td>{{ lookup.cost }}</td>
                                    <td>
                                        <template v-if="lookup.premium === 'yes'">
                                            <a class="btn btn-order px-3 py-2 text-sm" href="mailto:sales@interserver.net">{{ t('domains.order.contactSales') }}</a>
                                        </template>
                                        <template v-else>
                                            <template v-if="lookup.status === 'available'">
                                                <router-link :to="'/domains/order/' + lookup.domain + '/register'" class="btn btn-green px-3 py-2 text-sm">{{ t('domains.order.register') }}</router-link>
                                            </template>
                                            <template v-else-if="lookup.status === 'taken'">
                                                <router-link :to="'/domains/order/' + lookup.domain + '/transfer'" class="btn btn-yellow px-3 py-2 text-sm">{{ t('domains.order.transfer') }}</router-link>
                                            </template>
                                            <template v-else>
                                                <router-link :to="'/domains/order/' + lookup.domain + '/undefined'" class="btn btn-green px-3 py-2 text-sm">{{ lookup.status }}</router-link>
                                            </template>
                                        </template>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <template v-else-if="display == 'step2'">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <h4 class="mb-4">{{ domainResult?.status === 'taken' ? t('domains.order.transferDomain', { hostname }) : t('domains.order.registerDomain', { hostname }) }}</h4>
            </div>
            <div class="col-md-4">&nbsp;&nbsp;</div>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><font-awesome-icon :icon="['fas', 'address-card']" />&nbsp;{{ t('domains.order.contactInformation') }}</h3>
                            <div class="card-tools float-right">
                                <router-link :to="'/domains/order/' + hostname" class="btn btn-custom btn-sm" data-toggle="tooltip" :title="t('domains.order.goBack')"><font-awesome-icon :icon="['fas', 'arrow-left']" />&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form method="POST" class="contact-form" @submit.prevent="goConfirm">
                            <template v-if="whoisPrivacyCost">
                                <div class="form-group row">
                                    <label for="create_as" class="col-sm-5 col-form-label"> {{ t('domains.order.whoisPrivacyLabel', { cost: whoisPrivacyCost }) }} </label>
                                    <div class="controls col-sm-7">
                                        <div class="form-group clearfix">
                                            <div class="d-inline">
                                                <label><input v-model="whoisEnabled" type="radio" :value="true" /> {{ t('domains.order.enabled') }}</label>
                                            </div>
                                            <div class="d-inline px-2">
                                                <label><input v-model="whoisEnabled" type="radio" :value="false" /> {{ t('domains.order.disabled') }}</label>
                                            </div>
                                            <br />
                                            <div class="d-inline px-2">
                                                <span
                                                    style="cursor: pointer; text-decoration: underline; text-decoration-style: dotted"
                                                    data-toggle="popover"
                                                    data-container="body"
                                                    data-html="true"
                                                    data-content="<p>Whois Privacy hides the identity of a Registrant when a user does a WHOIS lookup on that Registrant's domain.</p>
                  <p>The benefit of having Whois Privacy is that the Registrant's identity, including home address, phone number, and email address, is shielded from spammers, identity thieves and scammers.</p>
                  <p>When Registrants enable the Whois Privacy service, masked contact information appears in the public WHOIS database.</p>"
                                                    title="WHOIS">
                                                    {{ t('domains.order.whatIsWhoisPrivacy') }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </template>
                            <div v-for="(domainField, fieldName) in domainFields" :key="fieldName" class="form-group row">
                                <label v-if="domainField.label" class="col-sm-3 col-form-label">{{ domainField.label }}<span v-if="domainField.required" class="text-danger">*</span> </label>
                                <div class="col-sm-9 input-group">
                                    <input v-if="domainField.input === 'text'" v-model="domainField.value" type="text" :name="fieldName as string" class="form-control" />
                                    <select v-else-if="domainField.input && domainField.input[0] === 'select'" v-model="domainField.value" :name="fieldName as string" class="form-control select2">
                                        <option v-for="(displayName, val, index) in domainField.input[1]" :key="index" :value="val">{{ displayName }}</option>
                                    </select>
                                    <div v-if="domainField.tip" class="input-group-append">
                                        <span style="cursor: pointer" class="input-group-text" data-toggle="popover" data-container="body" :data-html="true" :data-content="'<p style=\'text-align: left;\'>' + domainField.tip + '</p>'" :title="'<div style=\'text-align: left; font-weight: bold;\'>' + 'Tip for ' + domainField.label + '</div>'">
                                            <font-awesome-icon :icon="['fas', 'question']" class="text-info" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center">
                                    <input type="submit" name="Submit" :value="t('domains.order.continue')" class="btn btn-order px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2"><font-awesome-icon :icon="['fas', 'shopping-cart']" />&nbsp;{{ t('domains.order.orderSummary') }}</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><font-awesome-icon :icon="['fas', 'minus']" /></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body text-md">
                        <div class="row mb-3">
                            <div class="col-md-8">{{ packageInfo?.services_name }}</div>
                            <div class="col text-bold text-right">{{ t('domains.order.oneYear') }}</div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-8">{{ domainResult?.domain }}</div>
                            <div class="col text-bold text-right">
                                {{ formatCost(domainCost) }}
                            </div>
                        </div>
                        <div v-show="whoisEnabled" class="whois-row row mb-3">
                            <div class="col-md-8">{{ t('domains.view.whoisPrivacy') }}</div>
                            <div class="col text-bold text-right">{{ formatCost(whoisPrivacyCost) }}</div>
                        </div>
                        <hr />
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">{{ t('domains.order.total') }}</div>
                            <div class="col text-bold total_cost text-right text-lg">{{ formatCost(totalCost) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else-if="display == 'step3'">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2"><font-awesome-icon :icon="['fas', 'shopping-cart']" />&nbsp;{{ t('domains.order.orderSummary') }}</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><font-awesome-icon :icon="['fas', 'minus']" /></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form method="POST" class="contact-form" :action="'domain_order?hostname=' + hostname">
                            <table class="table-sm table-bordered table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="text-md float-left" style="position: relative; top: 5px">{{ packageInfo?.services_name }}</div>
                                        </th>
                                        <th><div class="text-md text-bold">{{ t('domains.order.oneYear') }}</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><div class="text-md">{{ t('domains.order.orderType') }}</div></td>
                                        <td>
                                            <div class="text-bold text-md">{{ domainResult?.status === 'taken' ? t('domains.order.domainTransfer') : t('domains.order.domainRegister') }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">{{ domainResult?.domain }}</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ formatCost(domainCost) }}</div>
                                        </td>
                                    </tr>
                                    <tr v-show="whoisEnabled">
                                        <td><div class="text-md">{{ t('domains.view.whoisPrivacy') }}</div></td>
                                        <td>
                                            <div class="text-bold text-md">{{ formatCost(whoisPrivacyCost) }}</div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th><div class="text-lg">{{ t('domains.order.total') }}</div></th>
                                        <th>
                                            <div class="text-lg">
                                                <div class="text-bold total_cost text-lg">{{ formatCost(totalCost) }}</div>
                                            </div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <hr />
                            <div class="p-1">
                                <h4 class="text-center"><u>{{ t('domains.order.agreeToTerms') }}</u></h4>
                                <p class="text-center text-sm">
                                    {{ t('domains.order.subscriptionAutoRenew', { cost: domainCost }) }}
                                </p>
                                <p class="text-muted text-xs">By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <br /><b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank"> Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank"> Privacy Policy</a>.</p>
                                <div class="icheck-success text-bold text-center">
                                    <input id="tos" v-model="termsAgreed" type="checkbox" style="margin: 0 5px; display: inline" value="yes" />
                                    <label for="tos" class="d-inline text-center"> {{ t('domains.order.agreeCheckbox') }} </label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center">
                                    <button type="button" class="btn btn-custom btn-sm mr-3 py-2" name="update_values" @click="goDetails"><font-awesome-icon :icon="['fas', 'arrow-left']" />&nbsp;{{ t('domains.order.goBack') }}</button>
                                    <button :disabled="!termsAgreed" class="btn btn-sm btn-green px-3 py-2" @click.prevent="placeOrder">{{ t('domains.order.placeOrder') }}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
<style scoped></style>
