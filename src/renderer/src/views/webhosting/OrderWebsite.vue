<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/stores/site.store';
import { ServiceType, ServiceTypes } from '@/types/view-service-common';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import type { CouponInfo } from '@/types/vps_order.ts';
import iconShield from '@/assets/images/myadmin/warning-shield.png';
import iconCheckmark from '@/assets/images/myadmin/checkmark.png';
const module = 'webhosting';
const route = useRoute();
const router = useRouter();
const siteStore = useSiteStore();
siteStore.setPageHeading('Order Website');
siteStore.setTitle('Order Website');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/websites', 'Websites List'],
    ['/websites/order', 'Order Website'],
]);
const baseUrl = siteStore.getBaseUrl();
const searchResults = ref<SearchDomainResponse | null>(null);
const step = ref('order_form');
const period = ref(1);
const serviceOfferId = ref(0);
const enableDomainRegistering = ref({});
const registerDomain = ref(false);
const currency = ref('USD');
const currencySymbol = ref('$');
const tos = ref(false);
const couponInfo = ref<CouponInfo>({});
const lastCoupon = ref('');
const web = ref('');
const serviceTypes = ref<Packages>({});
const serviceOffers = ref<ServiceOffers>({});
const packages = ref<Packages>({});
const jsonServices = ref<JsonServices>({});
const jsonServiceOffers = ref<ServiceOffers>({});
const domainStatusVisible = ref(false);
const domainCost = ref(0);
const formData = reactive({
    packageId: 11363,
    period: 1,
    enableDomainRegistering: enableDomainRegistering,
    hostname: '',
    rootpass: '',
    coupon: '',
    serviceOfferId: 0,
});

const selectedOffer = computed(() => {
    if (serviceOffers.value[formData.packageId]) {
        return serviceOffers.value[formData.packageId].find((offer) => offer.service_offer_id === period.value);
    }
    return null;
});
const basePrice = computed(() => {
    const svc = serviceTypes.value[formData.packageId];
    return svc ? Number(svc.services_cost) : 0;
});

const totalCost = computed(() => {
    let total = basePrice.value;
    if (selectedOffer.value) {
        total = Number(selectedOffer.value.intro_cost);
    } else {
        // billing discounts
        if (period.value === 12) total *= 0.9;
        if (period.value === 24) total *= 0.85;
        if (period.value === 36) total *= 0.8;
    }
    // coupon (flat only — matches current backend behavior)
    if (couponInfo.value?.applies && couponInfo.value.amounts?.USD) {
        total -= Number(couponInfo.value.amounts.USD);
    }
    // domain
    if (registerDomain.value === true && domainCost.value > 0) {
        total += domainCost.value;
    }
    return total.toFixed(2);
});

interface Package extends ServiceType {
    services_html: string;
    services_description: string;
    services_moreinfo_url: string;
}

interface Packages {
    [key: number]: Package;
}

interface ServiceOffers {
    [key: number]: ServiceOffer[];
}

interface PackageIds {
    [key: number]: string;
}

interface JsonServices {
    [key: number]: string;
}

