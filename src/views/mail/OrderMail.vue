<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '../../helpers/fetchWrapper';

import Swal from 'sweetalert2';
import { useSiteStore } from '../../stores/site.store';

import { useRoute, useRouter } from 'vue-router';
import { ServiceType, ServiceTypes } from '../../types/view-service-common';
import $ from 'jquery';
import type { CouponInfo } from '@/types/vps_order.ts';
const route = useRoute();
const router = useRouter();
const siteStore = useSiteStore();
siteStore.setPageHeading('Order Mail');
siteStore.setTitle('Order Mail');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/mail', 'Mail List'],
    ['/mail/order', 'Order Mail'],
]);
const baseUrl = siteStore.getBaseUrl();
const step = ref('orderform');
const pkg = ref(10880);
const module = 'mail';
const validateResponse = ref<ValidateResponse | null>(null);
const tos = ref(false);
const packageCosts = ref<PackageCosts>({});
const serviceTypes = ref<ServiceTypes>({});
const couponInfo = ref<CouponInfo>({});
const lastCoupon = ref('');
const coupon = ref('');

interface PackageCosts {
    [key: number]: number;
}

interface MailOrderResponse {
    packageCosts: PackageCosts;
    serviceTypes: ServiceTypes;
}

interface ValidateResponse {
    continue: boolean;
    coupon: string;
    couponCode: number;
    errors: string[];
    introFrequency: number;
    originalCost: number;
    password: string;
    repeatServiceCost: number;
    serviceCost: number;
    serviceType: number;
}

function updateCoupon() {
    if (lastCoupon.value != coupon.value) {
        lastCoupon.value = coupon.value;
        (document.getElementById('couponimg') as unknown as HTMLImageElement).src = `https://my.interserver.net/validate_coupon.php?module=${module}&coupon=${coupon.value}`;
        $.getJSON(`https://my.interserver.net/ajax/coupon_info.php?module=${module}&coupon=${coupon.value}`, {}, function (json: CouponInfo) {
            couponInfo.value = json;
            if (typeof json.applies != 'undefined') {
                //update_vps_choices();
                if (couponInfo.value.onetime == '0') {
                    //update_vps_choices_order();
                }
            }
        });
    }
}

async function editForm() {
    step.value = 'orderform';
}

async function onSubmit(values: any) {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait! validating data',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .put(`${baseUrl}/mail/order`, {
                validateOnly: true,
                serviceType: pkg.value,
                coupon: coupon.value,
            })
            .then((response: ValidateResponse) => {
                Swal.close();
                validateResponse.value = response;
                console.log('Response:');
                console.log(response);
                pkg.value = response.serviceType;
                if (response.continue == true) {
                    step.value = 'order_confirm';
                }
            });
    } catch (error: any) {
        Swal.close();
        console.log('error:');
        console.log(error);
    }
}

