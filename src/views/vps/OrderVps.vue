<script setup lang="ts">
//import { storeToRefs } from 'pinia';
import { ref, watch, computed, onMounted } from 'vue';
//import { Form, Field } from 'vee-validate';
//import * as Yup from 'yup';
import $ from 'jquery';
import jQuery from 'jquery';
import Swal from 'sweetalert2';
import { fetchWrapper } from '../../helpers/fetchWrapper';

import { useSiteStore } from '../../stores/site.store';

import { ServiceType, ServiceTypes } from '../../types/view-service-common';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const siteStore = useSiteStore();
siteStore.setPageHeading('Order VPS');
siteStore.setTitle('Order VPS');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/vps', 'VPS List'],
    ['/vps/order', 'Order VPS'],
]);
const baseUrl = siteStore.getBaseUrl();
/* const billingCycle = ref({
    1: 'Monthly',
    3: '3 Months',
    6: '6 Months (5% off)',
    12: 'Yearly (10% off)',
    24: '24 Months (15% off)',
    36: '36 Months (20% off)',
}); */
const controlpanel = ref({
    none: 'None',
    da: 'DirectAdmin',
    cpanel: 'CPanel',
});
const locationNames = ref<LocationNames>({
    1: 'New Jersey',
    2: 'Los Angeles',
    3: 'Equinix NY4',
});
const locationStock = ref<LocationStock>({
    1: { kvm: true, kvmstorage: true, hyperv: true },
    2: { kvm: true, kvmstorage: false, hyperv: true },
    3: { kvm: false, kvmstorage: false, hyperv: false },
});
const platformPackages = ref<PlatformPackages>({
    kvm: 32,
    kvmstorage: 57,
    hyperv: 54,
});
const platformNames = ref<PlatformNames>({
    kvm: 'KVM',
    kvmstorage: 'KVM Storage',
    hyperv: 'HyperV',
});
const packageCosts = ref<PackageCosts>({
    32: 10,
    54: 10,
    57: 6,
});
const osNames = ref<OsNames>({
    windows: 'Windows',
    almalinux: 'Almalinux',
});
const osTemplates = ref<Templates>({
    hyperv: {
        windows: { Windows2019Standard: '2019 Standard', Windows2022: '2022' },
    },
    kvm: {},
    kvmstorage: {},
});
const currency = ref('USD');
const currencySymbol = ref('$');
const serviceTypes = ref<ServiceTypes>({});
const maxSlices = ref(16);
const hdStorageSlice = ref(1000);
const cpanelCost = ref(20);
const daCost = ref(8);
const bwType = ref(2);
const bwTotal = ref(2);
const bwSlice = ref(2000);
const hdSlice = ref(30);
const ramSlice = ref(2048);
const vpsSliceSsdOvzCost = ref(6);
const vpsSliceOvzCost = ref(6);
const vpsSliceSsdVirtuozzoCost = ref(6);
const vpsSliceVirtuozzoCost = ref(6);
const vpsSliceHypervCost = ref(6);
const vpsSliceVmwareCost = ref(6);
const vpsSliceLxcCost = ref(6);
const vpsSliceXenCost = ref(6);
const vpsSliceKvmLCost = ref(6);
const vpsSliceKvmStorageCost = ref(6);
const vpsNyCost = ref(3);
const vpsSliceKvmWCost = ref(6);
const totalCost = ref(0.0);
const ipv6_only_discount = ref(1);
const couponInfo = ref<CouponInfo>({});
const lastCoupon = ref('');
const step = ref('orderform');
// validation response extra fields
const validationSuccess = ref(false);
const couponCode = ref('');
const custid = ref(0);
const errors = ref([]);
const monthlyServiceCost = ref(6);
const originalCost = ref(6);
const originalSliceCost = ref(6);
const repeatServiceCost = ref(6);
const repeatSliceCost = ref(6);
const serviceCost = ref(6);
const sliceCost = ref(6);
// form fields
const serviceType = ref(0);
const slices = ref(1);
const vpsPlatform = ref('kvm');
const location = ref(1);
const osVersion = ref('');
const osDistro = ref('ubuntu');
const hostname = ref('server.domain.com');
const osVersionSelect = ref({});
const coupon = ref('');
const rootpass = ref('');
const curSsd = ref(0);
const curControl = ref('');
const period = ref(1);
const couponPriceText = ref('');
const couponPriceLabel = ref('Coupon Discount:');
const sliceCostHtml = ref('$6 per slice');
const cycleDiscountText = ref('');

interface CouponInfo {
    applies?: number | string;
    type?: number | string;
    amount?: number | string;
    onetime?: number | string;
    usable?: number | string;
    used?: number | string;
    amounts?: {
        [key: string]: number | string;
    };
}

