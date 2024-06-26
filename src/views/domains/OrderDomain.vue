<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { moduleLink } from '@/helpers/moduleLink.ts';

import { useSiteStore } from '@/stores/site.store.ts';

import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ServiceType, ServiceTypes } from '@/types/view-service-common';
import { SearchDomainResult, DomainResult, Lookups, LookupsOld, Suggestions, SuggestionRow, DomainFieldsResponse, DomainFields, DomainField, DomainFieldSelectValues } from '@/types/domains';
const module = 'domains';
const siteStore = useSiteStore();
siteStore.setPageHeading('Order Domain');
siteStore.setTitle('Order Domain');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/' + moduleLink(module), 'Domains List'],
    ['/' + moduleLink(module) + '/order', 'Order Domain'],
]);
const baseUrl = siteStore.getBaseUrl();
const route = useRoute();
const router = useRouter();
const hostname = ref('');
const ima = ref('client');
const custid = ref('2773');
const whoisPrivacyCost = ref(0);
const whoisPrivacy = ref('disable');
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
const domainCost = ref(0);
const termsAgreed = ref(false);
const domain = computed(() => {
    return route.params.domain as string;
});
const regType = computed(() => {
    return route.params.regType as string;
});
const display = ref('step1');

function updateStep() {
    siteStore.setBreadcrums([
        ['/home', 'Home'],
        ['/' + moduleLink(module), 'Domains List'],
        ['/' + moduleLink(module) + '/order', 'Order Domain'],
    ]);
    if (typeof domain.value == 'undefined') {
        display.value = 'step1';
    } else {
        hostname.value = domain.value;
        siteStore.addBreadcrum('/domains/order/' + domain.value, 'Domain Search');
        if (searchResponse.value?.domain !== hostname.value) {
            console.log('currently hostname is ' + searchResponse.value?.domain);
            console.log(searchResponse.value?.domain);
            console.log('new domain is ' + hostname.value);
            searchDomain();
        }
        if (typeof regType.value == 'undefined') {
            display.value = 'step1b';
        }
        domainType.value = regType.value;
        siteStore.addBreadcrum('/domains/order/' + domain.value + '/' + regType.value, 'Domain Details');
        getDomainFields();
        display.value = 'step2';
    }
}

watch([domain, regType], ([domainNew, regTypeNew], [domainOld, regTypeOld]) => {
    console.log('domain old ' + domainOld + ' new ' + domainNew + ' regType old ' + regTypeOld + ' new ' + regTypeNew);
    updateStep();
});

fetchWrapper.get(baseUrl + '/domains/order').then((response) => {
    console.log('GET Response:');
    console.log(response);
    whoisPrivacyCost.value = response.whoisPrivacyCost;
    services.value = response.services;
    tldServices.value = response.tldServices;
});

function searchDomain() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait! Searching for this domain name.',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .put(baseUrl + '/domains/order', {
            hostname: hostname.value,
        })
        .then((response: SearchDomainResult) => {
            Swal.close();
            searchResponse.value = response;
            console.log('PUT Response:');
            console.log(response);
            domainResult.value = response.domain_result;
            suggestions.value = response.suggestions;
            lookups.value = response.lookups;
            errors.value = response.errors;
            domainType.value = response.domain_type;
            packageInfo.value = response.package_info;
        });
}

function clearInput() {}

function getDomainFields() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait! Loading Domain Fields.',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .patch(baseUrl + '/domains/order', {
            hostname: hostname.value,
            type: domainType.value,
        })
        .then((response: DomainFieldsResponse) => {
            Swal.close();
            console.log('PATCH Response:');
            console.log(response);
            domainFields.value = response.domainFields;
        });
}

function edit_form() {}

function placeOrder() {}

updateStep();
</script>