async function placeOrder(values: any) {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/mail/order`, {
                validateOnly: false,
                serviceType: pkg.value,
                coupon: coupon.value,
            })
            .then((response) => {
                Swal.close();
                console.log('Response:');
                console.log(response);
                if (response['continue'] == true) {
                    router.push(`/cart/${response.iids.join(',')}`);
                }
            });
    } catch (error: any) {
        Swal.close();
        console.log('error:');
        console.log(error);
    }
}

try {
    fetchWrapper.get(`${baseUrl}/mail/order`).then((response: MailOrderResponse) => {
        packageCosts.value = response.packageCosts;
        serviceTypes.value = response.serviceTypes;
    });
} catch (error: any) {
    console.log('error:');
    console.log(error);
}
</script>

<template>
    <template v-if="!step || step == 'orderform'">
        <div class="row justify-content-center mb-3">
            <div class="col-md-10 mt-2 mb-3 alert alert-info px-4 py-2 rounded-4 position-relative shadow-lg outgoing_mail_msg" role="alert" style="background: linear-gradient(135deg, #fbfafa, #cecece); color: #000; border: 2px solid #b6b8b9; color: #00334e;border-radius: 8px;">
                <div class="d-flex align-items-center">
                    <div class="mr-4">
                        <i class="fas fa-envelope fa-3x" style="color: #007bff;"></i>
                    </div>
                    <div>
                        <h4 class="alert-heading mb-2 text-bold" style="color: #007bff;">Outgoing Mail Relay Service</h4>
                        <p style="font-size: 1rem; font-weight: 500; line-height: 1.5;margin-bottom: 5px;;">
                            This is a mail relay and security service for outgoing email only. For more information, visit
                            <a href="https://mail.baby" target="_blank" class="alert-link" style="color: #0056b3; text-decoration: underline;">https://mail.baby</a>.
                        </p>
                        <p style="font-size: 1rem; font-weight: 500; line-height: 1.5;margin-bottom: 3px;">
                            If you are looking for a full email service that includes Incoming Mail, Outgoing Mail, POP/IMAP, Webmail, and more, please purchase a web hosting package from
                            <a href="http://www.interserver.net/webhosting/" target="_blank" class="alert-link" style="color: #0056b3; text-decoration: underline;">Interserver Web Hosting</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-envelope-open" aria-hidden="true">&nbsp;</i>Order Mail</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="mail_form" method="post" class="mail_form_init" action="/mail/order" @submit.prevent="onSubmit">
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label text-right">Package<span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select v-model="pkg" class="form-control form-control-sm select2 valid">
                                        <option v-for="(serviceType, index) in serviceTypes" :key="index" :value="serviceType.services_id">{{ serviceType.services_name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Coupon Code</label>
                                <div class="input-group col-md-9">
                                    <input id="coupon" v-model="coupon" type="text" class="w-100 form-control text-sm" name="coupon" placeholder="Coupon Code" @keyup="updateCoupon" @change="updateCoupon" />
                                    <span class="input-group-addon" style="padding: 0"><img id="couponimg" src="https://my.interserver.net/validate_coupon.php?module=vps'" height="20" width="20" alt="" /></span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-sm btn-order px-3 py-2" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <div class="row text-center">
                            <div class="controls col-md-12">
                                <b><i class="fa fa-info-circle text-info" aria-hidden="true"></i></b>
                                Visit <a href="https://mail.baby" class="text-info underline" target="_blank"><u>https://mail.baby</u></a> for more information.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <!-- Order Summary -->
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div v-if="serviceTypes && serviceTypes[pkg]" id="package_name" class="col-md-8">{{ serviceTypes[pkg] ? serviceTypes[pkg].services_name : '' }}</div>
                            <div id="package_period" class="col text-bold text-right">1 Month(s)</div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-8">Package Cost</div>
                            <div class="col text-bold package_cost text-right">{{ serviceTypes[pkg] ? serviceTypes[pkg].services_cost : '' }}</div>
                        </div>
                        <div id="couponpricerownew" class="row mb-3">
                            <div id="couponpricetextnew" class="col-md-8">Coupon Discount</div>
                            <div id="couponprice" class="col text-bold text-right"></div>
                        </div>

                        <hr />
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalcost" class="col text-bold total_cost text-right text-lg"></div>
                        </div>
                    </div>
                </div>
                <!-- End Order Summary -->
            </div>
        </div>
    </template>
    <template v-if="step == 'order_confirm'">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form method="post" class="mail_form_confirm" action="/mail/order" @submit.prevent="placeOrder">
                            <input type="hidden" name="serviceType" :value="pkg" />
                            <input type="hidden" name="coupon" :value="coupon" />
                            <table class="table-sm table-bordered table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="text-md float-left" style="position: relative; top: 5px">{{ serviceTypes[pkg].services_name }}</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" data-toggle="tooltip" title="Edit details" @click="editForm"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div class="text-bold text-md package_cost">{{ validateResponse?.originalCost }}</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="ctext-md">Billed after every</div>
                                        </td>
                                        <td>
                                            <div class="text-md text-bold">Month</div>
                                        </td>
                                    </tr>
                                    <tr v-if="coupon">
                                        <td>
                                            <div class="text-md">Coupon Used</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ coupon }} <img id="couponimg" :src="'https://my.interserver.net/validate_coupon.php?module=webhosting&coupon=' + validateResponse?.coupon" style="padding-left: 10px" height="20" width="20" alt="" /></div>
                                        </td>
                                    </tr>
                                    <tr style="display: none">
                                        <td>
                                            <div id="couponpricetext" class="text-md">Coupon Discount</div>
                                        </td>
                                        <td>
                                            <div id="couponprice" class="text-bold text-md"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-bold text-lg">Total</div>
                                        </td>
                                        <td>
                                            <div id="totalprice" class="text-bold text-lg">{{ validateResponse?.serviceCost }}</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr />
                            <div class="p-1">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">
                                    The subscription will automatically renew after <b>every month at</b> <span class="package_cost text-bold">{{ packageCosts[pkg] }}</span> until canceled.
                                </p>
                                <p class="text-muted text-xs">By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <br /><b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.</p>
                                <div class="icheck-success text-bold text-center">
                                    <input id="tos" v-model="tos" type="checkbox" name="tos" style="margin: 0 5px; display: inline" value="yes" />
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center">
                                    <button type="submit" name="Submit" class="btn btn-sm btn-green px-3 py-2" :disabled="!tos">Place Order</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped>
@import '@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css';

.outgoing_mail_msg {
    animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