interface VpsOrderResponse {
    bwSlice: number;
    bwTotal: number;
    bwType: number;
    cpanelCost: number;
    currency: string;
    currencySymbol: string;
    daCost: number;
    hdSlice: number;
    hdStorageSlice: number;
    locationNames: LocationNames;
    locationStock: LocationStock;
    maxSlices: number;
    osNames: OsNames;
    packageCosts: PackageCosts;
    platformNames: PlatformNames;
    platformPackages: PlatformPackages;
    ramSlice: number;
    serviceTypes: ServiceTypes;
    templates: Templates;
    vpsNyCost: number;
    vpsSliceHypervCost: number;
    vpsSliceKvmLCost: number;
    vpsSliceKvmStorageCost: number;
    vpsSliceKvmWCost: number;
    vpsSliceLxcCost: number;
    vpsSliceOvzCost: number;
    vpsSliceSsdOvzCost: number;
    vpsSliceSsdVirtuozzoCost: number;
    vpsSliceVirtuozzoCost: number;
    vpsSliceVmwareCost: number;
    vpsSliceXenCost: number;
}
const controlCost = computed(() => {
    if (curControl.value == 'cpanel') {
        return cpanelCost.value;
    } else if (curControl.value == 'da') {
        return daCost.value;
    } else {
        return 0;
    }
});
const slicesRange = computed(() => {
    const arr: number[] = [];
    for (let i = 1; i <= maxSlices.value; i++) {
        arr.push(i);
    }
    return arr;
});
const totalCostDisplay = computed(() => {
    return currencySymbol.value + Number(totalCost.value).toFixed(2);
});
watch([osTemplates, vpsPlatform, osDistro, osVersion, couponInfo, slices, location], ([newTemplates, newPlatform, newDistro, newVersion, newCouponInfo, newSlices, newLocation], [oldTemplates, oldPlatform, oldDistro, oldVersion, oldCouponInfo, oldSlices, oldLocation]) => {
    let entries, lastEntry, lastKey, lastValue;
    entries = Object.entries(newTemplates[newPlatform]);
    console.log(entries);
    if (entries.length == 0) {
        //newDistro == '';
        osVersionSelect.value = {};
        return;
    }
    if (typeof newTemplates[newPlatform][newDistro] == 'undefined') {
        console.log(newTemplates[newPlatform]);
        lastEntry = entries[entries.length - 1];
        console.log(lastEntry);
        [lastKey, lastValue] = lastEntry;
        console.log([lastKey, lastValue]);
        newDistro = lastKey;
        osDistro.value = lastKey;
    }
    entries = Object.entries(newTemplates[newPlatform][newDistro]);
    console.log(entries);
    if (entries.length == 0) {
        osVersionSelect.value = {};
    }
    if (typeof newTemplates[newPlatform][newDistro][newVersion] == 'undefined') {
        console.log(newTemplates[newPlatform][newVersion]);
        lastEntry = entries[entries.length - 1];
        console.log(lastEntry);
        [lastKey, lastValue] = lastEntry;
        console.log([lastKey, lastValue]);
        newVersion = lastKey;
        osVersion.value = lastKey;
    }
    osVersionSelect.value = newTemplates[newPlatform][newDistro];

    if (vpsPlatform.value == 'openvz') {
        if (curSsd.value == 1) {
            sliceCost.value = vpsSliceSsdOvzCost.value;
        } else {
            sliceCost.value = vpsSliceOvzCost.value;
        }
    } else if (vpsPlatform.value == 'kvm') {
        if (osDistro.value == 'windows') {
            sliceCost.value = vpsSliceKvmWCost.value;
        } else {
            sliceCost.value = vpsSliceKvmLCost.value;
        }
    } else if (vpsPlatform.value == 'kvmstorage') {
        sliceCost.value = vpsSliceKvmStorageCost.value;
    } else if (vpsPlatform.value == 'xen') {
        sliceCost.value = vpsSliceXenCost.value;
    } else if (vpsPlatform.value == 'lxc') {
        sliceCost.value = vpsSliceLxcCost.value;
    } else if (vpsPlatform.value == 'vmware') {
        sliceCost.value = vpsSliceVmwareCost.value;
    } else if (vpsPlatform.value == 'hyperv') {
        sliceCost.value = vpsSliceHypervCost.value;
    } else if (vpsPlatform.value == 'virtuozzo') {
        if (curSsd.value == 1) {
            sliceCost.value = vpsSliceSsdVirtuozzoCost.value;
        } else {
            sliceCost.value = vpsSliceVirtuozzoCost.value;
        }
    }

    if (Number(location.value).toString() == '3') {
        sliceCost.value = sliceCost.value * vpsNyCost.value;
    }
    sliceCostHtml.value = `${currencySymbol.value + Number(sliceCost.value).toString()} Per Slice`;
    // later month slice costs
    serviceCost.value = sliceCost.value;
    // first month slice cost
    let first_slice = sliceCost.value;
    let monthly_slice_cost = sliceCost.value;
    couponPriceLabel.value = '';
    couponPriceText.value = '';
    if (typeof couponInfo.value.applies != 'undefined') {
        if (couponInfo.value.type == 3) {
            sliceCostHtml.value = `<del style="color: red;">${currencySymbol.value}${sliceCost.value}</del> Per Slice`;
            couponPriceLabel.value = 'Price';
            couponPriceText.value = `${currencySymbol.value + couponInfo.value.amount} per slice`;
            first_slice = Number(couponInfo.value.amount);
        } else if (couponInfo.value.type == 2) {
            couponPriceText.value = `-${currencySymbol.value}${couponInfo.value.amount}`;
            couponPriceLabel.value = 'Discount';
            first_slice = first_slice - Number(couponInfo.value.amount);
        } else if (couponInfo.value.type == 1) {
            couponPriceText.value = `${couponInfo.value.amount}% Off`;
            couponPriceLabel.value = 'Discount';
            first_slice = first_slice * ((100 - Number(couponInfo.value.amount)) / 100);
        }
        if (first_slice < 0.01 && first_slice > 0) {
            first_slice = 0.01;
        }
        if (couponInfo.value.amount != 0.01) {
            sliceCost.value = first_slice;
        } else if (vpsPlatform.value == 'kvm' || vpsPlatform.value == 'hyperv') {
            first_slice = sliceCost.value * 0.5;
            couponPriceText.value = '50% Off';
        }
        if (couponInfo.value.onetime == 0) {
            monthly_slice_cost = sliceCost.value;
        } else {
            couponPriceLabel.value = `First Month ${couponPriceLabel.value}`;
        }
        couponPriceLabel.value = `Coupon ${couponPriceLabel.value}`;
    }
    serviceCost.value = first_slice + sliceCost.value * (slices.value - 1);
    monthlyServiceCost.value = monthly_slice_cost * slices.value;
    cycleDiscountText.value = '';
    if (period.value >= 36) {
        cycleDiscountText.value = '20% Off';
        serviceCost.value = serviceCost.value * 0.8;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.8;
    } else if (period.value >= 24) {
        cycleDiscountText.value = '15% Off';
        serviceCost.value = serviceCost.value * 0.85;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.85;
    } else if (period.value >= 12) {
        cycleDiscountText.value = '10% Off';
        serviceCost.value = serviceCost.value * 0.9;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.9;
    } else if (period.value >= 6) {
        cycleDiscountText.value = '5% Off';
        serviceCost.value = serviceCost.value * 0.95;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.95;
    }
    if (period.value > 1) {
        serviceCost.value = serviceCost.value + (period.value - 1) * monthlyServiceCost.value;
    }
    totalCost.value = Number(serviceCost.value);
    if (controlCost.value > 0) {
        totalCost.value = totalCost.value + controlCost.value * period.value;
    }
    totalCost.value = Number(Number(totalCost.value).toFixed(2));
});
const getBandwidth = computed(() => {
    const VPS_SLICE_BW_TEMP = bwSlice.value;
    const bandwidthamount = VPS_SLICE_BW_TEMP * slices.value;
    const VPS_BW_TYPE_TEMP = bwType.value;
    const VPS_BW_TOTAL_TEMP = bwTotal.value;
    let slice_amount;
    if (VPS_BW_TYPE_TEMP === VPS_BW_TOTAL_TEMP)
        if (bandwidthamount >= 1000) slice_amount = ' Gb';
        else slice_amount = ' Mb';
    else slice_amount = ' Mbps';
    return bandwidthamount + slice_amount;
});

