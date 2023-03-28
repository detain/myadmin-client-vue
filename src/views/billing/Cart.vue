<script setup>
import { ref, onMounted } from "vue";
const cc_arr = ref([]);
const pymt_method = ref('paypal');
const selected_cc = ref('');
const csrf_token = ref('');
const cc_id = ref(0);
const r_pymt_method = ref('');
const name = ref('');
const cc_detail = ref({});
const country_select = ref('');
const address = ref('');
const city = ref('');
const state = ref('');
const zip = ref('');
const country = ref('');
const phone = ref('');
const invrows = ref([]);
const currency = ref('USD');
const currencyArr = ref([]);
const invoiceDays = ref('');
const order_msg = ref('');
const total_display = ref(0.00);
const displayPrepay = ref(true);
const total_invoices = ref(0);

const cont_fields = {
    name: ref('')
};

function mounted() {
    if (trigger_click) {
        $("#unver_{{ current_cc_id }}").attr("data-step", "{{ trigger_click }}").trigger('click');
    }
}

function delete_card(cc_id = '0')
{
    $("#cc_idx").val(cc_id);
    const { value: formValues } = Swal.fire({
        type: "warning",
        title: '<h3>Delete CreditCard</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Delete it.',
        html: '<p>Are you sure want to remove your creditcard <br><b>'+cc_arr[cc_id]['mask_cc']+'</b> ?</p>',
        preConfirm: () => {
            $('#deleteForm').submit();
        }
    });
}

function edit_card(cc_id = 0)
{
    $("#e_cc_idx").val(cc_id);
    $("#e_cr_no").val(cc_arr[cc_id]['mask_cc']);
    $("#e_exp").val(cc_arr[cc_id]['cc_exp']);
    $("#EditForm select[name='country']").attr('disabled','disabled');
    $('#EditClick').trigger('click');
}

function verify_card(cc_id = 0)
{
    $(".v_cc_idx").val(cc_id);
    verify_display = $('#unver_'+cc_id).attr("data-step");
    if ( typeof verify_display === 'undefined') {
        $('#VerifyFormStep1').trigger('click');
    } else if(verify_display == 'step1') {
        $('#VerifyFormStep1').trigger('click');
    } else if(verify_display == 'step2') {
        $('#VerifyClick').trigger('click');
    }
}

function update_payment_method(cc_val, cc_auto = '0')
{
    if (cc_auto == 1) {
        if ($('#customSwitch3').is(':checked')) {
            $("#cc_auto_update").val(1);
        } else {
            $("#cc_auto_update").val(0);
        }
    } else {
        $("#defaultpymt_method").val(cc_val);
    }
    $("#defaultpymt").submit();
}

function formatCardNum(e) {
  if (e.target.value == e.target.lastValue) return;
  var caretPosition = e.target.selectionStart;
  var sanitizedValue = e.target.value.replace(/[^0-9]/gi, '');
  var parts = [];
  for (var i = 0, len = sanitizedValue.length; i < len; i += 4) {
    parts.push(sanitizedValue.substring(i, i + 4));
  }
  for (var i = caretPosition - 1; i >= 0; i--) {
    var c = e.target.value[i];
    if (c < '0' || c > '9') {
      caretPosition--;
    }
  }
  caretPosition += Math.floor(caretPosition / 4);
  e.target.value = e.target.lastValue = parts.join('-');
  e.target.selectionStart = e.target.selectionEnd = caretPosition;
}

function formatExpDate(e) {
  if (e.target.value == e.target.lastValue) return;
  var caretPosition = e.target.selectionStart;
  var sanitizedValue = e.target.value.replace(/[^0-9]/gi, '');
  var parts = [];
  for (var i = 0; i < 2; i += 2) {
    parts.push(sanitizedValue.substring(i, i + 2));
  }
  if (sanitizedValue.length >= 2) {
    for (var j = 2; j < sanitizedValue.length; j += 5) {
      parts.push(sanitizedValue.substring(j, j + 5));
    }
  }
  for (var i = caretPosition - 1; i >= 0; i--) {
    var c = e.target.value[i];
    if (c < '0' || c > '9') {
      caretPosition--;
    }
  }
  caretPosition += Math.floor(caretPosition / 2);
  e.target.value = e.target.lastValue = parts.join('/');
  e.target.selectionStart = e.target.selectionEnd = caretPosition;
}

