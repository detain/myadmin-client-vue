<script setup lang="ts">
import { ref, reactive, watch, onMounted, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useAccountStore } from '@/stores/account.store';
import { useSiteStore } from '@/stores/site.store';
import * as bootstrap from 'bootstrap';
import $ from 'jquery';
import Swal from 'sweetalert2';
const { t } = useI18n();
const siteStore = useSiteStore();
const accountStore = useAccountStore();
watchEffect(() => {
    siteStore.setPageHeading(t('billing.paymentTypes.title'));
    siteStore.setTitle(t('billing.paymentTypes.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('billing.paymentTypes.title')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();
const { data } = storeToRefs(accountStore);
const paymentMethod = ref('paypal');
const selectedCc = ref(0);
const modalCcIdx = ref(0);
const cc_auto_checked = ref(false);
const countries = ref({});
const cc_ccv2 = ref('');
const cc_amount1 = ref('');
const cc_amount2 = ref('');
const contFields = reactive<SimpleStringObj>({
    cc: '',
    cc_exp: '',
    name: '',
    address: '',
    phone: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
});

interface SimpleStringObj {
    [key: string]: any;
}

function deleteCardModal(cc_id = 0) {
    Swal.fire({
        icon: 'warning',
        title: '<h3>Delete CreditCard</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Delete it.',
        html: `<p>Are you sure want to remove your creditcard <br><b>${data.value.ccs[cc_id]['cc']}</b> ?</p>`,
        preConfirm: () => {
            try {
                fetchWrapper.delete(`${baseUrl}/billing/creditcards/${cc_id}`).then((response) => {
                    console.log('delete cc success', response);
                    accountStore.load();
                });
            } catch (error: any) {
                console.log('delete cc failed', error);
            }
        },
    });
}

function addCardSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/creditcards`, {
                cc: contFields.cc,
                cc_exp: contFields.cc_exp,
                name: contFields.name,
                address: contFields.address,
                city: contFields.city,
                state: contFields.state,
                zip: contFields.zip,
                country: contFields.country,
            })
            .then((response) => {
                console.log('add cc success', response);
                accountStore.load();
                bootstrap.Modal.getInstance(document.getElementById('add-card')!)?.hide();
            });
    } catch (error: any) {
        console.log('add cc failed', error);
    }
}

async function editCardSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/creditcards/${modalCcIdx.value}`, {
                cc_exp: contFields.cc_exp,
            })
            .then((response) => {
                console.log('edit cc success', response);
                accountStore.load();
                bootstrap.Modal.getInstance(document.getElementById('edit-card')!)?.hide();
            });
    } catch (error: any) {
        console.log('edit cc failed', error);
    }
}

async function verifyCardSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/creditcards/${modalCcIdx.value}/verify`, {
                cc_ccv2: cc_ccv2.value,
            })
            .then((response) => {
                console.log('verify cc success', response);
                accountStore.load();
                bootstrap.Modal.getInstance(document.getElementById('verify-card-1')!)?.hide();
                // After step 1, the card is now charged - open step 2 modal
                if (data.value.ccs[modalCcIdx.value]) {
                    data.value.ccs[modalCcIdx.value].verify_charged = true;
                    bootstrap.Modal.getOrCreateInstance(document.getElementById('verify-card')!).show();
                }
            });
    } catch (error: any) {
        console.log('verify cc failed', error);
    }
}

async function verifyAmountSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/creditcards/${modalCcIdx.value}/verify`, {
                cc_amount1: cc_amount1.value,
                cc_amount2: cc_amount2.value,
            })
            .then((response) => {
                console.log('verify amounts success', response);
                accountStore.load();
                bootstrap.Modal.getInstance(document.getElementById('verify-card')!)?.hide();
            });
    } catch (error: any) {
        console.log('verify amounts failed', error);
    }
}

async function addCardModal() {
    for (let key in contFields) {
        contFields[key] = data.value[key] && key != 'cc' && key != 'cc_exp' ? data.value[key] : '';
    }
}

function editCardModal(cc_id = 0) {
    modalCcIdx.value = cc_id;
    for (let key in contFields) {
        if (data.value.ccs[modalCcIdx.value][key]) {
            contFields[key] = data.value.ccs[modalCcIdx.value][key];
        } else if (data.value[key]) {
            contFields[key] = data.value[key];
        } else {
            contFields[key] = '';
        }
    }
    bootstrap.Modal.getOrCreateInstance(document.getElementById('edit-card')!).show();
}

async function verifyCard(cc_id = 0) {
    modalCcIdx.value = cc_id;
    if (!data.value.ccs[cc_id].verify_charged) {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('verify-card-1')!).show();
    } else {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('verify-card')!).show();
    }
}