interface PlatformPackages {
    [key: string]: number;
}

interface PlatformNames {
    [key: string]: string;
}

interface PackageCosts {
    [key: number]: number;
}

interface LocationStock {
    [key: number]: {
        [key: string]: boolean;
    };
}

interface LocationNames {
    [key: number]: string;
}

interface OsNames {
    [key: string]: string;
}

interface Templates {
    [key: string]: {
        [key: string]: {
            [key: string]: string;
        };
    };
}

function updateHostname() {}

function onSubmit() {
    try {
        fetchWrapper
            .put(`${baseUrl}/vps/order`, {
                serviceType: serviceType.value,
                slices: slices.value,
                vpsPlatform: vpsPlatform.value,
                location: location.value,
                osVersion: osVersion.value,
                osDistro: osDistro.value,
                hostname: hostname.value,
                coupon: coupon.value,
                rootpass: rootpass.value,
                curSsd: curSsd.value,
                curControl: curControl.value,
                period: period.value,
            })
            .then((response) => {
                console.log('vps order validation success');
                console.log(response);
                validationSuccess.value = response['continue'];
                controlpanel.value = response.controlpanel;
                coupon.value = response.coupon;
                couponCode.value = response.coupon_code;
                custid.value = response.custid;
                errors.value = response.errors;
                hostname.value = response.hostname;
                location.value = response.location;
                monthlyServiceCost.value = response.monthly_service_cost;
                originalCost.value = response.original_cost;
                originalSliceCost.value = response.original_slice_cost;
                osDistro.value = response.os;
                period.value = response.period;
                vpsPlatform.value = response.platform;
                repeatServiceCost.value = response.repeat_service_cost;
                repeatSliceCost.value = response.repeat_slice_cost;
                rootpass.value = response.rootpass;
                serviceCost.value = response.service_cost;
                serviceType.value = response.service_type;
                sliceCost.value = response.slice_cost;
                slices.value = response.slices;
                osVersion.value = response.version;
                if (response.continue == false) {
                    Swal.fire({
                        icon: 'error',
                        html: `Got error ${response.errors.join('<br>')}`,
                    });
                } else {
                    step.value = 'order_confirm';
                }
            });
    } catch (error: any) {
        console.log('vps order validation failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.message}`,
        });
    }
}

function onSubmitConfirmation() {
    try {
        fetchWrapper
            .post(`${baseUrl}/vps/order`, {
                serviceType: serviceType.value,
                slices: slices.value,
                vpsPlatform: vpsPlatform.value,
                location: location.value,
                osVersion: osVersion.value,
                osDistro: osDistro.value,
                hostname: hostname.value,
                coupon: coupon.value,
                rootpass: rootpass.value,
                curSsd: curSsd.value,
                curControl: curControl.value,
                period: period.value,
            })
            .then((response) => {
                console.log('vps order validation success');
                console.log(response);
                // response = {'success','message','total_cost','iid','iids','real_iids','serviceid','invoice_description','cj_params'}
                if (response.success == true) {
                    router.push(`/cart/${response.iids.join(',')}`);
                    // forward to cart or w/e
                } else {
                    // display 'message'
                    Swal.fire({
                        icon: 'error',
                        html: `Got error ${response.message}`,
                    });
                }
            });
    } catch (error: any) {
        console.log('vps order  failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.message}`,
        });
    }
}

