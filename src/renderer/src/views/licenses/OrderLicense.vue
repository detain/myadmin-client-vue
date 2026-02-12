<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { useSiteStore } from '../../stores/site.store';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ServiceType, ServiceTypes } from '../../types/view-service-common';
import imageDirectAdmin from '../../assets/images/directadmin.png';
import imageSoftaculous from '../../assets/images/softaculous.png';
import imagePlesk from '../../assets/images/plesk12.png';
import imageCloudLinux from '../../assets/images/cloudlinux.png';
import imageCpanel from '../../assets/images/cpanel.png';
import imageLitespeed from '../../assets/images/litespeed.png';
import type { CouponInfo } from '../../types/vps_order.ts';
const module: string = 'licenses';
const siteStore = useSiteStore();
const route = useRoute();
const router = useRouter();
const catTag = computed(() => (route.params.catTag as string) || '');
const step = ref('license_types');
const baseUrl = siteStore.getBaseUrl();
const ip = ref('');
const couponInfo = ref<CouponInfo>({});
const lastCoupon = ref('');
const coupon = ref('');
const tos = ref(false);
const comment = ref('');
const frequency = ref(1);
const enabledServices = [11482, 11475, 11468, 10945, 10952, 10959, 10966, 10973, 10980, 10987, 10994, 5032, 5034, 10677, 10678, 10679, 10680, 10681, 11524, 11531, 11538, 5054, 5058, 5060, 5053, 5057, 5059, 10682, 10769, 5006, 5007];
const packageCosts = ref({});
const serviceTypes = ref<ServiceTypes>({});
const serviceCategories = ref<ServiceCategories>({});
const packageId = ref<number | string>(0);
const currency = ref('USD');
const currencySymbol = ref('$');
siteStore.setPageHeading('Order License');
siteStore.setTitle('Order License');
const getCatId = computed(() => {
    for (const catId in serviceCategories.value) {
        if (serviceCategories.value[catId].category_tag == catTag.value) {
            return catId;
        }
    }
    return 0;
});
const getServiceTypes = computed(() => {
    const catId = getCatId.value;
    console.log(catId);
    let types: ServiceTypes = {};
    for (const serviceId in serviceTypes.value) {
        if (serviceTypes.value[serviceId].services_category == catId && enabledServices.includes(Number(serviceId)) && serviceTypes.value[serviceId].services_buyable == '1' && String(serviceTypes.value[serviceId].services_hidden) == '0') {
            types[serviceId] = serviceTypes.value[serviceId];
        }
    }
    return types;
});
const getLicenses = ref<GetLicenses>({
    directadmin: {
        name: 'DirectAdmin',
        description: 'DirectAdmin is a graphical web-based web hosting control panel allowing administration of websites through a web browser. The software is configurable to enable standalone, reseller, and shared web hosting from a single instance.',
        image: imageDirectAdmin,
        order: 1,
    },
    softaculous: {
        name: 'Softaculous',
        description: 'Softaculous is a commercial script library that automates the installation of commercial and open source web applications to a website. Softaculous scripts are executed from the administration area of a website control panel, typically via an interface tool such as cPanel, Plesk, H-Sphere, DirectAdmin and InterWorx.',
        image: imageSoftaculous,
        order: 2,
    },
    parallels: {
        name: 'Parallel Plesk',
        description: 'Professional control panel that gives web-designers, web-masters and website owners tools to manage their servers, sites and applications. The only hosting solution that will grow with your business from a single site and servers to a multi-server cloud solution and millions of users. The professionals choice for growing businesses.',
        image: imagePlesk,
        order: 3,
    },
    cloudlinux: {
        name: 'CloudLinux',
        description: 'CloudLinux OS is a commercial Linux distribution marketed to shared hosting providers. It is developed by software company CloudLinux, Inc. CloudLinux OS is based on the CentOS operating system; it uses the OpenVZ kernel and the rpm package manager.',
        image: imageCloudLinux,
        order: 4,
    },
    cpanel: {
        name: 'cPanel',
        description: 'cPanel is a web hosting control panel software developed by cPanel, LLC. It provides a graphical interface and automation tools designed to simplify the process of hosting a web site to the website owner or the "end user". It enables administration through a standard web browser using a three-tier structure.',
        image: imageCpanel,
        order: 5,
    },
    litespeed: {
        name: 'LiteSpeed',
        description: 'LiteSpeed Web Server, is a proprietary web server software. It is the 4th most popular web server, estimated to be used by 10% of websites as of July 2021. LSWS is developed by privately held LiteSpeed Technologies.',
        image: imageLitespeed,
        order: 6,
    },
});

