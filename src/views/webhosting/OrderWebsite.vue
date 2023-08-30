<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers';
import { useSiteStore } from '@/stores';
import { ServiceType, ServiceTypes } from '@/types/view-service-common';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const siteStore = useSiteStore();
siteStore.setPageHeading('Order Website');
siteStore.setTitle('Order Website');
siteStore.setBreadcrums([[ '/home', 'Home'],[ '/websites', 'Websites List'],[ '/websites/order', 'Order Website' ]]);
const baseUrl = siteStore.getBaseUrl();

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

const step = ref('order_form');
const packageId = ref(11363);
const period = ref(1);
const serviceOfferId = ref(0);
const enableDomainRegistering = ref({});
const web = ref('');
const currency = ref('USD');
const currencySymbol = ref('$');
const hostname = ref('');
const rootpass = ref('');
const coupon = ref('');
const serviceTypes = ref<Packages>({});
const serviceOffers = ref<ServiceOffers>({});
const packages = ref<Packages>({});
const jsonServices = ref<JsonServices>({});
const jsonServiceOffers = ref<ServiceOffers>({});
const formData = reactive({
    step: step,
    packageId: packageId,
    period: period,
    enableDomainRegistering: enableDomainRegistering,
    web: web,
    currency: currency,
    currencySymbol: currencySymbol,
    hostname: hostname,
    rootpass: rootpass,
    coupon: coupon,
    serviceOfferId: serviceOfferId,
    'serviceOffers[packageId]': serviceOffers.value[packageId.value] ? serviceOffers.value[packageId.value] : {},
    'serviceTypes[packageId]': serviceTypes.value[packageId.value] ? serviceTypes.value[packageId.value] : {},
    //    jsonServices: jsonServices,
    //    jsonServiceOffers: jsonServiceOffers,
    //    packges: packges,
    //    packages: packages,
});
const totalCost = computed(() => {
    let total = 0;
    if (!serviceTypes.value[packageId.value]) {
        return total;
    }
    total = serviceTypes.value[packageId.value].services_cost;
    return total;
});

function updateCoupon() {

}

function updatePrice(event: Event, force: boolean = false) {

}

async function onSubmit() {
    try {
        Swal.fire({
            title: '',
            html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
            allowOutsideClick: false,
            showConfirmButton: false,
        });
        fetchWrapper
            .put(`${baseUrl}/websites/order`, {
                web: packageId.value,
                packageId: packageId.value,
                hostname: hostname.value,
                rootpass: rootpass.value,
                period: period.value,
                coupon: coupon.value,
            })
            .then((response) => {
                Swal.close();
                step.value = 'order_confirm';
                console.log('website order validated');
                console.log(response);
            });
    } catch (error) {
        console.log('website order validation failed');
        console.log(error);
    }
}

async function onSubmitConfirmation() {
    try {
        fetchWrapper
            .post(`${baseUrl}/websites/order`, {
                web: packageId.value,
                packageId: packageId.value,
                hostname: hostname.value,
                rootpass: rootpass.value,
                period: period.value,
                coupon: coupon.value,
                serviceType: packageId.value,
            })
            .then((response) => {
                console.log('website order validated');
                console.log(response);
                if (response['success'] == true) {
                    router.push('/cart/'+response.iids.join(','));
                }

            });
    } catch (error) {
        console.log('website order validation failed');
        console.log(error);
    }
}

async function searchDomain() {
    console.log('searching for ' + hostname.value);
    fetchWrapper.get(baseUrl + '/domains/lookup/' + hostname.value).then((response) => {
        console.log('Response:');
        console.log(response);
    });
}