function updateCoupon() {
    if (lastCoupon.value != coupon.value) {
        lastCoupon.value = coupon.value;
        (document.getElementById('couponimg') as unknown as HTMLImageElement).src = `https://my.interserver.net/validate_coupon.php?module=vps&coupon=${coupon.value}`;
        $.getJSON(`https://my.interserver.net/ajax/coupon_info.php?module=vps&coupon=${coupon.value}`, {}, function (json: CouponInfo) {
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

function update_vps_choices() {
    if (vpsPlatform.value == 'openvz' || vpsPlatform.value == 'virtuozzo') {
        jQuery('#hostnamerow').css('display', 'table-row');
        jQuery('#ssdrow').css('display', 'table-row');
        jQuery('#hostnamerownew').show();
        jQuery('#ssdrownew').show();
        if (curSsd.value == 1) {
            jQuery('#ssdpricerow').css('display', 'table-row');
            jQuery('#ssdpricerownew').show();
        } else {
            jQuery('#ssdpricerow').css('display', 'none');
            jQuery('#ssdpricerownew').hide();
        }
    } else {
        jQuery('#hostnamerow').css('display', 'none');
        jQuery('#hostnamerownew').hide();
        jQuery('#ssdrow').css('display', 'none');
        jQuery('#ssdrownew').hide();
        jQuery('#ssdpricerownew').hide();
        jQuery('#ssdpricerow').css('display', 'none');
        if (curSsd.value == 1) {
            curSsd.value = 0;
        }
    }
    if (osDistro.value == 'windows') {
        jQuery('#controlpanelrow').css('display', 'none');
        jQuery('#controlpanelrownew').hide();
    } else {
        jQuery('#controlpanelrow').css('display', 'table-row');
        jQuery('#controlpanelrownew').show();
    }
    if (osDistro.value == 'windows' && vpsPlatform.value != 'hyperv') {
        jQuery('#rootpassrow').css('display', 'none');
        jQuery('#rootpassrownew').hide();
    } else {
        jQuery('#rootpassrow').css('display', 'table-row');
        jQuery('#rootpassrownew').show();
    }
    if (vpsPlatform.value == 'openvz') {
        if (curSsd.value == 1) {
            sliceCost.value = vpsSliceSsdOvzCost.value;
        } else {
            sliceCost.value = vpsSliceOvzCost.value;
        }
    } else if (vpsPlatform.value == 'kvm') {
        if (osDistro.value == 'windows') {
            sliceCost.value = vpsSliceKvmWCost.value;
        } else {
            sliceCost.value = vpsSliceKvmLCost.value;
        }
    } else if (vpsPlatform.value == 'kvmstorage') sliceCost.value = vpsSliceKvmStorageCost.value;
    else if (vpsPlatform.value == 'xen') sliceCost.value = vpsSliceXenCost.value;
    else if (vpsPlatform.value == 'lxc') sliceCost.value = vpsSliceLxcCost.value;
    else if (vpsPlatform.value == 'vmware') sliceCost.value = vpsSliceVmwareCost.value;
    else if (vpsPlatform.value == 'hyperv') sliceCost.value = vpsSliceHypervCost.value;
    else if (vpsPlatform.value == 'virtuozzo')
        if (curSsd.value == 1) sliceCost.value = vpsSliceSsdVirtuozzoCost.value;
        else sliceCost.value = vpsSliceVirtuozzoCost.value;
    if (location.value == 3) sliceCost.value = sliceCost.value * vpsNyCost.value;
    if (controlCost.value > 0) {
        jQuery('#controlpanelcost').text(currencySymbol.value + controlCost.value);
        jQuery('#controlpanelcostnew').text(currencySymbol.value + controlCost.value);
        jQuery('#controlpanelpricerownew').show();
    } else {
        jQuery('#controlpanelcost').text('');
        jQuery('#controlpanelcostnew').text('');
        jQuery('#controlpanelpricerownew').hide();
    }
    jQuery('#slicecost').text(`${currencySymbol.value + sliceCost.value} Per Slice`);
    jQuery('#slicecosttb').text(currencySymbol.value + sliceCost.value);
    // later month slice costs
    serviceCost.value = sliceCost.value;
    // first month slice cost
    let first_slice = sliceCost.value;
    let monthly_slice_cost = sliceCost.value;
    if (typeof couponInfo.value.applies != 'undefined') {
        if (couponInfo.value.type == 3) {
            jQuery('#couponpricerow').css('display', 'table-row');
            jQuery('#couponpricerownew').show();
            jQuery('#slicecost').html(`<del style="color: red;">${currencySymbol.value}${sliceCost.value}</del> Per Slice`);
            couponPriceLabel.value = 'Price';
            jQuery('#couponprice').html(`${currencySymbol.value + couponInfo.value.amount} per slice`);
            jQuery('#couponpricenew').val(`${couponInfo.value.amount} per slice`);
            first_slice = Number(couponInfo.value.amount);
        } else if (couponInfo.value.type == 2) {
            jQuery('#couponpricerow').css('display', 'table-row');
            jQuery('#couponpricerownew').show();
            jQuery('#couponprice').text(`-${currencySymbol.value}${couponInfo.value.amount}`);
            couponPriceLabel.value = 'Discount';
            jQuery('#couponpricenew').val(`-(${couponInfo.value.amount})`);
            first_slice = first_slice - Number(couponInfo.value.amount);
        } else if (couponInfo.value.type == 1) {
            jQuery('#couponpricerow').css('display', 'table-row');
            jQuery('#couponpricerownew').show();
            jQuery('#couponprice').text(`${couponInfo.value.amount}% Off`);
            jQuery('#couponpricenew').val(`${couponInfo.value.amount}% Off`);
            couponPriceLabel.value = 'Discount';
            first_slice = first_slice * ((100 - Number(couponInfo.value.amount)) / 100);
        } else {
            jQuery('#couponpricerow').css('display', 'none');
            jQuery('#couponpricerownew').hide();
            jQuery('#couponprice').text('');
            jQuery('#couponpricenew').val('');
        }
        if (first_slice < 0.01 && first_slice > 0) {
            first_slice = 0.01;
        }
        if (couponInfo.value.amount != 0.01) {
            sliceCost.value = first_slice;
        } else if (vpsPlatform.value == 'kvm' || vpsPlatform.value == 'hyperv') {
            first_slice = sliceCost.value * 0.5;
            jQuery('#couponprice').text('50% Off');
            jQuery('#couponpricenew').val('50% Off');
        }
        if (couponInfo.value.onetime == 0) {
            monthly_slice_cost = sliceCost.value;
        } else {
            couponPriceLabel.value = `First Month ${couponPriceLabel.value}`;
        }
        jQuery('#couponpricetext').text(`Coupon ${couponPriceLabel.value}`);
        jQuery('#couponpricetextnew').text(`Coupon ${couponPriceLabel.value}`);
    } else {
        jQuery('#couponpricerow').css('display', 'none');
        jQuery('#couponpricerownew').hide();
        jQuery('#couponprice').text('');
        jQuery('#couponpricenew').val('');
    }
    serviceCost.value = first_slice + sliceCost.value * (slices.value - 1);
    monthlyServiceCost.value = monthly_slice_cost * slices.value;
    if (period.value >= 36) {
        jQuery('#cyclediscount').text('20% Off');
        jQuery('#cyclediscountnew').text('20% Off');
        jQuery('#cyclediscountrow').css('display', 'table-row');
        jQuery('#cyclediscountrownew').show();
        serviceCost.value = serviceCost.value * 0.8;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.8;
    } else if (period.value >= 24) {
        jQuery('#cyclediscount').text('15% Off');
        jQuery('#cyclediscountnew').text('15% Off');
        jQuery('#cyclediscountrow').css('display', 'table-row');
        jQuery('#cyclediscountrownew').show();
        serviceCost.value = serviceCost.value * 0.85;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.85;
    } else if (period.value >= 12) {
        jQuery('#cyclediscount').text('10% Off');
        jQuery('#cyclediscountnew').text('10% Off');
        jQuery('#cyclediscountrow').css('display', 'table-row');
        jQuery('#cyclediscountrownew').show();
        serviceCost.value = serviceCost.value * 0.9;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.9;
    } else if (period.value >= 6) {
        jQuery('#cyclediscount').text('5% Off');
        jQuery('#cyclediscountnew').text('5% Off');
        jQuery('#cyclediscountrow').css('display', 'table-row');
        jQuery('#cyclediscountrownew').show();
        serviceCost.value = serviceCost.value * 0.95;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.95;
    } else {
        jQuery('#cyclediscountrownew').hide();
        jQuery('#cyclediscountrow').css('display', 'none');
        jQuery('#cyclediscount').text('');
        jQuery('#cyclediscountnew').text('');
    }
    if (period.value > 1) {
        serviceCost.value = serviceCost.value + (period.value - 1) * monthlyServiceCost.value;
    }

    totalCost.value = Number(serviceCost.value);
    if (controlCost.value > 0) {
        totalCost.value = totalCost.value + controlCost.value * period.value;
    }
    totalCost.value = Number(Number(totalCost.value).toFixed(2));
    jQuery('#totalcost').text(Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value }).format(Number(parseFloat(totalCost.value.toString()).toFixed(2))));
    jQuery('.totalcost_display').text(Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value }).format(Number(parseFloat(totalCost.value.toString()).toFixed(2))));
    jQuery('#totalcostnew').val(totalCost.value);
    jQuery('#total_cost_displa').val(totalCost.value);
    if ($('#package_name').length > 0) {
        $('#package_name').text(serviceTypes.value[get_package_id()].services_name);
    }
}

