<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from 'pinia';
import { useAccountStore, useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
const accountStore = useAccountStore();
const { breadcrums, page_heading } = storeToRefs(layoutStore);
layoutStore.setPageHeading('Payment Types');
layoutStore.setBreadcrums({'/home': 'Home', '': 'Payment Types'});

const { loading, error, custid, ima, link, data, ip } = storeToRefs(accountStore);
const country_select = ref('');
const pymt_method = ref('paypal');
const selected_cc = ref('');
const trigger_click = ref(false);
const current_cc_id = ref(0);
const verify_display = ref(undefined);
const cc_auto_checked = ref(false);
const cont_fields = {
    name: ref('')
};

function mounted() {
    if (trigger_click.value) {
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
        html: '<p>Are you sure want to remove your creditcard <br><b>'+data.value.ccs[cc_id]['mask_cc']+'</b> ?</p>',
        preConfirm: () => {
            $('#deleteForm').submit();
        }
    });
}

function edit_card(cc_id = 0)
{
    $("#e_cc_idx").val(cc_id);
    $("#e_cr_no").val(data.value.ccs[cc_id]['mask_cc']);
    $("#e_exp").val(data.value.ccs[cc_id]['cc_exp']);
    $("#EditForm select[name='country']").attr('disabled','disabled');
    $('#EditClick').trigger('click');
}

function verify_card(cc_id = 0)
{
    $(".v_cc_idx").val(cc_id);
    verify_display.value = $('#unver_'+cc_id).attr("data-step");
    if ( typeof verify_display.value === 'undefined') {
        $('#VerifyFormStep1').trigger('click');
    } else if(verify_display.value == 'step1') {
        $('#VerifyFormStep1').trigger('click');
    } else if(verify_display.value == 'step2') {
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
    html: '<p>Are you sure want to remove your creditcard <br><b>' + data.value.ccs[cc_id]['mask_cc'] + '</b> ?</p>',
    preConfirm: () => {
      $('#deleteForm').submit();
    }
  });
}

function editCard(cc_id = 0) {
  $("#e_cc_idx").val(cc_id);
  $("#e_cr_no").val(data.value.ccs[cc_id]['mask_cc']);
  $("#e_exp").val(data.value.ccs[cc_id]['cc_exp']);
  $("#EditForm select[name='country']").attr('disabled', 'disabled');
  $('#EditClick').trigger('click');
}

accountStore.load();
</script>

<template>
<div class="row justify-content-center">
    <div class="col-md-8">
        <div class="card-body text-red px-0">
            <strong class="pr-2"><i class="fa fa-lightbulb"></i> Note: </strong> All credit cards must be verified before they can be used. To verify them click the "Verify" button.
        </div>
    </div>