type LicenseFieldMap = Record<string, LicenseField>;

interface GetLicensesRow {
    name: string;
    description: string;
    image: string;
    order: number;
}
interface GetLicenses {
    [key: string]: GetLicensesRow;
}

interface ServiceCategory {
    category_id: number;
    category_name: string;
    category_tag: string;
    category_module: string;
}

interface ServiceCategories {
    [key: string]: ServiceCategory;
}

interface Service {
    services_id: number;
    services_name: string;
    services_cost: number;
    services_field2?: string;
    services_category: number;
}

interface LicenseField {
    services_name: string;
    services_cost: number;
    services_details?: string;
}

function updateBreadcrums() {
    if (catTag.value == '') {
        step.value = 'license_types';
    } else {
        step.value = 'order_form';
    }
    if (step.value == 'license_types') {
        siteStore.setBreadcrums([
            ['/home', 'Home'],
            [`/${moduleLink(module)}`, 'Licenses List'],
            [`/${moduleLink(module)}/order`, 'Select License Type'],
        ]);
    } else {
        if (!Object.keys(getServiceTypes.value).includes(packageId.value as string)) {
            packageId.value = Object.keys(getServiceTypes.value)[0];
        }
        siteStore.setBreadcrums([
            ['/home', 'Home'],
            [`/${moduleLink(module)}`, 'Licenses List'],
            [`/${moduleLink(module)}/order`, 'Select License Type'],
            [`/licenses/order/${catTag.value}`, 'Order License'],
        ]);
    }
}

function normalizeCost(cost: number, currency: string): number {
    return cost;
    //return currency === 'USD' ? cost : convertCurrency(cost, currency).getAmount().toFloat();
}