function update_vps_choices_order() {
    if (curSsd.value != jQuery('#ssd').val()) {
        curSsd.value = jQuery('#ssd').val() as number;
    }
    if (vpsPlatform.value == 'openvz' || vpsPlatform.value == 'virtuozzo') {
        jQuery('#hostnamerow').css('display', 'table-row');
        jQuery('#ssdrow').css('display', 'table-row');
        jQuery('#hostnamerownew').show();
        jQuery('#ssdrownew').show();
        if (curSsd.value == 1) {
            jQuery('#ssdpricerow').css('display', 'table-row');
            jQuery('#ssdpricerownew').show();
        } else {
            jQuery('#ssdpricerow').css('display', 'none');
            jQuery('#ssdpricerownew').hide();
        }
    } else {
        jQuery('#hostnamerow').css('display', 'none');
        jQuery('#hostnamerownew').hide();
        jQuery('#ssdrow').css('display', 'none');
        jQuery('#ssdrownew').hide();
        jQuery('#ssdpricerownew').hide();
        jQuery('#ssdpricerow').css('display', 'none');
        if (curSsd.value == 1) {
            curSsd.value = 0;
        }
    }
    if (vpsPlatform.value == 'openvz')
        if (curSsd.value == 1) sliceCost.value = vpsSliceSsdOvzCost.value;
        else sliceCost.value = vpsSliceOvzCost.value;
    else if (vpsPlatform.value == 'kvm')
        if (osDistro.value == 'windows') sliceCost.value = vpsSliceKvmWCost.value;
        else sliceCost.value = vpsSliceKvmLCost.value;
    else if (vpsPlatform.value == 'kvmstorage') sliceCost.value = vpsSliceKvmStorageCost.value;
    else if (vpsPlatform.value == 'xen') sliceCost.value = vpsSliceXenCost.value;
    else if (vpsPlatform.value == 'lxc') sliceCost.value = vpsSliceLxcCost.value;
    else if (vpsPlatform.value == 'vmware') sliceCost.value = vpsSliceVmwareCost.value;
    else if (vpsPlatform.value == 'hyperv') sliceCost.value = vpsSliceHypervCost.value;
    else if (vpsPlatform.value == 'virtuozzo')
        if (curSsd.value == 1) sliceCost.value = vpsSliceSsdVirtuozzoCost.value;
        else sliceCost.value = vpsSliceVirtuozzoCost.value;
    if (location.value == 3) sliceCost.value = sliceCost.value * vpsNyCost.value;
    if (controlCost.value > 0) {
        jQuery('#controlpanelcost').text(currencySymbol.value + controlCost.value);
    } else {
        jQuery('#controlpanelcost').text('');
    }
    jQuery('#slicecost').text(`${currencySymbol.value + sliceCost.value} Per Slice`);
    jQuery('#slicecosttb').text(currencySymbol.value + sliceCost.value);
    // later month slice costs
    serviceCost.value = sliceCost.value;
    // first month slice cost
    let first_slice = sliceCost.value;
    let monthly_slice_cost = sliceCost.value;
    monthlyServiceCost.value = serviceCost.value;
    if (typeof couponInfo.value.applies != 'undefined') {
        if (couponInfo.value.type == 3) {
            jQuery('#couponpricerow').css('display', 'table-row');
            jQuery('#couponpricerownew').show();
            jQuery('#slicecost').html(`<del style="color: red;">$${sliceCost.value}</del> Per Slice`);
            couponPriceLabel.value = 'Price';
            jQuery('#couponprice').html(`${currencySymbol.value + couponInfo.value.amount} per slice`);
            jQuery('#couponpricenew').val(`${couponInfo.value.amount} per slice`);
            first_slice = Number(couponInfo.value.amount);
        } else if (couponInfo.value.type == 2) {
            jQuery('#couponpricerow').css('display', 'table-row');
            jQuery('#couponpricerownew').show();
            jQuery('#couponprice').text(`-${currencySymbol.value}${couponInfo.value.amount}`);
            couponPriceLabel.value = 'Discount';
            jQuery('#couponpricenew').val(`-(${couponInfo.value.amount})`);
            first_slice = first_slice - Number(couponInfo.value.amount);
        } else if (couponInfo.value.type == 1) {
            jQuery('#couponpricerow').css('display', 'table-row');
            jQuery('#couponpricerownew').show();
            jQuery('#couponprice').text(`${couponInfo.value.amount}% Off`);
            jQuery('#couponpricenew').val(`${couponInfo.value.amount}% Off`);
            couponPriceLabel.value = 'Discount';
            first_slice = first_slice * ((100 - Number(couponInfo.value.amount)) / 100);
        } else {
            jQuery('#couponpricerow').css('display', 'none');
            jQuery('#couponpricerownew').hide();
            jQuery('#couponprice').text('');
            jQuery('#couponpricenew').val('');
        }
        if (first_slice < 0.01 && first_slice > 0) {
            first_slice = 0.01;
        }
        if (couponInfo.value.amount != 0.01) {
            sliceCost.value = first_slice;
        } else if (vpsPlatform.value == 'kvm' || vpsPlatform.value == 'kvmstorage' || vpsPlatform.value == 'hyperv') {
            first_slice = sliceCost.value * 0.5;
            jQuery('#couponprice').text('50% Off');
            jQuery('#couponpricenew').val('50% Off');
        }
        if (couponInfo.value.onetime == 0) {
            monthly_slice_cost = sliceCost.value;
        } else {
            couponPriceLabel.value = `First Month ${couponPriceLabel.value}`;
        }
        jQuery('#couponpricetext').text(`Coupon ${couponPriceLabel.value}`);
        jQuery('#couponpricetextnew').text(`Coupon ${couponPriceLabel.value}`);
    } else {
        jQuery('#couponpricerow').css('display', 'none');
        jQuery('#couponpricerownew').hide();
        jQuery('#couponprice').text('');
        jQuery('#couponpricenew').val('');
    }
    serviceCost.value = first_slice + sliceCost.value * (slices.value - 1);
    monthlyServiceCost.value = monthly_slice_cost * slices.value;
    if (period.value >= 36) {
        jQuery('#cyclediscount').text('20% Off');
        jQuery('#cyclediscountnew').text('20% Off');
        jQuery('#cyclediscountrow').css('display', 'table-row');
        jQuery('#cyclediscountrownew').show();
        serviceCost.value = serviceCost.value * 0.8;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.8;
    } else if (period.value >= 24) {
        jQuery('#cyclediscount').text('15% Off');
        jQuery('#cyclediscountnew').text('15% Off');
        jQuery('#cyclediscountrow').css('display', 'table-row');
        jQuery('#cyclediscountrownew').show();
        serviceCost.value = serviceCost.value * 0.85;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.85;
    } else if (period.value >= 12) {
        jQuery('#cyclediscount').text('10% Off');
        jQuery('#cyclediscountnew').text('10% Off');
        jQuery('#cyclediscountrow').css('display', 'table-row');
        jQuery('#cyclediscountrownew').show();
        serviceCost.value = serviceCost.value * 0.9;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.9;
    } else if (period.value >= 6) {
        jQuery('#cyclediscount').text('5% Off');
        jQuery('#cyclediscountnew').text('5% Off');
        jQuery('#cyclediscountrow').css('display', 'table-row');
        jQuery('#cyclediscountrownew').show();
        serviceCost.value = serviceCost.value * 0.95;
        monthlyServiceCost.value = monthlyServiceCost.value * 0.95;
    } else {
        jQuery('#cyclediscountrownew').hide();
        jQuery('#cyclediscountrow').css('display', 'none');
        jQuery('#cyclediscount').text('');
        jQuery('#cyclediscountnew').text('');
    }
    if (period.value > 1) {
        serviceCost.value = serviceCost.value + (period.value - 1) * monthlyServiceCost.value;
    }

    totalCost.value = Number(serviceCost.value);
    if (controlCost.value > 0) {
        totalCost.value = totalCost.value + controlCost.value * period.value;
    }
    totalCost.value = Number(Number(totalCost.value).toFixed(2));
    jQuery('#totalcost11').text(currencySymbol.value + totalCost.value);
    jQuery('#totalcostnew').val(totalCost.value);
    if ($('#total_cost_display').length > 0) {
        $('#total_cost_display').text(Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value }).format(Number(parseFloat(totalCost.value.toString()).toFixed(2))));
    }
    $(function () {
        if ($('#renew_cost').length > 0) {
            $('#renew_cost').text(Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value }).format(Number(parseFloat((slices.value * sliceCost.value).toString()).toFixed(2))));
        }
    });
}

