<script setup>
</script>

<template>
    <template v-if="step == 'orderform'">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-envelope-open" aria-hidden="true">&nbsp;</i>Order Mail
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="mail_form" method="post" class="mail_form_init" action="order_mail">
                            <input type="hidden" name="csrf_token" :value="csrf_token">
                            <input type="hidden" name="rootpass" :value="rootpass">
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label text-right">Package
                                    <span class="text-danger"> *</span>
                                </label>
                                <div class="col-sm-9">
                                    <select v-model="selected_package">
                                        <option v-for="pkg in packages" :value="pkg.id">
                                            {{ pkg.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label text-right">Coupon Code</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control form-control-sm" v-model="coupon" @input="update_coupon()" placeholder="Coupon Code">
                                    <span class="input-group-addon" style="padding: 0"><img src="https://my.interserver.net/validate_coupon.php?module=vps'" id="couponimg" height="20" width="20" alt=""></span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center">
                                    <input type="submit" name="Submit" value="Continue" class="btn btn-sm btn-order px-3 py-2">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <div class="row text-center">
                            <div class="controls col-md-12 ">
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
                            <h3 class="card-title py-2">
                                <i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div id="package_name" class="col-md-8" v-if="service_detail.service_name">{{ service_detail.service_name }}</div>
                            <div id="package_period" class="col text-right text-bold">1 Month(s)</div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-8">Package Cost</div>
                            <div class="col text-bold text-right package_cost"></div>
                        </div>
                        <div id="couponpricerownew" class="row mb-3">
                            <div id="couponpricetextnew" class="col-md-8">Coupon Discount</div>
                            <div id="couponprice" class="col text-right text-bold"></div>
                        </div>

                        <hr>
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalcost" class="col text-lg text-bold text-right total_cost"></div>
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
                            <h3 class="card-title py-2">
                                <i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form method="post" id="edit_order_form" action="order_mail">
                            <input type="hidden" name="csrf_token" :value="csrf_token">
                            <template v-for="(field_value, field) in order_data.data">
                                <template v-if="field === 'mail'">
                                    <input id="mailselect" type="hidden" :name="field" :value="field_value">
                                </template>
                                <template v-else-if="field !== 'Submit'">
                                    <input :id="field" type="hidden" :name="field" :value="field_value">
                                </template>
                            </template>
                        </form>
                        <form method="post" class="mail_form_confirm" action="order_mail">
                            <input type="hidden" name="csrf_token" :value="csrfToken">
                            <div v-for="(value, key) in orderData.data" :key="key">
                                <input v-if="key === 'mail'" id="mailselect" type="hidden" :name="key" :value="value" />
                                <input v-else-if="key !== 'Submit'" :id="key" type="hidden" :name="key" :value="value" />
                            </div>
                            <table class="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="text-md float-left" style="position: relative;top:5px">{{serviceDetail.services_name}}</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" @click="editForm" data-toggle="tooltip" title="Edit details"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
                                        </th>
                                        <th>
                                            <div class="text-bold text-md package_cost"></div>
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
                                    <tr v-if="orderData.data.coupon">
                                        <td>
                                            <div class="text-md">Coupon Used</div>
                                        </td>
                                        <td>
                                            <div class="text-bold text-md">{{orderData.data.coupon}} <img src="https://my.interserver.net/validate_coupon.php?module=webhosting'" style="padding-left: 10px;" id="couponimg" height="20" width="20" alt=""></div>
                                        </td>
                                    </tr>
                                    <tr style="display: none;">
                                        <td>
                                            <div id="couponpricetext" class="text-md">Coupon Discount</div>
                                        </td>
                                        <td>
                                            <div id="couponprice" class="text-bold text-md"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-lg text-bold">Total</div>
                                        </td>
                                        <td>
                                            <div class="text-lg text-bold" id="totalprice"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr>
                            <div class="p-1">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">The subscription will automatically renew after <b>every month at</b> <span class="package_cost text-bold">{{ packageCost }}</span> until canceled.</p>
                                <p class="text-muted text-xs">
                                    By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <br><b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b>
                                    By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.
                                </p>
                                <div class="icheck-success text-bold text-center">
                                    <input type="checkbox" name="tos" id="tos" style="margin: 0 5px; display: inline;" value="yes" v-model="tosAgreed">
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center">
                                    <button type="submit" name="Submit" class="btn btn-sm btn-green px-3 py-2" :disabled="!tosAgreed" @click="placeOrder">Place Order</button>
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