async function updatePaymentMethod() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/payment_method`, {
                cc_auto: cc_auto_checked.value,
                payment_method: paymentMethod.value,
            })
            .then((response) => {
                console.log('update payment method success', response);
                accountStore.load();
            });
    } catch (error: any) {
        console.log('update payment method failed', error);
    }
}

async function formatCardNum(e: any) {
    if (e.target.value == e.target.lastValue) return;
    let caretPosition = e.target.selectionStart;
    const sanitizedValue = e.target.value.replace(/[^0-9]/gi, '');
    const parts: string[] = [];
    let i, len;
    for (i = 0, len = sanitizedValue.length; i < len; i += 4) {
        parts.push(sanitizedValue.substring(i, i + 4));
    }
    for (i = caretPosition - 1; i >= 0; i--) {
        const c = e.target.value[i];
        if (c < '0' || c > '9') {
            caretPosition--;
        }
    }
    caretPosition += Math.floor(caretPosition / 4);
    e.target.value = e.target.lastValue = parts.join('-');
    e.target.selectionStart = e.target.selectionEnd = caretPosition;
}

async function formatExpDate(e: any) {
    if (e.target.value == e.target.lastValue) return;
    let caretPosition = e.target.selectionStart;
    const sanitizedValue = e.target.value.replace(/[^0-9]/gi, '');
    const parts: string[] = [];
    let i;
    for (i = 0; i < 2; i += 2) {
        parts.push(sanitizedValue.substring(i, i + 2));
    }
    if (sanitizedValue.length >= 2) {
        for (let j = 2; j < sanitizedValue.length; j += 5) {
            parts.push(sanitizedValue.substring(j, j + 5));
        }
    }
    for (i = caretPosition - 1; i >= 0; i--) {
        const c = e.target.value[i];
        if (c < '0' || c > '9') {
            caretPosition--;
        }
    }
    caretPosition += Math.floor(caretPosition / 2);
    e.target.value = e.target.lastValue = parts.join('/');
    e.target.selectionStart = e.target.selectionEnd = caretPosition;
}

function onCardNumInput(e: any) {
    formatCardNum(e);
}

function onExpDateInput(e: any) {
    formatExpDate(e);
}

try {
    fetchWrapper.get(`${baseUrl}/account/countries`).then((response) => {
        countries.value = response;
    });
} catch (error: any) {
    console.log('error:', error);
}
accountStore.load();
//accountStore.getCountries();

watch(
    () => data.value,
    (val) => {
        if (!val) return;
        /* ------------------------- PAYMENT METHOD -------------------------- */
        if (val.payment_method === 'paypal') {
            paymentMethod.value = 'paypal';
        } else if (val.payment_method === 'cc') {
            // find matching credit card
            const match = Object.entries(val.ccs || {}).find(([, cc]) => cc.cc === val.cc && cc.cc_exp === val.cc_exp);
            if (match) {
                const [cc_id] = match;
                paymentMethod.value = `cc${cc_id}`;
                selectedCc.value = Number(cc_id);
            }
        }
        /* ------------------------- AUTO-CHARGE CHECKBOX -------------------------- */
        cc_auto_checked.value = val.cc_auto == '1';
    },
    { immediate: true }
);

onMounted(() => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card-body text-red px-0">
                <strong class="pe-2"><i class="far fa-lightbulb"></i> {{ t('billing.paymentTypes.ccNote') }}</strong>
            </div>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-8 text-md">
            <div class="d-flex mb-4">
                <h5 class="w-50">{{ t('billing.paymentTypes.selectPreferredMethod') }}</h5>
                <div class="w-50 text-end">
                    <router-link to="/cart" class="btn btn-custom me-2"><i class="fas fa-shopping-cart" aria-hidden="true"></i> {{ t('billing.cart.title') }}</router-link>
                    <a href="javascript:void(0);" class="btn btn-custom" data-bs-toggle="modal" data-bs-target="#add-card" @click="addCardModal"><i class="fas fa-plus" aria-hidden="true"></i> {{ t('billing.cart.addNewCard') }}</a>
                </div>
            </div>
            `
            <div class="card shadow-hover shadow-sm">
                <div class="card-body form-check">
                    <input id="paypal" v-model="paymentMethod" name="r_paymentMethod" value="paypal" class="form-check-input" type="radio" @change="updatePaymentMethod()" />
                    <label class="form-check-label" for="paypal"><i class="fab fa-paypal"></i> {{ t('billing.paymentTypes.payWithPaypal') }}</label>
                </div>
            </div>
            <div v-if="data.ccs">
                <div v-for="(cc_detail, cc_id) in data.ccs" :key="cc_id" class="card shadow-hover shadow-sm">
                    <div class="card-body form-check row">
                        <input :id="'cc-' + cc_id" v-model="paymentMethod" name="r_paymentMethod" :value="'cc' + cc_id" type="radio" class="form-check-input" :disabled="cc_detail.verified == false" @change="updatePaymentMethod()" />
                        <label :for="'cc-' + cc_id" class="col-md-4 form-check-label pb-2"><i class="fas fa-credit-card-alt"></i> {{ t('billing.paymentTypes.creditCard', { card: cc_detail.cc }) }}</label>
                        <div class="col-md-2 pb-2">
                            <span :class="{ 'text-green': cc_detail.verified == true, 'text-red': cc_detail.verified == false }" data-bs-toggle="tooltip" :title="cc_detail.verified ? t('billing.creditCard.verifiedTooltip') : t('billing.creditCard.notVerifiedTooltip')"> <i :class="{ 'fas fa-check': cc_detail.verified == true, 'fas fa-times': cc_detail.verified == false }"></i> {{ cc_detail.verified ? t('billing.creditCard.verified') : t('billing.creditCard.notVerified') }} </span>
                        </div>
                        <div class="col-md-6 pb-2">
                            <a v-if="cc_detail.verified == false" class="btn btn-custom ms-4" href="javascript:void(0);" data-bs-toggle="tooltip" :title="t('billing.creditCard.enableCardTooltip')" @click="verifyCard(Number(cc_id))"><i class="fas fa-exclamation-triangle"></i> {{ t('billing.creditCard.verifyButton') }}</a>
                            <a class="btn btn-custom ms-2" href="javascript:void(0);" data-bs-toggle="tooltip" :title="t('billing.creditCard.updateExpiration')" @click="editCardModal(Number(cc_id))"><i class="fas fa-edit"></i> {{ t('common.buttons.edit') }}</a>
                            <a v-if="selectedCc !== Number(cc_id)" class="btn btn-custom ms-2" href="javascript:void(0);" data-bs-toggle="tooltip" :title="t('billing.creditCard.removeCreditCard')" @click.prevent="deleteCardModal(Number(cc_id))"><i class="fas fa-trash"></i> {{ t('common.buttons.delete') }}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card shadow-hover shadow-sm">
                <div class="card-body">
                    <div class="form-check form-switch custom-switch-off-danger custom-switch-on-success">
                        <input id="customSwitch3" v-model="cc_auto_checked" type="checkbox" class="form-check-input" @change="updatePaymentMethod()" />
                        <label class="form-check-label" for="customSwitch3">{{ t('billing.cart.autoChargeCc') }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--ADD CC FORM IN MODAL-->
    <div id="add-card" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">{{ t('billing.creditCard.addCreditCard') }}</h4>
                </div>
                <div class="modal-body">
                    <form method="post" class="form-card" @submit.prevent="addCardSubmit">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input id="cr_no" v-model="contFields.cc" type="text" name="cc" placeholder="0000 0000 0000 0000" minlength="19" maxlength="19" required oninvalid="this.setCustomValidity('Please Enter valid 16 digit credit-card number')" oninput="setCustomValidity('')" />
                                    <label class="form-label text-md">Card Number</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input id="exp" v-model="contFields.cc_exp" type="text" name="cc_exp" placeholder="MM/YYYY" minlength="7" maxlength="7" required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')" oninput="setCustomValidity('')" />
                                            <label class="form-label text-md">Expiry Date</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input type="password" name="cc_ccv2" placeholder="&#9679;&#9679;&#9679;" minlength="3" maxlength="4" required oninvalid="this.setCustomValidity('Please Enter 3 digit CVV number on credit-card number')" oninput="setCustomValidity('')" />
                                            <label class="form-label text-md">CVV</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.name" type="text" name="name" placeholder="Name on card" required oninvalid="this.setCustomValidity('Please Enter full name on your card')" oninput="setCustomValidity('')" />
                                    <label class="form-label text-md">Name</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.address" type="text" name="address" placeholder="Address line" />
                                    <label class="form-label text-md">Address</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.city" type="text" name="city" placeholder="City" />
                                    <label class="form-label text-md">City</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.state" type="text" name="state" placeholder="State" />
                                    <label class="form-label text-md">State</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="input-group">
                                    <select v-model="contFields.country" name="country" class="form-select" style="padding-right: 5px; vertical-align: middle; float: right">
                                        <option v-for="(name, iso2, index) in countries" :key="index" :value="iso2">{{ name }}</option>
                                    </select>
                                    <label class="form-label text-md">Country</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.zip" type="text" name="zip" placeholder="Zipcode" />
                                    <label class="form-label text-md">Zipcode</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12"><input type="submit" value="Add Credit Card" class="btn btn-pay placeicon" /></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!--ADD CC FORM IN MODAL-->
    <!--EDIT CC FORM IN MODAL-->
    <div id="edit-card" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">{{ t('billing.creditCard.updateCreditCard') }}</h4>
                </div>
                <div class="modal-body">
                    <form id="EditForm" method="post" class="form-card" @submit.prevent="editCardSubmit">
                        <input id="e_cc_idx" v-model="modalCcIdx" type="hidden" name="idx" />
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input id="e_cr_no" v-model="contFields.cc" type="text" name="cc" required readonly disabled />
                                    <label class="form-label text-md">Card Number</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input id="e_exp" v-model="contFields.cc_exp" type="text" name="cc_exp" placeholder="MM/YYYY" maxlength="7" required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')" oninput="setCustomValidity('')" />
                                            <label class="form-label text-md">Expiry Date</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input id="ccv2" type="password" name="cc_ccv2" placeholder="&#9679;&#9679;&#9679;" minlength="3" maxlength="4" oninvalid="this.setCustomValidity('Please Enter 3 digit CVV number on credit-card number')" oninput="setCustomValidity('')" disabled />
                                            <label class="form-label text-md">CVV</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.name" type="text" name="name" placeholder="Name on card" disabled />
                                    <label class="form-label text-md">Name</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.address" type="text" name="address" placeholder="Address line" disabled />
                                    <label class="form-label text-md">Address</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.city" type="text" name="city" placeholder="City" disabled />
                                    <label class="form-label text-md">City</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.state" type="text" name="state" placeholder="State" disabled />
                                    <label class="form-label text-md">State</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="input-group">
                                    <select v-model="contFields.country" name="country" class="form-select" style="padding-right: 5px; vertical-align: middle; float: right" disabled>
                                        <option v-for="(name, iso2, index) in countries" :key="index" :value="iso2">{{ name }}</option>
                                    </select>
                                    <label class="form-label text-md">Country</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.zip" type="text" name="zip" placeholder="Zipcode" disabled />
                                    <label class="form-label text-md">Zipcode</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12"><input type="submit" value="Update Card" class="btn btn-pay placeicon" /></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!--EDIT CC FORM IN MODAL-->
    <!-- VERIFY CC FORM -->
    <div id="verify-card-1" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">{{ t('billing.creditCard.verification') }}</h4>
                </div>
                <div class="modal-body">
                    <form id="VerifyForm" method="post" class="form-card" @submit.prevent="verifyCardSubmit">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <p>{{ t('billing.creditCard.verifyIntroStep1') }}</p>
                                <p>{{ t('billing.creditCard.verifyBillingStatement') }}</p>
                                <p>{{ t('billing.creditCard.verifyVoidNotice') }}</p>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="cc_ccv2" type="password" name="cc_ccv2" required minlength="3" maxlength="4" oninvalid="this.setCustomValidity('Please Enter three digit CVV / CSV number on your card')" oninput="setCustomValidity('')" />
                                    <label class="form-label text-md">{{ t('billing.creditCard.securityCode') }}</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <input id="tos_checkbox" name="terms" value="1" class="form-check-input ms-2" type="checkbox" style="width: auto" required />
                                <label for="tos_checkbox" class="ms-4 ps-2"> {{ t('billing.creditCard.acceptTempCharges') }}</label>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12"><input type="submit" :value="t('billing.creditCard.sendAuthorization')" class="btn btn-pay placeicon" /></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- END VERIFY CC FORM -->
    <!-- VERIFY CC FORM -->
    <div id="verify-card" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">{{ t('billing.creditCard.verification') }}</h4>
                </div>
                <div class="modal-body">
                    <form id="VerifyForm" method="post" class="form-card" @submit.prevent="verifyAmountSubmit">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <p>{{ t('billing.creditCard.verifyIntroStep1') }}</p>
                                <p>{{ t('billing.creditCard.verifyBankLogin') }}</p>
                                <p>{{ t('billing.creditCard.enterAmountsPrompt') }}</p>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input v-model="cc_amount1" type="text" name="cc_amount1" />
                                            <label class="form-label text-md">{{ t('billing.creditCard.amount1') }}</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input v-model="cc_amount2" type="text" name="cc_amount2" />
                                            <label class="form-label text-md">{{ t('billing.creditCard.amount2') }}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12"><input type="submit" :value="t('billing.creditCard.completeAuthorization')" class="btn btn-pay placeicon" /></div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12"><strong>{{ t('billing.creditCard.currencyNote') }}</strong></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- END VERIFY CC FORM -->
</template>