function recomended_linux() {
    vpsPlatform.value = 'kvm';
    osDistro.value = 'ubuntu';
    slices.value = 1;
    curControl.value = 'none';
    //update_vps_choices();
}

function recomended_cpanel() {
    vpsPlatform.value = 'kvm';
    osDistro.value = 'centos';
    slices.value = 2;
    curControl.value = 'cpanel';
    //update_vps_choices();
}

function recomended_directadmin() {
    console.log('recommended direct admin');
    vpsPlatform.value = 'kvm';
    osDistro.value = 'almalinux';
    slices.value = 4;
    curControl.value = 'da';
    console.log(osDistro.value);
    //update_vps_choices();
    console.log(osDistro.value);
}

function recomended_windows() {
    vpsPlatform.value = 'hyperv';
    osDistro.value = 'windows';
    slices.value = 2;
    curControl.value = 'none';
    //update_vps_choices();
}

function recomended_linux_desktop() {
    vpsPlatform.value = 'kvm';
    osDistro.value = 'ubuntu';
    slices.value = 2;
    curControl.value = 'none';
    //update_vps_choices();
}

function recomended_webuzo() {
    vpsPlatform.value = 'kvm';
    osDistro.value = 'centos';
    slices.value = 1;
    curControl.value = 'none';
    //update_vps_choices();
}

function get_package_id() {
    osDistro.value = osVersion.value;
    if (vpsPlatform.value == 'openvz') {
        // OpenVZ
        serviceType.value = 31;
    } else if (vpsPlatform.value == 'ssdopenvz') {
        // OpenVZ
        serviceType.value = 36;
    } else if (vpsPlatform.value == 'cloudkvm') {
        // Cloud
        if (osDistro.value == 'windows') {
            serviceType.value = 34;
        } else {
            serviceType.value = 35;
        }
    } else if (vpsPlatform.value == 'kvm') {
        // KVM
        if (osDistro.value == 'windows') {
            serviceType.value = 32;
        } else {
            serviceType.value = 33;
        }
    } else if (vpsPlatform.value == 'kvmstorage') {
        serviceType.value = 57;
    } else if (vpsPlatform.value == 'xen') {
        serviceType.value = 52;
    } else if (vpsPlatform.value == 'lxc') {
        serviceType.value = 49;
    } else if (vpsPlatform.value == 'vmware') {
        serviceType.value = 53;
    } else if (vpsPlatform.value == 'hyperv') {
        serviceType.value = 54;
    } else if (vpsPlatform.value == 'virtuozzo') {
        serviceType.value = 55;
    } else if (vpsPlatform.value == 'ssdvirtuozzo') {
        serviceType.value = 56;
    } else {
        serviceType.value = -1;
    }
    return serviceType.value;
}

onMounted(() => {
    if ((jQuery(window).width() as number) > 1720) {
        jQuery('.buy_vps_container').css('width', '730px');
    }
});

