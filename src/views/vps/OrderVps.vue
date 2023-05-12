<script setup>
import { storeToRefs } from 'pinia';
import { ref, reactive, computed, onMounted } from 'vue'
//import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useVpsOrderStore } from '@/stores';

const vpsOrderStore = useVpsOrderStore();
const { maxSlices, platformPackages, platformNames, packageCosts, locationStock, osNames, locationNames, templates } = storeToRefs(vpsOrderStore);

const slices = ref("");
const platform = ref("");
const location = ref("");
const version = ref("");
const os = ref("");
const hostname = ref("");
const coupon = ref("");
const step = ref("orderform");
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
const currencySymbol = ref("$");
const rootpass = ref("");
const csrfToken = ref( "");
const period = ref(1);


const pkg = ref('');
const totalCostDisplay = ref(0.00);

const totalCost = computed(() => {
  return currencySymbol.value + totalCostDisplay.value.toFixed(2)
});
  var ipv6_only_discount = 1;
  var hd_slice_storage = 1000;
  var cpanel_cost = 20;
  var da_cost = 8;
  var bw_type = 2;
  var bw_total = 2;
  var bw_slice = 2000;
  var hd_slice = 30;
  var ram_slice = 2048;
  var control_cost = 0;
  var coupon_info = 0;
  var last_coupon = "";
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
                                    <select v-model="platform" @change="updateVpsChoices" class="form-control select2">
                                        <option v-for="(label, value) in platformArr" :key="value" :value="value" :selected="platform">{{ label }}</option>
                                    </select>
                                    <small id="slicecost" class="form-text text-muted"></small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Location<span class="text-danger"> *</span></label>
                                <div class="col-sm-9 input-group">
                                    <select v-model="location" @change="updateVpsChoices" class="form-control select2">
                                        <option v-for="(label, value) in locations" :key="value" :value="value" :selected="location === value">{{ label }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Slices<span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select id="slices_sel" v-model="slices" @change="updateVpsChoices" class="form-control select2">
                                        <option v-for="(label, value) in slices" :key="value" :value="value" :selected="slices === value">{{ label }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Image<span class="text-danger"> *</span></label>
                                <div class="col-sm-9">
                                    <select v-model="version" @change="updateVpsChoices" class="form-control select2">
                                        <option v-for="(label, value) in images" :key="value" :value="value" :selected="version === value">{{ label }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label">Version<span class="text-danger"> *</span></label>
                                <div class="input-group col-md-9">
                                    <select class="form-control select2" v-model="os" @change="updateVpsChoices">
                                        <option v-for="(desc, value) in versionsel" :key="value" :value="value" :selected="os === value">{{ desc }}</option>
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