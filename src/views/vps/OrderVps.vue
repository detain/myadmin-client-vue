<script setup>
import { ref, computed } from 'vue'

const custid = ref("2773");
const ima = ref("client");
const platformArr = ref({
    kvm: "KVM",
    kvmstorage: "KVM Storage",
    hyperv: "HyperV"
});
const getSlices = ref("");
const getPlatform = ref("");
const getLocation = ref("");
const getVersion = ref("");
const getVpsos = ref("");
const hostname = ref("");
const getCoupon = ref("");
const stockStatus = ref({ "New Jersey": { "KVM Linux": '<span style="color:green;">✔</span>',
        HyperV: '<span style="color:green;">✔</span>', "KVM Storage": '<span style="color:green;">✔</span>'
    }, "Los Angeles": { "KVM Linux": '<span style="color:green;">✔</span>',
        HyperV: '<span style="color:green;">✔</span>', "KVM Storage": '<span style="font-weight:bold;color:red;">X</span>'
    }, "Equinix NY4": { "KVM Linux": '<span style="font-weight:bold;color:red;">X</span>',
        HyperV: '<span style="font-weight:bold;color:red;">X</span>', "KVM Storage": '<span style="font-weight:bold;color:red;">X</span>'
    }
});
const locations = ref({
    1: "New Jersey",
    2: "Los Angeles",
    3: "Equinix NY4"
});
const slices = ref({
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16
});
const step = ref("orderform");
const images = ref({
    centos: "CentOS",
    debian: "Debian",
    fedora: "Fedora",
    opensuse: "OpenSUSE",
    oracle: "Oracle",
    ubuntu: "Ubuntu",
    windows: "Windows",
    almalinux: "Almalinux",
    none: "Empty Disk",
    freepbx: "FreePBX"
});
const versionsel = ref({ "centosstream-8": "8 Stream", "centos-7.7": "7.7"
});
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
const ssdPrice = ref("3 per slice");
const currencySymbol = ref("$");
const rootpass = ref("%J2vak$5");
const csrfToken = ref( "f0c400cae90dd374b7e7fd4c0fa36ca943922277de1be3eedb9f9d8c10e8204231feaa4303cbff563e69f4c8dd5f485c7a9e563cdfccf768b7e2a09401d65a68");
const period = ref(1);


const pkg = ref('');
const totalCostDisplay = ref(0.00);
const packageName = computed(() => {
  if (pkg.value) {
    return pkg.value.services_name
  } else {
    return ':'
  }
});