function updateCoupon() {
    if (lastCoupon.value != coupon.value) {
        lastCoupon.value = coupon.value;
        (document.getElementById('couponimg') as unknown as HTMLImageElement).src = `https://my.interserver.net/validate_coupon.php?module=${module}&coupon=${coupon.value}`;
        fetch(`https://my.interserver.net/ajax/coupon_info.php?module=${module}&coupon=${encodeURIComponent(coupon.value)}`)
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

function updatePrice() {}

function checkAvailability() {}

function orderLicenseType(type: string | number) {
    step.value = 'order_form';
    updateBreadcrums();
    router.push(`/licenses/order/${type}`);
}

function submitForm() {
    step.value = 'order_confirm';
}

function submitLicenseForm() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/licenses/order`, {
                tos: tos.value,
                frequency: frequency.value,
                comment: comment.value,
                coupon: coupon.value,
                ip: ip.value,
                package: packageId.value,
            })
            .then((response) => {
                Swal.close();
                console.log('Response:');
                console.log(response);
                if (response['success'] == true) {
                    router.push(`/cart/${response.iids.join(',')}`);
                }
            });
    } catch (error: any) {
        Swal.close();
        console.log('caught error:');
        console.log(error);
    }
}

function editForm() {}

function loadLicenseData() {
    fetchWrapper
        .get(`${baseUrl}/licenses/order`)
        .then((response) => {
            console.log('Response:');
            console.log(response);
            packageCosts.value = response.packageCosts;
            serviceTypes.value = response.serviceTypes;
            serviceCategories.value = response.serviceCategories;
            currencySymbol.value = response.currencySymbol;
            for (const serviceId in serviceTypes.value) {
                if (serviceCategories.value[serviceTypes.value[serviceId].services_category]) {
                    if (serviceCategories.value[serviceTypes.value[serviceId].services_category].category_tag == 'litespeed') {
                        serviceTypes.value[serviceId].services_name = serviceTypes.value[serviceId].services_name.replace(/LiteSpeed /i, '');
                    } else if (serviceCategories.value[serviceTypes.value[serviceId].services_category].category_tag == 'directadmin') {
                        serviceTypes.value[serviceId].services_name = serviceTypes.value[serviceId].services_name.replace(/DirectAdmin /i, '');
                    } else if (serviceCategories.value[serviceTypes.value[serviceId].services_category].category_tag == 'parallels') {
                        serviceTypes.value[serviceId].services_name = serviceTypes.value[serviceId].services_name.replace(/Plesk v12 /i, '');
                    } else if (serviceCategories.value[serviceTypes.value[serviceId].services_category].category_tag == 'cpanel') {
                        serviceTypes.value[serviceId].services_name = serviceId === '10682' ? `${serviceTypes.value[serviceId].services_name} Server` : `${serviceTypes.value[serviceId].services_name.replace(/Cloud /i, '')} VPS`;
                    } else if (serviceCategories.value[serviceTypes.value[serviceId].services_category].category_tag == 'softaculous') {
                        serviceTypes.value[serviceId].services_name = serviceId === '5006' ? `${serviceTypes.value[serviceId].services_name} Server (External)` : `${serviceTypes.value[serviceId].services_name} (External)`;
                    }
                }
            }
            updateBreadcrums();
        })
        .catch((error: any) => {
            console.error('Got Error: ', error);
        });
}

watch(
    () => route.params.catTag,
    () => updateBreadcrums()
);

updateBreadcrums();
loadLicenseData();
</script>

<template>
    <template v-if="!step || step == 'license_types'">
        <div class="card-columns">
            <div v-for="(details, key) in getLicenses" :key="key" class="card">
                <div class="card-header">
                    <div class="p-1">
                        <img class="card-title card-img-top" :src="details.image" alt="Card image cap" style="border-bottom: 0.1em solid #c6cbd1; width: 40% !important; height: 50px" />
                        <div class="card-tools float-right">
                            <button style="position: relative; top: 10px" type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body text-center" style="height: 270px">
                    <h4>
                        <u>{{ details.name }}</u>
                    </h4>
                    <p class="card-text text-left text-sm">{{ details.description }}</p>
                    <div class="license_footer">
                        <div class="order-button">
                            <router-link :to="'/' + moduleLink(module) + '/order/' + key" class="btn order">Order Now</router-link>
                            <!--
                            <a href="#" class="btn order" @click.prevent="orderLicenseType(key)">Order Now</a>
                            -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else-if="step == 'order_form'">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="material-icons" style="position: relative; top: 5px">card_membership</i>
                                Order {{ getLicenses[catTag]?.name }} License
                            </h3>
                            <div class="card-tools float-right">
                                <router-link to="/licenses/order" class="btn btn-custom text-sm" data-toggle="tooltip" title="Go Back" style="position: relative; top: 5px"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="license_form" method="post" class="license_form_init" @submit.prevent="submitForm">
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label text-right">Package<span class="text-danger"> *</span></label>
                                <div class="col-sm-9 input-group">
                                    <div v-for="(package_details, id) in getServiceTypes" :key="id" class="form-group w-100">
                                        <div class="icheck-success d-inline">
                                            <input :id="package_details.services_name" v-model="packageId" type="radio" class="form-check-input" name="package" :value="id" />
                                            <label class="more-info font-weight-normal" :for="package_details.services_name">{{ package_details.services_name }}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label text-right">IP Address<span class="text-danger"> *</span></label>
                                <div class="col-sm-9 input-group">
                                    <input v-model="ip" type="text" name="ip" class="form-control form-control-sm" placeholder="IP Address" required @change="updatePrice()" />
                                </div>
                            </div>
                            <div v-if="getLicenses[catTag]?.name !== 'cPanel'" id="coupon_row" class="form-group row">
                                <label class="col-md-3 col-form-label text-right">Coupon Code</label>
                                <div class="col-md-9">
                                    <input id="coupon" v-model="coupon" type="text" class="form-control form-control-sm" name="coupon" placeholder="Coupon Code" @change="updateCoupon()" />
                                </div>
                                <label class="col-md-3"></label>
                                <div class="col-md-9">
                                    <button class="btn bg-secondary btn-sm mr-2 mt-1" @click="checkAvailability()">Check availability</button>
                                    <img id="couponimg" :src="'https://my.interserver.net/validate_coupon.php?module=vps&coupon=' + coupon" height="20" width="20" alt="" />
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center">
                                    <button type="submit" name="Submit" class="btn btn-order px-3 py-2 text-sm">Continue</button>
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
                            <h3 class="card-title py-2"><i class="fa fa-shopping-cart">&nbsp;</i>Order Summary</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body text-md">
                        <div class="row mb-3">
                            <div class="col-md-6 package_name">{{ serviceTypes[Number(packageId)]?.services_name }}</div>
                            <div class="col text-bold text-right">1 Month</div>
                        </div>
                        <div class="row mb-3">
                            <div id="hostname_display" class="col-md-6">Package Cost</div>
                            <div class="col package_cost text-bold text-right">{{ currencySymbol }}{{ serviceTypes[Number(packageId)]?.services_cost }}</div>
                        </div>
                        <div id="couponpricerownew" class="row coupon-display mb-3">
                            <div id="couponpricetext" class="col-md-6"></div>
                            <div id="couponprice" class="col text-bold text-right"></div>
                        </div>
                        <hr />
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalprice" class="col text-bold total_cost text-right text-lg">{{ currencySymbol }}{{ serviceTypes[Number(packageId)]?.services_cost }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="catTag == 'litespeed' || catTag == 'directadmin'" class="card">
                    <div class="p-1">
                        <div class="card-header py-2">
                            <h3 class="card-title"><i class="fa fa-suitcase">&nbsp;</i>Package Details</h3>
                        </div>
                    </div>
                    <div class="card-body text-md">
                        <div class="row mb-3">
                            <div class="col-md-12 pkg_det" v-html="serviceTypes[Number(packageId)]?.services_field2"></div>
                        </div>
                    </div>
                </div>
                <div v-if="catTag === 'cpanel'" class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title"><i class="fas fa-lightbulb">&nbsp;</i>Important Note</h3>
                        </div>
                    </div>
                    <div class="card-body">
                        <p>Internal use licenses only. External use will result in cancellation.</p>
                        <p>If you wish to purchase licenses for use outside our network please visit the license partners website directly.</p>
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
                            <h3 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form ref="licenseForm" method="post" class="license_form_confirm" @submit.prevent="submitLicenseForm">
                            <table class="table-sm table-bordered table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="text-md float-left" style="position: relative; top: 5px">{{ serviceTypes[Number(packageId)].services_name }}</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" data-toggle="tooltip" title="Edit details" @click="editForm()"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div class="text-bold text-md package_cost"></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="text-md">{{ ip }}</div>
                                        </td>
                                        <td>
                                            <div class="text-md text-bold">1 Month(s)</div>
                                        </td>
                                    </tr>
                                    <tr v-if="coupon">
                                        <td>
                                            <div class="text-md">Coupon Used</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ coupon }}<img id="couponimg" src="https://my.interserver.net/validate_coupon.php?module=webhosting'" style="padding-left: 10px" height="20" width="20" alt="" /></div>
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
                                            <div class="text-lg">Total</div>
                                        </td>
                                        <td>
                                            <div id="totalprice" class="text-bold text-lg"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr />
                            <div class="pb-1 pt-3">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">The subscription will automatically renew after <b>every month at</b> <span class="package_cost text-bold"></span> until canceled.</p>
                                <p class="text-muted text-xs">By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.</p>
                                <p class="icheck-success text-bold text-center">
                                    <input id="tos" v-model="tos" type="checkbox" name="tos" style="margin: 0 5px; display: inline" value="yes" />
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </p>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center">
                                    <router-link :to="`/licenses/order/${catTag}`" class="btn btn-custom btn-sm px-3 py-2 mr-2" data-toggle="tooltip" title="Go Back" style=""><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Go Back&nbsp;&nbsp;</router-link>
                                    <input type="submit" name="Submit" value="Place Order" class="btn btn-sm btn-green px-3 py-2" />
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
