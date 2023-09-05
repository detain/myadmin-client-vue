<script setup lang="ts">
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers';
import { useSiteStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
import { ServiceType, ServiceTypes } from '@/types/view-service-common';
const route = useRoute();
const router = useRouter();
const siteStore = useSiteStore();
siteStore.setPageHeading('Order Backup');
siteStore.setTitle('Order Backup');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/backups', 'Backup List'],
    ['/backups/order', 'Order Backup'],
]);
const baseUrl = siteStore.getBaseUrl();

const step = ref('orderform');
const currency = ref('USD');
const currencySymbol = ref('$');
const pkg = ref(10831);
const rootpass = ref('');
const period = ref(1);
const coupon = ref('');
const packageCosts = ref<PackageCosts>({});
const serviceTypes = ref<ServiceTypes>({});
const repeatServiceCost = ref(0);

const periods = [
    { label: 'Monthly', value: 1 },
    { label: '3 Months', value: 3 },
    { label: '6 Months (5% off)', value: 6 },
    { label: 'Yearly (10% off)', value: 12 },
    { label: '24 Months (15% off)', value: 24 },
    { label: '36 Months (20% off)', value: 36 },
];

async function editForm() {
    step.value = 'orderform';
}

function updatePrice() {}

function updateCoupon() {}

const serviceDetail = computed(() => {
    return serviceTypes.value[pkg.value] as ServiceType;
});