Swal.fire({
    title: '',
    html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
    allowOutsideClick: false,
    showConfirmButton: false,
});
fetchWrapper.get(baseUrl + '/websites/order').then((response) => {
    Swal.close();
    console.log('Response:');
    console.log(response);
    step.value = response.step;
    if (response.website == '') {
        packageId.value = 11363;
    } else {
        packageId.value = response.website;
    }
    period.value = response.period;
    serviceOfferId.value = response.serviceOfferId;
    serviceTypes.value = response.serviceTypes;
    serviceOffers.value = response.serviceOffers;
    packages.value = response.packges;
    //packages.value = response.packages;
    enableDomainRegistering.value = response.enableDomainRegistering;
    jsonServices.value = response.jsonServices;
    jsonServiceOffers.value = response.jsonServiceOffers;
});
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
                                                    <div class="card mx-1" :style="{ width: '48%', border: servicesId === 11363 ? '4px solid #007bff' : '' }">
                                                        <div class="card-header">
                                                            <div class="p-1">
                                                                <h3 class="card-title py-2">
                                                                    <div class="icheck-success">
                                                                        <input :id="serviceData.services_name" type="radio" class="form-check-input websiteSelect" :name="serviceData.services_name" v-model="packageId" :value="serviceData.services_id" />
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
                                                                    <input :id="serviceData.services_name" type="radio" class="form-check-input websiteSelect" name="website" :value="serviceData.services_id" v-model="packageId" />
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
                                    <div v-if="serviceData.services_id == packageId" class="form-group row" :key="servicesId">
                                        <label class="col-sm-2 col-form-label px-0">Package<span class="text-danger">*</span></label>
                                        <div class="card col-md-10 p-0">
                                            <div class="card-header">
                                                <div class="p-1">
                                                    <h3 class="card-title py-2">
                                                        <div class="icheck-success">
                                                            <input :id="serviceData.services_name" type="radio" class="form-check-input websiteSelect" name="website" :value="serviceData.services_id" :checked="packageId == serviceData.services_id" @change="updatePrice($event, true)" />
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
                                <div class="col-md-6 package_name">
                                    <template v-if="serviceTypes[packageId]">{{ serviceTypes[packageId].services_name }}</template>
                                </div>
                                <div class="col period text-right">1 Month</div>
                            </div>
                            <div class="row mb-3">
                                <div id="hostname_display" class="col-md-6"></div>
                                <div class="col package_cost text-right"></div>
                            </div>
                            <div id="couponpricerownew" class="row coupon-display d-none mb-3">
                                <div id="couponpricetext" class="col-md-6"></div>
                                <div id="couponprice" class="col text-right"></div>
                            </div>
                            <hr />
                            <div class="row mb-3">
                                <div class="col-md-8 text-lg">Total</div>
                                <div id="totalprice" class="col total_cost text-right text-lg">{{ totalCost }}</div>
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
                                    <input id="hostname" type="text" placeholder="Enter a domain name" class="form-control form-control-sm" name="hostname" v-model="hostname" required @keyup="searchDomain" @change="searchDomain" />
                                    <small class="form-text text-muted">Website Domain Name (ie yoursite.com)</small>
                                </div>
                            </div>
                            <div id="registerrow" class="form-group row d-none d-status mb-0">
                                <label class="col-sm-12">Domain Status<span class="text-danger">*</span></label>
                                <div class="col-md-12">
                                    <small id="registertext" class="form-text text-warning mb-0 text-sm"></small>
                                </div>
                                <label id="registerdesc" class="col-md-12 col-form-label"></label>
                                <span class="form-text"></span>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-12">Billing Cycle<span class="text-danger">*</span></label>
                                <div class="col-sm-12">
                                    <select name="period" id="period" class="form-control form-control-sm select2" v-model="period" @change="updatePrice">
                                        <option value="1">Monthly</option>
                                        <option value="3">3 Months</option>
                                        <option value="6">6 Months (5% off)</option>
                                        <option value="12">Yearly (10% off)</option>
                                        <option value="24">24 Months (15% off)</option>
                                        <option value="36">36 Months (20% off)</option>
                                    </select>
                                </div>
                            </div>
                            <div id="coupon_row" class="form-group row">
                                <label class="col-md-12">Coupon Code</label>
                                <div class="col-md-12"><input type="text" class="form-control form-control-sm" name="coupon" id="coupon" placeholder="Coupon Code" v-model="coupon" @change="updateCoupon" v-if="coupon" /></div>
                                <div class="col-md-12"></div>
                                <div class="col-md-12">
                                    <img src="https://my.interserver.net/validate_coupon.php?module=vps'" id="couponimg" height="20" width="20" alt="" />
                                    <span class="text-muted text-sm" id="coupon_text" style="position: relative; top: 2px"></span>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center"><input type="submit" name="Submit" value="Continue" class="btn btn-sm btn-order px-3 py-2" /></div>
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
                                            <button type="button" style="" name="update_values" @click="step = 'order_form'" data-toggle="tooltip" class="btn btn-sm text-bold" title="Edit details">
                                                <div style="display: inline" class="text-md float-left">{{ hostname }}</div>
                                                <i style="padding-top: 4px; padding-left: 4px" aria-hidden="true" class="fa fa-pencil float-right"></i>
                                            </button>
                                        </th>
                                        <th>
                                            <div class="text-md">{{ period }} Month(s)</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="col-md-8 text-md">Availiability:</div>
                                        </td>
                                        <td>
                                            <span id="registerconfrow" class="d-none d-status text-md">
                                                <div id="registerconfdesc"></div>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="col-md-8 text-md">{{ serviceTypes[packageId].services_name }}</div>
                                        </td>
                                        <td>
                                            <div class="text-md package_cost"></div>
                                        </td>
                                    </tr>
                                    <template v-if="coupon && coupon !== ''">
                                        <tr>
                                            <td>
                                                <div class="text-md">Coupon Used</div>
                                            </td>
                                            <td>
                                                <div class="text-md text-bold">{{ coupon }} <img src="https://my.interserver.net/validate_coupon.php?module=webhosting'" style="padding-left: 10px" id="couponimg2" height="20" width="20" alt="" /></div>
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
                                            <div class="text-bold text-lg" id="totalprice2">{{ totalCost }}</div>
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
                                    <input type="checkbox" name="tos" id="tos" class="d-inline" style="margin: 0 5px" value="yes" />
                                    <label for="tos" style="display: inline; text-align: center">I have read the terms above and I agree.</label>
                                </p>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center"><input type="submit" name="Submit" value="Place Order" class="btn btn-green px-3 py-2 text-sm" /></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped></style>