try {
    fetchWrapper.get(`${baseUrl}/vps/order`).then((response: VpsOrderResponse) => {
        maxSlices.value = response.maxSlices;
        hdStorageSlice.value = response.hdStorageSlice;
        cpanelCost.value = response.cpanelCost;
        daCost.value = response.daCost;
        bwType.value = response.bwType;
        bwTotal.value = response.bwTotal;
        bwSlice.value = response.bwSlice;
        hdSlice.value = response.hdSlice;
        ramSlice.value = response.ramSlice;
        platformPackages.value = response.platformPackages;
        platformNames.value = response.platformNames;
        packageCosts.value = response.packageCosts;
        locationStock.value = response.locationStock;
        locationNames.value = response.locationNames;
        osNames.value = response.osNames;
        locationNames.value = response.locationNames;
        osTemplates.value = response.templates;
        serviceTypes.value = response.serviceTypes;
        vpsSliceSsdOvzCost.value = response.vpsSliceSsdOvzCost;
        vpsSliceOvzCost.value = response.vpsSliceOvzCost;
        vpsSliceSsdVirtuozzoCost.value = response.vpsSliceSsdVirtuozzoCost;
        vpsSliceVirtuozzoCost.value = response.vpsSliceVirtuozzoCost;
        vpsSliceHypervCost.value = response.vpsSliceHypervCost;
        vpsSliceVmwareCost.value = response.vpsSliceVmwareCost;
        vpsSliceLxcCost.value = response.vpsSliceLxcCost;
        vpsSliceXenCost.value = response.vpsSliceXenCost;
        vpsSliceKvmLCost.value = response.vpsSliceKvmLCost;
        vpsSliceKvmStorageCost.value = response.vpsSliceKvmStorageCost;
        vpsNyCost.value = response.vpsNyCost;
        vpsSliceKvmWCost.value = response.vpsSliceKvmWCost;
        currency.value = response.currency;
        currencySymbol.value = response.currencySymbol;
        updateCoupon();
        //update_vps_choices();
    });
} catch (error: any) {
    console.log('error:');
    console.log(error);
}
</script>