function onCardNumInput(e) {
  formatCardNum(e);
}

function onExpDateInput(e) {
  formatExpDate(e);
}

function deleteCard(cc_id = '0') {
  $("#cc_idx").val(cc_id);
  const { value: formValues } = Swal.fire({
    type: "warning",
    title: '<h3>Delete CreditCard</h3> ',
    showCancelButton: true,
    showLoaderOnConfirm: true,
    confirmButtonText: 'Yes, Delete it.',
    html: '<p>Are you sure want to remove your creditcard <br><b>' + cc_arr[cc_id]['mask_cc'] + '</b> ?</p>',
    preConfirm: () => {
      $('#deleteForm').submit();
    }
  });
}

function editCard(cc_id = 0) {
  $("#e_cc_idx").val(cc_id);
  $("#e_cr_no").val(cc_arr[cc_id]['mask_cc']);
  $("#e_exp").val(cc_arr[cc_id]['cc_exp']);
  $("#EditForm select[name='country']").attr('disabled', 'disabled');
  $('#EditClick').trigger('click');
}

</script>

<template>
    <div v-if="order_msg" class="row justify-content-center mt-2">
        <div class="col-md-12">
            <div class="callout callout-success">
                <h5>Thank you! for your order.</h5>
                <p class="text-md" v-html="order_msg"></p>
            </div>
        </div>
    </div>
    <div class="row justify-content-center mt-2">
        <div class="col-md-9">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2 float-left">
                            <i class="fa fa-money">&nbsp;</i>Pay Balance
                        </h3>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row my-2">
                        <div class="col-md-12">
                            <span class="text-bold mr-1" style="border: 1px solid black;border-radius:50%;padding: 6px 12px;font-size: 18px;">1</span>
                            <b class="text-lg">Billing Address</b>
                        </div>
                        <div v-if="address && address !== ' '" class="col-md-4 p-4 mt-4 ml-5 b-radius card" style="border: 1px solid rgba(204, 204, 204, 0.397);">
                            <div class="row">
                                <div class="col-md-2 mb-3">
                                    <div class="icheck-success">
                                        <input id="contact_check" type="radio" class="form-check-input" checked>
                                        <label for="contact_check"></label>
                                    </div>
                                </div>
                                <div class="col-md-10 mb-3">
                                    <b class="text-lg">Home</b><br>
                                    <template v-if="name && name !== ''">
                                        <b class="mb-2 text-md">{{ name }}</b><br>
                                    </template>
                                    <template v-if="address && address !== ''">
                                        {{ address }}<br>
                                    </template>
                                    <template v-if="city && zip && country">
                                        {{ city }}, {{ zip }}, {{ state }}, {{ country }}<br>
                                    </template>
                                    <template v-else-if="city && zip && !country">
                                        {{ city }}, {{ zip }}, {{ state }}<br>
                                    </template>
                                    <template v-else>
                                        {{ city }}, {{ state }}<br>
                                    </template>
                                    <template v-if="phone !== ''">
                                        <span class="mt-2">{{ phone }}</span>
                                    </template>
                                </div>
                                <div class="col-md-12 text-right pr-3">
                                    <a href="javascript:void(0);" class="btn btn-custom py-1 px-3 btn-sm" data-toggle="tooltip" title="Update Contact Info" @click="editInfo">
                                        <i class="fa fa-edit" aria-hidden="true">&nbsp;</i>EDIT
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div v-else class="card py-3 ml-5 my-3 px-4">
                            <div class="card-header">
                                <h5 class="card-title text-bold py-2">
                                    Please Add Billing Address to continue Purchase.
                                </h5>
                            </div>
                            <div class="card-body mx-auto my-2">
                                <a href="/contact_info" class="btn btn-custom py-2 px-3" data-toggle="tooltip" title="Add Billing Address to continue">
                                    <i class="fa fa-plus"></i>&nbsp;Add Billing Address
                                </a>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row mt-5">
                        <div class="col-md-5 p-0">
                            <div class="col-md-12">
                                <span class="text-bold mr-1" style="border: 1px solid black;border-radius:50%;padding: 6px 12px;font-size: 18px;">2</span>
                                <b class="text-lg"># Of Products</b>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <form @submit.prevent="submitForm('cart' + (st ? '?st=' + st : ''))">
                                <div class="form-group row">
                                    <label for="invoice_days" class="col-md-4 col-form-label">Filter</label>
                                    <select id="invoice_days" class="col-md-8 select2 form-control text-left" name="invoice_days" v-model="invoiceDays" @change="submitForm()">
                                        <option value="-1">All Days</option>
                                        <option value="30">30 Days</option>
                                        <option value="60">60 Days</option>
                                        <option value="90">90 Days</option>
                                        <option value="365">1 Year</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="col-md-3 text-center">
                            <form @submit.prevent="submitForm('cart' + (st ? '?st=' + st : ''))">
                                <div class="form-group row">
                                    <label for="currency_select" class="col-md-6 col-form-label">Currency</label>
                                    <select id="currency_select" class="col-md-6 select2 form-control text-left" name="currency" v-model="currency" @change="submitForm()">
                                        <option v-for="(value, name) in currencyArr" :value="value">{{ name }}</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                    </div>
                    <template v-if="invrows.length > 0">
                        <table class="table table-md my-0 mx-auto" style="width: 88%;">
                            <tr>
                                <th style="width: 5%;">
                                    <div class="icheck-success d-inline">
                                        <input id="checkboxtoggle" type="checkbox" name="uncheckAll" value="" onChange="toggleCheckbox();" checked>
                                        <label for="checkboxtoggle"> </label>
                                    </div>
                                </th>
                                <th>Service</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Service Status</th>
                                <th>Actions</th>
                                <th class="text-right">Amount</th>
                            </tr>
                            <tr v-for="(invrow, key) in invrows" :key="key" :class="[
                            invrow.invoices_module !== 'default' ? modules[invrow.invoices_module] : '',
                            invrow.days_old <= 31 ? 'recentrow' : 'oldrow',
                            `inv${invrow.invoices_module}${invrow.invoices_id}row`,
                            invrow.invoices_service > 0 ? `service${invrow.invoices_module}${invrow.invoices_service}` : '',
                            invrow.collapse === 1 ? `collapse toggle${invrow.invoices_module}${invrow.invoices_service}` : '',
                            invrow.service_line === 1 ? 'service_main collapsed' : '',
                            invrow.prepay_invoice ? 'prepay_invoice_row' : ''
                        ]" :data-toggle="invrow.service_line === 1 ? 'collapse' : null" :data-target="invrow.service_line === 1 ? `.toggle${invrow.invoices_module}${invrow.invoices_service}` : null">
                                <td>
                                    <div class="icheck-success d-inline">
                                        <input :id="invrow.service_label" :type="invrow.service_line === 1 ? 'checkbox' : 'radio'" :name="invrow.service_line === 1 ? 'services[]' : 'invoices[]'" :value="invrow.service_label" :checked="!invrow.prepay_invoice" class="inv_checkbox" @change="updateTotal(invrow.service_label)">
                                        <label :for="invrow.service_label"> </label>
                                    </div>
                                </td>
                                <td>
                                    <template v-if="invrow.invoices_module === 'default'">{{ invrow.service }}</template>
                                    <template v-else-if="invrow.collapse !== 1">
                                        <a class="text-primary" :href="`index.php?choice=none.view_${modules[invrow.invoices_module]}&id=${invrow.invoices_service}`">{{ invrow.service }}</a>
                                    </template>
                                </td>
                                <td>{{ invrow.invoices_description }}</td>
                                <td>{{ invrow.date }}</td>
                                <td>{{ invrow.service_status }}</td>
                                <td class="text-center">
                                    <template v-if="invrow.prepay_invoice || invrow.service_status === 'pending'">
                                        <a href="javascript:void(0);" @click="delete_invoice(invrow.invoices_id)" data-toggle="tooltip" title="Delete Invoice"><i class="fa fa-trash"></i></a>
                                        <form :id="`invdel${invrow.invoices_id}`" action="del_inv?r=cart" method="POST">
                                            <input type="hidden" name="inv_id" :value="invrow.invoices_id">
                                        </form>
                                    </template>
                                    <template v-else>
                                        <span class="text-sm font-italic text-muted">Empty...</span>
                                    </template>
                                </td>
                                <td>{{ invrow.currency_display }}</td>
                            </tr>
                            <tr>
                                <td>Filter</td>
                                <td colspan="7">
                                    <input id="checkboxtoggle" type="checkbox" name="uncheckAll" value="" v-model="isChecked" @change="toggleCheckbox">
                                    <button type="button" class="btn bg-teal btn-sm" @click="checkAll">All</button>
                                    <button type="button" class="btn bg-teal btn-sm" @click="uncheckAll">None</button>
                                    <button type="button" class="btn bg-teal btn-sm" @click="checkRecent">Past Month</button>
                                    <button type="button" class="btn bg-teal btn-sm" @click="checkActive">Active</button>
                                    <button v-for="(count, module) in modulesCounts" :key="module" class="btn btn-sm bg-teal" @click="checkClass(module+'row')">{{ module.charAt(0).toUpperCase() + module.slice(1) }} <span class="badge badge-light ml-1">{{ count }}</span></button>
                                </td>
                            </tr>
                        </table>
                        <hr>
                        <div class="row mt-4">
                            <div class="col-md-12">
                                <span id="step_3" class="text-bold mr-1" style="border: 1px solid black;border-radius:50%;padding: 6px 12px;font-size: 18px;">3</span>
                                <b class="text-lg">Payment Options</b>
                            </div>
                            <div class="col-md-12 mt-4 px-5 py-3 b-radius" style="background: #f4f4f4;">
                                <h5 class="text-bold text-md text-capitalize">How do you want to Pay?</h5>
                                <span id="payments-section"></span>
                            </div>
                        </div>
                        <hr>
                        <div :style="{ display: pymt_method !== 'cc' ? 'none' : '' }" id="select_card">
                            <div class="row my-2">
                                <div class="col-md-12">
                                    <span id="step_4" class="text-bold mr-1" style="border: 1px solid black;border-radius:50%;padding: 6px 12px;font-size: 18px;">4</span>
                                    <b class="text-lg">Select / Add Credit Card</b>
                                    <a href="javascript:void(0);" class="btn btn-custom float-right" data-toggle="modal" data-target="#add-card"><i class="fa fa-plus" aria-hidden="true">&nbsp;</i>Add New Card</a>
                                </div>
                                <div class="col-md-12 d-flex mt-3" id="selectcardmsg"></div>

                                <div v-if="cc_arr && cc_arr.length">
                                    <div v-for="(cc_detail, cc_id) in cc_arr" :key="cc_id" class="col-md-4 p-4 mt-4 ml-5 b-radius card" :style="'border: 1px solid rgba(204, 204, 204, 0.397);' + (($pymt_method == 'cc' && $selected_cc == cc_id) ? 'background-color: rgba(204, 204, 204, 0.397);' : '')">
                                        <div v-if="$pymt_method == 'cc' && $selected_cc == cc_id" class="ribbon-wrapper">
                                            <div class="ribbon bg-success text-xs">Default</div>
                                        </div>
                                        <form action="cart" method="post" id="paymentform">

                                            <div class="col-md-12 mb-3">
                                                <div class="icheck-success">
                                                    <input :id="'cc-' + cc_id" :name="r_pymt_method" :value="'cc_' + cc_id" type="radio" class="form-check-input" :disabled="cc_detail.verified_cc === 'no'" :data-toggle="cc_detail.verified_cc === 'no' ? 'tooltip' : null" :title="cc_detail.verified_cc === 'no' ? cc_detail.verified_text : null" :checked="pymt_method === 'cc' && selected_cc === cc_id" @change="updatePaymentMethod('cc' + cc_id)" />
                                                    <label :for="'cc-' + cc_id" class="text-lg pb-2" style="letter-spacing: 4px;">{{ cc_detail.mask_cc }}</label>
                                                </div>
                                                <div class="pl-4 ml-2">
                                                    <div class="my-2 text-sm">
                                                        <b class="text-md">{{ name }}</b>
                                                    </div>
                                                    <div class="text-sm text-muted">Expires on {{ cc_detail.cc_exp }}</div>
                                                    <div class="my-2">
                                                        <template v-if="pymt_method === 'cc' && selected_cc === cc_id">
                                                            <div id="selected_services"></div>
                                                            <input type="hidden" name="balance" value="1" />
                                                            <input type="password" name="cc_ccv2" placeholder="cvv2" style="border-radius: 5px; width: 100%;" minlength="3" maxlength="4" required :oninvalid="`this.setCustomValidity('Please Enter 3 digit CVV number on credit card number')`" @input="`setCustomValidity('')`" />
                                                        </template>
                                                        <template v-else>
                                                            &nbsp;
                                                        </template>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-6 pl-4">
                                                <a v-if="cc_detail.verified_cc === 'no'" :id="'unver_' + cc_id" class="tn btn-outline-custom py-1 px-3 btn-xs ml-2" href="payment_types?action=verify" data-toggle="tooltip" style="text-decoration: none;" :title="cc_detail.unverified_text">
                                                    <i class="fa fa-exclamation-triangle"></i>&nbsp;Verify
                                                </a>
                                                <a v-else-if="cc_detail.verified_cc !== 'no' && (!selected_cc || (selected_cc && selected_cc !== cc_id))" class="btn btn-custom py-1 px-3 btn-sm ml-2" href="javascript:void(0);" data-toggle="tooltip" :title="cc_detail.edit_text" @click="editCard(cc_id)">
                                                    <i class="fa fa-edit" aria-hidden="true">&nbsp;</i>Edit
                                                </a>
                                                <div v-else-if="pymt_method === 'cc' && selected_cc === cc_id" class="text-lg text-success" name="totalccamount"></div>
                                            </div>

                                            <div class="col-md-6 text-right">
                                                <a v-if="(!$selected_cc || ($selected_cc != cc_id || cc_detail.verified_cc == 'no')) && $pymt_method == 'cc'" class="btn btn-outline-custom py-1 px-3 btn-xs" href="javascript:void(0);" data-toggle="tooltip" :title="cc_detail.delete_text" @click="deleteCard(cc_id)" style="text-decoration: none;">
                                                    <i class="fa fa-trash"></i>&nbsp;Delete
                                                </a>
                                                <input v-else-if="$pymt_method == 'cc' && $selected_cc == cc_id" id="paynow" type="submit" class="btn btn-outline-custom btn-sm" style="border-radius: 5px;" value="Pay Now">
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div v-else class="col-md-12 mt-4 px-5 py-3 b-radius" style="background: #f4f4f4;">
                                    <h5 class="text-bold text-md text-capitalize">You Have 0 Credit Cards</h5>
                                    <span class="text-red">To Add a Credit Card, Please Click on the Add New Card Button.</span>
                                </div>
                            </div>
                        </div>
                        <hr>
                    </template>
                    <template v-else>
                        <table class="table table-md my-0 mx-auto" style="width: 88%;">
                            <tr>
                                <th style="width: 5%;">
                                    <div class="icheck-success d-inline">
                                        <input id="checkboxtoggle" type="checkbox" name="uncheckAll" value="" onChange="toggleCheckbox();">
                                        <label for="checkboxtoggle"> </label>
                                    </div>
                                </th>
                                <th>Service</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Service Status</th>
                                <th>Actions</th>
                                <th class="text-right">Amount</th>
                            </tr>
                            <tr>
                                <td colspan="7" class="text-center text-black text-bold b-radius" style="background: #f4f4f4;">
                                    No Invoices to pay...
                                </td>
                            </tr>
                        </table>
                    </template>
                    <div v-if="currency == 'INR'" class="text-sm col-md-12 mt-4 alert alert-info b-radius mb-0">
                        <h4 class="text-bold text-lg text-capitalize">Manual Bank Payment Option:</h4>
                        <p class="form-text m-0">
                            <b>Name:</b> ROCKSOLID INTERSERVER PRIVATE LIMITED<br />
                            <b>Current A/C No:</b> 155605010028<br />
                            <b>IFSC Code:</b> ICIC0001556<br />
                            After payment is made open a support ticket with the transaction id, date, and amount paid.
                            We will manually credit the payment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card" style="position: fixed;top: 30%;width: 22%;">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2 float-left">
                            <i class="fa fa-file-invoice">&nbsp;</i>Balance & Invoice Info
                        </h3>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-sm">
                        <tr>
                            <td class="text-center" colspan="2" style="border: none;">
                                <div><strong>Total Invoices</strong></div>
                                <div class="text-lg text-success" v-html="total_invoices"></div>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center" colspan="2">
                                <div><strong>Invoices Total Amount</strong></div>
                                <div class="text-lg text-success" name="totalcol" v-html="total_display"></div>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center">
                                <div><strong>PrePay Available</strong></div>
                                <div class="text-lg text-success" v-html="displayPrepay"></div>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center" colspan="2">
                                <div><strong>To Be Paid</strong></div>
                                <div class="text-lg text-success" name="totalamount" v-html="total_display"></div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="add-card" style="display: none;" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">Add Credit Card</h4>
                </div>
                <div class="modal-body">
                    <form action="cart" method="post" class="form-card">
                        <input type="hidden" name="csrf_token" :value="csrf_token">
                        <input type="hidden" name="action" value="add">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input type="text" id="cr_no" name="cc" placeholder="0000 0000 0000 0000" minlength="19" maxlength="19" required oninvalid="this.setCustomValidity('Please Enter valid 16 digit credit card number')" oninput="setCustomValidity('')">
                                    <label class="text-md">Card Number</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input type="text" id="exp" name="cc_exp" placeholder="MM/YYYY" minlength="7" maxlength="7" required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')" oninput="setCustomValidity('')">
                                            <label class="text-md">Expiry Date</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input type="password" name="cc_ccv2" placeholder="&#9679;&#9679;&#9679;" minlength="3" maxlength="4" required oninvalid="this.setCustomValidity('Please Enter 3 digit CVV number on credit card number')" oninput="setCustomValidity('')">
                                            <label class="text-md">CVV</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input type="text" name="name" :value="name" placeholder="Name on card" required oninvalid="this.setCustomValidity('Please Enter full name on your card')" oninput="setCustomValidity('')">
                                    <label class="text-md">Name</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input type="text" name="address" :value="address" placeholder="Address line">
                                    <label class="text-md">Address</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group">
                                    <input type="text" name="city" :value="city" placeholder="City">
                                    <label class="text-md">City</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input type="text" name="state" :value="state" placeholder="State">
                                    <label class="text-md">State</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="input-group">
                                    {{ country_select }}
                                    <!-- <input type="text" name="Country" placeholder="Country"> -->
                                    <label class="text-md">Country</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input type="text" name="zip" :value="zip" placeholder="Zipcode">
                                    <label class="text-md">Zipcode</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12">
                                <input type="submit" value="Add Credit Card" class="btn btn-pay placeicon">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="d-none" id="EditInfo" data-toggle="modal" data-target="#edit-info"></div>
    <div class="modal fade" id="edit-info" style="display: none;" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">Update Contact Info</h4>
                </div>
                <div class="modal-body">
                    <form action="cart" method="post" class="form-card" id="EditInfo">
                        <input type="hidden" name="csrf_token" :value="csrf_token">
                        <input type="hidden" name="action" value="edit_info">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input type="text" name="name" :value="cont_fields.name" placeholder="You Name">
                                    <label class="text-md">Name</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input type="text" name="address" :value="cont_fields.address" placeholder="Address line">
                                    <label class="text-md">Address</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input type="text" name="phone" :value="phone" placeholder="Phone Number" required>
                                    <label class="text-md">Phone</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group">
                                    <input type="text" name="city" :value="cont_fields.city" placeholder="City">
                                    <label class="text-md">City</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input type="text" name="state" :value="cont_fields.state" placeholder="State">
                                    <label class="text-md">State</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="input-group">
                                    {{ country_select }}
                                    <!-- <input type="text" name="Country" placeholder="Country"> -->
                                    <label class="text-md">Country</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input type="text" name="zip" :value="cont_fields.zip" placeholder="Zipcode">
                                    <label class="text-md">Zipcode</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12">
                                <input type="submit" value="Update Info" class="btn btn-pay placeicon">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="d-none" id="EditClick" data-toggle="modal" data-target="#edit-card"></div>
    <!--EDIT CC FORM IN MODAL-->
    <div class="modal fade" id="edit-card" style="display: none;" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">Update Credit Card</h4>
                </div>
                <div class="modal-body">
                    <form action="cart" method="post" class="form-card" id="EditForm">
                        <input type="hidden" name="csrf_token" :value="csrf_token">
                        <input type="hidden" name="action" value="edit">
                        <input id="e_cc_idx" type="hidden" name="idx" value="">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input type="text" id="e_exp" name="cc_exp" value="" placeholder="MM/YYYY" maxlength="7" required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')" oninput="setCustomValidity('')">
                                    <label class="text-md">Expiry Date</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input style="border: none;letter-spacing: 19.5px;font-weight: bold;" type="text" id="e_cr_no" name="cc" required readonly disabled>
                                    <label class="text-md">Card Number</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="input-group">
                                    <input style="border: none;" type="text" name="name" :value="cont_fields.name" placeholder="Name on card" disabled>
                                    <label class="text-md">Name</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input style="border: none;" type="text" name="address" :value="cont_fields.address" placeholder="Address line" disabled>
                                    <label class="text-md">Address</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group">
                                    <input style="border: none;" type="text" name="city" :value="cont_fields.city" placeholder="City" disabled>
                                    <label class="text-md">City</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input style="border: none;" type="text" name="state" :value="cont_fields.state" placeholder="State" disabled>
                                    <label class="text-md">State</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="input-group">
                                    <input style="border: none;" :value="cont_fields.country" type="text" name="Country" placeholder="Country">
                                    <label class="text-md">Country</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input style="border: none;" type="text" name="zip" :value="cont_fields.zip" placeholder="Zipcode" disabled>
                                    <label class="text-md">Zipcode</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12">
                                <input type="submit" value="Update Card" class="btn btn-pay placeicon">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <form id="defaultpymt" action="cart" method="post">
        <input type="hidden" name="csrf_token" :value="csrf_token">
        <input type="hidden" name="action" value="default">
        <input id="defaultpymt_method" type="hidden" name="payment_method" value="">
        <input id="cc_auto_update" type="hidden" name="cc_auto_update" value="">
    </form>
    <form id="deleteForm" action="cart" method="POST">
        <input id="csrf_token" type="hidden" name="csrf_token" :value="csrf_token">
        <input type="hidden" name="action" value="delete">
        <input id="cc_idx" type="hidden" name="idx" value="">
    </form>
</template>