<template>
    <div v-if="!display || display === 'step1' || display == 'step1b'" class="row justify-content-center" :class="{ 'mt-5': !domainResult }">
        <div class="col-md-10 text-center">
            <h3 class="text-capitalize pb-2">Find your domain and check availability.</h3>
            <form @submit.prevent="router.push(`/domains/order/${hostname}`)" class="search-domain">
                <div class="form-group row justify-content-center">
                    <div class="col-md-5 input-group pb-2">
                        <input ref="domainInput" v-model="hostname" type="text" class="form-control" autofocus @focus="clearInput" autocomplete="off" style="border-radius: 5px" />
                    </div>
                </div>
                <div class="form-group row">
                    <div class="controls col-md-12" style="text-align: center">
                        <button type="submit" class="btn btn-custom mr-2 px-4 py-2 text-sm">Search</button>
                        <a target="_blank" href="https://interserver.net/domains" class="btn btn-order px-3 py-2 text-sm">Check Prices</a>
                    </div>
                </div>
            </form>
            <template v-if="domainResult">
                <div class="row my-4">
                    <template v-if="domainResult?.premium === 'yes'">
                        <template v-if="domainResult?.status === 'available'">
                            <div class="info-success-box b-radius mx-2">
                                <div class="text-md ml-2" style="position: relative; top: 4px">
                                    <span class="text-warning text-bold">Yes!</span> your domain <b>{{ domainResult?.domain }}</b> is available and it's a premium domain. Automatic registration is disabled. Email <a class="text-primary" href="mailto:sales@interserver.net">sales@interserver.net</a> if you would like to purchase this domain for {{ domainResult?.cost }} per year
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="info-danger-box b-radius mx-2">
                                <div class="text-md ml-2" style="position: relative; top: 4px">
                                    <span class="text-red text-bold">Sorry! </span> your domain <b>{{ domainResult?.domain }}</b> already taken! You already own it ? can transfer it and a it's premium domain. Automatic registration is disabled. Email <a class="text-primary" href="mailto:sales@interserver.net">sales@interserver.net</a> if you would like to purchase this domain for {{ domainResult?.cost }} per year.
                                </div>
                            </div>
                        </template>
                    </template>
                    <template v-else>
                        <template v-if="domainResult?.status === 'available'">
                            <div class="info-success-box b-radius mx-2">
                                <div class="text-md ml-2" style="position: relative; top: 4px">
                                    <span class="text-green text-bold">Yes!</span> your domain <b>{{ domainResult?.domain }}</b> is available! you can register it for {{ domainResult?.new }}. Renewal cost will be {{ domainResult?.renewal }}.
                                </div>
                                <router-link :to="'/' + moduleLink(module) + '/domains/order/' + domainResult?.domain + '/register'" class="btn btn-green ml-2 px-4 py-2 text-sm">Register</router-link>
                            </div>
                        </template>
                        <template v-else-if="domainResult?.status === 'taken'">
                            <div class="info-danger-box b-radius mx-2">
                                <div class="text-md ml-2" style="position: relative; top: 4px">
                                    <span class="text-red text-bold">Sorry!</span> Your Domain <b>{{ domainResult?.domain }}</b> is already taken! You already own it ? You can transfer it for {{ domainResult?.transfer }}. Renewal cost will be {{ domainResult?.renewal }}.
                                </div>
                                <router-link :to="'/' + moduleLink(module) + '/domains/order/' + domainResult?.domain + '/transfer'" class="btn btn-yellow ml-2 px-4 py-2 text-sm">Transfer</router-link>
                            </div>
                        </template>
                    </template>
                </div>
            </template>

            <div v-if="(suggestions && suggestions.items) || (lookups && lookups.items)" class="row">
                <div class="col-md-6">
                    <div class="card card-outline card-secondary shadow-none">
                        <div class="card-body">
                            <table class="table">
                                <tr v-for="(suggestion, k) in suggestions.items" :key="k">
                                    <td v-if="suggestion.premium === 'yes'" class="position-relative">
                                        <div class="ribbon-wrapper">
                                            <div class="ribbon bg-success text-xs">Premium</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="text-lg">{{ suggestion.domain }}</span>
                                        <div v-if="suggestion.renewal">(Renew @ {{ suggestion.renewal }})</div>
                                    </td>
                                    <td>{{ suggestion.cost }}</td>
                                    <td>
                                        <template v-if="suggestion.premium === 'yes'">
                                            <a href="mailto:sales@interserver.net" class="btn btn-primary btn-sm">Contact Sales</a>
                                        </template>
                                        <template v-else>
                                            <template v-if="suggestion.status === 'available'">
                                                <router-link :to="'/' + moduleLink(module) + '/domains/order/' + suggestion.domain + '/register'" class="btn btn-green px-3 py-2 text-sm">Register</router-link>
                                            </template>
                                            <template v-else-if="suggestion.status === 'taken'">
                                                <router-link :to="'/' + moduleLink(module) + '/domains/order/' + suggestion.domain + '/transfer'" class="btn btn-yellow px-3 py-2 text-sm">Transfer</router-link>
                                            </template>
                                            <template v-else>
                                                <router-link :to="'/' + moduleLink(module) + '/domains/order/' + suggestion.domain + '/undefined'" class="btn btn-green px-3 py-2 text-sm">{{ suggestion.status }}</router-link>
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
                                            <div class="ribbon bg-success text-xs">Premium</div>
                                        </div>
                                        <span class="text-lg">{{ lookup.domain }}</span>
                                        <div v-if="lookup.renewal">(Renew @ {{ lookup.renewal }})</div>
                                    </td>
                                    <td>{{ lookup.cost }}</td>
                                    <td>
                                        <template v-if="lookup.premium === 'yes'">
                                            <a class="btn btn-order px-3 py-2 text-sm" href="mailto:sales@interserver.net">Contact Sales</a>
                                        </template>
                                        <template v-else>
                                            <template v-if="lookup.status === 'available'">
                                                <router-link :to="'/' + moduleLink(module) + '/domains/order/' + lookup.domain + '/register'" class="btn btn-green px-3 py-2 text-sm">Register</router-link>
                                            </template>
                                            <template v-else-if="lookup.status === 'taken'">
                                                <router-link :to="'/' + moduleLink(module) + '/domains/order/' + lookup.domain + '/transfer'" class="btn btn-yellow px-3 py-2 text-sm">Transfer</router-link>
                                            </template>
                                            <template v-else>
                                                <router-link :to="'/' + moduleLink(module) + '/domains/order/' + lookup.domain + '/undefined'" class="btn btn-green px-3 py-2 text-sm">{{ lookup.status }}</router-link>
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
                <h4 class="mb-4">{{ domainResult?.status === 'taken' ? 'Transfer' : 'Register' }} Domain ({{ hostname }})</h4>
            </div>
            <div class="col-md-4">&nbsp;&nbsp;</div>
        </div>
        <!-- <h4 class="text-center mb-4">{{ domainResult?.status === 'taken' ? 'Transfer' : 'Register' }} Domain ({{ hostname }})</h4> -->
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-address-card">&nbsp;</i>Contact Information</h3>
                            <div class="card-tools float-right">
                                <router-link :to="'/' + moduleLink(module) + '/domains/order/' + hostname" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form method="POST" class="contact-form" :action="'domain_order?hostname=' + hostname">
                            <template v-if="whoisPrivacyCost">
                                <div class="form-group row">
                                    <label for="create_as" class="col-sm-5 col-form-label"> Whois Privacy for {{ whoisPrivacyCost }} / year </label>
                                    <div class="controls col-sm-7">
                                        <div class="form-group clearfix">
                                            <div class="icheck-success d-inline">
                                                <input id="enabled" type="radio" class="whois_radio" name="whois_privacy" value="enable" v-model="whoisPrivacy" />
                                                <label for="enabled">Enabled</label>
                                            </div>
                                            <div class="icheck-success d-inline px-2">
                                                <input id="disabled" type="radio" class="whois_radio" name="whois_privacy" value="disable" checked v-model="whoisPrivacy" />
                                                <label for="disabled">Disabled</label>
                                            </div>
                                            <br />
                                            <div class="d-inline px-2">
                                                <span
                                                    style="cursor: pointer; text-decoration: underline; text-decoration-style: dotted"
                                                    data-toggle="popover"
                                                    data-container="body"
                                                    data-html="true"
                                                    data-content="<p>Whois Privacy hides the identity of a Registrant when a user does a WHOIS lookup on that Registrant’s domain.</p>
                  <p>The benefit of having Whois Privacy is that the Registrant’s identity, including home address, phone number, and email address, is shielded from spammers, identity thieves and scammers.</p>
                  <p>When Registrants enable the Whois Privacy service, masked contact information appears in the public WHOIS database.</p>"
                                                    title="WHOIS">
                                                    What is this Whois Privacy?
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </template>
                            <div v-for="(domainField, fieldName) in domainFields" :key="fieldName" class="form-group row">
                                <label v-if="domainField.label" class="col-sm-3 col-form-label">
                                    {{ domainField.label }}
                                    <span v-if="domainField.required" class="text-danger">*</span>
                                </label>
                                <div class="col-sm-9 input-group">
                                    <input v-if="domainField.input === 'text'" type="text" :name="fieldName as string" class="form-control" :value="domainField.value" />
                                    <select v-else-if="domainField.input && domainField.input[0] === 'select'" :name="fieldName as string" class="form-control select2">
                                        <option v-for="(displayName, val, index) in domainField.input[1]" :key="index" :value="val" :selected="domainField.value === val">{{ displayName }}</option>
                                    </select>
                                    <div v-if="domainField.tip" class="input-group-append">
                                        <span style="cursor: pointer" class="input-group-text" data-toggle="popover" data-container="body" :data-html="true" :data-content="'<p style=\'text-align: left;\'>' + domainField.tip + '</p>'" :title="'<div style=\'text-align: left; font-weight: bold;\'>' + 'Tip for ' + domainField.label + '</div>'">
                                            <i class="fa text-info fa-question"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-order px-3 py-2 text-sm" />
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
                            <h4 class="card-title py-2"><i class="fa fa-shopping-cart">&nbsp;</i>Order Summary</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body text-md">
                        <div class="row mb-3">
                            <div class="col-md-8">{{ packageInfo?.services_name }}</div>
                            <div class="col text-bold text-right">1 Year</div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-8">{{ domainResult?.domain }}</div>
                            <div class="col text-bold text-right">
                                {{ domainResult?.status == 'taken' ? domainResult?.transfer : domainResult?.new }}
                            </div>
                        </div>
                        <div class="whois-row row d-none mb-3">
                            <div class="col-md-8">Whois Privacy</div>
                            <div class="col text-bold text-right">{{ whoisPrivacyCost }}</div>
                        </div>
                        <hr />
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div class="col text-bold total_cost text-right text-lg">
                                {{ domainResult?.status == 'taken' ? domainResult?.transfer : domainResult?.new }}
                            </div>
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
                            <h4 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form method="POST" class="contact-form" :action="'domain_order?hostname=' + hostname">
                            <table class="table-sm table-bordered table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="text-md float-left" style="position: relative; top: 5px">
                                                {{ packageInfo?.services_name }}
                                            </div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" @click="edit_form" data-toggle="tooltip" title="Edit details"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div class="text-md text-bold">1 Year</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="text-md">Order Type</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">
                                                {{ domainResult?.status === 'taken' ? 'Domain Transfer' : 'Domain Register' }}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">{{ domainResult?.domain }}</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ domainResult?.status === 'taken' ? domainResult?.transfer : domainResult?.new }}</div>
                                        </td>
                                    </tr>
                                    <template v-if="whoisPrivacy === 'enable'">
                                        <tr>
                                            <td>
                                                <div class="text-md">Whois Privacy</div>
                                            </td>
                                            <td>
                                                <div class="text-bold text-md">{{ whoisPrivacyCost }}</div>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>
                                            <div class="text-lg">Total</div>
                                        </th>
                                        <th>
                                            <div class="text-lg">
                                                <div class="text-bold total_cost text-lg">{{ domainResult?.status === 'taken' ? domainResult?.transfer : domainResult?.new }}</div>
                                            </div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <hr />
                            <div class="p-1">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">
                                    The subscription will automatically renew after <b>every year at</b>
                                    <span class="text-bold renew_cost">{{ domainCost }}</span>
                                    until canceled.
                                </p>
                                <p class="text-muted text-xs">By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <br /><b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank"> Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank"> Privacy Policy</a>.</p>
                                <div class="icheck-success text-bold text-center">
                                    <input type="checkbox" v-model="termsAgreed" id="tos" style="margin: 0 5px; display: inline" value="yes" />
                                    <label for="tos" class="d-inline text-center"> I have read the terms above and I agree. </label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center">
                                    <button :disabled="!termsAgreed" @click="placeOrder" class="btn btn-sm btn-green px-3 py-2">Place Order</button>
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