<template>
    <template v-if="!step || step == 'orderform'">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-server" aria-hidden="true">&nbsp;</i>Order VPS</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <form id="vps_form" class="vps_form_init" @submit.prevent="onSubmit">
                            <input id="period" type="hidden" name="period" :value="period" />
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">VPS Details</label>
                                <div class="col-sm-9 form-control bg-gradient-gray b-radius text-center">
                                    <div class="d-inline pr-3">
                                        <span>Storage: </span> <span id="storage" class="text-bold">{{ vpsPlatform == 'kvmstorage' ? hdStorageSlice * slices : hdSlice * slices }} GB</span>
                                    </div>
                                    <div class="d-inline pr-3">
                                        <span>Memory: </span> <span id="memory_recommended" class="text-bold">{{ ramSlice * slices }} MB</span>
                                    </div>
                                    <div class="d-inline">
                                        <span>Transfer: </span> <span id="Transfer_bandwidth" class="text-bold">{{ getBandwidth }}</span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Platform <span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select v-model="vpsPlatform" class="form-control select2">
                                        <option v-for="(platformName, platformId, index) in platformNames" :key="index" :value="platformId">{{ platformName }}</option>
                                    </select>
                                    <small id="slicecost" class="form-text text-muted"></small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Location<span class="text-danger"> *</span></label>
                                <div class="col-sm-9 input-group">
                                    <select v-model="location" class="form-control select2">
                                        <option v-for="(locationName, locationId, index) in locationNames" :key="index" :value="locationId">{{ locationName }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Slices<span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select v-model="slices" class="form-control select2">
                                        <option v-for="slice in slicesRange" :key="slice" :value="slice">{{ slice }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">OS Distribution<span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select v-model="osDistro" class="form-control select2">
                                        <option v-for="(templateDistro, templateDistroId, index) in osTemplates[vpsPlatform]" :key="index" :value="templateDistroId">{{ osNames[templateDistroId] }}</option>
                                        <option v-if="vpsPlatform != 'hyperv'" disabled>Windows (only on HyperV)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">OS Version<span class="text-danger"> *</span></label>
                                <div class="input-group col-md-9">
                                    <select v-model="osVersion" class="form-control select2">
                                        <option v-for="(templateVersion, templateName, index) in osVersionSelect" :key="index" :value="templateName">{{ templateVersion }}</option>
                                    </select>
                                </div>
                            </div>
                            <div id="hostnamerownew" class="form-group row">
                                <label class="col-sm-3 col-form-label">Hostname</label>
                                <div class="col-md-9">
                                    <input id="hostname" v-model="hostname" type="text" name="hostname" class="form-control text-sm" placeholder="server.domain.com" @keyup="updateHostname" @change="updateHostname" />
                                </div>
                            </div>
                            <div id="rootpassrownew" class="row">
                                <label class="col-sm-3 col-form-label">Root Password<span class="text-danger"> *</span></label>
                                <div class="form-group col-md-9">
                                    <input v-model="rootpass" type="text" name="rootpass" class="form-control text-sm" />
                                    <small class="form-text text-muted">Note: Password must contain atleast 8 characters, one lowercase letter, one uppercase letter, one number, a special character.</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Coupon Code</label>
                                <div class="input-group col-md-9">
                                    <input id="coupon" v-model="coupon" type="text" class="w-100 form-control text-sm" name="coupon" placeholder="Coupon Code" @keyup="updateCoupon" @change="updateCoupon" />
                                    <span class="input-group-addon" style="padding: 0"><img id="couponimg" src="https://my.interserver.net/validate_coupon.php?module=vps'" height="20" width="20" alt="" /></span>
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="controls">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-order px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <!-- Order Summary -->
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <div class="p-1">
                                    <h4 class="card-title py-2"><i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary</h4>
                                    <div class="card-tools float-right">
                                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body pb-0">
                                <div class="row mb-3">
                                    <div id="package_name" class="col-md-8 text-muted text-bold">{{ platformPackages[vpsPlatform] && serviceTypes && serviceTypes[platformPackages[vpsPlatform]] ? serviceTypes[platformPackages[vpsPlatform]].services_name : '' }}</div>
                                    <div id="package_period" class="col text-right">{{ period }} Month(s)</div>
                                </div>
                                <div class="row mb-3">
                                    <div id="hostname_display" class="col-md-8 text-muted text-bold">{{ hostname }}</div>
                                    <div class="col text-md totalcost_display text-right" v-html="sliceCostHtml" />
                                </div>
                                <div v-show="period >= 6" id="cyclediscountrownew" class="row mb-3">
                                    <div class="col-md-8 text-muted text-bold">Billing cycle discount:</div>
                                    <div id="cyclediscount" class="col text-right">{{ cycleDiscountText }}</div>
                                </div>
                                <div v-show="typeof couponInfo.applies != 'undefined'" id="couponpricerownew" class="row mb-3">
                                    <div id="couponpricetextnew" class="col-md-8 text-muted text-bold">{{ couponPriceLabel }}</div>
                                    <div id="couponprice" class="col text-right">{{ couponPriceText }}</div>
                                </div>
                                <hr />
                                <div class="row mb-3">
                                    <div class="col-md-8 text-md text-bold text-muted">Total:</div>
                                    <div id="totalcost" class="col text-md total_cost text-right">{{ totalCostDisplay }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- End Order Summary -->
                    <!-- VPS Recommendations -->
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <div class="p-1">
                                    <h4 class="card-title py-2"><i class="fa fa-thumbs-up">&nbsp;</i>Recommendations</h4>
                                    <div class="card-tools float-right">
                                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body py-2">
                                <a id="rec_linux" href="javascript:void(0);" data-toggle="tooltip" title="Linux VPS" class="btn btn-sm btn-secondary b-radius my-2 mr-1 px-3" @click.prevent="recomended_linux"><i class="fa fa-linux">&nbsp;</i>Linux&nbsp;</a>
                                <a id="rec_directadmin" href="javascript:void(0);" data-toggle="tooltip" title="Direct Admin VPS" class="btn btn-sm btn-secondary b-radius my-2 mr-1 px-3" @click.prevent="recomended_directadmin"><i class="fa fa-user">&nbsp;</i>Direct Admin&nbsp;</a>
                                <a id="rec_windows" href="javascript:void(0);" data-toggle="tooltip" title="Windows VPS" class="btn btn-sm btn-secondary b-radius my-2 mr-1" @click.prevent="recomended_windows"><i class="fa fa-windows">&nbsp;</i>Windows&nbsp;</a>
                                <a id="rec_cPanel" href="javascript:void(0);" data-toggle="tooltip" title="cPanel VPS" class="btn btn-sm btn-secondary b-radius my-2 mr-1" style="padding: 3px 11px 3px 11px" @click.prevent="recomended_cpanel"><i class="fa fa-server">&nbsp;</i>cPanel&nbsp;</a>
                                <a id="rec_linux_desktop" href="javascript:void(0);" data-toggle="tooltip" title="Linux Desktop VPS" class="btn btn-sm btn-secondary b-radius my-2 mr-1" style="padding: 3px 10px 3px 10px" @click.prevent="recomended_linux_desktop"><i class="fa fa-desktop">&nbsp;</i>Linux Desktop&nbsp;</a>
                                <a id="rec_webuzo" href="javascript:void(0);" data-toggle="tooltip" title="Webuzo VPS" class="btn btn-sm btn-secondary b-radius my-2" style="padding: 3px 8px 3px 8px" @click.prevent="recomended_webuzo"><i class="fa fa-laptop">&nbsp;</i>Webuzo&nbsp;</a>
                            </div>
                        </div>
                    </div>
                    <!-- End VPS Recommendations -->
                    <div class="col">
                        <!-- VPS Location availability -->
                        <div class="card">
                            <div class="card-header">
                                <div class="p-1">
                                    <h4 class="card-title py-2"><i class="fa fa-map-pin"></i>&nbsp;Location Availability</h4>
                                    <div class="card-tools float-right">
                                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <table class="table-hover table-bordered table">
                                    <thead>
                                        <tr>
                                            <th>Location / Platform</th>
                                            <!--<th>Virtuozzo</th>-->
                                            <th>KVM Linux</th>
                                            <!--<th>KVM Windows</th>-->
                                            <th>HyperV</th>
                                            <th>KVM Storage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(stockArr, locationId) in locationStock" :key="locationId">
                                            <td class="text-center">{{ locationNames[locationId] }}</td>
                                            <td v-for="(status, platformId) in stockArr" :key="platformId" class="text-center">
                                                <template v-if="status">
                                                    <span style="color: green">✔</span>
                                                </template>
                                                <template v-else>
                                                    <span style="font-weight: bold; color: red">❌</span>
                                                </template>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <!-- End VPS Location availability -->
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
                        <form class="vps_form_confirm" method="post" action="order_vps" @submit.prevent="onSubmitConfirmation">
                            <table class="table-sm table-bordered table">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="text-md float-left" style="position: relative; top: 5px">{{ hostname }}</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" data-toggle="tooltip" title="Edit details" @click.prevent="step = 'orderform'"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div class="text-md text-bold">{{ period }} month(s)</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="text-md">{{ serviceTypes[platformPackages[vpsPlatform]].services_name }}</div>
                                        </td>
                                        <td>
                                            <div id="slicecost" class="text-bold text-md">{{ sliceCost }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">VPS Location</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ locationNames[location] }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">Slices</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ slices }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">Memory</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ ramSlice * slices }} MB</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">HD Space</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ vpsPlatform == 'kvmstorage' ? hdStorageSlice * slices : hdSlice * slices }} GB</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">Bandwidth</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ getBandwidth }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">Operating System</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ osNames[osDistro] }} {{ osTemplates[vpsPlatform][osDistro][osVersion] }}</div>
                                        </td>
                                    </tr>
                                    <template v-if="coupon">
                                        <tr>
                                            <td>
                                                <div class="text-md">Coupon Used</div>
                                            </td>
                                            <td>
                                                <div class="text-bold text-md">
                                                    {{ coupon }}
                                                    <img id="couponimg" src="https://my.interserver.net/validate_coupon.php?module=vps'" style="padding-left: 10px" height="20" width="20" alt="" />
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                    <tr style="display: none">
                                        <td>
                                            <div id="couponpricetext" class="text-md">Coupon Discount</div>
                                        </td>
                                        <td>
                                            <div id="couponprice" class="text-bold text-md"></div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>
                                            <div class="text-lg">Total</div>
                                        </th>
                                        <th>
                                            <div id="total_cost_display" class="text-bold text-lg">${{ serviceCost }}</div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <hr />
                            <div class="p-1">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">
                                    The subscription will automatically renew after <b>every month at</b> <span id="renew_cost" class="package_cost text-bold">${{ serviceCost }}</span> until canceled.
                                </p>
                                <p class="text-muted text-xs">By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.</p>
                                <div class="icheck-success text-bold text-center">
                                    <input id="tos" type="checkbox" name="tos" style="margin: 0 5px; display: inline" value="yes" />
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center">
                                    <input type="submit" name="Submit" value="Place Order" class="btn btn-green btn-sm px-3 py-2" />
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
