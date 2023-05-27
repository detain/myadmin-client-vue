<script setup>
import { storeToRefs } from 'pinia';
import { ref, reactive, computed, onMounted } from 'vue'
//import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import $ from 'jquery';
import jQuery from 'jquery';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers';
import { useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
layoutStore.setPageHeading('Order VPS');
layoutStore.setTitle('Order VPS');
layoutStore.setBreadcrums({'/home': 'Home', '/vps': 'VPS List', '/vps/order': 'Order VPS'});
const baseUrl = import.meta.env.VITE_API_URL;
const billingCycle = ref({
    1: "Monthly",
    3: "3 Months",
    6: "6 Months (5% off)",
    12: "Yearly (10% off)",
    24: "24 Months (15% off)",
    36: "36 Months (20% off)"
});
const controlpanel = ref({
    none: "None",
    da: "DirectAdmin",
    cpanel: "CPanel"
});
const currency = ref('USD');
const currencySymbol = ref('$');
const serviceTypes = ref([]);
const maxSlices = ref(16);
const hdStorageSlice = ref(1000);
const cpanelCost = ref(20);
const daCost = ref(8);
const bwType = ref(2);
const bwTotal = ref(2);
const bwSlice = ref(2000);
const hdSlice = ref(30);
const ramSlice = ref(2048);
const vpsSliceSsdOvzCost = ref(0);
const vpsSliceOvzCost = ref(0);
const vpsSliceSsdVirtuozzoCost = ref(0);
const vpsSliceVirtuozzoCost = ref(0);
const vpsSliceHypervCost = ref(0);
const vpsSliceVmwareCost = ref(0);
const vpsSliceLxcCost = ref(0);
const vpsSliceXenCost = ref(0);
const vpsSliceKvmLCost = ref(0);
const vpsSliceKvmStorageCost = ref(0);
const vpsNyCost = ref(0);
const vpsSliceKvmWCost = ref(0);
const platformPackages = ref({
    kvm: 32,
    kvmstorage: 57,
    hyperv: 54
});
const platformNames = ref({
    kvm: "KVM",
    kvmstorage: "KVM Storage",
    hyperv: "HyperV"
});
const packageCosts = ref({
    32: 10,
    54: 10,
    57: 6
});
const locationStock = ref({
    1: { kvm: true, kvmstorage: true, hyperv: true },
    2: { kvm: true, kvmstorage: false, hyperv: true },
    3: { kvm: false, kvmstorage: false, hyperv: false }
});
const locationNames = ref({
    1: "New Jersey",
    2: "Los Angeles",
    3: "Equinix NY4"
});
const osNames = ref({
    windows: "Windows",
    almalinux: "Almalinux"
});
const templates = ref({
    hyperv: {
        windows: { Windows2019Standard: "2019 Standard", Windows2022: "2022" }
    },
    kvm: {},
    kvmstorage: {}
});
const slices = ref(1);
const platform = ref('kvm');
const location = ref(1);
const version = ref("");
const templateOs = ref("ubuntu");
const hostname = ref("");
const coupon = ref("");
const step = ref("orderform");
const rootpass = ref("");
const csrfToken = ref("");
const curSsd = ref(0);
const curControl = ref("");
const period = ref(1);
const pkg = ref('');
const totalCostDisplay = ref(0.00);
const ipv6_only_discount = ref(1);
const controlCost = ref(0);
const couponInfo = ref(0);
const last_coupon = ref("");
const sliceCost = ref(0);
const serviceType = ref(null);
const slicesRange = computed(() => {
    const arr = []
    for (let i = 1; i <= maxSlices.value; i++) {
        arr.push(i)
    }
    return arr
})
const totalCost = computed(() => {
  return currencySymbol.value + totalCostDisplay.value.toFixed(2)
});

onMounted(() => {
    update_coupon();
    update_vps_choices();
    if (jQuery(window).width() > 1720) {
        jQuery('.buy_vps_container').css('width', '730px');
    }
    $("select[name='platform']").on('change', '', function () {
        if ($(this).val() == 'kvm' || $(this).val() == 'hyperv') {
            //slice_warning();
        } else {
            $('#update_msg').html('');
        }
    });
    $("select[name='slices']").on('change', '', function () {
        //slice_warning();
    });
});

function update_coupon() {
    var coupon_text = document.getElementById("coupon").value;
    if (last_coupon.value != coupon_text) {
        last_coupon.value = coupon_text;
        document.getElementById("couponimg").src = "validate_coupon.php?module=vps&coupon=" + coupon_text;
        $.getJSON("https://my.interserver.net/coupon_info.php?module=vps&coupon=" + coupon_text, {}, function (json) {
            couponInfo.value = json;
            if (typeof json.applies != undefined) {
                update_vps_choices();
                if (couponInfo.value.onetime == "0") {
                    update_vps_choices_order();
                }
            }
        });
    }
}

function getBandwidth(Slicess) {
    var VPS_SLICE_BW_TEMP = bwSlice.value;
    var bandwidthamount = VPS_SLICE_BW_TEMP * slices.value;
    var VPS_BW_TYPE_TEMP = bwType.value;
    var VPS_BW_TOTAL_TEMP = bwTotal.value;
    var slice_amount = "Mbps";
    if (VPS_BW_TYPE_TEMP == VPS_BW_TOTAL_TEMP)
        if (bandwidthamount >= 1000)
            slice_amount = " Gb";
        else
            slice_amount = " Mb";
    else
        slice_amount = " Mbps";
    return bandwidthamount + slice_amount;
}

function edit_form() {
    document.getElementById("edit_order_form").submit();
}

function update_vps_choices() {
    /*

    if (curControl.value != jQuery("select[name=controlpanel]").val()) {
        curControl.value = jQuery("select[name=controlpanel]").val();
        if (curControl.value == "cpanel") {
            controlCost.value = cpanelCost.value;
        } else if (curControl.value == "da") {
            controlCost.value = daCost.value;
        } else {
            controlCost.value = 0;
        }
    }
    if (period.value != jQuery("#period").val()) {
        period.value = Number(jQuery("#period").val());
    }
    if (location.value != jQuery("select[name=location]").val()) {
        location.value = Number(jQuery("select[name=location]").val());
    }
    if (templateOs.value != jQuery("select[name=version]").val()) {
        templateOs.value = jQuery("select[name=version]").val();
        jQuery("select[name=vpsos]").html(templates[platform.value][templateOs.value]).trigger("render");
        jQuery("select[name=vpsos]").parent().find("span>span").html(jQuery("select[name=vpsos] > option[selected]").html())
    }
    if (curSsd.value != jQuery("select[name=ssd]").val()) {
        curSsd.value = jQuery("select[name=ssd]").val();
    }
    if (platform.value == "openvz" || platform.value == "virtuozzo") {
        jQuery("#hostnamerow").css("display", "table-row");
        jQuery("#ssdrow").css("display", "table-row");
        jQuery("#hostnamerownew").show();
        jQuery("#ssdrownew").show();
        if (curSsd.value == 1) {
            jQuery("#ssdpricerow").css("display", "table-row");
            jQuery("#ssdpricerownew").show();
        } else {
            jQuery("#ssdpricerow").css("display", "none");
            jQuery("#ssdpricerownew").hide();
        }
    } else {
        jQuery("#hostnamerow").css("display", "none");
        jQuery("#hostnamerownew").hide();
        jQuery("#ssdrow").css("display", "none");
        jQuery("#ssdrownew").hide();
        jQuery("#ssdpricerownew").hide();
        jQuery("#ssdpricerow").css("display", "none");
        if (curSsd.value == 1) {
            curSsd.value = 0;
        }
    }
    if (templateOs.value == "windows") {
        jQuery("#controlpanelrow").css("display", "none");
        jQuery("#controlpanelrownew").hide();
    } else {
        jQuery("#controlpanelrow").css("display", "table-row");
        jQuery("#controlpanelrownew").show();
    }
    if (templateOs.value == "windows" && platform.value != "hyperv") {
        jQuery("#rootpassrow").css("display", "none");
        jQuery("#rootpassrownew").hide();
    } else {
        jQuery("#rootpassrow").css("display", "table-row");
        jQuery("#rootpassrownew").show();
    }
    if (platform.value == "openvz")
        if (curSsd.value == 1)
            sliceCost.value = vpsSliceSsdOvzCost.value;
        else
            sliceCost.value = vpsSliceOvzCost.value;
    else if (platform.value == 'kvm')
        if (templateOs.value == "windows")
            sliceCost.value = vpsSliceKvmWCost.value;
        else
            sliceCost.value = vpsSliceKvmLCost.value;
    else if (platform.value == "kvmstorage")
        sliceCost.value = vpsSliceKvmStorageCost.value;
    else if (platform.value == "xen")
        sliceCost.value = vpsSliceXenCost.value;
    else if (platform.value == "lxc")
        sliceCost.value = vpsSliceLxcCost.value;
    else if (platform.value == "vmware")
        sliceCost.value = vpsSliceVmwareCost.value;
    else if (platform.value == "hyperv")
        sliceCost.value = vpsSliceHypervCost.value;
    else if (platform.value == "virtuozzo")
        if (curSsd.value == 1)
            sliceCost.value = vpsSliceSsdVirtuozzoCost.value;
        else
            sliceCost.value = vpsSliceVirtuozzoCost.value;
    if (location.value == 3)
        sliceCost.value = sliceCost.value * vpsNyCost.value;
    if (controlCost.value > 0) {
        controlCost.value = parseFloat(controlCost.value).toFixed(2);
        jQuery("#controlpanelcost").text(currencySymbol + controlCost.value);
        jQuery("#controlpanelcostnew").text(currencySymbol + controlCost.value);
        jQuery("#controlpanelpricerownew").show();
    }
    else {
        jQuery("#controlpanelcost").text("");
        jQuery("#controlpanelcostnew").text("");
        jQuery("#controlpanelpricerownew").hide();
    }
    jQuery("#slicecost").text(currencySymbol + sliceCost.value + " Per Slice");
    jQuery("#slicecosttb").text(currencySymbol + sliceCost.value);
    // later month slice costs
    var service_cost = sliceCost.value;
    // first month slice cost
    var first_slice = sliceCost.value;
    var monthly_slice_cost = sliceCost.value;
    var monthly_service_cost = service_cost;
    var couponpricetext;
    if (typeof couponInfo.value.applies != undefined) {
        if (couponInfo.value.type == 3) {
            jQuery("#couponpricerow").css("display", "table-row");
            jQuery("#couponpricerownew").show();
            jQuery("#slicecost").html("<del style=\"color: red;\">" + currencySymbol + sliceCost.value + "</del> Per Slice");
            couponpricetext = "Price";
            jQuery("#couponprice").html(currencySymbol + couponInfo.value.amount + " per slice");
            jQuery("#couponpricenew").val(couponInfo.value.amount + " per slice");
            first_slice = Number(couponInfo.value.amount);
        } else if (couponInfo.value.type == 2) {
            jQuery("#couponpricerow").css("display", "table-row");
            jQuery("#couponpricerownew").show();
            jQuery("#couponprice").text("-" + currencySymbol + couponInfo.value.amount);
            couponpricetext = "Discount";
            jQuery("#couponpricenew").val("-(" + couponInfo.value.amount + ")");
            first_slice = first_slice - Number(couponInfo.value.amount);
        } else if (couponInfo.value.type == 1) {
            jQuery("#couponpricerow").css("display", "table-row");
            jQuery("#couponpricerownew").show();
            jQuery("#couponprice").text(couponInfo.value.amount + "% Off");
            jQuery("#couponpricenew").val(couponInfo.value.amount + "% Off");
            couponpricetext = "Discount";
            first_slice = first_slice * ((100 - Number(couponInfo.value.amount)) / 100);
        } else {
            jQuery("#couponpricerow").css("display", "none");
            jQuery("#couponpricerownew").hide();
            jQuery("#couponprice").text("");
            jQuery("#couponpricenew").val("");
        }
        if (first_slice < 0.01 && first_slice > 0) {
            first_slice = 0.01;
        }
        if (couponInfo.value.amount != 0.01) {
            sliceCost.value = first_slice;
        } else if (platform.value == "kvm" || platform.value == "hyperv") {
            first_slice = sliceCost.value * 0.50;
            jQuery("#couponprice").text("50% Off");
            jQuery("#couponpricenew").val("50% Off");
        }
        if (couponInfo.value.onetime == 0) {
            monthly_slice_cost = sliceCost.value;
        } else {
            couponpricetext = "First Month " + couponpricetext;
        }
        jQuery("#couponpricetext").text("Coupon " + couponpricetext);
        jQuery("#couponpricetextnew").text("Coupon " + couponpricetext);
    } else {
        jQuery("#couponpricerow").css("display", "none");
        jQuery("#couponpricerownew").hide();
        jQuery("#couponprice").text("");
        jQuery("#couponpricenew").val("");
    }
    service_cost = first_slice + (sliceCost.value * (slices.value - 1));
    monthly_service_cost = monthly_slice_cost * slices.value;
    if (period.value >= 36) {
        jQuery("#cyclediscount").text("20% Off");
        jQuery("#cyclediscountnew").text("20% Off");
        jQuery("#cyclediscountrow").css("display", "table-row");
        jQuery("#cyclediscountrownew").show();
        service_cost = service_cost * 0.80;
        monthly_service_cost = monthly_service_cost * 0.80;
    } else if (period.value >= 24) {
        jQuery("#cyclediscount").text("15% Off");
        jQuery("#cyclediscountnew").text("15% Off");
        jQuery("#cyclediscountrow").css("display", "table-row");
        jQuery("#cyclediscountrownew").show();
        service_cost = service_cost * 0.85;
        monthly_service_cost = monthly_service_cost * 0.85;
    } else if (period.value >= 12) {
        jQuery("#cyclediscount").text("10% Off");
        jQuery("#cyclediscountnew").text("10% Off");
        jQuery("#cyclediscountrow").css("display", "table-row");
        jQuery("#cyclediscountrownew").show();
        service_cost = service_cost * 0.90;
        monthly_service_cost = monthly_service_cost * 0.90;
    } else if (period.value >= 6) {
        jQuery("#cyclediscount").text("5% Off");
        jQuery("#cyclediscountnew").text("5% Off");
        jQuery("#cyclediscountrow").css("display", "table-row");
        jQuery("#cyclediscountrownew").show();
        service_cost = service_cost * 0.95;
        monthly_service_cost = monthly_service_cost * 0.95;
    } else {
        jQuery("#cyclediscountrownew").hide();
        jQuery("#cyclediscountrow").css("display", "none");
        jQuery("#cyclediscount").text("");
        jQuery("#cyclediscountnew").text("");
    }
    if (period.value > 1) {
        service_cost = service_cost + ((period.value - 1) * monthly_service_cost);
    }

    var total_cost = new Number(service_cost);
    if (controlCost.value > 0) {
        total_cost = total_cost + (controlCost.value * period.value);
    }
    total_cost = total_cost.toFixed(2);
    jQuery("#totalcost").text(Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
        .format(parseFloat(total_cost).toFixed(2)));
    jQuery(".totalcost_display").text(Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
        .format(parseFloat(total_cost).toFixed(2)));
    jQuery("#totalcostnew").val(total_cost);
    jQuery("#total_cost_displa").val(total_cost);
    if ($("#package_name").length > 0 && typeof packages != 'undefined') {
        $("#package_name").text(packages[get_package_id()]);
    }
    slice_warning();
    */
}


function update_vps_choices_order() {
    if (platform.value != jQuery("#platform").val()) {
        platform.value = jQuery("#platform").val();
        jQuery("#version").html(templates.value["platforms"][platform.value]).trigger("render");
        templateOs.value = jQuery("#version").val();
    }
    if (curControl.value != jQuery("#controlpanel").val()) {
        curControl.value = jQuery("#controlpanel").val();
        if (curControl.value == "cpanel") {
            controlCost.value = cpanelCost.value;
        } else if (curControl.value == "da") {
            controlCost.value = daCost.value;
        } else {
            controlCost.value = 0;
        }
    }
    if (period.value != jQuery("#period").val()) {
        period.value = Number(jQuery("#period").val());
    }
    if (location.value != jQuery("#location").val()) {
        location.value = Number(jQuery("#location").val());
    }
    if (curSsd.value != jQuery("#ssd").val()) {
        curSsd.value = jQuery("#ssd").val();
    }
    if (platform.value == "openvz" || platform.value == "virtuozzo") {
        jQuery("#hostnamerow").css("display", "table-row");
        jQuery("#ssdrow").css("display", "table-row");
        jQuery("#hostnamerownew").show();
        jQuery("#ssdrownew").show();
        if (curSsd.value == 1) {
            jQuery("#ssdpricerow").css("display", "table-row");
            jQuery("#ssdpricerownew").show();
        } else {
            jQuery("#ssdpricerow").css("display", "none");
            jQuery("#ssdpricerownew").hide();
        }
    } else {
        jQuery("#hostnamerow").css("display", "none");
        jQuery("#hostnamerownew").hide();
        jQuery("#ssdrow").css("display", "none");
        jQuery("#ssdrownew").hide();
        jQuery("#ssdpricerownew").hide();
        jQuery("#ssdpricerow").css("display", "none");
        if (curSsd.value == 1) {
            curSsd.value = 0;
        }
    }
    if (platform.value == "openvz")
        if (curSsd.value == 1)
            sliceCost.value = vpsSliceSsdOvzCost.value;
        else
            sliceCost.value = vpsSliceOvzCost.value;
    else if (platform.value == 'kvm')
        if (templateOs.value == "windows")
            sliceCost.value = vpsSliceKvmWCost.value;
        else
            sliceCost.value = vpsSliceKvmLCost.value;
    else if (platform.value == "kvmstorage")
        sliceCost.value = vpsSliceKvmStorageCost.value;
    else if (platform.value == "xen")
        sliceCost.value = vpsSliceXenCost.value;
    else if (platform.value == "lxc")
        sliceCost.value = vpsSliceLxcCost.value;
    else if (platform.value == "vmware")
        sliceCost.value = vpsSliceVmwareCost.value;
    else if (platform.value == "hyperv")
        sliceCost.value = vpsSliceHypervCost.value;
    else if (platform.value == "virtuozzo")
        if (curSsd.value == 1)
            sliceCost.value = vpsSliceSsdVirtuozzoCost.value;
        else
            sliceCost.value = vpsSliceVirtuozzoCost.value;
    if (location.value == 3)
        sliceCost.value = sliceCost.value * vpsNyCost.value;
    if (controlCost.value > 0) {
        controlCost.value = parseFloat(controlCost.value).toFixed(2);
        jQuery("#controlpanelcost").text(currencySymbol.value + controlCost.value);
    }
    else {
        jQuery("#controlpanelcost").text("");
    }
    jQuery("#slicecost").text(currencySymbol.value + sliceCost.value + " Per Slice");
    jQuery("#slicecosttb").text(currencySymbol.value + sliceCost.value);
    // later month slice costs
    var service_cost = sliceCost.value;
    // first month slice cost
    var first_slice = sliceCost.value;
    var monthly_slice_cost = sliceCost.value;
    var monthly_service_cost = service_cost;
    var couponpricetext;
    if (typeof couponInfo.value.applies != undefined) {
        if (couponInfo.value.type == 3) {
            jQuery("#couponpricerow").css("display", "table-row");
            jQuery("#couponpricerownew").show();
            jQuery("#slicecost").html("<del style=\"color: red;\">$" + sliceCost.value + "</del> Per Slice");
            couponpricetext = "Price";
            jQuery("#couponprice").html(currencySymbol.value + couponInfo.value.amount + " per slice");
            jQuery("#couponpricenew").val(couponInfo.value.amount + " per slice");
            first_slice = Number(couponInfo.value.amount);
        } else if (couponInfo.value.type == 2) {
            jQuery("#couponpricerow").css("display", "table-row");
            jQuery("#couponpricerownew").show();
            jQuery("#couponprice").text("-" + currencySymbol.value + couponInfo.value.amount);
            couponpricetext = "Discount";
            jQuery("#couponpricenew").val("-(" + couponInfo.value.amount + ")");
            first_slice = first_slice - Number(couponInfo.value.amount);
        } else if (couponInfo.value.type == 1) {
            jQuery("#couponpricerow").css("display", "table-row");
            jQuery("#couponpricerownew").show();
            jQuery("#couponprice").text(couponInfo.value.amount + "% Off");
            jQuery("#couponpricenew").val(couponInfo.value.amount + "% Off");
            couponpricetext = "Discount";
            first_slice = first_slice * ((100 - Number(couponInfo.value.amount)) / 100);
        } else {
            jQuery("#couponpricerow").css("display", "none");
            jQuery("#couponpricerownew").hide();
            jQuery("#couponprice").text("");
            jQuery("#couponpricenew").val("");
        }
        if (first_slice < 0.01 && first_slice > 0) {
            first_slice = 0.01;
        }
        if (couponInfo.value.amount != 0.01) {
            sliceCost.value = first_slice;
        } else if (platform.value == "kvm" || platform.value == "kvmstorage" || platform.value == "hyperv") {
            first_slice = sliceCost.value * 0.50;
            jQuery("#couponprice").text("50% Off");
            jQuery("#couponpricenew").val("50% Off");
        }
        if (couponInfo.value.onetime == 0) {
            monthly_slice_cost = sliceCost.value;
        } else {
            couponpricetext = "First Month " + couponpricetext;
        }
        jQuery("#couponpricetext").text("Coupon " + couponpricetext);
        jQuery("#couponpricetextnew").text("Coupon " + couponpricetext);
    } else {
        jQuery("#couponpricerow").css("display", "none");
        jQuery("#couponpricerownew").hide();
        jQuery("#couponprice").text("");
        jQuery("#couponpricenew").val("");
    }
    service_cost = first_slice + (sliceCost.value * (slices.value - 1));
    monthly_service_cost = monthly_slice_cost * slices.value;
    if (period.value >= 36) {
        jQuery("#cyclediscount").text("20% Off");
        jQuery("#cyclediscountnew").text("20% Off");
        jQuery("#cyclediscountrow").css("display", "table-row");
        jQuery("#cyclediscountrownew").show();
        service_cost = service_cost * 0.80;
        monthly_service_cost = monthly_service_cost * 0.80;
    } else if (period.value >= 24) {
        jQuery("#cyclediscount").text("15% Off");
        jQuery("#cyclediscountnew").text("15% Off");
        jQuery("#cyclediscountrow").css("display", "table-row");
        jQuery("#cyclediscountrownew").show();
        service_cost = service_cost * 0.85;
        monthly_service_cost = monthly_service_cost * 0.85;
    } else if (period.value >= 12) {
        jQuery("#cyclediscount").text("10% Off");
        jQuery("#cyclediscountnew").text("10% Off");
        jQuery("#cyclediscountrow").css("display", "table-row");
        jQuery("#cyclediscountrownew").show();
        service_cost = service_cost * 0.90;
        monthly_service_cost = monthly_service_cost * 0.90;
    } else if (period.value >= 6) {
        jQuery("#cyclediscount").text("5% Off");
        jQuery("#cyclediscountnew").text("5% Off");
        jQuery("#cyclediscountrow").css("display", "table-row");
        jQuery("#cyclediscountrownew").show();
        service_cost = service_cost * 0.95;
        monthly_service_cost = monthly_service_cost * 0.95;
    } else {
        jQuery("#cyclediscountrownew").hide();
        jQuery("#cyclediscountrow").css("display", "none");
        jQuery("#cyclediscount").text("");
        jQuery("#cyclediscountnew").text("");
    }
    if (period.value > 1) {
        service_cost = service_cost + ((period.value - 1) * monthly_service_cost);
    }

    var total_cost = new Number(service_cost);
    if (controlCost.value > 0) {
        total_cost = total_cost + (controlCost.value * period.value);
    }
    total_cost = total_cost.toFixed(2);
    jQuery("#totalcost11").text(currencySymbol.value + total_cost);
    jQuery("#totalcostnew").val(total_cost);
    if ($("#total_cost_display").length > 0) {
        $("#total_cost_display").text(Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
            .format(parseFloat(total_cost).toFixed(2)));
    }
    $(document).ready(function () {
        if ($("#renew_cost").length > 0) {
            $("#renew_cost").text(Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
                .format(parseFloat(slices.value * sliceCost.value).toFixed(2)));
        }
    })


}


function recomended_linux() {
    platform.value = "kvm";
    templateOs.value = "ubuntu";
    slices.value = "1";
    curControl.value = "none";
    jQuery("select[name=platform]").val(platform.value);
    jQuery("select[name=slices]").val(slices.value);
    jQuery("select[name=version]").html(templates.value["platforms"][platform.value]).trigger("render");
    jQuery("select[name=version]").val(templateOs.value);
    jQuery("select[name=vpsos]").html(templates[platform.value][templateOs.value]).trigger("render");
    jQuery("select[name=controlpanel]").val(curControl.value);
    controlCost.value = 0;
    jQuery("#controlpanelcost").text("");
    $.each(['platform', 'slices'], function (index, inp_name) {
        if (jQuery("select[name=" + inp_name + "].select2").length > 0) {
            jQuery("select[name=" + inp_name + "]").select2().trigger('change');
        }
    });
    update_vps_choices();
}

function recomended_cpanel() {
    platform.value = "kvm";
    templateOs.value = "centos";
    slices.value = "2";
    curControl.value = "cpanel";
    jQuery("select[name=platform]").val(platform.value);
    jQuery("select[name=version]").html(templates.value["platforms"][platform.value]).trigger("render");
    jQuery("select[name=version]").val(templateOs.value);
    jQuery("select[name=vpsos]").html(templates[platform.value][templateOs.value]).trigger("render");
    jQuery("select[name=vpsos]").val("centos-7-x86_64-cpanel");
    jQuery("select[name=controlpanel]").val(curControl.value);
    controlCost.value = cpanelCost.value;
    jQuery("#controlpanelcost").text(currencySymbol.value + controlCost.value);
    $.each(['platform', 'slices'], function (index, inp_name) {
        if (jQuery("select[name=" + inp_name + "].select2").length > 0) {
            jQuery("select[name=" + inp_name + "]").select2().trigger('change');
        }
    });
    update_vps_choices();
}

function recomended_directadmin() {
    platform.value = "kvm";
    templateOs.value = "almalinux";
    slices.value = "4";
    curControl.value = "da";
    jQuery("select[name=platform]").val(platform.value);
    jQuery("select[name=version]").html(templates.value["platforms"][platform.value]).trigger("render");
    jQuery("select[name=version]").val(templateOs.value);
    jQuery("select[name=vpsos]").html(templates[platform.value][templateOs.value]).trigger("render");
    jQuery("select[name=slices]").val(slices.value);
    jQuery("select[name=vpsos]").val("da");
    jQuery("select[name=controlpanel]").val(curControl.value);
    controlCost.value = daCost.value;
    jQuery("#controlpanelcost").text(currencySymbol.value + controlCost.value);
    $.each(['platform', 'slices'], function (index, inp_name) {
        if (jQuery("select[name=" + inp_name + "].select2").length > 0) {
            jQuery("select[name=" + inp_name + "]").select2().trigger('change');
        }
    });
    update_vps_choices();
}

function recomended_windows() {
    platform.value = "hyperv";
    templateOs.value = "windows";
    slices.value = "2";
    curControl.value = "none";
    jQuery("select[name=platform]").val(platform.value);
    jQuery("select[name=slices]").val(slices.value);
    jQuery("select[name=version]").html(templates.value["platforms"][platform.value]).trigger("render");
    jQuery("select[name=version]").val(templateOs.value);
    jQuery("select[name=vpsos]").html(templates[platform.value][templateOs.value]).trigger("render");
    jQuery("select[name=vpsos]").val("Windows2022");
    jQuery("select[name=controlpanel]").val(curControl.value);
    controlCost.value = 0;
    jQuery("#controlpanelcost").text("");
    $.each(['platform', 'slices'], function (index, inp_name) {
        if (jQuery("select[name=" + inp_name + "].select2").length > 0) {
            jQuery("select[name=" + inp_name + "]").select2().trigger('change');
        }
    });
    update_vps_choices();
}

function recomended_linux_desktop() {
    platform.value = "kvm";
    templateOs.value = "ubuntu";
    slices.value = "2";
    curControl.value = "none";
    jQuery("select[name=platform]").val(platform.value);
    jQuery("select[name=slices]").val(slices.value);
    jQuery("select[name=version]").html(templates.value["platforms"][platform.value]).trigger("render");
    jQuery("select[name=version]").val(templateOs.value);
    jQuery("select[name=vpsos]").html(templates[platform.value][templateOs.value]).trigger("render");
    jQuery("select[name=vpsos]").val("ubuntudesktop");
    jQuery("select[name=controlpanel]").val(curControl.value);
    controlCost.value = 0;
    jQuery("#controlpanelcost").text("");
    $.each(['platform', 'slices'], function (index, inp_name) {
        if ("select[name=" + inp_name + "].select2".length > 0) {
            jQuery("select[name=" + inp_name + "]").select2().trigger('change');
        }
    });
    update_vps_choices();
}

function recomended_webuzo() {
    platform.value = "kvm";
    templateOs.value = "centos";
    slices.value = "1";
    curControl.value = "none";
    jQuery("select[name=platform]").val(platform.value);
    jQuery("select[name=slices]").val(slices.value);
    jQuery("select[name=version]").html(templates.value["platforms"][platform.value]).trigger("render");
    jQuery("select[name=version]").val(templateOs.value);
    jQuery("select[name=vpsos]").html(templates[platform.value][templateOs.value]).trigger("render");
    jQuery("select[name=vpsos]").val("centos-7-x86_64-breadbasket");
    jQuery("select[name=controlpanel]").val(curControl.value);
    controlCost.value = 0;
    jQuery("#controlpanelcost").text("");
    $.each(['platform', 'slices'], function (index, inp_name) {
        if (jQuery("select[name=" + inp_name + "].select2").length > 0) {
            jQuery("select[name=" + inp_name + "]").select2().trigger('change');
        }
    });
    update_vps_choices();
}

function slice_warning() {
    slices.value = $("select[name='slices']").val();
    platform.value = $("select[name=version]").val();
    if (slices.value == 1 && platform.value == 'windows') {
        //$('#update_msg').html('<div class="alert alert-warning" role="alert"><strong>Warning!</strong> running windows on only 1GB memory is not recommended. The minimum requirement for Windows Server is 4GB of ram</div>');
        $('#update_msg').html('');
    } else {
        $('#update_msg').html('');
    }
}

function get_package_id() {
    templateOs.value = $("select[name='version']").val();
    if (platform.value == 'openvz') { // OpenVZ
        serviceType.value = 31;
    } else if (platform.value == 'ssdopenvz') { // OpenVZ
        serviceType.value = 36;
    } else if (platform.value == 'cloudkvm') { // Cloud
        if (templateOs.value == 5 || 0 === templateOs.value.indexOf('windows')) {
            serviceType.value = 34;
        } else {
            serviceType.value = 35;
        }
    } else if (platform.value == 'kvm') { // KVM
        if (templateOs.value == 5 || 0 === templateOs.value.indexOf('windows')) {
            serviceType.value = 32;
        } else {
            serviceType.value = 33;
        }
    } else if (platform.value == 'kvmstorage') {
        serviceType.value = 57;
    } else if (platform.value == 'xen') {
        serviceType.value = 52;
    } else if (platform.value == 'lxc') {
        serviceType.value = 49;
    } else if (platform.value == 'vmware') {
        serviceType.value = 53;
    } else if (platform.value == 'hyperv') {
        serviceType.value = 54;
    } else if (platform.value == 'virtuozzo') {
        serviceType.value = 55;
    } else if (platform.value == 'ssdvirtuozzo') {
        serviceType.value = 56;
    } else {
        serviceType.value = -1;
    }
    return serviceType.value;
}

function update_hostname() {
    $("#hostname_display").text($('input[name="hostname"]').val());
}

try {
    fetchWrapper.get(baseUrl + '/vps/order').then(response => {
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
        templates.value = response.templates;
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
    });
} catch (error) {
    console.log("error:");
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
                        <form id="vps_form" class="vps_form_init" @submit.prevent="submitForm">
                            <input type="hidden" name="csrf_token" :value="csrfToken">
                            <input type="hidden" id="period" name="period" :value="period" />
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">VPS Details</label>
                                <div class="col-sm-9 form-control bg-gradient-gray text-center b-radius">
                                    <div class="d-inline pr-3"><span>Storage: </span> <span class="text-bold" id="storage">{{ platform == 'kvmstorage' ? hdStorageSlice * slices : hdSlice * slices }} GB</span></div>
                                    <div class="d-inline pr-3"><span>Memory: </span> <span class="text-bold" id="memory_recommended">{{ ramSlice * slices }} MB</span></div>
                                    <div class="d-inline"><span>Transfer: </span> <span class="text-bold" id="Transfer_bandwidth">{{ getBandwidth(slices) }}</span></div>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Platform <span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select class="form-control select2" v-model="platform">
                                        <option v-for="(platformName, platformId, index) in platformNames" :key="index" :value="platformId">{{ platformName }}</option>
                                    </select>
                                    <small id="slicecost" class="form-text text-muted"></small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Location<span class="text-danger"> *</span></label>
                                <div class="col-sm-9 input-group">
                                    <select class="form-control select2" v-model="location">
                                        <option v-for="(locationName, locationId, index) in locationNames" :key="index" :value="locationId">{{ locationName }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Slices<span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select class="form-control select2" v-model="slices">
                                        <option v-for="slice in slicesRange" :key="slice" :value="slice">{{ slice }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Image<span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select class="form-control select2" v-model="templateOs">
                                        <option v-for="(osTemplates, osId, index) in templates[platform]" :key="index" :value="osId">{{ osNames[osId] }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Version<span class="text-danger"> *</span></label>
                                <div class="input-group col-md-9">
                                    <select class="form-control select2" v-model="version">
                                        <option v-for="(templateVersion, templateFile, index) in templates[platform][templateOs]" :key="index" :value="templateFile">{{ templateVersion }}</option>
                                    </select>
                                </div>
                            </div>
                            <div id="hostnamerownew" class="form-group row">
                                <label class="col-sm-3 col-form-label">Hostname</label>
                                <div class="col-md-9">
                                    <input type="text" id="hostname" name="hostname" class="form-control text-sm" placeholder="server.domain.com" v-model="hostname" @keyup="updateHostname" @change="updateHostname" />
                                </div>
                            </div>
                            <div id="rootpassrownew" class="row">
                                <label class="col-sm-3 col-form-label">Root Password<span class="text-danger"> *</span></label>
                                <div class="form-group col-md-9">
                                    <input type="text" name="rootpass" class="form-control text-sm" v-model="rootpass" />
                                    <small class="form-text text-muted">Note: Password must contain atleast 8 characters, one lowercase letter, one uppercase letter, one number, a special character.</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Coupon Code</label>
                                <div class="input-group col-md-9">
                                    <input type="text" class="w-100 form-control text-sm" name="coupon" id="coupon" placeholder="Coupon Code" v-model="coupon" @keyup="updateCoupon" @change="updateCoupon" />
                                    <span class="input-group-addon" style="padding: 0"><img src="https://my.interserver.net/validate_coupon.php?module=vps'" id="couponimg" height="20" width="20" alt=""></span>
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="controls">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-order px-3 py-2 text-sm">
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
                                    <div id="package_name" class="col-md-8 text-muted text-bold">{{ platformPackages[platform] && serviceTypes && serviceTypes[platformPackages[platform]] ? serviceTypes[platformPackages[platform]].services_name : '' }}</div>
                                    <div id="package_period" class="col text-right">{{ period }} Month(s)</div>
                                </div>
                                <div class="row mb-3">
                                    <div id="hostname_display" class="col-md-8 text-muted text-bold">{{ hostname }}</div>
                                    <div class="col text-md text-right totalcost_display">{{ currencySymbol }}{{ platformPackages[platform] ? packageCosts[platformPackages[platform]] : 0 }}</div>
                                </div>
                                <div id="cyclediscountrownew" class="row mb-3">
                                    <div class="col-md-8 text-muted text-bold">Billing cycle discount:</div>
                                    <div id="cyclediscount" class="col text-right"></div>
                                </div>
                                <div id="couponpricerownew" class="row mb-3">
                                    <div id="couponpricetextnew" class="col-md-8 text-muted text-bold">Coupon Discount:</div>
                                    <div id="couponprice" class="col text-right"></div>
                                </div>
                                <hr>
                                <div class="row mb-3">
                                    <div class="col-md-8 text-md text-bold text-muted">Total:</div>
                                    <div id="totalcost" class="col text-md text-right total_cost">{{ currencySymbol }}{{ totalCost }}</div>
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
                                <a id="rec_linux" href="javascript:void(0);" @click.prevent="recomended_linux" data-toggle="tooltip" title="Linux VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2 px-3"><i class="fa fa-linux">&nbsp;</i>Linux&nbsp;</a>
                                <a id="rec_directadmin" href="javascript:void(0);" @click.prevent="recomended_directadmin" data-toggle="tooltip" title="Direct Admin VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2 px-3"><i class="fa fa-user">&nbsp;</i>Direct Admin&nbsp;</a>
                                <a id="rec_windows" href="javascript:void(0);" @click.prevent="recomended_windows" data-toggle="tooltip" title="Windows VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2"><i class="fa fa-windows">&nbsp;</i>Windows&nbsp;</a>
                                <a id="rec_cPanel" href="javascript:void(0);" @click.prevent="recomended_cpanel" data-toggle="tooltip" title="cPanel VPS" class="btn btn-sm btn-secondary b-radius my-2 mr-1" style="padding: 3px 11px 3px 11px;"><i class="fa fa-server">&nbsp;</i>cPanel&nbsp;</a>
                                <a id="rec_linux_desktop" href="javascript:void(0);" @click.prevent="recomended_linux_desktop" data-toggle="tooltip" title="Linux Desktop VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2" style="padding: 3px 10px 3px 10px;"><i class="fa fa-desktop">&nbsp;</i>Linux Desktop&nbsp;</a>
                                <a id="rec_webuzo" href="javascript:void(0);" @click.prevent="recomended_webuzo" data-toggle="tooltip" title="Webuzo VPS" class="btn btn-sm btn-secondary b-radius my-2" style="padding: 3px 8px 3px 8px;"><i class="fa fa-laptop">&nbsp;</i>Webuzo&nbsp;</a>
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
                                <table class="table table-hover table-bordered">
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
                                                    <span style="color:green;">✔</span>
                                                </template>
                                                <template v-else>
                                                    <span style="font-weight:bold;color:red;">❌</span>
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
                        <form ref="editOrderForm" method="post" action="order_vps">
                            <input type="hidden" name="csrf_token" :value="csrfToken" />
                            <input v-for="(value, field) in orderData" :key="field" type="hidden" :id="field" :name="field" :value="value" />
                        </form>

                        <form class="vps_form_confirm" method="post" action="order_vps" @submit.prevent="submitForm">
                            <input type="hidden" name="csrf_token" :value="csrfToken" />
                            <input v-for="(value, field) in orderData" :key="field" type="hidden" :id="field" :name="field" :value="value" />

                            <div v-if="serversel">
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label text-right">
                                        Select Server<span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group col-md-8">
                                        <select class="form-control form-control-sm select2" name="server" v-model="server">
                                            <option v-for="(desc, value) in serversel" :key="value" :value="value">
                                                {{ desc }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-4 col-form-label text-right">Comment</label>
                                    <div class="form-group input-group col-md-8">
                                        <textarea rows="5" class="form-control form-control-sm" name="comment" v-model="comment"></textarea>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label text-right">Paid<span class="text-danger">*</span></label>
                                    <div class="input-group col-md-8">
                                        <select name="paid" class="form-control a-inp-class" v-model="paid">
                                            <option value="no">No</option>
                                            <option value="setup">Not Paid, But Set It Up A While</option>
                                            <option value="yes">Yes</option>
                                        </select>
                                    </div>
                                </div>
                                <hr />
                            </div>
                            <table class="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="text-md float-left" style="position: relative;top:5px;">{{ hostname }}</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" @click="editForm" data-toggle="tooltip" title="Edit details"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div class="text-md text-bold">{{ period }} month(s)</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="text-md">{{ packagesArr[serviceType] }}</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md" id="slicecost">{{ sliceCost }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">VPS Location</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ locations[orderData.location] }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">Slices</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ orderData.slices }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">Memory</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ memory }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">HD Space</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ hdSpace }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">Bandwidth</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ bandwidth }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-md">Operating System</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{ images[orderData.version] }} {{ tempVersion }}</div>
                                        </td>
                                    </tr>
                                    <template v-if="orderData.coupon">
                                        <tr>
                                            <td>
                                                <div class="text-md">Coupon Used</div>
                                            </td>
                                            <td>
                                                <div class="text-bold text-md">{{ orderData.coupon }}
                                                    <img src="https://my.interserver.net/validate_coupon.php?module=vps'" style="padding-left: 10px;" id="couponimg" height="20" width="20" alt="">
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                    <tr style="display: none;">
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
                                            <div class="text-lg text-bold" id="total_cost_display">${{ serviceCost }}</div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <hr>
                            <div class="p-1">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">
                                    The subscription will automatically renew after <b>every month at</b> <span id="renew_cost" class="package_cost text-bold">${{ form_values.service_cost }}</span> until canceled.
                                </p>
                                <p class="text-muted text-xs">
                                    By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.
                                </p>
                                <div class="icheck-success text-bold text-center">
                                    <input type="checkbox" name="tos" id="tos" style="margin: 0 5px; display: inline;" value="yes">
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center;">
                                    <input type="submit" name="Submit" value="Place Order" class="btn btn-green btn-sm px-3 py-2">
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
</style>