</div>
<div class="row justify-content-center">
    <div class="col-md-8 text-md">
        <div class="d-flex mb-4">
            <h5 class="w-50">Select Preferred Payment Method</h5>
            <div class="w-50 text-right">
                <a href="cart" class="btn btn-custom mr-2"><i class="fa fa-money" aria-hidden="true"></i> Cart</a>
                <a href="javascript:void(0);" class="btn btn-custom" data-toggle="modal" data-target="#add-card"><i class="fa fa-plus" aria-hidden="true"></i> Add New Card</a>
            </div>
        </div>`
        <div class="card shadow-sm shadow-hover">
            <div class="card-body icheck-success">
                <input id="paypal" name="r_pymt_method" value="paypal" class="form-check-input" type="radio" :checked="pymt_method === 'paypal'" @change="update_payment_method('paypal')">
                <label for="paypal"><i class="fa fa-paypal"></i> Pay with Paypal</label>
            </div>
        </div>

        <div v-if="data.ccs">
            <div v-for="(cc_detail, cc_id) in data.ccs" :key="cc_id" class="card shadow-sm shadow-hover">
                <div class="card-body icheck-success row">
                    <input :id="'cc-' + cc_id" :name="'r_pymt_method'" :value="'cc_' + cc_id" type="radio" class="form-check-input" :disabled="cc_detail.verified_cc === 'no'" :checked="pymt_method === 'cc' && selected_cc === cc_id" @change="updatePaymentMethod('cc' + cc_id)" />
                    <label :for="'cc-' + cc_id" class="col-md-4 pb-2"><i class="fa fa-credit-card-alt"></i> Credit Card {{ cc_detail.cc }}</label>
                    <div class="col-md-2 pb-2">
                        <span :class="{'text-green': cc_detail.verified_cc === 'yes', 'text-red': cc_detail.verified_cc === 'no'}" :title="cc_detail.verified_text">
                            <i :class="{'fa fa-check': cc_detail.verified_cc === 'yes', 'fa fa-times': cc_detail.verified_cc === 'no'}"></i> {{ cc_detail.verified }}
                        </span>
                    </div>
                    <div class="col-md-6 pb-2">
                        <a v-if="cc_detail.verified_cc === 'no'" class="btn btn-custom ml-4" href="javascript:void(0);" :title="cc_detail.unverified_text" :data-step="cc_detail.v_step ? cc_detail.v_step : 'step1'" @click="verifyCard(cc_id)" :id="'unver_' + cc_id">
                            <i class="fa fa-exclamation-triangle"></i> Verify
                        </a>
                        <a class="btn btn-custom ml-2" href="javascript:void(0);" :title="cc_detail.edit_text" @click="editCard(cc_id)">
                            <i class="fa fa-edit"></i> Edit
                        </a>
                        <a v-if="selected_cc !== cc_id" class="btn btn-custom ml-2" href="javascript:void(0);" :title="cc_detail.delete_text" @click="deleteCard(cc_id)">
                            <i class="fa fa-trash"></i> Delete
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow-sm shadow-hover">
            <div class="card-body">
                <div class="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                    <input type="checkbox" class="custom-control-input" id="customSwitch3" name="cc_auto" :checked="cc_auto_checked" onchange="update_payment_method(0,1)">
                    <label class="custom-control-label" for="customSwitch3">Automatically Charge Credit Card</label>
                </div>
            </div>
        </div>
    </div>
</div>
<!--ADD CC FORM IN MODAL-->
<div class="modal fade" id="add-card" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header mx-4">
                <h4 class="modal-title">Add CreditCard</h4>
            </div>
            <div class="modal-body">
                <form action="payment_types" method="post" class="form-card">
                    <input type="hidden" name="action" value="add">
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group">
                                <input type="text" id="cr_no" name="cc" placeholder="0000 0000 0000 0000" minlength="19" maxlength="19" required oninvalid="this.setCustomValidity('Please Enter valid 16 digit creditcard number')" oninput="setCustomValidity('')">
                                <label class="text-md">Card Number</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="row">
                                <div class="col-6">
                                    <div class="input-group"> <input type="text" id="exp" name="cc_exp" placeholder="MM/YYYY" minlength="7" maxlength="7" required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')" oninput="setCustomValidity('')"> <label class="text-md">Expiry Date</label> </div>
                                </div>
                                <div class="col-6">
                                    <div class="input-group"> <input type="password" name="cc_ccv2" placeholder="&#9679;&#9679;&#9679;" minlength="3" maxlength="4" required oninvalid="this.setCustomValidity('Please Enter 3 digit CVV number on creditcard number')" oninput="setCustomValidity('')"> <label class="text-md">CVV</label> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group"> <input type="text" name="name" v-model="cont_fields.name" placeholder="Name on card" required oninvalid="this.setCustomValidity('Please Enter full name on your card')" oninput="setCustomValidity('')"> <label class="text-md">Name</label> </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group"> <input type="text" name="address" v-model="cont_fields.address" placeholder="Address line"> <label class="text-md">Address</label> </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="input-group"> <input type="text" name="city" v-model="cont_fields.city" placeholder="City"> <label class="text-md">City</label> </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group"> <input type="text" name="state" v-model="cont_fields.state" placeholder="State"> <label class="text-md">State</label> </div>
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
                            <div class="input-group"> <input type="text" name="zip" v-model="cont_fields.zip" placeholder="Zipcode"> <label class="text-md">Zipcode</label> </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-md-12"> <input type="submit" value="Add Credit Card" class="btn btn-pay placeicon"> </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!--ADD CC FORM IN MODAL-->
<div class="d-none" id="EditClick" data-toggle="modal" data-target="#edit-card"></div>
<!--EDIT CC FORM IN MODAL-->
<div class="modal fade" id="edit-card" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header mx-4">
                <h4 class="modal-title">Update CreditCard</h4>
            </div>
            <div class="modal-body">
                <form action="payment_types" method="post" class="form-card" id="EditForm">
                    <input type="hidden" name="action" value="edit">
                    <input id="e_cc_idx" type="hidden" name="idx" value="">
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group">
                                <input type="text" id="e_cr_no" name="cc" required readonly disabled>
                                <label class="text-md">Card Number</label>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="row">
                                <div class="col-6">
                                    <div class="input-group"> <input type="text" id="e_exp" name="cc_exp" value="" placeholder="MM/YYYY" maxlength="7" required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')" oninput="setCustomValidity('')"> <label class="text-md">Expiry Date</label> </div>
                                </div>
                                <div class="col-6">
                                    <div class="input-group"> <input id="ccv2" type="password" name="cc_ccv2" placeholder="&#9679;&#9679;&#9679;" minlength="3" maxlength="4" oninvalid="this.setCustomValidity('Please Enter 3 digit CVV number on creditcard number')" oninput="setCustomValidity('')" disabled> <label class="text-md">CVV</label> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group"> <input type="text" name="name" v-model="cont_fields.name" placeholder="Name on card" disabled> <label class="text-md">Name</label> </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group"> <input type="text" name="address" v-model="cont_fields.address" placeholder="Address line" disabled> <label class="text-md">Address</label> </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="input-group"> <input type="text" name="city" v-model="cont_fields.city" placeholder="City" disabled> <label class="text-md">City</label> </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group"> <input type="text" name="state" v-model="cont_fields.state" placeholder="State" disabled> <label class="text-md">State</label> </div>
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
                            <div class="input-group"> <input type="text" name="zip" v-model="cont_fields.zip" placeholder="Zipcode" disabled> <label class="text-md">Zipcode</label> </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-md-12"> <input type="submit" value="Update Card" class="btn btn-pay placeicon"> </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!--EDIT CC FORM IN MODAL-->
<!-- VERIFY CC FORM -->
<div class="d-none" id="VerifyFormStep1" data-toggle="modal" data-target="#verify-card-1"></div>
<!--EDIT CC FORM IN MODAL-->
<div class="modal fade" id="verify-card-1" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header mx-4">
                <h4 class="modal-title">Credit Card Verification</h4>
            </div>
            <div class="modal-body">
                <form action="payment_types" method="post" class="form-card" id="VerifyForm">
                    <input type="hidden" name="action" value="verify">
                    <input class="v_cc_idx" id="v_cc_idx" type="hidden" name="idx" value="">
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <p>Verification is needed before your credit card is available for use. InterServer will charge your credit card with two amounts under $1.00 each. </p>
                            <p>These charges will show up on your billing statement within a couple of minutes, usually under pending transactions. If you do not see these charges, please contact your credit card issuer for more details.</p>
                            <p>These authorization charges are only for verification purposes and will be voided within 3-5 days, depending on your bank.</p>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="input-group"> <input type="password" name="cc_ccv2" required minlength="3" maxlength="4" oninvalid="this.setCustomValidity('Please Enter three digit CVV / CSV number on your card')" oninput="setCustomValidity('')"> <label class="text-md">Card Security Code (CVV / CSV)</label> </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <input id="tos_checkbox" name="terms" value="1" class="form-check-input ml-2" type="checkbox" style="width: auto;" required>
                            <label for="tos_checkbox" class="ml-4 pl-2"> I accept two temporary charges under $1.00 each.</label>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-md-12"> <input type="submit" value="Send Authorization" class="btn btn-pay placeicon"> </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- END VERIFY CC FORM -->
<!-- VERIFY CC FORM -->
<div class="d-none" id="VerifyClick" data-toggle="modal" data-target="#verify-card"></div>
<!--EDIT CC FORM IN MODAL-->
<div class="modal fade" id="verify-card" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header mx-4">
                <h4 class="modal-title">Credit Card Verification</h4>
            </div>
            <div class="modal-body">
                <form action="payment_types" method="post" class="form-card" id="VerifyForm">
                    <input type="hidden" name="action" value="verify">
                    <input class="v_cc_idx" id="v_cc_idx" type="hidden" name="idx" value="">
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <p>Verification is needed before your credit card is available for use. InterServer will charge your credit card with two amounts under $1.00 each. </p>
                            <p>Login to your credit cards online banking or call your bank to verify the two amounts charged. They often show under Pending Charges with your bank. These authorization charges will disappear in about 3-5 days depending on your bank.</p>
                            <p>Please enter the two amounts charged to your credit card. The values must be in USD</p>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <div class="row">
                                <div class="col-6">
                                    <div class="input-group"> <input type="text" name="cc_amount1"> <label class="text-md">Amount 1</label> </div>
                                </div>
                                <div class="col-6">
                                    <div class="input-group"> <input type="text" name="cc_amount2" > <label class="text-md">Amount 2</label> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-md-12"> <input type="submit" value="Complete Authorization" class="btn btn-pay placeicon"> </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12">
                            <strong>Note: </strong>Please note that the charges on your credit card statement may be in a different currency from the one required on the last confirmation page described above. If your credit card statement does not display the original transaction amounts in the required currency, you will have to contact your credit card company. They should be able to tell you the amounts of the two charges in the original currency.
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- END VERIFY CC FORM -->
<form id="VerifyFormDefault" action="payment_types" method="post">
    <input type="hidden" name="action" value="verify">
    <input class="v_cc_idx" type="hidden" name="idx" value="">
</form>
<form id="deleteForm" action="payment_types" method="POST">
    <input type="hidden" name="action" value="delete">
    <input id="cc_idx" type="hidden" name="idx" value="">
</form>
<form id="defaultpymt" action="payment_types" method="post">
    <input type="hidden" name="action" value="default">
    <input id="defaultpymt_method" type="hidden" name="payment_method" value="">
    <input id="cc_auto_update" type="hidden" name="cc_auto_update" value="">
</form>
</template>