interface ServiceOffer {
    service_offer_id: number;
    service_id: number;
    intro_cost: number;
    renewal_cost: number;
    intro_frequency: number;
    renewal_frequency: number;
    allow_coupon: number;
    service_module: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

interface SearchDomainResponse {
    available: boolean;
    premium: boolean;
    website: boolean;
    domain_service: boolean;
    service: SearchService;
    whois_privacy: boolean;
    new: string;
    renewal: string;
    transfer: string;
    fields: Record<string, SearchFieldDefinition>;
    currencies: Record<string, SearchCurrencyPricing>;
}

interface SearchService {
    services_id: string;
    services_name: string;
    services_cost: string;
    services_category: string;
    services_buyable: string;
    services_type: string;
    services_field1: string;
    services_field2: string;
    services_module: string;
}

interface SearchFieldDefinition {
    validations: string[];
    value: string;
    label?: string;
    input: SearchFieldInput;
    required: boolean;
}

type SearchFieldInput = 'text' | ['select', Record<string, string>];

interface SearchCurrencyPricing {
    services_cost: number;
    new: number;
    renewal: number;
    transfer: number;
}

function goBack() {
    step.value = 'order_form';
}

function updateCoupon() {
    if (lastCoupon.value != formData.coupon) {
        lastCoupon.value = formData.coupon;
        (document.getElementById('couponimg') as unknown as HTMLImageElement).src = `https://my.interserver.net/validate_coupon.php?module=${module}&coupon=${formData.coupon}`;
        fetch(`https://my.interserver.net/ajax/coupon_info.php?module=${module}&coupon=${encodeURIComponent(formData.coupon)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json() as Promise<CouponInfo>;
            })
            .then((json) => {
                couponInfo.value = json;

                if (typeof json.applies !== 'undefined') {
                    // update_vps_choices();
                    if (couponInfo.value.onetime === '0') {
                        // update_vps_choices_order();
                    }
                }
            })
            .catch((error) => {
                console.error('Failed to load coupon info:', error);
            });
    }
}

async function onSubmit() {
    try {
        Swal.fire({
            title: '',
            html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
            allowOutsideClick: false,
            showConfirmButton: false,
        });
        if (selectedOffer.value) {
            formData.period = selectedOffer.value.intro_frequency;
            formData.serviceOfferId = selectedOffer.value.service_offer_id;
        } else {
            formData.period = period.value;
            formData.serviceOfferId = 0;
        }
        fetchWrapper.put(`${baseUrl}/websites/order`, formData).then((response) => {
            Swal.close();
            step.value = 'order_confirm';
            console.log('website order validated');
            console.log(response);
        });
    } catch (error: any) {
        console.log('website order validation failed');
        console.log(error);
    }
}

async function onSubmitConfirmation() {
    try {
        if (selectedOffer.value) {
            formData.period = selectedOffer.value.intro_frequency;
            formData.serviceOfferId = selectedOffer.value.service_offer_id;
        } else {
            formData.period = period.value;
            formData.serviceOfferId = 0;
        }
        fetchWrapper.post(`${baseUrl}/websites/order`, formData).then((response) => {
            console.log('website order validated');
            console.log(response);
            if (response['success'] == true) {
                router.push(`/cart/${response.real_iids.join(',')}`);
            }
        });
    } catch (error: any) {
        console.log('website order validation failed');
        console.log(error);
    }
}

async function searchDomain() {
    console.log(`searching for ${formData.hostname}`);
    if (formData.hostname.trim().length < 3 || formData.hostname.trim().indexOf('.') == -1) {
        searchResults.value = null;
        return;
    }
    fetchWrapper.get(`${baseUrl}/domains/lookup/${formData.hostname}`).then((response: SearchDomainResponse) => {
        if (response.available) {
            domainCost.value = Number(response.service.services_cost);
        } else {
            domainCost.value = 0;
        }
        searchResults.value = response;
        domainStatusVisible.value = true;
    });
}

function loadOrderData() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper.get(`${baseUrl}/websites/order`).then((response) => {
        Swal.close();
        console.log('Response:');
        console.log(response);
        currencySymbol.value = response.currencySymbol;
        step.value = response.step;
        web.value = response.website;
        formData.packageId = response.website == '' ? 11363 : response.website;
        formData.period = response.period;
        formData.serviceOfferId = response.serviceOfferId;
        serviceTypes.value = response.serviceTypes;
        serviceOffers.value = response.serviceOffers;
        packages.value = response.packges;
        enableDomainRegistering.value = response.enableDomainRegistering;
        jsonServices.value = response.jsonServices;
        jsonServiceOffers.value = response.jsonServiceOffers;
    });
}

loadOrderData();

watch(
    [() => formData.packageId, serviceOffers],
    ([newPackageId, newServiceOffers]) => {
        const offers = newServiceOffers[newPackageId];
        if (Array.isArray(offers) && offers.length > 0) {
            period.value = offers[0].service_offer_id;
        } else {
            period.value = 1;
        }
    },
    { immediate: true }
);
</script>

<template>
    <template v-if="!step || step == 'order_form'">
        <form id="website_form" method="post" class="website_form_init" @submit.prevent="onSubmit">
            <div class="row justify-content-center">
                <div class="col-md-7">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fas fa-globe" aria-hidden="true">&nbsp;</i>Order Website</h3>
                            </div>
                        </div>
                        <div class="card-body">
                            <div v-if="!web" class="form-group row">
                                <div class="col-md-12 input-group">
                                    <div class="card">
                                        <div class="card-header">
                                            <div class="p-1">
                                                <h3 class="card-title text-bold py-2">Webhosting Plans</h3>
                                            </div>
                                        </div>
                                        <div class="card-body row">
                                            <template v-for="(serviceData, servicesId) in serviceTypes" :key="servicesId">
                                                <template v-if="serviceData.services_buyable == 1 && serviceData.services_hidden == 0 && (serviceData.services_field1 === '' || serviceData.services_field1 === 'webhosting')">
                                                    <div class="card mx-1" :style="{ width: '48%', border: Number(servicesId) === 11363 ? '4px solid #007bff' : '' }">
                                                        <div class="card-header">
                                                            <div class="p-1">
                                                                <h3 class="card-title py-2">
                                                                    <div class="icheck-success">
                                                                        <input :id="serviceData.services_name" v-model="formData.packageId" type="radio" class="form-check-input websiteSelect" :name="serviceData.services_name" :value="serviceData.services_id" />
                                                                        <label :for="serviceData.services_name">
                                                                            {{ serviceData.services_name }}<br />
                                                                            <div class="text-muted font-italic mt-1 text-sm">
                                                                                <template v-if="serviceData.services_category == 200"> ( cPanel ) </template>
                                                                                <template v-else-if="serviceData.services_category == 204"> ( DirectAdmin ) </template>
                                                                                <template v-else-if="serviceData.services_category == 202"> ( Plesk ) </template>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            <div class="service_details">
                                                                <template v-if="serviceData.services_id == 11363">
                                                                    <div class="ribbon-wrapper">
                                                                        <div class="ribbon bg-primary">Popular</div>
                                                                    </div>
                                                                </template>
                                                                {{ serviceData.services_description }}
                                                            </div>
                                                        </div>
                                                        <div class="card-footer">
                                                            <div class="service_cost float-left">
                                                                Starting From: <b>{{ currencySymbol }}{{ serviceData.services_cost }}</b>
                                                            </div>
                                                            <div class="float-right">
                                                                <a :href="serviceData.services_moreinfo_url" target="_blank" style="font-size: 14px" data-toggle="tooltip" title="More Info">
                                                                    <i class="fa fa-external-link"></i>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 input-group">
                                    <div class="card">
                                        <div class="card-header">
                                            <div class="p-1">
                                                <h3 class="card-title text-bold py-2">Reseller Plans</h3>
                                            </div>
                                        </div>
                                        <div class="card-body row">
                                            <template v-for="(serviceData, servicesId) in serviceTypes" :key="servicesId">
                                                <div v-if="serviceData.services_buyable == 1 && serviceData.services_hidden == 0 && serviceData.services_field1 === 'reseller'" class="card mx-1" :style="{ width: '48%', border: serviceData.services_id == 11363 ? '4px solid #007bff' : '' }">
                                                    <div class="card-header">
                                                        <div class="p-1">
                                                            <h3 class="card-title py-2">
                                                                <div class="icheck-success">
                                                                    <input :id="serviceData.services_name" v-model="formData.packageId" type="radio" class="form-check-input websiteSelect" name="website" :value="serviceData.services_id" />
                                                                    <label :for="serviceData.services_name">
                                                                        {{ serviceData.services_name }}<br />
                                                                        <div class="text-muted font-italic mt-1 text-sm">
                                                                            <span v-if="serviceData.services_category == 200">( cPanel )</span>
                                                                            <span v-else-if="serviceData.services_category == 204">( DirectAdmin )</span>
                                                                            <span v-else-if="serviceData.services_category == 202">( Plesk )</span>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="service_details">
                                                            {{ serviceData.services_description }}
                                                        </div>
                                                    </div>
                                                    <div class="card-footer">
                                                        <div class="service_cost float-left">
                                                            Starting From: <b>{{ currencySymbol }}{{ serviceData.services_cost }}</b>
                                                        </div>
                                                        <div class="float-right">
                                                            <a :href="serviceData.services_moreinfo_url" target="_blank" style="font-size: 14px" data-toggle="tooltip" title="More Info">
                                                                <i class="fa fa-external-link"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <template v-else>
                                <template v-for="(serviceData, servicesId) in packages">
                                    <div v-if="serviceData.services_id == formData.packageId" :key="servicesId" class="form-group row">
                                        <label class="col-sm-2 col-form-label px-0">Package<span class="text-danger">*</span></label>
                                        <div class="card col-md-10 p-0">
                                            <div class="card-header">
                                                <div class="p-1">
                                                    <h3 class="card-title py-2">
                                                        <div class="icheck-success">
                                                            <input :id="serviceData.services_name" type="radio" class="form-check-input websiteSelect" name="website" :value="serviceData.services_id" :checked="formData.packageId == serviceData.services_id" />
                                                            <label :for="serviceData.services_name">
                                                                {{ serviceData.services_name }}<br />
                                                                <div class="text-muted font-italic mt-1 text-sm">
                                                                    <template v-if="serviceData.services_category == 200">( cPanel )</template>
                                                                    <template v-else-if="serviceData.services_category == 204">( DirectAdmin )</template>
                                                                    <template v-else-if="serviceData.services_category == 202">( Plesk )</template>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </h3>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <div class="service_details">
                                                    <template v-if="serviceData.services_id == 11363">
                                                        <div class="ribbon-wrapper">
                                                            <div class="ribbon bg-primary">Popular</div>
                                                        </div>
                                                    </template>
                                                    {{ serviceData.services_description }}
                                                </div>
                                            </div>
                                            <div class="card-footer">
                                                <div class="service_cost float-left">
                                                    Starting From: <b>{{ currencySymbol }}{{ serviceData.services_cost }}</b>
                                                </div>
                                                <div class="float-right">
                                                    <a :href="serviceData.services_moreinfo_url" target="_blank" style="font-size: 14px" data-toggle="tooltip" title="More Info"><i class="fa fa-external-link"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h4 class="card-title py-2"><i class="fa fa-shopping-cart">&nbsp;</i>Order Summary</h4>
                            </div>
                        </div>
                        <div class="card-body text-md">
                            <div class="row mb-3">
                                <div class="col-md-4 package_name">
                                    <template v-if="serviceTypes[formData.packageId]">{{ serviceTypes[formData.packageId].services_name }}</template>
                                </div>
                                <template v-if="selectedOffer">
                                    <div class="col-md-8 period text-right">{{ currencySymbol }}{{ selectedOffer.intro_cost }} for {{ selectedOffer.intro_frequency }} month(s). Renews at {{ currencySymbol }}{{ selectedOffer.renewal_cost }} for {{ selectedOffer.renewal_frequency }} month(s)</div>
                                </template>
                                <template v-else>
                                    <div class="col-md-8 period text-right">{{ period }} Month(s)</div>
                                </template>
                            </div>
                            <div class="row mb-3">
                                <div id="hostname_display" class="col-md-6">{{ formData.hostname }}</div>
                                <template v-if="selectedOffer">
                                    <div class="col package_cost text-right">{{ currencySymbol }}{{ selectedOffer.intro_cost }} / {{ selectedOffer.intro_frequency }} month(s)</div>
                                </template>
                                <template v-else-if="serviceTypes[formData.packageId]">
                                    <div class="col package_cost text-right">{{ currencySymbol }}{{ serviceTypes[formData.packageId].services_cost }} / {{ period }} month(s)</div>
                                </template>
                            </div>
                            <div id="couponpricerownew" class="row coupon-display d-none mb-3">
                                <div id="couponpricetext" class="col-md-6"></div>
                                <div id="couponprice" class="col text-right"></div>
                            </div>
                            <hr />
                            <div class="row mb-3">
                                <div class="col-md-8 text-lg">Total</div>
                                <div class="col total_cost text-right text-lg">{{ currencySymbol }}{{ totalCost }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h4 class="card-title py-2"><i class="fas fa-globe">&nbsp;</i>Select Domain & Billing Cycle</h4>
                            </div>
                        </div>
                        <div class="card-body text-md">
                            <div class="form-group row">
                                <label class="col-sm-12">Domain Name<span class="text-danger">*</span></label>
                                <div class="col-md-12">
                                    <input id="hostname" v-model="formData.hostname" type="text" placeholder="Enter a domain name" class="form-control form-control-sm" name="hostname" required @keyup="searchDomain" @change="searchDomain" />
                                    <small class="form-text text-muted">Website Domain Name (ie yoursite.com)</small>
                                </div>
                            </div>
                            <div v-if="domainStatusVisible" class="form-group row d-status mb-0">
                                <label class="col-sm-12">Domain Status<span class="text-danger">*</span></label>
                                <template v-if="searchResults?.available === true">
                                    <div class="col-md-12">
                                        <small class="form-text text-warning mb-0 text-sm">
                                            <img :src="iconCheckmark" border="0" style="width: 20px; height: 20px" /> <b>Domain is available</b><br />
                                            Register for {{ currencySymbol }}{{ domainCost }}
                                        </small>
                                    </div>
                                </template>
                                <template v-else-if="searchResults?.available === false">
                                    <div class="col-md-12">
                                        <small class="form-text text-warning mb-0 text-sm">
                                            <img :src="iconShield" border="0" style="width: 20px; height: 20px" /> <b>Already Registered!</b><br />
                                            Proceed only if you already own the domain.
                                        </small>
                                    </div>
                                </template>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-12">Billing Cycle<span class="text-danger">*</span></label>
                                <div class="col-sm-12">
                                    <select id="period" v-model="period" name="period" class="form-control form-control-sm select2">
                                        <template v-if="serviceOffers[formData.packageId]">
                                            <option v-for="offer in serviceOffers[formData.packageId]" :key="offer.service_offer_id" :value="offer.service_offer_id">{{ currencySymbol }}{{ offer.intro_cost }} for {{ offer.intro_frequency }} Month(s). Renews at {{ currencySymbol }}{{ offer.renewal_cost }} for {{ offer.renewal_frequency }} Month(s)</option>
                                        </template>
                                        <template v-else>
                                            <option value="1">Monthly</option>
                                            <option value="3">3 Months</option>
                                            <option value="6">6 Months (5% off)</option>
                                            <option value="12">Yearly (10% off)</option>
                                            <option value="24">24 Months (15% off)</option>
                                            <option value="36">36 Months (20% off)</option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                            <div id="coupon_row" class="form-group row">
                                <label class="col-md-12">Coupon Code</label>
                                <div class="col-md-12"><input id="coupon" v-model="formData.coupon" type="text" class="form-control form-control-sm" name="coupon" placeholder="Coupon Code" @change="updateCoupon" /></div>
                                <div class="col-md-12"></div>
                                <div class="col-md-12">
                                    <img id="couponimg" src="https://my.interserver.net/validate_coupon.php?module=vps'" height="20" width="20" alt="" />
                                    <span id="coupon_text" class="text-muted text-sm" style="position: relative; top: 2px"></span>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center"><input type="submit" name="Submit" value="Continue" class="btn btn-sm btn-order px-3 py-2" :disabled="formData.hostname == ''" /></div>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: left">
                                    <pre>{{ formData }}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </template>
    <template v-else-if="step == 'order_confirm'">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h4>
                        </div>
                    </div>
                    <div class="card-body">
                        <form method="post" class="website_form_confirm" @submit.prevent="onSubmitConfirmation">
                            <table class="table-sm table-bordered table">
                                <thead>
                                    <tr>
                                        <th>
                                            <button type="button" style="" name="update_values" data-toggle="tooltip" class="btn btn-sm text-bold" title="Edit details" @click="step = 'order_form'">
                                                <div style="display: inline" class="text-md float-left">{{ formData.hostname }}</div>
                                                <i style="padding-top: 4px; padding-left: 4px" aria-hidden="true" class="fa fa-pencil float-right"></i>
                                            </button>
                                        </th>
                                        <th>
                                            <template v-if="selectedOffer">
                                                <div class="text-md">{{ selectedOffer.intro_frequency }} month(s).</div>
                                            </template>
                                            <template v-else>
                                                <div class="text-md">{{ period }} Month(s)</div>
                                            </template>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="col-md-8 text-md">Availiability:</div>
                                        </td>
                                        <td>
                                            <div v-if="domainStatusVisible" class="form-group row d-status mb-0">
                                                <template v-if="searchResults?.available === true">
                                                    <div class="col-md-12">
                                                        <small class="form-text text-warning mb-0 text-sm">
                                                            <img :src="iconCheckmark" border="0" style="width: 20px; height: 20px" /> <b>Domain is available</b><br />
                                                            Register for {{ currencySymbol }}{{ domainCost }}
                                                        </small>
                                                    </div>
                                                </template>
                                                <template v-else-if="searchResults?.available === false">
                                                    <div class="col-md-12">
                                                        <small class="form-text text-warning mb-0 text-sm">
                                                            <img :src="iconShield" border="0" style="width: 20px; height: 20px" /> <b>Already Registered!</b><br />
                                                            Proceed only if you already own the domain.
                                                        </small>
                                                    </div>
                                                </template>
                                            </div>

                                            <span id="registerconfrow" class="d-none d-status text-md">
                                                <div id="registerconfdesc"></div>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="col-md-8 text-md">{{ serviceTypes[formData.packageId].services_name }}</div>
                                        </td>
                                        <td>
                                            <template v-if="selectedOffer">
                                                <div class="text-md">{{ currencySymbol }}{{ selectedOffer.intro_cost }} / {{ selectedOffer.intro_frequency }} month(s).</div>
                                            </template>
                                            <template v-else>
                                                <div class="text-md package_cost"></div>
                                                <div class="text-md">{{ currencySymbol }}{{ serviceTypes[formData.packageId].services_cost }} / {{ period }} Month(s)</div>
                                            </template>
                                        </td>
                                    </tr>
                                    <template v-if="formData.coupon && formData.coupon !== ''">
                                        <tr>
                                            <td>
                                                <div class="text-md">Coupon Used</div>
                                            </td>
                                            <td>
                                                <div class="text-md text-bold">{{ formData.coupon }} <img id="couponimg2" src="https://my.interserver.net/validate_coupon.php?module=webhosting'" style="padding-left: 10px" height="20" width="20" alt="" /></div>
                                            </td>
                                        </tr>
                                    </template>
                                    <tr style="display: none">
                                        <td>
                                            <div id="couponpricetext2" class="text-md">Coupon Discount</div>
                                        </td>
                                        <td>
                                            <div id="couponprice2" class="text-md text-bold"></div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>
                                            <div class="text-lg">Total</div>
                                        </th>
                                        <th>
                                            <div id="totalprice2" class="text-bold text-lg">{{ currencySymbol }}{{ totalCost }}</div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <div class="p-1">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">
                                    The subscription will automatically renew every <b>{{ period }} month(s) at {{ currencySymbol + totalCost }}</b> until canceled.
                                </p>
                                <p class="text-muted text-xs">By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.</p>
                                <p class="icheck-success text-bold text-center">
                                    <input id="tos" v-model="tos" type="checkbox" name="tos" class="d-inline" style="margin: 0 5px" value="true" />
                                    <label for="tos" style="display: inline; text-align: center">I have read the terms above and I agree.</label>
                                </p>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center">
                                    <button class="btn btn-custom btn-sm px-3 py-2 mr-2" data-toggle="tooltip" title="Go Back" style="" type="button" @click.prevent="goBack"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Go Back&nbsp;&nbsp;</button>
                                    <input type="submit" name="Submit" value="Place Order" class="btn btn-green px-3 py-2 text-sm" :disabled="tos == false" />
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
