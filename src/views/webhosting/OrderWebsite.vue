<script setup>
import { ref } from 'vue'

const web = ref('');
const formAction = web.value === '' ? 'order_website' : `order_website?website=${encodeURIComponent(web.value)}`
</script>

<template>
    <template v-if="!step || step == 'orderform'">
        <form id="website_form" method="post" class="website_form_init" :action="formAction">
            <div class="row justify-content-center">
                <div class="col-md-7">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fas fa-globe" aria-hidden="true">&nbsp;</i>Order Website</h3>
                            </div>
                        </div>
                        <div class="card-body">
                            <input type="hidden" name="csrf_token" :value="csrfToken">
                            <div v-if="!web" class="form-group row">
                                <div class="col-md-12 input-group">
                                    <div class="card">
                                        <div class="card-header">
                                            <div class="p-1">
                                                <h3 class="card-title py-2 text-bold">Webhosting Plans</h3>
                                            </div>
                                        </div>
                                        <div class="card-body row">
                                            <div v-for="pkg in packages" :key="pkg.services_id">
                                                <template v-if="pkg.services_field1 === '' || pkg.services_field1 === 'webhosting'">
                                                    <div class="card mx-1" :style="{
                                                    width: '48%',
                                                    border: pkg.services_id === '11363' ? '4px solid #007bff' : ''
                                                  }">
                                                        <div class="card-header">
                                                            <div class="p-1">
                                                                <h3 class="card-title py-2">
                                                                    <div class="icheck-success">
                                                                        <input :id="pkg.services_name" type="radio" class="form-check-input websiteSelect" :name="pkg.services_name" :value="pkg.services_id" :checked="package_id === pkg.services_id" @change="updatePrice(true)" />
                                                                        <label :for="pkg.services_name">
                                                                            {{ pkg.services_name }}<br />
                                                                            <div class="text-sm text-muted font-italic mt-1">
                                                                                <template v-if="pkg.services_category === '200'">
                                                                                    ( cPanel )
                                                                                </template>
                                                                                <template v-else-if="pkg.services_category === '204'">
                                                                                    ( DirectAdmin )
                                                                                </template>
                                                                                <template v-else-if="pkg.services_category === '202'">
                                                                                    ( Plesk )
                                                                                </template>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            <div class="service_details">
                                                                <template v-if="pkg.services_id === '11363'">
                                                                    <div class="ribbon-wrapper">
                                                                        <div class="ribbon bg-primary">Popular</div>
                                                                    </div>
                                                                </template>
                                                                {{ pkg.services_description }}
                                                            </div>
                                                        </div>
                                                        <div class="card-footer">
                                                            <div class="service_cost float-left">
                                                                Starting From: <b>{{ currencySymbol }}{{ pkg.services_cost }}</b>
                                                            </div>
                                                            <div class="float-right">
                                                                <a :href="pkg.services_moreinfo_url" target="_blank" style="font-size: 14px;" data-toggle="tooltip" title="More Info">
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
                                <div class="col-md-12 input-group">
                                    <div class="card">
                                        <div class="card-header">
                                            <div class="p-1">
                                                <h3 class="card-title py-2 text-bold">Reseller Plans</h3>
                                            </div>
                                        </div>
                                        <div class="card-body row">
                                            <div v-for="pkg in packages" :key="pkg.services_id">
                                                <div v-if="pkg.services_field1 === 'reseller'" class="card mx-1" :style="{width: '48%', border: pkg.services_id === '11363' ? '4px solid #007bff' : ''}">
                                                    <div class="card-header">
                                                        <div class="p-1">
                                                            <h3 class="card-title py-2">
                                                                <div class="icheck-success">
                                                                    <input :id="pkg.services_name" type="radio" class="form-check-input websiteSelect" name="website" :value="pkg.services_id" :checked="(package_id && package_id === pkg.services_id)" @change="updatePrice(true)">
                                                                    <label :for="pkg.services_name">
                                                                        {{ pkg.services_name }}<br>
                                                                        <div class="text-sm text-muted font-italic mt-1">
                                                                            <span v-if="pkg.services_category === '200'">( cPanel )</span>
                                                                            <span v-else-if="pkg.services_category === '204'">( DirectAdmin )</span>
                                                                            <span v-else-if="pkg.services_category === '202'">( Plesk )</span>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="service_details">
                                                            {{ pkg.services_description }}
                                                        </div>
                                                    </div>
                                                    <div class="card-footer">
                                                        <div class="service_cost float-left">
                                                            Starting From: <b>{{ currencySymbol }}{{ pkg.services_cost }}</b>
                                                        </div>
                                                        <div class="float-right">
                                                            <a :href="pkg.services_moreinfo_url" target="_blank" style="font-size: 14px;" data-toggle="tooltip" title="More Info">
                                                                <i class="fa fa-external-link"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <template v-else>
                                <template v-for="pkg in packages">
                                    <div v-if="pkg.services_id == package_id" class="form-group row" :key="pkg.services_id">
                                        <label class="col-sm-2 col-form-label px-0">Package<span class="text-danger">*</span></label>
                                        <div class="card col-md-10 p-0">
                                            <div class="card-header">
                                                <div class="p-1">
                                                    <h3 class="card-title py-2">
                                                        <div class="icheck-success">
                                                            <input :id="pkg.services_name" type="radio" class="form-check-input websiteSelect" name="website" :value="pkg.services_id" :checked="package_id == pkg.services_id" @change="updatePrice(true)">
                                                            <label :for="pkg.services_name">
                                                                {{ pkg.services_name }}<br>
                                                                <div class="text-sm text-muted font-italic mt-1">
                                                                    <template v-if="pkg.services_category == '200'">( cPanel )</template>
                                                                    <template v-else-if="pkg.services_category == '204'">( DirectAdmin )</template>
                                                                    <template v-else-if="pkg.services_category == '202'">( Plesk )</template>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </h3>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <div class="service_details">
                                                    <template v-if="pkg.services_id == '11363'">
                                                        <div class="ribbon-wrapper">
                                                            <div class="ribbon bg-primary">Popular</div>
                                                        </div>
                                                    </template>
                                                    {{ pkg.services_description }}
                                                </div>
                                            </div>
                                            <div class="card-footer">
                                                <div class="service_cost float-left">Starting From: <b>{{ currencySymbol }}{{ pkg.services_cost }}</b></div>
                                                <div class="float-right">
                                                    <a :href="pkg.services_moreinfo_url" target="_blank" style="font-size: 14px;" data-toggle="tooltip" title="More Info"><i class="fa fa-external-link"></i></a>
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
                                <div class="col-md-6 package_name">{{ pkg.services_name }}</div>
                                <div class="col text-right period">1 Month</div>
                            </div>
                            <div class="row mb-3">
                                <div id="hostname_display" class="col-md-6"></div>
                                <div class="col text-right package_cost"></div>
                            </div>
                            <div id="couponpricerownew" class="row mb-3 coupon-display d-none">
                                <div id="couponpricetext" class="col-md-6"></div>
                                <div id="couponprice" class="col text-right"></div>
                            </div>
                            <hr>
                            <div class="row mb-3">
                                <div class="col-md-8 text-lg">Total</div>
                                <div id="totalprice" class="col text-lg text-right total_cost"></div>
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
                                <div class="col-md-12"><input id="hostname" type="text" placeholder="Enter a domain name" class="form-control form-control-sm" name="hostname" v-model="formValues.hostname" required @keyup="updateDomain" @change="updateDomain" />
                                    <small class="form-text text-muted">Website Domain Name (ie yoursite.com)</small>
                                </div>
                            </div>
                            <div id="registerrow" class="form-group row d-none d-status mb-0">
                                <label class="col-sm-12">Domain Status<span class="text-danger">*</span></label>
                                <div class="col-md-12">
                                    <small id="registertext" class="form-text text-warning text-sm mb-0"></small>
                                </div>
                                <label id="registerdesc" class="col-md-12 col-form-label"></label>
                                <span class="form-text"></span>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-12">Billing Cycle<span class="text-danger">*</span></label>
                                <div class="col-sm-12">
                                    <select name="period" id="period" class="form-control form-control-sm select2" v-model="formValues.period" @change="updatePrice">
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
                                <div class="col-md-12"><input type="text" class="form-control form-control-sm" name="coupon" id="coupon" placeholder="Coupon Code" v-model="formValues.coupon" @change="updateCoupon" v-if="formValues.coupon" /></div>
                                <div class="col-md-12"></div>
                                <div class="col-md-12"><img src="https://my.interserver.net/validate_coupon.php?module=vps'" id="couponimg" height="20" width="20" alt="">
                                    <span class="text-sm text-muted" id="coupon_text" style="position: relative;top: 2px;"></span>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center;"><input type="submit" name="Submit" value="Continue" class="btn btn-sm btn-order py-2 px-3"></div>
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
                        <form method="post" :action="'order_website' + (web ? '?website=' + web : '')" id="edit_order_form">
                            <input type="hidden" name="csrf_token" :value="csrf_token">
                            <input v-for="(field_value, field) in order_data.data" :key="field" :id="field" :type="(field === 'website' ? 'hidden' : 'hidden')" :name="field" :value="field_value">
                        </form>
                        <form method="post" class="website_form_confirm" :action="'order_website' + (web ? '?website=' + web : '')">
                            <input type="hidden" name="csrf_token" :value="csrf_token">
                            <input v-for="(field_value, field) in order_data.data" :key="field" :id="field" :type="(field === 'website' ? 'hidden' : 'hidden')" :name="field" :value="field_value">
                            <table class="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            <button type="button" style="" name="update_values" @click="edit_form" data-toggle="tooltip" class="btn btn-sm text-bold" title="Edit details">
                                                <div style="display: inline;" class="text-md float-left">{{ order_data.data.hostname }}</div>
                                                <i style="padding-top: 4px;padding-left: 4px;" aria-hidden="true" class="fa fa-pencil float-right"></i>
                                            </button>
                                        </th>
                                        <th>
                                            <div class="text-md">{{ frequency }} Month(s)</div>
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
                                            <div class="col-md-8 text-md">{{ service_detail.services_name }}</div>
                                        </td>
                                        <td>
                                            <div class="text-md package_cost"></div>
                                        </td>
                                    </tr>
                                    <template v-if="order_data.data.coupon && order_data.data.coupon !== ''">
                                        <tr>
                                            <td>
                                                <div class="text-md">Coupon Used</div>
                                            </td>
                                            <td>
                                                <div class="text-md text-bold">{{ order_data.data.coupon }} <img src="https://my.interserver.net/validate_coupon.php?module=webhosting'" style="padding-left: 10px;" id="couponimg2" height="20" width="20" alt=""></div>
                                            </td>
                                        </tr>
                                    </template>
                                    <tr style="display: none;">
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
                                            <div class="text-lg text-bold" id="totalprice2">{{ service_cost }}</div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <div class="p-1">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-sm text-center">The subscription will automatically renew every <b>{{ frequency }} month(s) at {{ order_data.data.renewal_cost ? currencySymbol + order_data.data.renewal_cost : currencySymbol + tos_repeat_service_cost }}</b> until canceled.</p>
                                <p class="text-muted text-xs">
                                    By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <br><b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.
                                </p>
                                <p class="icheck-success text-bold text-center"><input type="checkbox" name="tos" id="tos" class="d-inline" style="margin:0 5px;" value="yes">
                                    <label for="tos" style="display: inline;text-align: center;">I have read the terms above and I agree.</label>
                                </p>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12" style="text-align: center;"><input type="submit" name="Submit" value="Place Order" class="btn px-3 btn-green py-2 text-sm"></div>
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