async function placeOrder(values: any) {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(baseUrl + '/backups]/order', {
                validateOnly: false,
                serviceType: pkg.value,
                coupon: coupon.value,
            })
            .then((response) => {
                Swal.close();
                console.log('Response:');
                console.log(response);
                if (response['continue'] == true) {
                    router.push('/cart/' + response.iids.join(','));
                }
            });
    } catch (error: any) {
        Swal.close();
        console.log('error:');
        console.log(error);
    }
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
            .put(baseUrl + '/backups/order', {
                validateOnly: true,
                serviceType: pkg.value,
                coupon: coupon.value,
            })
            .then((response: BackupOrderValidateResponse) => {
                Swal.close();
                //validateResponse.value = response;
                console.log('Response:');
                console.log(response);
                pkg.value = response.serviceType;
                rootpass.value = response.password;
                coupon.value = response.coupon;
                repeatServiceCost.value = response.repeatServiceCost;
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

interface BackupOrderValidateResponse {
    continue: boolean;
    coupon: string;
    couponCode: number;
    errors: string[];
    hostname: string;
    originalCost: number;
    password: string;
    repeatServiceCost: number;
    serviceCost: number;
    serviceType: number;
}

interface BackupOrderResponse {
    packageCosts: PackageCosts;
    serviceTypes: ServiceTypes;
}

interface PackageCosts {
    [key: number]: number;
}

Swal.fire({
    title: '',
    html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
    allowOutsideClick: false,
    showConfirmButton: false,
});
fetchWrapper.get(baseUrl + '/backups/order').then((response: BackupOrderResponse) => {
    Swal.close();
    console.log('Response:');
    console.log(response);
    packageCosts.value = response.packageCosts;
    serviceTypes.value = response.serviceTypes;
});
</script>

<template>
    <template v-if="!step || step == 'orderform'">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-database" aria-hidden="true">&nbsp;</i>Order Storage</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="storage_form" method="post" class="storage_form_init" @submit.prevent="onSubmit">
                            <input type="hidden" name="rootpass" :value="rootpass" />
                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label">Package&nbsp;<span class="text-danger">*</span></label>
                                <div class="col-sm-10 input-group">
                                    <select v-model="pkg" class="form-control form-control-sm select2">
                                        <template v-for="(row, index) in serviceTypes">
                                            <option v-if="row.services_buyable == 1" :key="index" :value="index">{{ row.services_name }}</option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label">Billing Cycle&nbsp;<span class="text-danger">*</span></label>
                                <div class="col-sm-10">
                                    <select v-model="period" class="form-control form-control-sm select2" @change="updatePrice">
                                        <option v-for="row in periods" :key="row.value" :value="row.value">{{ row.label }}</option>
                                    </select>
                                </div>
                            </div>
                            <div id="coupon_row" class="row">
                                <label class="col-md-2 col-form-label">Coupon Code</label>
                                <div class="col-md-10">
                                    <input type="text" class="form-control form-control-sm" v-model="coupon" @change="updateCoupon" placeholder="Coupon Code" />
                                </div>
                                <div class="offset-md-2 col-md-10">
                                    <img alt="" :src="`https://my.interserver.net/validate_coupon.php?module=vps'`" id="couponimg" height="20" width="20" />
                                </div>
                            </div>
                            <hr class="mt-0" />
                            <div class="row">
                                <div class="col-md-12 text-center">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-order btn-sm px-3 py-2" />
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
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body text-md">
                        <div class="row mb-3">
                            <div class="col-md-6 package_name"></div>
                            <div class="col text-right"><span class="period">1</span> Month(s)</div>
                        </div>
                        <div class="row mb-3">
                            <div id="hostname_display" class="col-md-6">Package Cost</div>
                            <div class="col package_cost text-right"></div>
                        </div>
                        <div class="row cyclediscountrow mb-3">
                            <div class="col-md-6">Billing cycle Discount</div>
                            <div id="cyclediscount" class="col text-right"></div>
                        </div>
                        <div id="couponpricerownew" class="row coupon-display mb-3">
                            <div id="couponpricetext" class="col-md-6"></div>
                            <div id="couponprice" class="col text-right"></div>
                        </div>
                        <hr />
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalprice" class="col total_cost text-right text-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else-if="step == 'order_confirm'">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h4 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h4>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form method="post" class="storage_form_confirm" action="" @submit.prevent="placeOrder">
                            <table class="table-sm table-bordered table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="text-md float-left" style="position: relative; top: 5px">
                                                {{ serviceDetail.services_name }}
                                            </div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" @click="editForm" data-toggle="tooltip" title="Edit details"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th class="text-md">{{ period }} Month(s)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="text-md">Package Cost</td>
                                        <td>
                                            <div class="text-bold text-md package_cost"></div>
                                        </td>
                                    </tr>
                                    <template v-if="coupon">
                                        <tr>
                                            <td class="text-md">Coupon Used</td>
                                            <td class="text-bold text-md">
                                                {{ coupon }}
                                                <img alt="" src="https://my.interserver.net/validate_coupon.php?module=webhosting'" style="padding-left: 10px" id="couponimg" height="20" width="20" />
                                            </td>
                                        </tr>
                                    </template>
                                    <tr id="couponpricerownew">
                                        <td id="couponpricetext" class="text-md">Coupon Discount</td>
                                        <td class="text-bold text-md">
                                            <div id="couponprice"></div>
                                        </td>
                                    </tr>
                                    <tr class="cyclediscountrow">
                                        <td id="couponpricetext" class="text-md">Billing Cycle Discount</td>
                                        <td class="text-bold text-md">
                                            <div id="cyclediscount"></div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>
                                            <div class="text-lg">Total</div>
                                        </th>
                                        <th>
                                            <div class="total_cost text-lg"></div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <hr />
                            <div class="p-1">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">
                                    The subscription will automatically renew after <b>every month at</b> <span class="text-bold">{{ currencySymbol }}{{ repeatServiceCost }}</span> until canceled.
                                </p>
                                <p class="text-muted text-xs">By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.</p>
                                <div class="icheck-success text-bold text-center">
                                    <input type="checkbox" name="tos" id="tos" style="margin: 0 5px; display: inline" value="yes" />
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-md-12 text-center"><input type="submit" name="Submit" value="Place Order" class="btn btn-green btn-sm px-3 py-2" /></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped></style>