const totalCost = computed(() => {
  return currencySymbol.value + totalCostDisplay.value.toFixed(2)
});
  var templates = {
    "openvz": {
      "centos": "<option value=\"centos-7-x86_64.tar.gz\">7 64bit<\/option><option value=\"centos-7-x86_64-minimal.tar.gz\">7 minimal 64bit<\/option><option value=\"centos-7-x86_64-cpanel.tar.gz\">7 cpanel 64bit<\/option><option value=\"centos-7-x86_64-breadbasket.tar.gz\">7 Webuzo 64bit<\/option>",
      "debian": "<option value=\"debian-8.0-x86_64.tar.gz\">8.0 64bit<\/option><option value=\"debian-8.0-x86_64-minimal.tar.gz\">8.0 minimal 64bit<\/option><option value=\"debian-7.0-x86_64.tar.gz\">7.0 64bit<\/option><option value=\"debian-7.0-x86_64-minimal.tar.gz\">7.0 minimal 64bit<\/option>",
      "fedora": "<option value=\"fedora-23-x86_64.tar.gz\">23 64bit<\/option><option value=\"fedora-22-x86_64.tar.gz\">22 64bit<\/option><option value=\"fedora-21-x86_64.tar.gz\">21 64bit<\/option><option value=\"fedora-20-x86_64.tar.gz\">20 64bit<\/option>",
      "ubuntu": "<option value=\"ubuntu-16.04-x86_64.tar.gz\">16.04 64bit<\/option><option value=\"ubuntu-15.04-x86_64.tar.gz\">15.04 64bit<\/option><option value=\"ubuntu-15.04-x86_64-minimal.tar.gz\">15.04 minimal 64bit<\/option><option value=\"ubuntu-14.04-x86_64.tar.gz\">14.04 64bit<\/option><option value=\"ubuntu-14.04-x86_64-minimal.tar.gz\">14.04 minimal 64bit<\/option><option value=\"ubuntu-12.04-x86_64.tar.gz\">12.04 64bit<\/option><option value=\"ubuntu-12.04-x86_64-minimal.tar.gz\">12.04 minimal 64bit<\/option><option value=\"ubuntu-15.10-x86_64-minimal.tar.gz\">15.10 minimal 64bit<\/option><option value=\"ubuntu-15.04-x86_64-xrdp.tar.gz\">15.04 xrdp 64bit<\/option>"
    },
    "kvm": {
      "almalinux": "<option value=\"cpanel\">cPanel Alma 8 64bit<\/option><option value=\"almalinux9\">9 64bit<\/option><option value=\"almalinux-8.3\">8.3 64bit<\/option><option value=\"da\">8 + DirectAdmin 64bit<\/option><option value=\"webuzo\">8 + Webuzo  64bit<\/option>",
      "centos": "<option value=\"centosstream-8\">8 Stream 64bit<\/option><option value=\"centos-7.7\">7.7 64bit<\/option>",
      "debian": "<option value=\"debian-9\">9 64bit<\/option><option value=\"debian-11\">11 64bit<\/option><option value=\"debian-10\">10 64bit<\/option>",
      "fedora": "<option value=\"fedora-36\">36 64bit<\/option>",
      "freepbx": "<option value=\"freepbx\">7 64bit<\/option>",
      "none": "<option value=\"empty\">1.0 64bit<\/option>",
      "opensuse": "<option value=\"opensuse-42.1\">42.1 64bit<\/option><option value=\"opensuse-13.2\">13.2 64bit<\/option><option value=\"opensuse-13.1\">13.1 64bit<\/option><option value=\"opensuse-tumbleweed\">1.0 64bit<\/option>",
      "ubuntu": "<option value=\"ubuntu-22.04\">22.04 64bit<\/option><option value=\"ubuntu-20.04\">20.04 64bit<\/option><option value=\"ubuntudesktop\">20.04 Desktop 64bit<\/option><option value=\"ubuntu-18.04\">18.04 64bit<\/option><option value=\"ubuntu-16.04\">16.04 64bit<\/option>",
      "windows": "<option value=\"windows2019\">2019 64bit<\/option><option value=\"windowsr2\">2016 64bit<\/option><option value=\"windows2012\">2012 64bit<\/option><option value=\"windows10\">10 64bit<\/option>"
    },
    "kvmstorage": {
      "almalinux": "<option value=\"almalinux9\">9 64bit<\/option><option value=\"almalinux-8.3\">8 64bit<\/option><option value=\"da\">8 64bit<\/option>",
      "debian": "<option value=\"debian-11\">11 64bit<\/option>",
      "none": "<option value=\"empty\">1.0 64bit<\/option>",
      "ubuntu": "<option value=\"ubuntu-22.04\">22.04 64bit<\/option><option value=\"ubuntu-20.04\">20.04 64bit<\/option>"
    },
    "lxc": {
      "centos": "<option value=\"centos\/7\">7 64bit<\/option>",
      "debian": "<option value=\"debian\/10\">1.0 64bit<\/option><option value=\"debian\/8\">1.0 64bit<\/option><option value=\"debian\/sid\">1.0 64bit<\/option><option value=\"debian\/9\">1.0 64bit<\/option><option value=\"debian\/7\">1.0 64bit<\/option>",
      "fedora": "<option value=\"fedora\/28\">28 64bit<\/option><option value=\"fedora\/27\">27 64bit<\/option><option value=\"fedora\/26\">26 64bit<\/option>",
      "opensuse": "<option value=\"opensuse\/42.3\">42.3 64bit<\/option><option value=\"opensuse\/15.0\">15.0 64bit<\/option>",
      "oracle": "<option value=\"oracle\/7\">7 64bit<\/option><option value=\"oracle\/6\">6 64bit<\/option>",
      "ubuntu": "<option value=\"ubuntu\/focal\">20.04 64bit<\/option><option value=\"ubuntu\/18.10\">18.10 64bit<\/option><option value=\"ubuntu\/18.04\">18.04 64bit<\/option><option value=\"wordpress\">18.04 WordPress 64bit<\/option><option value=\"ubuntu\/16.04\">16.04 64bit<\/option><option value=\"ubuntu\/14.04\">14.04 64bit<\/option>"
    },
    "xen": [],
    "vmware": [],
    "hyperv": {
      "windows": "<option value=\"Windows2022\">2022 64bit<\/option><option value=\"Windows2019Standard\">2019 Standard 64bit<\/option>"
    },
    "virtuozzo": {
      "almalinux": "<option value=\"almalinux-8-x86_64\">8 64bit<\/option>",
      "centos": "<option value=\"centos-stream-9-x86_64\">9 Stream 64bit<\/option><option value=\"centos-8.stream-x86_64\">8 Stream 64bit<\/option><option value=\"centos-7-x86_64\">7 64bit<\/option><option value=\"centos-7-x86_64-cpanel\">7 cPanel 64bit<\/option><option value=\"centos-7-x86_64-breadbasket\">7 Webuzo 64bit<\/option>",
      "debian": "<option value=\"debian-9.0-x86_64\">9.0 64bit<\/option><option value=\"debian-7.0-x86_64\">7.0 64bit<\/option><option value=\"debian-11.0-x86_64\">11.0 64bit<\/option><option value=\"debian-10.0-x86_64\">10.0 64bit<\/option><option value=\"debian-8.0-x86_64\">8.0 64bit<\/option>",
      "fedora": "<option value=\"fedora-23-x86_64\">23 64bit<\/option>",
      "suse": "<option value=\"suse-42.3-x86_64\">42.3 64bit<\/option><option value=\"suse-42.1-x86_64\">42.1 64bit<\/option>",
      "ubuntu": "<option value=\"ubuntu-22.04-x86_64\">22.04 64bit<\/option><option value=\"ubuntu-20.04-x86_64\">20.04 64bit<\/option><option value=\"ubuntu-18.04-x86_64\">18.04 64bit<\/option><option value=\"ubuntu-16.04-x86_64\">16.04 64bit<\/option><option value=\"ubuntu-14.04-x86_64\">14.04 64bit<\/option>",
      "vzlinux": "<option value=\"vzlinux-stream-9-x86_64\">9 Stream 64bit<\/option><option value=\"vzlinux-8-x86_64\">8 64bit<\/option><option value=\"vzlinux-8.stream-x86_64\">8 Stream 64bit<\/option><option value=\"vzlinux-7-x86_64\">7 64bit<\/option><option value=\"vzlinux-6-x86_64\">6 64bit<\/option>"
    },
    "platforms": {
      "lxc": "<option value=\"centos\" selected=\"selected\">CentOS<\/option><option value=\"debian\" >Debian<\/option><option value=\"fedora\" >Fedora<\/option><option value=\"opensuse\" >OpenSUSE<\/option><option value=\"oracle\" >Oracle<\/option><option value=\"ubuntu\" >Ubuntu<\/option>",
      "kvm": "<option value=\"debian\" >Debian<\/option><option value=\"opensuse\" >OpenSUSE<\/option><option value=\"ubuntu\" >Ubuntu<\/option><option value=\"centos\" selected=\"selected\">CentOS<\/option><option value=\"almalinux\" >Almalinux<\/option><option value=\"none\" >Empty Disk<\/option><option value=\"freepbx\" >FreePBX<\/option><option value=\"fedora\" >Fedora<\/option><option value=\"windows\" disabled=\"disabled\">Windows (only on HyperV)<\/option>",
      "hyperv": "<option value=\"windows\" >Windows<\/option>",
      "kvmstorage": "<option value=\"ubuntu\" >Ubuntu<\/option><option value=\"none\" >Empty Disk<\/option><option value=\"debian\" >Debian<\/option><option value=\"almalinux\" >Almalinux<\/option>"
    }
  };
  var virtuozzo_slice_cost = 6;
  var ssd_virtuozzo_slice_cost = 9;
  var hyperv_slice_cost = 10;
  var xen_slice_cost = 6;
  var lxc_slice_cost = 6;
  var vmware_slice_cost = 10;
  var ssd_slice_cost = 9;
  var ovz_slice_cost = 6;
  var kvm_l_slice_cost = 6;
  var kvm_storage_slice_cost = 6;
  var ny_cost = 3;
  var ipv6_only_discount = 1;
  var kvm_w_slice_cost = 10;
  var hd_slice_storage = 1000;
  var cpanel_cost = 20;
  var da_cost = 8;
  var bw_type = 2;
  var bw_total = 2;
  var bw_slice = 2000;
  var hd_slice = 30;
  var ram_slice = 2048;
  const formValues = ref({
      platform: ''
  });
  var cur_location = Number(jQuery("select[name=location]").val());
  var cur_period = Number(jQuery("#period").val());
  var cur_platform = jQuery("select[name=platform]").val();
  var cur_image = jQuery("select[name=version]").val();
  var cur_ssd = jQuery("select[name=ssd]").val();
  var cur_control = jQuery("select[name=controlpanel]").val();
  var cur_slices = Number(jQuery("select[name=slices]").val());
  var slice_cost = ovz_slice_cost;
  var control_cost = 0;
  var coupon_info = 0;
  var last_coupon = "";
  var currency = "USD";
  var packages = {
    "0": "Select A VPS Type",
    "31": "OpenVZ VPS Slice",
    "32": "KVM Windows VPS Slice",
    "33": "KVM Linux VPS Slice",
    "34": "Cloud KVM Windows VPS Slice",
    "35": "Cloud KVM Linux VPS Slice",
    "36": "SSD OpenVZ VPS Slice",
    "49": "LXC VPS Slice",
    "51": "Xen Windows VPS Slice",
    "52": "Xen Linux VPS Slice",
    "53": "VMware VPS Slice",
    "54": "Hyper-V VPS Slice",
    "55": "Virtuozzo VPS Slice",
    "56": "SSD Virtuozzo VPS Slice",
    "57": "KVM Storage",
    "58": "OpenVZ IPv6 Only VPS Slice",
    "59": "KVM Windows IPv6 Only VPS Slice",
    "60": "KVM Linux IPv6 Only VPS Slice",
    "61": "Hyper-V IPv6 Only VPS Slice",
    "62": "Virtuozzo IPv6 Only VPS Slice",
    "63": "KVM IPv6 Only Storage"
  };
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
                            <input type="hidden" id="total_cost_display" name="total_cost_display" :value="totalCostDisplay" />
                            <input type="hidden" id="period" name="period" :value="period" />
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">VPS Details</label>
                                <div class="col-sm-9 form-control bg-gradient-gray text-center b-radius">
                                    <div class="d-inline pr-3"><span>Storage: </span> <span class="text-bold" id="storage"></span></div>
                                    <div class="d-inline pr-3"><span>Memory: </span> <span class="text-bold" id="memory_recommended"></span></div>
                                    <div class="d-inline"><span>Transfer: </span> <span class="text-bold" id="Transfer_bandwidth"></span></div>
                                </div>
                            </div>
                            <hr>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Platform <span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select v-model="formValues.platform" @change="updateVpsChoices" class="form-control select2">
                                        <option v-for="(label, value) in platformArr" :key="value" :value="value" :selected="formValues.platform === value || value === getPlatform">{{ label }}</option>
                                    </select>
                                    <small id="slicecost" class="form-text text-muted"></small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Location<span class="text-danger"> *</span></label>
                                <div class="col-sm-9 input-group">
                                    <select v-model="formValues.location" @change="updateVpsChoices" class="form-control select2">
                                        <option v-for="(label, value) in locations" :key="value" :value="value" :selected="formValues.location === value || value === getLocation">{{ label }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Slices<span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select id="slices_sel" v-model="formValues.slices" @change="updateVpsChoices" class="form-control select2">
                                        <option v-for="(label, value) in slices" :key="value" :value="value" :selected="formValues.slices === value || value === getSlices">{{ label }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Image<span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select v-model="formValues.version" @change="updateVpsChoices" class="form-control select2">
                                        <option v-for="(label, value) in images" :key="value" :value="value" :selected="formValues.version === value || value === getVersion">{{ label }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Version<span class="text-danger"> *</span></label>
                                <div class="input-group col-md-9">
                                    <select class="form-control select2" v-model="formValues.os" @change="updateVpsChoices">
                                        <option v-for="(desc, value) in versionsel" :key="value" :value="value" :selected="formValues.os === value || value === getVpsos">{{ desc }}</option>
                                    </select>
                                </div>
                            </div>
                            <div id="hostnamerownew" class="form-group row">
                                <label class="col-sm-3 col-form-label">Hostname</label>
                                <div class="col-md-9">
                                    <input type="text" id="hostname" name="hostname" class="form-control text-sm" placeholder="server.domain.com" v-model="formValues.hostname" @keyup="updateHostname" @change="updateHostname" />
                                </div>
                            </div>
                            <div id="rootpassrownew" class="row">
                                <label class="col-sm-3 col-form-label">Root Password<span class="text-danger"> *</span></label>
                                <div class="form-group col-md-9">
                                    <input type="text" name="rootpass" class="form-control text-sm" v-model="formValues.rootpass" />
                                    <small class="form-text text-muted">Note: Password must contain atleast 8 characters, one lowercase letter, one uppercase letter, one number, a special character.</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Coupon Code</label>
                                <div class="input-group col-md-9">
                                    <input type="text" class="w-100 form-control text-sm" name="coupon" id="coupon" placeholder="Coupon Code" v-model="formValues.coupon" @keyup="updateCoupon" @change="updateCoupon" />
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
                                    <div id="package_name" class="col-md-8 text-muted text-bold">{{ packageName }}</div>
                                    <div id="package_period" class="col text-right">{{ period }} Month(s)</div>
                                </div>
                                <div class="row mb-3">
                                    <div id="hostname_display" class="col-md-8 text-muted text-bold">{{ hostname }}</div>
                                    <div class="col text-md text-right totalcost_display">{{ currencySymbol }}{{ totalCostDisplay }}</div>
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
                                <a id="rec_linux" href="javascript:void(0);" data-toggle="tooltip" title="Linux VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2 px-3"><i class="fa fa-linux">&nbsp;</i>Linux&nbsp;</a>
                                <a id="rec_directadmin" href="javascript:void(0);" data-toggle="tooltip" title="Direct Admin VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2 px-3"><i class="fa fa-user">&nbsp;</i>Direct Admin&nbsp;</a>
                                <a id="rec_windows" href="javascript:void(0);" data-toggle="tooltip" title="Windows VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2"><i class="fa fa-windows">&nbsp;</i>Windows&nbsp;</a>
                                <a id="rec_cPanel" href="javascript:void(0);" data-toggle="tooltip" title="cPanel VPS" class="btn btn-sm btn-secondary b-radius my-2 mr-1" style="padding: 3px 11px 3px 11px;"><i class="fa fa-server">&nbsp;</i>cPanel&nbsp;</a>
                                <a id="rec_linux_desktop" href="javascript:void(0);" data-toggle="tooltip" title="Linux Desktop VPS" class="btn btn-sm btn-secondary b-radius mr-1 my-2" style="padding: 3px 10px 3px 10px;"><i class="fa fa-desktop">&nbsp;</i>Linux Desktop&nbsp;</a>
                                <a id="rec_webuzo" href="javascript:void(0);" data-toggle="tooltip" title="Webuzo VPS" class="btn btn-sm btn-secondary b-radius my-2" style="padding: 3px 8px 3px 8px;"><i class="fa fa-laptop">&nbsp;</i>Webuzo&nbsp;</a>
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
                                        <tr v-for="(statusArr, location) in stockStatus" :key="location">
                                            <td class="text-center">{{ location }}</td>
                                            <td v-for="(status, platform) in statusArr" :key="platform" class="text-center" v-html="status"></td>
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
                                        <select class="form-control form-control-sm select2" name="server" v-model="formValues.server">
                                            <option v-for="(desc, value) in serversel" :key="value" :value="value">
                                                {{ desc }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-4 col-form-label text-right">Comment</label>
                                    <div class="form-group input-group col-md-8">
                                        <textarea rows="5" class="form-control form-control-sm" name="comment" v-model="formValues.comment"></textarea>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label text-right">Paid<span class="text-danger">*</span></label>
                                    <div class="input-group col-md-8">
                                        <select name="paid" class="form-control a-inp-class" v-model="formValues.paid">
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
                                            <div class="text-md float-left" style="position: relative;top:5px;">{{ formValues.hostname }}</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" @click="editForm" data-toggle="tooltip" title="Edit details"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div class="text-md text-bold">{{ formValues.period }} month(s)</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="text-md">{{ packagesArr[formValues.serviceType] }}</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md" id="slicecost">{{ formValues.sliceCost }}</div>
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
                                            <div class="text-lg text-bold" id="total_cost_display">${{ formValues.serviceCost }}</div>
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